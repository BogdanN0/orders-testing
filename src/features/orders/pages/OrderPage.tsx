import * as React from "react";
import { useParams, Link } from "react-router-dom";

import { ordersHooks } from "../api";
import { Loading } from "../../../shared/ui/Loading";

import { OrderHeader } from "../components/OrderHeader";
import { OrderCustomerCard } from "../components/OrderCustomerCard";
import { OrderItemsTable } from "../components/OrderItemsTable";
import { OrderNotFound } from "../components/OrderNotFound";
import { ErrorState } from "../../../shared/ui/ErrorState";

export function OrderPage() {
  const { orderId = "" } = useParams();

  const { data, isFetching, isLoading, isError, error, refetch } =
    ordersHooks.useOrderQuery(orderId, { enabled: Boolean(orderId) });
  console.log({
    error,
  });

  // if (!orderId) {
  //   return (
  //     <div className="mx-auto max-w-6xl p-4 sm:p-6">
  //       <OrderNotFound />
  //     </div>
  //   );
  // }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-4">
        <ErrorState
          title="Failed to load order"
          description="We couldn’t fetch order details. Please try again."
          onRetry={() => refetch()}
          backTo={{ to: "/orders", label: "← Back to orders" }}
          details={error instanceof Error ? error.message : String(error ?? "")}
        />
      </div>
    );
  }
  if (isLoading) {
    return <Loading overlay label="Loading order" variant="combo" />;
  }

  // If we reach here without data, show not found
  if (!data || !data.id) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-4">
        <div>
          <Link
            to="/orders"
            className="text-sm font-medium text-slate-700 hover:underline underline-offset-2"
          >
            ← Back to orders
          </Link>
        </div>
        <OrderNotFound />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-4">
      <div>
        <Link
          to="/orders"
          className="text-sm font-medium text-slate-700 hover:underline underline-offset-2"
        >
          ← Back to orders
        </Link>
      </div>

      <OrderHeader order={data} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <OrderCustomerCard order={data} />
        </div>

        <div className="lg:col-span-2">
          <OrderItemsTable order={data} />
        </div>
      </div>
    </div>
  );
}
