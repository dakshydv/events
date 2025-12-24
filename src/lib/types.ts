// Event types based on database schema
export type Event = {
  id: string;
  name: string;
  description: string;
  bannerImage: string | null;
  location: string;
  isOnline: boolean;
  meetingUrl: string | null;
  venue: string | null;
  capacity: number | null;
  isPaid: boolean;
  price: string | null; // decimal returns as string
  date: Date | string;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
};

export type CreateEventInput = {
  name: string;
  description: string;
  bannerImage?: string;
  location: string;
  isOnline: boolean;
  meetingUrl?: string;
  venue?: string;
  capacity?: number;
  isPaid: boolean;
  price?: number;
  date: string; // ISO string
};

export type UpdateEventInput = Partial<CreateEventInput>;

export type EventsResponse = {
  events: Event[];
};

export type EventResponse = {
  event: Event;
};
