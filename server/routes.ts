import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { hashPassword, verifyPassword } from "./auth";
import { insertEventSchema, insertAudienceSchema, insertTopicSchema, insertNoticeSchema } from "@shared/schema";
import { z } from "zod";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

function parseCSV(text: string): Array<Record<string, string>> {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values = splitCSVLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (values[i] || "").trim();
    });
    return obj;
  });
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Auth ──────────────────────────────────────────────────────────────
  app.get("/api/me", async (req, res) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Not logged in" });
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    const user = await storage.getUserByUsername(username);
    if (!user) return res.status(401).json({ message: "Invalid username or password" });
    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid username or password" });
    req.session.userId = user.id;
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
  });

  // ─── User Management (Admin only) ──────────────────────────────────────
  app.get("/api/users", requireAdmin, async (_req, res) => {
    const allUsers = await storage.getAllUsers();
    res.json(allUsers.map(({ password: _, ...u }) => u));
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    const { username, password, isAdmin } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    const existing = await storage.getUserByUsername(username);
    if (existing) return res.status(409).json({ message: "Username already taken" });
    const hashed = await hashPassword(password);
    const user = await storage.createUser({ username, password: hashed, isAdmin: !!isAdmin });
    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.username === "admin") return res.status(403).json({ message: "Cannot delete the admin account" });
    await storage.deleteUser(req.params.id);
    res.status(204).send();
  });

  app.patch("/api/users/:id/password", requireAdmin, async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const hashed = await hashPassword(password);
    const updated = await storage.updateUserPassword(req.params.id, hashed);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ ok: true });
  });

  // ─── Events ────────────────────────────────────────────────────────────
  app.get("/api/events", async (_req, res) => {
    const data = await storage.getEvents();
    res.json(data);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post("/api/events", async (req, res) => {
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const created = await storage.createEvent(parsed.data);
    res.status(201).json(created);
  });

  app.patch("/api/events/:id", async (req, res) => {
    const parsed = insertEventSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const updated = await storage.updateEvent(req.params.id, parsed.data);
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json(updated);
  });

  app.delete("/api/events/:id", async (req, res) => {
    await storage.deleteEvent(req.params.id);
    res.status(204).send();
  });

  // ─── Audiences ─────────────────────────────────────────────────────────
  app.get("/api/audiences", async (_req, res) => {
    const data = await storage.getAudiences();
    res.json(data);
  });

  app.post("/api/audiences", async (req, res) => {
    const parsed = insertAudienceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    try {
      const created = await storage.createAudience(parsed.data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.code === "23505") return res.status(409).json({ message: "Audience already exists" });
      throw err;
    }
  });

  app.patch("/api/audiences/:id", async (req, res) => {
    const parsed = insertAudienceSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    try {
      const updated = await storage.updateAudience(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ message: "Audience not found" });
      res.json(updated);
    } catch (err: any) {
      if (err.code === "23505") return res.status(409).json({ message: "Audience already exists" });
      throw err;
    }
  });

  app.delete("/api/audiences/:id", async (req, res) => {
    await storage.deleteAudience(req.params.id);
    res.status(204).send();
  });

  // ─── Topics ────────────────────────────────────────────────────────────
  app.get("/api/topics", async (_req, res) => {
    const data = await storage.getTopics();
    res.json(data);
  });

  app.post("/api/topics", async (req, res) => {
    const parsed = insertTopicSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    try {
      const created = await storage.createTopic(parsed.data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.code === "23505") return res.status(409).json({ message: "Topic already exists" });
      throw err;
    }
  });

  app.patch("/api/topics/:id", async (req, res) => {
    const parsed = insertTopicSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    try {
      const updated = await storage.updateTopic(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ message: "Topic not found" });
      res.json(updated);
    } catch (err: any) {
      if (err.code === "23505") return res.status(409).json({ message: "Topic already exists" });
      throw err;
    }
  });

  app.delete("/api/topics/:id", async (req, res) => {
    await storage.deleteTopic(req.params.id);
    res.status(204).send();
  });

  // ─── Notices ───────────────────────────────────────────────────────────
  app.get("/api/notices", async (_req, res) => {
    const data = await storage.getNotices();
    res.json(data);
  });

  app.post("/api/notices", async (req, res) => {
    const parsed = insertNoticeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const created = await storage.createNotice(parsed.data);
    res.status(201).json(created);
  });

  app.patch("/api/notices/:id/resolve", async (req, res) => {
    const updated = await storage.resolveNotice(req.params.id);
    if (!updated) return res.status(404).json({ message: "Notice not found" });
    res.json(updated);
  });

  // ─── Campaign CSV Upload ────────────────────────────────────────────────
  app.post("/api/campaigns/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const text = req.file.buffer.toString("utf-8");
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return res.status(400).json({ message: "CSV is empty or has no data rows" });
    }

    const createdEvents: string[] = [];
    const autoCreatedAudiences: string[] = [];
    const createdNotices: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      const audienceName = row["audience"] || row["organization"] || "";
      const date = row["date"] || "";
      const time = row["time"] || "";
      const location = row["location"] || "";
      const summary = row["summary"] || "";
      const callToAction = row["call_to_action"] || row["calltoaction"] || row["call-to-action"] || "";
      const executionNotes = row["execution_notes"] || row["executionnotes"] || row["execution-notes"] || "";
      const topicPlan = row["topic_plan"] || row["topicplan"] || row["topic-plan"] || row["topic"] || "";

      if (!audienceName || !date || !time) {
        errors.push(`Row ${rowNum}: missing required fields (audience, date, time)`);
        continue;
      }

      let audience = await storage.getAudienceByName(audienceName);
      if (!audience) {
        try {
          audience = await storage.createAudience({ name: audienceName });
          autoCreatedAudiences.push(audienceName);
          const notice = await storage.createNotice({
            message: `Update audience card for ${audienceName}`,
            audienceId: audience.id,
            resolved: false,
          });
          createdNotices.push(notice.id);
        } catch (err: any) {
          if (err.code === "23505") {
            audience = await storage.getAudienceByName(audienceName);
          } else {
            errors.push(`Row ${rowNum}: failed to create audience "${audienceName}"`);
            continue;
          }
        }
      }

      if (!audience) {
        errors.push(`Row ${rowNum}: could not find or create audience "${audienceName}"`);
        continue;
      }

      try {
        const event = await storage.createEvent({
          organization: audienceName,
          topic: topicPlan,
          date,
          time,
          format: "in-person",
          venue: location,
          category: audienceName,
          summary,
          callToAction,
          executionNotes,
        });
        createdEvents.push(event.id);
      } catch (err: any) {
        errors.push(`Row ${rowNum}: failed to create event — ${err.message}`);
      }
    }

    res.json({
      eventsCreated: createdEvents.length,
      audiencesAutoCreated: autoCreatedAudiences.length,
      noticesCreated: createdNotices.length,
      autoCreatedAudienceNames: autoCreatedAudiences,
      errors,
    });
  });

  return httpServer;
}
