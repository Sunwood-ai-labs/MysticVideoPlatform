export async function processVideo(file: File) {
  try {
    // Get thumbnail from server
    const response = await fetch('/api/thumbnail');
    const data = await response.json();
    
    // Create a blob URL for the video
    const videoUrl = URL.createObjectURL(file);
    
    return { 
      videoUrl, 
      thumbnailUrl: data.thumbnailUrl || `https://picsum.photos/seed/${file.name}/800/450`
    };
  } catch (error) {
    console.error('Error processing video:', error);
    return {
      videoUrl: URL.createObjectURL(file),
      thumbnailUrl: `https://picsum.photos/seed/${file.name}/800/450`
    };
  }
}