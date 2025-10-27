"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import { updateProfile } from "@/app/auth/_actions/auth-action";
import { checkNickname } from "@/app/auth/_actions/check-nickname";
import DuplicateCheckInput from "@/app/auth/_components/duplicate-check-input";
import { Button, Loading } from "@/components/common";
import { IconCheck, IconClose, IconEdit } from "@/components/common/icons";
import { siteHexColor } from "@/constant";
import { useDialog } from "@/stores/use-dialog";
import { createClient } from "@/utils/supabase/client";
import tw from "@/utils/tw";
import { validateNickname } from "@/utils/validators";

export default function ProfileEditContent() {
  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [originalImage, setOriginalImage] = useState(
    "/images/default-profile-image.png",
  );
  const [selectedImage, setSelectedImage] = useState(
    "/images/default-profile-image.png",
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  // dialog
  const { closeDialog, openDialog } = useDialog();

  const profileImages = [
    "/images/default-profile-image.png",
    "/images/template-user-image-01.png",
    "/images/template-user-image-02.png",
    "/images/template-user-image-03.png",
    "/images/template-user-image-04.png",
  ];

  // 현재 프로필 데이터 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname, profile_image_url")
          .eq("id", user.id)
          .single();

        if (profile) {
          const currentNickname = profile.nickname || "";

          setNickname(currentNickname);
          setOriginalNickname(currentNickname);
          setIsNicknameChecked(true);

          const imageUrl = profile.profile_image_url?.startsWith("/")
            ? profile.profile_image_url
            : `/images/${profile.profile_image_url || "default-profile-image.png"}`;

          setSelectedImage(imageUrl);
          setOriginalImage(imageUrl);
        }
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  // 닉네임 중복 확인
  const handleNicknameCheck = async (nickname: string) => {
    const formData = new FormData();
    formData.append("nickname", nickname);
    const result = await checkNickname(formData);

    if (result?.available) {
      setIsNicknameChecked(true);
    }

    return result;
  };

  // 닉네임 변경 시 기존 닉네임과 비교 후 중복확인 상태 초기화,
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    if (newNickname === originalNickname) {
      setIsNicknameChecked(true);
    } else {
      setIsNicknameChecked(false);
    }
  };

  // 닉네임, 프로필 이미지 미 변경 시 비활성화
  useEffect(() => {
    const nicknameChanged = nickname !== originalNickname;
    const imageChanged = selectedImage !== originalImage;

    if (nicknameChanged || imageChanged) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [nickname, originalNickname, selectedImage, originalImage]);

  // 프로필 이미지 목록 팝업창
  const handleImageSelect = () => {
    let tempSelection = selectedImage;

    openDialog("custom", {
      content: (
        <div>
          <DialogTitle className="text-2xl font-bold mb-6">
            프로필 이미지 선택
          </DialogTitle>

          <DialogDescription className="sr-only">
            원하는 프로필 이미지를 선택해주세요
          </DialogDescription>

          <div className="mb-10">
            <div className="grid grid-cols-3 gap-x-2 gap-y-4">
              {profileImages.map((image) => (
                <label key={image} className="cursor-pointer m-auto">
                  <picture className="relative block">
                    <Image
                      src={image}
                      alt="프로필 이미지"
                      width={50}
                      height={50}
                      className="w-[5rem] object-cover"
                      priority
                    />
                    <input
                      type="radio"
                      name="profileImage"
                      value={image}
                      defaultChecked={image === selectedImage}
                      onChange={(e) => {
                        tempSelection = e.target.value;
                      }}
                      className="absolute top-0 left-0 cursor-pointer w-full h-full appearance-none rounded-full checked:outline-4 checked:outline-site-blue"
                    />
                  </picture>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => {
                setSelectedImage(tempSelection);
                closeDialog();
              }}
            >
              적용 <IconCheck />
            </Button>
            <Button onClick={closeDialog} buttonColor={siteHexColor.gray}>
              취소 <IconClose />
            </Button>
          </div>
        </div>
      ),
    });
  };

  const handleSubmit = async (formData: FormData) => {
    if (nickname !== originalNickname && !isNicknameChecked) {
      openDialog("alert", {
        message: "닉네임 중복확인을 해주세요.",
      });

      return;
    }
    const imageFileName = selectedImage.replace(/^\/images\//, "");
    formData.append("profile_image_url", imageFileName);
    await updateProfile(formData);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mt-[3.75rem]">
      <form action={handleSubmit}>
        <figure className="relative mb-6">
          <picture
            className={tw(
              "overflow-hidden block relative text-center bg-[var(--color-site-gray)] w-[6.25rem] h-[6.25rem] m-auto rounded-full",
            )}
          >
            <Image
              src={selectedImage}
              alt="프로필 이미지"
              width={100}
              height={100}
              className="w-full h-full object-cover"
              priority
            />
          </picture>
          <figcaption className="sr-only">프로필 이미지</figcaption>
          <button
            type="button"
            aria-label="프로필 이미지 목록 팝업창 이동"
            onClick={handleImageSelect}
            className="absolute left-1/2 -translate-1/2"
          >
            <IconEdit />
          </button>
        </figure>

        {/* 닉네임 입력 */}
        <DuplicateCheckInput
          label="닉네임"
          name="nickname"
          type="text"
          placeholder="닉네임을 입력해주세요."
          value={nickname}
          onChange={handleNicknameChange}
          onCheck={handleNicknameCheck}
          validate={validateNickname}
          required
        />

        <Button
          type="submit"
          className={tw(
            "mt-10",
            isDisabled
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "pointer-events-auto",
          )}
          height="medium"
          fullWidth={true}
          disabled={isDisabled}
        >
          완료
          <IconCheck />
        </Button>
      </form>
    </div>
  );
}
