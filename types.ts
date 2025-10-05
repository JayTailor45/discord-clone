import { Member, Profile, Server } from "./lib/generated/prisma";
import { Server as NetServer, Server } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
