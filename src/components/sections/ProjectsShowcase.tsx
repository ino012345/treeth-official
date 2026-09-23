import Image from "next/image";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

// ─── Project data ─────────────────────────────────────────────────────────────
// `scope` describes what TREETH actually handled — visitors ask "could you do
// my project too?", and the work breakdown answers that better than tags alone.

const PROJECTS = [
  {
    id: "proj-1",
    number: "01",
    title: "合同会社トーラス企画 コーポレートサイト",
    type: "コーポレートサイト",
    industry: "企画・コンサルティング",
    scope: "企画・デザイン・実装・公開",
    featured: true,
  },
  {
    id: "proj-2",
    number: "02",
    title: "合同会社トーラス企画 製品紹介サイト",
    type: "製品紹介サイト",
    industry: "製品プロモーション",
    scope: "デザイン・実装",
  },
  {
    id: "proj-3",
    number: "03",
    title: "中国料理 煖 ホームページ",
    type: "店舗サイト",
    industry: "飲食店",
    scope: "企画・デザイン・実装・公開",
  },
  {
    id: "proj-4",
    number: "04",
    title: "高山産業 コーポレートサイト",
    type: "コーポレートサイト",
    industry: "製造業",
    scope: "企画・デザイン・実装・公開",
  },
  {
    id: "proj-5",
    number: "05",
    title: "岡田薬局 ホームページ",
    type: "店舗サイト",
    industry: "薬局・医療",
    scope: "デザイン・実装・公開",
  },
] as const;

type Project = (typeof PROJECTS)[number];

// ─── Card ─────────────────────────────────────────────────────────────────────
// Hover adds a subtle image scale, but every piece of information is visible
// without hovering — touch devices get the full content with no interaction.

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 transition-colors duration-300 hover:border-zinc-700 ${
        // Featured card splits horizontally on desktop. Stacked, its 16:9 image
        // alone exceeded the viewport height and buried the rest of the grid.
        featured ? "flex h-full flex-col md:flex-row" : "flex h-full flex-col"
      }`}
    >
      <div
        className={`relative aspect-video overflow-hidden bg-zinc-900 ${
          featured ? "w-full md:w-[62%] md:shrink-0" : "w-full"
        }`}
      >
        <Image
          src={`/projects/${project.id}.webp`}
          alt={`${project.title}のスクリーンショット`}
          fill
          sizes={
            featured
              ? "(max-width: 768px) 100vw, (max-width: 1400px) 56vw, 830px"
              : "(max-width: 768px) 100vw, 45vw"
          }
          className="object-cover object-top transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
        />
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 p-6 md:p-7 ${featured ? "md:justify-center" : ""}`}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold tracking-widest text-indigo-300">
            {project.number}
          </span>
          <span className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-[11px] text-zinc-300">
            {project.type}
          </span>
          {featured && (
            // Curatorial label, not a claim about recency — publication dates
            // are not tracked, so "最新" would be unverifiable.
            <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[11px] text-indigo-200">
              PICK UP
            </span>
          )}
        </div>

        <h3
          className={`font-semibold leading-snug tracking-tight text-zinc-50 ${
            featured ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {project.title}
        </h3>

        <dl className={`flex flex-col gap-1.5 pt-2 text-sm ${featured ? "" : "mt-auto"}`}>
          <div className="flex gap-2">
            <dt className="shrink-0 text-zinc-400">業種</dt>
            <dd className="text-zinc-200">{project.industry}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-zinc-400">担当範囲</dt>
            <dd className="text-zinc-200">{project.scope}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
// Server component. This replaced a 500vh scroll-driven canvas tunnel where
// projects swapped themselves as the user scrolled: only one was ever visible,
// they could not be compared, and none of them were reachable by keyboard
// (WCAG 2.1.1 failure). An editorial grid lets visitors browse at their own
// pace and puts every card in normal DOM order. See docs/uiux-audit.md §D.

export function ProjectsShowcase() {
  const [featured, ...rest] = PROJECTS;

  return (
    <section id="projects" className="bg-[var(--background)] px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>
          <AnimatedItem className="mb-12 flex flex-col gap-4 md:mb-16">
            <EyebrowBadge>OUR PROJECTS</EyebrowBadge>
            <h2 className="max-w-[22ch] text-3xl font-semibold leading-[1.1] tracking-tighter text-zinc-50 md:text-5xl">
              制作実績
            </h2>
            <p className="max-w-[48ch] text-lg leading-relaxed text-zinc-300">
              これまでに手がけたコーポレートサイト・店舗サイトの一部をご紹介します。
            </p>
          </AnimatedItem>

          {/* Featured project — full width */}
          <AnimatedItem className="mb-6">
            <ProjectCard project={featured} featured />
          </AnimatedItem>

          {/* Remaining projects — 2 columns on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {rest.map((project) => (
              <AnimatedItem key={project.id} className="h-full">
                <ProjectCard project={project} />
              </AnimatedItem>
            ))}
          </div>

          {/* Next step */}
          <AnimatedItem className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex flex-col gap-1.5">
              <p className="text-lg font-semibold tracking-tight text-zinc-50">
                あなたのサイトもご相談ください
              </p>
              <p className="text-sm leading-relaxed text-zinc-300">
                業種や規模を問わずご相談いただけます。まずはご要望をお聞かせください。
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 transition-colors duration-200 hover:bg-zinc-200"
            >
              無料で相談する
              <ArrowRight size={16} weight="bold" />
            </a>
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}
