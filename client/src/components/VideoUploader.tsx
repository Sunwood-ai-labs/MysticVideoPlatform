import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { processVideo } from "@/lib/video";
import { generateAIContent } from "@/lib/ai";
import { useLocation } from "wouter";

export function VideoUploader() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { register, handleSubmit } = useForm();

  async function onSubmit(data: any) {
    try {
      setUploading(true);
      const file = data.video[0];
      
      // Process video and generate thumbnail
      const { videoUrl, thumbnailUrl } = await processVideo(file);
      
      // Generate AI content
      const aiContent = await generateAIContent(file.name);
      
      // Upload to server
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aiContent.title,
          description: aiContent.description,
          videoUrl,
          thumbnailUrl,
          aiGenerated: aiContent,
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
