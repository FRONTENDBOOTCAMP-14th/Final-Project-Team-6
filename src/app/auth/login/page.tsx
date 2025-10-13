import { signIn } from "@/app/auth/action";
import { Button } from "@/components/common";

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-5">
      <div>
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border"
        />
      </div>
      <div>
        <label htmlFor="password">패스워드</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border"
        />
      </div>
      <Button formAction={signIn} fullWidth height="medium">
        로그인
      </Button>
    </form>
  );
}
