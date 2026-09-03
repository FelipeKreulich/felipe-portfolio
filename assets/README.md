# Originais

Fonte dos scripts em `scripts/`. **Não são servidos** — o site carrega as
variantes geradas, que vivem em `public/`.

Ficam versionados para que um clone novo consiga regenerar tudo: sem eles,
reafinar a curva tonal do hero ou recortar de outra maneira obrigava a ir
procurar os ficheiros originais outra vez.

| Original | Script | Gera |
|---|---|---|
| `new-hero.jpg` | `prepare-hero.mjs` | `hero-desktop.webp`, `hero-mobile.webp` |
| `eu.png` | `prepare-hero.mjs` | `portrait.webp` |
| `image-transition.jpg` | `prepare-transition.mjs` | `transition-desktop.webp`, `transition-mobile.webp` |
| `video-section-1.mp4` | `prepare-video.sh` | `section-1.mp4`, `section-1.webm`, `section-1-poster.webp` |

Os `new-hero-image*.png` são versões anteriores do hero, mantidas para
comparação — não são consumidas por nenhum script.
