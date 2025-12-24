import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const events = await db.select().from(eventsTable);
  return NextResponse.json(
    { events },
    {
      status: 200,
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const event = await db
      .insert(eventsTable)
      .values({
        name: request.name,
        description: request.description,
        bannerImage: request.bannerImage || null,
        location: request.location,
        isOnline: request.isOnline || false,
        meetingUrl: request.meetingUrl || null,
        venue: request.venue || null,
        capacity: request.capacity || null,
        isPaid: request.isPaid || false,
        price: request.price || null,
        date: new Date(request.date),
      })
      .returning();

    return NextResponse.json(
      { event: event[0] },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        message: "Failed to create event",
      },
      {
        status: 500,
      }
    );
  }
}
