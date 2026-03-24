import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-gray-300 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <i class="fas fa-leaf text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold text-white">FreshCart</span>
            </div>
            <p class="text-gray-400 text-sm">Your one-stop shop for fresh groceries delivered to your doorstep.</p>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/" class="hover:text-emerald-400 transition-colors">Home</a></li>
              <li><a routerLink="/products" class="hover:text-emerald-400 transition-colors">Products</a></li>
              <li><a routerLink="/cart" class="hover:text-emerald-400 transition-colors">Cart</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Categories</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/products" [queryParams]="{category: 'Vegetables'}" class="hover:text-emerald-400 transition-colors">Vegetables</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Fruits'}" class="hover:text-emerald-400 transition-colors">Fruits</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Dairy'}" class="hover:text-emerald-400 transition-colors">Dairy</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-sm">
              <li><i class="fas fa-envelope mr-2"></i> support&#64;freshcart.com</li>
              <li><i class="fas fa-phone mr-2"></i> +91 67878 76213</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 FreshCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
