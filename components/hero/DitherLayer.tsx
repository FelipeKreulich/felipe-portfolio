"use client"

import dynamic from "next/dynamic"
import { ACTIVE_PRESET, DITHER_BASE, DITHER_PRESETS } from "@/lib/heroConfig"
import { useThemeMode } from "@/hooks/useThemeMode"

/**
 * O WebGL só entra a partir daqui, e nunca no servidor. É este o único
 * contexto WebGL da aplicação.
 */
const ImageDithering = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.ImageDithering),
  { ssr: false, loading: () => null },
)

interface DitherLayerProps {
  image: string
  size: number
}

export default function DitherLayer({ image, size }: DitherLayerProps) {
  const isDark = useThemeMode()
  const preset = DITHER_PRESETS[ACTIVE_PRESET][isDark ? "dark" : "light"]

  return (
    <ImageDithering
      image={image}
      {...DITHER_BASE}
      {...preset}
      size={size}
      width="100%"
      height="100%"
      // `speed` fica no default 0: a zero a biblioteca não corre rAF nenhum,
      // e este shader não tem termo dependente do tempo. É o que mantém o
      // critério do "um só requestAnimationFrame" verdadeiro.
      //
      // Limita os pixels rasterizados — sem isto um 4K a DPR 2 pede ~33M px
      // por frame ao fragment shader.
      maxPixelCount={1920 * 1080}
      className="absolute inset-0 h-full w-full"
    />
  )
}
