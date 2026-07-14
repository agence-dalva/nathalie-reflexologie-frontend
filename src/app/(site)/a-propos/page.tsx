import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Le parcours de Nathalie OHL, praticienne en réflexologie certifiée E.R.V.E à Altkirch.",
};

const paragraphs = [
  "J'ai effectué ma carrière professionnelle dans le domaine du tourisme. Mon travail m'a permis de découvrir de nombreux horizons, et d'acquérir une ouverture d'esprit par les nombreuses expériences de mes voyages.",
  "Toutefois le milieu du tourisme, que bon nombre pensent être un domaine de « rêve », a subi bien des changements ces dernières années, et la pression et le stress en font également partie.",
  "J'ai décidé en 2016 de quitter mon emploi, ne supportant plus ce stress permanent qui me rongeait à petit feu.",
  "Mais j'arrivais à la veille de mes 50 ans et je dus faire face à une grande remise en question ! Que vais-je faire de mon avenir professionnel ?",
  "Souhaitant AIDER les personnes, leur apporter BIEN-ÊTRE et MIEUX-ÊTRE, j'ai orienté mes recherches vers les techniques douces, et j'ai découvert la réflexologie plantaire, qui par sa possibilité de soulager/aider les personnes souffrant de maux divers, m'a totalement séduite. À la recherche d'une école pouvant m'apporter une formation sérieuse, j'ai découvert l'école E.R.V.E.",
  "Et c'est ainsi qu'en 2017, j'ai décidé de m'engager dans une formation de 2 ans à l'école E.R.V.E.",
  "J'ai, au terme de ma formation, rédigé un mémoire sur la maladie de Parkinson, et obtenu mon certificat en août 2019.",
  "L'envie d'enrichir mes connaissances, d'appréhender le corps et l'esprit dans son entier par une technique fascinante m'a motivée, et je suis heureuse d'avoir fait ce choix pour continuer mon chemin de vie.",
];

export default function AProposPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-4 sm:pt-36 sm:pb-8">
        <Container>
          <Reveal variant="fade">
            <p className="text-center text-[0.72rem] font-medium tracking-widest-plus text-sage-500 uppercase">
              Mon parcours
            </p>
          </Reveal>
          <Reveal variant="blur" delay={0.1} duration={1.1}>
            <h1 className="mt-5 text-center font-display text-[2.75rem] leading-[1.1] font-light text-sage-900 sm:text-6xl">
              À propos de moi
            </h1>
          </Reveal>
        </Container>
      </section>

      {/* Portrait + story */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
          <Reveal
            variant="blur"
            className="relative aspect-4/5 overflow-hidden lg:sticky lg:top-28"
          >
            <Image
              src="/images/a-propos/a-propos-nathali.jpg"
              alt="Nathalie OHL, réflexologue"
              fill
              sizes="(min-width: 1024px) 35vw, 90vw"
              className="object-cover object-[50%_30%]"
              preload
            />
          </Reveal>

          <div>
            <div className="space-y-6">
              {paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.03}>
                  <p
                    className={
                      i === 0
                        ? "font-display text-2xl leading-normal font-light text-sage-800"
                        : "leading-relaxed text-stone-600"
                    }
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="mt-12">
                <LinkButton href="/reservation" size="lg">
                  Prendre rendez-vous
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
