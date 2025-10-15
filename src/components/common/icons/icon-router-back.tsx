import type IconType from "./type";

export default function IconRouterBack({
  color = "currentColor",
  size = 40,
}: IconType) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.6265 12.6258C23.017 12.2355 23.6501 12.2353 24.0405 12.6258C24.4308 13.0163 24.4308 13.6494 24.0405 14.0399L18.0806 19.9989L24.0405 25.9588C24.4309 26.3492 24.4307 26.9823 24.0405 27.3729C23.65 27.7634 23.017 27.7634 22.6265 27.3729L15.9595 20.7069C15.772 20.5194 15.6666 20.2649 15.6665 19.9998C15.6665 19.7347 15.772 19.4803 15.9595 19.2928L22.6265 12.6258Z"
        fill={color}
      />
    </svg>
  );
}
