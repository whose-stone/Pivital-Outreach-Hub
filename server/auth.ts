import crypto from "crypto";
import { storage } from "./storage.js";

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
    if (!salt || !hash) return resolve(false);
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) return reject(err);
      const hashBuf = Buffer.from(hash, "hex");
      if (hashBuf.length !== derived.length) return resolve(false);
      resolve(crypto.timingSafeEqual(hashBuf, derived));
    });
  });
}

export async function seedAdminUser() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn(
      "[auth] ADMIN_PASSWORD not set; skipping admin seed. Set ADMIN_USERNAME/ADMIN_PASSWORD to provision the admin account.",
    );
    return;
  }
  const existing = await storage.getUserByUsername(username);
  if (existing) return;
  const hashed = await hashPassword(password);
  await storage.createUser({ username, password: hashed, isAdmin: true });
  console.log(`[auth] Admin user "${username}" created.`);
}
