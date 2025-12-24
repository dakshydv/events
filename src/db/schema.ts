import {
  pgTable,
  decimal,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const eventsTable = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  bannerImage: varchar("banner_image", { length: 255 }),
  location: varchar("location", { length: 255 }).notNull(),
  isOnline: boolean("is_online").notNull().default(false),
  meetingUrl: varchar("meeting_url", { length: 255 }),
  venue: varchar("venue", { length: 255 }),
  capacity: integer("capacity"),
  isPaid: boolean("is_paid").notNull().default(false),
  price: decimal("price", { precision: 10, scale: 2 }),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});
