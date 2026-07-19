import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LEGAL_DOCS, type LegalDoc } from "@/lib/legal";

/** Rendered by every /legal/[slug] route — a clean editorial policy page. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="paper min-h-dvh">
      <div className="container-px mx-auto max-w-3xl pt-28 pb-24 sm:pt-32">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="eyebrow flex items-center gap-2 text-darkroom/50"
        >
          <Link href="/" className="transition-colors hover:text-darkroom">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-darkroom">{doc.title}</span>
        </nav>

        <header className="mt-6 border-b border-darkroom/15 pb-8">
          <h1 className="display text-[clamp(2rem,5vw,3rem)] text-darkroom">
            {doc.title}
          </h1>
          <p className="mt-3 text-sm text-darkroom/50">
            Last updated: {doc.updated}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-darkroom/70">
            {doc.intro}
          </p>
        </header>

        <div className="mt-10 space-y-9">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold text-darkroom">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((para, i) => (
                  <p
                    key={i}
                    className="text-[0.95rem] leading-relaxed text-darkroom/75"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Cross-links to the other policies */}
        <div className="mt-14 border-t border-darkroom/15 pt-8">
          <p className="eyebrow text-darkroom/45">More policies</p>
          <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
              <Link
                key={d.slug}
                href={`/legal/${d.slug}`}
                className="text-sm font-semibold text-darkroom/60 transition-colors hover:text-darkroom"
              >
                {d.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
