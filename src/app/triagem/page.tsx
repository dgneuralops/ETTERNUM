import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { TriageForm } from "@/components/TriageForm";
import { requireUser } from "@/lib/auth/session";
import { getLocalizedSign } from "@/lib/i18n/content/zodiac";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.triage };
}

export default async function TriagePage() {
  const { user, profile } = await requireUser({ allowMissingTriage: true });
  const { locale, t } = await getI18n();
  const sign = getLocalizedSign(user.zodiacSign, locale);
  const firstName = user.name.split(" ")[0];
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-8 sm:px-6">
      <Logo href={profile ? "/inicio" : "/triagem"} />
      <h1 className="mt-10 font-serif text-4xl text-ink">
        {profile ? t.triage.titleEdit : t.triage.titleNew(firstName)}
      </h1>
      <p className="mt-3 leading-relaxed text-muted">
        {t.triage.intro}
        {sign && (
          <>
            {" "}
            {t.triage.signKnown}{" "}
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
