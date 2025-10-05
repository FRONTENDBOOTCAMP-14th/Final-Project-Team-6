import NextLink from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof NextLink>;

// next/link의 커스텀 기본형 Link 컴포넌트
export default function Link({ href, children, ...props }: Props) {
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}
