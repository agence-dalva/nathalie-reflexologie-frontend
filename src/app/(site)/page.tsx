import Image from "next/image";
import {
  Brain,
  Bone,
  Droplets,
  Flower2,
  Moon,
  Star,
  Waves,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { HeroSlider, type HeroSlide } from "@/components/ui/hero-slider";
import { ImageSlider, type SliderImage } from "@/components/ui/image-slider";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { benefits } from "@/lib/content";
import { testimonials } from "@/lib/testimonials-data";

const heroSlides: HeroSlide[] = [
  {
    src: "/images/home/slider/slider-pied.jpeg",
    alt: "Séance de réflexologie plantaire",
  },
  {
    src: "/images/home/slider/slider-tete.jpeg",
    alt: "Séance de réflexologie crânio-faciale",
  },
  {
    src: "/images/home/slider/slider-main.jpeg",
    alt: "Séance de réflexologie palmaire",
  },
];

const benefitIcons = {
  "Migraines, céphalées": Brain,
  "Douleurs articulaires et musculaires": Bone,
  "Stress, sommeil, fatigue, anxiété": Moon,
  "Troubles digestifs": Waves,
  "Circulation sanguine et lymphatique": Droplets,
  "Troubles de la ménopause": Flower2,
} as const satisfies Record<(typeof benefits)[number]["title"], unknown>;

const detenteSlides: SliderImage[] = [
  {
    src: "/images/votre-espace-detente/votre-espace-detente-0.jpeg",
    alt: "Espace détente du cabinet",
  },
  {
    src: "/images/votre-espace-detente/votre-espace-detente-1.jpeg",
    alt: "Espace détente du cabinet",
  },
  {
    src: "/images/votre-espace-detente/votre-espace-detente-2.jpeg",
    alt: "Espace détente du cabinet",
  },
  {
    src: "/images/votre-espace-detente/votre-espace-detente-3.jpeg",
    alt: "Espace détente du cabinet",
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
              <p className="text-[0.85rem] font-medium tracking-widest-plus text-cream/80 uppercase">
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
                Praticienne certifiée de l&apos;école de réflexologie E.R.V.E,
                je vous accueille à Altkirch pour des séances de réflexologie
                plantaire, palmaire ou crânio-faciale, dans un cadre calme et
                apaisant.
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
            className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(43,58,48,0.35)] ring-1 ring-sage-900/10"
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
                certifiée au centre de formation en réflexologie REF, ainsi que
                praticienne en réflexologie crânio-faciale et réflexologie
                plantaire en soins de support en oncologie, certifiée à
                l&apos;école de réflexologie Nadine Jedrey.
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
      <section className="bg-[#5d7c67] py-28 sm:py-36">
        <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Au cabinet"
                title="Un accompagnement à l'écoute de votre sensibilité"
                description="Chaque séance débute par un temps d'échange, afin d'adapter le protocole à vos besoins du moment."
                tone="light"
              />
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10">
                <LinkButton href="/reflexologie" variant="light" size="lg">
                  Découvrir la réflexologie
                </LinkButton>
              </div>
            </Reveal>
          </div>
          <Reveal variant="blur" delay={0.1}>
            <div className="grid grid-cols-2 gap-5">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] ring-1 ring-cream/15">
                <Image
                  src="/images/home/votre-reflexologue/votre-reflexologue-1.jpg"
                  alt="Nathalie OHL lors d'une séance de réflexologie plantaire"
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover object-[35%_25%]"
                />
              </div>
              <div className="relative mt-10 aspect-[4/4.6] overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] ring-1 ring-cream/15">
                <Image
                  src="/images/home/votre-reflexologue/votre-reflexologue-2.jpg"
                  alt="Nathalie OHL, praticienne en réflexologie"
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover object-[40%_20%]"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-28 sm:py-36">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Les bienfaits"
              title="Prenez soin de vous naturellement avec la réflexologie !"
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
                      <Icon
                        className="h-7 w-7 text-sage-700"
                        strokeWidth={1.5}
                      />
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
      <section className="bg-[#5d7c67] py-28 sm:py-36">
        <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="text-[0.85rem] font-medium tracking-widest-plus text-sage-300 uppercase">
                Votre espace détente
              </p>
            </Reveal>
            <Reveal variant="blur" delay={0.15} duration={1.1}>
              <p className="mt-6 font-display text-3xl leading-[1.3] font-light text-cream sm:text-[2.5rem]">
                Offrez-vous un moment de détente !
              </p>
            </Reveal>
            <Reveal variant="fade" delay={0.3}>
              <p className="mt-6 max-w-md leading-relaxed text-sage-200">
                Dans un cadre calme et apaisant, propice au lâcher-prise et à la
                libération des tensions.
              </p>
            </Reveal>
          </div>
          <Reveal variant="blur" delay={0.1}>
            <ImageSlider
              images={detenteSlides}
              className="aspect-4/5 rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] ring-1 ring-cream/15 lg:aspect-square"
            />
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-28 sm:py-36">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Ils en parlent"
              title="Ce que disent mes clients"
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 flex items-center justify-center gap-2 text-sage-700">
              <Star className="h-5 w-5 fill-terracotta-500 text-terracotta-500" />
              <span className="text-sm font-medium tracking-wide">
                90+ avis 5 étoiles sur Google
              </span>
            </div>
          </Reveal>
          <div className="mt-16">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-sage-800 py-28 text-center sm:py-36">
        <Container>
          <Reveal variant="blur" duration={1}>
            <h2 className="font-display text-4xl leading-tight font-light text-cream sm:text-5xl">
              Prêt à prendre soin de vous ?
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
