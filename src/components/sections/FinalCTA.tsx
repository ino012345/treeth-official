import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { CpuArchitecture } from "@/components/ui/CpuArchitecture";
import { ContactForm } from "@/components/ui/ContactForm";

// ─── Component ────────────────────────────────────────────────────────────────
// id="contact" anchors every href="#contact" link on the page.

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="px-6 py-24 md:px-8 md:py-32 bg-zinc-950"
    >
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* ── Left: CPU visual + heading ───────────────────────────── */}
            <AnimatedItem className="flex-1 flex flex-col items-center lg:items-start gap-8 text-center lg:text-left">
              <CpuArchitecture />
              <div className="flex flex-col gap-4">
                <EyebrowBadge>CONTACT</EyebrowBadge>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-white leading-[1.1]">
                  Ready to Build Your
                  <br />
                  Digital Core?
                </h2>
                <p className="text-base text-white/60 leading-relaxed max-w-[42ch]">
                  圧倒的なパフォーマンスと洗練されたデザインで、あなたのビジネスを次のステージへ。
                  プロジェクトのご相談・無料お見積もりはこちらからどうぞ。
                </p>
              </div>
            </AnimatedItem>

            {/* ── Right: contact form ──────────────────────────────────── */}
            <AnimatedItem className="w-full lg:max-w-md">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[20px] p-8">
                <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-500 mb-1">
                  Get in Touch
                </p>
                <h3 className="text-base font-semibold text-white mb-6">
                  お問い合わせ
                </h3>
                <ContactForm />
              </div>
            </AnimatedItem>

          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
