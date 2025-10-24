"use client";

import { Button } from "@/components/common";
import { IconArrowRight } from "@/components/common/icons";
import { createClient } from "@/utils/supabase/client";

export default function ErrorPage({
  error,
  reset: _reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const supabase = createClient();

  const handleGoToLogin = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <div className="mt-[3.75rem]">
      <div className="text-center">
        <h2 className="text-[1.5rem] font-bold mb-4">비정상적인 접근방식</h2>
        <p className="mb-10 whitespace-pre-line leading-[1.5]">
          {error.message}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleGoToLogin}>
            로그인 페이지로 이동
            <IconArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
