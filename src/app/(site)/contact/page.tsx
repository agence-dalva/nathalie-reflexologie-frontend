import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { LinkButton } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez Nathalie OHL, réflexologue à Altkirch, pour toute question ou pour prendre rendez-vous.',
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="relative -mt-5 flex h-72 w-full items-end overflow-hidden sm:h-96">
        <Image src="/images/contact/exterieur2.jpg" alt="Entrée du cabinet de Nathalie OHL à Altkirch" fill priority sizes="100vw" className="object-cover object-[50%_15%]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent" />
        <Container className="relative z-10 w-full pb-8 sm:pb-10">
          <Reveal variant="fade">
            <p className="text-[0.72rem] font-medium tracking-widest-plus text-cream/80 uppercase">Une question ?</p>
          </Reveal>
          <Reveal variant="blur" delay={0.1} duration={1.1}>
            <h1 className="mt-3 font-display text-[2.75rem] leading-[1.1] font-light text-cream sm:text-6xl">Contact</h1>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          {/* Details */}
          <Reveal>
            <p className="max-w-sm leading-relaxed text-stone-600">
              Renseignements ou prise de rendez-vous au{' '}
              <a href={siteConfig.phoneHref} className="border-b border-sage-300 text-sage-800 transition-colors hover:border-sage-600">
                {siteConfig.phone}
              </a>
              , ou réservez directement en ligne.
            </p>

            <div className="mt-8">
              <LinkButton href="/reservation" size="lg">
                Prendre rendez-vous en ligne
              </LinkButton>
            </div>

            <dl className="mt-14 space-y-8">
              <div className="border-t border-sage-200/70 pt-6">
                <dt className="text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase">Cabinet</dt>
                <dd className="mt-3 text-stone-600">
                  Nathalie OHL Réflexologue E.R.V.E
                  <br />
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                </dd>
              </div>
              <div className="border-t border-sage-200/70 pt-6">
                <dt className="text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase">Téléphone</dt>
                <dd className="mt-3">
                  <a href={siteConfig.phoneHref} className="text-stone-600 transition-colors hover:text-sage-800">
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
              <div className="border-t border-sage-200/70 pt-6">
                <dt className="text-[0.7rem] font-medium tracking-widest-plus text-sage-500 uppercase">Email</dt>
                <dd className="mt-3">
                  <a href={`mailto:${siteConfig.email}`} className="text-stone-600 transition-colors hover:text-sage-800">
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="bg-sage-50 p-8 sm:p-12">
              <h2 className="font-display text-2xl font-light text-sage-900">Envoyer un message</h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Map — pleine largeur */}
      <Reveal variant="fade">
        <div className="overflow-hidden">
          <iframe
            title="Localisation du cabinet — Nathalie OHL Réflexologue"
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${siteConfig.address.line1}, ${siteConfig.address.line2}`)}&output=embed`}
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-15"
          />
        </div>
      </Reveal>
    </>
  );
}
