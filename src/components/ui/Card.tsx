import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    noPadding?: boolean;
};

export function Card({ children, className, noPadding = false, ...props }: CardProps) {
    return (
        <div
            className={`glass-panel rounded-xl shadow-lg border border-border/50 overflow-hidden ${className || ""}`}
            {...props}
        >
            <div className={noPadding ? "" : "p-6"}>{children}</div>
        </div>
    );
}
