import type { Express } from "express";
import { db } from "../db";
import { videos } from "../db/schema";
import { eq } from "drizzle-orm";

// Sample videos data from teamLab images
const sampleVideos = [
  {
    title: "Digital Butterflies in Luminous Space",
    description: "An immersive journey through a mystical realm where digital butterflies dance in cascading waves of light, creating an ethereal spectacle that bridges the physical and digital worlds.",
    videoUrl: "https://example.com/video1.mp4",
    thumbnailUrl: "https://images.teamlab-planets.art/2024/planets_1.jpg",
    aiGenerated: {
      theme: "Digital Nature",
      mood: "Ethereal",
      elements: ["butterflies", "light", "water"]
    }
  },
  {
    title: "Garden of Celestial Flowers",
    description: "A mesmerizing exploration of an endless garden where digital flowers bloom in perpetual motion, their petals creating patterns that reflect the cosmic dance of the universe.",
    videoUrl: "https://example.com/video2.mp4",
    thumbnailUrl: "https://images.teamlab-planets.art/2024/planets_2.jpg",
    aiGenerated: {
      theme: "Digital Flora",
      mood: "Transcendent",
      elements: ["flowers", "patterns", "infinity"]
    }
  },
  {
    title: "Luminescent Pathways",
    description: "Journey through corridors of living light where every step creates ripples in the digital fabric of space, forming an interactive symphony of color and movement.",
    videoUrl: "https://example.com/video3.mp4",
    thumbnailUrl: "https://images.teamlab-planets.art/2024/planets_3.jpg",
    aiGenerated: {
      theme: "Interactive Light",
      mood: "Dynamic",
      elements: ["pathways", "light", "interaction"]
    }
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
      res.status(500).json({ error: "Failed to fetch videos", details: error instanceof Error ? error.message : "Unknown error" });
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
      res.status(500).json({ error: "Failed to fetch video", details: error instanceof Error ? error.message : "Unknown error" });
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
      res.status(500).json({ error: "Failed to create video", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });
}
