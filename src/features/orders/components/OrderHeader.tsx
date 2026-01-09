import * as React from "react";
import type { OrderDetail } from "../api/types";
import OrderCard from "./OrderCard";
import { formatDate, formatMoney } from "../../../shared/utils/formatValues";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-slate-100 text-slate-700 border-slate-200",
    processing: "bg-amber-50 text-amber-800 border-amber-200",
    paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
    shipped: "bg-blue-50 text-blue-800 border-blue-200",
    delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
    canceled: "bg-rose-50 text-rose-800 border-rose-200",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
        cls,
      ].join(" ")}
    >
      {status || "—"}
    </span>
  );
}

export function OrderHeader({ order }: { order: OrderDetail }) {
  return (
    <OrderCard className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs text-slate-500">Order</div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            {order.id || "—"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="text-slate-400">•</span>
              {formatDate(order.date)}
            </span>
            <span className="text-slate-400">•</span>
            <StatusPill status={order.status} />
          </div>
        </div>

        <div className="sm:text-right">
          <div className="text-xs text-slate-500">Total</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">
            {formatMoney(order.total ?? 0)}
          </div>
        </div>
      </div>
    </OrderCard>
  );
}
