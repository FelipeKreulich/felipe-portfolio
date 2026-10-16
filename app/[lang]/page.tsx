import Intro from "@/components/Intro"
import Work from "@/components/Work"
import Footer from "@/components/Footer"

/** Duas secções e o rodapé. Mais nada. */
export default function Home() {
  return (
    <>
      <main>
        <Intro />
        <Work />
      </main>
      <Footer />
    </>
  )
}
