type OrderCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function OrderCard({ children, className }: OrderCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
