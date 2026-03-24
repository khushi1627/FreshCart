import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../services/order.service';
import { OrderModalComponent } from '../../../components/order-modal/order-modal.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, OrderModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
          <p class="text-gray-500">Manage customer orders</p>
        </div>
        <select [ngModel]="selectedStatus()" (ngModelChange)="filterByStatus($event)" class="input-field w-auto">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      @if (orders().length > 0) {
        <div class="card overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Order #</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Customer</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Items</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Total</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (order of orders(); track order._id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-gray-900">{{ order.orderNumber }}</td>
                  <td class="px-6 py-4">
                    <div>
                      <p class="font-medium text-gray-900">{{ getUserName(order) }}</p>
                      <p class="text-sm text-gray-500">{{ order.shippingAddress.city }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ order.items.length }} items</td>
                  <td class="px-6 py-4 font-bold text-gray-900">₹{{ order.finalAmount }}</td>
                  <td class="px-6 py-4">
                    <select [ngModel]="order.orderStatus" (ngModelChange)="updateStatus(order._id, $event)"
                            class="text-sm border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ order.createdAt | date:'shortDate' }}</td>
                  <td class="px-6 py-4">
                    <button (click)="viewOrder(order)" class="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (totalPages() > 1) {
          <div class="flex items-center justify-center gap-2">
            <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 1"
                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <i class="fas fa-chevron-left"></i>
            </button>
            @for (page of pagesArray(); track page) {
              <button (click)="changePage(page)"
                      [class.bg-emerald-600]="page === currentPage()"
                      [class.text-white]="page === currentPage()"
                      class="px-4 py-2 border border-gray-300 rounded-lg">{{ page }}</button>
            }
            <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() === totalPages()"
                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        }
      } @else {
        <div class="text-center py-16 card">
          <i class="fas fa-shopping-bag text-gray-300 text-5xl mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p class="text-gray-500">Orders will appear here when customers make purchases</p>
        </div>
      }
    </div>

    <!-- Order Details Modal -->
    <app-order-modal #orderModal [orderData]="selectedOrder()"></app-order-modal>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  selectedStatus = signal('');
  selectedOrder = signal<Order | null>(null);
  @ViewChild('orderModal') orderModal!: OrderModalComponent;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders(this.currentPage(), 10, this.selectedStatus()).subscribe({
      next: (response) => {
        this.orders.set(response.orders);
        this.totalPages.set(response.pagination.pages);
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadOrders();
  }

  updateStatus(orderId: string, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => this.loadOrders()
    });
  }

  getUserName(order: Order): string {
    if (order.user && typeof order.user === 'object') {
      return (order.user as any).name || 'Unknown';
    }
    return 'Unknown';
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadOrders();
  }

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  viewOrder(order: Order): void {
    this.selectedOrder.set(order);
    setTimeout(() => {
      this.orderModal.open();
    }, 0);
  }
}
