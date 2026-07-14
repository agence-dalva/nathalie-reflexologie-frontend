import type { Metadata } from "next";
import { ReservationFlow } from "./reservation-flow";

export const metadata: Metadata = {
  title: "Réservation en ligne",
  description:
    "Réservez votre séance de réflexologie en ligne : choisissez votre prestation, votre créneau et confirmez votre rendez-vous.",
};

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const preselectedServiceId = params.service ? Number(params.service) : undefined;

  return (
    <ReservationFlow
      preselectedServiceId={
        preselectedServiceId && !Number.isNaN(preselectedServiceId)
          ? preselectedServiceId
          : undefined
      }
    />
  );
}
