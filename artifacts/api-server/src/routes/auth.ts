import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "himmatlal-admin-secret-2024";
const COOKIE_NAME = "admin_token";

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email));
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ email: user.email, token });
  } catch (err) {
    logger.error({ err }, "Login failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

router.get("/auth/me", async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const payload = jwt.verify(token, JWT_SECRET) as { email: string };
    res.json({ email: payload.email, token });
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
