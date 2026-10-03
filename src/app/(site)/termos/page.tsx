import type { Metadata } from "next";
import { FREE_DAILY_MESSAGES, TRIAL_DAYS } from "@/lib/domain/plans";

export const metadata: Metadata = { title: "Termos de Uso" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-4 py-14 leading-relaxed text-muted sm:px-6">
      <p className="rounded-xl border border-line-strong p-3 text-sm text-gold">
        Rascunho para o MVP — deve ser revisado por um profissional jurídico antes do lançamento.
      </p>
      <h1 className="font-serif text-4xl text-ink">Termos de Uso</h1>
      <h2 className="font-serif text-2xl text-ink">O que é o Etternum</h2>
      <p>
        O Etternum oferece conversas com cápsulas de inteligência artificial inspiradas em grandes mentes da humanidade.
        As cápsulas de pessoas falecidas são recriações baseadas em obras e ideias públicas; as cápsulas marcadas como
        “Inspirado em” são especialistas nas ideias de pessoas vivas ou de figuras religiosas e não as simulam. Nenhuma
        cápsula representa, fala em nome de ou tem vínculo com as pessoas reais.
      </p>
      <h2 className="font-serif text-2xl text-ink">Não é atendimento profissional</h2>
      <p>
        As conversas têm caráter de reflexão e autoconhecimento e não substituem psicólogos, médicos, advogados ou
        consultores. Em situação de crise, procure ajuda imediata: CVV 188, SAMU 192 ou polícia 190.
      </p>
      <h2 className="font-serif text-2xl text-ink">Planos</h2>
      <p>
        Toda conta nova tem {TRIAL_DAYS} dias de teste com acesso completo. Após o teste, sem assinatura, a conta passa
        ao plano gratuito: uma cápsula e até {FREE_DAILY_MESSAGES} mensagens por dia. O plano Premium libera o acesso
        ilimitado.
      </p>
      <h2 className="font-serif text-2xl text-ink">Uso responsável</h2>
      <p>
        É proibido usar o Etternum para fins ilegais, para obter instruções que causem danos ou para tentar burlar os
        limites e as proteções do serviço.
      </p>
    </article>
  );
}
