import type { Express } from "express";
import { db } from "../db";
import { videos } from "../db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      const allVideos = await db.select().from(videos).orderBy(videos.createdAt);
      res.json(allVideos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get single video
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await db
        .select()
        .from(videos)
        .where(eq(videos.id, parseInt(req.params.id)))
        .limit(1);
      
      if (!video.length) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      res.json(video[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  // Create new video
  app.post("/api/videos", async (req, res) => {
    try {
      const video = await db
        .insert(videos)
        .values(req.body)
        .returning();
      
      res.json(video[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create video" });
    }
  });
}
