import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

const MESASGES_BATCH_SIZE = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const searchParams = new URL(req.url).searchParams;

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return new NextResponse("Channel Id missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESASGES_BATCH_SIZE,
        skip: 1,
        cursor: { id: cursor },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESASGES_BATCH_SIZE,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESASGES_BATCH_SIZE) {
      nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Error fetching messages", { status: 500 });
  }
}
