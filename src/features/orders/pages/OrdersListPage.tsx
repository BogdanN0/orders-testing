import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { ordersHooks } from "../api";
import type { OrdersFilterParams, OrderStatus } from "../api/types";

import { Loading } from "../../../shared/ui/Loading";

import { OrdersListControls } from "../components/OrdersListControls";
import { OrdersTable } from "../components/OrdersTable";
import { OrdersPagination } from "../components/OrdersPagination";
import { ErrorState } from "../../../shared/ui/ErrorState";
import {
  readEnum,
  readNumber,
  readString,
  writeParamsObject,
} from "../../../shared/utils/urlParams";

function readParams(sp: URLSearchParams): OrdersFilterParams {
  return {
    page: readNumber(sp, "page"),
    limit: readNumber(sp, "limit"),

    sortBy: readEnum(sp, "sortBy"),
    sortOrder: readEnum(sp, "sortOrder"),

    id: readString(sp, "id"),
    customerName: readString(sp, "customerName"),
    status: readEnum(sp, "status"),
  };
}

function writeParams(params: OrdersFilterParams): URLSearchParams {
  return writeParamsObject({
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy as any,
    sortOrder: params.sortOrder as any,
    id: params.id,
    customerName: params.customerName,
    status: params.status as any,
  });
}

export function OrdersListPage() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const params = React.useMemo(() => readParams(sp), [sp]);

  const { data, isFetching, isLoading, isError, error, refetch } =
    ordersHooks.useOrdersListQuery(params);

  const onChange = (next: OrdersFilterParams) => {
    setSp(writeParams(next), { replace: true });
  };

  const onOpen = async (orderId: string) => {
    // Prefetch details, then navigate
    try {
      await ordersHooks.prefetchOrder(qc, orderId);
    } finally {
      navigate(`/orders/${orderId}`);
    }
  };

  const onPrefetch = (orderId: string) => {
    // hover/focus prefetch (fire-and-forget)
    void ordersHooks.prefetchOrder(qc, orderId);
  };

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <ErrorState
          title="Failed to load orders"
          description="Please check your connection and try again."
          onRetry={() => refetch()}
          details={error instanceof Error ? error.message : String(error ?? "")}
        />
      </div>
    );
  }

  if (isLoading) {
    return <Loading overlay label="Loading orders" variant="combo" />;
  }

  const page = data?.pagination.page ?? 1;
  const totalPages = data?.pagination.totalPages ?? 0;
  const total = data?.pagination.total ?? 0;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
          <div className="mt-1 text-sm text-slate-500">
            Browse, filter, and open order details.
          </div>
        </div>
      </div>

      <OrdersListControls
        params={params}
        onChange={onChange}
        total={total}
        isFetching={isFetching}
      />

      <OrdersTable
        items={data?.data ?? []}
        onOpen={onOpen}
        onPrefetch={onPrefetch}
      />

      <OrdersPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => onChange({ ...params, page: p })}
      />
    </div>
  );
}
