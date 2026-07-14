import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { VerticalTimeline } from "@/components/ui/vertical-timeline";
import { LinkButton } from "@/components/ui/button";
import { benefits } from "@/lib/content";

export const metadata: Metadata = {
  title: "La réflexologie",
  description:
    "Qu'est-ce que la réflexologie plantaire ? Bienfaits, histoire et fonctionnement de cette technique manuelle ancestrale.",
};

const history = [
  {
    period: "Antiquité",
    text: "Le document le plus ancien concernant la réflexologie plantaire a été trouvé en Égypte, à l'entrée du tombeau d'Ankhmahor, médecin du pharaon.",
  },
  {
    period: "1872–1942",
    text: "Le Dr William Fitzgerald établit que le corps se divise en dix zones longitudinales, du haut de la tête à l'extrémité des orteils.",
  },
  {
    period: "1879–1974",
    text: "Eunice Ingham, physiothérapeute américaine, approfondit la thérapie des zones réflexes en se consacrant uniquement aux pieds.",
  },
  {
    period: "1997",
    text: "Joëlle et Jean-Paul Barbier créent l'école E.R.V.E — École de Réflexologie et de Vecteurs Énergétiques.",
  },
];

export default function ReflexologiePage() {
  return (
    <>
      {/* Page hero */}
      <section className="relative -mt-28 flex min-h-[70vh] items-end overflow-hidden">
        <Image
          src="/images/reflexologie/reflexologie.jpg"
          alt="Nathalie OHL lors d'une séance de réflexologie plantaire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-sage-900/80 via-sage-900/30 to-sage-900/40" />
        <Container className="relative z-10 w-full pb-20">
          <Reveal variant="fade">
            <p className="text-[0.72rem] font-medium tracking-widest-plus text-cream/80 uppercase">
              Comprendre la technique
            </p>
          </Reveal>
          <Reveal variant="blur" delay={0.15} duration={1.1}>
            <h1 className="mt-5 max-w-3xl font-display text-[2.75rem] leading-[1.1] font-light text-cream sm:text-6xl">
              La réflexologie
            </h1>
          </Reveal>
        </Container>
      </section>

      {/* Intro definition */}
      <section className="py-24 sm:py-32">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="font-display text-2xl leading-normal font-light text-sage-800 sm:text-[1.7rem]">
              Nous avons sur nos pieds plus de 7200 terminaisons nerveuses. La
              cartographie de notre organisme est représentée en totalité sur
              nos deux pieds.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 leading-relaxed text-stone-600">
              La réflexologie plantaire est une technique énergétique qui
              consiste à exercer une pression particulière sur certains points
              et zones du pied, appelés zones et points réflexes, correspondant
              à des organes, des articulations, des muscles, des glandes — dans
              le but de stimuler tout notre organisme.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Details */}
      <section className="bg-sage-50 py-24 sm:py-32">
        <Container className="max-w-4xl">
          <div className="space-y-16 sm:space-y-20">
            <Reveal className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <h2 className="text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase">
                La sensibilité
              </h2>
              <p className="leading-relaxed text-stone-600">
                La pression sur certains points peut être sensible, voire très
                sensible. L&apos;intensité de cette sensibilité est un
                indicateur pour le réflexologue de l&apos;état dans lequel se
                trouve l&apos;organe. Par exemple, si la zone du foie est
                sensible, cela peut signifier que le foie est chargé,
                encombré, qu&apos;une petite détox est nécessaire.
              </p>
            </Reveal>

            <Reveal className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <h2 className="text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase">
                Le blocage
              </h2>
              <p className="leading-relaxed text-stone-600">
                Quand un organe ou une partie du corps fonctionne mal,
                l&apos;énergie est entravée, et ce blocage se répercute sur un
                point précis de la plante du pied. Le réflexologue va pouvoir
                ressentir sous les doigts des tensions, des cristaux, des
                tissus durs, mous, etc.
              </p>
            </Reveal>

            <Reveal className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <h2 className="text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase">
                L&apos;objectif
              </h2>
              <p className="leading-relaxed text-stone-600">
                L&apos;objectif du réflexologue est de localiser les tensions,
                et de permettre à notre corps de se libérer des toxines
                responsables de nombreux maux. La réflexologie va permettre un
                nettoyage de l&apos;intérieur, une détox — et aider notre
                corps à se rééquilibrer, à se renforcer, à mieux faire
                circuler l&apos;énergie vitale nécessaire au bon fonctionnement
                de tout l&apos;organisme.
              </p>
            </Reveal>

            <Reveal variant="blur" className="border-t border-sage-200 pt-12 text-center">
              <p className="mx-auto max-w-2xl font-display text-2xl leading-normal font-light text-sage-800 sm:text-3xl">
                La réflexologie plantaire prend en compte l&apos;être dans sa
                globalité physique, mentale et émotionnelle.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Les bienfaits"
              title="De nombreux maux soulagés"
              align="center"
              description="La réflexologie plantaire va vous aider et soulager de nombreux maux, troubles et pathologies."
            />
          </Reveal>
          <RevealGroup className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-16 gap-y-px sm:grid-cols-2">
            {benefits.map((benefit) => (
              <RevealItem key={benefit.title}>
                <div className="flex items-center gap-5 border-b border-sage-200/60 py-6">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-500" />
                  <span className="text-stone-700">{benefit.title}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-14 max-w-2xl text-center leading-relaxed text-stone-500">
              Elle permet également de renforcer les défenses immunitaires et
              joue un rôle essentiel dans la prévention. Elle apporte une aide
              de confort en réduisant les effets secondaires de la
              chimiothérapie, en soutien pour mieux gérer le stress de la
              maladie.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* History — timeline */}
      <section className="bg-sage-900 py-24 text-cream sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Aux origines"
              title="Une pratique plusieurs fois millénaire"
              align="center"
              tone="light"
            />
          </Reveal>
          <div className="mt-20">
            <VerticalTimeline entries={history} />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 text-center sm:py-32">
        <Container>
          <Reveal variant="blur">
            <h2 className="font-display text-3xl leading-tight font-light text-sage-800 sm:text-4xl">
              Envie d&apos;en faire l&apos;expérience ?
            </h2>
          </Reveal>
          <Reveal variant="fade" delay={0.2}>
            <div className="mt-10">
              <LinkButton href="/reservation" size="lg">
                Prendre rendez-vous
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
