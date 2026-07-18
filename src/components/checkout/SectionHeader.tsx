export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-lg font-bold text-darkroom">{title}</h2>
    </div>
  );
}
