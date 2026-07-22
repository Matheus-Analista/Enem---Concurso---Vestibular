import { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, BookOpen, Building2, Sparkles, ChevronLeft, ChevronDown, Sun, Moon,
  Settings, X, Palette, RotateCcw, Calendar, Flame, ListChecks, TrendingUp,
  CheckCircle2, Circle, Landmark, Calculator, PenLine, Brain, Monitor, Newspaper,
  Briefcase, Scale, Home, FileQuestion, FlaskConical, Leaf, Globe, Lightbulb, Users,
  Star, Trophy, Award, Medal, BarChart3, Atom, Languages, ExternalLink, Download,
  ChevronRight, MapPin, Upload,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'foco-estudos:v2';

const ACCENTS = [
  { name: 'Azul-quadro', value: '#2f6690' },
  { name: 'Verde-musgo', value: '#3f7a52' },
  { name: 'Terracota', value: '#c1633c' },
  { name: 'Ameixa', value: '#7c5a96' },
  { name: 'Vinho', value: '#9c3d4e' },
  { name: 'Petróleo', value: '#2f8a82' },
];

const PERF = { weak: '#bb4a3f', medium: '#c99a3a', strong: '#5b8c5f' };

const SUBJECT_COLORS = {
  portugues: '#c1524a', matematica: '#2f6690', fisica: '#7c5a96', quimica: '#4f7a52',
  biologia: '#2f8a82', historia: '#b56a3c', geografia: '#7a8c3f', filosofia: '#5c6478',
  sociologia: '#a15069', redacao: '#b8862e', raciocinio: '#3f7f8f', informatica: '#6b6558',
  atualidades: '#c1633c', dir_constitucional: '#4a5178', dir_administrativo: '#4a5178',
  dir_processual: '#4a5178', dir_tributario: '#4a5178', dir_penal: '#4a5178',
  legislacao_educacional: '#4a5178', contabilidade: '#2f6690', matematica_financeira: '#2f6690',
  atendimento: '#a15069', especificos: '#a15069', didatica: '#b8862e',
};

const SUBJECT_LABELS = {
  portugues: 'Português', matematica: 'Matemática', fisica: 'Física', quimica: 'Química',
  biologia: 'Biologia', historia: 'História', geografia: 'Geografia', filosofia: 'Filosofia',
  sociologia: 'Sociologia', redacao: 'Redação', raciocinio: 'Raciocínio Lógico',
  dir_constitucional: 'Direito Constitucional', dir_administrativo: 'Direito Administrativo',
  dir_processual: 'Direito Processual', dir_tributario: 'Direito Tributário', dir_penal: 'Direito Penal',
  contabilidade: 'Contabilidade', matematica_financeira: 'Matemática Financeira',
  atendimento: 'Atendimento ao Público', informatica: 'Informática', atualidades: 'Atualidades',
  especificos: 'Conhecimentos Específicos', didatica: 'Didática',
  legislacao_educacional: 'Legislação Educacional',
};

const SUBJECT_ICONS = {
  portugues: Languages, matematica: Calculator, fisica: Atom, quimica: FlaskConical,
  biologia: Leaf, historia: Landmark, geografia: Globe, filosofia: Lightbulb, sociologia: Users,
  redacao: PenLine, raciocinio: Brain, informatica: Monitor, atualidades: Newspaper,
  especificos: Briefcase, atendimento: Briefcase, contabilidade: Calculator,
  matematica_financeira: Calculator, didatica: BookOpen, legislacao_educacional: Scale,
  dir_constitucional: Scale, dir_administrativo: Scale, dir_processual: Scale,
  dir_tributario: Scale, dir_penal: Scale,
};

const ENEM_SUBJECTS = ['portugues', 'matematica', 'fisica', 'quimica', 'biologia', 'historia', 'geografia', 'filosofia', 'sociologia'];

const VESTIBULAR_OPTIONS = [
  { key: 'fuvest', label: 'Fuvest (USP)', tip: 'Duas fases: 1ª objetiva (todas as áreas) e 2ª dissertativa com redação.' },
  { key: 'unicamp', label: 'Unicamp', tip: 'Peso forte em redação e questões dissertativas interdisciplinares.' },
  { key: 'unesp', label: 'Unesp', tip: '1ª fase objetiva e 2ª fase dissertativa, formato parecido com a Fuvest.' },
  { key: 'uerj', label: 'UERJ', tip: 'Exame de Qualificação + Exame Discursivo, com questões interdisciplinares.' },
  { key: 'ufrgs', label: 'UFRGS', tip: 'Prova objetiva interdisciplinar, com a redação em etapa separada.' },
  { key: 'ita_ime', label: 'ITA / IME', tip: 'Altíssimo peso em Matemática, Física e Química, com questões dissertativas.' },
  { key: 'unb', label: 'UnB (PAS/Vestibular)', tip: 'Pode ser avaliado ao longo do ensino médio (PAS) ou em vestibular tradicional.' },
  { key: 'outro', label: 'Outro / Ainda não decidi', tip: 'Vamos montar uma base completa e você personaliza depois.' },
];

const CONCURSO_OPTIONS = [
  { key: 'tribunais', label: 'Tribunais / Área Jurídica', tip: 'Costuma pesar bastante Direito Constitucional, Administrativo e Processual.', extra: ['dir_constitucional', 'dir_administrativo', 'dir_processual', 'informatica', 'especificos'] },
  { key: 'fiscal', label: 'Receita Federal / Fiscal', tip: 'Direito Tributário e Contabilidade costumam ter peso alto.', extra: ['dir_constitucional', 'dir_tributario', 'contabilidade', 'informatica', 'especificos'] },
  { key: 'bancario', label: 'Bancário', tip: 'Atendimento, Matemática Financeira e Informática aparecem com frequência.', extra: ['matematica_financeira', 'atendimento', 'informatica', 'especificos'] },
  { key: 'policial', label: 'Policial (PF, PC, PRF, PM)', tip: 'Direito Penal e conhecimentos específicos costumam ser diferenciais.', extra: ['dir_constitucional', 'dir_penal', 'dir_administrativo', 'informatica', 'especificos'] },
  { key: 'educacao', label: 'Educação / Professor', tip: 'Didática e legislação educacional aparecem com frequência.', extra: ['didatica', 'legislacao_educacional', 'dir_administrativo', 'especificos'] },
  { key: 'administrativo', label: 'INSS / Área Administrativa', tip: 'Direito Constitucional e Administrativo formam a base da maioria das provas.', extra: ['dir_constitucional', 'dir_administrativo', 'informatica', 'atualidades'] },
  { key: 'militar', label: 'Militar (Forças Armadas)', tip: 'Provas costumam incluir História, Geografia e conhecimentos específicos da força.', extra: ['dir_constitucional', 'historia', 'geografia', 'especificos'] },
  { key: 'outro', label: 'Outro / Ainda não decidi', tip: 'Vamos montar uma base completa e você personaliza depois.', extra: ['dir_constitucional', 'dir_administrativo', 'informatica', 'atualidades', 'especificos'] },
];

const BRAZIL_STATES = [
  { uf: 'AC', name: 'Acre' }, { uf: 'AL', name: 'Alagoas' }, { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' }, { uf: 'ES', name: 'Espírito Santo' }, { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' }, { uf: 'MT', name: 'Mato Grosso' }, { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' }, { uf: 'PA', name: 'Pará' }, { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' }, { uf: 'PE', name: 'Pernambuco' }, { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' }, { uf: 'RN', name: 'Rio Grande do Norte' }, { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' }, { uf: 'RR', name: 'Roraima' }, { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' }, { uf: 'SE', name: 'Sergipe' }, { uf: 'TO', name: 'Tocantins' },
];

const ESSAY_PROMPTS = [
  'Desafios para a inclusão digital no Brasil contemporâneo',
  'Caminhos para reduzir o desperdício de alimentos no Brasil',
  'Os efeitos da desinformação nas redes sociais para a democracia',
];

const COMPETENCIAS_ENEM = [
  'Domínio da norma culta da língua escrita',
  'Compreensão da proposta e uso de conceitos de várias áreas para desenvolver o tema',
  'Capacidade de organizar e relacionar argumentos e dados em defesa de um ponto de vista',
  'Uso de mecanismos linguísticos para construir a argumentação',
  'Elaboração de uma proposta de intervenção que respeite os direitos humanos',
];

const TIPS = [
  'Estudar um pouco todos os dias vale mais do que uma maratona no fim de semana.',
  'Errar numa questão é ótimo — é assim que a gente descobre onde focar.',
  'Revisar é tão importante quanto aprender pela primeira vez.',
  'Pequenos passos consistentes levam mais longe do que esforços isolados.',
  'Descanso também é estudo: o cérebro consolida o conteúdo enquanto você dorme.',
];

const MEDAL_DEFS = [
  { key: 'diagnostico', label: 'Diagnóstico Completo', icon: Medal, test: (s) => s.onboardingComplete },
  { key: 'primeira_prova', label: 'Primeira Prova', icon: Medal, test: (s) => s.practiceAnswers.length > 0 },
  { key: 'streak3', label: '3 Dias Seguidos', icon: Flame, test: (s) => computeStreak(s.studyDays) >= 3 },
  { key: 'streak7', label: '7 Dias Seguidos', icon: Flame, test: (s) => computeStreak(s.studyDays) >= 7 },
  { key: 'q50', label: '50 Questões', icon: Medal, test: (s) => s.practiceAnswers.length >= 50 },
  { key: 'q100', label: '100 Questões', icon: Medal, test: (s) => s.practiceAnswers.length >= 100 },
  { key: 'redacao1', label: 'Primeira Redação', icon: PenLine, test: (s) => s.essays.length > 0 },
  { key: 'perfeito', label: 'Nota Máxima', icon: Trophy, test: (s) => s.hasPerfectProva },
];

const QUESTION_BANK = [
  { id: 'p1', area: 'portugues', question: 'Leia o trecho: "A cidade cresceu sem planejamento nas últimas décadas, e o resultado são bairros inteiros sem saneamento básico, ruas sem pavimentação e um transporte público insuficiente para atender à população que se multiplicou." O trecho evidencia principalmente:', options: ['Uma crítica aos efeitos da urbanização desordenada', 'Um elogio ao crescimento populacional das cidades', 'Uma descrição neutra do transporte público', 'Uma defesa da ausência de planejamento urbano'], correct: 0, explanation: 'O texto lista consequências negativas (falta de saneamento, ruas sem pavimentação, transporte insuficiente) decorrentes do crescimento sem planejamento, configurando uma crítica à urbanização desordenada.' },
  { id: 'p2', area: 'portugues', question: 'Uma campanha de conscientização traz a frase: "Economize água hoje, garanta o amanhã da sua família." Nessa construção, a linguagem tem como objetivo principal:', options: ['Informar dados técnicos sobre consumo hídrico', 'Persuadir o leitor a mudar de comportamento', 'Descrever cientificamente o ciclo da água', 'Analisar a etimologia da palavra "economizar"'], correct: 1, explanation: 'A frase busca convencer o leitor a agir de determinada forma, o que caracteriza a função conativa (apelativa) da linguagem, típica de campanhas publicitárias.' },
  { id: 'p3', area: 'portugues', question: 'Assinale a alternativa em que todas as ocorrências do acento indicativo de crase estão corretas:', options: ['Cheguei à escola às sete horas e entreguei o trabalho à professora.', 'Cheguei à escola as sete horas e entreguei o trabalho à professora.', 'Cheguei a escola às sete horas e entreguei o trabalho a professora.', 'Cheguei à escola às sete horas e entreguei o trabalho à ela.'], correct: 0, explanation: 'Há crase em "à escola" e "à professora" (antes de substantivos femininos que admitem artigo) e em "às sete horas" (expressão de horário). Não há crase antes de pronomes como "ela".' },
  { id: 'p4', area: 'portugues', question: 'Em qual das alternativas o verbo destacado está empregado de acordo com sua regência na norma-padrão?', options: ['Assisti o jogo pela televisão ontem à noite.', 'Assisti ao jogo pela televisão ontem à noite.', 'Cheguei em casa depois da meia-noite.', 'Prefiro futebol do que vôlei.'], correct: 1, explanation: 'No sentido de "ver, presenciar", o verbo "assistir" é transitivo indireto e exige a preposição "a" (assisti ao jogo). As demais alternativas contêm desvios de regência comuns: "chegar a" (não "em"), e "preferir a" (não "do que").' },
  { id: 'p5', area: 'portugues', question: 'Leia o verso: "O vento sussurrava segredos entre as folhas da mata adormecida." A figura de linguagem predominante nesse verso é:', options: ['Prosopopeia (personificação)', 'Hipérbole', 'Antítese', 'Onomatopeia'], correct: 0, explanation: 'Atribuir ao vento e à mata ações e estados próprios de seres humanos (sussurrar, adormecer) é característico da prosopopeia, também chamada de personificação.' },
  { id: 'p6', area: 'portugues', question: 'Uma obra literária que narra, com tom crítico e detalhista, os costumes e contradições da sociedade urbana da virada do século XIX para o XX, evitando o exagero sentimental do movimento anterior, está mais provavelmente associada ao:', options: ['Romantismo', 'Realismo', 'Barroco', 'Trovadorismo'], correct: 1, explanation: 'A crítica objetiva aos costumes sociais, sem o exagero sentimental típico do Romantismo, é marca do Realismo — movimento do qual Machado de Assis é o principal representante brasileiro.' },
  { id: 'p7', area: 'portugues', question: 'Considere o argumento: "Investir em transporte público de qualidade reduz o número de carros nas ruas, o que diminui o tempo médio de deslocamento de toda a população, inclusive de quem continua optando pelo carro." A conclusão central desse argumento é que:', options: ['Investir em transporte público beneficia até quem não o utiliza', 'Carros deveriam ser proibidos nos centros urbanos', 'O transporte público é sempre mais rápido que o carro', 'Reduzir o número de carros é impossível nas grandes cidades'], correct: 0, explanation: 'O argumento mostra que a melhoria do transporte público gera um benefício indireto até para quem continua usando carro — ou seja, o investimento beneficia a população como um todo.' },

  { id: 'm1', area: 'matematica', question: 'Uma loja vende camisetas por R$ 45 cada. Para pedidos com mais de 10 unidades, é concedido um desconto fixo de R$ 50 sobre o valor total. Se um cliente pagou R$ 490 com esse desconto, quantas camisetas ele comprou?', options: ['10', '11', '12', '13'], correct: 2, explanation: 'Chamando de x o número de camisetas: 45x − 50 = 490 → 45x = 540 → x = 12 camisetas.' },
  { id: 'm2', area: 'matematica', question: 'Uma praça circular tem 10 metros de diâmetro e será totalmente coberta por grama, exceto por um chafariz circular central de 2 metros de raio. Qual é, aproximadamente, a área que será coberta por grama? (use π ≈ 3,14)', options: ['65,9 m²', '78,5 m²', '12,56 m²', '50,0 m²'], correct: 0, explanation: 'Área da praça: π×5² = 78,5 m². Área do chafariz: π×2² = 12,56 m². Área da grama: 78,5 − 12,56 = 65,94 m², aproximadamente 65,9 m².' },
  { id: 'm3', area: 'matematica', question: 'Um produto custava R$ 250. Em uma promoção, o preço sofreu um aumento de 20% e, na semana seguinte, um desconto de 20% sobre o novo valor. Qual é o preço final do produto?', options: ['R$ 240', 'R$ 250', 'R$ 260', 'R$ 300'], correct: 0, explanation: 'Aumento de 20%: 250 × 1,20 = R$ 300. Desconto de 20% sobre R$ 300: 300 × 0,80 = R$ 240. O preço final não volta ao valor original.' },
  { id: 'm4', area: 'matematica', question: 'Uma escada de 5 metros está apoiada em uma parede vertical, com a base a 3 metros de distância do pé da parede (o topo, portanto, toca a 4 metros de altura). Se a base for puxada mais 1 metro para longe da parede, a que altura, aproximadamente, a escada tocará a parede?', options: ['3 metros', '4 metros', '2 metros', '4,5 metros'], correct: 0, explanation: 'Com a base a 4 m da parede: 4² + h² = 5² → h² = 25 − 16 = 9 → h = 3 metros. A escada, antes a 4 m de altura, desce para 3 m.' },
  { id: 'm5', area: 'matematica', question: 'O custo mensal de um plano de internet é dado pela função C(x) = 80 + 5x, em que x representa o número de gigabytes consumidos além da franquia. Se uma pessoa pagou R$ 155 em determinado mês, quantos gigabytes ela consumiu além da franquia?', options: ['10', '12', '15', '18'], correct: 2, explanation: '155 = 80 + 5x → 5x = 75 → x = 15 gigabytes além da franquia.' },
  { id: 'm6', area: 'matematica', question: 'As notas de um aluno em quatro provas foram 6, 7, 8 e x. Para que a média aritmética das quatro notas seja exatamente 7,5, qual deve ser o valor de x?', options: ['7', '8', '9', '10'], correct: 2, explanation: '(6 + 7 + 8 + x) ÷ 4 = 7,5 → 21 + x = 30 → x = 9.' },
  { id: 'm7', area: 'matematica', question: 'Uma urna contém 4 bolas vermelhas e 6 bolas azuis. Retirando-se uma bola ao acaso e, sem repor, retirando-se uma segunda, qual é a probabilidade de as duas bolas retiradas serem vermelhas?', options: ['2/15', '4/10', '3/9', '1/5'], correct: 0, explanation: 'P(1ª vermelha) = 4/10. Sem repor, P(2ª vermelha) = 3/9. P(ambas) = 4/10 × 3/9 = 12/90 = 2/15.' },

  { id: 'f1', area: 'fisica', question: 'Um carro parte do repouso e acelera uniformemente a 2 m/s². Após quanto tempo ele atinge a velocidade de 20 m/s?', options: ['5 s', '8 s', '10 s', '20 s'], correct: 2, explanation: 'v = v₀ + at → 20 = 0 + 2×t → t = 10 segundos.' },
  { id: 'f2', area: 'fisica', question: 'Uma força resultante de 40 N é aplicada sobre um corpo de massa 8 kg, inicialmente em repouso, sobre uma superfície sem atrito. Qual será a aceleração desse corpo?', options: ['2 m/s²', '5 m/s²', '8 m/s²', '40 m/s²'], correct: 1, explanation: 'Pela 2ª Lei de Newton, F = m×a → 40 = 8×a → a = 5 m/s².' },
  { id: 'f3', area: 'fisica', question: 'Um objeto é erguido do chão até 2 metros de altura e depois solto. Ao longo da queda, desprezando a resistência do ar, é correto afirmar que:', options: ['A energia potencial se transforma progressivamente em energia cinética', 'A energia cinética permanece constante durante toda a queda', 'A energia total do sistema diminui ao longo da queda', 'A energia potencial aumenta conforme o objeto se aproxima do solo'], correct: 0, explanation: 'Pela conservação de energia mecânica, a energia potencial gravitacional se converte em energia cinética à medida que o objeto cai, mantendo a energia total constante.' },
  { id: 'f4', area: 'fisica', question: 'Em um circuito elétrico simples, dois resistores de 10 Ω e 20 Ω estão associados em série, ligados a uma bateria de 12 V. Qual é a corrente elétrica que percorre o circuito?', options: ['0,2 A', '0,4 A', '1,2 A', '2,4 A'], correct: 1, explanation: 'Em série, a resistência total é 10+20=30 Ω. Pela Lei de Ohm, I = V/R = 12/30 = 0,4 A.' },
  { id: 'f5', area: 'fisica', question: 'Uma onda sonora se propaga no ar com frequência de 340 Hz e velocidade de 340 m/s. Qual é o comprimento de onda dessa onda sonora?', options: ['0,5 m', '1 m', '2 m', '340 m'], correct: 1, explanation: 'λ = v/f = 340/340 = 1 metro.' },

  { id: 'q1', area: 'quimica', question: 'Considere a reação de combustão completa do metano: CH₄ + 2 O₂ → CO₂ + 2 H₂O. Se forem consumidos 3 mols de CH₄, quantos mols de O₂ serão necessários para a combustão completa?', options: ['3 mols', '4 mols', '6 mols', '9 mols'], correct: 2, explanation: 'Pela proporção estequiométrica da equação balanceada (1 CH₄ : 2 O₂), 3 mols de CH₄ exigem 6 mols de O₂.' },
  { id: 'q2', area: 'quimica', question: 'O pH de uma solução é definido pela relação pH = −log[H⁺]. Se a concentração de íons H⁺ de uma solução é 10⁻⁵ mol/L, qual é o pH dessa solução, e como ela deve ser classificada?', options: ['pH = 5, solução ácida', 'pH = 5, solução básica', 'pH = 9, solução ácida', 'pH = 9, solução básica'], correct: 0, explanation: 'pH = −log(10⁻⁵) = 5. Como o valor está abaixo de 7, a solução é classificada como ácida.' },
  { id: 'q3', area: 'quimica', question: 'Para separar uma mistura de areia e sal dissolvido em água, o procedimento mais adequado é:', options: ['Filtração seguida de evaporação', 'Decantação apenas', 'Destilação simples apenas', 'Centrifugação apenas'], correct: 0, explanation: 'Primeiro se filtra a mistura para separar a areia (sólido insolúvel) da água salgada; em seguida, evapora-se a água para obter o sal dissolvido.' },
  { id: 'q4', area: 'quimica', question: 'Em uma reação química, a energia dos produtos é menor do que a energia dos reagentes. Essa reação libera calor para o ambiente e é classificada como:', options: ['Endotérmica', 'Exotérmica', 'Isotérmica', 'Adiabática'], correct: 1, explanation: 'Quando a energia dos produtos é menor que a dos reagentes, a diferença de energia é liberada como calor — característica das reações exotérmicas.' },
  { id: 'q5', area: 'quimica', question: 'Dois átomos formam uma ligação em que há compartilhamento desigual de elétrons devido à diferença de eletronegatividade entre eles, gerando polos parcialmente positivo e negativo na molécula. Esse tipo de ligação é chamado de:', options: ['Ligação iônica', 'Ligação covalente polar', 'Ligação covalente apolar', 'Ligação metálica'], correct: 1, explanation: 'O compartilhamento desigual de elétrons entre átomos com eletronegatividades diferentes caracteriza a ligação covalente polar, gerando um dipolo elétrico na molécula.' },

  { id: 'b1', area: 'biologia', question: 'Durante um exercício físico intenso, o corpo aumenta a frequência respiratória para suprir a maior demanda de oxigênio dos músculos. Esse processo está diretamente relacionado à necessidade de:', options: ['Aumentar a produção de ATP pela respiração celular', 'Reduzir a temperatura corporal exclusivamente', 'Diminuir a frequência cardíaca', 'Interromper a digestão de nutrientes'], correct: 0, explanation: 'O aumento da respiração fornece mais oxigênio para a respiração celular nas mitocôndrias, processo que produz ATP, energia necessária para a contração muscular intensa.' },
  { id: 'b2', area: 'biologia', question: 'Em ervilhas, a cor amarela da semente (Y) é dominante sobre a cor verde (y). Cruzando-se duas plantas heterozigotas (Yy × Yy), qual é a proporção esperada de sementes verdes na geração seguinte?', options: ['1/4', '1/2', '3/4', '100%'], correct: 0, explanation: 'No cruzamento Yy × Yy, a proporção genotípica é 1 YY : 2 Yy : 1 yy. Como yy é a única combinação recessiva (verde), a proporção de sementes verdes é 1/4.' },
  { id: 'b3', area: 'biologia', question: 'Em um ecossistema, a introdução de uma espécie exótica predadora, sem predadores naturais locais, pode levar à:', options: ['Redução populacional das espécies nativas que servem de presa', 'Estabilização automática e imediata do ecossistema', 'Extinção certa apenas da espécie introduzida', 'Nenhuma alteração significativa na cadeia alimentar'], correct: 0, explanation: 'Espécies exóticas sem predadores naturais no novo ambiente tendem a se proliferar descontroladamente, pressionando e reduzindo as populações nativas que lhes servem de presa.' },
  { id: 'b4', area: 'biologia', question: 'Uma célula colocada em uma solução extremamente hipertônica (com concentração de soluto muito maior que a do meio intracelular) tende a:', options: ['Perder água para o meio externo, podendo sofrer crenação (murchar)', 'Ganhar água do meio externo e inchar', 'Permanecer inalterada, sem qualquer troca', 'Se dividir imediatamente por mitose'], correct: 0, explanation: 'Em meio hipertônico, a água sai da célula por osmose (do meio menos concentrado para o mais concentrado), podendo causar a crenação (murchamento) da célula.' },
  { id: 'b5', area: 'biologia', question: 'Uma população de insetos é exposta a um inseticida. Com o tempo, observa-se que os insetos sobreviventes e sua descendência se tornam cada vez mais resistentes ao produto. Esse fenômeno é mais bem explicado pelo conceito de:', options: ['Seleção natural atuando sobre a variabilidade genética da população', 'Mutação induzida diretamente pelo inseticida em todos os indivíduos', 'Herança das características adquiridas ao longo da vida', 'Deriva genética aleatória sem relação com o inseticida'], correct: 0, explanation: 'Indivíduos com variações genéticas que conferem resistência sobrevivem e se reproduzem mais, transmitindo essa característica — um exemplo clássico de seleção natural.' },

  { id: 'h1', area: 'historia', question: 'O fim do Império e a Proclamação da República no Brasil, em 1889, foram fortemente influenciados pelo(a):', options: ['Insatisfação de setores militares e da elite cafeeira com a monarquia', 'Apoio unânime da população ao imperador Dom Pedro II', 'Intervenção militar direta de potências europeias', 'Aprovação popular por meio de um plebiscito nacional'], correct: 0, explanation: 'A insatisfação de militares e da elite cafeeira, somada ao desgaste da monarquia após a abolição da escravidão, foram fatores centrais para a Proclamação da República.' },
  { id: 'h2', area: 'historia', question: 'O processo de Independência do Brasil, consolidado em 1822, não representou uma ruptura completa com as estruturas coloniais porque:', options: ['Manteve a escravidão e grande parte da estrutura social e econômica anterior', 'Aboliu imediatamente a monarquia e instaurou uma república', 'Eliminou completamente a influência portuguesa na economia', 'Distribuiu terras igualitariamente entre a população'], correct: 0, explanation: 'A Independência manteve a monarquia, a escravidão e a estrutura latifundiária, configurando uma continuidade das relações sociais e econômicas coloniais.' },
  { id: 'h3', area: 'historia', question: 'Entre as principais consequências sociais da Revolução Industrial, iniciada na Inglaterra no século XVIII, está:', options: ['O surgimento de uma classe operária urbana submetida a longas jornadas de trabalho', 'O fortalecimento exclusivo da nobreza feudal', 'A redução da migração do campo para as cidades', 'O desaparecimento imediato da atividade agrícola'], correct: 0, explanation: 'A Revolução Industrial gerou intensa urbanização e formou uma classe operária submetida a jornadas exaustivas e condições precárias de trabalho nas fábricas.' },
  { id: 'h4', area: 'historia', question: 'Entre os fatores que contribuíram para a eclosão da Segunda Guerra Mundial, em 1939, está:', options: ['O expansionismo territorial da Alemanha nazista sob Adolf Hitler', 'A dissolução pacífica da União Soviética', 'A unificação da Alemanha e da Itália', 'O fim do sistema de colônias europeias na África'], correct: 0, explanation: 'O expansionismo territorial alemão, com a invasão da Polônia em 1939, foi o estopim direto da Segunda Guerra Mundial.' },
  { id: 'h5', area: 'historia', question: 'O Regime Militar brasileiro (1964-1985) caracterizou-se, entre outros aspectos, por:', options: ['Supressão de liberdades democráticas e forte repressão política a opositores', 'Ampliação irrestrita da liberdade de imprensa', 'Realização de eleições diretas para presidente durante todo o período', 'Fortalecimento dos sindicatos e movimentos sociais autônomos'], correct: 0, explanation: 'O período foi marcado por censura, perseguição política, cassação de mandatos e supressão de direitos civis, com eleições indiretas para presidente.' },
  { id: 'h6', area: 'historia', question: 'A abolição da escravidão no Brasil, em 1888, ocorreu sem que o Estado promovesse políticas efetivas de inclusão social e econômica dos ex-escravizados, o que contribuiu para:', options: ['A perpetuação de desigualdades sociais e raciais que persistem até hoje', 'A imediata igualdade de oportunidades entre todos os brasileiros', 'A distribuição automática de terras aos ex-escravizados', 'O fim total do racismo estrutural na sociedade brasileira'], correct: 0, explanation: 'Sem políticas de reparação, terra, educação ou trabalho para os libertos, a abolição não rompeu as desigualdades estruturais, cujos efeitos ainda se refletem na sociedade brasileira.' },

  { id: 'g1', area: 'geografia', question: 'O fenômeno El Niño, caracterizado pelo aquecimento anormal das águas do Oceano Pacífico, pode provocar, entre outras consequências no Brasil:', options: ['Alterações no regime de chuvas, com secas em algumas regiões e chuvas intensas em outras', 'Aumento uniforme de chuvas em todo o território nacional', 'Redução da temperatura média global', 'Nenhum efeito perceptível no clima brasileiro'], correct: 0, explanation: 'O El Niño altera os padrões de circulação atmosférica, provocando secas em regiões como o Nordeste e chuvas mais intensas no Sul do Brasil, por exemplo.' },
  { id: 'g2', area: 'geografia', question: 'A Amazônia, maior bioma brasileiro, vem sofrendo pressões ambientais crescentes, entre as quais se destaca:', options: ['O avanço do desmatamento para expansão agropecuária', 'A ausência total de atividade humana na região', 'O congelamento constante das águas dos rios', 'A escassez completa de biodiversidade'], correct: 0, explanation: 'O desmatamento para abertura de pastagens e áreas de cultivo é uma das principais pressões ambientais sobre a Amazônia.' },
  { id: 'g3', area: 'geografia', question: 'Países localizados sobre os limites de placas tectônicas, como o Japão e o Chile, apresentam maior frequência de:', options: ['Terremotos e atividade vulcânica', 'Furacões e tornados', 'Secas prolongadas', 'Enchentes decorrentes de degelo polar'], correct: 0, explanation: 'Regiões situadas sobre limites de placas tectônicas, como o Círculo de Fogo do Pacífico, apresentam maior incidência de terremotos e vulcões devido à movimentação dessas placas.' },
  { id: 'g4', area: 'geografia', question: 'Países cortados pela Linha do Equador tendem a apresentar, de modo geral:', options: ['Clima quente e úmido durante praticamente todo o ano', 'Estações do ano bem demarcadas, com invernos rigorosos', 'Clima predominantemente árido e frio', 'Ausência total de precipitação pluviométrica'], correct: 0, explanation: 'Regiões próximas à Linha do Equador recebem incidência solar mais direta e constante, resultando em clima quente e úmido ao longo do ano.' },
  { id: 'g5', area: 'geografia', question: 'O crescimento acelerado e desordenado das cidades brasileiras a partir da segunda metade do século XX, sem planejamento adequado de infraestrutura, resultou principalmente em:', options: ['Expansão de áreas de ocupação irregular e déficit de serviços urbanos básicos', 'Redução da densidade populacional nas periferias', 'Distribuição igualitária de renda entre os habitantes urbanos', 'Diminuição da demanda por transporte público'], correct: 0, explanation: 'A urbanização acelerada sem planejamento gerou ocupações irregulares e insuficiência de saneamento, transporte e outros serviços urbanos básicos.' },
  { id: 'g6', area: 'geografia', question: 'Entre as fontes de energia utilizadas no Brasil, a hidrelétrica se destaca por ser renovável, mas também apresenta impactos ambientais, como:', options: ['Alagamento de grandes áreas e deslocamento de populações ribeirinhas', 'Emissão intensa de gases do efeito estufa durante a geração', 'Esgotamento definitivo do recurso hídrico utilizado', 'Poluição do ar comparável à de usinas termelétricas a carvão'], correct: 0, explanation: 'A construção de hidrelétricas frequentemente exige o alagamento de grandes áreas para formar reservatórios, o que pode deslocar populações e impactar ecossistemas locais.' },

  { id: 'fi1', area: 'filosofia', question: 'O método socrático, baseado em perguntas sucessivas que levam o interlocutor a reconhecer suas próprias contradições e buscar o conhecimento por si mesmo, é conhecido como:', options: ['Maiêutica', 'Dialética hegeliana', 'Método cartesiano', 'Empirismo'], correct: 0, explanation: 'A maiêutica socrática consiste em, por meio do diálogo e de perguntas, "dar à luz" o conhecimento que já estaria latente no interlocutor.' },
  { id: 'fi2', area: 'filosofia', question: 'Ao afirmar "penso, logo existo", Descartes busca estabelecer uma verdade indubitável a partir da dúvida metódica. Esse procedimento é característico da corrente filosófica conhecida como:', options: ['Racionalismo', 'Empirismo', 'Ceticismo absoluto', 'Existencialismo'], correct: 0, explanation: 'O racionalismo cartesiano parte da razão, e não da experiência sensível, como fonte primeira e mais confiável do conhecimento verdadeiro.' },
  { id: 'fi3', area: 'filosofia', question: 'Uma pessoa que, diante do medo, nem foge covardemente nem age de forma imprudente, mas enfrenta o perigo de maneira equilibrada, exemplifica o conceito aristotélico de:', options: ['Virtude como justo meio-termo', 'Imperativo categórico', 'Vontade de potência', 'Alienação'], correct: 0, explanation: 'Para Aristóteles, a virtude (como a coragem) situa-se no equilíbrio entre dois extremos viciosos — nesse caso, entre a covardia (falta) e a temeridade (excesso).' },
  { id: 'fi4', area: 'filosofia', question: 'Diferentemente de Hobbes, que via o estado de natureza como um cenário de guerra de todos contra todos, Rousseau argumentava que:', options: ['O ser humano seria naturalmente bom, e a sociedade civil o corromperia', 'O estado de natureza seria idêntico ao proposto por Hobbes', 'Não deveria existir nenhum tipo de contrato social', 'A propriedade privada não teria qualquer papel nas desigualdades sociais'], correct: 0, explanation: 'Rousseau defendia que o ser humano seria naturalmente bom ("bom selvagem"), e que seria a sociedade civil, com a propriedade privada, a responsável por corrompê-lo e gerar desigualdades.' },
  { id: 'fi5', area: 'filosofia', question: 'Segundo o imperativo categórico kantiano, uma ação só é moralmente correta se:', options: ['Sua máxima puder ser universalizada, valendo como lei para todos', 'Ela gerar o máximo de prazer para quem a pratica', 'For aprovada pela maioria da população em uma votação', 'For determinada exclusivamente por uma autoridade religiosa'], correct: 0, explanation: 'O imperativo categórico de Kant estabelece que devemos agir apenas segundo máximas que possamos, ao mesmo tempo, desejar que se tornem leis universais.' },
  { id: 'fi6', area: 'filosofia', question: 'No mito da caverna, o prisioneiro que se liberta e enxerga a luz do sol, mas depois retorna à caverna para libertar os demais, enfrentando resistência e descrença, representa metaforicamente:', options: ['O papel do filósofo que busca conduzir outros ao conhecimento verdadeiro, mesmo diante da resistência', 'A impossibilidade de qualquer forma de conhecimento', 'A superioridade da vida sensível sobre a vida contemplativa', 'A ideia de que o conhecimento deve permanecer restrito a poucos'], correct: 0, explanation: 'O retorno do prisioneiro liberto à caverna simboliza a missão do filósofo de compartilhar o conhecimento verdadeiro, mesmo enfrentando a resistência dos que permanecem presos às aparências.' },

  { id: 's1', area: 'sociologia', question: 'Para Marx, o conflito entre burguesia (detentora dos meios de produção) e proletariado (que vende sua força de trabalho) seria o motor da história, pois:', options: ['As contradições entre as classes sociais geram transformações históricas e sociais', 'Ambas as classes sempre compartilham exatamente os mesmos interesses econômicos', 'O Estado seria neutro e equidistante em relação a essa disputa', 'As classes sociais deixariam de existir espontaneamente sem qualquer conflito'], correct: 0, explanation: 'Para Marx, a luta de classes — decorrente de interesses econômicos opostos entre burguesia e proletariado — impulsiona as transformações históricas e sociais.' },
  { id: 's2', area: 'sociologia', question: 'O uso da língua portuguesa, as normas de trânsito e os costumes sociais são exemplos do que Durkheim chamou de:', options: ['Fatos sociais', 'Mais-valia', 'Ação social', 'Alienação'], correct: 0, explanation: 'Fatos sociais são formas de agir, pensar e sentir exteriores ao indivíduo, que exercem coerção social — como a língua, as leis e os costumes.' },
  { id: 's3', area: 'sociologia', question: 'Quando um indivíduo participa de uma greve para reivindicar melhores condições de trabalho, levando em conta o comportamento e as reações de outras pessoas envolvidas, ele está praticando o que Weber chamou de:', options: ['Ação social', 'Fato social externo e coercitivo', 'Mais-valia relativa', 'Materialismo histórico'], correct: 0, explanation: 'Para Weber, ação social é todo comportamento ao qual o indivíduo atribui um sentido subjetivo, orientado pela conduta de outras pessoas — como ocorre em uma greve coletiva.' },
  { id: 's4', area: 'sociologia', question: 'Uma criança que aprende, ao longo da infância, os valores, normas e comportamentos aceitos por sua cultura, por meio da família, da escola e de outros grupos sociais, está passando pelo processo de:', options: ['Socialização', 'Estratificação', 'Alienação', 'Segregação institucional'], correct: 0, explanation: 'A socialização é o processo pelo qual o indivíduo internaliza, ao longo da vida, os valores e normas de sua cultura e sociedade.' },
  { id: 's5', area: 'sociologia', question: 'Em uma sociedade em que o acesso à educação de qualidade, à saúde e a oportunidades de emprego varia fortemente conforme a renda familiar, observa-se um exemplo evidente de:', options: ['Estratificação social', 'Homogeneização cultural', 'Globalização econômica', 'Secularização'], correct: 0, explanation: 'A distribuição desigual de acesso a recursos e oportunidades conforme a posição social e econômica caracteriza a estratificação social.' },

  { id: 'r1', area: 'raciocinio', question: 'Considere: (1) Todos os professores da escola são formados em Pedagogia. (2) Alguns formados em Pedagogia trabalham em bibliotecas. (3) Maria é professora da escola. É correto concluir que:', options: ['Maria é formada em Pedagogia', 'Maria trabalha em uma biblioteca', 'Maria não é formada em Pedagogia', 'Todos os formados em Pedagogia são professores da escola'], correct: 0, explanation: 'Da premissa (1), todo professor da escola é formado em Pedagogia. Como Maria é professora da escola, ela é formada em Pedagogia. Não dá para concluir sobre a biblioteca, pois a premissa (2) fala apenas de "alguns".' },
  { id: 'r2', area: 'raciocinio', question: 'Observe a sequência: 1, 1, 2, 3, 5, 8, 13, ... Qual é o próximo número?', options: ['18', '20', '21', '26'], correct: 2, explanation: 'Trata-se da sequência de Fibonacci, em que cada termo é a soma dos dois anteriores: 8 + 13 = 21.' },
  { id: 'r3', area: 'raciocinio', question: 'Se depois de amanhã for sábado, que dia da semana foi anteontem?', options: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira'], correct: 1, explanation: 'Se depois de amanhã é sábado, hoje é quinta-feira. Anteontem (2 dias antes de hoje) foi terça-feira.' },
  { id: 'r4', area: 'raciocinio', question: 'A negação lógica da proposição "Todos os alunos gostam de matemática" é:', options: ['Nenhum aluno gosta de matemática', 'Pelo menos um aluno não gosta de matemática', 'Todos os alunos não gostam de matemática', 'Alguns alunos gostam de matemática'], correct: 1, explanation: 'A negação de "Todos são X" não é "Nenhum é X", mas sim "Existe pelo menos um que não é X" — nesse caso, "pelo menos um aluno não gosta de matemática".' },
  { id: 'r5', area: 'raciocinio', question: 'Em uma fila de 6 pessoas, Carla é a 3ª da fila e Bruno está imediatamente atrás dela. Se Ana está 2 posições à frente de Bruno, em que posição está Ana?', options: ['1ª', '2ª', '3ª', '5ª'], correct: 1, explanation: 'Carla está na 3ª posição; Bruno, imediatamente atrás dela, está na 4ª. Ana, 2 posições à frente de Bruno, está na 2ª posição (4 − 2 = 2).' },
  { id: 'r6', area: 'raciocinio', question: 'Qual é o menor número inteiro positivo maior que 100 que é divisível simultaneamente por 4 e por 6?', options: ['102', '104', '108', '112'], correct: 2, explanation: 'O número deve ser múltiplo de 12 (mmc de 4 e 6). O primeiro múltiplo de 12 maior que 100 é 108 (12 × 9).' },

  { id: 'i1', area: 'informatica', question: 'Em uma planilha do Excel, para somar automaticamente os valores das células de A1 até A10, a fórmula correta a ser inserida é:', options: ['=SOMA(A1:A10)', '=SOMA(A1+A10)', '=TOTAL(A1-A10)', '=A1+A10'], correct: 0, explanation: 'A função SOMA com o intervalo indicado por dois-pontos (A1:A10) soma automaticamente todos os valores das células do intervalo especificado.' },
  { id: 'i2', area: 'informatica', question: 'Um funcionário recebe um e-mail supostamente do banco, solicitando que clique em um link e informe sua senha para "regularizar" a conta. Essa é uma tentativa típica de:', options: ['Phishing', 'Backup automático', 'Firewall', 'Criptografia de dados'], correct: 0, explanation: 'Phishing é uma técnica de fraude eletrônica que tenta enganar o usuário para obter dados sigilosos, geralmente por meio de e-mails ou sites falsos.' },
  { id: 'i3', area: 'informatica', question: 'Uma rede que conecta computadores restrita a uma área geográfica limitada, como um escritório ou uma residência, é chamada de:', options: ['LAN (Local Area Network)', 'WAN (Wide Area Network)', 'URL', 'HTTP'], correct: 0, explanation: 'LAN é a sigla para Local Area Network, uma rede de abrangência local e limitada, como a de um escritório ou residência.' },
  { id: 'i4', area: 'informatica', question: 'Armazenar arquivos em serviços como Google Drive ou OneDrive, acessíveis de qualquer lugar com conexão à internet, é um exemplo do uso de:', options: ['Computação em nuvem (cloud computing)', 'Rede LAN exclusivamente local', 'Um vírus de computador', 'Um firewall'], correct: 0, explanation: 'A computação em nuvem permite armazenar e acessar dados remotamente pela internet, sem depender de um único dispositivo físico local.' },

  { id: 'at1', area: 'atualidades', question: 'Uma das estratégias mais eficazes para identificar uma possível notícia falsa (fake news) antes de compartilhá-la é:', options: ['Verificar se a informação é confirmada por fontes jornalísticas confiáveis e diversas', 'Compartilhar rapidamente para alertar o maior número de pessoas possível', 'Confiar no conteúdo se ele tiver muitos compartilhamentos', 'Considerar verdadeira qualquer informação que confirme a própria opinião'], correct: 0, explanation: 'Checar a informação em fontes jornalísticas diversas e confiáveis é uma das formas mais eficazes de identificar notícias falsas antes de compartilhá-las.' },
  { id: 'at2', area: 'atualidades', question: 'Uma empresa que reduz o desperdício de matéria-prima, investe em energias renováveis e busca minimizar impactos ambientais sem abrir mão de sua viabilidade econômica está alinhada ao conceito de:', options: ['Desenvolvimento sustentável', 'Obsolescência programada', 'Especulação financeira', 'Protecionismo comercial'], correct: 0, explanation: 'O desenvolvimento sustentável busca equilibrar crescimento econômico, responsabilidade ambiental e bem-estar social.' },
  { id: 'at3', area: 'atualidades', question: 'Uma empresa que coleta dados pessoais de clientes sem informar a finalidade do uso e sem consentimento explícito pode estar violando princípios previstos na:', options: ['LGPD (Lei Geral de Proteção de Dados)', 'CLT (Consolidação das Leis do Trabalho)', 'LDB (Lei de Diretrizes e Bases)', 'Lei de Improbidade Administrativa'], correct: 0, explanation: 'A LGPD exige transparência, finalidade específica e, em regra, consentimento para a coleta e o uso de dados pessoais por empresas e órgãos.' },
  { id: 'at4', area: 'atualidades', question: 'Uma das principais preocupações éticas discutidas atualmente sobre sistemas de inteligência artificial é:', options: ['A possibilidade de reprodução de vieses e discriminações presentes nos dados usados para treiná-los', 'A total impossibilidade de qualquer erro em suas respostas', 'A garantia de que sempre substituirão integralmente o trabalho humano', 'A ausência completa de qualquer necessidade de regulamentação'], correct: 0, explanation: 'Como sistemas de IA aprendem a partir de grandes volumes de dados, eles podem reproduzir e até amplificar vieses presentes nesses dados, o que gera debates éticos sobre seu uso responsável.' },

  { id: 'dc1', area: 'dir_constitucional', question: 'Um cidadão tem seu direito de ir e vir restringido por uma autoridade sem qualquer previsão legal ou decisão judicial. Essa situação viola diretamente:', options: ['O princípio da legalidade e os direitos fundamentais previstos na Constituição', 'Apenas normas de trânsito municipais', 'Exclusivamente o Código Civil', 'Nenhuma norma jurídica, pois autoridades têm poder irrestrito'], correct: 0, explanation: 'A liberdade de locomoção é um direito fundamental constitucional, que só pode ser restringido nos casos previstos em lei ou por decisão judicial.' },
  { id: 'dc2', area: 'dir_constitucional', question: 'Quando o Poder Judiciário julga a constitucionalidade de uma lei aprovada pelo Poder Legislativo, ele exerce um mecanismo de:', options: ['Freios e contrapesos (checks and balances) entre os poderes', 'Subordinação total do Judiciário ao Legislativo', 'Anulação definitiva do princípio da separação dos poderes', 'Delegação irrestrita de poder ao Executivo'], correct: 0, explanation: 'O controle de constitucionalidade exercido pelo Judiciário é um exemplo do sistema de freios e contrapesos, que garante equilíbrio e fiscalização mútua entre os poderes.' },
  { id: 'dc3', area: 'dir_constitucional', question: 'O princípio constitucional segundo o qual ninguém será processado nem sentenciado sem que lhe sejam assegurados o contraditório e a ampla defesa é o princípio do(a):', options: ['Devido processo legal', 'Livre iniciativa', 'Função social da propriedade', 'Soberania popular'], correct: 0, explanation: 'O devido processo legal garante que ninguém seja privado de seus direitos sem um processo justo, assegurando contraditório e ampla defesa.' },

  { id: 'da1', area: 'dir_administrativo', question: 'Um servidor público concede vantagem indevida a uma empresa amiga em um processo de licitação, favorecendo-a sem justificativa técnica. Essa conduta viola diretamente o princípio da:', options: ['Impessoalidade', 'Eficiência exclusivamente', 'Continuidade do serviço público', 'Autotutela'], correct: 0, explanation: 'A impessoalidade exige que a Administração trate a todos de forma isonômica, sem favorecimentos pessoais ou direcionamentos indevidos.' },
  { id: 'da2', area: 'dir_administrativo', question: 'A exigência constitucional de concurso público para o provimento de cargos efetivos tem como principal finalidade:', options: ['Garantir a igualdade de oportunidades e a seleção por mérito', 'Permitir a indicação política de candidatos', 'Reduzir o número de servidores públicos ativos', 'Favorecer apenas candidatos com relações pessoais na administração'], correct: 0, explanation: 'O concurso público busca assegurar igualdade de acesso aos cargos públicos e selecionar os candidatos com base no mérito.' },
  { id: 'da3', area: 'dir_administrativo', question: 'Ao constatar que um ato administrativo anterior foi praticado em desacordo com a lei, a própria Administração Pública pode, de ofício, corrigir essa ilegalidade por meio da:', options: ['Anulação do ato', 'Revogação por conveniência', 'Prescrição do ato', 'Delegação de competência'], correct: 0, explanation: 'A anulação é o instrumento pelo qual a Administração retira do mundo jurídico um ato ilegal, podendo fazê-lo de ofício, em respeito ao princípio da autotutela.' },

  { id: 'dp1', area: 'dir_processual', question: 'Em um processo judicial, antes de qualquer decisão que possa prejudicar uma das partes, é assegurado a ela o direito de se manifestar e apresentar suas razões. Esse direito decorre do princípio do(a):', options: ['Contraditório', 'Economia processual', 'Publicidade absoluta', 'Oralidade'], correct: 0, explanation: 'O princípio do contraditório garante às partes o direito de serem ouvidas e de se manifestarem antes de decisões que possam afetá-las.' },
  { id: 'dp2', area: 'dir_processual', question: 'A etapa processual em que as partes apresentam testemunhas, documentos e demais elementos para comprovar os fatos alegados no processo é conhecida como fase:', options: ['Instrutória', 'Postulatória', 'Recursal', 'Executória'], correct: 0, explanation: 'A fase instrutória é dedicada à produção e à análise das provas apresentadas pelas partes.' },

  { id: 'dt1', area: 'dir_tributario', question: 'Um município cobra uma quantia de um morador especificamente pela coleta de lixo em sua rua, serviço público específico e divisível prestado a ele. Esse tributo é classificado como:', options: ['Taxa', 'Imposto', 'Contribuição de melhoria', 'Empréstimo compulsório'], correct: 0, explanation: 'A taxa é cobrada em razão de um serviço público específico e divisível prestado ao contribuinte, diferentemente do imposto.' },
  { id: 'dt2', area: 'dir_tributario', question: 'Se uma lei que institui um novo tributo é publicada em dezembro de determinado ano, o princípio da anterioridade tributária, em regra, impede que:', options: ['O tributo seja cobrado já no mesmo exercício financeiro da publicação', 'O tributo seja cobrado em qualquer momento futuro', 'Qualquer tributo seja instituído no Brasil', 'A lei tributária tenha eficácia em algum momento'], correct: 0, explanation: 'O princípio da anterioridade, em regra, impede a cobrança do tributo no mesmo exercício financeiro em que a lei que o instituiu foi publicada.' },

  { id: 'dpe1', area: 'dir_penal', question: 'Uma pessoa é acusada de um crime que, à época dos fatos, não era previsto como tal em nenhuma lei. Pelo princípio da legalidade penal, essa pessoa:', options: ['Não pode ser punida, pois não havia lei anterior definindo o fato como crime', 'Deve ser punida com a pena mais severa prevista no ordenamento', 'Pode ser julgada com base em uma lei criada posteriormente ao fato, se essa lei for mais rigorosa', 'Deve responder ao processo independentemente de qualquer previsão legal'], correct: 0, explanation: 'Pelo princípio da legalidade (não há crime sem lei anterior que o defina), ninguém pode ser punido por um fato que não era criminalizado no momento em que ocorreu.' },
  { id: 'dpe2', area: 'dir_penal', question: 'Um indivíduo subtrai um bem alheio mediante grave ameaça, causando temor imediato à vítima. Esse crime é classificado como:', options: ['Roubo', 'Furto', 'Estelionato', 'Receptação'], correct: 0, explanation: 'O uso de violência ou grave ameaça na subtração de bem alheio caracteriza o crime de roubo, diferenciando-o do furto, que ocorre sem esse elemento.' },

  { id: 'le1', area: 'legislacao_educacional', question: 'A lei que organiza a estrutura da educação nacional, estabelecendo os níveis e modalidades de ensino no Brasil, é conhecida como:', options: ['LDB (Lei de Diretrizes e Bases da Educação Nacional)', 'ECA (Estatuto da Criança e do Adolescente)', 'CLT (Consolidação das Leis do Trabalho)', 'LGPD (Lei Geral de Proteção de Dados)'], correct: 0, explanation: 'A LDB (Lei nº 9.394/1996) organiza toda a estrutura da educação nacional, definindo níveis, modalidades e diretrizes de ensino.' },
  { id: 'le2', area: 'legislacao_educacional', question: 'Segundo a legislação educacional brasileira, a etapa que compreende crianças de 0 a 5 anos de idade é denominada:', options: ['Educação Infantil', 'Ensino Fundamental', 'Ensino Médio', 'Educação de Jovens e Adultos'], correct: 0, explanation: 'A Educação Infantil, primeira etapa da Educação Básica, atende crianças de 0 a 5 anos de idade, segundo a LDB.' },

  { id: 'c1', area: 'contabilidade', question: 'Uma empresa registra, em ordem cronológica, todas as suas movimentações financeiras diárias, incluindo compras, vendas e pagamentos. Esse registro é feito no:', options: ['Livro Diário', 'Balanço Patrimonial', 'DRE', 'Estatuto Social'], correct: 0, explanation: 'O Livro Diário é o registro cronológico de todas as operações realizadas pela empresa.' },
  { id: 'c2', area: 'contabilidade', question: 'Ao final de um exercício, uma empresa deseja saber, em uma data específica, quanto possui de bens, direitos e obrigações. O demonstrativo contábil adequado para essa finalidade é o:', options: ['Balanço Patrimonial', 'Livro Caixa', 'Termo de Abertura', 'Regimento Interno'], correct: 0, explanation: 'O Balanço Patrimonial apresenta a posição financeira da empresa — ativos, passivos e patrimônio líquido — em uma data específica.' },
  { id: 'c3', area: 'contabilidade', question: 'Se uma empresa possui R$ 500.000 em Ativos e R$ 200.000 em Passivos (obrigações), qual é o valor do seu Patrimônio Líquido?', options: ['R$ 300.000', 'R$ 200.000', 'R$ 500.000', 'R$ 700.000'], correct: 0, explanation: 'Pela equação fundamental da contabilidade, Ativo = Passivo + Patrimônio Líquido. Logo, PL = 500.000 − 200.000 = R$ 300.000.' },

  { id: 'mf1', area: 'matematica_financeira', question: 'Um capital de R$ 2.000 é aplicado a juros simples de 3% ao mês. Qual será o montante total (capital + juros) após 5 meses?', options: ['R$ 2.150', 'R$ 2.300', 'R$ 2.500', 'R$ 3.000'], correct: 1, explanation: 'J = C×i×t = 2000×0,03×5 = R$ 300. Montante = 2000 + 300 = R$ 2.300.' },
  { id: 'mf2', area: 'matematica_financeira', question: 'Um capital de R$ 1.000 é aplicado a juros compostos de 10% ao mês. Qual será o montante após 2 meses?', options: ['R$ 1.100', 'R$ 1.200', 'R$ 1.210', 'R$ 1.220'], correct: 2, explanation: 'M = C×(1+i)ᵗ = 1000×(1,10)² = 1000×1,21 = R$ 1.210.' },
  { id: 'mf3', area: 'matematica_financeira', question: 'Uma mercadoria custa R$ 800 à vista. Em uma compra parcelada, o valor total pago foi de R$ 920. Qual foi a taxa de acréscimo total aplicada sobre o valor à vista?', options: ['10%', '12%', '15%', '20%'], correct: 2, explanation: 'O acréscimo foi de R$ 120 sobre R$ 800, o que corresponde a uma taxa de 120/800 = 15%.' },

  { id: 'ad1', area: 'atendimento', question: 'Um cliente reclama de forma alterada sobre um produto com defeito. A conduta mais adequada do atendente, nesse momento, é:', options: ['Ouvir com atenção, demonstrar empatia e buscar uma solução, mantendo a calma', 'Responder no mesmo tom alterado para se impor', 'Encerrar o atendimento imediatamente sem explicações', 'Ignorar a reclamação até que o cliente se acalme sozinho'], correct: 0, explanation: 'Mesmo diante de um cliente exaltado, o atendimento de qualidade exige escuta ativa, empatia e busca por solução, mantendo a postura profissional.' },
  { id: 'ad2', area: 'atendimento', question: 'A prática de repetir, com as próprias palavras, o que o cliente acabou de dizer, para confirmar o entendimento antes de responder, é uma técnica de:', options: ['Escuta ativa', 'Venda casada', 'Marketing agressivo', 'Terceirização de atendimento'], correct: 0, explanation: 'Parafrasear o que o cliente disse, confirmando a compreensão antes de responder, é uma técnica central da escuta ativa.' },

  { id: 'e1', area: 'especificos', question: 'Ao se deparar com um edital de concurso que detalha extensamente as atribuições de um cargo técnico, a estratégia mais eficaz para estudar os "conhecimentos específicos" é:', options: ['Estudar prioritariamente os temas do edital que têm maior incidência nas provas anteriores da banca', 'Ignorar completamente o edital e estudar de forma aleatória', 'Estudar apenas na última semana antes da prova', 'Focar exclusivamente em conteúdos de atualidades'], correct: 0, explanation: 'Priorizar os temas do edital com maior recorrência nas provas anteriores da banca organizadora é uma estratégia eficiente para otimizar o tempo de estudo.' },
  { id: 'e2', area: 'especificos', question: 'Dois candidatos estudam para o mesmo concurso, mas um deles resolve sistematicamente questões de provas anteriores da mesma banca organizadora, enquanto o outro apenas lê a teoria. Em geral, o primeiro tende a ter vantagem porque:', options: ['A prática com questões anteriores familiariza o candidato com o estilo e a recorrência de temas da banca', 'Resolver questões elimina a necessidade de estudar teoria', 'As bancas nunca repetem estilos ou temas de provas anteriores', 'A teoria é irrelevante para provas de concurso'], correct: 0, explanation: 'A prática com questões de provas anteriores ajuda o candidato a reconhecer o estilo, o nível de dificuldade e os temas mais recorrentes cobrados pela banca.' },

  { id: 'd1', area: 'didatica', question: 'Um professor que elabora atividades em que os próprios alunos investigam, testam hipóteses e constroem o conhecimento a partir da própria experiência, em vez de apenas memorizar conteúdos transmitidos, está aplicando princípios do:', options: ['Construtivismo', 'Ensino tecnicista tradicional', 'Behaviorismo skinneriano estrito', 'Ensino puramente memorístico'], correct: 0, explanation: 'O construtivismo valoriza a construção ativa do conhecimento pelo aluno, por meio da investigação e da experiência, em vez da simples transmissão e memorização de conteúdos.' },
  { id: 'd2', area: 'didatica', question: 'Um plano de aula bem estruturado deve conter, entre outros elementos, objetivos claros, conteúdos, metodologia e formas de avaliação, pois isso permite:', options: ['Organizar o processo de ensino-aprendizagem de forma coerente e avaliável', 'Substituir totalmente a necessidade de interação entre professor e aluno', 'Garantir que nenhum aluno terá dificuldades de aprendizagem', 'Eliminar a necessidade de qualquer avaliação futura'], correct: 0, explanation: 'Um plano de aula bem estruturado organiza o processo pedagógico de forma coerente, facilitando o acompanhamento e a avaliação da aprendizagem.' },
];

/* ------------------------------------------------------------------ */
/* Utilities                                                            */
/* ------------------------------------------------------------------ */

function hexToRgba(hex, alpha) {
  let h = (hex || '#78715e').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function contrastTextColor(hex) {
  let h = (hex || '#2f6690').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const bigint = parseInt(h, 16) || 0;
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1c1a14' : '#ffffff';
}

/**
 * Persistence works in two environments:
 * - Inside the Claude.ai artifact preview, window.storage is provided by the platform.
 * - As a standalone deployed site (e.g. after building this project and hosting it),
 *   window.storage does not exist, so we fall back to the browser's localStorage,
 *   which is the right, always-available choice outside of Claude's sandbox.
 */
async function storageGet(key) {
  if (typeof window !== 'undefined' && window.storage) {
    try {
      const res = await window.storage.get(key, false);
      return res && res.value ? res.value : null;
    } catch (e) {
      return null;
    }
  }
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

async function storageSet(key, value) {
  if (typeof window !== 'undefined' && window.storage) {
    try {
      await window.storage.set(key, value, false);
    } catch (e) {}
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {}
}

function tabColorFor(key) {
  return SUBJECT_COLORS[key] || '#78715e';
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function shortLabel(label) {
  return label.length > 14 ? label.slice(0, 13) + '…' : label;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
}

function computeStreak(studyDays) {
  if (!studyDays || !studyDays.length) return 0;
  const sorted = Array.from(new Set(studyDays)).sort();
  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    const diff = Math.round((new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const last = sorted[sorted.length - 1];
  if (last !== today && last !== yesterday) return 0;
  return streak;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function computeAreaScores(answers, areas) {
  const scores = {};
  areas.forEach((area) => {
    const qs = QUESTION_BANK.filter((q) => q.area === area);
    const correct = qs.filter((q) => answers[q.id] === q.correct).length;
    scores[area] = qs.length ? Math.round((correct / qs.length) * 100) : 50;
  });
  return scores;
}

function getPlanSubjects(state) {
  if (state.examType === 'concurso') {
    const opt = CONCURSO_OPTIONS.find((o) => o.key === state.examSubtype) || CONCURSO_OPTIONS[CONCURSO_OPTIONS.length - 1];
    return ['portugues', 'raciocinio', ...opt.extra];
  }
  return [...ENEM_SUBJECTS, 'redacao'];
}

function getQuizAreas(state) {
  return state.examType === 'concurso' ? ['portugues', 'raciocinio'] : ENEM_SUBJECTS;
}

function getExtraRatingSubjects(state) {
  const all = getPlanSubjects(state);
  const quizAreas = getQuizAreas(state);
  return all.filter((s) => quizAreas.indexOf(s) === -1);
}

function buildQuizQuestions(state) {
  const areas = getQuizAreas(state);
  const perArea = state.examType === 'concurso' ? { portugues: 3, raciocinio: 2 } : null;
  let out = [];
  areas.forEach((area) => {
    const pool = QUESTION_BANK.filter((q) => q.area === area);
    const n = perArea ? (perArea[area] || 2) : 2;
    out = out.concat(pool.slice(0, n));
  });
  return out;
}

function baseTasksFor(label) {
  return [
    `Revisar os principais tópicos de ${label}`,
    `Resolver de 10 a 15 questões de ${label}`,
    `Fazer um resumo ou mapa mental de ${label}`,
  ];
}

function extraTasksFor(key, label) {
  if (key.indexOf('dir_') === 0) {
    return [
      `Ler a "lei seca" relacionada a ${label}`,
      `Resolver questões de bancas anteriores sobre ${label}`,
      `Revisar jurisprudência e atualizações recentes de ${label}`,
    ];
  }
  if (key === 'redacao') {
    return [
      'Ler um texto argumentativo e identificar tese e argumentos',
      'Escrever uma redação dissertativa-argumentativa completa',
      'Revisar o texto usando as 5 competências do ENEM',
      'Estudar repertório sociocultural sobre um tema atual',
    ];
  }
  if (key === 'informatica') {
    return [
      'Praticar exercícios de pacote Office (Word, Excel)',
      'Revisar conceitos de segurança da informação e redes',
      'Resolver questões objetivas de informática de provas anteriores',
    ];
  }
  if (key === 'raciocinio') {
    return [
      'Praticar exercícios de lógica proposicional',
      'Resolver problemas de sequências e associações lógicas',
      'Cronometrar a resolução de 10 questões de raciocínio lógico',
    ];
  }
  if (key === 'atualidades') {
    return [
      'Ler notícias da semana em portais confiáveis',
      'Resumir os principais fatos políticos e econômicos recentes',
      'Resolver questões de atualidades de provas anteriores',
    ];
  }
  return baseTasksFor(label);
}

function formatTaskFor(label, formatPref) {
  if (formatPref === 'dissertativas') return `Praticar uma questão discursiva de ${label}, redigindo a resposta completa`;
  if (formatPref === 'objetivas') return `Fazer um simulado cronometrado de questões objetivas de ${label}`;
  if (formatPref === 'ambas') return `Praticar questões objetivas e uma questão discursiva de ${label}`;
  return null;
}

function taskCountForScore(score) {
  if (score < 40) return 5;
  if (score < 70) return 4;
  return 3;
}

function buildTasksForSubject(key, label, score, formatPref) {
  const pool = extraTasksFor(key, label).slice();
  const ft = formatTaskFor(label, formatPref);
  if (ft && pool.indexOf(ft) === -1) pool.push(ft);
  baseTasksFor(label).forEach((t) => { if (pool.indexOf(t) === -1) pool.push(t); });
  const count = taskCountForScore(score);
  return pool.slice(0, count).map((t, i) => ({ id: `${key}-${i}`, label: t, done: false }));
}

function buildPlan(state) {
  const subjects = getPlanSubjects(state);
  const withScores = subjects.map((key) => {
    const score = state.selfRatings[key] != null ? state.selfRatings[key] : (state.areaScores[key] != null ? state.areaScores[key] : 50);
    return { key, label: SUBJECT_LABELS[key] || key, score };
  });
  withScores.sort((a, b) => a.score - b.score);
  return withScores.map((s) => ({
    key: s.key,
    label: s.label,
    score: s.score,
    priority: s.score < 40 ? 'alta' : s.score < 70 ? 'media' : 'baixa',
    tasks: buildTasksForSubject(s.key, s.label, s.score, state.formatPref),
  }));
}

function computeProgress(plan) {
  const total = plan.reduce((sum, s) => sum + s.tasks.length, 0);
  const done = plan.reduce((sum, s) => sum + s.tasks.filter((t) => t.done).length, 0);
  return total ? Math.round((done / total) * 100) : 0;
}

function buildWeekPlan(plan) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const sorted = [...plan].sort((a, b) => a.score - b.score);
  const cycle = [];
  sorted.forEach((s, i) => { cycle.push(s); if (i < 2) cycle.push(s); });
  if (!cycle.length) return { days: [], restDay: 'Domingo' };
  const assignment = days.map((day, i) => ({ day, subject: cycle[i % cycle.length] }));
  return { days: assignment, restDay: 'Domingo' };
}

function examTypeLabel(state) {
  if (state.examType === 'enem') return 'ENEM';
  if (state.examType === 'vestibular') {
    const opt = VESTIBULAR_OPTIONS.find((o) => o.key === state.examSubtype);
    const name = opt && opt.key !== 'outro' ? opt.label : (state.examSubtypeOther || 'personalizado');
    return `Vestibular · ${name}`;
  }
  if (state.examType === 'concurso') {
    const opt = CONCURSO_OPTIONS.find((o) => o.key === state.examSubtype);
    const name = opt && opt.key !== 'outro' ? opt.label : (state.examSubtypeOther || 'personalizado');
    return `Concurso · ${name}`;
  }
  return '';
}

function examTypeShortLabel(state) {
  if (state.examType === 'enem') return 'ENEM';
  if (state.examType === 'vestibular') return 'Vestibular';
  if (state.examType === 'concurso') return 'Concurso';
  return 'Foco';
}

function examTip(state) {
  if (state.examType === 'vestibular') {
    const opt = VESTIBULAR_OPTIONS.find((o) => o.key === state.examSubtype);
    return opt ? opt.tip : null;
  }
  if (state.examType === 'concurso') {
    const opt = CONCURSO_OPTIONS.find((o) => o.key === state.examSubtype);
    return opt ? opt.tip : null;
  }
  return null;
}

function stepMeta(state) {
  let flow;
  if (state.examType === 'enem') {
    flow = ['welcome', 'date', 'diagnostic-choice', 'diagnostic', 'ready'];
  } else if (state.examType === 'concurso') {
    flow = ['welcome', 'subtype', 'location', 'format', 'date', 'diagnostic-choice', 'diagnostic', 'ready'];
  } else {
    flow = ['welcome', 'subtype', 'format', 'date', 'diagnostic-choice', 'diagnostic', 'ready'];
  }
  const normalized = (state.step === 'quiz' || state.step === 'rating') ? 'diagnostic' : state.step;
  const idx = flow.indexOf(normalized);
  return { current: idx === -1 ? 1 : idx + 1, total: flow.length };
}

function concursoLinks(uf) {
  const ufLower = (uf || '').toLowerCase();
  return [
    { label: uf ? `Concursos abertos em ${uf}` : 'Concursos abertos no Brasil', url: ufLower ? `https://www.pciconcursos.com.br/concursos/${ufLower}/` : 'https://www.pciconcursos.com.br/concursos/' },
    { label: 'Concursos previstos e autorizados', url: 'https://www.pciconcursos.com.br/previstos/' },
    { label: uf ? `Mais vagas abertas em ${uf}` : 'Mais vagas abertas no Brasil', url: ufLower ? `https://jcconcursos.com.br/concursos/inscricoes-abertas/${ufLower}` : 'https://jcconcursos.com.br/concursos/inscricoes-abertas' },
  ];
}

function officialExamLink(state) {
  if (state.examType === 'enem') {
    return { label: 'Provas e gabaritos oficiais do ENEM (INEP)', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos' };
  }
  if (state.examType === 'vestibular') {
    const opt = VESTIBULAR_OPTIONS.find((o) => o.key === state.examSubtype);
    const name = opt && opt.key !== 'outro' ? opt.label : 'vestibular';
    return { label: `Buscar provas anteriores de ${name}`, url: `https://www.google.com/search?q=${encodeURIComponent('provas anteriores ' + name + ' gabarito oficial')}` };
  }
  if (state.examType === 'concurso') {
    const opt = CONCURSO_OPTIONS.find((o) => o.key === state.examSubtype);
    const name = opt && opt.key !== 'outro' ? opt.label : 'concurso público';
    return { label: `Buscar provas anteriores de ${name}`, url: `https://www.google.com/search?q=${encodeURIComponent('provas anteriores concurso ' + name + ' gabarito')}` };
  }
  return null;
}

function subjectAccuracy(state, key) {
  const answers = state.practiceAnswers.filter((a) => a.subject === key);
  if (!answers.length) {
    const planItem = state.plan.find((s) => s.key === key);
    return planItem ? planItem.score : 50;
  }
  const correct = answers.filter((a) => a.correct).length;
  return Math.round((correct / answers.length) * 100);
}

function overallAccuracy(state) {
  const total = state.practiceAnswers.length;
  if (!total) return null;
  const correct = state.practiceAnswers.filter((a) => a.correct).length;
  return { correct, total, pct: Math.round((correct / total) * 100) };
}

function levelFromPoints(points) {
  return Math.floor(points / 300) + 1;
}

function buildExportPayload(state) {
  const { currentProva, essayDraft, ...rest } = state;
  return { app: 'Foco', version: 2, exportedAt: new Date().toISOString(), data: rest };
}

function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parseImportPayload(jsonText) {
  const parsed = JSON.parse(jsonText);
  const data = parsed && parsed.data && typeof parsed.data === 'object' ? parsed.data : parsed;
  if (!data || !Array.isArray(data.plan)) {
    throw new Error('Esse arquivo não parece ser um progresso válido do Foco.');
  }
  return { data, exportedAt: parsed && parsed.exportedAt ? parsed.exportedAt : null };
}

function freshProfileFields() {
  return {
    examType: null,
    examSubtype: null,
    examSubtypeOther: '',
    formatPref: null,
    examUF: '',
    examDate: '',
    diagnosticPath: null,
    quizAnswers: {},
    selfRatings: {},
    areaScores: {},
    plan: [],
    practiceAnswers: [],
    essays: [],
    hasPerfectProva: false,
    onboardingComplete: false,
    step: 'welcome',
  };
}

function extractProfileFields(state) {
  return {
    examType: state.examType,
    examSubtype: state.examSubtype,
    examSubtypeOther: state.examSubtypeOther,
    formatPref: state.formatPref,
    examUF: state.examUF,
    examDate: state.examDate,
    diagnosticPath: state.diagnosticPath,
    quizAnswers: state.quizAnswers,
    selfRatings: state.selfRatings,
    areaScores: state.areaScores,
    plan: state.plan,
    practiceAnswers: state.practiceAnswers,
    essays: state.essays,
    hasPerfectProva: state.hasPerfectProva,
    onboardingComplete: state.onboardingComplete,
    step: state.step,
  };
}

function initialState() {
  return {
    theme: 'light',
    accent: '#2f6690',
    activeTab: 'inicio',
    points: 0,
    studyDays: [],
    profiles: { enem: null, vestibular: null, concurso: null },
    currentProva: null,
    essayDraft: null,
    quizIndex: 0,
    ...freshProfileFields(),
  };
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                                */
/* ------------------------------------------------------------------ */

function ProgressBar({ value, height }) {
  const h = height || 10;
  return (
    <div className="progress-track w-full" style={{ height: h }}>
      <div className="progress-fill h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm animate-pulse" style={{ color: 'var(--text-soft)' }}>Carregando seu progresso…</div>
    </div>
  );
}

function StepShell({ title, subtitle, children, onBack, progress }) {
  return (
    <div className="step-enter max-w-xl mx-auto px-5 py-8 sm:py-14 w-full">
      <div className="mb-5" style={{ minHeight: 24 }}>
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-soft)' }}>
            <ChevronLeft size={16} /> Voltar
          </button>
        )}
      </div>
      {progress != null && <div className="mb-6"><ProgressBar value={progress} height={6} /></div>}
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="mb-8 text-sm sm:text-base" style={{ color: 'var(--text-soft)' }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    alta: { label: 'Prioridade alta', color: PERF.weak },
    media: { label: 'Prioridade média', color: PERF.medium },
    baixa: { label: 'Em dia', color: PERF.strong },
  };
  const m = map[priority] || map.media;
  return (
    <span className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: hexToRgba(m.color, 0.14), color: m.color }}>
      {m.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Onboarding steps                                                     */
/* ------------------------------------------------------------------ */

function WelcomeStep({ accent, onSelect, onImport }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const options = [
    { key: 'enem', label: 'ENEM', desc: 'Exame Nacional do Ensino Médio', icon: GraduationCap },
    { key: 'vestibular', label: 'Vestibular', desc: 'Ingresso direto em uma universidade', icon: BookOpen },
    { key: 'concurso', label: 'Concurso', desc: 'Preparação para concursos públicos', icon: Building2 },
  ];
  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { data } = parseImportPayload(String(reader.result));
        setError(null);
        onImport(data);
      } catch (err) {
        setError(err.message || 'Não foi possível ler esse arquivo.');
      }
    };
    reader.onerror = () => setError('Não foi possível ler esse arquivo.');
    reader.readAsText(file);
    e.target.value = '';
  }
  return (
    <div className="step-enter max-w-2xl mx-auto px-5 py-10 sm:py-20 w-full text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: hexToRgba(accent, 0.12), color: accent }}>
        <Sparkles size={14} /> Foco — plano de estudos personalizado
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">Para qual prova você vai estudar?</h1>
      <p className="mb-10 text-sm sm:text-base" style={{ color: 'var(--text-soft)' }}>Escolha uma opção para a gente montar o seu plano.</p>
      <div className="grid sm:grid-cols-3 gap-4 text-left">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <button key={opt.key} onClick={() => onSelect(opt.key)} className="surface p-5 flex flex-col items-start gap-3 hover:-translate-y-0.5 transition-transform">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: hexToRgba(accent, 0.12) }}>
                <Icon size={22} color={accent} />
              </div>
              <div>
                <div className="font-display font-bold text-lg">{opt.label}</div>
                <div className="text-sm" style={{ color: 'var(--text-soft)' }}>{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
      <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="mt-8 text-sm underline" style={{ color: 'var(--text-soft)' }}>
        Já tem um backup? Importar progresso (.json)
      </button>
      <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFile} className="hidden" />
      {error && <div className="text-xs mt-2" style={{ color: PERF.weak }}>{error}</div>}
    </div>
  );
}

function SubtypeStep({ examType, progress, onSelect, onBack }) {
  const options = examType === 'vestibular' ? VESTIBULAR_OPTIONS : CONCURSO_OPTIONS;
  const [showOther, setShowOther] = useState(false);
  const [otherText, setOtherText] = useState('');
  return (
    <StepShell title={examType === 'vestibular' ? 'Qual vestibular?' : 'Qual concurso ou área?'} subtitle="Assim eu consigo personalizar melhor o seu plano." onBack={onBack} progress={progress}>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          opt.key === 'outro' ? (
            <div key={opt.key} className="surface p-4">
              {!showOther ? (
                <button onClick={() => setShowOther(true)} className="text-left w-full">
                  <div className="font-medium">{opt.label}</div>
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Digite o nome (opcional)"
                    className="flex-1 px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--bg-soft)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                  />
                  <button onClick={() => onSelect('outro', otherText)} className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">OK</button>
                </div>
              )}
            </div>
          ) : (
            <button key={opt.key} onClick={() => onSelect(opt.key, '')} className="chip text-left px-4 py-3 rounded-xl text-sm">
              <div className="font-medium">{opt.label}</div>
              {opt.tip && <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>{opt.tip}</div>}
            </button>
          )
        ))}
      </div>
    </StepShell>
  );
}

function LocationStep({ value, progress, onContinue, onBack }) {
  const [uf, setUf] = useState(value || '');
  return (
    <StepShell title="Em qual estado você está?" subtitle="Assim conseguimos mostrar concursos abertos e previstos na sua região. É opcional." onBack={onBack} progress={progress}>
      <select
        value={uf}
        onChange={(e) => setUf(e.target.value)}
        className="w-full px-4 py-3 rounded-xl mb-6 text-sm"
        style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
      >
        <option value="">Selecione um estado...</option>
        {BRAZIL_STATES.map((s) => (<option key={s.uf} value={s.uf}>{s.name} ({s.uf})</option>))}
      </select>
      <div className="flex gap-3">
        <button onClick={() => onContinue('')} className="flex-1 py-3 rounded-xl text-sm font-semibold chip">Pular</button>
        <button onClick={() => onContinue(uf)} disabled={!uf} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-40">Continuar</button>
      </div>
    </StepShell>
  );
}

function FormatStep({ progress, onSelect, onBack }) {
  const options = [
    { key: 'objetivas', label: 'Objetivas', desc: 'Foco em questões de múltipla escolha' },
    { key: 'dissertativas', label: 'Dissertativas', desc: 'Foco em questões abertas e discursivas' },
    { key: 'ambas', label: 'Ambas', desc: 'Quero treinar os dois formatos' },
  ];
  return (
    <StepShell title="Você prefere treinar questões objetivas ou dissertativas?" onBack={onBack} progress={progress}>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button key={opt.key} onClick={() => onSelect(opt.key)} className="chip text-left px-4 py-3 rounded-xl text-sm">
            <div className="font-medium">{opt.label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>{opt.desc}</div>
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function DateStep({ value, progress, onContinue, onBack }) {
  const [date, setDate] = useState(value || '');
  return (
    <StepShell title="Quando é a sua prova?" subtitle="Isso é opcional — ajuda a mostrar a contagem regressiva no seu painel." onBack={onBack} progress={progress}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-4 py-3 rounded-xl mb-6 text-sm"
        style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
      />
      <div className="flex gap-3">
        <button onClick={() => onContinue('')} className="flex-1 py-3 rounded-xl text-sm font-semibold chip">Pular</button>
        <button onClick={() => onContinue(date)} disabled={!date} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-40">Continuar</button>
      </div>
    </StepShell>
  );
}

function DiagnosticChoiceStep({ progress, onChoose, onBack }) {
  return (
    <StepShell title="Onde está sua maior dificuldade?" subtitle="Se você não souber, sem problema — a gente te ajuda a descobrir." onBack={onBack} progress={progress}>
      <div className="flex flex-col gap-3">
        <button onClick={() => onChoose('know')} className="surface p-5 text-left hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-bold mb-1">Já sei minhas dificuldades</div>
          <div className="text-sm" style={{ color: 'var(--text-soft)' }}>Vou te mostrar as matérias e você me diz o nível em cada uma.</div>
        </button>
        <button onClick={() => onChoose('quiz')} className="surface p-5 text-left hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-bold mb-1">Não sei, quero descobrir</div>
          <div className="text-sm" style={{ color: 'var(--text-soft)' }}>Faça um diagnóstico rápido e a gente identifica seus pontos fracos.</div>
        </button>
      </div>
    </StepShell>
  );
}

function QuizStep({ questions, quizIndex, quizAnswers, accent, onAnswer, onNext, onPrev, onFinish }) {
  const q = questions[quizIndex];
  const selected = quizAnswers[q.id];
  const isRevealed = selected != null;
  const isLast = quizIndex === questions.length - 1;
  const isCorrect = selected === q.correct;
  const progress = ((quizIndex + 1) / questions.length) * 100;
  return (
    <StepShell title="Diagnóstico rápido" subtitle="Responda com calma — é assim que a gente descobre onde focar." progress={progress}>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
        Questão {quizIndex + 1} de {questions.length} · {SUBJECT_LABELS[q.area]}
      </div>
      <div className="surface p-5 mb-5">
        <p className="font-medium mb-4">{q.question}</p>
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            let style = {};
            if (isRevealed) {
              if (i === q.correct) style = { borderColor: PERF.strong, background: hexToRgba(PERF.strong, 0.12) };
              else if (i === selected) style = { borderColor: PERF.weak, background: hexToRgba(PERF.weak, 0.12) };
            }
            return (
              <button key={i} onClick={() => !isRevealed && onAnswer(q.id, i)} disabled={isRevealed} className="chip text-left px-4 py-3 rounded-xl text-sm" style={style}>
                {opt}
              </button>
            );
          })}
        </div>
        {isRevealed && (
          <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: hexToRgba(isCorrect ? PERF.strong : PERF.weak, 0.1) }}>
            <div className="font-semibold mb-1" style={{ color: isCorrect ? PERF.strong : PERF.weak }}>{isCorrect ? 'Certinho!' : 'Não foi dessa vez'}</div>
            <div style={{ color: 'var(--text-soft)' }}>{q.explanation}</div>
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button onClick={onPrev} className="px-4 py-2 rounded-xl text-sm" style={{ color: 'var(--text-soft)' }}>
          {quizIndex === 0 ? 'Voltar' : 'Anterior'}
        </button>
        <button disabled={!isRevealed} onClick={isLast ? onFinish : onNext} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40">
          {isLast ? 'Finalizar diagnóstico' : 'Próxima'}
        </button>
      </div>
    </StepShell>
  );
}

function RatingStep({ subjects, ratings, accent, progress, title, subtitle, onRate, onFinish, onBack }) {
  const allRated = subjects.length > 0 && subjects.every((s) => ratings[s] != null);
  const LEVELS = [
    { label: 'Não sei quase nada', value: 10 },
    { label: 'Tenho dificuldade', value: 35 },
    { label: 'Mais ou menos', value: 60 },
    { label: 'Domino bem', value: 85 },
  ];
  return (
    <StepShell title={title} subtitle={subtitle} onBack={onBack} progress={progress}>
      <div className="flex flex-col gap-4 mb-8">
        {subjects.map((key) => {
          const Icon = SUBJECT_ICONS[key] || BookOpen;
          return (
            <div key={key} className="surface p-4">
              <div className="flex items-center gap-2 mb-3 font-medium">
                <span style={{ width: 8, height: 8, borderRadius: 999, background: tabColorFor(key), display: 'inline-block', flexShrink: 0 }} />
                <Icon size={18} color={accent} />
                <span>{SUBJECT_LABELS[key] || key}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => onRate(key, l.value)}
                    className="chip px-2 py-2 rounded-lg text-xs font-medium"
                    style={ratings[key] === l.value ? { borderColor: accent, background: hexToRgba(accent, 0.1), color: accent } : {}}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <button disabled={!allRated} onClick={onFinish} className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40">
        Ver meu plano de estudos
      </button>
    </StepShell>
  );
}

function ReadyStep({ plan, accent, onEnter }) {
  const weak = plan.filter((s) => s.priority === 'alta');
  const highlight = weak.length ? weak : plan.slice(0, 3);
  return (
    <StepShell title="Seu plano está pronto! 🎉" subtitle="Priorizamos o que mais precisa da sua atenção agora — dá pra ajustar depois." progress={100}>
      <div className="surface p-5 mb-6">
        <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-soft)' }}>Prioridades iniciais</div>
        <div className="flex flex-col gap-2">
          {highlight.map((s) => {
            const Icon = SUBJECT_ICONS[s.key] || BookOpen;
            return (
              <div key={s.key} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'var(--bg-soft)', borderLeft: `3px solid ${tabColorFor(s.key)}` }}>
                <Icon size={16} color={accent} />
                <span className="text-sm font-medium">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={onEnter} className="btn-primary w-full py-3 rounded-xl text-sm font-semibold">Começar meus estudos</button>
    </StepShell>
  );
}

function OnboardingThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center chip z-50"
      style={{ background: 'var(--card)' }}
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function Onboarding({ state, handlers }) {
  const accent = state.accent;
  const meta = stepMeta(state);
  const progress = (meta.current / meta.total) * 100;
  const toggleTheme = () => handlers.setTheme(state.theme === 'dark' ? 'light' : 'dark');
  let stepContent;

  if (state.step === 'welcome') {
    stepContent = <WelcomeStep accent={accent} onSelect={handlers.selectExamType} onImport={handlers.importProgress} />;
  } else if (state.step === 'subtype') {
    stepContent = <SubtypeStep examType={state.examType} progress={progress} onSelect={handlers.selectSubtype} onBack={() => handlers.goTo('welcome')} />;
  } else if (state.step === 'location') {
    stepContent = <LocationStep value={state.examUF} progress={progress} onContinue={handlers.selectLocation} onBack={() => handlers.goTo('subtype')} />;
  } else if (state.step === 'format') {
    stepContent = <FormatStep progress={progress} onSelect={handlers.selectFormat} onBack={() => handlers.goTo(state.examType === 'concurso' ? 'location' : 'subtype')} />;
  } else if (state.step === 'date') {
    stepContent = <DateStep value={state.examDate} progress={progress} onContinue={handlers.dateContinue} onBack={() => handlers.goTo(state.examType === 'enem' ? 'welcome' : 'format')} />;
  } else if (state.step === 'diagnostic-choice') {
    stepContent = <DiagnosticChoiceStep progress={progress} onChoose={handlers.diagnosticChoice} onBack={() => handlers.goTo('date')} />;
  } else if (state.step === 'quiz') {
    const questions = buildQuizQuestions(state);
    stepContent = (
      <QuizStep
        questions={questions}
        quizIndex={state.quizIndex}
        quizAnswers={state.quizAnswers}
        accent={accent}
        onAnswer={handlers.quizAnswer}
        onNext={() => handlers.quizNav(1)}
        onPrev={() => (state.quizIndex === 0 ? handlers.goTo('diagnostic-choice') : handlers.quizNav(-1))}
        onFinish={() => handlers.quizFinish(getQuizAreas(state))}
      />
    );
  } else if (state.step === 'rating') {
    const subjects = state.diagnosticPath === 'know' ? getPlanSubjects(state) : getExtraRatingSubjects(state);
    stepContent = (
      <RatingStep
        subjects={subjects}
        ratings={state.selfRatings}
        accent={accent}
        progress={progress}
        title={state.diagnosticPath === 'know' ? 'Avalie seu nível em cada matéria' : 'Só mais algumas matérias'}
        subtitle={state.diagnosticPath === 'know' ? 'Isso ajuda a priorizar o que você mais precisa estudar.' : 'Essas a gente não dá pra testar com múltipla escolha — conta pra gente como você está.'}
        onRate={handlers.rate}
        onFinish={handlers.ratingFinish}
        onBack={() => handlers.goTo(state.diagnosticPath === 'know' ? 'diagnostic-choice' : 'quiz')}
      />
    );
  } else if (state.step === 'ready') {
    stepContent = <ReadyStep plan={state.plan} accent={accent} onEnter={handlers.enterDashboard} />;
  } else {
    stepContent = <WelcomeStep accent={accent} onSelect={handlers.selectExamType} onImport={handlers.importProgress} />;
  }

  return (
    <>
      <OnboardingThemeToggle theme={state.theme} onToggle={toggleTheme} />
      {stepContent}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Top navigation                                                       */
/* ------------------------------------------------------------------ */

function ModalitySwitcher({ state, onSwitch }) {
  const [open, setOpen] = useState(false);
  const options = [
    { key: 'enem', label: 'ENEM', icon: GraduationCap },
    { key: 'vestibular', label: 'Vestibular', icon: BookOpen },
    { key: 'concurso', label: 'Concurso', icon: Building2 },
  ];
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-semibold chip">
        <span>{examTypeShortLabel(state)}</span>
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-50" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-soft)', borderBottom: '1px solid var(--border)' }}>Suas modalidades</div>
            {options.map((opt) => {
              const Icon = opt.icon;
              const profile = state.profiles ? state.profiles[opt.key] : null;
              const isActive = state.examType === opt.key;
              const pct = isActive ? computeProgress(state.plan) : (profile ? computeProgress(profile.plan) : null);
              return (
                <button
                  key={opt.key}
                  onClick={() => { setOpen(false); onSwitch(opt.key); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  style={isActive ? { background: hexToRgba(state.accent, 0.1) } : {}}
                >
                  <Icon size={16} color={isActive ? state.accent : 'var(--text-soft)'} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs" style={{ color: 'var(--text-soft)' }}>
                      {isActive ? 'Modalidade atual' : (pct != null ? `${pct}% concluído` : 'Não iniciado')}
                    </div>
                  </div>
                  {isActive && <CheckCircle2 size={16} color={state.accent} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function TopNav({ state, activeTab, onChangeTab, onToggleTheme, onSwitchModality }) {
  const tabs = [
    { key: 'inicio', label: 'Início', icon: Home },
    { key: 'questoes', label: 'Questões', icon: FileQuestion },
    { key: 'progresso', label: 'Progresso', icon: TrendingUp },
    { key: 'config', label: 'Config', icon: Settings },
  ];
  return (
    <div className="sticky top-0 z-40" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-3xl mx-auto px-3 sm:px-6 flex items-center justify-between" style={{ height: 56 }}>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: hexToRgba(state.accent, 0.14) }}>
            <GraduationCap size={15} color={state.accent} />
          </div>
          <ModalitySwitcher state={state} onSwitch={onSwitchModality} />
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChangeTab(t.key)}
                aria-label={t.label}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium"
                style={active ? { background: hexToRgba(state.accent, 0.12), color: state.accent } : { color: 'var(--text-soft)' }}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
        <button onClick={onToggleTheme} className="w-8 h-8 rounded-lg flex items-center justify-center chip shrink-0 ml-1" aria-label="Alternar tema">
          {state.theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Início tab                                                           */
/* ------------------------------------------------------------------ */

function ConcursoLinksCard({ uf, accent }) {
  const links = concursoLinks(uf);
  return (
    <div className="surface p-4 sm:p-5 mb-6">
      <div className="font-display font-bold mb-1 flex items-center gap-2">
        <MapPin size={18} color={accent} /> Concursos abertos e previstos
      </div>
      <div className="text-xs mb-4" style={{ color: 'var(--text-soft)' }}>
        {uf ? `Filtrado para ${uf}. ` : 'Defina seu estado em Config para filtrar. '}Essas listas são mantidas por sites especializados e mudam todo dia — os links abrem em uma nova aba.
      </div>
      <div className="flex flex-col gap-2">
        {links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="chip flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium">
            {l.label}
            <ExternalLink size={14} style={{ color: 'var(--text-soft)' }} />
          </a>
        ))}
      </div>
    </div>
  );
}

function InicioTab({ state, onToggleTask, onGoToQuestoes }) {
  const [expanded, setExpanded] = useState(() => new Set(state.plan.slice(0, 2).map((s) => s.key)));
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  function toggleExpanded(key) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const progress = computeProgress(state.plan);
  const days = daysUntil(state.examDate);
  const daysLabel = days == null ? '—' : days < 0 ? 'Realizada' : `${days} ${days === 1 ? 'dia' : 'dias'}`;
  const week = buildWeekPlan(state.plan);
  const tip2 = examTip(state);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
      <h2 className="font-display text-2xl font-bold mb-1">Seu plano de estudos</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--text-soft)' }}>{examTypeLabel(state)} · faltam {daysLabel}</p>

      {tip2 && <div className="text-xs mb-5 px-3 py-2 rounded-xl" style={{ background: hexToRgba(state.accent, 0.08), color: state.accent }}>{tip2}</div>}

      <div className="mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Progresso do plano</span>
          <span style={{ color: 'var(--text-soft)' }}>{progress}%</span>
        </div>
        <ProgressBar value={progress} height={12} />
      </div>

      <button onClick={onGoToQuestoes} className="btn-primary w-full py-3 rounded-xl text-sm font-semibold mb-6 flex items-center justify-center gap-2">
        <FileQuestion size={16} /> Praticar questões agora
      </button>

      {state.examType === 'concurso' && <ConcursoLinksCard uf={state.examUF} accent={state.accent} />}

      <div className="mb-6">
        <div className="font-display font-bold mb-3 flex items-center gap-2">
          <ListChecks size={18} color={state.accent} /> Seu plano, do mais urgente ao mais tranquilo
        </div>
        <div className="flex flex-col gap-3">
          {state.plan.map((subject) => {
            const Icon = SUBJECT_ICONS[subject.key] || BookOpen;
            const isOpen = expanded.has(subject.key);
            const done = subject.tasks.filter((t) => t.done).length;
            return (
              <div key={subject.key} className="surface overflow-hidden" style={{ borderLeft: `4px solid ${tabColorFor(subject.key)}` }}>
                <button onClick={() => toggleExpanded(subject.key)} className="w-full flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Icon size={18} color={state.accent} />
                    <div className="text-left">
                      <div className="font-medium text-sm sm:text-base">{subject.label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-soft)' }}>{done}/{subject.tasks.length} concluídas</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={subject.priority} />
                    <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 flex flex-col gap-2">
                    {subject.tasks.map((task) => (
                      <button key={task.id} onClick={() => onToggleTask(subject.key, task.id)} className="flex items-start gap-2 text-left px-3 py-2 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                        {task.done
                          ? <CheckCircle2 size={18} color={state.accent} className="shrink-0 mt-0.5" />
                          : <Circle size={18} style={{ color: 'var(--text-soft)' }} className="shrink-0 mt-0.5" />}
                        <span className="text-sm" style={task.done ? { textDecoration: 'line-through', color: 'var(--text-soft)' } : {}}>{task.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="surface p-4 sm:p-5 mb-6">
        <div className="font-display font-bold mb-4 flex items-center gap-2">
          <Calendar size={18} color={state.accent} /> Sugestão para a semana
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {week.days.map((d, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
              <span className="text-sm font-medium">{d.day}</span>
              <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-soft)' }}>
                {d.subject && <span style={{ width: 7, height: 7, borderRadius: 999, background: tabColorFor(d.subject.key), display: 'inline-block' }} />}
                {d.subject ? d.subject.label : '-'}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl sm:col-span-2" style={{ background: hexToRgba(state.accent, 0.08) }}>
            <span className="text-sm font-medium">{week.restDay}</span>
            <span className="text-xs" style={{ color: 'var(--text-soft)' }}>Revisão geral + descanso</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs mb-4" style={{ color: 'var(--text-soft)' }}>{tip}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Questões tab (prova engine + redação)                                */
/* ------------------------------------------------------------------ */

function SubjectPicker({ state, accent, onPick, onEssay }) {
  const officialLink = officialExamLink(state);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
      <h2 className="font-display text-xl sm:text-2xl font-bold mb-1">Praticar questões</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-soft)' }}>Escolha uma matéria para começar uma prova rápida. Cada prova tem até 5 questões, com explicação depois de cada resposta.</p>
      {officialLink && (
        <a href={officialLink.url} target="_blank" rel="noopener noreferrer" className="chip flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium mb-5">
          <span className="flex items-center gap-2"><Download size={15} color={accent} /> {officialLink.label}</span>
          <ExternalLink size={14} style={{ color: 'var(--text-soft)' }} />
        </a>
      )}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {state.plan.map((subject) => {
          const Icon = SUBJECT_ICONS[subject.key] || BookOpen;
          const acc = subjectAccuracy(state, subject.key);
          const count = QUESTION_BANK.filter((q) => q.area === subject.key).length;
          return (
            <button
              key={subject.key}
              onClick={() => onPick(subject.key)}
              disabled={count === 0}
              className="surface p-4 flex items-center justify-between text-left disabled:opacity-40"
              style={{ borderLeft: `4px solid ${tabColorFor(subject.key)}` }}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} color={accent} />
                <div>
                  <div className="font-medium text-sm">{subject.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-soft)' }}>{count} questões disponíveis</div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: hexToRgba(acc < 60 ? PERF.weak : PERF.strong, 0.14), color: acc < 60 ? PERF.weak : PERF.strong }}>{acc}%</span>
            </button>
          );
        })}
      </div>
      {state.plan.some((s) => s.key === 'redacao') && (
        <button onClick={onEssay} className="surface w-full p-4 flex items-center justify-between text-left" style={{ borderLeft: `4px solid ${tabColorFor('redacao')}` }}>
          <div className="flex items-center gap-3">
            <PenLine size={18} color={accent} />
            <div>
              <div className="font-medium text-sm">Praticar Redação</div>
              <div className="text-xs" style={{ color: 'var(--text-soft)' }}>{state.essays.length} redações enviadas</div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

function ProvaAnswering({ prova, accent, onAnswer, onNext, onFinish, onExit }) {
  const q = prova.questions[prova.index];
  const selected = prova.answers[q.id];
  const isRevealed = !!prova.revealed[q.id];
  const isLast = prova.index === prova.questions.length - 1;
  const isCorrect = selected === q.correct;
  const progress = ((prova.index + 1) / prova.questions.length) * 100;
  return (
    <div className="max-w-xl mx-auto px-5 py-8 sm:py-12 w-full step-enter">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onExit} className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-soft)' }}><ChevronLeft size={16} /> Sair</button>
        <span className="text-xs font-semibold" style={{ color: 'var(--text-soft)' }}>{prova.index + 1} / {prova.questions.length}</span>
      </div>
      <div className="mb-6"><ProgressBar value={progress} height={6} /></div>
      <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: accent }}>{SUBJECT_LABELS[prova.subject]}</div>
      <div className="surface p-5 mb-5">
        <p className="font-medium mb-4">{q.question}</p>
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            let style = {};
            if (isRevealed) {
              if (i === q.correct) style = { borderColor: PERF.strong, background: hexToRgba(PERF.strong, 0.12) };
              else if (i === selected) style = { borderColor: PERF.weak, background: hexToRgba(PERF.weak, 0.12) };
            } else if (selected === i) {
              style = { borderColor: accent, background: hexToRgba(accent, 0.1) };
            }
            return (
              <button key={i} onClick={() => !isRevealed && onAnswer(q.id, i)} disabled={isRevealed} className="chip text-left px-4 py-3 rounded-xl text-sm" style={style}>
                {opt}
              </button>
            );
          })}
        </div>
        {isRevealed && (
          <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: hexToRgba(isCorrect ? PERF.strong : PERF.weak, 0.1) }}>
            <div className="font-semibold mb-1" style={{ color: isCorrect ? PERF.strong : PERF.weak }}>{isCorrect ? 'Certinho!' : 'Não foi dessa vez'}</div>
            <div style={{ color: 'var(--text-soft)' }}>{q.explanation}</div>
          </div>
        )}
      </div>
      {isRevealed && (
        <button onClick={isLast ? onFinish : onNext} className="btn-primary w-full py-3 rounded-xl text-sm font-semibold">
          {isLast ? 'Ver relatório' : 'Próxima questão'}
        </button>
      )}
    </div>
  );
}

function ProvaReport({ prova, accent, onExit, onRetry }) {
  const total = prova.questions.length;
  const correct = prova.questions.filter((q) => prova.answers[q.id] === q.correct).length;
  const pct = Math.round((correct / total) * 100);
  const msg = pct === 100 ? 'Mandou muito bem — gabaritou!' : pct >= 70 ? 'Muito bom! Só faltam alguns detalhes.' : pct >= 40 ? 'Bom começo — vale revisar essa matéria.' : 'Essa matéria precisa de mais atenção. Vamos com calma.';
  return (
    <div className="max-w-xl mx-auto px-5 py-8 sm:py-12 w-full step-enter">
      <h2 className="font-display text-2xl font-bold mb-1">Relatório da prova</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-soft)' }}>{SUBJECT_LABELS[prova.subject]}</p>
      <div className="surface p-6 mb-5 text-center">
        <div className="font-display font-extrabold text-4xl mb-1" style={{ color: pct < 60 ? PERF.weak : PERF.strong }}>{correct}/{total}</div>
        <div className="text-sm mb-3" style={{ color: 'var(--text-soft)' }}>{pct}% de acerto</div>
        <div className="text-sm font-medium mb-4">{msg}</div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: hexToRgba(accent, 0.12), color: accent }}>
          <Star size={13} /> +{prova.pointsEarned} pontos
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        {prova.questions.map((q, i) => {
          const ok = prova.answers[q.id] === q.correct;
          return (
            <div key={q.id} className="flex items-start gap-2 px-3 py-2 rounded-xl text-sm" style={{ background: 'var(--bg-soft)' }}>
              {ok ? <CheckCircle2 size={16} color={PERF.strong} className="shrink-0 mt-0.5" /> : <X size={16} color={PERF.weak} className="shrink-0 mt-0.5" />}
              <span>{i + 1}. {q.question}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button onClick={onExit} className="flex-1 chip py-3 rounded-xl text-sm font-semibold">Voltar</button>
        <button onClick={onRetry} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold">Praticar de novo</button>
      </div>
    </div>
  );
}

function RedacaoView({ draft, accent, essaysCount, onPickPrompt, onChangeText, onSubmit, onClose }) {
  if (draft.submitted) {
    return (
      <div className="max-w-xl mx-auto px-5 py-8 sm:py-12 w-full step-enter">
        <h2 className="font-display text-2xl font-bold mb-2">Redação enviada! 🎉</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-soft)' }}>{draft.wordCount} palavras · +40 pontos</p>
        <div className="surface p-5 mb-6">
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-soft)' }}>Releia seu texto e reflita sobre as 5 competências do ENEM:</div>
          <div className="flex flex-col gap-2">
            {COMPETENCIAS_ENEM.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm px-3 py-2 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                <span className="font-display font-bold" style={{ color: accent }}>{i + 1}.</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="btn-primary w-full py-3 rounded-xl text-sm font-semibold">Concluir</button>
      </div>
    );
  }
  if (draft.promptIndex == null) {
    return (
      <div className="max-w-xl mx-auto px-5 py-8 sm:py-12 w-full step-enter">
        <button onClick={onClose} className="flex items-center gap-1 text-sm mb-5" style={{ color: 'var(--text-soft)' }}><ChevronLeft size={16} /> Voltar</button>
        <h2 className="font-display text-2xl font-bold mb-2">Escolha um tema</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-soft)' }}>{essaysCount} redações enviadas até agora.</p>
        <div className="flex flex-col gap-2">
          {ESSAY_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => onPickPrompt(i)} className="chip text-left px-4 py-3 rounded-xl text-sm font-medium">{p}</button>
          ))}
        </div>
      </div>
    );
  }
  const words = draft.text.trim() ? draft.text.trim().split(/\s+/).filter(Boolean).length : 0;
  return (
    <div className="max-w-xl mx-auto px-5 py-8 sm:py-12 w-full step-enter">
      <button onClick={onClose} className="flex items-center gap-1 text-sm mb-5" style={{ color: 'var(--text-soft)' }}><ChevronLeft size={16} /> Voltar</button>
      <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: accent }}>Tema</div>
      <h2 className="font-display text-xl font-bold mb-5">{ESSAY_PROMPTS[draft.promptIndex]}</h2>
      <textarea
        value={draft.text}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder="Escreva sua redação dissertativa-argumentativa aqui..."
        rows={12}
        className="w-full px-4 py-3 rounded-xl text-sm mb-2"
        style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)', resize: 'vertical' }}
      />
      <div className="text-xs mb-5" style={{ color: 'var(--text-soft)' }}>{words} palavras {words < 50 && '· escreva pelo menos 50 palavras para enviar'}</div>
      <button disabled={words < 50} onClick={onSubmit} className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40">Enviar Redação</button>
    </div>
  );
}

function QuestoesTab({ state, accent, onStartProva, onAnswerProva, onNextProva, onFinishProva, onExitProva, onEnterEssay, onPickPrompt, onChangeEssayText, onSubmitEssay, onCloseEssay }) {
  if (state.essayDraft) {
    return (
      <RedacaoView
        draft={state.essayDraft}
        accent={accent}
        essaysCount={state.essays.length}
        onPickPrompt={onPickPrompt}
        onChangeText={onChangeEssayText}
        onSubmit={onSubmitEssay}
        onClose={onCloseEssay}
      />
    );
  }
  if (state.currentProva) {
    if (state.currentProva.phase === 'report') {
      return <ProvaReport prova={state.currentProva} accent={accent} onExit={onExitProva} onRetry={() => onStartProva(state.currentProva.subject)} />;
    }
    return <ProvaAnswering prova={state.currentProva} accent={accent} onAnswer={onAnswerProva} onNext={onNextProva} onFinish={onFinishProva} onExit={onExitProva} />;
  }
  return <SubjectPicker state={state} accent={accent} onPick={onStartProva} onEssay={onEnterEssay} />;
}

/* ------------------------------------------------------------------ */
/* Progresso tab                                                        */
/* ------------------------------------------------------------------ */

function ProgressoTab({ state, accent }) {
  const progress = computeProgress(state.plan);
  const streak = computeStreak(state.studyDays);
  const level = levelFromPoints(state.points);
  const overall = overallAccuracy(state);
  const weakSubjects = state.plan.filter((s) => subjectAccuracy(state, s.key) < 60);
  const strongSubjects = state.plan.filter((s) => subjectAccuracy(state, s.key) >= 60);
  const medals = MEDAL_DEFS.filter((m) => m.test(state));
  const barData = state.plan.map((s) => ({ name: shortLabel(s.label), acc: subjectAccuracy(state, s.key) }));
  const pieData = overall ? [{ name: 'Acertos', value: overall.correct }, { name: 'Erros', value: overall.total - overall.correct }] : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
      <h2 className="font-display text-2xl font-bold mb-1">Seu Progresso</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-soft)' }}>Acompanhe sua evolução nos estudos</p>

      <div className="surface p-4 sm:p-5 mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Progresso Geral</span>
          <span style={{ color: 'var(--text-soft)' }}>{progress}%</span>
        </div>
        <ProgressBar value={progress} height={10} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="surface p-4 sm:p-5">
          <div className="font-display font-bold mb-3 text-sm">Resumo Rápido</div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span style={{ color: 'var(--text-soft)' }}>Questões respondidas</span><span className="font-semibold">{state.practiceAnswers.length}</span></div>
            <div className="flex justify-between"><span style={{ color: 'var(--text-soft)' }}>Redações enviadas</span><span className="font-semibold">{state.essays.length}</span></div>
            <div className="flex justify-between"><span style={{ color: 'var(--text-soft)' }}>Dias consecutivos</span><span className="font-semibold">{streak}</span></div>
            <div className="flex justify-between"><span style={{ color: 'var(--text-soft)' }}>Nível atual</span><span className="font-semibold">{level}</span></div>
          </div>
        </div>

        <div className="surface p-4 sm:p-5">
          <div className="font-display font-bold mb-3 text-sm">Seu Desempenho</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3" style={{ background: 'var(--bg-soft)' }}>
              <Star size={15} color={PERF.medium} />
              <div className="font-display font-bold text-base mt-1">{state.points}</div>
              <div className="text-xs" style={{ color: 'var(--text-soft)' }}>Pontos</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--bg-soft)' }}>
              <Trophy size={15} color={accent} />
              <div className="font-display font-bold text-base mt-1">Nível {level}</div>
              <div className="text-xs" style={{ color: 'var(--text-soft)' }}>Estudante</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--bg-soft)' }}>
              <Flame size={15} color={PERF.weak} />
              <div className="font-display font-bold text-base mt-1">{streak}</div>
              <div className="text-xs" style={{ color: 'var(--text-soft)' }}>Dias seguidos</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--bg-soft)' }}>
              <CheckCircle2 size={15} color={PERF.strong} />
              <div className="font-display font-bold text-base mt-1">{state.practiceAnswers.length}</div>
              <div className="text-xs" style={{ color: 'var(--text-soft)' }}>Questões</div>
            </div>
          </div>
        </div>
      </div>

      <div className="surface p-4 sm:p-5 mb-5">
        <div className="font-display font-bold mb-3 text-sm flex items-center gap-2"><Award size={16} color={accent} /> Medalhas</div>
        {medals.length ? (
          <div className="flex flex-wrap gap-2">
            {medals.map((m) => {
              const MIcon = m.icon;
              return (
                <span key={m.key} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: hexToRgba(accent, 0.12), color: accent }}>
                  <MIcon size={13} /> {m.label}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="text-sm" style={{ color: 'var(--text-soft)' }}>Complete atividades para ganhar suas primeiras medalhas.</div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="rounded-2xl p-4 sm:p-5" style={{ background: hexToRgba(PERF.weak, 0.08), border: `1px solid ${hexToRgba(PERF.weak, 0.25)}` }}>
          <div className="font-display font-bold mb-3 text-sm" style={{ color: PERF.weak }}>Matérias para Reforçar</div>
          {weakSubjects.length ? (
            <div className="flex flex-wrap gap-2">
              {weakSubjects.map((s) => (
                <span key={s.key} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: hexToRgba(PERF.weak, 0.16), color: PERF.weak }}>{s.label}</span>
              ))}
            </div>
          ) : <div className="text-sm" style={{ color: 'var(--text-soft)' }}>Nenhuma matéria fraca por enquanto — bom trabalho!</div>}
        </div>
        <div className="rounded-2xl p-4 sm:p-5" style={{ background: hexToRgba(PERF.strong, 0.08), border: `1px solid ${hexToRgba(PERF.strong, 0.25)}` }}>
          <div className="font-display font-bold mb-3 text-sm" style={{ color: PERF.strong }}>Matérias com Bom Desempenho</div>
          {strongSubjects.length ? (
            <div className="flex flex-wrap gap-2">
              {strongSubjects.map((s) => (
                <span key={s.key} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: hexToRgba(PERF.strong, 0.16), color: PERF.strong }}>{s.label}</span>
              ))}
            </div>
          ) : <div className="text-sm" style={{ color: 'var(--text-soft)' }}>Continue praticando para destacar suas forças aqui.</div>}
        </div>
      </div>

      <div className="surface p-4 sm:p-5 mb-5">
        <div className="font-display font-bold mb-4 text-sm flex items-center gap-2"><BarChart3 size={16} color={accent} /> Estatísticas</div>
        {overall ? (
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <div className="text-xs font-medium mb-2 text-center" style={{ color: 'var(--text-soft)' }}>Acerto Geral</div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={62} paddingAngle={2}>
                      <Cell fill={PERF.strong} />
                      <Cell fill={PERF.weak} />
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center font-display font-bold text-lg" style={{ color: accent }}>{overall.pct}%</div>
            </div>
            <div>
              <div className="text-xs font-medium mb-2 text-center" style={{ color: 'var(--text-soft)' }}>Por Matéria</div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Acerto']} labelFormatter={(l) => l} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="acc" radius={[6, 6, 0, 0]} barSize={14}>
                      {barData.map((d, i) => (<Cell key={i} fill={d.acc < 60 ? PERF.weak : PERF.strong} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm mb-4" style={{ color: 'var(--text-soft)' }}>Responda algumas questões na aba Questões para ver suas estatísticas aqui.</div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {state.plan.map((s) => {
            const acc = subjectAccuracy(state, s.key);
            return (
              <div key={s.key} className="rounded-xl p-2.5 text-center" style={{ background: 'var(--bg-soft)' }}>
                <div className="text-xs mb-1 truncate" style={{ color: 'var(--text-soft)' }}>{s.label}</div>
                <div className="font-display font-bold text-sm" style={{ color: acc < 60 ? PERF.weak : PERF.strong }}>{acc}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Config tab                                                           */
/* ------------------------------------------------------------------ */

function BackupSection({ onExport, onImport }) {
  const fileInputRef = useRef(null);
  const [pending, setPending] = useState(null);
  const [message, setMessage] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { data, exportedAt } = parseImportPayload(String(reader.result));
        setPending({ data, exportedAt });
        setMessage(null);
      } catch (err) {
        setPending(null);
        setMessage({ type: 'error', text: err.message || 'Não foi possível ler esse arquivo.' });
      }
    };
    reader.onerror = () => setMessage({ type: 'error', text: 'Não foi possível ler esse arquivo.' });
    reader.readAsText(file);
    e.target.value = '';
  }

  function confirmImport() {
    if (!pending) return;
    onImport(pending.data);
    setPending(null);
    setMessage({ type: 'success', text: 'Progresso importado com sucesso!' });
  }

  return (
    <div className="surface p-4 sm:p-5 mb-4">
      <div className="text-sm font-medium mb-3 flex items-center gap-2"><Download size={15} /> Backup do progresso</div>
      <div className="text-xs mb-4" style={{ color: 'var(--text-soft)' }}>
        Seu progresso já é salvo automaticamente aqui neste navegador, sem precisar de login. Use o backup para levar seu progresso pra outro dispositivo ou guardar uma cópia de segurança.
      </div>
      <div className="flex gap-2 mb-3">
        <button onClick={onExport} className="flex-1 chip py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
          <Download size={15} /> Exportar (.json)
        </button>
        <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="flex-1 chip py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
          <Upload size={15} /> Importar (.json)
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileChange} className="hidden" />
      </div>
      {pending && (
        <div className="p-3 rounded-xl text-sm mb-2" style={{ background: 'var(--bg-soft)' }}>
          <div className="font-medium mb-1">
            Arquivo encontrado{pending.exportedAt ? ` (exportado em ${new Date(pending.exportedAt).toLocaleDateString('pt-BR')})` : ''}
          </div>
          <div className="text-xs mb-3" style={{ color: 'var(--text-soft)' }}>Isso vai substituir todo o seu progresso atual neste navegador. Essa ação não pode ser desfeita.</div>
          <div className="flex gap-2">
            <button onClick={() => setPending(null)} className="flex-1 chip py-2 rounded-lg text-xs font-semibold">Cancelar</button>
            <button onClick={confirmImport} className="flex-1 btn-primary py-2 rounded-lg text-xs font-semibold">Substituir e importar</button>
          </div>
        </div>
      )}
      {message && (
        <div className="text-xs px-3 py-2 rounded-xl" style={{ background: hexToRgba(message.type === 'error' ? PERF.weak : PERF.strong, 0.12), color: message.type === 'error' ? PERF.weak : PERF.strong }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

function ConfigTab({ state, onSetTheme, onSetAccent, onRedoDiagnostic, onResetAll, onUpdateDate, onUpdateUF, onExport, onImport }) {
  const [date, setDate] = useState(state.examDate || '');
  const [uf, setUf] = useState(state.examUF || '');
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
      <h2 className="font-display text-2xl font-bold mb-6">Configurações</h2>

      <div className="surface p-4 sm:p-5 mb-4">
        <div className="text-sm font-medium mb-3">Tema</div>
        <div className="flex gap-2">
          <button onClick={() => onSetTheme('light')} className="flex-1 chip py-2.5 rounded-xl text-sm flex items-center justify-center gap-2" style={state.theme === 'light' ? { borderColor: state.accent, color: state.accent } : {}}><Sun size={15} /> Claro</button>
          <button onClick={() => onSetTheme('dark')} className="flex-1 chip py-2.5 rounded-xl text-sm flex items-center justify-center gap-2" style={state.theme === 'dark' ? { borderColor: state.accent, color: state.accent } : {}}><Moon size={15} /> Escuro</button>
        </div>
      </div>

      <div className="surface p-4 sm:p-5 mb-4">
        <div className="text-sm font-medium mb-3 flex items-center gap-2"><Palette size={15} /> Cor do tema</div>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((a) => (
            <button key={a.value} onClick={() => onSetAccent(a.value)} aria-label={a.name} className="w-9 h-9 rounded-full" style={{ background: a.value, outline: state.accent === a.value ? '2px solid var(--text)' : 'none', outlineOffset: '2px' }} />
          ))}
          <label className="w-9 h-9 rounded-full relative cursor-pointer overflow-hidden chip flex items-center justify-center" aria-label="Cor personalizada">
            <Palette size={14} />
            <input type="color" value={state.accent} onChange={(e) => onSetAccent(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
          </label>
        </div>
      </div>

      <div className="surface p-4 sm:p-5 mb-4">
        <div className="text-sm font-medium mb-3">Data da prova</div>
        <div className="flex gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 px-3 py-2 rounded-xl text-sm" style={{ background: 'var(--bg-soft)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />
          <button onClick={() => onUpdateDate(date)} className="btn-primary px-4 rounded-xl text-sm font-semibold">Salvar</button>
        </div>
      </div>

      {state.examType === 'concurso' && (
        <div className="surface p-4 sm:p-5 mb-4">
          <div className="text-sm font-medium mb-3 flex items-center gap-2"><MapPin size={15} /> Seu estado</div>
          <div className="flex gap-2">
            <select value={uf} onChange={(e) => setUf(e.target.value)} className="flex-1 px-3 py-2 rounded-xl text-sm" style={{ background: 'var(--bg-soft)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
              <option value="">Selecione...</option>
              {BRAZIL_STATES.map((s) => (<option key={s.uf} value={s.uf}>{s.name} ({s.uf})</option>))}
            </select>
            <button onClick={() => onUpdateUF(uf)} className="btn-primary px-4 rounded-xl text-sm font-semibold">Salvar</button>
          </div>
          <div className="text-xs mt-2" style={{ color: 'var(--text-soft)' }}>Usado para filtrar concursos abertos e previstos na aba Início.</div>
        </div>
      )}

      <BackupSection onExport={onExport} onImport={onImport} />

      <div className="surface p-4 sm:p-5 mb-4">
        <button onClick={onRedoDiagnostic} className="w-full chip py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"><RotateCcw size={15} /> Refazer diagnóstico</button>
      </div>

      <div className="surface p-4 sm:p-5">
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="w-full py-2.5 rounded-xl text-sm font-medium" style={{ color: PERF.weak, border: `1.5px solid ${hexToRgba(PERF.weak, 0.35)}` }}>Apagar tudo e recomeçar</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setConfirmReset(false)} className="flex-1 chip py-2.5 rounded-xl text-sm">Cancelar</button>
            <button onClick={onResetAll} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: PERF.weak, color: '#fff' }}>Sim, apagar tudo</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                   */
/* ------------------------------------------------------------------ */

export default function App() {
  const [state, setState] = useState(initialState);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const value = await storageGet(STORAGE_KEY);
        if (mounted && value) {
          const parsed = JSON.parse(value);
          setState((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        /* sem progresso salvo ainda */
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      storageSet(STORAGE_KEY, JSON.stringify(state));
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [state, loaded]);

  const update = (patch) => setState((prev) => ({ ...prev, ...patch }));

  const handlers = {
    goTo: (step) => update({ step }),
    selectExamType: (type) => update({ examType: type, step: type === 'enem' ? 'date' : 'subtype' }),
    selectSubtype: (key, other) => update({ examSubtype: key, examSubtypeOther: other, step: state.examType === 'concurso' ? 'location' : 'format' }),
    selectLocation: (uf) => update({ examUF: uf, step: 'format' }),
    selectFormat: (fmt) => update({ formatPref: fmt, step: 'date' }),
    dateContinue: (date) => update({ examDate: date, step: 'diagnostic-choice' }),
    diagnosticChoice: (path) => (
      path === 'know'
        ? update({ diagnosticPath: 'know', step: 'rating' })
        : update({ diagnosticPath: 'quiz', step: 'quiz', quizIndex: 0, quizAnswers: {} })
    ),
    quizAnswer: (qid, idx) => update({ quizAnswers: { ...state.quizAnswers, [qid]: idx } }),
    quizNav: (delta) => update({ quizIndex: Math.max(0, state.quizIndex + delta) }),
    quizFinish: (areas) => {
      const areaScores = { ...state.areaScores, ...computeAreaScores(state.quizAnswers, areas) };
      const remaining = getExtraRatingSubjects(state);
      if (remaining.length > 0) {
        update({ areaScores, step: 'rating' });
      } else {
        const plan = buildPlan({ ...state, areaScores });
        update({ areaScores, plan, step: 'ready' });
      }
    },
    rate: (key, value) => update({ selfRatings: { ...state.selfRatings, [key]: value } }),
    ratingFinish: () => {
      const plan = buildPlan(state);
      update({ plan, step: 'ready' });
    },
    enterDashboard: () => update({ onboardingComplete: true }),
    toggleTask: (subjectKey, taskId) => {
      setState((prev) => {
        let becameDone = false;
        const plan = prev.plan.map((s) => {
          if (s.key !== subjectKey) return s;
          return {
            ...s,
            tasks: s.tasks.map((t) => {
              if (t.id !== taskId) return t;
              const newDone = !t.done;
              if (newDone) becameDone = true;
              return { ...t, done: newDone };
            }),
          };
        });
        const today = todayStr();
        const studyDays = becameDone && prev.studyDays.indexOf(today) === -1 ? [...prev.studyDays, today] : prev.studyDays;
        return { ...prev, plan, studyDays };
      });
    },
    setTheme: (theme) => update({ theme }),
    setAccent: (accent) => update({ accent }),
    redoDiagnostic: () => update({
      onboardingComplete: false,
      step: 'diagnostic-choice',
      diagnosticPath: null,
      quizAnswers: {},
      quizIndex: 0,
      areaScores: {},
      selfRatings: {},
    }),
    switchModality: (newType) => {
      if (newType === state.examType) return;
      setState((prev) => {
        const profiles = { ...prev.profiles, [prev.examType]: extractProfileFields(prev) };
        const target = profiles[newType];
        if (target) {
          return { ...prev, profiles, ...target, quizIndex: 0, currentProva: null, essayDraft: null, activeTab: 'inicio' };
        }
        return {
          ...prev,
          profiles,
          ...freshProfileFields(),
          examType: newType,
          step: newType === 'enem' ? 'date' : 'subtype',
          quizIndex: 0,
          currentProva: null,
          essayDraft: null,
        };
      });
    },
    resetAll: () => setState(initialState()),
    updateDate: (date) => update({ examDate: date }),
    updateUF: (uf) => update({ examUF: uf }),
    exportProgress: () => {
      downloadJSON(`foco-progresso-${todayStr()}.json`, buildExportPayload(state));
    },
    importProgress: (data) => {
      setState({ ...initialState(), ...data, currentProva: null, essayDraft: null, activeTab: 'inicio' });
    },
    setActiveTab: (tab) => update({ activeTab: tab }),
    startProva: (subjectKey) => {
      const pool = QUESTION_BANK.filter((q) => q.area === subjectKey);
      const chosen = shuffle(pool).slice(0, Math.min(5, pool.length));
      update({ currentProva: { subject: subjectKey, questions: chosen, index: 0, answers: {}, revealed: {}, phase: 'answering', pointsEarned: 0 } });
    },
    answerProva: (qid, idx) => {
      setState((prev) => {
        if (!prev.currentProva) return prev;
        return { ...prev, currentProva: { ...prev.currentProva, answers: { ...prev.currentProva.answers, [qid]: idx }, revealed: { ...prev.currentProva.revealed, [qid]: true } } };
      });
    },
    nextProvaQuestion: () => {
      setState((prev) => {
        if (!prev.currentProva) return prev;
        return { ...prev, currentProva: { ...prev.currentProva, index: Math.min(prev.currentProva.questions.length - 1, prev.currentProva.index + 1) } };
      });
    },
    finishProva: () => {
      setState((prev) => {
        const cp = prev.currentProva;
        if (!cp) return prev;
        const results = cp.questions.map((q) => ({ subject: cp.subject, correct: cp.answers[q.id] === q.correct }));
        let pointsEarned = 0;
        results.forEach((r) => { pointsEarned += r.correct ? 10 : 3; });
        const perfect = results.every((r) => r.correct);
        if (perfect) pointsEarned += 25;
        const today = todayStr();
        const studyDays = prev.studyDays.indexOf(today) === -1 ? [...prev.studyDays, today] : prev.studyDays;
        return {
          ...prev,
          practiceAnswers: [...prev.practiceAnswers, ...results],
          points: prev.points + pointsEarned,
          hasPerfectProva: prev.hasPerfectProva || perfect,
          studyDays,
          currentProva: { ...cp, phase: 'report', pointsEarned },
        };
      });
    },
    exitProva: () => update({ currentProva: null }),
    enterEssay: () => update({ essayDraft: { promptIndex: null, text: '', submitted: false, wordCount: 0 } }),
    pickEssayPrompt: (idx) => update({ essayDraft: { ...state.essayDraft, promptIndex: idx } }),
    updateEssayText: (text) => update({ essayDraft: { ...state.essayDraft, text } }),
    closeEssay: () => update({ essayDraft: null }),
    submitEssay: () => {
      setState((prev) => {
        if (!prev.essayDraft) return prev;
        const wordCount = prev.essayDraft.text.trim() ? prev.essayDraft.text.trim().split(/\s+/).filter(Boolean).length : 0;
        const today = todayStr();
        const studyDays = prev.studyDays.indexOf(today) === -1 ? [...prev.studyDays, today] : prev.studyDays;
        return {
          ...prev,
          essays: [...prev.essays, { promptIndex: prev.essayDraft.promptIndex, wordCount, date: today }],
          points: prev.points + 40,
          studyDays,
          essayDraft: { ...prev.essayDraft, submitted: true, wordCount },
        };
      });
    },
  };

  const themeClass = state.theme === 'dark' ? 'theme-dark' : 'theme-light';
  const showMain = loaded && state.onboardingComplete && state.plan && state.plan.length > 0;

  return (
    <div className={themeClass} style={{ '--accent': state.accent, '--accent-text': contrastTextColor(state.accent), background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@400;500;600;700;800&display=swap');
        .theme-light { --bg:#f6f4ee; --bg-soft:#efeade; --card:#fffdf9; --border:#e3ddcd; --text:#1c1a14; --text-soft:#6b6452; --shadow:0 1px 2px rgba(30,26,14,0.05), 0 16px 32px -16px rgba(30,26,14,0.16); }
        .theme-dark { --bg:#15130f; --bg-soft:#1d1a14; --card:#201d16; --border:#34301f; --text:#f3f0e6; --text-soft:#9c9581; --shadow:0 1px 2px rgba(0,0,0,0.4), 0 16px 32px -16px rgba(0,0,0,0.65); }
        .font-display { font-family:'Bricolage Grotesque', system-ui, sans-serif; }
        .surface { background:var(--card); border:1px solid var(--border); box-shadow:var(--shadow); border-radius:20px; transition: border-color .15s ease, transform .15s ease; }
        .chip { border:1.5px solid var(--border); background:var(--card); color:var(--text); cursor:pointer; transition: border-color .15s ease, background .15s ease; }
        .chip:hover { border-color:var(--accent); }
        .btn-primary { background:var(--accent); color:var(--accent-text); cursor:pointer; border:none; transition: filter .15s ease; }
        .btn-primary:hover:not(:disabled) { filter:brightness(1.08); }
        .btn-primary:disabled { cursor:not-allowed; }
        .progress-track { background:var(--bg-soft); border-radius:999px; overflow:hidden; }
        .progress-fill { background:var(--accent); transition: width .5s ease; }
        button { font-family:inherit; }
        textarea { font-family:inherit; outline:none; }
        textarea:focus { border-color:var(--accent) !important; }
        input[type=date], input[type=text] { outline:none; }
        input[type=date]:focus, input[type=text]:focus { border-color:var(--accent) !important; }
        ::-webkit-scrollbar { width:8px; height:8px; }
        ::-webkit-scrollbar-thumb { background:var(--border); border-radius:999px; }
        @keyframes fadeSlideIn { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }
        .step-enter { animation:fadeSlideIn .4s ease; }
      `}</style>
      {!loaded ? (
        <LoadingScreen />
      ) : !showMain ? (
        <Onboarding state={state} handlers={handlers} />
      ) : (
        <>
          <TopNav state={state} activeTab={state.activeTab} onChangeTab={handlers.setActiveTab} onToggleTheme={() => handlers.setTheme(state.theme === 'dark' ? 'light' : 'dark')} onSwitchModality={handlers.switchModality} />
          {state.activeTab === 'inicio' && (
            <InicioTab state={state} onToggleTask={handlers.toggleTask} onGoToQuestoes={() => handlers.setActiveTab('questoes')} />
          )}
          {state.activeTab === 'questoes' && (
            <QuestoesTab
              state={state}
              accent={state.accent}
              onStartProva={handlers.startProva}
              onAnswerProva={handlers.answerProva}
              onNextProva={handlers.nextProvaQuestion}
              onFinishProva={handlers.finishProva}
              onExitProva={handlers.exitProva}
              onEnterEssay={handlers.enterEssay}
              onPickPrompt={handlers.pickEssayPrompt}
              onChangeEssayText={handlers.updateEssayText}
              onSubmitEssay={handlers.submitEssay}
              onCloseEssay={handlers.closeEssay}
            />
          )}
          {state.activeTab === 'progresso' && <ProgressoTab state={state} accent={state.accent} />}
          {state.activeTab === 'config' && (
            <ConfigTab
              state={state}
              onSetTheme={handlers.setTheme}
              onSetAccent={handlers.setAccent}
              onRedoDiagnostic={handlers.redoDiagnostic}
              onResetAll={handlers.resetAll}
              onUpdateDate={handlers.updateDate}
              onUpdateUF={handlers.updateUF}
              onExport={handlers.exportProgress}
              onImport={handlers.importProgress}
            />
          )}
        </>
      )}
    </div>
  );
}
