import { createBrowserRouter, Navigate } from "react-router-dom";
import { OrderPage, OrdersListPage } from "@/features/orders";

export const routes = createBrowserRouter([
  { path: "/", element: <Navigate to="/orders" replace /> },
  { path: "/orders", element: <OrdersListPage /> },
  { path: "/orders/:orderId", element: <OrderPage /> },
  // { path: "/error", element: <div>Error occurred</div> },
  { path: "*", element: <Navigate to="/orders" replace /> },
]);
