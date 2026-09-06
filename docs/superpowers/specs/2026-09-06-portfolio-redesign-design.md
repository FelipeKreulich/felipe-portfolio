# Redesenho do portfólio — três secções, papel e tinta

Data: 2026-09-06
Estado: aprovado em conversa, à espera de revisão escrita

---

## 1. Porquê

O portfólio atual tem oito secções, ~140 ficheiros e um vocabulário visual
cinematográfico (WebGL, halftone, dither, CRT warp, grelha reativa). O
Felipe deixou de gostar do layout. Não é reposicionamento — o conteúdo sobre
quem ele é mantém-se; muda a forma.

O novo site tem **três secções, preto e branco, sem tema alternável**, e uma
linguagem visual construída à volta de caracteres japoneses — a mesma língua
que o preloader já fala no seu scramble.

A referência é o avatar do próprio Felipe: uma figura de olhos brancos dentro
de anéis concêntricos de kanji. A versão minimalista dessa imagem é o seu
negativo — em vez de luz emitida no escuro, tinta impressa em papel.

O vocabulário de kanji não é inventado. Vem do README de GitHub do Felipe,
onde já usa `我 · 術 · 創 · 数 · 縁` como marcadores de secção.

---

## 2. Decisões fechadas

| Decisão | Escolha |
|---|---|
| Secções | Hero (我) · Projetos (創) · Contacto (縁) |
| Tema | Papel branco, tinta preta. **Sem dark mode, sem toggle.** |
| Hero | LetterGlitch (React Bits) com alfabeto japonês |
| Composição da hero | Figura recortada ao centro, nome **por baixo**. Nada mais. |
| Anel de kanji | Secção de contacto |
| Avatar | `profile_pic.jpg` recortado com o Vision, monocromático |
| Preloader | Mantido. Passa a **branco**, como o site. |
| WebGL | Só o shader de dissolve, em chunk lazy. Nada mais. |
| Scroll | Lenis, página contínua |
| Idiomas | pt / en, rotas estáticas `/pt` e `/en` |
| Accent | O ciano `--preloader-accent` passa a tinta preta |

### Fora de âmbito

Páginas de caso por projeto (`/pt/projetos/<slug>`), blog, agendamento
(Calendly), secção de serviços, botão de café. O `lib/projectsData.ts`
mantém os campos `slug`, `stackFull` e `shots` que as páginas de caso
usariam — não custam nada e evitam ter de os reconstruir depois.

---

## 3. Estrutura de ficheiros

### Novos — cinco

```
components/hero/Hero.tsx            composição da secção 1
components/hero/LetterGlitch.tsx    o canvas, reescrito (ver §5)
components/projects/Projects.tsx    secção 2
components/contact/Contact.tsx      secção 3
components/kanji/KanjiRing.tsx      anel SVG textPath, usado no contacto
```

### Mantidos intactos

**Preloader e a sua espinha** — `components/preloader/{Preloader,ScrambleText,DissolveOverlay}.tsx`,
`store/{usePreloaderStore,dissolveBus}.ts`, `hooks/useAppProgress.ts`,
`components/ReducedMotion.tsx`, `lib/{gsap,cssColor,device}.ts`,
`components/canvas/{Scene,SceneCanvas}.tsx`, `shaders/dissolve.{vert,frag}.ts`.

**Idiomas** — `contexts/language/LanguageContext.tsx`, `lib/i18n/{config,dictionaries}.ts`
(o dicionário é podado, a máquina não muda), `components/language/LanguageGate.tsx`.

**Scroll** — `components/SmoothScroll.tsx`, `lib/{lenisBus,scrollConfig}.ts`.

**SEO e rotas** — `app/robots.ts`, `app/sitemap.ts`, `app/[lang]/loading.tsx`,
`app/[lang]/not-found.tsx`, `proxy.ts`.

**Dados** — `lib/projectsData.ts`, `lib/config.ts`, `lib/layout.ts`,
`lib/utils.ts`. O `components/footer/socials.ts` sobrevive ao seu diretório:
passa a `lib/socials.ts`.

### Reescritos

`app/[lang]/layout.tsx` — deixa de montar `GridBackground`,
`SectionGridColors`, `ScrollRhythm`, `FooterServer`, `ClientLayout` e
`ThemeScript`. Fica com `ReducedMotion`, `SceneCanvas`, `Preloader`,
`LanguageGate`, `LanguageProvider`, `SmoothScroll`, `SpeedInsights`.

`app/[lang]/page.tsx` — três componentes, sem navegação lateral, sem
`IntersectionObserver` de secção ativa, sem toasts.

`app/globals.css` — o bloco `.dark` inteiro desaparece. Tokens reduzidos a
papel, tinta e as suas graduações.

`lib/i18n/dictionaries.ts` — de ~150 chaves para ~30.

### Apagados

Diretórios inteiros: `components/{about,career,manifesto,pulse,schedule,transition,background,footer,ui,client}`.

Ficheiros soltos: `components/ScrollRhythm.tsx`, `app/theme-script.tsx`,
`hooks/{use-mobile,use-theme,useThemeMode,useHeroReveal,usePortraitReadout,useResponsiveDither}.ts`,
`lib/{careerData,github,gridConfig,heroConfig,manifestoConfig,portraitConfig,sparks}.ts`,
`shaders/halftone.{vert,frag}.ts`, `scripts/{prepare-hero.mjs,prepare-transition.mjs,prepare-video.sh}`.

Média que deixa de ser referenciada: `assets/` (originais versionados),
`public/{hero-*,transition-*,section-1*,word-video.mp4,portrait.webp,iconpattern.svg,flag-*}`.
Os `public/{blog,worm,ciphermesh}-image.png` ficam — são as pré-visualizações
dos projetos. Os `curriculo*.pdf` ficam.

**Contagem:** ~55 ficheiros de código apagados, ~5 criados.

### Dependências removidas

`@paper-design/shaders-react`, `@react-three/postprocessing`, `postprocessing`,
`motion`, `recharts`, `embla-carousel-react`, `cmdk`, `vaul`,
`react-day-picker`, `date-fns`, `input-otp`, `react-hook-form`,
`@hookform/resolvers`, `zod`, `next-themes`, `react-resizable-panels`,
`sonner`, `class-variance-authority`, `lucide-react`, `simple-icons` e todos
os `@radix-ui/*`.

O `simple-icons` sai porque o contacto não leva ícones: a lista de ligações
é tipográfica, com o nome da plataforma em mono e o handle ao lado. Logótipos
alheios trariam de volta quatro identidades visuais que o resto do site não
tem — a mesma razão pela qual o `socials.ts` já proíbe cores de marca.

Ficam: `next`, `react`, `react-dom`, `gsap`, `@gsap/react`, `three`,
`@react-three/fiber`, `@react-three/drei`, `lenis`, `zustand`,
`clsx`, `tailwind-merge`, `@vercel/speed-insights`.

---

## 4. As três secções

### 4.1 Hero — 我

Ecrã inteiro. Papel branco. Por baixo de tudo, o LetterGlitch a preencher o
viewport com caracteres japoneses em três cinzentos (`#0a0a0a`, `#6b6b6b`,
`#9a9a9a`). Duas vinhetas radiais em branco — uma central, para o centro
respirar e o conteúdo se ler; uma exterior, para o ruído não bater nas
margens.

Ao centro, empilhados: a figura recortada, e o nome `FELIPE KREULICH` por
baixo dela, numa linha, em mono, `clamp(2rem, 6vw, 5.5rem)`.

**Mais nada.** Sem eyebrow, sem localização, sem CTA, sem indicador de scroll.

O risco assumido: sem afordância nenhuma, parte dos visitantes não descobre
que há página por baixo. A mitigação é movimento e não palavras — a figura
desloca-se alguns pixels ao primeiro scroll, e o glitch abranda depois de
uns segundos parado. Fica registado como ponto a observar depois de estar
no ar, não como coisa a resolver antes.

**Responsivo:** abaixo de 640px a figura desce para ~46% da largura e o nome
parte em duas linhas.

### 4.2 Projetos — 創

Lista, não grelha de cartões. Cada projeto é uma linha com o seu índice
escrito (`01`, `02`, `03`), o nome, o resumo de uma frase, até três
tecnologias, e o estado. Os dados vêm todos de `lib/projectsData.ts`; os
textos, do dicionário pelas chaves `summaryKey` / `outcomeKey` / `metricKey`
que já lá estão.

A pré-visualização de cada projeto (`preview.src`) aparece no hover, em
`grayscale(1)`, ancorada ao cursor. Em toque, aparece sempre, pequena, à
direita da linha.

Cabeçalho da secção: `創` grande, com a palavra latina ao lado, no mesmo
padrão do README.

### 4.3 Contacto — 縁

O `KanjiRing` centrado: dois anéis concêntricos de `<textPath>` SVG a rodar
em sentidos opostos, com as máximas do Felipe em japonês. Texto verdadeiro —
selecionável, indexável, com `aria-label` na versão do idioma ativo.

Dentro do anel, a lista de ligações: GitHub, LinkedIn, X, Instagram, Blog, e
o email com botão de copiar (o comportamento do rodapé antigo, que já estava
resolvido). Sem cores de marca — a regra que o `socials.ts` já documenta.

O anel roda com o scroll, não sozinho: `ScrollTrigger` com `scrub`, o mesmo
GSAP que o preloader já carrega.

**Texto dos anéis** (as máximas do README do Felipe, em japonês):

| README | Anel |
|---|---|
| No one is coming. Build it yourself. | 誰も来ない、自分で作れ |
| Every system fails — design for the fall. | すべては壊れる、その前提で設計せよ |
| Discipline outlives motivation. | 規律は動機より長く続く |
| Silence, then execution. | 沈黙、そして実行 |
| break it, understand it, rebuild it better | 壊して、理解して、より良く作り直す |
| The abyss stares back. Ship anyway. | 深淵は見返す。それでも世に出せ |

---

## 5. O LetterGlitch, reescrito

O componente do React Bits é copiado, não instalado. Reescrevo-o em vez de o
colar tal e qual, por quatro razões concretas:

**Bug no `smooth`.** Em `handleSmoothTransitions`, faz
`hexToRgb(letter.color)`. A partir da segunda frame `letter.color` já é
`"rgb(255, 255, 255)"`, e a regex de `hexToRgb` só aceita hex — devolve
`null`, `needsRedraw` fica `false`, e a interpolação congela ao fim de um
passo de 5%. **Correção:** guardar o ponto de partida em hex num campo
próprio (`from`), separado da string CSS já composta.

**`charWidth: 10` não serve para japonês.** Os glifos CJK são full-width: a
15px ocupam ~15px, não 10. Numa grelha de 10px sobrepõem-se. **Correção:**
célula de 15×20 para corpo de 15px, e a largura da célula derivada do corpo
em vez de constante solta.

**Não conhece `prefers-reduced-motion`.** Um canvas a repintar a grelha
inteira a 60fps é das coisas mais agressivas que se põe numa página.
**Correção:** ler `useMotionPrefs()`, que o projeto já tem. Sem movimento,
pinta uma grelha estática e não arranca o loop.

**Não pára quando sai do ecrã.** O `requestAnimationFrame` corre para sempre,
mesmo com o visitante já no contacto. Em 1080p com célula de 15×20 são ~6900
`fillText` por frame. **Correção:** `IntersectionObserver` na hero, e o loop
no ticker do GSAP em vez de um `rAF` próprio — o projeto já conduz o Lenis
por esse ticker, e dois loops descoordenados dão jitter.

A API pública mantém-se (`glitchSpeed`, `smooth`, `characters`,
`glitchColors`, vinhetas), para o componente continuar a ser reconhecível
como o do React Bits.

**Onde reportar:** o bug do `smooth` existe a montante, no reactbits.dev.
Vale um issue.

---

## 6. Sistema visual

**Cor.** Dois tokens e as suas graduações. `--paper: #ffffff`,
`--ink: #0a0a0a`, mais `--ink-60`, `--ink-35`, `--ink-14` para hierarquia.
Nada mais. Sem `.dark`.

**Tipografia.** IBM Plex Mono (já carregado) para tudo o que é interface:
nome, metadados, índices, estados. Inter (já carregado) para prosa — os
resumos dos projetos. A distinção é mono = instrumento, sans = voz.

**Japonês.** Nenhuma mono latina cobre CJK. Hoje o `ScrambleText` cai para a
fonte do sistema (Hiragino no Mac, Yu Gothic no Windows, Noto no Linux), o
que dá um aspeto diferente por plataforma. Como o kanji passa a ser a
identidade do site e não um detalhe do preloader, carrega-se **Noto Sans JP,
peso 400, `display: swap`** via `next/font/google`. O Google serve-a
particionada por `unicode-range`; com um conjunto fixo de ~70 glifos, são
poucos ficheiros. O custo é real mas pequeno, e a alternativa é o site
mudar de cara conforme o sistema operativo.

**Espaço.** `lib/layout.ts` já define o contentor
(`mx-auto w-full max-w-6xl px-8 lg:px-16`). As três secções usam-no; a hero
é a exceção, ocupa o viewport inteiro.

---

## 7. Idiomas

A máquina não muda: rotas `[lang]` geradas estaticamente, `<html lang>`
servido, hreflang recíproco, dicionários importáveis do servidor. Tudo isto
já está certo e é a parte do site mais difícil de refazer bem.

O que muda é o conteúdo. O dicionário passa de ~150 chaves para ~30:
metadados, o nome das três secções, os textos dos projetos (que já existem)
e as etiquetas do contacto. Todas as chaves de about, career, manifesto,
services, blog, thoughts, coffee, calendar e transition desaparecem.

O kanji não se traduz — é o mesmo nos dois idiomas. O que se traduz é o
`aria-label` que o acompanha e a palavra latina ao lado.

---

## 8. O preloader

Fica **exatamente como está**, em código. O que muda são três valores de CSS:

```
--preloader-bg:     #FFFFFF   (era #08090A no escuro)
--preloader-fg:     #0A0A0A
--preloader-accent: #0A0A0A   (era oklch(0.84 0.12 205), ciano)
```

Isto tem uma consequência que vale registar: com o preloader branco a abrir
para um site branco, o dissolve deixa de ser uma revelação e passa a ser
textura. O shader não precisa de mudar — pinta `uBg` com alpha de cobertura,
e a orla e o `uIdle` pintam `uAccent`. Com o accent em preto, o grão de
repouso passa a **tinta ténue sobre papel**: a textura do papel, não um
brilho. É a leitura correta do efeito neste sistema visual, e sai de graça.

O `IDLE_DISSOLVE_INTENSITY = 0.15` provavelmente quer descer — preto a 15%
sobre branco lê-se muito mais do que ciano a 15% sobre preto. Aferir a olho
na implementação; é um número, não uma decisão de arquitetura.

---

## 9. Movimento e acessibilidade

Tudo o que anima lê o `useMotionPrefs()` que já existe. Com movimento
reduzido: o glitch fica estático, o anel não roda, o preloader sai por fade
(caminho já escrito), o Lenis não monta.

O contraste é o máximo possível — `#0a0a0a` sobre `#ffffff` dá 19.6:1. Os
cinzentos do glitch são decorativos e ficam atrás de vinhetas; nenhum texto
que precise de ser lido usa `--ink-35`.

O canvas do glitch é `aria-hidden`. Os caracteres japoneses do anel têm
`aria-label` traduzido. A figura tem `alt` do dicionário. A ordem de
tabulação é a ordem do documento: hero (nada focável), projetos (três
ligações), contacto (seis ligações e o botão de copiar).

---

## 10. Riscos

**A hero sem afordância.** Já discutido em §4.1. Observar, não pré-resolver.

**O glitch pode ler-se como ruído gratuito.** É um fundo animado atrás de um
nome. A diferença entre atmosfera e barulho está na densidade e na
velocidade — `glitchSpeed` e a percentagem de células que mudam por tick
são os dois números a afinar em cima do resultado, não à partida.

**Recorte do avatar.** Feito com `VNGenerateForegroundInstanceMaskRequest`
(Vision, macOS). Qualidade verificada: cabelo com fios preservados, fundo
limpo. A marca de água do TikTok foi removida cortando a faixa inferior da
imagem (736×736 → 736×680), o que é mais limpo do que apagar uma caixa
por cima — não deixa entalhe no ombro. O PNG final entra em
`public/avatar.png`; o script Swift que o gerou é descartável e não entra
no repo.

**Direitos da imagem.** O avatar é uma ilustração de terceiros
(`@mr.himeho`, pelo watermark), que o Felipe usa como foto de perfil. Usá-la
no portfólio é decisão dele; fica registado que a origem não é própria.

**Perda de conteúdo.** Sai muita coisa que hoje existe: percurso
profissional, manifesto, agendamento, blog. Nada disto está a ser
arquivado — está a ser apagado, com o git como única rede. O commit anterior
(`1de3ad0`) é o ponto de retorno.

---

## 11. Verificação

- `npm run build` passa, e o `npm run lint` não regride.
- `npx knip` (ou equivalente) não acusa ficheiros nem dependências órfãs
  depois da limpeza.
- As duas rotas geram estaticamente: `/pt` e `/en` no output do build.
- O HTML servido de `/pt` contém o texto dos projetos sem executar
  JavaScript (`curl` e procurar o nome de um projeto).
- Com `prefers-reduced-motion: reduce`, nenhum `requestAnimationFrame` fica
  ativo depois do preloader sair.
- Lighthouse: o bundle inicial não deve conter `three` — verificar em
  `npm run analyze`.
