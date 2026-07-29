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
  "Après de nombreuses années passées dans le domaine du tourisme, j'ai eu la chance de découvrir de nombreux pays, de belles cultures et de vivre des expériences humaines enrichissantes, qui m'ont apporté une grande ouverture d'esprit.",
  "Cependant, derrière l'image souvent idéalisée du secteur du tourisme se cachent également des exigences importantes, une pression constante et un rythme de travail parfois difficile à concilier avec son équilibre personnel. Au fil des années, le stress s'est installé durablement dans mon quotidien.",
  "En 2016, j'ai pris la décision de quitter mon emploi afin de retrouver un meilleur équilibre de vie. À l'aube de mes 50 ans, cette période a été marquée par une profonde réflexion sur mon avenir professionnel et sur le sens que je souhaitais donner à la suite de mon parcours.",
  "Animée par le désir d'aider les autres, d'apporter du bien-être et d'accompagner les personnes vers un mieux-être durable, je me suis naturellement tournée vers les approches de pratiques complémentaires et naturelles. C'est alors que j'ai découvert la réflexologie plantaire.",
  "J'ai immédiatement été séduite par cette pratique douce et naturelle, qui permet d'accompagner l'organisme dans sa recherche d'équilibre et d'apporter un soulagement à de nombreux troubles du quotidien. Souhaitant acquérir une formation solide, j'ai intégré en 2017 l'école E.R.V.E. (École de Réflexologie et de Vecteurs Énergétiques), où j'ai suivi un cursus complet de deux années.",
  "À l'issue de cette formation, j'ai rédigé un mémoire consacré à la maladie de Parkinson et obtenu mon certificat en août 2019.",
  "Depuis, je continue d'enrichir mes connaissances avec la même passion, en suivant régulièrement des formations. La réflexologie me fascine par sa capacité à considérer la personne dans sa globalité, en tenant compte à la fois du corps, des émotions et de l'équilibre général de l'organisme.",
  "Aujourd'hui, je suis heureuse d'exercer un métier qui correspond pleinement à mes valeurs : l'écoute, la bienveillance et l'accompagnement de chacun vers un mieux-être naturel.",
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
            className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(43,58,48,0.35)] ring-1 ring-sage-900/10 lg:sticky lg:top-28"
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
