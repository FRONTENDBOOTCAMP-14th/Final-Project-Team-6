export default function InfoItem({
  label,
  value,
}: {
  label: string | number;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[var(--color-site-gray)] text-sm">{label}</span>
      <span className=" text-[var(--color-site-white)] text-base">{value}</span>
    </div>
  );
}
