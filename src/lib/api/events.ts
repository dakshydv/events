import type { Event, CreateEventInput, UpdateEventInput, EventsResponse, EventResponse } from "@/lib/types";

const API_BASE = "/api/events";

/**
 * Fetch all events
 */
export async function getEvents(): Promise<Event[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  const data: EventsResponse = await response.json();
  return data.events;
}

/**
 * Fetch a single event by ID
 */
export async function getEvent(id: string): Promise<Event> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Event not found");
    }
    throw new Error("Failed to fetch event");
  }
  const data: Event = await response.json();
  return data;
}

/**
 * Create a new event
 */
export async function createEvent(input: CreateEventInput): Promise<Event> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to create event" }));
    throw new Error(error.message || "Failed to create event");
  }

  const data: EventResponse = await response.json();
  return data.event;
}

/**
 * Update an existing event
 */
export async function updateEvent(id: string, input: UpdateEventInput): Promise<Event> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to update event" }));
    throw new Error(error.message || "Failed to update event");
  }

  const data: EventResponse = await response.json();
  return data.event;
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to delete event" }));
    throw new Error(error.message || "Failed to delete event");
  }
}

