import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

export default function CgvPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl text-sage-800 sm:text-4xl">
          Conditions générales de vente
        </h1>

        <div className="mt-6 rounded-xl border border-terracotta-400/40 bg-terracotta-400/10 p-4 text-sm text-stone-600">
          Contenu à valider avec Nathalie avant mise en ligne — les CGV
          complètes (articles, annexes tarifaires, formulaire de
          rétractation) doivent être vérifiées avec elle pour rester
          juridiquement à jour.
        </div>

        <div className="mt-10 space-y-8 text-stone-600">
          <section>
            <h2 className="font-display text-xl text-sage-800">
              Prestataire
            </h2>
            <p className="mt-3">
              OHL Nathalie — Réflexologue E.R.V.E — 12 Lotissement des
              Bosquets, 68130 Altkirch — SIRET 839 563 145 00011.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Réservation et rendez-vous
            </h2>
            <p className="mt-3">
              Les rendez-vous sont pris en ligne ou par téléphone. Chaque
              réservation en ligne fait l&apos;objet d&apos;un email de confirmation
              contenant un lien permettant de l&apos;annuler.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Annulation
            </h2>
            <p className="mt-3">
              Toute annulation doit être signalée dans les meilleurs délais
              via le lien de confirmation ou par téléphone, afin de libérer
              le créneau pour d&apos;autres clients.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Tarifs
            </h2>
            <p className="mt-3">
              Les tarifs en vigueur sont ceux affichés sur la page{" "}
              <a href="/tarifs" className="text-sage-700 underline">
                Tarifs
              </a>{" "}
              au moment de la réservation. Soins hors d&apos;un cadre réglementé
              — TVA non applicable, article 293 B du Code Général des Impôts.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Avertissement
            </h2>
            <p className="mt-3">
              La réflexologie ne se substitue pas à la médecine
              conventionnelle. Le réflexologue ne peut établir de diagnostic,
              ni modifier un traitement médical en cours.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Données personnelles
            </h2>
            <p className="mt-3">
              Les informations recueillies lors de la réservation sont
              utilisées uniquement pour la gestion du rendez-vous. Voir la
              page{" "}
              <a href="/mentions-legales" className="text-sage-700 underline">
                Informations légales
              </a>{" "}
              pour l&apos;exercice de vos droits RGPD.
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}
