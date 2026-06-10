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

  return NextResponse.json(room);
}
