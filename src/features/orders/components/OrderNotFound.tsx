import * as React from "react";
import { Link } from "react-router-dom";
import OrderCard from "./OrderCard";

export function OrderNotFound() {
  return (
    <OrderCard className="p-6 text-center">
      <div className="text-lg font-semibold text-slate-900">
        Order not found
      </div>
      <div className="mt-2 text-sm text-slate-500">
        The order ID is invalid or the order doesn’t exist.
      </div>

      <div className="mt-4">
        <Link
          to="/orders"
          className={[
            "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2",
            "text-sm font-medium text-slate-800 hover:bg-slate-50",
            "focus:outline-none focus:ring-4 focus:ring-slate-100",
          ].join(" ")}
        >
          ← Back to orders
        </Link>
      </div>
    </OrderCard>
  );
}
