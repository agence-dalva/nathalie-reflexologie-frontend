import Link from "next/link";
import { navigation, siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="bg-sage-900 text-cream">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-light">Nathalie OHL</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-sage-200">
              {siteConfig.tagline}
            </p>
            <a
              href="https://www.facebook.com/reflexoaltkirch"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 border-b border-sage-600 pb-0.5 text-sm text-sage-100 transition-colors hover:border-cream hover:text-cream"
            >
              Facebook
            </a>
          </div>

          <div>
            <p className="text-[0.7rem] font-medium tracking-widest-plus text-sage-400 uppercase">
              Navigation
            </p>
            <ul className="mt-4 space-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-sage-100 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.7rem] font-medium tracking-widest-plus text-sage-400 uppercase">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-sage-100">
              <li>{siteConfig.address.line1}</li>
              <li>{siteConfig.address.line2}</li>
              <li className="pt-1">
                <a href={siteConfig.phoneHref} className="transition-colors hover:text-cream">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-cream"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-sage-700/60 pt-6 text-xs text-sage-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Réflexologie Altkirch — {year} — Réalisation{" "}
            <a
              href="https://www.agence-dalva.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-300 transition-colors hover:text-cream"
            >
              Agence Dalva
            </a>
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="transition-colors hover:text-cream">
              Informations légales
            </Link>
            <Link href="/cgv" className="transition-colors hover:text-cream">
              Conditions générales de vente
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
