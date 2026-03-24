import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cash' | 'card' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  discount: number;
  finalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

export interface OrderResponse {
  orders: Order[];
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
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getMyOrders(page: number = 1, limit: number = 10): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/my-orders`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  getAllOrders(page: number = 1, limit: number = 10, status?: string): Observable<OrderResponse> {
    const params: any = { page: page.toString(), limit: limit.toString() };
    if (status) params.status = status;
    return this.http.get<OrderResponse>(this.apiUrl, { params });
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: CreateOrderRequest): Observable<{ message: string; order: Order }> {
    return this.http.post<{ message: string; order: Order }>(this.apiUrl, order);
  }

  updateOrderStatus(id: string, status: string): Observable<{ message: string; order: Order }> {
    return this.http.put<{ message: string; order: Order }>(`${this.apiUrl}/${id}/status`, { orderStatus: status });
  }

  cancelOrder(id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/cancel`, {});
  }

  downloadInvoice(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/invoice`, {
      responseType: 'blob'
    });
  }
}
