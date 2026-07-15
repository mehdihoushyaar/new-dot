import { PostDetail } from "@/widgets/post-detail";

interface Props {
  params: Promise<{ username: string; postId: string }>;
}

export default async function PostPage({ params }: Props) {
  const { postId } = await params;
  return <PostDetail postId={postId} />;
}
