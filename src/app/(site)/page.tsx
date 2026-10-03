import { ArrowRight, BookOpenText, MessagesSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { AreaCard } from "@/components/AreaCard";
import { MindAvatar } from "@/components/MindAvatar";
import { MindCard } from "@/components/MindCard";
import { MindCarousel } from "@/components/MindCarousel";
import { WaitlistForm } from "@/components/WaitlistForm";
import { AGENTS, MAESTRO, agentsForArea, carouselAgents } from "@/lib/domain/agents";
import { AREAS } from "@/lib/domain/areas";
import { FREE_DAILY_MESSAGES, TRIAL_DAYS } from "@/lib/domain/plans";

const PILLARS = [
  {
    icon: BookOpenText,
    title: "Conexão com o Conhecimento",
    text: "Filósofos, psicólogos, teólogos, historiadores e empresários reunidos num só lugar, prontos para conversar.",
  },
  {
    icon: MessagesSquare,
    title: "Interação Personalizada",
    text: "Uma triagem sobre você — rotina, dificuldades, gostos e signo — orienta cada resposta. E o Etternum lembra de tudo.",
  },
  {
    icon: Sparkles,
    title: "Enriquecimento Pessoal",
    text: "Clareza para decidir, acolhimento para atravessar dias difíceis e caminhos práticos para todas as áreas da vida.",
  },
];

const STEPS = [
  {
    title: "Faça sua triagem",
    text: "Conte quem você é, o que te estressa, o que te desgasta, do que gosta — e seu signo.",
  },
  {
    title: "Converse com o Maestro",
    text: "Seu amigo pessoal eterno ouve, aconselha e, quando faz sentido, leva você até a mente ideal.",
  },
  {
    title: "Escolha uma área ou uma mente",
    text: "Negócios, relacionamentos, luto, espiritualidade… cada área tem suas grandes mentes.",
  },
  {
    title: "Abra o Conselho",
    text: "Leve uma situação a várias mentes ao mesmo tempo e receba uma síntese com próximos passos.",
  },
];

export default function LandingPage() {
  const carousel = carouselAgents();
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Etternum · a inteligência das memórias</p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] text-ink sm:text-7xl">
          Converse com Grandes Mentes. <span className="gold-text italic">Cultive sua sabedoria na era da IA.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Cápsulas interativas de pensadores históricos — e um amigo pessoal eterno que conhece você, ouve sem
          julgamento e está sempre por perto para aconselhar.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/cadastro"
            className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold"
          >
            Testar grátis por {TRIAL_DAYS} dias <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#lista-de-espera"
            className="btn-ghost inline-flex items-center justify-center rounded-full px-7 py-3.5 text-ink"
          >
            Entrar na lista de espera
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-3xl p-6">
              <Icon className="h-6 w-6 text-gold" aria-hidden />
              <h2 className="mt-4 font-serif text-xl text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Carrossel */}
      <section id="mentes" className="scroll-mt-20 border-y border-line bg-graphite/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-4xl text-ink">As cápsulas</h2>
              <p className="mt-2 max-w-xl text-muted">
                {AGENTS.length} grandes mentes, em todas as áreas da vida. Escolha com quem conversar.
              </p>
            </div>
          </div>
          <MindCarousel label="Cápsulas de grandes mentes">
            {carousel.map((agent) => (
              <MindCard key={agent.slug} agent={agent} className="w-[82%] shrink-0 snap-start sm:w-[320px]" />
            ))}
          </MindCarousel>
        </div>
      </section>

      {/* Maestro */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="glass flex flex-col items-start gap-6 rounded-[2rem] p-8 sm:flex-row sm:items-center sm:p-10">
          <MindAvatar agent={MAESTRO} size="xl" />
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gold">O Maestro</p>
            <h2 className="mt-2 font-serif text-4xl text-ink">Seu amigo pessoal eterno.</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Um lugar para desabafar, pensar alto e pedir conselho a qualquer hora. O Maestro lembra do que você já
              viveu e contou, e quando uma grande mente pode ajudar mais — Frankl para o sentido, Drucker para o seu
              negócio, Rumi para o coração — ele leva você até ela.
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="scroll-mt-20 mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-4xl text-ink">Como funciona</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="glass rounded-3xl p-6">
              <span className="font-serif text-3xl text-gold">{i + 1}</span>
              <h3 className="mt-2 font-serif text-xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Áreas */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-4xl text-ink">Todas as áreas da vida</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {AREAS.map((area) => (
            <AreaCard key={area.slug} area={area} count={agentsForArea(area.slug).length} />
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-4xl text-ink">Planos</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-3xl p-7">
            <h3 className="font-serif text-2xl text-ink">Teste grátis</h3>
            <p className="mt-1 text-muted">{TRIAL_DAYS} dias com acesso completo</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li>✓ Todas as mentes e o Maestro</li>
              <li>✓ Conselho com várias mentes</li>
              <li>✓ Depois do teste: 1 cápsula + {FREE_DAILY_MESSAGES} mensagens por dia, para sempre grátis</li>
            </ul>
          </div>
          <div className="glass rounded-3xl border-line-strong p-7">
            <h3 className="font-serif text-2xl text-gold">Premium</h3>
            <p className="mt-1 text-muted">Acesso ilimitado</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li>✓ Todas as mentes, sem limite diário</li>
              <li>✓ Conselho, Maestro e memória completa</li>
              <li>✓ Em breve: sua Cápsula de Memória Viva</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="scroll-mt-20 mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
        <h2 className="font-serif text-4xl text-ink">Sobre o Etternum</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Vivemos perdidos, sozinhos e sobrecarregados. O Etternum nasce para ser um amigo pessoal eterno: um lugar para
          desabafar e se aconselhar com a sabedoria que a humanidade já produziu — um museu emocional vivo, onde grandes
          mentes continuam a conversar com quem precisa.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Em breve, as <span className="text-gold">Cápsulas de Memória Viva</span> vão permitir eternizar a sua história
          ou a de quem você ama — valores, memórias e jeito de falar — como um legado para as próximas gerações.
        </p>
      </section>

      {/* Lista de espera */}
      <section id="lista-de-espera" className="scroll-mt-20 border-t border-line bg-graphite/40 py-20">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-4xl text-ink">Entre para nossa lista de espera.</h2>
          <p className="mt-3 text-muted">Seja um dos primeiros a explorar o poder transformador das cápsulas de IA.</p>
          <div className="mt-8 text-left">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </>
  );
}
