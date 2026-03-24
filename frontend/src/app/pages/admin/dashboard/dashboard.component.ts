import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: any[];
  ordersByStatus: any[];
  salesByMonth: any[];
  topProducts: any[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-1">Overview of your grocery business</p>
      </div>

      @if (data(); as d) {
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Total Products</p>
                <p class="text-2xl font-bold text-gray-900">{{ d.stats.totalProducts }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-box text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Categories</p>
                <p class="text-2xl font-bold text-gray-900">{{ d.stats.totalCategories }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-tags text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Customers</p>
                <p class="text-2xl font-bold text-gray-900">{{ d.stats.totalCustomers }}</p>
              </div>
              <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-users text-emerald-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Total Orders</p>
                <p class="text-2xl font-bold text-gray-900">{{ d.stats.totalOrders }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-shopping-bag text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Revenue</p>
                <p class="text-2xl font-bold text-gray-900">₹{{ d.stats.totalRevenue | number:'1.0-0' }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-rupee-sign text-green-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div class="card p-6" [class.border-red-200]="d.stats.lowStockProducts > 0" [class.bg-red-50]="d.stats.lowStockProducts > 0">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm" [class.text-gray-500]="d.stats.lowStockProducts === 0" [class.text-red-600]="d.stats.lowStockProducts > 0">Low Stock Items</p>
                <p class="text-2xl font-bold" [class.text-gray-900]="d.stats.lowStockProducts === 0" [class.text-red-600]="d.stats.lowStockProducts > 0">{{ d.stats.lowStockProducts }}</p>
              </div>
              <div class="w-12 h-12 rounded-lg flex items-center justify-center" [class.bg-red-100]="d.stats.lowStockProducts > 0" [class.bg-gray-100]="d.stats.lowStockProducts === 0">
                <i class="fas fa-exclamation-triangle text-xl" [class.text-red-600]="d.stats.lowStockProducts > 0" [class.text-gray-600]="d.stats.lowStockProducts === 0"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Recent Orders -->
          <div class="lg:col-span-2 card overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-900">Recent Orders</h2>
              <a routerLink="/admin/orders" class="text-emerald-600 hover:text-emerald-700 font-medium">View All</a>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Order #</th>
                    <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                    <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                    <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  @for (order of d.recentOrders; track order._id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 font-medium text-gray-900">{{ order.orderNumber }}</td>
                      <td class="px-6 py-4 text-gray-600">{{ order.user?.name }}</td>
                      <td class="px-6 py-4 font-medium text-gray-900">₹{{ order.finalAmount }}</td>
                      <td class="px-6 py-4">
                        <span class="badge" [class]="getStatusClass(order.orderStatus)">
                          {{ order.orderStatus | titlecase }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top Products -->
          <div class="card overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-xl font-bold text-gray-900">Top Products</h2>
            </div>
            <div class="p-6 space-y-4">
              @for (product of d.topProducts; track product._id) {
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="font-bold text-gray-600">{{ $index + 1 }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ product.name }}</p>
                    <p class="text-sm text-gray-500">{{ product.totalSold }} sold</p>
                  </div>
                  <p class="font-bold text-gray-900">₹{{ product.revenue }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a routerLink="/admin/products/add" class="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-plus text-emerald-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Add Product</p>
              <p class="text-sm text-gray-500">Create new product</p>
            </div>
          </a>
          <a routerLink="/admin/categories" class="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-tags text-blue-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Categories</p>
              <p class="text-sm text-gray-500">Manage categories</p>
            </div>
          </a>
          <a routerLink="/admin/inventory" class="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-warehouse text-orange-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Inventory</p>
              <p class="text-sm text-gray-500">Check stock levels</p>
            </div>
          </a>
          <a routerLink="/admin/orders" class="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-clipboard-list text-purple-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Orders</p>
              <p class="text-sm text-gray-500">View all orders</p>
            </div>
          </a>
        </div>
      } @else {
        <div class="flex items-center justify-center py-20">
          <i class="fas fa-spinner fa-spin text-4xl text-emerald-600"></i>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  data = signal<DashboardData | null>(null);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.http.get<DashboardData>(`${this.apiUrl}/stats`).subscribe({
      next: (data: DashboardData) => this.data.set(data)
    });
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }
}
