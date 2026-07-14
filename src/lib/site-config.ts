export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://reflexologie-altkirch.fr",
  name: "Nathalie OHL Réflexologue",
  practitioner: "Nathalie OHL",
  tagline: "Réflexologue certifiée E.R.V.E — Altkirch",
  phone: "06 82 06 69 00",
  phoneHref: "tel:+33682066900",
  email: "nathalie.ohl@reflexologie-altkirch.fr",
  address: {
    line1: "12, lotissement les Bosquets",
    line2: "68130 Altkirch",
  },
  legal: {
    siret: "839 563 145 00011",
    rcPro: "I8 101 68 88",
  },
  facebook: "https://www.facebook.com/reflexoaltkirch",
} as const;

export const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/reflexologie", label: "Réflexologie" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;
