import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
}

export interface OrderStatusStat {
  _id: string;
  count: number;
}

export interface SalesByMonth {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: any[];
  ordersByStatus: OrderStatusStat[];
  salesByMonth: SalesByMonth[];
  topProducts: TopProduct[];
}

export interface StockByCategory {
  _id: string;
  totalProducts: number;
  totalStock: number;
  avgStock: number;
}

export interface InventoryData {
  stockByCategory: StockByCategory[];
  lowStockItems: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/stats`);
  }

  getInventoryStats(): Observable<InventoryData> {
    return this.http.get<InventoryData>(`${this.apiUrl}/inventory`);
  }
}
