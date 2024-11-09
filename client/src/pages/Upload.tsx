import { VideoUploader } from "@/components/VideoUploader";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Upload() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline">← Back</Button>
          </Link>
          <h1 className="font-kaisei text-3xl font-bold text-primary">
            Upload Video
          </h1>
        </div>
        
        <VideoUploader />
      </div>
    </div>
  );
}
