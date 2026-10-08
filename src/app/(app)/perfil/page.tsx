import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { clearMemory, deleteAccount } from "@/app/actions/account";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Markdown } from "@/components/Markdown";
import { MindAvatar } from "@/components/MindAvatar";
import { requireUser } from "@/lib/auth/session";
import { favoriteSlugs } from "@/lib/chat/queries";
import { getAgent } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";
import { maskCpf } from "@/lib/domain/cpf";
import { localizeAgent } from "@/lib/i18n/content/agents";
import { localizeArea } from "@/lib/i18n/content/areas";
import { getLocalizedSign } from "@/lib/i18n/content/zodiac";
import { formatBirthDate } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.profile };
}

export default async function ProfilePage() {
  const { user, profile } = await requireUser();
  const { locale, t } = await getI18n();
  const p = t.profile;
  const favorites = [...(await favoriteSlugs(user.id))]
    .map((s) => getAgent(s))
    .filter((a) => a !== undefined)
    .map((a) => localizeAgent(a, locale));
  const sign = getLocalizedSign(user.zodiacSign, locale);
  const labels = p.triageLabels;

  const triage: [string, string][] = profile
    ? [
        [labels.occupation, profile.occupation],
        [labels.likesToDo, profile.likesToDo],
        [labels.dislikesToDo, profile.dislikesToDo],
        [labels.difficulties, profile.difficulties],
        [labels.dailyStressors, profile.dailyStressors],
        [labels.biggestDrain, profile.biggestDrain],
        [labels.likesToEat, profile.likesToEat],
        [labels.dislikesToEat, profile.dislikesToEat],
        [labels.goals, profile.goals],
        [
          labels.interestAreas,
          profile.interestAreas
            .map((slug) => getArea(slug))
            .filter((a) => a !== undefined)
            .map((a) => localizeArea(a, locale).name)
            .join(", "),
        ],
      ]
    : [];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl text-ink">{p.title}</h1>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-serif text-2xl text-ink">{p.dataTitle}</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-faint">{p.name}</dt>
            <dd className="text-ink">{user.name}</dd>
          </div>
          <div>
            <dt className="text-faint">{p.email}</dt>
            <dd className="break-all text-ink">{user.email}</dd>
          </div>
          {user.cpf && (
            <div>
              <dt className="text-faint">{p.cpf}</dt>
              <dd className="text-ink">{maskCpf(user.cpf)}</dd>
            </div>
          )}
          <div>
            <dt className="text-faint">{p.birthAndSign}</dt>
            <dd className="text-ink">
              {formatBirthDate(user.birthDate, locale)} · {sign ? `${sign.symbol} ${sign.name}` : user.zodiacSign}
            </dd>
          </div>
        </dl>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-serif text-2xl text-ink">{p.languageTitle}</h2>
        <p className="mt-1 text-sm text-muted">{p.languageText}</p>
        <div className="mt-4">
          <LanguageSwitcher variant="full" />
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-ink">{p.triageTitle}</h2>
          <Link href="/triagem" className="btn-ghost rounded-full px-4 py-2 text-sm text-ink">
            {p.update}
          </Link>
        </div>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          {triage.map(([label, value]) => (
            <div key={label}>
              <dt className="text-faint">{label}</dt>
              <dd className="whitespace-pre-wrap text-ink">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-serif text-2xl text-ink">{p.memoryTitle}</h2>
        <p className="mt-1 text-sm text-muted">{p.memoryText}</p>
        <div className="mt-4 rounded-2xl border border-line p-4">
          {user.memory.trim() ? (
            <Markdown>{user.memory}</Markdown>
          ) : (
            <p className="text-sm text-faint">{p.memoryEmpty}</p>
          )}
        </div>
        {user.memory.trim() && (
          <form action={clearMemory} className="mt-4">
            <button type="submit" className="btn-ghost rounded-full px-4 py-2 text-sm text-muted">
              {p.clearMemory}
            </button>
          </form>
        )}
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-serif text-2xl text-ink">{p.boardTitle}</h2>
        {favorites.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{p.boardEmpty}</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-3">
            {favorites.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/mente/${a.slug}`}
                  className="btn-ghost flex items-center gap-2 rounded-full py-1 pl-1 pr-4 text-sm text-ink"
                >
                  <MindAvatar agent={a} size="sm" />
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-serif text-2xl text-ink">{p.accountTitle}</h2>
        <form action={logout} className="mt-4">
          <button type="submit" className="btn-ghost rounded-full px-4 py-2 text-sm text-ink">
            {t.common.logout}
          </button>
        </form>
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-danger">{p.deleteSummary}</summary>
          <form action={deleteAccount} className="mt-3 space-y-3">
            <p className="text-sm text-muted">
              {p.deleteBefore} <strong className="text-ink">{p.confirmWord}</strong> {p.deleteAfter}
            </p>
            <label htmlFor="confirm" className="sr-only">
              {p.confirmLabel}
            </label>
            <input id="confirm" name="confirm" autoComplete="off" className="field rounded-xl px-4 py-2" />
            <button
              type="submit"
              className="ml-2 rounded-full border border-danger/50 px-4 py-2 text-sm text-danger hover:bg-danger/10"
            >
              {p.deleteButton}
            </button>
          </form>
        </details>
      </section>
    </div>
  );
}
