import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertAudienceSchema, insertTopicSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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

  return httpServer;
}
