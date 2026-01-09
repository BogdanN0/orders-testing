import * as React from "react";
import type { OrderDetail } from "../api/types";
import OrderCard from "./OrderCard";
import { formatMoney } from "../../../shared/utils/formatValues";

function getName(it: any) {
  return (
    it?.name ?? it?.title ?? it?.productName ?? it?.sku ?? it?.id ?? "Item"
  );
}
function getQty(it: any) {
  return Number(it?.qty ?? it?.quantity ?? it?.count ?? 1);
}
function getPrice(it: any) {
  const v = it?.price ?? it?.unitPrice ?? it?.amount;
  return typeof v === "number" ? v : Number(v ?? 0);
}
function getSubtotal(it: any) {
  const v = it?.subtotal ?? it?.sum;
  if (typeof v === "number") return v;
  const computed = getQty(it) * getPrice(it);
  return Number.isFinite(computed) ? computed : 0;
}

export function OrderItemsTable({ order }: { order: OrderDetail }) {
  const items = (order.items ?? []) as any[];

  return (
    <OrderCard>
      <div className="p-4 sm:p-5 border-b border-slate-200">
        <div className="text-sm font-semibold text-slate-900">Items</div>
        <div className="mt-1 text-xs text-slate-500">
          {items.length} item{items.length === 1 ? "" : "s"} in this order
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr className="text-slate-600">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium text-right">Qty</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">Subtotal</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {items.map((it, idx) => (
              <tr key={it?.id ?? `${idx}`} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {getName(it)}
                  </div>
                  {it?.description ? (
                    <div className="mt-0.5 text-xs text-slate-500">
                      {String(it.description)}
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right text-slate-800">
                  {getQty(it)}
                </td>
                <td className="px-4 py-3 text-right text-slate-800">
                  {formatMoney(getPrice(it))}
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {formatMoney(getSubtotal(it))}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10">
                  <div className="mx-auto max-w-md text-center">
                    <div className="text-sm font-medium text-slate-800">
                      No items
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      This order has an empty items list.
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 sm:p-5 border-t border-slate-200 flex items-center justify-end">
        <div className="text-sm text-slate-600">
          Total:&nbsp;
          <span className="font-semibold text-slate-900">
            {formatMoney(order.total ?? 0)}
          </span>
        </div>
      </div>
    </OrderCard>
  );
}
