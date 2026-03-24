import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Product, Category, ProductFilters } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 -mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 mt-8 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              <i class="fas fa-shopping-bag"></i>
              <span>Products</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
            <p class="text-emerald-100 text-lg">Browse our collection of fresh groceries and organic products</p>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filters -->
          <aside class="w-full lg:w-80 flex-shrink-0">
            <div class="bg-white rounded-3xl shadow-lg p-8 sticky top-8 border border-gray-100">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-900">Filters</h3>
                <button (click)="clearFilters()" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2">
                  <i class="fas fa-redo"></i>
                  Clear All
                </button>
              </div>

              <!-- Search -->
              <div class="mb-8">
                <label class="block text-sm font-semibold text-gray-900 mb-3">Search Products</label>
                <div class="relative">
                  <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input type="text" [formControl]="searchControl" 
                         class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                         placeholder="Search for products...">
                </div>
              </div>

              <!-- Categories -->
              <div class="mb-8">
                <label class="block text-sm font-semibold text-gray-900 mb-4">Categories</label>
                <div class="space-y-3">
                  @for (category of categories(); track category._id) {
                    <label class="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-emerald-50 transition-colors">
                      <input type="radio" name="category" [value]="category._id"
                             [checked]="selectedCategory() === category._id"
                             (change)="selectCategory(category._id)"
                             class="w-5 h-5 text-emerald-600 focus:ring-emerald-500">
                      <span class="text-gray-700 font-medium">{{ category.name }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Price Range -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-4">Price Range</label>
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input type="number" [formControl]="minPriceControl" placeholder="Min"
                           class="w-full pl-8 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm">
                  </div>
                  <span class="text-gray-400 font-medium">—</span>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input type="number" [formControl]="maxPriceControl" placeholder="Max"
                           class="w-full pl-8 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm">
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Products Grid -->
          <div class="flex-1">
            <!-- Sort & Results Count -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <p class="text-gray-700 font-medium">
                  <span class="text-2xl font-bold text-gray-900">{{ totalProducts() }}</span>
                  <span class="text-gray-500">products found</span>
                </p>
              </div>
              <div class="flex items-center gap-3">
                <label class="text-sm font-medium text-gray-700">Sort by:</label>
                <select [formControl]="sortControl" class="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                  <option value="-createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            <!-- Products -->
            @if (products().length > 0) {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                @for (product of products(); track product._id) {
                  <div class="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100">
                    <a [routerLink]="['/product', product._id]" class="block relative">
                      <!-- Product Image Container -->
                      <div class="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img [src]="getImageUrl(product.images[0])"
                             [alt]="product.name"
                             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        
                        <!-- Discount Badge -->
                        @if (product.discount) {
                          <div class="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                            -{{ product.discount }}%
                          </div>
                        }
                        
                        <!-- Out of Stock Overlay -->
                        @if (product.stock === 0) {
                          <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span class="bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold text-lg">Out of Stock</span>
                          </div>
                        }
                        
                        <!-- Quick Actions Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div class="absolute bottom-4 left-4 right-4 flex gap-2">
                            <button class="flex-1 bg-white text-gray-900 px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm">
                              <i class="fas fa-eye mr-2"></i>View
                            </button>
                            <button class="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm">
                              <i class="fas fa-cart-plus mr-2"></i>Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </a>
                    
                    <!-- Product Info -->
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-2">
                        <p class="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                          {{ getCategoryName(product.category) }}
                        </p>
                        <div class="flex items-center gap-1">
                          <i class="fas fa-star text-yellow-400 text-xs"></i>
                          <span class="text-xs text-gray-500">4.5</span>
                        </div>
                      </div>
                      
                      <h3 class="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-emerald-600 transition-colors">{{ product.name }}</h3>
                      <p class="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{{ product.description }}</p>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-2xl font-bold text-gray-900">₹{{ product.price }}</span>
                          @if (product.originalPrice) {
                            <span class="text-sm text-gray-400 line-through ml-2">₹{{ product.originalPrice }}</span>
                          }
                        </div>
                        <a [routerLink]="['/product', product._id]"
                           class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300">
                          <i class="fas fa-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                }
              </div>

              <!-- Pagination -->
              @if (totalPages() > 1) {
                <div class="flex items-center justify-center gap-2 mt-12">
                  <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 1"
                          class="w-12 h-12 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:border-emerald-500 hover:text-emerald-600">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  @for (page of pagesArray(); track page) {
                    <button (click)="changePage(page)"
                            [class.bg-emerald-600]="page === currentPage()"
                            [class.text-white]="page === currentPage()"
                            [class.bg-white]="page !== currentPage()"
                            [class.text-gray-700]="page !== currentPage()"
                            [class.border-emerald-600]="page === currentPage()"
                            [class.border-gray-300]="page !== currentPage()"
                            class="w-12 h-12 border-2 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-center font-medium">
                      {{ page }}
                    </button>
                  }
                  <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() === totalPages()"
                          class="w-12 h-12 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:border-emerald-500 hover:text-emerald-600">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              }
            } @else {
              <div class="text-center py-24">
                <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i class="fas fa-search text-gray-400 text-4xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p class="text-gray-500 text-lg mb-6">Try adjusting your filters or search query</p>
                <button (click)="clearFilters()" class="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<string>('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalProducts = signal<number>(0);
  
  searchControl = this.fb.control('');
  minPriceControl = this.fb.control('');
  maxPriceControl = this.fb.control('');
  sortControl = this.fb.control('-createdAt');

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory.set(params['category']);
      if (params['search']) this.searchControl.setValue(params['search']);
      this.loadProducts();
    });

    // Subscribe to filter changes
    this.searchControl.valueChanges.subscribe(() => this.loadProducts());
    this.minPriceControl.valueChanges.subscribe(() => this.loadProducts());
    this.maxPriceControl.valueChanges.subscribe(() => this.loadProducts());
    this.sortControl.valueChanges.subscribe(() => this.loadProducts());
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories)
    });
  }

  loadProducts(): void {
    const filters: ProductFilters = {
      page: this.currentPage(),
      limit: 12,
      sort: this.sortControl.value || '-createdAt'
    };

    if (this.selectedCategory()) filters.category = this.selectedCategory();
    if (this.searchControl.value) filters.search = this.searchControl.value;
    if (this.minPriceControl.value) filters.minPrice = Number(this.minPriceControl.value);
    if (this.maxPriceControl.value) filters.maxPrice = Number(this.maxPriceControl.value);

    this.productService.getProducts(filters).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.totalPages.set(response.pagination.pages);
        this.totalProducts.set(response.pagination.total);
      }
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
    this.loadProducts();
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.searchControl.setValue('');
    this.minPriceControl.setValue('');
    this.maxPriceControl.setValue('');
    this.currentPage.set(1);
    this.loadProducts();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  getCategoryName(category: Category | string): string {
    return typeof category === 'object' ? category.name : '';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'assets/images/product-default.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }

  addToCart(productId: string): void {
    // Implementation
  }
}
