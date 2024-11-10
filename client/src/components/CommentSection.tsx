import { useState } from "react";
import { useForm } from "react-hook-form";
import { formatDistance } from "date-fns";
import { Crown, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Comment } from "db/schema";
import useSWR, { mutate } from "swr";

interface CommentSectionProps {
  videoId: number;
}

interface CommentForm {
  content: string;
  authorName: string;
}

export function CommentSection({ videoId }: CommentSectionProps) {
  const { data: comments } = useSWR<Comment[]>(`/api/videos/${videoId}/comments`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<CommentForm>();

  const onSubmit = async (data: CommentForm) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      toast({ title: "Success", description: "Comment posted successfully" });
      mutate(`/api/videos/${videoId}/comments`);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-4 p-6">
      <h2 className="text-xl font-semibold text-primary mb-4">コメント</h2>
      
      {/* Admin Comment */}
      <div className="mb-6 border-l-4 border-primary/50 pl-4">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-5 w-5 text-primary" />
          <span className="font-semibold text-primary">支配人より</span>
        </div>
        <p className="text-muted-foreground">
          素晴らしい作品ですね。デジタルアートの新しい地平を切り開く革新的な表現に感銘を受けました。
          視聴者の皆様も、この作品が織りなす幻想的な世界観をお楽しみください。
        </p>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
        <div>
          <Label htmlFor="authorName">お名前</Label>
          <input
            id="authorName"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="あなたのお名前..."
            {...register("authorName", { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="comment">コメントを投稿</Label>
          <Textarea
            id="comment"
            placeholder="あなたの感想を共有しましょう..."
            {...register("content", { required: true })}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "投稿中..." : "投稿"}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <User2 className="h-4 w-4" />
              <span className="font-medium">{comment.authorName}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
              </span>
            </div>
            <p className="text-muted-foreground">{comment.content}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
