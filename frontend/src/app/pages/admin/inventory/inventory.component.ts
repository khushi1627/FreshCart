import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { DashboardService, InventoryData } from '../../../services/dashboard.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p class="text-gray-500">Track stock levels and manage inventory</p>
      </div>

      @if (data(); as d) {
        <!-- Stock by Category -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Stock by Category</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Total Products</th>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Total Stock</th>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Avg Stock/Product</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (cat of d.stockByCategory; track cat._id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900">{{ cat._id }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ cat.totalProducts }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ cat.totalStock }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ cat.avgStock | number:'1.0-0' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Low Stock Alerts -->
        <div class="card overflow-hidden">
          <div class="p-6 border-b border-red-100 bg-red-50">
            <h2 class="text-xl font-bold text-red-700 flex items-center gap-2">
              <i class="fas fa-exclamation-triangle"></i>
              Low Stock Alerts ({{ d.lowStockItems.length }} items)
            </h2>
          </div>
          @if (d.lowStockItems.length > 0) {
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Current Stock</th>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Min Level</th>
                  <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (item of d.lowStockItems; track item._id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img [src]="getImageUrl(item.images[0])"
                             [alt]="item.name"
                             class="w-10 h-10 object-cover rounded">
                        <span class="font-medium text-gray-900">{{ item.name }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600">
                      {{ getCategoryName(item) }}
                    </td>
                    <td class="px-6 py-4">
                      <span class="font-bold" [class.text-red-600]="item.stock === 0" [class.text-orange-600]="item.stock > 0">
                        {{ item.stock }} {{ item.unit }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ item.minStockLevel }}</td>
                    <td class="px-6 py-4">
                      <a [routerLink]="['/admin/products/edit', item._id]" 
                         class="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                        Restock
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <div class="p-8 text-center">
              <i class="fas fa-check-circle text-emerald-500 text-4xl mb-3"></i>
              <p class="text-gray-600">No low stock items. All products have sufficient inventory.</p>
            </div>
          }
        </div>
      } @else {
        <div class="flex items-center justify-center py-20">
          <i class="fas fa-spinner fa-spin text-4xl text-emerald-600"></i>
        </div>
      }
    </div>
  `
})
export class InventoryComponent implements OnInit {
  data = signal<InventoryData | null>(null);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadInventoryData();
  }

  getCategoryName(item: any): string {
    if (typeof item.category === 'object' && item.category !== null) {
      return item.category.name || '-';
    }
    return item.category || '-';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }

  loadInventoryData(): void {
    this.dashboardService.getInventoryStats().subscribe({
      next: (data) => this.data.set(data)
    });
  }
}
