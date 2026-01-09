import { OrderDetail, OrderListItem, PaginatedResponse } from "./types";

export const DEFAULT_ORDER_ITEM: OrderListItem = {
  id: "",
  date: new Date().toISOString(),
  customerName: "",
  total: 0,
  status: "new",
};

export const DEFAULT_ORDER_DETAIL: OrderDetail = {
  id: "",
  date: new Date().toISOString(),
  status: "new",
  customer: {
    name: "",
    email: "",
    phone: "",
    address: "",
  },
  items: [],
  total: 0,
};

export const DEFAULT_ORDERS_RESPONSE: PaginatedResponse<OrderListItem> = {
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};
