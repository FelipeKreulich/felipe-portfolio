"use client"

import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { CustomEase } from "gsap/CustomEase"
import { Flip } from "gsap/Flip"

/**
 * Registo central de plugins.
 *
 * Desde a 3.13 o GSAP é gratuito na totalidade, por isso o SplitText e o
 * ScrambleTextPlugin vêm no pacote público — não é preciso registo no Club.
 *
 * Os imports ficam no topo para o bundler os resolver estaticamente; é só a
 * chamada a `registerPlugin` que fica atrás do guard, porque toca em `document`.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, Flip)

  // Eases partilhados, nomeados para as timelines não repetirem números mágicos.
  CustomEase.create("dissolve", "0.76, 0, 0.24, 1")
  CustomEase.create("reveal", "0.16, 1, 0.3, 1")
}

export { gsap, useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, Flip }
