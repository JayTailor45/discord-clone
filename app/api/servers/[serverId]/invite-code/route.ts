import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = await params;
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: serverId,
        profileId: profile.id,
       },
      data: { inviteCode: uuidv4() },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("Failed to update invite code:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
