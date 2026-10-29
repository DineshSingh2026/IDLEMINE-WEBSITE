import { community } from "@/data/content/home";
import { socials } from "@/data/content/site";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SubscribeForm } from "./SubscribeForm";

export function CommunitySection() {
  return (
    <Section
      id={community.id}
      ariaLabelledby="community-title"
      className="pt-8 md:pt-12 lg:pt-16"
      blobs={[
        { color: "gold", pos: { top: "55%", left: "30%" }, size: 640, opacity: 0.2 },
        { color: "mint", pos: { top: "60%", left: "80%" }, size: 520, opacity: 0.14 },
      ]}
    >
      <div className="relative rounded-xl bg-gradient-to-br from-gold/40 via-white/[0.08] to-violet/40 p-px">
        <div className="relative overflow-hidden rounded-[31px] bg-[#0a0b12]/90 px-6 py-16 backdrop-blur-xl sm:px-10 md:px-16 md:py-20 lg:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-80 w-[720px] max-w-[140%] -translate-x-1/2 rounded-full bg-gold/20 blur-[110px]" />
            <div className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,#000,transparent)]" />
          </div>

          <RevealGroup className="relative mx-auto flex max-w-[680px] flex-col items-center text-center">
            <RevealItem>
              <Eyebrow>{community.eyebrow}</Eyebrow>
            </RevealItem>
            <Heading id="community-title" className="text-display-l mt-5" highlight={["$IDLE"]}>
              {community.title}
            </Heading>
            <RevealItem>
              <p className="text-body-l mt-6">{community.body}</p>
            </RevealItem>
            <RevealItem className="mt-10 w-full max-w-[520px]">
              <SubscribeForm />
            </RevealItem>
            <RevealItem className="mt-6">
              <ul className="flex flex-wrap justify-center gap-2.5">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-11 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] pl-3 pr-5 text-sm font-medium text-ink-2 transition-[color,border-color,background-color,transform] duration-300 ease-quint hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/[0.06] hover:text-ink"
                    >
                      <span className="flex size-7 items-center justify-center rounded-full bg-white/[0.06] text-ink transition-colors group-hover:bg-gold group-hover:text-[#05080A]">
                        <SocialIcon name={s.key} className="size-3.5" />
                      </span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
