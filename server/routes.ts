import type { Express } from "express";
import { db } from "../db";
import { videos } from "../db/schema";
import { eq } from "drizzle-orm";

const sampleVideos = [
  {
    title: "Mystical Garden",
    description: "A journey through a luminous digital garden",
    videoUrl: "https://example.com/video1.mp4",
    thumbnailUrl: "https://picsum.photos/seed/mystical1/800/450",
    aiGenerated: { generated: true }
  }
];

export function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      console.log("Fetching all videos...");
      const allVideos = await db.select().from(videos).orderBy(videos.createdAt);
      
      // If no videos exist, insert sample videos
      if (allVideos.length === 0) {
        console.log("No videos found, inserting sample videos...");
        const inserted = await db.insert(videos).values(sampleVideos).returning();
        console.log("Sample videos inserted successfully");
        res.json(inserted);
      } else {
        console.log(`Found ${allVideos.length} videos`);
        res.json(allVideos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
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
      console.error('Error fetching single video:', error);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  // Create new video
  app.post("/api/videos", async (req, res) => {
    try {
      console.log("Creating new video with data:", req.body);
      const video = await db
        .insert(videos)
        .values(req.body)
        .returning();
      
      console.log("Video created successfully:", video[0].id);
      res.json(video[0]);
    } catch (error) {
      console.error('Error creating video:', error);
      res.status(500).json({ error: "Failed to create video" });
    }
  });
}