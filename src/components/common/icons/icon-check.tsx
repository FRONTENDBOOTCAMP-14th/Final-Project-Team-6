import type IconType from "./type";

export default function IconCheck({
  color = "currentColor",
  size = 24,
}: IconType) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 10.2201L11 14.2201L9 12.2201M12 21.2201C7.02944 21.2201 3 17.1907 3 12.2201C3 7.24953 7.02944 3.22009 12 3.22009C16.9706 3.22009 21 7.24953 21 12.2201C21 17.1907 16.9706 21.2201 12 21.2201Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
