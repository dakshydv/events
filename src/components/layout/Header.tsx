import React from "react";
import { Search, Bell } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

export function Header() {
    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
                <span>Event Management</span>
                <span className="text-border">/</span>
                <span className="text-foreground font-medium">Events</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative w-80">
                    <Icon
                        icon={Search}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted"
                    />
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="w-full h-10 pl-10 pr-4 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-foreground-muted/50"
                    />
                </div>

                <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors text-foreground-muted hover:text-foreground">
                    <Icon icon={Bell} className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-background"></span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface border border-border overflow-hidden">
                        {/* User Avatar Placeholder */}
                        <div className="w-full h-full bg-gradient-to-tr from-gray-700 to-gray-600"></div>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-foreground">Hailey Carter</p>
                        <p className="text-xs text-foreground-muted">Master Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
