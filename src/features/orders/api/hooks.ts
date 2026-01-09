import {
  keepPreviousData,
  queryOptions,
  useQuery,
  useQueryClient,
  type QueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

import { ordersApi } from "./calls";
import type {
  OrdersFilterParams,
  OrderDetail,
  OrderListItem,
  PaginatedResponse,
} from "./types";
import {
  DEFAULT_ORDERS_RESPONSE,
  DEFAULT_PAGINATION,
  DEFAULT_ORDER_DETAIL,
} from "./defaults";

export const normalizeOrdersParams = (
  params: OrdersFilterParams = {}
): Required<Pick<OrdersFilterParams, "page" | "limit">> &
  Omit<OrdersFilterParams, "page" | "limit"> => {
  return {
    ...params,
    page: params.page ?? DEFAULT_PAGINATION.page,
    limit: params.limit ?? DEFAULT_PAGINATION.limit,

    sortBy: params.sortBy ?? "date",
    sortOrder: params.sortOrder ?? "desc",
  };
};

export const ordersKeys = {
  all: ["orders"] as const,
  lists: () => [...ordersKeys.all, "list"] as const,
  list: (params: OrdersFilterParams = {}) =>
    [...ordersKeys.lists(), normalizeOrdersParams(params)] as const,
  details: () => [...ordersKeys.all, "detail"] as const,
  detail: (orderId: string) => [...ordersKeys.details(), orderId] as const,
};

const listQuery = (params: OrdersFilterParams = {}) =>
  queryOptions({
    queryKey: ordersKeys.list(params),
    queryFn: () => ordersApi.getOrders(normalizeOrdersParams(params)),
    placeholderData: keepPreviousData, // smooth pagination + filters
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: (failureCount, error) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.toLowerCase().includes("not found")) return false;
      return failureCount < 2;
    },
  });

const detailQuery = (orderId: string) =>
  queryOptions({
    queryKey: ordersKeys.detail(orderId),
    queryFn: () => ordersApi.getOrderById(orderId),
    enabled: Boolean(orderId),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    retry: (failureCount, error) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.toLowerCase().includes("not found")) return false;
      return failureCount < 2;
    },
  });

export type OrdersListQueryResult = UseQueryResult<
  PaginatedResponse<OrderListItem>,
  Error
>;
export type OrderDetailQueryResult = UseQueryResult<OrderDetail, Error>;

export const ordersHooks = {
  keys: ordersKeys,

  useOrdersListQuery: (
    params: OrdersFilterParams = {},
    options?: Omit<
      UseQueryOptions<
        PaginatedResponse<OrderListItem>,
        Error,
        PaginatedResponse<OrderListItem>,
        ReturnType<typeof ordersKeys.list>
      >,
      "queryKey" | "queryFn"
    >
  ): OrdersListQueryResult => {
    const normalizedParams = normalizeOrdersParams(params);

    return useQuery({
      ...listQuery(normalizedParams),
      ...(options ?? {}),

      queryKey: ordersKeys.list(normalizedParams),
      queryFn: () => ordersApi.getOrders(normalizedParams),

      // Only keep previous data on refetches, not on initial load
      placeholderData: keepPreviousData,
    });
  },
  useOrderQuery: (
    orderId: string,
    options?: Omit<
      UseQueryOptions<
        OrderDetail,
        Error,
        OrderDetail,
        ReturnType<typeof ordersKeys.detail>
      >,
      "queryKey" | "queryFn"
    >
  ): OrderDetailQueryResult => {
    return useQuery({
      ...detailQuery(orderId),
      ...(options ?? {}),

      queryKey: ordersKeys.detail(orderId),
      queryFn: () => ordersApi.getOrderById(orderId),
    });
  },

  // Prefetch helpers (great with React Router on hover/focus).
  prefetchOrdersList: (
    queryClient: QueryClient,
    params: OrdersFilterParams = {}
  ) => queryClient.prefetchQuery(listQuery(params)),

  prefetchOrder: (queryClient: QueryClient, orderId: string) =>
    queryClient.prefetchQuery(detailQuery(orderId)),

  // Ensure helpers (awaitable) – useful for loaders/transitions.
  ensureOrdersListData: (
    queryClient: QueryClient,
    params: OrdersFilterParams = {}
  ) => queryClient.ensureQueryData(listQuery(params)),

  ensureOrderData: (queryClient: QueryClient, orderId: string) =>
    queryClient.ensureQueryData(detailQuery(orderId)),

  // Link-friendly prefetch props (hover/focus).
  useOrderLinkPrefetchProps: (orderId: string) => {
    const qc = useQueryClient();

    return {
      onMouseEnter: () => {
        void qc.prefetchQuery(detailQuery(orderId));
      },
      onFocus: () => {
        void qc.prefetchQuery(detailQuery(orderId));
      },
    } as const;
  },
};
