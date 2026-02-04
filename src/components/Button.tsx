"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyles =
    "relative font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center overflow-hidden";

  const variants = {
    primary:
      "gradient-primary text-white hover:shadow-glow-primary hover:scale-[1.02] focus:ring-primary-500/20 active:scale-[0.98] shimmer-effect",
    secondary:
      "bg-white border-2 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 focus:ring-neutral-200 active:scale-[0.98]",
    accent:
      "gradient-accent text-white hover:shadow-glow-accent hover:scale-[1.02] focus:ring-accent-500/20 active:scale-[0.98] shimmer-effect",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-transparent hover:border-red-200 focus:ring-red-500/20 active:scale-[0.98]",
    outline:
      "border-2 border-primary-500 text-primary-700 hover:bg-primary-50 focus:ring-primary-500/20 active:scale-[0.98]",
    ghost:
      "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 focus:ring-neutral-200 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;
