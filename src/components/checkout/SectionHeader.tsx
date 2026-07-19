export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-darkroom">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-darkroom/55">{subtitle}</p>}
    </div>
  );
}
