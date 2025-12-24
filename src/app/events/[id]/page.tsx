"use client";

import React, { use } from "react";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Ticket,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Plus,
  Trash2,
  Edit,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvent, deleteEvent } from "@/lib/api/events";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TABS = [
  "Ticket Collections",
  "Ticket Categories",
  "Attendee List",
  "Promotions / Discounts",
  "Seat chart",
];

function formatDate(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateString: string | Date): string {
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

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/events");
    },
  });

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-foreground-muted mb-4">
          Event Management / Events /{" "}
          <span className="text-foreground font-medium">Loading...</span>
        </div>
        <Card>
          <div className="p-12 text-center">
            <p className="text-foreground-muted">Loading event details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-foreground-muted mb-4">
          Event Management / Events /{" "}
          <span className="text-foreground font-medium">Error</span>
        </div>
        <Card>
          <div className="p-12 text-center">
            <p className="text-error mb-4">Failed to load event</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["event", id] })
                }
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Retry
              </button>
              <Link
                href="/events"
                className="px-4 py-2 bg-surface border border-border text-foreground rounded-lg hover:bg-surface-hover"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Title */}
      <div className="text-sm text-foreground-muted mb-4">
        <Link
          href="/events"
          className="hover:text-foreground transition-colors"
        >
          Event Management / Events
        </Link>{" "}
        / <span className="text-foreground font-medium">Event Details</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Banner & Info */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card noPadding className="relative group">
              <div className="h-64 bg-gradient-to-r from-blue-900 to-indigo-900 relative overflow-hidden">
                {event.bannerImage ? (
                  <div className="absolute inset-0">
                    <img
                      src={event.bannerImage}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2605&auto=format&fit=crop')] bg-cover bg-center"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-4 border-surface bg-background flex items-center justify-center overflow-hidden shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                        <span className="font-bold text-2xl text-white">
                          {event.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <h1 className="text-2xl font-bold text-white drop-shadow-md">
                        {event.name}
                      </h1>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="px-3 py-1.5 bg-surface/80 backdrop-blur text-xs font-medium rounded-full border border-border text-foreground-muted hover:text-foreground hover:bg-surface transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1.5 bg-surface/80 backdrop-blur text-xs font-medium rounded-full border border-border text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-foreground-muted leading-relaxed mb-6">
                  {event.description}
                </p>

                <div className="grid gap-4 p-4 bg-surface/50 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3 text-sm">
                    <Icon
                      icon={CalendarDays}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-foreground">
                      {formatDateTime(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Icon
                      icon={event.isOnline ? Globe : MapPin}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-foreground">
                      {event.isOnline
                        ? `Online - ${event.meetingUrl || "Meeting URL TBD"}`
                        : event.location}
                    </span>
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-3 text-sm">
                      <Icon icon={Trophy} className="w-4 h-4 text-primary" />
                      <span className="text-foreground">
                        Venue: {event.venue}
                      </span>
                    </div>
                  )}
                  {event.capacity && (
                    <div className="flex items-center gap-3 text-sm">
                      <Icon icon={Users} className="w-4 h-4 text-primary" />
                      <span className="text-foreground">
                        Capacity: {event.capacity} attendees
                      </span>
                    </div>
                  )}
                  {event.isPaid && event.price && (
                    <div className="flex items-center gap-3 text-sm">
                      <Icon
                        icon={DollarSign}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">
                        Price: ${event.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Event Summary Stats */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="h-full bg-gradient-to-b from-surface to-background border-border">
              <h2 className="font-semibold text-lg mb-6">Event Summary</h2>

              <div className="space-y-4">
                {/* Stat 1 */}
                <div className="p-4 rounded-xl bg-surface/50 border border-border/50 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Icon icon={Ticket} className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-foreground-muted uppercase tracking-wide">
                    Total Tickets Sold
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">0</p>
                </div>

                {/* Stat 2 */}
                <div className="p-4 rounded-xl bg-surface/50 border border-border/50 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Icon icon={DollarSign} className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-foreground-muted uppercase tracking-wide">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    ${event.isPaid && event.price ? event.price : "0"}
                  </p>
                </div>

                {/* Stat 3 */}
                <div className="p-4 rounded-xl bg-surface/50 border border-border/50 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Icon icon={Users} className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-foreground-muted uppercase tracking-wide">
                    Capacity
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {event.capacity || "Unlimited"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section: Tabs & Collection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card noPadding>
          <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  i === 0
                    ? "bg-surface-hover text-foreground"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-hover/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
            <div className="w-full flex justify-end mb-8 px-4">
              <button className="p-2 text-foreground-muted hover:text-foreground">
                <Icon icon={Maximize2} className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors ml-2">
                <Icon icon={Plus} className="w-4 h-4" />
                Attach Collection
              </button>
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-medium text-foreground">
                No Ticket Collection Attached
              </h3>
              <p className="text-sm text-foreground-muted">
                Attach a ticket collection to enable publishing and sales.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
