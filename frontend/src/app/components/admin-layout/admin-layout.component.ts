import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-sm h-screen sticky top-0">
        <div class="p-6 border-b border-gray-100">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-leaf text-white text-lg"></i>
            </div>
            <span class="text-xl font-bold text-gray-900">FreshCart</span>
          </a>
        </div>
        <nav class="p-4 space-y-1">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-emerald-50 text-emerald-600" 
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <i class="fas fa-chart-line w-5"></i>
            <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="bg-emerald-50 text-emerald-600"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <i class="fas fa-box w-5"></i>
            <span class="font-medium">Products</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="bg-emerald-50 text-emerald-600"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <i class="fas fa-tags w-5"></i>
            <span class="font-medium">Categories</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="bg-emerald-50 text-emerald-600"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <i class="fas fa-shopping-bag w-5"></i>
            <span class="font-medium">Orders</span>
          </a>
          <a routerLink="/admin/inventory" routerLinkActive="bg-emerald-50 text-emerald-600"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <i class="fas fa-warehouse w-5"></i>
            <span class="font-medium">Inventory</span>
          </a>
        </nav>
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button (click)="logout()" class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <i class="fas fa-sign-out-alt w-5"></i>
            <span class="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <div class="p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
