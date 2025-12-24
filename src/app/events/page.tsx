"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Upload,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Edit,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, deleteEvent } from "@/lib/api/events";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const STATS = [
  {
    label: "Total events",
    value: "1,205",
    change: "+10%",
    trend: "up",
    icon: Calendar,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Upcoming events",
    value: "112",
    change: "+12%",
    trend: "up",
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Ongoing events",
    value: "5",
    change: "-12%",
    trend: "down",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Cancelled events",
    value: "104",
    change: "-5%",
    trend: "down",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
];

function formatDate(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getEventStatus(
  dateString: string | Date
): "Upcoming" | "Completed" | "Cancelled" {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();

  if (date < now) {
    return "Completed";
  }
  return "Upcoming";
}

export default function EventsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      event.name.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.venue?.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Event Overview
          </h1>
        </div>
        <Card>
          <div className="text-center py-12">
            <p className="text-error mb-4">Failed to load events</p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["events"] })
              }
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Event Overview
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon icon={stat.icon} className="w-16 h-16" />
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon icon={stat.icon} className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-foreground-muted">{stat.label}</p>
                <h3 className="text-3xl font-bold text-foreground">
                  {stat.label === "Total events" ? events.length : stat.value}
                </h3>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span
                  className={`flex items-center font-medium ${
                    stat.trend === "up" ? "text-success" : "text-error"
                  }`}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 ml-0.5" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 ml-0.5" />
                  )}
                </span>
                <span className="text-foreground-muted text-xs">
                  From last week
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Events Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Events</h2>
            <Badge
              variant="neutral"
              className="text-foreground-muted bg-surface border border-border px-2 py-0.5 rounded-full text-xs"
            >
              {events.length}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Icon
                icon={Search}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted"
              />
              <input
                type="text"
                placeholder="Search by event, location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground-muted/50"
              />
            </div>

            <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground-muted hover:text-foreground hover:border-foreground-muted/50 transition-colors">
              <span>Filter</span>
              <Icon icon={Filter} className="w-4 h-4" />
            </button>

            <button className="p-2 bg-background border border-border rounded-lg text-foreground-muted hover:text-foreground transition-colors">
              <Icon icon={Upload} className="w-4 h-4" />
            </button>

            <button
              onClick={() => router.push("/events/new")}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              <Icon icon={Plus} className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>

        <Card noPadding>
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-foreground-muted">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-foreground-muted mb-4">
                {searchQuery
                  ? "No events found matching your search"
                  : "No events yet"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push("/events/new")}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Create Your First Event
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-xs text-foreground-muted uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Event Name</th>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Location</th>
                      <th className="px-6 py-4 font-medium">Capacity</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-sm">
                    {filteredEvents.map((event, index) => {
                      const status = getEventStatus(event.date);
                      return (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-surface-hover/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <Link
                              href={`/events/${event.id}`}
                              className="flex items-center gap-3 group-hover:text-primary transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-foreground-muted">
                                  {event.name.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-foreground truncate max-w-[240px]">
                                {event.name}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-foreground-muted whitespace-nowrap">
                            {formatDate(event.date)}
                          </td>
                          <td className="px-6 py-4 text-foreground-muted">
                            {event.isOnline
                              ? event.meetingUrl || "Online"
                              : event.location}
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {event.capacity || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                status === "Upcoming"
                                  ? "success"
                                  : status === "Cancelled"
                                  ? "error"
                                  : "neutral"
                              }
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 inline-block" />
                              {status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/events/${event.id}/edit`}
                                className="p-1 hover:bg-surface border border-transparent hover:border-border rounded-md text-foreground-muted hover:text-primary transition-colors"
                              >
                                <Icon icon={Edit} className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={(e) => handleDelete(event.id, e)}
                                className="p-1 hover:bg-surface border border-transparent hover:border-border rounded-md text-foreground-muted hover:text-error transition-colors"
                              >
                                <Icon icon={Trash2} className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
