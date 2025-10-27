"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Address } from "@/app/post/write/address-type";

declare global {
  interface DaumPostcodeEmbedOptions {
    oncomplete: (data: Address) => void;
    onclose: () => void;
    theme?: DaumPostcodeTheme;
  }

  interface DaumPostcodeInstance {
    embed(element: HTMLElement): void;
  }

  interface Daum {
    Postcode: new (options: DaumPostcodeEmbedOptions) => DaumPostcodeInstance;
  }

  interface Window {
    daum: Daum;
  }
}

interface DaumPostcodeTheme {
  bgColor?: string; // 바탕 배경색
  searchBgColor?: string; // 검색창 배경색
  contentBgColor?: string; // 본문 배경색
  pageBgColor?: string; // 페이지 배경색
  textColor?: string; // 기본 글자색
  queryTextColor?: string; // 검색창 글자색
  postcodeTextColor?: string; // 우편번호 글자색
  emphTextColor?: string; // 강조 글자색
  outlineColor?: string; // 테두리
}

interface DaumPostcodeProps {
  onComplete: (data: Address) => void;
  onClose: () => void;
}

const darkTheme: DaumPostcodeTheme = {
  bgColor: "#0f0f0f", // var(--color-site-black)
  searchBgColor: "#16171b", // var(--color-site-lightblack)
  contentBgColor: "#0f0f0f", // var(--color-site-black)
  pageBgColor: "#0f0f0f", // var(--color-site-black)
  textColor: "#FFFFFF", // var(--color-site-white)
  queryTextColor: "#FFFFFF", // var(--color-site-white)
  postcodeTextColor: "#f8e362", // var(--color-site-yellow)
  emphTextColor: "#f8e362", // var(--color-site-yellow)
  outlineColor: "#878b94", // var(--color-site-gray)
};

function DaumPostcode({ onComplete, onClose }: DaumPostcodeProps) {
  const postcodeContainerRef = useRef<HTMLDivElement>(null);

  const openPostcode = useCallback(() => {
    if (window.daum && postcodeContainerRef.current) {
      new window.daum.Postcode({
        oncomplete: (data: Address) => {
          onComplete(data);
          onClose();
        },
        onclose: () => {
          onClose();
        },
        theme: darkTheme,
      }).embed(postcodeContainerRef.current);
    }
  }, [onComplete, onClose]);

  useEffect(() => {
    if (document.getElementById("daum-postcode-script")) {
      openPostcode();
      return;
    }

    const script = document.createElement("script");
    script.id = "daum-postcode-script";
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => {
      openPostcode();
    };
    document.head.appendChild(script);
  }, [openPostcode]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="relative bg-[var(--color-site-black)] rounded-lg shadow-xl"
        style={{ width: "100%", maxWidth: "500px", height: "600px" }}
      >
        <div ref={postcodeContainerRef} className="w-full h-full" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-[var(--color-site-gray)] hover:text-[var(--color-site-white)] text-2xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default DaumPostcode;
