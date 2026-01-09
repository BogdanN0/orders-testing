import * as React from "react";
import type { OrderListItem } from "../api/types";
import OrderCard from "./OrderCard";
import { formatDate, formatMoney } from "../../../shared/utils/formatValues";

type Props = {
  items: OrderListItem[];
  onOpen: (orderId: string) => void;
  onPrefetch?: (orderId: string) => void;
};

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

export function OrdersTable({ items, onOpen, onPrefetch }: Props) {
  return (
    <OrderCard>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr className="text-slate-600">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {items.map((o) => (
              <tr
                key={o.id}
                className="group hover:bg-slate-50/70 transition-colors"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onMouseEnter={() => onPrefetch?.(o.id)}
                    onFocus={() => onPrefetch?.(o.id)}
                    onClick={() => onOpen(o.id)}
                    className={[
                      "text-left font-medium text-slate-900",
                      "hover:underline underline-offset-2",
                      "focus:outline-none focus:ring-4 focus:ring-slate-100 rounded-lg",
                    ].join(" ")}
                  >
                    {o.id}
                  </button>
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {formatDate(o.date)}
                </td>
                <td className="px-4 py-3 text-slate-800">{o.customerName}</td>
                <td className="px-4 py-3">
                  <StatusPill status={o.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {formatMoney(o.total)}
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onMouseEnter={() => onPrefetch?.(o.id)}
                    onFocus={() => onPrefetch?.(o.id)}
                    onClick={() => onOpen(o.id)}
                    className={[
                      "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2",
                      "text-sm font-medium text-slate-800",
                      "hover:bg-slate-50 active:translate-y-[0.5px]",
                      "focus:outline-none focus:ring-4 focus:ring-slate-100",
                    ].join(" ")}
                  >
                    Open →
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10">
                  <div className="mx-auto max-w-md text-center">
                    <div className="text-sm font-medium text-slate-800">
                      No orders found
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Try adjusting filters or search terms.
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </OrderCard>
  );
}
