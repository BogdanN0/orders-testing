import axios from "axios";
import {
  OrdersFilterParams,
  OrderListItem,
  OrderDetail,
  PaginatedResponse,
} from "./types";

import ordersData from "../../../../mock-data/orders.json";
import orderDetailsData from "../../../../mock-data/orderDetails.json";

const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const ordersApi = {
  getOrders: async (
    params: OrdersFilterParams = {}
  ): Promise<PaginatedResponse<OrderListItem>> => {
    await delay();

    try {
      //   throw new Error("Simulated API error");
      let filtered = [...ordersData] as OrderListItem[];

      // Filter by ID
      if (params.id) {
        filtered = filtered.filter((order) =>
          order.id.toLowerCase().includes(params.id!.toLowerCase())
        );
      }

      // Filter by customer name
      if (params.customerName) {
        filtered = filtered.filter((order) =>
          order.customerName
            .toLowerCase()
            .includes(params.customerName!.toLowerCase())
        );
      }

      // Filter by status
      if (params.status) {
        filtered = filtered.filter((order) => order.status === params.status);
      }

      // Sort
      const sortBy = params.sortBy || "date";
      const sortOrder = params.sortOrder || "desc";

      filtered.sort((a, b) => {
        let comparison = 0;

        if (sortBy === "date") {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === "total") {
          comparison = a.total - b.total;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedData = filtered.slice(startIndex, endIndex);
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);

      return {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
      throw error;
    }
  },

  getOrderById: async (orderId: string): Promise<OrderDetail> => {
    await delay();

    try {
      //   throw new Error("Simulated API error for order detail");
      const order = orderDetailsData.find((order) => order.id === orderId) as
        | OrderDetail
        | undefined;

      if (!order) {
        const error: any = new Error(`Order with ID ${orderId} not found`);
        error.response = { status: 404 };
        throw error;
      }

      return order;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch order ${orderId}: ${error.message}`);
      }
      throw error;
    }
  },
};
