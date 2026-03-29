import crypto from "crypto";
import { storage } from "./storage";

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) return reject(err);
      resolve(`${salt}:${derived.toString("hex")}`);
    });
  });
}

export function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, hash] = stored.split(":");
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) return reject(err);
      resolve(derived.toString("hex") === hash);
    });
  });
}

export async function seedAdminUser() {
  const existing = await storage.getUserByUsername("admin");
  if (!existing) {
    const hashed = await hashPassword("Outreach2026!");
    await storage.createUser({ username: "admin", password: hashed, isAdmin: true });
    console.log("[auth] Admin user created.");
  }
}
