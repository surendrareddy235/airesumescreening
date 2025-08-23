import { forwardRef } from "react";
import { clsx } from "clsx";

const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-slate-200 bg-white hover:bg-slate-100",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100",
    link: "underline-offset-4 hover:underline text-slate-900",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };
  
  return (
    <button
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };