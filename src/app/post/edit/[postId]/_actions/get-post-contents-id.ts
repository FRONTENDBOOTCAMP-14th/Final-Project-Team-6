import { createClient } from "@/utils/supabase/server";

export default async function getPostContents(postId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();
  if (error) throw new Error(`작성된 포스트 게시글 정보를 불러올 수 없습니다.`);

  return data;
}
