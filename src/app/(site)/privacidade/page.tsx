import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-4 py-14 leading-relaxed text-muted sm:px-6">
      <p className="rounded-xl border border-line-strong p-3 text-sm text-gold">
        Rascunho para o MVP — deve ser revisado por um profissional jurídico antes do lançamento.
      </p>
      <h1 className="font-serif text-4xl text-ink">Política de Privacidade</h1>
      <p>
        O Etternum trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD). Esta
        política explica quais dados coletamos, por que e quais são os seus direitos.
      </p>
      <h2 className="font-serif text-2xl text-ink">Dados que coletamos</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Cadastro: nome, e-mail, senha (armazenada apenas como hash), CPF, data de nascimento e signo.</li>
        <li>
          Triagem: trabalho, gostos, dificuldades, fontes de estresse e desgaste, preferências alimentares, objetivos e
          áreas de interesse.
        </li>
        <li>Conversas: mensagens trocadas com as cápsulas, o Maestro e o Conselho.</li>
        <li>Memória: um resumo, gerado por IA, do que você compartilhou, para personalizar as próximas conversas.</li>
      </ul>
      <h2 className="font-serif text-2xl text-ink">Dados sensíveis</h2>
      <p>
        Informações sobre saúde emocional e bem-estar podem ser dados pessoais sensíveis. Elas são tratadas com base no
        seu consentimento específico, dado no cadastro, exclusivamente para personalizar as orientações.
      </p>
      <h2 className="font-serif text-2xl text-ink">Como usamos</h2>
      <p>
        Para criar e proteger sua conta, personalizar as respostas, manter seu histórico e sua memória, aplicar os
        limites do seu plano e cumprir obrigações legais. Seu CPF e seu e-mail não são enviados aos modelos de
        inteligência artificial.
      </p>
      <h2 className="font-serif text-2xl text-ink">Compartilhamento</h2>
      <p>
        As mensagens e o contexto de perfil necessários para gerar as respostas são processados por um provedor de
        inteligência artificial (Anthropic) e armazenados em nossa infraestrutura de banco de dados. Não vendemos seus
        dados.
      </p>
      <h2 className="font-serif text-2xl text-ink">Seus direitos</h2>
      <p>
        Você pode consultar e corrigir seus dados, apagar sua memória, excluir conversas e excluir sua conta a qualquer
        momento na página Perfil. A exclusão da conta remove todos os seus dados de forma definitiva.
      </p>
      <h2 className="font-serif text-2xl text-ink">Idade mínima</h2>
      <p>O Etternum é destinado a pessoas com 18 anos ou mais.</p>
    </article>
  );
}
