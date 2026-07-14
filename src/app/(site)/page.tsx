import Image from "next/image";
import { Brain, Bone, Droplets, Moon, Waves, Wind } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { HeroSlider, type HeroSlide } from "@/components/ui/hero-slider";
import { ImageSlider, type SliderImage } from "@/components/ui/image-slider";
import { benefits, testimonials } from "@/lib/content";
import { formatReviewerName } from "@/lib/format";

const heroSlides: HeroSlide[] = [
  {
    src: "/images/home/slider/slider-1.jpeg",
    alt: "Séance de réflexologie crânio-faciale",
  },
  {
    src: "/images/home/slider/slider-2.jpeg",
    alt: "Détente des pieds en famille",
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80",
    alt: "Détente et sérénité",
  },
];

const benefitIcons = {
  "Migraines, céphalées": Brain,
  "Douleurs articulaires et musculaires": Bone,
  "Stress, sommeil, fatigue, anxiété": Moon,
  "Troubles digestifs": Waves,
  "Circulation sanguine et lymphatique": Droplets,
  "Troubles respiratoires": Wind,
} as const satisfies Record<(typeof benefits)[number]["title"], unknown>;

const detenteSlides: SliderImage[] = [
  {
    src: "/images/home/votre-espace-detente/votre-espace-detente.jpg",
    alt: "Espace détente et repos du cabinet",
  },
  {
    src: "/images/home/votre-espace-detente/votre-espace-detente-2.jpg",
    alt: "Salon d'accueil cocooning du cabinet",
  },
  {
    src: "/images/home/votre-espace-detente/votre-espace-detente-3.jpg",
    alt: "Coin détente avec fauteuil et plantes",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — full viewport slider behind transparent header */}
      <section className="relative -mt-28 flex min-h-screen items-center overflow-hidden">
        <HeroSlider slides={heroSlides} />

        <Container className="relative z-10 w-full pt-28">
          <div className="max-w-3xl">
            <Reveal variant="fade" delay={0.3}>
              <p className="text-[0.72rem] font-medium tracking-widest-plus text-cream/80 uppercase">
                Altkirch — Haut-Rhin
              </p>
            </Reveal>
            <Reveal variant="blur" delay={0.5} duration={1.1}>
              <h1 className="mt-6 font-display text-[2.75rem] leading-[1.08] font-light text-cream sm:text-6xl lg:text-7xl">
                Votre réflexologue
                <br />
                certifiée à Altkirch
              </h1>
            </Reveal>
            <Reveal variant="fade" delay={0.8} duration={1.1}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/85">
                Praticienne certifiée E.R.V.E, je vous accueille à Altkirch pour
                des séances de réflexologie plantaire, palmaire et
                crânio-faciale, dans un cadre calme et apaisant.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={1.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <LinkButton href="/reservation" variant="light" size="lg">
                  Prendre rendez-vous
                </LinkButton>
                <LinkButton href="/reflexologie" size="lg">
                  Découvrir la réflexologie
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Introduction */}
      <section className="py-28 sm:py-36">
        <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal
            variant="blur"
            className="relative aspect-4/3 overflow-hidden"
          >
            <Image
              src="/images/home/nathalie-home.jpg"
              alt="Nathalie OHL, réflexologue à Altkirch"
              fill
              sizes="(min-width: 1024px) 46vw, 90vw"
              className="object-cover object-center"
            />
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Votre réflexologue"
                title="Une technique manuelle au service de votre équilibre"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 leading-relaxed text-stone-600">
                Je pratique cette technique manuelle, qui consiste à effectuer
                des pressions sur des zones et points spécifiques, afin de
                diminuer des tensions, évacuer le stress, rétablir
                l&apos;équilibre de l&apos;organisme tout entier, et retrouver
                une harmonie. Les bienfaits de la réflexologie sont nombreux.
                Elle apporte un bien-être physique et psychique, et redonne de
                la vitalité.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-5 leading-relaxed text-stone-600">
                Je suis également praticienne en réflexologie palmaire,
                certifiée au centre de formation en réflexologie REF, ainsi
                que praticienne en réflexologie crânio-faciale et
                réflexologie plantaire en soins de support en oncologie,
                certifiée à l&apos;école de réflexologie Nadine Jedrey.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-10">
                <LinkButton href="/a-propos" size="lg">
                  En savoir plus sur moi
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Votre réflexologue — photos du cabinet */}
      <section className="py-28 sm:py-36">
        <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Au cabinet"
                title="Un accompagnement à l'écoute de votre sensibilité"
                description="Chaque séance débute par un temps d'échange, afin d'adapter le protocole à vos besoins du moment."
              />
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10">
                <LinkButton href="/reflexologie" size="lg">
                  Découvrir la réflexologie
                </LinkButton>
              </div>
            </Reveal>
          </div>
          <Reveal variant="blur" delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4.3] overflow-hidden">
                <Image
                  src="/images/home/votre-reflexologue/votre-reflexologue-1.jpg"
                  alt="Nathalie OHL lors d'une séance de réflexologie plantaire"
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="relative mt-10 aspect-[3/4.3] overflow-hidden">
                <Image
                  src="/images/home/votre-reflexologue/votre-reflexologue-2.jpg"
                  alt="Nathalie OHL, praticienne en réflexologie"
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Benefits */}
      <section className="bg-sage-50 py-28 sm:py-36">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Les bienfaits"
              title="La réflexologie peut vous aider"
              align="center"
              description="Un accompagnement naturel pour de nombreux maux du quotidien."
            />
          </Reveal>
          <RevealGroup className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefitIcons[benefit.title];
              return (
                <RevealItem key={benefit.title}>
                  <div className="h-full rounded-2xl border border-sage-200/70 bg-white p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_-12px_rgba(43,58,48,0.15)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
                      <Icon className="h-7 w-7 text-sage-700" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-6 font-display text-lg font-normal text-sage-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone-500">
                      {benefit.description}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      {/* Votre espace détente */}
      <section className="bg-sage-900 py-28 sm:py-36">
        <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="text-[0.72rem] font-medium tracking-widest-plus text-sage-300 uppercase">
                Votre espace détente
              </p>
            </Reveal>
            <Reveal variant="blur" delay={0.15} duration={1.1}>
              <p className="mt-6 font-display text-3xl leading-[1.3] font-light text-cream sm:text-[2.5rem]">
                Venez vous ressourcer dans un endroit calme et apaisant afin de
                libérer toutes vos tensions.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={0.3}>
              <p className="mt-6 max-w-md leading-relaxed text-sage-200">
                Un cadre chaleureux et cocooning, pensé pour vous offrir un
                moment de détente et de bien-être, le temps d&apos;une séance.
              </p>
            </Reveal>
          </div>
          <Reveal variant="blur" delay={0.1}>
            <ImageSlider
              images={detenteSlides}
              className="aspect-4/5 lg:aspect-square"
            />
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-28 sm:py-36">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Elles en parlent"
              title="Ce que disent mes clientes"
              align="center"
            />
          </Reveal>
          <RevealGroup className="mt-16 grid grid-cols-1 gap-x-14 gap-y-12 md:grid-cols-2">
            {testimonials.map((t) => (
              <RevealItem key={t.name}>
                <figure className="flex h-full flex-col">
                  <span className="font-display text-4xl leading-none text-sage-300">
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 flex-1 leading-relaxed text-stone-600">
                    {t.text}
                  </blockquote>
                  <figcaption className="mt-6 text-sm font-medium tracking-wide text-sage-700">
                    {formatReviewerName(t.name)}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-sage-800 py-28 text-center sm:py-36">
        <Container>
          <Reveal variant="blur" duration={1}>
            <h2 className="font-display text-4xl leading-tight font-light text-cream sm:text-5xl">
              Prête à prendre soin de vous ?
            </h2>
          </Reveal>
          <Reveal variant="fade" delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-sage-100">
              Réservez votre séance en ligne en quelques instants.
            </p>
          </Reveal>
          <Reveal variant="fade" delay={0.35}>
            <div className="mt-10">
              <LinkButton href="/reservation" variant="light" size="lg">
                Prendre rendez-vous
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
