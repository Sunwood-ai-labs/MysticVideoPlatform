import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { processVideo } from "@/lib/video";
import { generateAIContent } from "@/lib/ai";
import { useLocation } from "wouter";

interface UploadForm {
  video: FileList;
  title: string;
  description: string;
}

export function VideoUploader() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { register, handleSubmit, watch } = useForm<UploadForm>();
  const title = watch("title");
  const description = watch("description");

  async function onSubmit(data: UploadForm) {
    try {
      setUploading(true);
      const file = data.video[0];
      
      // Process video and generate thumbnail
      const { videoUrl, thumbnailUrl } = await processVideo(file);
      
      // Only generate AI content if title or description is empty
      let finalTitle = data.title;
      let finalDescription = data.description;
      let aiGenerated = null;

      if (!data.title || !data.description) {
        const aiContent = await generateAIContent(file.name);
        aiGenerated = aiContent;
        finalTitle = data.title || aiContent.title;
        finalDescription = data.description || aiContent.description;
      }
      
      // Upload to server
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          description: finalDescription,
          videoUrl,
          thumbnailUrl,
          aiGenerated: aiGenerated || { generated: false },
        }),
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      toast({ title: "Success", description: "Video uploaded successfully" });
      setLocation("/");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="video">Choose Video</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              disabled={uploading}
              {...register("video", { required: true })}
            />
          </div>

          <div>
            <Label htmlFor="title">Title (optional - AI will generate if empty)</Label>
            <Input
              id="title"
              type="text"
              disabled={uploading}
              placeholder="Enter video title..."
              {...register("title")}
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional - AI will generate if empty)</Label>
            <Textarea
              id="description"
              disabled={uploading}
              placeholder="Enter video description..."
              {...register("description")}
            />
          </div>
          
          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Uploading...
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
