import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import useSWR, { mutate } from "swr";
import type { Video } from "db/schema";
import { Heart } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";
import { useToast } from "@/hooks/use-toast";

export default function VideoPage() {
  const { id } = useParams();
  const { data: video } = useSWR<Video>(`/api/videos/${id}`);
  const { toast } = useToast();

  const handleLike = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/videos/${id}/like`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to like video");

      mutate(`/api/videos/${id}`);
      toast({ title: "Success", description: "Video liked!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive",
      });
    }
  };

  if (!video) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>

        <VideoPlayer url={video.videoUrl} />

        <Card className="mt-8 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">
              {video.title}
            </h1>
            <Button
              variant="outline"
              size="icon"
              className="gap-2"
              onClick={handleLike}
            >
              <Heart className={(video.likesCount ?? 0) > 0 ? "fill-primary" : ""} />
              <span>{video.likesCount ?? 0}</span>
            </Button>
          </div>
          <p className="mt-4 text-muted-foreground">{video.description}</p>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-primary">
              AI Generated Content
            </h2>
            <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
              {JSON.stringify(video.aiGenerated, null, 2)}
            </pre>
          </div>
        </Card>

        {id && (
          <div className="mt-8">
            <CommentSection videoId={parseInt(id)} />
          </div>
        )}
      </div>
    </div>
  );
}
