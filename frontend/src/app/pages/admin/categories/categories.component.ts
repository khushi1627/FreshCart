import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Category } from '../../../services/product.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
        <p class="text-gray-500">Manage product categories</p>
      </div>

      <!-- Add Category Form -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ editingCategory() ? 'Edit' : 'Add' }} Category</h2>
        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" formControlName="name" class="input-field" placeholder="Category name">
          </div>
          <div class="flex-[2]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input type="text" formControlName="description" class="input-field" placeholder="Category description">
          </div>
          <div>
            <button type="submit" [disabled]="categoryForm.invalid || isLoading()"
                    class="btn-primary disabled:opacity-50">
              @if (isLoading()) {
                <i class="fas fa-spinner fa-spin"></i>
              } @else {
                <span>{{ editingCategory() ? 'Update' : 'Add' }}</span>
              }
            </button>
          </div>
          @if (editingCategory()) {
            <div>
              <button type="button" (click)="cancelEdit()" class="btn-secondary">
                Cancel
              </button>
            </div>
          }
        </form>
      </div>

      <!-- Categories List -->
      @if (categories().length > 0) {
        <div class="card overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Description</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (category of categories(); track category._id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-gray-900">{{ category.name }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ category.description || '-' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button (click)="editCategory(category)"
                              class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                        <i class="fas fa-edit text-sm"></i>
                      </button>
                      <button (click)="deleteCategory(category._id)"
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
      } @else {
        <div class="text-center py-16 card">
          <i class="fas fa-tags text-gray-300 text-5xl mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
          <p class="text-gray-500">Add your first category to get started</p>
        </div>
      }
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  categoryForm: FormGroup;
  editingCategory = signal<Category | null>(null);
  isLoading = signal(false);

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories)
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    this.isLoading.set(true);
    const formValue = this.categoryForm.value;

    if (this.editingCategory()) {
      this.productService.updateCategory(this.editingCategory()!._id, formValue).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.cancelEdit();
          this.loadCategories();
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.productService.createCategory(formValue).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.categoryForm.reset();
          this.loadCategories();
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  editCategory(category: Category): void {
    this.editingCategory.set(category);
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  cancelEdit(): void {
    this.editingCategory.set(null);
    this.categoryForm.reset();
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category? Products in this category will need to be reassigned.')) {
      this.productService.deleteCategory(id).subscribe({
        next: () => this.loadCategories()
      });
    }
  }
}
