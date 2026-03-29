import { db } from "./db";
import { events, audiences, topics, users, notices } from "@shared/schema";
import { eq } from "drizzle-orm";
import type {
  InsertEvent, Event,
  InsertAudience, Audience,
  InsertTopic, Topic,
  InsertUser, User,
  InsertNotice, Notice,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  deleteUser(id: string): Promise<void>;
  updateUserPassword(id: string, hashedPassword: string): Promise<User | undefined>;

  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<void>;

  getAudiences(): Promise<Audience[]>;
  getAudienceByName(name: string): Promise<Audience | undefined>;
  createAudience(audience: InsertAudience): Promise<Audience>;
  updateAudience(id: string, audience: Partial<InsertAudience>): Promise<Audience | undefined>;
  deleteAudience(id: string): Promise<void>;

  getTopics(): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  updateTopic(id: string, topic: Partial<InsertTopic>): Promise<Topic | undefined>;
  deleteTopic(id: string): Promise<void>;

  getNotices(): Promise<Notice[]>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  resolveNotice(id: string): Promise<Notice | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(users.createdAt);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<User | undefined> {
    const [updated] = await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id)).returning();
    return updated;
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(events.date);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getAudiences(): Promise<Audience[]> {
    return db.select().from(audiences).orderBy(audiences.name);
  }

  async getAudienceByName(name: string): Promise<Audience | undefined> {
    const [audience] = await db.select().from(audiences).where(eq(audiences.name, name));
    return audience;
  }

  async createAudience(audience: InsertAudience): Promise<Audience> {
    const [created] = await db.insert(audiences).values(audience).returning();
    return created;
  }

  async updateAudience(id: string, audience: Partial<InsertAudience>): Promise<Audience | undefined> {
    const [updated] = await db.update(audiences).set(audience).where(eq(audiences.id, id)).returning();
    return updated;
  }

  async deleteAudience(id: string): Promise<void> {
    await db.delete(audiences).where(eq(audiences.id, id));
  }

  async getTopics(): Promise<Topic[]> {
    return db.select().from(topics).orderBy(topics.name);
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const [created] = await db.insert(topics).values(topic).returning();
    return created;
  }

  async updateTopic(id: string, topic: Partial<InsertTopic>): Promise<Topic | undefined> {
    const [updated] = await db.update(topics).set(topic).where(eq(topics.id, id)).returning();
    return updated;
  }

  async deleteTopic(id: string): Promise<void> {
    await db.delete(topics).where(eq(topics.id, id));
  }

  async getNotices(): Promise<Notice[]> {
    return db.select().from(notices).orderBy(notices.createdAt);
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [created] = await db.insert(notices).values(notice).returning();
    return created;
  }

  async resolveNotice(id: string): Promise<Notice | undefined> {
    const [updated] = await db.update(notices).set({ resolved: true }).where(eq(notices.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
