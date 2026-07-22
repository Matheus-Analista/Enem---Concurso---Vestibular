# Foco — Plano de Estudos

Site de plano de estudos personalizado para ENEM, vestibular e concursos: diagnóstico inicial, banco de questões com correção e explicação na hora, relatório ao final de cada prova, painel de progresso com pontos/nível/medalhas, e suporte a múltiplas modalidades com progresso separado (ENEM, vestibular e concurso não compartilham nota entre si).

Progresso é salvo automaticamente no navegador da pessoa (via `localStorage`), sem necessidade de conta ou login. Também é possível exportar/importar o progresso em `.json` pela aba **Config**.

## Rodando localmente

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou mais recente.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

## Build de produção

```bash
npm run build
```

Isso gera a pasta `dist/`, pronta para ser hospedada em qualquer servidor de arquivos estáticos.

## Deploy

### Vercel ou Netlify (recomendado, mais simples)
1. Suba este repositório no GitHub.
2. Importe o repositório na [Vercel](https://vercel.com/new) ou na [Netlify](https://app.netlify.com/start).
3. Ambos detectam automaticamente que é um projeto Vite (build command `npm run build`, output `dist`). Não precisa mudar nada.

### GitHub Pages
1. No `vite.config.js`, troque `base: './'` por `base: '/nome-do-repositorio/'`.
2. Rode `npm run build`.
3. Publique o conteúdo da pasta `dist/` na branch `gh-pages` (pode usar a action `peaceiris/actions-gh-pages` ou a extensão `gh-pages` do npm).

## Estrutura do projeto

```
├── index.html          # ponto de entrada HTML
├── src/
│   ├── main.jsx        # monta o React na página
│   ├── App.jsx         # todo o app (onboarding, questões, progresso, config)
│   └── index.css       # diretivas do Tailwind
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Sobre o banco de questões

O `QUESTION_BANK` dentro de `App.jsx` contém questões autorais (escritas para este projeto), no estilo e nível do ENEM/vestibular/concursos, cobrindo Português, Matemática, Física, Química, Biologia, História, Geografia, Filosofia, Sociologia, Raciocínio Lógico e matérias comuns a concursos (Direito, Informática, etc). Não são questões reais de provas — para provas oficiais, o app já linka diretamente para o portal do INEP (ENEM) e para buscas de provas anteriores de vestibulares e bancas específicas.

## Personalização

- Cores de destaque e tema claro/escuro: aba **Config**, dentro do app.
- Para adicionar mais questões, edite o array `QUESTION_BANK` em `src/App.jsx` (cada item tem `area`, `question`, `options`, `correct` e `explanation`).
- Para adicionar novos vestibulares/concursos à lista de opções, edite `VESTIBULAR_OPTIONS` e `CONCURSO_OPTIONS` em `src/App.jsx`.
