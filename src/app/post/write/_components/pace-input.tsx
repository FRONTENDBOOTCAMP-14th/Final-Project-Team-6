"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/common/index";

export default function PaceInput() {
  const [paceMinutes, setPaceMinutes] = useState("");
  const [paceSeconds, setPaceSeconds] = useState("");

  const totalPaceInSeconds =
    (Number(paceMinutes) || 0) * 60 + (Number(paceSeconds) || 0);

  return (
    <div>
      <label
        htmlFor="paceMinutes"
        className="block text-sm font-medium mb-[4px] text-[var(--color-site-gray)]"
      >
        페이스 (km당)
      </label>
      <div className="flex items-center gap-2">
        <Input
          id="paceMinutes"
          name="paceMinutes" // 폼 데이터에 포함시킬 수 있지만, pace만 써도 무방
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="예: 6"
          value={paceMinutes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPaceMinutes(e.target.value)
          }
          suffixText="분"
        />
        <Input
          name="paceSeconds" // 폼 데이터에 포함시킬 수 있지만, pace만 써도 무방
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="예: 30"
          value={paceSeconds}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPaceSeconds(e.target.value)
          }
          suffixText="초"
        />
      </div>
      {/* 실제 폼으로 전송될 숨겨진 값 */}
      <input type="hidden" name="pace" value={totalPaceInSeconds} />
    </div>
  );
}
