"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { useMotionPrefs } from "@/components/ReducedMotion"
import { SECTION_CONTAINER } from "@/lib/layout"
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap"
import {
  MANIFESTO_MP4 as MP4,
  MANIFESTO_POSTER as POSTER,
  MANIFESTO_WEBM as WEBM,
  SCROLL_DRIVEN_DENSITY,
} from "@/lib/manifestoConfig"
import HalftoneScene, { halftoneBus } from "./HalftoneScene"

interface ManifestoProps {
  ref?: React.Ref<HTMLElement>
}

/**
 * Secção Manifesto: vídeo em loop coberto por uma trama de pontos, e uma
 * frase única onde a trama pára.
 *
 * O vídeo só reproduz quando visível e o `frameloop` do R3F desliga com ele —
 * descodificar 720p e pedir frames para algo fora do ecrã queima bateria sem
 * nada em troca.
 */
export default function Manifesto({ ref }: ManifestoProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)
  const { reducedMotion, shaderCapable, resolved } = useMotionPrefs()

  // Duas transições de estado por sessão, não por frame: o vídeo entra e sai
  // do ecrã. Nada disto acontece durante o scroll contínuo.
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
  const [active, setActive] = useState(false)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video || !resolved) return

    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData
    const noMotion = reducedMotion || Boolean(saveData)
    setStill(noMotion)
    setVideoEl(video)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setActive(entry.isIntersecting)
          if (noMotion) continue
          if (entry.isIntersecting) {
            // A promessa pode ser rejeitada — políticas de autoplay, separador
            // em segundo plano. Falhar deixa o poster, não um ecrã preto.
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      video.pause()
      // Sem isto o elemento fica a descodificar depois de desmontado.
      video.removeAttribute("src")
      video.load()
    }
  }, [reducedMotion, resolved])

  useGSAP(
    () => {
      const section = sectionRef.current
      const line = lineRef.current
      if (!section || !line || !resolved) return

      // Entrada da frase: máscara por linha, uma vez.
      const split = SplitText.create(line, { type: "lines", mask: "lines" })
      gsap.from(split.lines, {
        yPercent: 110,
        duration: reducedMotion ? 0.15 : 1,
        stagger: reducedMotion ? 0 : 0.08,
        ease: "reveal",
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      })

      if (reducedMotion) return () => split.revert()

      // Ponteiro -> uniforms. Escreve no bus, nunca em estado do React.
      const hasHover = window.matchMedia("(hover: hover)").matches
      const target = { x: -9999, y: -9999, strength: 0 }
      const toX = gsap.quickTo(target, "x", { duration: 0.4, ease: "power3" })
      const toY = gsap.quickTo(target, "y", { duration: 0.4, ease: "power3" })
      const toStrength = gsap.quickTo(target, "strength", { duration: 0.5, ease: "power2.out" })

      const onMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect()
        toX(event.clientX - rect.left)
        // O `gl_FragCoord` tem origem em baixo; o DOM tem-na em cima.
        toY(rect.height - (event.clientY - rect.top))
      }
      const onEnter = () => toStrength(1)
      const onLeave = () => toStrength(0)

      if (hasHover) {
        section.addEventListener("pointermove", onMove, { passive: true })
        section.addEventListener("pointerenter", onEnter, { passive: true })
        section.addEventListener("pointerleave", onLeave, { passive: true })
      }

      const tick = () => {
        halftoneBus.x = target.x
        halftoneBus.y = target.y
        halftoneBus.strength = target.strength
      }
      gsap.ticker.add(tick)

      // Densidade ligada ao scroll: grossa à entrada, fina a meio.
      let trigger: ScrollTrigger | undefined
      if (SCROLL_DRIVEN_DENSITY) {
        trigger = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            // 0 nas pontas, 1 ao centro.
            halftoneBus.progress = 1 - Math.abs(self.progress - 0.5) * 2
          },
        })
      }

      return () => {
        gsap.ticker.remove(tick)
        trigger?.kill()
        section.removeEventListener("pointermove", onMove)
        section.removeEventListener("pointerenter", onEnter)
        section.removeEventListener("pointerleave", onLeave)
        gsap.killTweensOf(target)
        split.revert()
      }
    },
    { scope: sectionRef, dependencies: [resolved, reducedMotion], revertOnUpdate: true },
  )

  return (
    <section
      id="manifesto"
      ref={(node) => {
        sectionRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      className="relative flex min-h-screen w-full items-center overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      <video
        ref={videoRef}
        poster={POSTER}
        // `muted` E `playsInline`: sem os dois o iOS recusa o autoplay e fica
        // um ecrã preto.
        muted
        playsInline
        loop
        /*
          Sem `autoPlay`.

          Com ele o browser arrancava o vídeo por conta própria, à revelia do
          IntersectionObserver — que só age quando cruza o limiar. Resultado:
          com `prefers-reduced-motion` o vídeo reproduzia na mesma. O observer
          é agora a única fonte de verdade sobre quando isto toca.
        */
        preload="none"
        aria-hidden
        className={
          shaderCapable
            ? // Fonte da textura apenas. Fica no DOM mas nunca é visto.
              "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
            : // Sem WebGL: degradação honesta — contraste alto e uma trama em
              // gradiente repetido por cima.
              "absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_contrast(1.9)_brightness(0.8)]"
        }
      >
        <source src={WEBM} type="video/webm" />
        <source src={MP4} type="video/mp4" />
      </video>

      {shaderCapable ? (
        <HalftoneScene video={videoEl} active={active} poster={still ? POSTER : null} />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 0 0, var(--bg-accent) 0 1.2px, transparent 1.2px 100%)",
            backgroundSize: "13px 13px",
            opacity: 0.5,
          }}
        />
      )}

      {/*
        A frase.

        `difference` com branco, e não `multiply` com a cor do fundo. O
        multiply pintava o texto de preto sobre um campo já escuro com pontos
        esparsos — o buraco não tinha trama suficiente para se ler.

        A diferença inverte-se sozinha nos dois temas: sobre fundo escuro o
        glifo sai claro, sobre fundo claro sai escuro, e os pontos dentro dele
        aparecem invertidos. Continua a ser a trama a mudar dentro do texto,
        não uma camada opaca por cima dela.
      */}
      <div className={`relative ${SECTION_CONTAINER}`}>
        <p
          ref={lineRef}
          className="max-w-[16ch] text-[clamp(2.2rem,6vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] mix-blend-difference"
          style={{ color: "#ffffff" }}
        >
          {t("manifesto.line")}
        </p>
      </div>
    </section>
  )
}
