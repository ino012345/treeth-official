"use client";

import { ArrowRight } from "@phosphor-icons/react";

type ButtonVariant = "primary" | "secondary";

interface BaseProps {
  variant?: ButtonVariant;
  showArrow?: boolean;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsAnchor = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; onClick?: never };

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonProps = ButtonAsAnchor | ButtonAsButton;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-950 text-white hover:bg-zinc-800 border border-transparent",
  secondary:
    "bg-white text-zinc-950 hover:bg-zinc-50 border border-zinc-200",
};

export function Button({
  variant = "primary",
  showArrow = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/50";
  const classes = `${base} ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
        {showArrow && <ArrowRight size={16} weight="bold" />}
      </a>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
      {showArrow && <ArrowRight size={16} weight="bold" />}
    </button>
  );
}
