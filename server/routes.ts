import type { Express } from "express";
import { db } from "../db";
import { videos, comments } from "../db/schema";
import { eq, sql } from "drizzle-orm";

// Existing getUnsplashImage function...

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
    },
    likesCount: 0
  }
];

export function registerRoutes(app: Express) {
  // Existing routes...

  // Get video comments
  app.get("/api/videos/:id/comments", async (req, res) => {
    try {
      const videoComments = await db
        .select()
        .from(comments)
        .where(eq(comments.videoId, parseInt(req.params.id)))
        .orderBy(comments.createdAt);
      
      res.json(videoComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Create comment
  app.post("/api/videos/:id/comments", async (req, res) => {
    try {
      const comment = await db
        .insert(comments)
        .values({
          videoId: parseInt(req.params.id),
          authorName: req.body.authorName,
          content: req.body.content,
          isAdmin: false,
        })
        .returning();
      
      res.json(comment[0]);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Like video
  app.post("/api/videos/:id/like", async (req, res) => {
    try {
      const video = await db
        .update(videos)
        .set({
          likesCount: sql`${videos.likesCount} + 1`,
        })
        .where(eq(videos.id, parseInt(req.params.id)))
        .returning();
      
      res.json(video[0]);
    } catch (error) {
      console.error('Error liking video:', error);
      res.status(500).json({ error: "Failed to like video" });
    }
  });
}
