import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      @if (product(); as p) {
        <!-- Breadcrumb -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav class="flex items-center gap-2 text-sm">
            <a routerLink="/" class="text-gray-500 hover:text-emerald-600 transition-colors">Home</a>
            <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
            <a routerLink="/products" class="text-gray-500 hover:text-emerald-600 transition-colors">Products</a>
            <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
            <span class="text-gray-900 font-medium">{{ p.name }}</span>
          </nav>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <!-- Product Images -->
            <div class="space-y-6">
              <!-- Main Image -->
              <div class="relative group">
                <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-2xl">
                  <img [src]="p.images[selectedImage()] ? getImageUrl(p.images[selectedImage()]) : 'assets/images/product-default.jpg'" 
                       [alt]="p.name"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  
                  <!-- Discount Badge -->
                  @if (p.discount) {
                    <div class="absolute top-6 left-6 bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-2xl animate-pulse">
                      -{{ p.discount }}%
                    </div>
                  }
                  
                  <!-- Out of Stock Overlay -->
                  @if (p.stock === 0) {
                    <div class="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div class="text-center">
                        <i class="fas fa-times-circle text-white text-5xl mb-4"></i>
                        <span class="bg-white text-gray-900 px-8 py-4 rounded-3xl font-bold text-xl">Out of Stock</span>
                      </div>
                    </div>
                  }
                </div>
                
                <!-- Zoom Hint -->
                <div class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <i class="fas fa-search-plus text-gray-700"></i>
                </div>
              </div>

              <!-- Thumbnail Gallery -->
              @if (p.images.length > 1) {
                <div class="flex gap-3 overflow-x-auto pb-2">
                  @for (image of p.images; track $index) {
                    <button (click)="selectedImage.set($index)"
                            [class.ring-4]="selectedImage() === $index"
                            [class.ring-emerald-600]="selectedImage() === $index"
                            [class.scale-95]="selectedImage() !== $index"
                            [class.scale-100]="selectedImage() === $index"
                            class="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 hover:scale-105">
                      <img [src]="getImageUrl(image)" [alt]="p.name" class="w-full h-full object-cover">
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Product Info -->
            <div class="space-y-8">
              <!-- Header -->
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <span class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    <i class="fas fa-tag"></i>
                    {{ getCategoryName(p) }}
                  </span>
                  <div class="flex items-center gap-1">
                    @for (star of [1,2,3,4,5]; track star) {
                      <i class="fas fa-star text-lg" [class.text-yellow-400]="star <= (p.rating || 0)" [class.text-gray-300]="star > (p.rating || 0)"></i>
                    }
                    <span class="text-sm text-gray-500 ml-2">({{ p.rating || 0 }} reviews)</span>
                  </div>
                </div>
                
                <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{{ p.name }}</h1>
                
                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" [class.bg-emerald-500]="p.stock > 10" [class.bg-red-500]="p.stock <= 10 && p.stock > 0" [class.bg-gray-400]="p.stock === 0"></div>
                    <span class="font-medium" [class.text-emerald-600]="p.stock > 10" [class.text-red-600]="p.stock <= 10 && p.stock > 0" [class.text-gray-500]="p.stock === 0">
                      {{ p.stock > 0 ? (p.stock <= 10 ? 'Only ' + p.stock + ' left' : 'In Stock') : 'Out of Stock' }}
                    </span>
                  </div>
                  <span class="text-gray-400">|</span>
                  <span class="text-gray-600">
                    <i class="fas fa-truck mr-2 text-emerald-600"></i>
                    Free delivery over ₹100
                  </span>
                </div>
              </div>

              <!-- Price Section -->
              <div class="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-3xl p-6 border border-emerald-100">
                <div class="flex items-baseline gap-4">
                  <span class="text-4xl lg:text-5xl font-bold text-gray-900">₹{{ p.price }}</span>
                  @if (p.originalPrice) {
                    <span class="text-2xl text-gray-400 line-through">₹{{ p.originalPrice }}</span>
                    <div class="bg-red-500 text-white px-3 py-1 rounded-2xl font-bold">
                      Save ₹{{ p.originalPrice - p.price }}
                    </div>
                  }
                </div>
                @if (p.originalPrice) {
                  <p class="text-emerald-700 font-medium mt-2">
                    <i class="fas fa-percentage mr-2"></i>
                    You save {{ calculateDiscountPercentage(p.price, p.originalPrice) }}% on this product
                  </p>
                }
              </div>

              <!-- Description -->
              <div class="space-y-3">
                <h3 class="text-xl font-bold text-gray-900">Description</h3>
                <p class="text-gray-600 leading-relaxed text-lg">{{ p.description }}</p>
              </div>

              <!-- Quantity & Add to Cart -->
              @if (p.stock > 0) {
                <div class="space-y-6">
                  <!-- Quantity Selector -->
                  <div class="space-y-3">
                    <label class="text-lg font-semibold text-gray-900">Quantity</label>
                    <div class="flex items-center gap-4">
                      <div class="flex items-center bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
                        <button (click)="decrementQty()" [disabled]="quantity() <= 1"
                                class="w-14 h-14 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                          <i class="fas fa-minus text-gray-600"></i>
                        </button>
                        <span class="w-20 text-center text-xl font-bold">{{ quantity() }}</span>
                        <button (click)="incrementQty()" [disabled]="quantity() >= p.stock"
                                class="w-14 h-14 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                          <i class="fas fa-plus text-gray-600"></i>
                        </button>
                      </div>
                      <span class="text-gray-500">{{ p.stock }} available</span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-4">
                    <button (click)="addToCart()" [disabled]="isLoading()"
                            class="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-5 rounded-3xl text-lg font-bold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                      <i class="fas fa-shopping-cart"></i>
                      <span>{{ isLoading() ? 'Adding...' : 'Add to Cart' }}</span>
                    </button>
                    <button class="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <i class="far fa-heart text-gray-600 text-xl"></i>
                    </button>
                  </div>
                </div>
              } @else {
                <div class="bg-red-50 border-2 border-red-200 rounded-3xl p-6">
                  <div class="flex items-center gap-3">
                    <i class="fas fa-exclamation-circle text-red-500 text-2xl"></i>
                    <p class="text-red-700 font-bold text-lg">This product is currently out of stock</p>
                  </div>
                  <p class="text-red-600 mt-2">Check back later or explore similar products</p>
                </div>
              }

              <!-- Features Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div class="text-center p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-truck text-emerald-600 text-2xl"></i>
                  </div>
                  <p class="font-bold text-gray-900 mb-1">Free Delivery</p>
                  <p class="text-sm text-gray-500">Orders over ₹500</p>
                </div>
                <div class="text-center p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-undo text-emerald-600 text-2xl"></i>
                  </div>
                  <p class="font-bold text-gray-900 mb-1">Easy Returns</p>
                  <p class="text-sm text-gray-500">7 days return</p>
                </div>
                <div class="text-center p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-shield-alt text-emerald-600 text-2xl"></i>
                  </div>
                  <p class="font-bold text-gray-900 mb-1">100% Secure</p>
                  <p class="text-sm text-gray-500">Safe payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center">
            <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
              <i class="fas fa-spinner text-emerald-600 text-3xl"></i>
            </div>
            <p class="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  selectedImage = signal<number>(0);
  quantity = signal<number>(1);
  isLoading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  getCategoryName(product: Product): string {
    if (typeof product.category === 'object' && product.category !== null) {
      return (product.category as any).name || '';
    }
    return '';
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => this.product.set(product)
    });
  }

  incrementQty(): void {
    if (this.product() && this.quantity() < this.product()!.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    if (!this.product()) return;
    
    this.isLoading.set(true);
    this.cartService.addToCart(this.product()!._id, this.quantity()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/cart']);
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

  calculateDiscountPercentage(price: number, originalPrice: number): number {
    return Math.round((1 - price / originalPrice) * 100);
  }
}
