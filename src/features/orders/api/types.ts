export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderListItem {
  id: string;
  date: string;
  customerName: string;
  total: number;
  status: OrderStatus;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: string;
  title: string;
  qty: number;
  price: number;
}

export interface OrderDetail {
  id: string;
  date: string;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
}

export interface OrdersFilterParams {
  id?: string;
  customerName?: string;
  status?: OrderStatus;
  sortBy?: "date" | "total";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
