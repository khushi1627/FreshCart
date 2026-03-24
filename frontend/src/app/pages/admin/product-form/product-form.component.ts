import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Category } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/admin/products" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-arrow-left text-xl"></i>
        </a>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ isEdit() ? 'Edit' : 'Add' }} Product</h1>
          <p class="text-gray-500">{{ isEdit() ? 'Update product details' : 'Create a new product' }}</p>
        </div>
      </div>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="card p-8 space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input type="text" formControlName="name" class="input-field" placeholder="Enter product name">
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea formControlName="description" rows="4" class="input-field" placeholder="Enter product description"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select formControlName="category" class="input-field">
              <option value="">Select Category</option>
              @for (cat of categories(); track cat._id) {
                <option [value]="cat._id">{{ cat.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
            <select formControlName="unit" class="input-field">
              <option value="piece">Piece</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="litre">Litre</option>
              <option value="ml">Millilitre (ml)</option>
              <option value="pack">Pack</option>
              <option value="bunch">Bunch</option>
              <option value="dozen">Dozen</option>
              <option value="box">Box</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
            <input type="number" formControlName="price" class="input-field" placeholder="0.00">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
            <input type="number" formControlName="originalPrice" class="input-field" placeholder="0.00">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
            <input type="number" formControlName="stock" class="input-field" placeholder="0">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert Level *</label>
            <input type="number" formControlName="minStockLevel" class="input-field" placeholder="10">
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
          <div class="flex flex-wrap gap-4">
            @for (preview of imagePreviews(); track $index) {
              <div class="relative w-24 h-24">
                <img [src]="preview" class="w-full h-full object-cover rounded-lg">
                <button type="button" (click)="removeImage($index)" 
                        class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            }
            <label class="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
              <i class="fas fa-plus text-gray-400 text-xl mb-1"></i>
              <span class="text-xs text-gray-500">Add Image</span>
              <input type="file" (change)="onFileSelected($event)" accept="image/*" multiple class="hidden">
            </label>
          </div>
          <p class="text-sm text-gray-500 mt-2">Upload product images (max 5 images)</p>
        </div>

        <div class="flex items-center gap-3">
          <input type="checkbox" formControlName="isActive" id="isActive" class="w-4 h-4 text-emerald-600 rounded">
          <label for="isActive" class="text-sm font-medium text-gray-700">Active Product</label>
        </div>

        @if (message()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <i class="fas fa-exclamation-circle text-red-500"></i>
            <p class="text-red-600 text-sm">{{ message() }}</p>
          </div>
        }

        <div class="flex gap-4 pt-4">
          <button type="button" routerLink="/admin/products" class="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" [disabled]="productForm.invalid || isLoading()"
                  class="btn-primary flex-1 disabled:opacity-50">
            @if (isLoading()) {
              <i class="fas fa-spinner fa-spin mr-2"></i>Saving...
            } @else {
              <span>{{ isEdit() ? 'Update' : 'Create' }} Product</span>
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories = signal<Category[]>([]);
  imagePreviews = signal<string[]>([]);
  selectedFiles: File[] = [];
  isEdit = signal(false);
  isLoading = signal(false);
  message = signal('');
  productId = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      originalPrice: [''],
      stock: ['', [Validators.required, Validators.min(0)]],
      minStockLevel: [10, [Validators.required, Validators.min(0)]],
      unit: ['piece', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories)
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          category: typeof product.category === 'object' ? product.category._id : product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
          minStockLevel: product.minStockLevel,
          unit: product.unit,
          isActive: product.isActive
        });
        if (product.images) {
          this.imagePreviews.set(product.images.map(img => this.getImageUrl(img)));
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      if (this.selectedFiles.length + files.length > 5) {
        this.message.set('Maximum 5 images allowed');
        return;
      }
      
      files.forEach(file => {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.update(previews => [...previews, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.update(previews => previews.filter((_, i) => i !== index));
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.isLoading.set(true);
    this.message.set('');

    const formData = new FormData();
    const formValue = this.productForm.value;
    
    // Convert numeric fields to numbers
    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('category', formValue.category);
    formData.append('price', Number(formValue.price).toString());
    if (formValue.originalPrice) {
      formData.append('originalPrice', Number(formValue.originalPrice).toString());
    }
    formData.append('stock', Number(formValue.stock).toString());
    formData.append('minStockLevel', Number(formValue.minStockLevel).toString());
    formData.append('unit', formValue.unit);
    formData.append('isActive', formValue.isActive.toString());

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    if (this.isEdit() && this.productId()) {
      this.productService.updateProduct(this.productId()!, formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.message.set(err.error?.message || 'Failed to update product');
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.message.set(err.error?.message || 'Failed to create product');
        }
      });
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://via.placeholder.com/100';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  }
}
