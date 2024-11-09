import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import useSWR from "swr";
import type { Video } from "db/schema";

export default function VideoPage() {
  const { id } = useParams();
  const { data: video } = useSWR<Video>(`/api/videos/${id}`);

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
          <h1 className="font-kaisei text-3xl font-bold text-primary">
            {video.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{video.description}</p>
          
          <div className="mt-8">
            <h2 className="font-kaisei text-xl font-semibold text-primary">
              AI Generated Content
            </h2>
            <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
              {JSON.stringify(video.aiGenerated, null, 2)}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
