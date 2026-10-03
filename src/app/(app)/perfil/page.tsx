import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { clearMemory, deleteAccount } from "@/app/actions/account";
import { Markdown } from "@/components/Markdown";
import { MindAvatar } from "@/components/MindAvatar";
import { requireUser } from "@/lib/auth/session";
import { favoriteSlugs } from "@/lib/chat/queries";
import { getAgent } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";
import { maskCpf } from "@/lib/domain/cpf";
import { getZodiacSign } from "@/lib/domain/zodiac";

export const metadata: Metadata = { title: "Perfil" };

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default async function ProfilePage() {
  const { user, profile } = await requireUser();
  const favorites = [...(await favoriteSlugs(user.id))].map((s) => getAgent(s)).filter((a) => a !== undefined);
  const sign = getZodiacSign(user.zodiacSign);

  const triage: [string, string][] = profile
    ? [
        ["Trabalho", profile.occupation],
        ["Gosta de fazer", profile.likesToDo],
        ["Não gosta de fazer", profile.dislikesToDo],
        ["Maiores dificuldades", profile.difficulties],
        ["O que mais estressa no dia", profile.dailyStressors],
        ["Maior causa de desgaste", profile.biggestDrain],
        ["Gosta de comer", profile.likesToEat],
        ["Não gosta de comer", profile.dislikesToEat],
        ["O que busca no Etternum", profile.goals],
        [
          "Áreas de interesse",
          profile.interestAreas
            .map((a) => getArea(a)?.name)
            .filter(Boolean)
            .join(", "),
        ],
      ]
    : [];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl text-ink">Perfil</h1>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-serif text-2xl text-ink">Seus dados</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-faint">Nome</dt>
            <dd className="text-ink">{user.name}</dd>
          </div>
          <div>
            <dt className="text-faint">E-mail</dt>
            <dd className="text-ink">{user.email}</dd>
          </div>
          <div>
            <dt className="text-faint">CPF</dt>
            <dd className="text-ink">{maskCpf(user.cpf)}</dd>
          </div>
          <div>
            <dt className="text-faint">Nascimento e signo</dt>
            <dd className="text-ink">
              {formatDate(user.birthDate)} · {sign ? `${sign.symbol} ${sign.name}` : user.zodiacSign}
            </dd>
          </div>
        </dl>
      </section>

      <section className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-ink">Sua triagem</h2>
          <Link href="/triagem" className="btn-ghost rounded-full px-4 py-2 text-sm text-ink">
            Atualizar
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
        <h2 className="font-serif text-2xl text-ink">O que o Etternum lembra sobre você</h2>
        <p className="mt-1 text-sm text-muted">
          A memória é atualizada automaticamente a partir das suas conversas e compartilhada entre todas as mentes, para
          que cada uma conheça você melhor.
        </p>
        <div className="mt-4 rounded-2xl border border-line p-4">
          {user.memory.trim() ? (
            <Markdown>{user.memory}</Markdown>
          ) : (
            <p className="text-sm text-faint">Ainda não há memórias. Converse com o Maestro ou com uma mente.</p>
          )}
        </div>
        {user.memory.trim() && (
          <form action={clearMemory} className="mt-4">
            <button type="submit" className="btn-ghost rounded-full px-4 py-2 text-sm text-muted">
              Apagar memória
            </button>
          </form>
        )}
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-serif text-2xl text-ink">Seu Quadro Eterno</h2>
        {favorites.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Toque na estrela de uma mente para adicioná-la ao seu quadro.</p>
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
        <h2 className="font-serif text-2xl text-ink">Conta</h2>
        <form action={logout} className="mt-4">
          <button type="submit" className="btn-ghost rounded-full px-4 py-2 text-sm text-ink">
            Sair
          </button>
        </form>
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-danger">Excluir minha conta e todos os meus dados</summary>
          <form action={deleteAccount} className="mt-3 space-y-3">
            <p className="text-sm text-muted">
              Isso apaga definitivamente sua conta, triagem, memória e todas as conversas. Digite{" "}
              <strong className="text-ink">EXCLUIR</strong> para confirmar.
            </p>
            <label htmlFor="confirm" className="sr-only">
              Confirmação
            </label>
            <input id="confirm" name="confirm" autoComplete="off" className="field rounded-xl px-4 py-2" />
            <button
              type="submit"
              className="ml-2 rounded-full border border-danger/50 px-4 py-2 text-sm text-danger hover:bg-danger/10"
            >
              Excluir conta
            </button>
          </form>
        </details>
      </section>
    </div>
  );
}
