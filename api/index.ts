import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server/app.js";
import { seedAdminUser } from "../server/auth.js";

const app = createApp();

let seedPromise: Promise<void> | null = null;
function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedAdminUser().catch((err) => {
      console.error("[auth] admin seed failed:", err);
    });
  }
  return seedPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await ensureSeeded();
  app(req, res);
}
