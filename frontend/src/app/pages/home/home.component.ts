import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product, Category } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pt-24">
    <!-- Hero Section -->
    <section class="relative min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white overflow-hidden -mt-24">
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
        <div class="grid md:grid-cols-2 gap-12 items-center min-h-[600px]">
          <div class="space-y-8">
            <!-- Announcement Badge -->
            <div class="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 animate-fade-in">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span class="text-sm font-medium">🚀 Free delivery on orders over ₹500</span>
            </div>
            
            <!-- Main Heading -->
            <div class="space-y-4">
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span class="block animate-slide-in-left">Fresh Groceries</span>
                <span class="block text-emerald-100 animate-slide-in-left delay-200">Delivered to Your Door</span>
              </h1>
              <p class="text-lg md:text-xl text-emerald-100 max-w-lg animate-slide-in-left delay-400 leading-relaxed">
                Shop from our wide selection of fresh vegetables, fruits, dairy, and more. Quality guaranteed with every order!
              </p>
            </div>
            
            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-4 animate-slide-in-left delay-600">
              <a routerLink="/products" class="group relative px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3">
                <span class="relative z-10">Shop Now</span>
                <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a [routerLink]="['/products']" class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 inline-flex items-center gap-3">
                <i class="fas fa-th-large"></i>
                <span>Browse Products</span>
              </a>
            </div>
            
            <!-- Trust Indicators -->
            <div class="flex items-center gap-8 pt-4 animate-fade-in delay-800">
              <div class="flex items-center gap-2">
                <i class="fas fa-check-circle text-emerald-300"></i>
                <span class="text-sm">Fresh Quality</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-truck text-emerald-300"></i>
                <span class="text-sm">Fast Delivery</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-shield-alt text-emerald-300"></i>
                <span class="text-sm">Secure Payment</span>
              </div>
            </div>
          </div>
          
          <!-- Hero Image -->
          <div class="hidden md:block relative animate-fade-in">
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
              <div class="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-400 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500"></div>
              <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600" 
                   alt="Fresh vegetables and groceries" 
                   class="relative rounded-3xl shadow-2xl w-full object-cover h-[500px] transform group-hover:scale-105 transition-transform duration-500">
              <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-leaf text-emerald-600"></i>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">100% Organic</p>
                    <p class="text-sm text-gray-500">Farm Fresh Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i class="fas fa-chevron-down text-white/60 text-2xl"></i>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <i class="fas fa-th-large"></i>
            <span>Categories</span>
          </div>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">Explore our wide range of fresh products organized by category</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          @for (category of categories(); track category._id) {
            <a [routerLink]="['/products']" [queryParams]="{category: category._id}"
               class="group relative bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <!-- Background Gradient on Hover -->
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Icon Container -->
              <div class="relative w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-cyan-100 group-hover:scale-110 transition-transform duration-300">
                <img [src]="category.image || getCategoryImage(category.name)" 
                     [alt]="category.name"
                     class="w-full h-full object-cover">
              </div>
              
              <!-- Category Info -->
              <div class="relative">
                <h3 class="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">{{ category.name }}</h3>
                <p class="text-sm text-gray-500">{{ category.description | slice:0:25 }}...</p>
              </div>
              
              <!-- Hover Arrow -->
              <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i class="fas fa-arrow-right text-emerald-600"></i>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-20 bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-16">
          <div>
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              <i class="fas fa-star"></i>
              <span>Featured</span>
            </div>
            <h2 class="text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p class="text-gray-500 text-lg">Handpicked fresh items just for you</p>
          </div>
          <a routerLink="/products" class="group flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            View All 
            <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (product of featuredProducts(); track product._id) {
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
                
                <h3 class="font-semibold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-emerald-600 transition-colors">{{ product.name }}</h3>
                
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
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-20 bg-gradient-to-br from-emerald-600 to-teal-600 text-white relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
            <i class="fas fa-award"></i>
            <span>Why Choose Us</span>
          </div>
          <h2 class="text-4xl font-bold text-white mb-4">Why Choose FreshCart?</h2>
          <p class="text-emerald-100 max-w-2xl mx-auto text-lg">We are committed to providing the best shopping experience</p>
        </div>
        <div class="grid md:grid-cols-4 gap-8">
          <div class="group text-center">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              <i class="fas fa-leaf text-emerald-100 text-3xl group-hover:rotate-12 transition-transform duration-300"></i>
            </div>
            <h3 class="font-bold text-white mb-3 text-xl">Fresh Products</h3>
            <p class="text-emerald-100 leading-relaxed">100% fresh and organic products sourced daily from local farms</p>
          </div>
          <div class="group text-center">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              <i class="fas fa-truck text-emerald-100 text-3xl group-hover:rotate-12 transition-transform duration-300"></i>
            </div>
            <h3 class="font-bold text-white mb-3 text-xl">Fast Delivery</h3>
            <p class="text-emerald-100 leading-relaxed">Same day delivery for orders before 2 PM</p>
          </div>
          <div class="group text-center">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              <i class="fas fa-shield-alt text-emerald-100 text-3xl group-hover:rotate-12 transition-transform duration-300"></i>
            </div>
            <h3 class="font-bold text-white mb-3 text-xl">Quality Guaranteed</h3>
            <p class="text-emerald-100 leading-relaxed">We guarantee the quality of all our products</p>
          </div>
          <div class="group text-center">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              <i class="fas fa-headset text-emerald-100 text-3xl group-hover:rotate-12 transition-transform duration-300"></i>
            </div>
            <h3 class="font-bold text-white mb-3 text-xl">24/7 Support</h3>
            <p class="text-emerald-100 leading-relaxed">Round the clock customer support</p>
          </div>
        </div>
      </div>
    </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  categories = signal<Category[]>([]);
  featuredProducts = signal<Product[]>([]);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories)
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getProducts({ limit: 8 }).subscribe({
      next: (response) => this.featuredProducts.set(response.products)
    });
  }

  getCategoryName(category: Category | string): string {
    return typeof category === 'object' ? category.name : '';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }

  getCategoryImage(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes('bakery')) return 'assets/images/categories/bakery.jpg';
    if (name.includes('dairy')) return 'assets/images/categories/dairy.jpg';
    if (name.includes('grain')) return 'assets/images/categories/grains.jpg';
    if (name.includes('snack')) return 'assets/images/categories/snacks.jpg';
    if (name.includes('vegetable')) return 'assets/images/categories/vegetables.jpg';
    if (name.includes('fruit')) return 'assets/images/categories/fruits.jpg';
    return 'assets/images/category-default.jpg';
  }

  getVegetableCategoryId(): string {
    const vegCategory = this.categories().find(c => 
      c.name.toLowerCase().includes('vegetable')
    );
    return vegCategory?._id || '';
  }

  addToCart(productId: string): void {
    // Implementation in cart service
  }
}
