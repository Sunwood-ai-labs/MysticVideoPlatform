import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [url]);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video">
        <video
          ref={videoRef}
          controls
          className="h-full w-full"
          preload="metadata"
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </Card>
  );
}
