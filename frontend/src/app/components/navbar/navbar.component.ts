import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg border border-gray-100 fixed top-4 left-4 right-4 z-50 rounded-full">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center h-16 relative">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <i class="fas fa-leaf text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold text-gray-900">FreshCart</span>
            </a>
            <div class="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
              <a routerLink="/" class="nav-link" routerLinkActive="text-emerald-600" [routerLinkActiveOptions]="{exact: true}">Home</a>
              <a routerLink="/products" class="nav-link" routerLinkActive="text-emerald-600">Products</a>
            </div>
          </div>

          <div class="flex items-center gap-4">
            @if (isAuthenticated()) {
              <a routerLink="/cart" class="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <i class="fas fa-shopping-cart text-xl"></i>
                @if (cartCount() > 0) {
                  <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {{ cartCount() }}
                  </span>
                }
              </a>
              <div class="relative group">
                <button class="flex items-center gap-2 p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                  <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-emerald-600"></i>
                  </div>
                  <span class="hidden sm:block font-medium">{{ user()?.name }}</span>
                  <i class="fas fa-chevron-down text-sm"></i>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a routerLink="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-xl">
                    <i class="fas fa-user-circle mr-2"></i> Profile
                  </a>
                  <a routerLink="/orders" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <i class="fas fa-box mr-2"></i> My Orders
                  </a>
                  @if (isAdmin()) {
                    <a routerLink="/admin" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <i class="fas fa-cog mr-2"></i> Admin Dashboard
                    </a>
                  }
                  <button (click)="logout()" class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 last:rounded-b-xl">
                    <i class="fas fa-sign-out-alt mr-2"></i> Logout
                  </button>
                </div>
              </div>
            } @else {
              <a routerLink="/login" class="btn-secondary">Login</a>
              <a routerLink="/register" class="btn-primary">Register</a>
            }
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  isAuthenticated = computed(() => this.authService.getIsAuthenticated()());
  user = computed(() => this.authService.getCurrentUser()());
  isAdmin = computed(() => this.authService.isAdmin());
  cartCount = computed(() => this.cartService.getCartItemCount()());

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
