import { tw } from "@/utils";
import SignupForm from "./_components/signup-form";

export default function SiginUpPage() {
  return (
    <div className="mt-[3.75rem]">
      <h1 className={tw("text-[2rem] leading-[1.5] font-bold mb-10")}>
        회원가입
      </h1>
      <SignupForm />
    </div>
  );
}
