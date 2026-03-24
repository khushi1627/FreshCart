import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, Cart, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      @if (items().length > 0) {
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of items(); track item._id) {
              <div class="card p-4 flex gap-4">
                <a [routerLink]="['/product', item.product._id]" class="w-24 h-24 flex-shrink-0">
                  <img [src]="getImageUrl(item.product.images[0])"
                       [alt]="item.product.name"
                       class="w-full h-full object-cover rounded-lg">
                </a>
                <div class="flex-1 min-w-0">
                  <a [routerLink]="['/product', item.product._id]" class="block">
                    <h3 class="font-semibold text-gray-900 truncate">{{ item.product.name }}</h3>
                  </a>
                  <p class="text-sm text-gray-500 mt-1">{{ item.product.unit }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center border border-gray-300 rounded-lg">
                      <button (click)="updateQuantity(item, item.quantity - 1)"
                              [disabled]="item.quantity <= 1"
                              class="px-3 py-1 hover:bg-gray-100 disabled:opacity-50">
                        <i class="fas fa-minus text-xs"></i>
                      </button>
                      <span class="w-10 text-center font-medium">{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item, item.quantity + 1)"
                              [disabled]="item.quantity >= item.product.stock"
                              class="px-3 py-1 hover:bg-gray-100 disabled:opacity-50">
                        <i class="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-gray-900">₹{{ item.price * item.quantity }}</p>
                      <p class="text-sm text-gray-500">₹{{ item.price }} each</p>
                    </div>
                  </div>
                </div>
                <button (click)="removeItem(item.product._id)"
                        class="text-gray-400 hover:text-red-500 transition-colors self-start">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            }

            <div class="flex justify-between pt-4">
              <button (click)="clearCart()" class="text-red-600 hover:text-red-700 font-medium">
                <i class="fas fa-trash mr-2"></i>Clear Cart
              </button>
              <a routerLink="/products" class="text-emerald-600 hover:text-emerald-700 font-medium">
                <i class="fas fa-arrow-left mr-2"></i>Continue Shopping
              </a>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-20">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal ({{ totalItems() }} items)</span>
                  <span class="font-medium">₹{{ subtotal() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Shipping</span>
                  <span class="font-medium" [class.text-emerald-600]="shipping() === 0">
                    {{ shipping() === 0 ? 'FREE' : '₹' + shipping() }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Tax</span>
                  <span class="font-medium">₹{{ tax() }}</span>
                </div>
              </div>

              <div class="border-t border-gray-200 my-4 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-900">Total</span>
                  <span class="text-2xl font-bold text-emerald-600">₹{{ total() }}</span>
                </div>
                @if (subtotal() < 100) {
                  <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-2">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-emerald-700 font-medium text-xs">
                        <i class="fas fa-truck mr-1"></i>Add ₹{{ 100 - subtotal() }} more for FREE delivery!
                      </span>
                      <span class="text-emerald-600 text-xs font-bold">FREE</span>
                    </div>
                    <div class="w-full bg-emerald-100 rounded-full h-2">
                      <div class="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                           [style.width.%]="(subtotal() / 100) * 100"></div>
                    </div>
                  </div>
                }
              </div>

              <button (click)="checkout()" class="w-full btn-primary py-4 text-lg">
                Proceed to Checkout
              </button>

              <div class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <i class="fas fa-shield-alt text-emerald-600"></i>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-16">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-shopping-cart text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p class="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
          <a routerLink="/products" class="btn-primary inline-flex items-center gap-2">
            <i class="fas fa-arrow-left"></i>
            <span>Start Shopping</span>
          </a>
        </div>
      }
    </div>
  `
})
export class CartComponent implements OnInit {
  cart = signal<Cart | null>(null);
  items = computed(() => this.cart()?.items || []);
  
  totalItems = computed(() => this.cart()?.totalItems || 0);
  subtotal = computed(() => this.cart()?.totalAmount || 0);
  shipping = computed(() => this.subtotal() >= 100 ? 0 : 50);
  tax = computed(() => Math.round(this.subtotal() * 0.05));
  total = computed(() => this.subtotal() + this.shipping() + this.tax());

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.loadCart().subscribe({
      next: (cart) => this.cart.set(cart)
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1 || quantity > item.product.stock) return;
    
    this.cartService.updateCartItem(item.product._id, quantity).subscribe({
      next: (response) => this.cart.set(response.cart)
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => this.cart.set(response.cart)
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (response) => this.cart.set(response.cart)
    });
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'assets/images/product-default.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }
}
