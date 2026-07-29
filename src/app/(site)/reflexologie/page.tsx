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
    period: "Vers 2 300 av. J.-C.",
    text: "Une fresque découverte dans le tombeau du médecin Ankhmahor, en Égypte, représente des personnes recevant des soins sur les pieds et les mains. Il s'agit de l'une des plus anciennes traces connues de cette pratique.",
  },
  {
    period: "Environ 2 000 av. J.-C.",
    text: "Des techniques de stimulation des pieds et des mains sont également évoquées dans les traditions chinoises et indiennes, où elles s'inscrivent dans une approche globale de l'équilibre du corps et de l'énergie.",
  },
  {
    period: "1913",
    text: "Le médecin américain William H. Fitzgerald développe la théorie des « zones réflexes », selon laquelle le corps est divisé en dix zones longitudinales reliées entre elles.",
  },
  {
    period: "Années 1930",
    text: "Eunice Ingham (1889–1974), physiothérapeute américaine, approfondit les travaux de Fitzgerald. Elle établit la cartographie des zones réflexes des pieds et met au point la réflexologie plantaire moderne telle qu'elle est pratiquée aujourd'hui.",
  },
  {
    period: "À partir des années 1970",
    text: "La réflexologie connaît un essor important en Europe, notamment en France, en Belgique et en Suisse, où elle se développe comme une approche complémentaire de bien-être.",
  },
  {
    period: "1997",
    text: "Joëlle et Jean-Paul Barbier créent l'école E.R.V.E — École de Réflexologie et de Vecteurs Énergétiques, école d'où Nathalie est certifiée.",
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
              Nos pieds sont le miroir de notre corps.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 leading-relaxed text-stone-600">
              La réflexologie est une technique manuelle qui repose sur le
              principe que les pieds, les mains et le visage sont en lien avec
              l&apos;ensemble du corps par l&apos;intermédiaire du système
              nerveux. Nous avons sur nos pieds plus de 7200 terminaisons
              nerveuses. La cartographie de notre organisme est représentée en
              totalité sur nos deux pieds, que ce soit les organes, les
              articulations, les muscles et les glandes.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 leading-relaxed text-stone-600">
              Par des pressions ciblées sur des points et zones réflexes, le
              réflexologue envoie des informations au système nerveux. Celui-ci
              joue un rôle essentiel dans la transmission des messages entre le
              cerveau et les différents organes, ainsi que dans la régulation
              des grandes fonctions de l&apos;organisme.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 leading-relaxed text-stone-600">
              Cette stimulation favorise une réponse naturelle du corps, et
              permet à l&apos;organisme de mobiliser ses propres capacités pour
              retrouver un équilibre, un état de bien-être.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Details */}
      <section className="bg-sage-900 py-24 sm:py-32">
        <Container className="max-w-4xl">
          <div className="space-y-16 sm:space-y-20">
            <Reveal className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <h2 className="text-[0.7rem] font-medium tracking-widest-plus text-sage-300 uppercase">
                La sensibilité
              </h2>
              <p className="leading-relaxed text-sage-100">
                La pression exercée sur certains points et zones réflexes peut
                être ressentie comme sensible, voire plus intense. Cette
                sensibilité varie d&apos;une personne à l&apos;autre et
                d&apos;une séance à l&apos;autre. Elle constitue pour le
                réflexologue un élément d&apos;observation parmi d&apos;autres,
                sans pour autant permettre d&apos;établir un diagnostic.
              </p>
            </Reveal>

            <Reveal className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <h2 className="text-[0.7rem] font-medium tracking-widest-plus text-sage-300 uppercase">
                Les réactions
              </h2>
              <p className="leading-relaxed text-sage-100">
                Lors de la séance, certaines zones réflexes peuvent présenter
                une sensibilité particulière ou des différences de texture et de
                souplesse, des tensions, des cristaux, des grains de sable, etc.
                Le réflexologue perçoit ces réactions par le toucher et les
                prend en compte pour adapter son travail.
              </p>
            </Reveal>

            <Reveal className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <h2 className="text-[0.7rem] font-medium tracking-widest-plus text-sage-300 uppercase">
                L&apos;objectif
              </h2>
              <p className="leading-relaxed text-sage-100">
                La réflexologie va favoriser la détente profonde, aider à
                relâcher les tensions, permettre d&apos;évacuer les toxines
                fabriquées par notre corps et soutenir les capacités naturelles
                d&apos;autorégulation de l&apos;organisme. Elle accompagne
                chacun dans sa recherche d&apos;un meilleur équilibre physique,
                émotionnel et énergétique, afin de retrouver une sensation
                d&apos;harmonie et de bien-être.
              </p>
            </Reveal>

            <Reveal
              variant="blur"
              className="border-t border-sage-700/50 pt-12 text-center"
            >
              <p className="mx-auto max-w-2xl font-display text-2xl leading-normal font-light text-cream sm:text-3xl">
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
              title="De nombreux maux apaisés !"
              align="center"
              description="La réflexologie plantaire peut contribuer à apaiser certains inconforts du quotidien et à améliorer le bien-être général. Elle s'inscrit dans une démarche complémentaire de prévention et de relaxation."
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
          <Reveal delay={0.15}>
            <p className="mx-auto mt-10 max-w-2xl text-center leading-relaxed text-stone-500 italic">
              Et de nombreux autres bienfaits…
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-stone-500">
              La réflexologie agit en prévention, permet de renforcer les
              défenses immunitaires, redonne tonus et énergie, apporte bien-être
              et sérénité !
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
              title="Une pratique ancestrale"
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
      <section className="py-28 text-center sm:py-40">
        <Container>
          <Reveal variant="blur">
            <h2 className="font-display text-4xl leading-tight font-light text-sage-800 sm:text-5xl">
              Envie d&apos;en faire l&apos;expérience ?
            </h2>
          </Reveal>
          <Reveal variant="fade" delay={0.2}>
            <div className="mt-10">
              <LinkButton
                href="/reservation"
                size="lg"
                className="px-11 py-5 text-base"
              >
                Prendre rendez-vous
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
