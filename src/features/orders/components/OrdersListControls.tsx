import * as React from "react";
import type { OrdersFilterParams } from "../api/types";
import { useDebouncedCallback } from "../../../shared/hooks/useDebouncedCallback";
import OrderCard from "./OrderCard";

type Props = {
  params: OrdersFilterParams;
  onChange: (next: OrdersFilterParams) => void;
  total?: number;
  isFetching?: boolean;
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-medium text-slate-600 leading-none">
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800",
        "outline-none ring-0 focus:border-slate-300 focus:ring-4 focus:ring-slate-100",
        "placeholder:text-slate-400",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800",
        "outline-none ring-0 focus:border-slate-300 focus:ring-4 focus:ring-slate-100",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800",
        "hover:bg-slate-50 active:translate-y-[0.5px]",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        props.className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function OrdersListControls({
  params,
  onChange,
  total,
  isFetching,
}: Props) {
  const status = params.status ?? "";
  const sortBy = (params.sortBy ?? "date") as "date" | "total";
  const sortOrder = (params.sortOrder ?? "desc") as "asc" | "desc";
  const limit = params.limit ?? 10;

  const set = React.useCallback(
    (patch: Partial<OrdersFilterParams>) => {
      // When changing filters/sort/limit -> reset to page 1 by default
      const shouldResetPage =
        "id" in patch ||
        "customerName" in patch ||
        "status" in patch ||
        "sortBy" in patch ||
        "sortOrder" in patch ||
        "limit" in patch;

      onChange({
        ...params,
        ...patch,
        ...(shouldResetPage ? { page: 1 } : null),
      });
    },
    [onChange, params]
  );

  const clear = React.useCallback(() => {
    onChange({
      page: 1,
      limit: limit, // keep current page size
      sortBy: "date",
      sortOrder: "desc",
      id: undefined,
      customerName: undefined,
      status: undefined,
    });
  }, [onChange, limit]);

  // Local (immediate) input states
  const [idInput, setIdInput] = React.useState(params.id ?? "");
  const [customerInput, setCustomerInput] = React.useState(
    params.customerName ?? ""
  );

  // Keep local inputs in sync when params change externally (reset, url params, etc.)
  React.useEffect(() => setIdInput(params.id ?? ""), [params.id]);
  React.useEffect(
    () => setCustomerInput(params.customerName ?? ""),
    [params.customerName]
  );

  // Debounced push to params
  const { debounced: pushId } = useDebouncedCallback(
    (value: string) => set({ id: value || undefined }),
    500
  );

  const { debounced: pushCustomer } = useDebouncedCallback(
    (value: string) => set({ customerName: value || undefined }),
    500
  );
  return (
    <OrderCard className="p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4 w-full">
          <div className="space-y-2">
            <Label>Order ID</Label>
            <Input
              value={idInput}
              placeholder="e.g. ORD-1024"
              onChange={(e) => {
                const v = e.target.value;
                setIdInput(v);
                pushId(v);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Customer</Label>
            <Input
              value={customerInput}
              placeholder="Search by name…"
              onChange={(e) => {
                const v = e.target.value;
                setCustomerInput(v);
                pushCustomer(v);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onChange={(e) =>
                set({ status: (e.target.value || undefined) as any })
              }
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="processing">Processing</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sort</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={sortBy}
                onChange={(e) => set({ sortBy: e.target.value as any })}
              >
                <option value="date">Date</option>
                <option value="total">Total</option>
              </Select>

              <Select
                value={sortOrder}
                onChange={(e) => set({ sortOrder: e.target.value as any })}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:pl-4">
          <div className="space-y-2 w-28">
            <Label>Per page</Label>
            <Select
              value={String(limit)}
              onChange={(e) => set({ limit: Number(e.target.value) })}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
            </Select>
          </div>

          <Button onClick={clear} type="button">
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div>
          {typeof total === "number" ? (
            <span>
              Total: <span className="font-medium text-slate-700">{total}</span>
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1",
              isFetching ? "text-slate-700" : "text-slate-500",
            ].join(" ")}
            aria-live="polite"
          >
            <span
              className={[
                "inline-block h-2 w-2 rounded-full",
                isFetching ? "bg-slate-700 animate-pulse" : "bg-slate-300",
              ].join(" ")}
            />
            {isFetching ? "Updating…" : "Up to date"}
          </span>
        </div>
      </div>
    </OrderCard>
  );
}
