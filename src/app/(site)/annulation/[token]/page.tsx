import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CancellationView } from "./cancellation-view";

export const metadata: Metadata = {
  title: "Annuler mon rendez-vous",
};

export default async function CancellationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-lg">
        <h1 className="text-center font-display text-3xl text-sage-800 sm:text-4xl">
          Votre rendez-vous
        </h1>
        <div className="mt-10">
          <CancellationView token={token} />
        </div>
      </Container>
    </section>
  );
}
