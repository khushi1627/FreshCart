import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Products</h1>
          <p class="text-gray-500">Manage your grocery products</p>
        </div>
        <a routerLink="/admin/products/add" class="btn-primary flex items-center gap-2">
          <i class="fas fa-plus"></i>
          <span>Add Product</span>
        </a>
      </div>

      @if (products().length > 0) {
        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Product</th>
                  <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                  <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                  <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Stock</th>
                  <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (product of products(); track product._id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img [src]="getImageUrl(product.images[0])"
                             [alt]="product.name"
                             class="w-12 h-12 object-cover rounded-lg">
                        <div>
                          <p class="font-medium text-gray-900">{{ product.name }}</p>
                          <p class="text-sm text-gray-500">{{ product.unit }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600">
                      {{ getCategoryName(product) }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-900">₹{{ product.price }}</span>
                        @if (product.originalPrice) {
                          <span class="text-sm text-gray-400 line-through">₹{{ product.originalPrice }}</span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="getStockClass(product)">
                        {{ product.stock }} {{ product.unit }}
                      </span>
                      @if (product.stock <= product.minStockLevel) {
                        <span class="ml-2 text-xs text-red-600 font-medium">Low</span>
                      }
                    </td>
                    <td class="px-6 py-4">
                      <span class="badge" [class]="product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'">
                        {{ product.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <a [routerLink]="['/admin/products/edit', product._id]"
                           class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                          <i class="fas fa-edit text-sm"></i>
                        </a>
                        <button (click)="deleteProduct(product._id)"
                                class="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                          <i class="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <div class="text-center py-16 card">
          <i class="fas fa-box text-gray-300 text-5xl mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-500 mb-6">Start by adding your first product</p>
          <a routerLink="/admin/products/add" class="btn-primary inline-flex items-center gap-2">
            <i class="fas fa-plus"></i>
            <span>Add Product</span>
          </a>
        </div>
      }
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  products = signal<Product[]>([]);

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (response) => this.products.set(response.products)
    });
  }

  getStockClass(product: Product): string {
    if (product.stock === 0) return 'text-red-600 font-medium';
    if (product.stock <= product.minStockLevel) return 'text-orange-600 font-medium';
    return 'text-emerald-600 font-medium';
  }

  getCategoryName(product: Product): string {
    if (typeof product.category === 'object' && product.category !== null) {
      return (product.category as any).name || '-';
    }
    return '-';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://via.placeholder.com/50';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts()
      });
    }
  }
}
