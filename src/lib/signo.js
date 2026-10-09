// Signo solar pela data de nascimento (dia, mês).
const SIGNS = [['♑', 'Capricórnio', 120], ['♒', 'Aquário', 219], ['♓', 'Peixes', 320], ['♈', 'Áries', 420], ['♉', 'Touro', 521], ['♊', 'Gêmeos', 621], ['♋', 'Câncer', 722], ['♌', 'Leão', 823], ['♍', 'Virgem', 923], ['♎', 'Libra', 1023], ['♏', 'Escorpião', 1122], ['♐', 'Sagitário', 1222], ['♑', 'Capricórnio', 1232]];
export const signOf = (d, m) => { const v = m * 100 + d; return SIGNS.find(s => v < s[2]) || SIGNS[0]; };
