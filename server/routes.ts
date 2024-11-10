import type { Express } from "express";
import { db } from "../db";
import { videos } from "../db/schema";
import { eq } from "drizzle-orm";

// Function to get a random Unsplash image
async function getUnsplashImage() {
  try {
    const response = await fetch('https://api.unsplash.com/photos/random?query=abstract,nature&orientation=landscape', {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.urls.regular;
    }
    throw new Error('Failed to fetch from Unsplash');
  } catch (error) {
    console.error('Unsplash API error:', error);
    return 'https://picsum.photos/seed/fallback/800/450';
  }
}

const sampleVideos = [
  {
    title: "Mystical Garden",
    description: "神秘的なデジタルガーデンへの旅。光と色彩が織りなす幻想的な空間で、自然とテクノロジーが融合した新しい体験が広がります。デジタルアートが創り出す無限の可能性を探索してください。",
    videoUrl: "https://example.com/video1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518818419601-72c8673f5852",
    aiGenerated: { 
      generated: true,
      elements: ["光のパターン", "デジタルフローラ"],
      theme: "Digital Dreamscape",
      mood: "幻想的",
      insight: "デジタルアートと自然の調和が織りなす、新しい次元の体験を表現しています。"
    }
  }
];

export function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  // Get thumbnail URL
  app.get("/api/thumbnail", async (req, res) => {
    try {
      const thumbnailUrl = await getUnsplashImage();
      res.json({ thumbnailUrl });
    } catch (error) {
      console.error('Error getting thumbnail:', error);
      res.status(500).json({ error: "Failed to get thumbnail", thumbnailUrl: 'https://picsum.photos/seed/fallback/800/450' });
    }
  });

  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      console.log("Fetching all videos...");
      const allVideos = await db.select().from(videos).orderBy(videos.createdAt);
      
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
