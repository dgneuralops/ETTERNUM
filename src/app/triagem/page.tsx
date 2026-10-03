import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { TriageForm } from "@/components/TriageForm";
import { requireUser } from "@/lib/auth/session";
import { getZodiacSign } from "@/lib/domain/zodiac";

export const metadata: Metadata = { title: "Triagem" };

export default async function TriagePage() {
  const { user, profile } = await requireUser({ allowMissingTriage: true });
  const sign = getZodiacSign(user.zodiacSign);
  const firstName = user.name.split(" ")[0];
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-8 sm:px-6">
      <Logo href={profile ? "/inicio" : "/triagem"} />
      <h1 className="mt-10 font-serif text-4xl text-ink">
        {profile ? "Atualize sua triagem" : `Prazer, ${firstName}.`}
      </h1>
      <p className="mt-3 leading-relaxed text-muted">
        Para que as grandes mentes possam orientar você de verdade, conte um pouco sobre a sua vida. Responda com calma
        e do seu jeito — você pode atualizar isso quando quiser.
        {sign && (
          <>
            {" "}
            Já sabemos que você é de{" "}
            <span className="text-gold">
              {sign.symbol} {sign.name}
            </span>
            .
          </>
        )}
      </p>
      <div className="mt-8">
        <TriageForm
          initial={
            profile
              ? {
                  occupation: profile.occupation,
                  likesToDo: profile.likesToDo,
                  dislikesToDo: profile.dislikesToDo,
                  difficulties: profile.difficulties,
                  dailyStressors: profile.dailyStressors,
                  biggestDrain: profile.biggestDrain,
                  likesToEat: profile.likesToEat,
                  dislikesToEat: profile.dislikesToEat,
                  goals: profile.goals,
                  interestAreas: profile.interestAreas.join(","),
                }
              : {}
          }
        />
      </div>
    </div>
  );
}
