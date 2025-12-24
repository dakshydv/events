"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createEvent } from "@/lib/api/events";
import { type CreateEventInput } from "@/lib/types";
import {
  createEventSchema,
  type CreateEventFormData,
} from "@/lib/validations/event";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateEventFormData>({
    name: "",
    description: "",
    bannerImage: "",
    location: "",
    isOnline: false,
    meetingUrl: "",
    venue: "",
    capacity: null,
    isPaid: false,
    price: null,
    date: "",
  });

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/events");
    },
    onError: (error: Error) => {
      setErrors({ submit: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = createEventSchema.parse({
        ...formData,
        bannerImage: formData.bannerImage || undefined,
        meetingUrl: formData.meetingUrl || undefined,
        venue: formData.venue || undefined,
        capacity: formData.capacity || undefined,
        price: formData.price || undefined,
      });

      // Convert null to undefined for API compatibility
      const payload: CreateEventInput = {
        ...validatedData,
        capacity: validatedData.capacity ?? undefined,
        price: validatedData.price ?? undefined,
      };

      await createMutation.mutateAsync(payload);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const field = err.path[0];
          if (typeof field === "string") {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: "Failed to create event. Please try again." });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      const numValue = value === "" ? null : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/events"
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <Icon icon={ArrowLeft} className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Create New Event
          </h1>
          <p className="text-sm text-foreground-muted">
            Fill in the details to create a new event
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Basic Information
              </h2>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Event Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Enter event name"
                />
                {errors.name && (
                  <p className="text-error text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                  placeholder="Enter event description"
                />
                {errors.description && (
                  <p className="text-error text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="bannerImage"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Banner Image URL
                </label>
                <input
                  type="url"
                  id="bannerImage"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.bannerImage && (
                  <p className="text-error text-sm mt-1">
                    {errors.bannerImage}
                  </p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Date & Time
              </h2>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Event Date & Time <span className="text-error">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
                {errors.date && (
                  <p className="text-error text-sm mt-1">{errors.date}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Location
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOnline"
                  name="isOnline"
                  checked={formData.isOnline}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isOnline"
                  className="text-sm font-medium text-foreground"
                >
                  This is an online event
                </label>
              </div>

              {formData.isOnline ? (
                <div>
                  <label
                    htmlFor="meetingUrl"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Meeting URL
                  </label>
                  <input
                    type="url"
                    id="meetingUrl"
                    name="meetingUrl"
                    value={formData.meetingUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="https://meet.example.com/event"
                  />
                  {errors.meetingUrl && (
                    <p className="text-error text-sm mt-1">
                      {errors.meetingUrl}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Location <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="Enter event location"
                    />
                    {errors.location && (
                      <p className="text-error text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="venue"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Venue
                    </label>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="Enter venue name"
                    />
                    {errors.venue && (
                      <p className="text-error text-sm mt-1">{errors.venue}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Capacity & Pricing */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Capacity & Pricing
              </h2>

              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity || ""}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Enter maximum capacity"
                />
                {errors.capacity && (
                  <p className="text-error text-sm mt-1">{errors.capacity}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isPaid"
                  className="text-sm font-medium text-foreground"
                >
                  This is a paid event
                </label>
              </div>

              {formData.isPaid && (
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-error text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              )}
            </div>

            {errors.submit && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-error text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
              <Link
                href="/events"
                className="px-4 py-2 bg-surface border border-border text-foreground rounded-lg hover:bg-surface-hover transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon={Save} className="w-4 h-4" />
                {createMutation.isPending ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
