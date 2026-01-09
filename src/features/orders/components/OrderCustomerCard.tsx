import * as React from "react";
import type { OrderDetail } from "../api/types";

import OrderCard from "./OrderCard";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="text-sm text-slate-900 break-words">
        {value?.trim() ? value : "—"}
      </div>
    </div>
  );
}

export function OrderCustomerCard({ order }: { order: OrderDetail }) {
  const c = order.customer;

  return (
    <OrderCard className="p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Customer</div>
          <div className="mt-1 text-xs text-slate-500">
            Contact & delivery details
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" value={c?.name} />
        <Field label="Email" value={c?.email} />
        <Field label="Phone" value={c?.phone} />
        <Field label="Address" value={c?.address} />
      </div>
    </OrderCard>
  );
}
