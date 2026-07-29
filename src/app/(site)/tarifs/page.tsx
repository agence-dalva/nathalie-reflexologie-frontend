import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { getServices } from "@/lib/api";
import type { Service } from "@/lib/api";
import { formatDuration, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Découvrez les tarifs des séances de réflexologie plantaire, palmaire, crânio-faciale et massage assis à Altkirch.",
};

// Le backend n'est pas forcément joignable au moment du build (déploiements découplés) :
// cette page est rendue à la demande plutôt qu'en SSG.
export const dynamic = "force-dynamic";

const steps = [
  "La séance débute par un échange afin de mieux comprendre vos besoins, vos éventuels troubles et votre état général. À partir de ces informations, un protocole personnalisé est mis en place.",
  "J'exerce ensuite des pressions spécifiques sur les points et les zones réflexes des pieds. Certains points peuvent se révéler plus sensibles que d'autres, reflétant des déséquilibres ou des tensions de l'organisme. Tout au long de la séance, je reste attentive à vos ressentis et adapte la pression à votre sensibilité afin que le soin soit à la fois efficace, confortable et agréable.",
  "La séance se poursuit par un drainage sur le pied, qui a pour but de favoriser l'élimination des toxines libérées lors de la première partie du soin et de stimuler la circulation des fluides dans l'organisme.",
  "Et pour finir, un massage tout en douceur vient clôturer la séance. Ce moment privilégié permet de prolonger l'état de relaxation profonde et d'offrir une agréable sensation de bien-être, de calme et de légèreté.",
];

const featuredImages: Record<string, string> = {
  "Réflexologie plantaire":
    "/images/home/votre-reflexologue/votre-reflexologue-1.jpg",
  "Réflexologie palmaire": "/images/reflexologie/reflexologie-plantaire.jpg",
  "Réflexologie crânio-faciale": "/images/tarifs/cranio-faciale.jpeg",
};

const featuredImagePositions: Record<string, string> = {
  "Réflexologie palmaire": "object-[65%_0%]",
};

const otherServicesOrder = [
  "Réflexologie plantaire — accompagnement oncologie",
  "Réflexologie plantaire bébé / enfant (jusqu'à 11 ans)",
  "Réflexologie plantaire + palmaire",
  "Réflexologie plantaire à domicile",
  "Réflexologie plantaire + massage assis",
  "Forfait 4 séances — suivi réflexologie plantaire",
  "Réflexologie crânio-faciale + palmaire",
  "Réflexologie crânio-faciale + massage assis",
  "Massage assis",
];

const cranioBenefits = [
  "Migraines, céphalées",
  "Problèmes ORL, sinusite, otite",
  "Troubles de l'audition (acouphènes, sifflement d'oreille)",
  "Stress, anxiété",
  "Troubles du sommeil, fatigue",
  "Tensions musculaires (tête, cou, nuque, cervicales, épaule…)",
  "Tensions dans la mâchoire, grincement de dents",
];

export default async function TarifsPage() {
  const services = await getServices();
  const featured = Object.keys(featuredImages)
    .map((name) => services.find((s) => s.name === name))
    .filter((s): s is Service => Boolean(s));
  const featuredIds = new Set(featured.map((s) => s.id));
  const otherServices = services
    .filter((s) => !featuredIds.has(s.id))
    .sort(
      (a, b) =>
        otherServicesOrder.indexOf(a.name) - otherServicesOrder.indexOf(b.name),
    );
  const massageAssisService = services.find((s) => s.name === "Massage assis");

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Services & tarifs"
              title="Des séances adaptées à vos besoins"
              align="center"
            />
          </Reveal>
        </Container>
      </section>

      {/* Featured services — photo cards */}
      {featured.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <Container>
            <RevealGroup
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.08}
            >
              {featured.map((service) => (
                <RevealItem key={service.id}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sage-200/70 bg-white shadow-[0_20px_45px_-15px_rgba(43,58,48,0.2)]">
                    <div className="relative aspect-4/5 overflow-hidden">
                      <Image
                        src={featuredImages[service.name]}
                        alt={service.name}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                          featuredImagePositions[service.name] ?? "object-top"
                        }`}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="font-display text-xl font-normal text-sage-900">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="mt-2 text-sm leading-relaxed text-stone-500">
                          {service.description}
                        </p>
                      )}
                      <div className="mt-6 flex flex-1 items-end justify-between gap-4 border-t border-sage-200/70 pt-5">
                        <div>
                          <span className="font-display text-2xl font-light text-sage-800">
                            {formatPrice(service.price)}
                          </span>
                          <span className="ml-2 text-sm text-stone-400">
                            {formatDuration(service.durationMinutes)}
                          </span>
                        </div>
                        <Link
                          href={`/reservation?service=${service.id}`}
                          className="shrink-0 text-sm font-medium tracking-wide text-sage-600 transition-colors hover:text-sage-900"
                        >
                          Réserver →
                        </Link>
                      </div>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal delay={0.2}>
              <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-stone-500">
                Soins hors d&apos;un cadre réglementé — TVA non applicable,
                article 293 B du C.G.I. Sur rendez-vous, au cabinet ou à
                domicile.
              </p>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Other services — clean list */}
      {otherServices.length > 0 && (
        <section className="bg-sage-900 py-24 sm:py-32">
          <Container className="max-w-3xl">
            <Reveal>
              <SectionHeading
                eyebrow="Et aussi"
                title="Autres prestations proposées"
                tone="light"
              />
            </Reveal>
            <RevealGroup
              className="mt-14 border-t border-sage-700/50"
              stagger={0.05}
            >
              {otherServices.map((service) => (
                <RevealItem key={service.id}>
                  <div className="group flex flex-col gap-3 border-b border-sage-700/50 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                    <div>
                      <h3 className="text-base font-medium text-cream">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="mt-1 text-sm leading-relaxed text-sage-200">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-6">
                      <span className="text-sm text-sage-300">
                        {formatDuration(service.durationMinutes)}
                      </span>
                      <span className="font-display text-lg font-light text-cream">
                        {formatPrice(service.price)}
                      </span>
                      <Link
                        href={`/reservation?service=${service.id}`}
                        className="text-sm font-medium tracking-wide text-sage-200 transition-colors hover:text-cream sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                      >
                        Réserver →
                      </Link>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      )}

      {/* How a session unfolds */}
      <section className="py-24 sm:py-32">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow="Le déroulé"
              title="Comment se déroule une séance"
            />
          </Reveal>
          <RevealGroup className="mt-14 space-y-10">
            {steps.map((step, i) => (
              <RevealItem key={i}>
                <div className="flex gap-6">
                  <span className="font-display text-3xl font-light text-sage-300">
                    0{i + 1}
                  </span>
                  <p className="mt-1 leading-relaxed text-stone-600">{step}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.1}>
            <p className="mt-14 border-l-2 border-terracotta-400 pl-5 text-sm leading-relaxed text-stone-500">
              Important : la réflexologie ne se substitue pas à la médecine
              conventionnelle. Le réflexologue ne peut pas établir de
              diagnostic, modifier un traitement ou participer à une décision
              thérapeutique.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Crânio-faciale highlight */}
      <section className="bg-sage-900 py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal
            variant="blur"
            className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] ring-1 ring-cream/15 lg:order-2"
          >
            <Image
              src="/images/tarifs/cranio-faciale.jpeg"
              alt="Séance de réflexologie crânio-faciale"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </Reveal>
          <div className="lg:order-1">
            <Reveal>
              <SectionHeading
                eyebrow="Zoom sur une technique"
                title="La réflexologie crânio-faciale"
                tone="light"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-sage-100">
                Comme sur les pieds et les mains, on retrouve des zones réflexes
                sur le visage et le crâne. Par des pressions, des rotations, des
                grattages et des lissages, il va y avoir des répercussions sur
                tout le corps. Une séance aide à se relaxer profondément, avec
                un effet calmant et apaisant garanti.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {cranioBenefits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-sage-100"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Réflexologie palmaire highlight */}
      <section className="py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal
            variant="blur"
            className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(43,58,48,0.35)] ring-1 ring-sage-900/10"
          >
            <Image
              src="/images/home/slider/slider-main.jpeg"
              alt="Séance de réflexologie palmaire"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Zoom sur une technique"
                title="La réflexologie palmaire"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-stone-600">
                Comme sur les pieds, la réflexologie peut également se pratiquer
                sur les mains. Celles-ci comportent de nombreuses zones réflexes
                qui représentent l&apos;ensemble du corps : organes, glandes,
                muscles et articulations.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 leading-relaxed text-stone-600">
                Grâce à des pressions précises exercées sur ces zones, le
                réflexologue stimule le système nerveux et favorise les
                mécanismes naturels d&apos;autorégulation de l&apos;organisme.
                Cette stimulation aide le corps à retrouver son équilibre, à
                mieux gérer le stress et à soulager certaines tensions ou
                inconforts du quotidien.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 leading-relaxed text-stone-600">
                La réflexologie palmaire procure une profonde sensation de
                détente tout en agissant sur l&apos;ensemble de
                l&apos;organisme. Elle est particulièrement indiquée pour les
                personnes sensibles des pieds, les seniors, les personnes à
                mobilité réduite ou simplement celles qui préfèrent recevoir un
                soin au niveau des mains.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-4 leading-relaxed text-stone-600">
                Douce, agréable et accessible à tous, la réflexologie palmaire
                permet de bénéficier des mêmes principes et des mêmes bienfaits
                que la réflexologie plantaire, tout en offrant une approche
                différente, pratique et confortable.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Massage assis highlight */}
      <section className="bg-sage-900 py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal
            variant="blur"
            className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] ring-1 ring-cream/15 lg:order-2"
          >
            <Image
              src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1000&q=80"
              alt="Massage assis sur chaise ergonomique"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </Reveal>
          <div className="lg:order-1">
            <Reveal>
              <SectionHeading
                eyebrow="Zoom sur une technique"
                title="Le massage assis"
                tone="light"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-sage-100">
                Le massage assis se pratique sur l&apos;ensemble de la partie
                haute du corps — tête, nuque, cervicales, dos, bras et mains —
                travaillée par un enchaînement précis de pressions, étirements,
                percussions et balayages. Il a une action immédiate : une
                sensation de relaxation générale et une détente physique et
                mentale, qui élimine le stress et les tensions pour un bien-être
                immédiat.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-sm text-sage-300">
                Massage effectué habillé, sur une chaise ergonomique.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8">
                <LinkButton
                  href={
                    massageAssisService
                      ? `/reservation?service=${massageAssisService.id}`
                      : "/reservation"
                  }
                  variant="light"
                  size="lg"
                >
                  Prendre rendez-vous
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Gift card */}
      <section className="py-24 text-center sm:py-32">
        <Container className="max-w-2xl">
          <Reveal>
            <SectionHeading
              eyebrow="Idée cadeau"
              title="Offrez un bon cadeau"
              align="center"
              description="Anniversaires, naissance, fête des mères, fête des pères, Noël, Saint-Valentin, ou pour le plaisir d'offrir… faites plaisir à vos proches en offrant un moment de détente."
            />
          </Reveal>
          <Reveal variant="blur" delay={0.15}>
            <div className="relative mx-auto mt-10 aspect-video max-w-md overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(43,58,48,0.25)]">
              <Image
                src="/images/tarifs/bon-cadeau.jpeg"
                alt="Bon cadeau Nathalie OHL Réflexologue"
                fill
                sizes="(min-width: 640px) 28rem, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal variant="fade" delay={0.2}>
            <div className="mt-10">
              <LinkButton href="/contact" size="lg">
                Me contacter
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
