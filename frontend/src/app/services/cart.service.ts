import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  _id: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cart = signal<Cart | null>(null);
  private cartItemCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getCart = () => this.cart;
  getCartItemCount = () => this.cartItemCount;

  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => {
        this.cart.set(cart);
        this.cartItemCount.set(cart.totalItems || 0);
      })
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<{ message: string; cart: Cart }> {
    return this.http.post<{ message: string; cart: Cart }>(`${this.apiUrl}/add`, { productId, quantity })
      .pipe(
        tap(response => {
          this.cart.set(response.cart);
          this.cartItemCount.set(response.cart.totalItems || 0);
        })
      );
  }

  updateCartItem(productId: string, quantity: number): Observable<{ message: string; cart: Cart }> {
    return this.http.put<{ message: string; cart: Cart }>(`${this.apiUrl}/update/${productId}`, { quantity })
      .pipe(
        tap(response => {
          this.cart.set(response.cart);
          this.cartItemCount.set(response.cart.totalItems || 0);
        })
      );
  }

  removeFromCart(productId: string): Observable<{ message: string; cart: Cart }> {
    return this.http.delete<{ message: string; cart: Cart }>(`${this.apiUrl}/remove/${productId}`)
      .pipe(
        tap(response => {
          this.cart.set(response.cart);
          this.cartItemCount.set(response.cart.totalItems || 0);
        })
      );
  }

  clearCart(): Observable<{ message: string; cart: Cart }> {
    return this.http.delete<{ message: string; cart: Cart }>(`${this.apiUrl}/clear`)
      .pipe(
        tap(response => {
          this.cart.set(response.cart);
          this.cartItemCount.set(0);
        })
      );
  }
}
