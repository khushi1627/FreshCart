import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <!-- Header Section -->
      <div class="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-shopping-bag text-white text-lg"></i>
              </div>
              <div>
                <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">My Orders</h1>
                <p class="text-gray-500 text-sm mt-1">Track and manage your orders</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm text-gray-500">Total Orders</p>
                <p class="text-2xl font-bold text-gray-900">{{ orders().length }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Success Message -->
        @if (successMessage()) {
          <div class="animate-fade-in mb-6">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-xl flex items-center gap-4 text-white">
              <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <i class="fas fa-check-circle text-2xl"></i>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-lg">Order placed successfully!</p>
                <p class="text-emerald-50 text-sm">Your order has been confirmed and is being processed</p>
              </div>
              <button (click)="successMessage.set(false)" class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <i class="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>
        }

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="space-y-6">
            @for (i of [1,2,3]; track i) {
              <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div class="animate-pulse">
                  <div class="flex items-center justify-between mb-4">
                    <div class="h-4 bg-gray-200 rounded w-32"></div>
                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div class="space-y-3">
                    <div class="h-3 bg-gray-200 rounded w-full"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Orders List -->
        @if (orders().length > 0 && !isLoading()) {
          <div class="space-y-6">
            @for (order of orders(); track order._id) {
              <div class="group animate-slide-in-left hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                  <!-- Order Header -->
                  <div class="relative bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-100">
                    <div class="absolute top-4 right-4">
                      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur"
                            [class.bg-yellow-400]="order.orderStatus === 'pending'"
                            [class.text-yellow-900]="order.orderStatus === 'pending'"
                            [class.bg-blue-400]="order.orderStatus === 'confirmed' || order.orderStatus === 'processing'"
                            [class.text-blue-900]="order.orderStatus === 'confirmed' || order.orderStatus === 'processing'"
                            [class.bg-purple-400]="order.orderStatus === 'shipped'"
                            [class.text-purple-900]="order.orderStatus === 'shipped'"
                            [class.bg-emerald-400]="order.orderStatus === 'delivered'"
                            [class.text-emerald-900]="order.orderStatus === 'delivered'"
                            [class.bg-red-400]="order.orderStatus === 'cancelled'"
                            [class.text-red-900]="order.orderStatus === 'cancelled'">
                        <i class="fas fa-circle text-xs animate-pulse-slow"></i>
                        {{ order.orderStatus | titlecase }}
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
                          <i class="fas fa-hashtag text-emerald-600"></i>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
                          <p class="font-bold text-gray-900">{{ order.orderNumber }}</p>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
                          <i class="fas fa-calendar text-emerald-600"></i>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                          <p class="font-semibold text-gray-900">{{ order.createdAt | date:'mediumDate' }}</p>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
                          <i class="fas fa-rupee-sign text-emerald-600"></i>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                          <p class="font-bold text-xl text-gray-900">₹{{ order.finalAmount }}</p>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
                          <i class="fas fa-box text-emerald-600"></i>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                          <p class="font-semibold text-gray-900">{{ order.items.length }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Order Items -->
                  <div class="p-6">
                    <div class="space-y-4">
                      @for (item of order.items; track item.product) {
                        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors group/item">
                          <div class="relative">
                            <img [src]="item.image ? getImageUrl(item.image) : 'assets/images/product-default.jpg'"
                                 [alt]="item.name"
                                 class="w-20 h-20 object-cover rounded-2xl shadow-sm group-hover/item:shadow-md transition-shadow">
                            <div class="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {{ item.quantity }}
                            </div>
                          </div>
                          <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 group-hover/item:text-emerald-600 transition-colors">{{ item.name }}</h3>
                            <div class="flex items-center gap-4 mt-2">
                              <span class="text-sm text-gray-500">Quantity: <span class="font-medium text-gray-700">{{ item.quantity }}</span></span>
                              <span class="text-sm text-gray-500">Price: <span class="font-medium text-gray-700">₹{{ item.price }}</span></span>
                              <span class="text-sm text-gray-500">Total: <span class="font-bold text-emerald-600">₹{{ item.price * item.quantity }}</span></span>
                            </div>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Order Footer -->
                    <div class="border-t border-gray-100 mt-6 pt-6">
                      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="space-y-2">
                          <div class="flex items-center gap-2 text-sm text-gray-600">
                            <i class="fas fa-map-marker-alt text-emerald-500"></i>
                            <span>Shipping to: {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}</span>
                          </div>
                          <div class="flex items-center gap-2 text-sm text-gray-600">
                            <i class="fas fa-credit-card text-emerald-500"></i>
                            <span>Payment: {{ order.paymentMethod | titlecase }}</span>
                          </div>
                        </div>
                        
                        <div class="flex gap-3">
                          <button (click)="downloadInvoice(order._id)"
                                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-medium hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <i class="fas fa-file-pdf"></i>
                            Download Invoice
                          </button>
                          @if (order.orderStatus === 'pending') {
                            <button (click)="cancelOrder(order._id)"
                                    class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-medium hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                              <i class="fas fa-times-circle"></i>
                              Cancel Order
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Enhanced Pagination -->
          @if (totalPages() > 1) {
            <div class="flex items-center justify-center mt-12">
              <div class="inline-flex items-center gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
                <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 1"
                        class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
                
                @for (page of pagesArray(); track page) {
                  <button (click)="changePage(page)"
                          [class.bg-gradient-to-r]="page === currentPage()"
                          [class.from-emerald-500]="page === currentPage()"
                          [class.to-teal-600]="page === currentPage()"
                          [class.text-white]="page === currentPage()"
                          [class.text-gray-700]="page !== currentPage()"
                          [class.hover:bg-emerald-50]="page !== currentPage()"
                          [class.font-bold]="page === currentPage()"
                          [class.shadow-lg]="page === currentPage()"
                          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300">
                    {{ page }}
                  </button>
                }
                
                <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() === totalPages()"
                        class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <i class="fas fa-chevron-right text-gray-600"></i>
                </button>
              </div>
            </div>
          }
        }

        <!-- Enhanced Empty State -->
        @if (orders().length === 0 && !isLoading()) {
          <div class="min-h-[600px] flex items-center justify-center">
            <div class="text-center max-w-md mx-auto animate-fade-in">
              <div class="relative mb-8">
                <div class="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                  <i class="fas fa-shopping-bag text-5xl text-emerald-600"></i>
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <i class="fas fa-times text-white text-sm"></i>
                </div>
              </div>
              
              <h3 class="text-3xl font-bold text-gray-900 mb-4">No orders yet</h3>
              <p class="text-gray-500 text-lg mb-8 leading-relaxed">Start your shopping journey and place your first order. We're excited to serve you!</p>
              
              <div class="space-y-4">
                <a routerLink="/products" class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg">
                  <i class="fas fa-arrow-left"></i>
                  Browse Products
                </a>
                <div class="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-truck text-emerald-500"></i>
                    <span>Fast Delivery</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-shield-alt text-emerald-500"></i>
                    <span>Secure Payment</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-undo text-emerald-500"></i>
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  successMessage = signal(false);
  isLoading = signal(false);

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['success']) {
        this.successMessage.set(true);
        setTimeout(() => this.successMessage.set(false), 5000);
      }
    });
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.orderService.getMyOrders(this.currentPage()).subscribe({
      next: (response) => {
        this.orders.set(response.orders);
        this.totalPages.set(response.pagination.pages);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadOrders();
  }

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.isLoading.set(true);
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: () => {
          this.isLoading.set(false);
          alert('Failed to cancel order. Please try again.');
        }
      });
    }
  }

  downloadInvoice(orderId: string): void {
    this.isLoading.set(true);
    this.orderService.downloadInvoice(orderId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        alert('Failed to download invoice. Please try again.');
      }
    });
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }
}
