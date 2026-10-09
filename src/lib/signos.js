// Cartão "Seu signo solar" (área Astrologia): elemento, modalidade, regente e quatro leituras.
// [forças, desafios, sob estresse, o que ajuda]
export const SIGNOS = {
  'Áries': ['Fogo', 'Cardinal', 'Marte', 'Coragem, iniciativa e uma energia que coloca as coisas em movimento.', 'Impaciência e a tendência de agir antes de ouvir.', 'Fica irritadiço, briga com o que atrasa e se esgota no próprio ritmo.', 'Movimento físico, metas curtas e desafios que valham a pena.'],
  'Touro': ['Terra', 'Fixo', 'Vênus', 'Constância, lealdade e um senso prático que dá chão a quem está por perto.', 'Resistência a mudanças e apego ao que é conhecido.', 'Se fecha, teima e busca conforto em excesso.', 'Rotina gentil, natureza, boa comida e tempo para decidir.'],
  'Gêmeos': ['Ar', 'Mutável', 'Mercúrio', 'Curiosidade, leveza e facilidade para conectar ideias e pessoas.', 'Dispersão e dificuldade de aprofundar.', 'A mente acelera, salta de tema em tema e o sono piora.', 'Conversar, escrever o que pensa e escolher uma coisa por vez.'],
  'Câncer': ['Água', 'Cardinal', 'Lua', 'Cuidado, memória afetiva e uma sensibilidade que acolhe.', 'Guardar mágoas e se proteger demais.', 'Se recolhe, fica melancólico e cuida de todos menos de si.', 'Casa, vínculos seguros e espaço para sentir sem pressa.'],
  'Leão': ['Fogo', 'Fixo', 'Sol', 'Generosidade, presença e a coragem de criar e se mostrar.', 'Necessidade de reconhecimento e orgulho ferido.', 'Dramatiza, se sente invisível e cobra atenção.', 'Criar algo próprio, brincar e ser reconhecido por quem importa.'],
  'Virgem': ['Terra', 'Mutável', 'Mercúrio', 'Atenção aos detalhes, senso de serviço e vontade de melhorar as coisas.', 'Autocrítica alta e perfeccionismo.', 'Controla tudo, se preocupa com o corpo e com o que pode dar errado.', 'Listas, pequenas rotinas e lembrar que bom o bastante é bom.'],
  'Libra': ['Ar', 'Cardinal', 'Vênus', 'Diplomacia, senso estético e talento para criar harmonia.', 'Indecisão e medo de desagradar.', 'Adia escolhas, cede demais e perde a própria voz.', 'Beleza, conversas francas e decidir com prazo marcado.'],
  'Escorpião': ['Água', 'Fixo', 'Plutão e Marte', 'Profundidade, intensidade e uma enorme capacidade de se transformar.', 'Desconfiança e dificuldade de soltar.', 'Se isola, controla e remói o que doeu.', 'Confiança construída aos poucos, verdade e recomeços.'],
  'Sagitário': ['Fogo', 'Mutável', 'Júpiter', 'Otimismo, curiosidade, generosidade e um senso de aventura que contagia.', 'Impaciência com rotinas e a tendência de prometer mais do que cabe no dia.', 'Foge para o próximo plano, se dispersa e se irrita com limites.', 'Movimento, um horizonte de sentido, conversas francas e aprender algo novo.'],
  'Capricórnio': ['Terra', 'Cardinal', 'Saturno', 'Responsabilidade, disciplina e visão de longo prazo.', 'Rigidez e dificuldade de descansar.', 'Trabalha ainda mais, endurece e se cobra em silêncio.', 'Metas claras, pausas planejadas e celebrar o que já conquistou.'],
  'Aquário': ['Ar', 'Fixo', 'Urano e Saturno', 'Originalidade, senso coletivo e ideias à frente do tempo.', 'Distanciamento emocional e teimosia nas ideias.', 'Se desconecta, racionaliza o que sente e se isola.', 'Causas que importam, amigos de verdade e liberdade para ser diferente.'],
  'Peixes': ['Água', 'Mutável', 'Netuno e Júpiter', 'Empatia, imaginação e uma espiritualidade sensível.', 'Dificuldade de pôr limites e tendência a fugir da realidade.', 'Absorve o clima ao redor, se confunde e quer sumir.', 'Arte, silêncio, água e limites gentis com o que pesa.'],
};

export function signoCard(nome) {
  const s = SIGNOS[nome] || SIGNOS['Sagitário'];
  return {
    tags: [`Elemento ${s[0]}`, s[1], `Regente: ${s[2]}`],
    blocks: [['Forças', s[3], 'sun', '#E0C78E'], ['Desafios', s[4], 'mountain', '#F3A977'], ['Sob estresse', s[5], 'cloud-lightning', '#F2A7B8'], ['O que ajuda', s[6], 'compass', '#A4DD8C']].map(([title, text, icon, color]) => ({ title, text, icon, color })),
  };
}
