"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Address } from "@/app/post/write/address-type";

declare global {
  interface DaumPostcodeEmbedOptions {
    oncomplete: (data: Address) => void;
    onclose: () => void;
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

interface DaumPostcodeProps {
  onComplete: (data: Address) => void;
  onClose: () => void;
}

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

    return () => {
      const existingScript = document.getElementById("daum-postcode-script");
      if (existingScript) {
      }
    };
  }, [openPostcode]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="relative bg-white rounded-lg shadow-xl"
        style={{ width: "100%", maxWidth: "500px", height: "600px" }}
      >
        <div ref={postcodeContainerRef} className="w-full h-full" />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default DaumPostcode;
