import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop() ?? "";
  const events = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id));

  if (!events || events.length === 0) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(events[0]);
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop() ?? "";
    const body = await req.json();
    const {
      name,
      description,
      bannerImage,
      location,
      isOnline,
      meetingUrl,
      venue,
      capacity,
      isPaid,
      price,
      date,
    } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage || null;
    if (location !== undefined) updateData.location = location;
    if (isOnline !== undefined) updateData.isOnline = isOnline;
    if (meetingUrl !== undefined) updateData.meetingUrl = meetingUrl || null;
    if (venue !== undefined) updateData.venue = venue || null;
    if (capacity !== undefined) updateData.capacity = capacity || null;
    if (isPaid !== undefined) updateData.isPaid = isPaid;
    if (price !== undefined) updateData.price = price || null;
    if (date !== undefined) updateData.date = new Date(date);

    const updatedEvent = await db
      .update(eventsTable)
      .set(updateData)
      .where(eq(eventsTable.id, id))
      .returning();

    if (!updatedEvent || updatedEvent.length === 0) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event: updatedEvent[0] });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop() ?? "";
    const deletedEvent = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id))
      .returning();

    if (!deletedEvent || deletedEvent.length === 0) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 }
    );
  }
}
