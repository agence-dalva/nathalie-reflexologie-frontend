import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Informations légales",
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl text-sage-800 sm:text-4xl">
          Informations légales
        </h1>

        <div className="mt-10 space-y-8 text-stone-600">
          <div>
            <p>OHL Nathalie — Entreprise individuelle</p>
            <p>Réflexologue certifiée de l&apos;école E.R.V.E</p>
            <p>Adresse : 12 Lotissement des Bosquets, 68130 Altkirch</p>
            <p>
              Email :{" "}
              <a
                href="mailto:nathalie.ohl@reflexologie-altkirch.fr"
                className="text-sage-700 underline"
              >
                nathalie.ohl@reflexologie-altkirch.fr
              </a>
            </p>
            <p>Téléphone : 06 82 06 69 00</p>
            <p>SIRET : 839 563 145 00011</p>
            <p>RC Pro : I8 101 68 88</p>
            <p>TVA non applicable, article 293 B du Code Général des Impôts</p>
          </div>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              1. Informations légales
            </h2>
            <p className="mt-3">
              Propriétaire du site : OHL Nathalie. Hébergeur : à définir lors
              de la mise en ligne.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              2. Propriété intellectuelle
            </h2>
            <p className="mt-3">
              L&apos;ensemble du contenu de ce site (textes, images, logos) est
              protégé. Toute reproduction, même partielle, est interdite sans
              autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              3. Responsabilité
            </h2>
            <p className="mt-3">
              Les informations diffusées sur ce site le sont à titre
              informatif et ne sauraient engager la responsabilité de
              l&apos;éditeur.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              4. Données personnelles (RGPD)
            </h2>
            <p className="mt-3">
              Conformément au Règlement Général sur la Protection des
              Données, vous disposez d&apos;un droit d&apos;accès, de rectification
              et de suppression des données vous concernant. Pour l&apos;exercer,
              contactez-nous à l&apos;adresse indiquée ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              5. Cookies
            </h2>
            <p className="mt-3">
              Ce site peut utiliser des cookies techniques nécessaires à son
              bon fonctionnement.
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}
