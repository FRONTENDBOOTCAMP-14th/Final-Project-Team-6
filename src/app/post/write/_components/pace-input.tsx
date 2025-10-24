"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/common/index";

export default function PaceInput() {
  const [paceMinutes, setPaceMinutes] = useState("");
  const [paceSeconds, setPaceSeconds] = useState("");

  const totalPaceInSeconds =
    (Number(paceMinutes) || 0) * 60 + (Number(paceSeconds) || 0);

  const numericRegex = /^[0-9]*$/;

  return (
    <div>
      <label
        htmlFor="paceMinutes"
        className="block text-sm font-medium mb-2 text-[var(--color-site-gray)]"
      >
        페이스 (km당)
      </label>
      <div className="flex items-center gap-2">
        <Input
          id="paceMinutes"
          name="paceMinutes"
          type="text"
          inputMode="numeric"
          placeholder="예: 6"
          value={paceMinutes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (numericRegex.test(value)) {
              setPaceMinutes(value);
            }
          }}
          suffixText="분"
        />
        <Input
          name="paceSeconds"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="예: 30"
          value={paceSeconds}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (numericRegex.test(value)) {
              setPaceSeconds(value);
            }
          }}
          suffixText="초"
        />
      </div>
      <input type="hidden" name="pace" value={totalPaceInSeconds} />
    </div>
  );
}
