import { VideoGrid } from "@/components/VideoGrid";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import useSWR from "swr";
import type { Video } from "db/schema";

export default function Home() {
  const { data: videos } = useSWR<Video[]>("/api/videos");

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">
            Mystical Videos
          </h1>
          <Link href="/upload">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Upload Video
            </Button>
          </Link>
        </div>
        
        {videos ? (
          <VideoGrid videos={videos} />
        ) : (
          <div className="flex h-96 items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
