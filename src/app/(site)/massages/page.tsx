import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ImageSlider } from "@/components/ui/image-slider";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getServices } from "@/lib/api";
import type { Service } from "@/lib/api";
import { formatDuration, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Massages",
  description:
    "Drainage lymphatique manuel et massage assis à Altkirch : des massages doux pour favoriser la circulation, relâcher les tensions et retrouver bien-être et légèreté.",
};

// Le backend n'est pas forcément joignable au moment du build (déploiements découplés) :
// cette page est rendue à la demande plutôt qu'en SSG.
export const dynamic = "force-dynamic";

const drainageSlides = [
  {
    src: "/images/drainage/drainage-1.png",
    alt: "Drainage lymphatique manuel au niveau de l'abdomen",
  },
  {
    src: "/images/drainage/drainage-2.png",
    alt: "Drainage lymphatique manuel au niveau des jambes",
  },
];

const massageAssisSlides = [
  {
    src: "/images/tarifs/massage-assis/Massageassis1.png",
    alt: "Massage assis sur chaise ergonomique",
  },
  {
    src: "/images/tarifs/massage-assis/Massageassis2.png",
    alt: "Massage assis sur chaise ergonomique",
  },
];

const drainageBenefits = [
  "Favoriser la circulation lymphatique",
  "Diminuer la sensation de jambes lourdes et de tension",
  "Aider à la gestion des œdèmes et gonflements lorsqu'ils relèvent d'une indication adaptée",
  "Procurer une sensation de légèreté et de bien-être",
  "Favoriser une profonde détente",
];

const drainageDisclaimer = (
  <p className="border-l-2 border-terracotta-400 pl-5 text-sm leading-relaxed text-sage-200">
    Cette prestation est proposée dans une démarche de bien-être et de
    détente. Elle ne remplace pas le drainage lymphatique à visée thérapeutique
    qui peut être prescrit et réalisé par un kinésithérapeute, notamment en cas
    de pathologie, de lymphœdème ou de besoin de prise en charge médicale.
  </p>
);

function bookingHref(service?: Service) {
  return service ? `/reservation?service=${service.id}` : "/reservation";
}

function PriceTag({
  service,
  tone = "dark",
}: {
  service?: Service;
  tone?: "dark" | "light";
}) {
  if (!service) return null;
  return (
    <p className="mt-8">
      <span
        className={`font-display text-2xl font-light ${
          tone === "light" ? "text-cream" : "text-sage-800"
        }`}
      >
        {formatPrice(service.price)}
      </span>
      <span
        className={`ml-2 text-sm ${
          tone === "light" ? "text-sage-200" : "text-stone-400"
        }`}
      >
        {formatDuration(service.durationMinutes)}
      </span>
    </p>
  );
}

export default async function MassagesPage() {
  const services = await getServices();
  const drainageService = services.find((s) =>
    s.name.toLowerCase().includes("drainage"),
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
              eyebrow="Massages bien-être"
              title="Des massages pour se détendre"
              align="center"
              description="En complément de la réflexologie, je vous propose des massages doux, pour relâcher les tensions et retrouver une sensation de légèreté."
            />
          </Reveal>
        </Container>
      </section>

      {/* Drainage lymphatique */}
      <section className="bg-[#5d7c67] py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal variant="blur" className="relative aspect-4/5">
              <ImageSlider
                images={drainageSlides}
                className="h-full rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] ring-1 ring-cream/15"
              />
            </Reveal>
            {/* Sous l'image sur grand écran, en fin de texte sur mobile */}
            <Reveal delay={0.2} className="mt-8 hidden lg:block">
              {drainageDisclaimer}
            </Reveal>
          </div>
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Nouveau"
                title="Le drainage lymphatique manuel"
                tone="light"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-sage-100">
                Le drainage lymphatique manuel est une technique de massage
                doux, lent et rythmé, qui vise à favoriser la circulation de la
                lymphe dans l&apos;organisme.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 leading-relaxed text-sage-100">
                La lymphe est un liquide qui circule dans un réseau de petits
                vaisseaux appelé système lymphatique. Elle participe notamment
                au transport de certaines substances et au fonctionnement du
                système immunitaire. Contrairement au sang, la lymphe ne
                bénéficie pas d&apos;une pompe centrale comme le cœur : sa
                circulation dépend notamment des mouvements du corps, des
                contractions musculaires et de la respiration.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 leading-relaxed text-sage-100">
                Lors d&apos;une séance, j&apos;utilise des mouvements légers,
                précis et répétitifs, réalisés dans le sens de la circulation
                lymphatique. On prépare cette circulation en stimulant les
                ganglions lymphatiques (cou, aisselles, aine, thorax, abdomen),
                qui filtrent la lymphe et retiennent certaines particules ou
                cellules anormales. Les ganglions sont un peu comme des postes
                de contrôle du système lymphatique : la lymphe y passe pour être
                filtrée et permettre aux cellules immunitaires de jouer leur
                rôle.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-8 text-sm font-medium text-cream">
                Le drainage lymphatique peut ainsi contribuer à :
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {drainageBenefits.map((item) => (
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
            <Reveal delay={0.3}>
              <p className="mt-8 leading-relaxed text-sage-100">
                Contrairement à un massage classique, le drainage lymphatique
                n&apos;est pas un massage profond. Les gestes sont doux, lents
                et superficiels, car les vaisseaux lymphatiques se trouvent
                juste sous la peau.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-6 lg:hidden">
              {drainageDisclaimer}
            </Reveal>
            <Reveal delay={0.4}>
              <PriceTag service={drainageService} tone="light" />
              <div className={drainageService ? "mt-5" : "mt-8"}>
                <LinkButton
                  href={bookingHref(drainageService)}
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

      {/* Massage assis */}
      <section className="bg-cream-dark py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal
            variant="blur"
            className="relative aspect-4/5 lg:order-2"
          >
            <ImageSlider
              images={massageAssisSlides}
              className="h-full rounded-2xl shadow-[0_20px_45px_-15px_rgba(43,58,48,0.35)] ring-1 ring-sage-900/10"
            />
          </Reveal>
          <div className="lg:order-1">
            <Reveal>
              <SectionHeading
                eyebrow="Détente express"
                title="Le massage assis"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-stone-600">
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
              <p className="mt-4 text-sm text-stone-500">
                Massage effectué habillé, sur une chaise ergonomique.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <PriceTag service={massageAssisService} />
              <div className={massageAssisService ? "mt-5" : "mt-8"}>
                <LinkButton href={bookingHref(massageAssisService)} size="lg">
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
