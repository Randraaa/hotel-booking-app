import { NextRequest, NextResponse } from "next/server";
import { roomsData } from "@/data/roomsData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const room = roomsData.find((r) => r.id === id);

  if (!room) {
    return NextResponse.json(
      { message: `Room with ID ${id} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(room.reviews || []);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const room = roomsData.find((r) => r.id === id);

  if (!room) {
    return NextResponse.json(
      { message: `Room with ID ${id} not found.` },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { author, rating, comment } = body;

    if (!author || typeof rating !== "number" || !comment) {
      return NextResponse.json(
        { message: "Missing or invalid fields. Required: author (string), rating (number), comment (string)." },
        { status: 400 }
      );
    }

    const newReview = {
      author,
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    };

    return NextResponse.json(newReview, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to parse JSON request body." },
      { status: 400 }
    );
  }
}
