import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import type { Video } from "db/schema";
import { useState } from "react";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={`/video/${video.id}`}>
      <Card className="group overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={imageError ? `https://picsum.photos/seed/${video.id}/800/450` : video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-primary line-clamp-2">
            {video.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {video.aiGenerated?.elements?.map((element: string) => (
              <span
                key={element}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {element}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
