import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import type { Video } from "db/schema";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video.id}`}>
      <Card className="group overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="aspect-video overflow-hidden">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-primary line-clamp-2">
            {video.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
