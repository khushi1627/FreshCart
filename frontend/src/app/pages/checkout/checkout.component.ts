import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      @if (cart()?.items?.length) {
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Checkout Form -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Shipping Address -->
            <div class="card p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                <i class="fas fa-map-marker-alt text-emerald-600 mr-2"></i>
                Shipping Address
              </h2>
              <form [formGroup]="checkoutForm" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" formControlName="fullName" class="input-field" placeholder="Enter your full name">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input type="text" formControlName="street" class="input-field" placeholder="Enter street address">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input type="text" formControlName="city" class="input-field" placeholder="City">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input type="text" formControlName="state" class="input-field" placeholder="State">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input type="text" formControlName="zipCode" class="input-field" placeholder="ZIP Code">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input type="text" formControlName="country" class="input-field" value="India">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" formControlName="phone" class="input-field" placeholder="Enter phone number">
                  </div>
                </div>
              </form>
            </div>

            <!-- Payment Method -->
            <div class="card p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                <i class="fas fa-credit-card text-emerald-600 mr-2"></i>
                Payment Method
              </h2>
              <form [formGroup]="checkoutForm">
                <div class="space-y-3">
                  <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                         [class.border-emerald-500]="checkoutForm.get('paymentMethod')?.value === 'cash'"
                         [class.bg-emerald-50]="checkoutForm.get('paymentMethod')?.value === 'cash'">
                    <input type="radio" formControlName="paymentMethod" value="cash" class="text-emerald-600">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-money-bill-wave text-emerald-600"></i>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">Cash on Delivery</p>
                        <p class="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                    </div>
                  </label>
                  <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                         [class.border-emerald-500]="checkoutForm.get('paymentMethod')?.value === 'card'"
                         [class.bg-emerald-50]="checkoutForm.get('paymentMethod')?.value === 'card'">
                    <input type="radio" formControlName="paymentMethod" value="card" class="text-emerald-600">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-credit-card text-blue-600"></i>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">Card Payment</p>
                        <p class="text-sm text-gray-500">Credit/Debit card</p>
                      </div>
                    </div>
                  </label>
                  <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                         [class.border-emerald-500]="checkoutForm.get('paymentMethod')?.value === 'upi'"
                         [class.bg-emerald-50]="checkoutForm.get('paymentMethod')?.value === 'upi'">
                    <input type="radio" formControlName="paymentMethod" value="upi" class="text-emerald-600">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-mobile-alt text-purple-600"></i>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">UPI</p>
                        <p class="text-sm text-gray-500">Google Pay, PhonePe, etc.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            <!-- Order Notes -->
            <div class="card p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                <i class="fas fa-sticky-note text-emerald-600 mr-2"></i>
                Order Notes (Optional)
              </h2>
              <form [formGroup]="checkoutForm">
                <textarea formControlName="notes" rows="3" class="input-field" 
                          placeholder="Any special instructions for delivery..."></textarea>
              </form>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-20">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div class="space-y-3 max-h-60 overflow-y-auto mb-4">
                @for (item of cart()?.items; track item._id) {
                  <div class="flex gap-3">
                    <img [src]="getImageUrl(item.product.images[0])"
                         [alt]="item.product.name"
                         class="w-12 h-12 object-cover rounded">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ item.product.name }}</p>
                      <p class="text-xs text-gray-500">{{ item.quantity }} × ₹{{ item.price }}</p>
                    </div>
                    <p class="text-sm font-medium text-gray-900">₹{{ item.price * item.quantity }}</p>
                  </div>
                }
              </div>

              <div class="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-medium">₹{{ subtotal() }}</span>
                </div>
                
                <!-- Free Delivery Progress -->
                @if (subtotal() < 100) {
                  <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
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

              <div class="border-t border-gray-200 mt-4 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-900">Total</span>
                  <span class="text-2xl font-bold text-emerald-600">₹{{ total() }}</span>
                </div>
              </div>

              <button (click)="placeOrder()" [disabled]="checkoutForm.invalid || isLoading()"
                      class="w-full btn-primary py-4 text-lg mt-6 disabled:opacity-50">
                @if (isLoading()) {
                  <i class="fas fa-spinner fa-spin mr-2"></i>Processing...
                } @else {
                  <span>Place Order</span>
                }
              </button>

              <p class="text-xs text-gray-500 text-center mt-4">
                <i class="fas fa-shield-alt text-emerald-600 mr-1"></i>
                Your information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-16">
          <i class="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p class="text-gray-500 mb-6">Add some items to proceed with checkout</p>
          <a routerLink="/products" class="btn-primary inline-flex items-center gap-2">
            <i class="fas fa-arrow-left"></i>
            <span>Continue Shopping</span>
          </a>
        </div>
      }
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cart = signal<any>(null);
  isLoading = signal(false);
  checkoutForm: FormGroup;

  subtotal = computed(() => this.cart()?.totalAmount || 0);
  shipping = computed(() => this.subtotal() >= 100 ? 0 : 50);
  tax = computed(() => Math.round(this.subtotal() * 0.05));
  total = computed(() => this.subtotal() + this.shipping() + this.tax());

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['India', Validators.required],
      phone: ['', Validators.required],
      paymentMethod: ['cash', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadCart();
    this.refreshUserData();
  }

  refreshUserData(): void {
    // Get fresh user data from backend to ensure we have the latest profile info
    this.http.get<any>(`http://localhost:5000/api/auth/profile`).subscribe({
      next: (response) => {
        if (response) {
          // Update localStorage with fresh data - backend returns user directly
          localStorage.setItem('user', JSON.stringify(response));
          this.authService.getCurrentUser().set(response);
          this.prefillUserData();
        }
      },
      error: () => {
        // If refresh fails, use existing data
        this.prefillUserData();
      }
    });
  }

  loadCart(): void {
    this.cartService.loadCart().subscribe({
      next: (cart) => this.cart.set(cart)
    });
  }

  prefillUserData(): void {
    const user = this.authService.getCurrentUser()();
    if (user?.address) {
      this.checkoutForm.patchValue({
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode,
        country: user.address.country
      });
    }
    if (user?.phone) {
      this.checkoutForm.patchValue({ phone: user.phone });
    }
    this.checkoutForm.patchValue({ fullName: user?.name || '' });
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) return;

    this.isLoading.set(true);
    const formValue = this.checkoutForm.value;

    const orderData = {
      shippingAddress: {
        fullName: formValue.fullName,
        street: formValue.street,
        city: formValue.city,
        state: formValue.state,
        zipCode: formValue.zipCode,
        country: formValue.country,
        phone: formValue.phone
      },
      paymentMethod: formValue.paymentMethod,
      notes: formValue.notes
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.router.navigate(['/orders'], { queryParams: { success: 'true' } });
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'assets/images/product-default.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }
}
