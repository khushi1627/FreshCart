import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category | string;
  stock: number;
  minStockLevel: number;
  images: string[];
  unit: string;
  weight?: string;
  isActive: boolean;
  rating?: number;
  discount?: number;
  isLowStock?: boolean;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private categoriesUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters = {}): Observable<ProductResponse> {
    const params: any = {};
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof ProductFilters] !== undefined) {
        params[key] = filters[key as keyof ProductFilters];
      }
    });
    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesUrl}/${id}`);
  }

  createCategory(category: Partial<Category>): Observable<{ message: string; category: Category }> {
    return this.http.post<{ message: string; category: Category }>(this.categoriesUrl, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<{ message: string; category: Category }> {
    return this.http.put<{ message: string; category: Category }>(`${this.categoriesUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.categoriesUrl}/${id}`);
  }

  createProduct(product: FormData): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(this.apiUrl, product);
  }

  updateProduct(id: string, product: FormData): Observable<{ message: string; product: Product }> {
    return this.http.put<{ message: string; product: Product }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  updateStock(id: string, stock: number): Observable<{ message: string; product: Product }> {
    return this.http.patch<{ message: string; product: Product }>(`${this.apiUrl}/${id}/stock`, { stock });
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
  }
}
