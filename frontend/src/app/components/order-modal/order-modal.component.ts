import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderItem } from '../../services/order.service';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Order Details</h2>
            <button (click)="close()" class="text-gray-400 hover:text-gray-600 transition-colors">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Order Header -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                  <p class="text-sm text-gray-500">Order Number</p>
                  <p class="font-semibold text-sm text-gray-900">{{ order()?.orderNumber }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [class]="getStatusClass(order()?.orderStatus)">
                    {{ order()?.orderStatus ? (order()?.orderStatus?.charAt(0)?.toUpperCase() || '') + (order()?.orderStatus?.slice(1) || '') : '' }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total Amount</p>
                  <p class="font-semibold text-gray-900">₹{{ order()?.finalAmount }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Order Date</p>
                  <p class="font-semibold text-gray-900">{{ order()?.createdAt | date:'mediumDate' }}</p>
                </div>
              </div>
            </div>

            <!-- Customer Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <p class="text-sm text-gray-500">Name</p>
                  <p class="font-medium text-gray-900">{{ getUserName(order()) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="font-medium text-gray-900">N/A</p>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="font-medium text-gray-900">{{ order()?.shippingAddress?.fullName }}</p>
                <p class="text-gray-600">{{ order()?.shippingAddress?.street }}</p>
                <p class="text-gray-600">{{ order()?.shippingAddress?.city }}, {{ order()?.shippingAddress?.state }} {{ order()?.shippingAddress?.zipCode }}</p>
                <p class="text-gray-600">{{ order()?.shippingAddress?.country }}</p>
                @if (order()?.shippingAddress?.phone) {
                  <p class="text-gray-600 mt-1">Phone: {{ order()?.shippingAddress?.phone }}</p>
                }
              </div>
            </div>

            <!-- Order Items -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
              <div class="space-y-3">
                @for (item of order()?.items; track item.product) {
                  <div class="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center space-x-4">
                      <img [src]="getImageUrl(item.image)" 
                           [alt]="item.name"
                           class="w-16 h-16 object-cover rounded-lg">
                      <div>
                        <p class="font-medium text-gray-900">{{ item.name }}</p>
                        <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                        <p class="text-sm text-gray-500">Price: ₹{{ item.price }} per item</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900">₹{{ item.price * item.quantity }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Order Summary -->
            <div class="border-t border-gray-200 pt-4">
              <div class="space-y-2">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{{ order()?.totalAmount || order()?.finalAmount }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Delivery Fee:</span>
                  <span>₹{{ order()?.shippingCost || 0 }}</span>
                </div>
                <div class="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{{ order()?.finalAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .bg-pending { @apply bg-yellow-100 text-yellow-800; }
    .bg-confirmed { @apply bg-blue-100 text-blue-800; }
    .bg-processing { @apply bg-purple-100 text-purple-800; }
    .bg-shipped { @apply bg-indigo-100 text-indigo-800; }
    .bg-delivered { @apply bg-green-100 text-green-800; }
    .bg-cancelled { @apply bg-red-100 text-red-800; }
  `]
})
export class OrderModalComponent {
  isOpen = signal(false);
  order = signal<Order | null>(null);

  @Input() set orderData(value: Order | null) {
    this.order.set(value);
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  getUserName(order: Order | null): string {
    if (order?.user && typeof order.user === 'object') {
      return (order.user as any).name || order.shippingAddress?.fullName || 'Unknown';
    }
    return order?.shippingAddress?.fullName || 'Unknown';
  }

  getStatusClass(status?: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'bg-pending',
      confirmed: 'bg-confirmed',
      processing: 'bg-processing',
      shipped: 'bg-shipped',
      delivered: 'bg-delivered',
      cancelled: 'bg-cancelled'
    };
    return statusMap[status || ''] || 'bg-gray-100 text-gray-800';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }
}
