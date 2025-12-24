import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "neutral";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant;
    children: React.ReactNode;
};

export function Badge({ variant = "default", children, className, ...props }: BadgeProps) {
    const variantStyles: Record<BadgeVariant, string> = {
        default: "bg-surface border-border text-foreground-muted",
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        error: "bg-error/10 text-error border-error/20",
        info: "bg-info/10 text-info border-info/20",
        neutral: "bg-surface-hover text-foreground-muted border-transparent",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className || ""}`}
            {...props}
        >
            {children}
        </span>
    );
}
