#!/usr/bin/env bash
#
# Prepara o vídeo da secção Manifesto a partir da fonte em `assets/`.
#
#   bash scripts/prepare-video.sh
#
# A fonte tem 1920x1080, 17.3s e 10.1MB — grande demais em todas as dimensões
# para um fundo que vai ser coberto por uma trama de pontos.
#
# LOOP: a fonte não fecha. Medido, a diferença entre o primeiro e o último
# frame é 47.9/255, e o melhor par de cortes entre 6 e 10s ainda dá 30.1
# (abaixo de ~8 o corte é invisível). A pessoa move-se por poses distintas e a
# câmara desloca-se, portanto não há regresso a um frame equivalente.
#
# Solução: ping-pong — 4s para a frente e os mesmos 4s ao contrário. Costura
# medida: 2.1. A alternativa era um crossfade da cauda na cabeça, que mediu
# 8.8; a receita está no fim deste ficheiro, comentada.
set -euo pipefail

SRC="assets/video-section-1.mp4"
OUT="public"
NAME="section-1"

# Janela escolhida da fonte, em segundos.
START=0.8
LENGTH=4.0

# A trama destrói o detalhe fino: 720p chega e sobra.
SCALE="1280:720"

echo "fonte: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")s"

FILTER="[0:v]trim=start=${START}:end=$(echo "$START + $LENGTH" | bc),setpts=PTS-STARTPTS,scale=${SCALE},split[f1][f2];[f2]reverse[r];[f1][r]concat=n=2:v=1:a=0[out]"

# H.264 — o Safari precisa dele.
ffmpeg -v error -i "$SRC" -filter_complex "$FILTER" -map "[out]" -an \
  -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "${OUT}/${NAME}.mp4" -y

# VP9 — menor, para quem o suporta.
ffmpeg -v error -i "$SRC" -filter_complex "$FILTER" -map "[out]" -an \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
  "${OUT}/${NAME}.webm" -y

# Poster: frame representativo, para o fallback e para o `preload="none"`.
ffmpeg -v error -ss 2.0 -i "${OUT}/${NAME}.mp4" -frames:v 1 -vf "scale=${SCALE}" \
  "${OUT}/${NAME}-poster.webp" -y

for f in "${OUT}/${NAME}.mp4" "${OUT}/${NAME}.webm" "${OUT}/${NAME}-poster.webp"; do
  printf "  %-28s %6sK\n" "$(basename "$f")" "$(( $(stat -f%z "$f") / 1024 ))"
done

# ALTERNATIVA — crossfade (costura 8.8 em vez de 2.1), sem movimento invertido:
#
# FILTER="[0:v]trim=start=0.8:end=1.4,setpts=PTS-STARTPTS,scale=${SCALE}[head];
#         [0:v]trim=start=6.2:end=6.8,setpts=PTS-STARTPTS,scale=${SCALE}[tail];
#         [tail][head]blend=all_expr='A*(1-T/0.6)+B*(T/0.6)'[mix];
#         [0:v]trim=start=1.4:end=6.2,setpts=PTS-STARTPTS,scale=${SCALE}[body];
#         [mix][body]concat=n=2:v=1:a=0[out]"
