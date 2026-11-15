/**
 * Dicionários de tradução.
 *
 * Vivem num módulo e não dentro do componente de propósito: assim o servidor
 * também os consegue importar, e o conteúdo de cada idioma é renderizado no
 * HTML em vez de depender de JavaScript no cliente. Sem isto, um crawler vê
 * uma página vazia.
 */
import type { Locale } from "./config"

const en = {
    'meta.title': 'Felipe Kreulich — Full Stack Developer',
    'meta.description': 'Full stack developer in Lisbon, Portugal, with a background in cybersecurity and networking.',

    // Topo
    'nav.language': 'Language',
    'nav.theme': 'Switch between light and dark theme',
    'nav.city': 'Lisbon',

    // Intro
    'intro.role': 'Full stack developer',
    'intro.bio': 'Full stack developer specialising in backend architecture, APIs and application security. I work with TypeScript, Node.js, Next.js and .NET on PostgreSQL, and with SwiftUI and Kotlin on mobile. Experienced in applied cryptography, including end-to-end encryption and the Double Ratchet protocol, and in infrastructure with Kubernetes and CI/CD. Co-founder of Solvion, a software house based in Portugal, where I lead the architecture of every project.',
    'intro.available': 'Open to new projects',
    'intro.cv': 'Download CV',
    'intro.email': 'Send an email',
    'intro.portrait_alt': 'Felipe Kreulich at his desk, in a dark blazer, with code on the monitors behind him',

    // Trabalho
    'work.experience': 'Experience',
    'work.projects': 'Projects',
    'work.soon': 'Coming soon',
    'work.private': 'Private repository',
    'work.prev': 'Previous',
    'work.next': 'Next',
    'work.stack': 'Stack',
    'work.stack.lang': 'Languages',
    'work.stack.front': 'Frontend',
    'work.stack.back': 'Backend',
    'work.stack.mobile': 'Mobile & desktop',
    'work.stack.data': 'Data',
    'work.stack.infra': 'Infrastructure',
    'work.stack.sec': 'Security & testing',
    'work.now': 'now',

    'work.pop.role': 'Fullstack Developer',
    'work.pop.company': 'POP Tecnologia e Mobilidade',
    'work.pop.description': 'Ride-hailing application. I lead a team of three developers and own the technical decisions on the project — backend, frontend, iOS, Android, DevOps, cloud and security, plus code reviews.',
    'work.az.role': 'Support Analyst',
    'work.az.company': 'AZ Tecnologia e Gestão',
    'work.az.description': 'Support for SIGA, the public administration management system used by several Brazilian states, covering the whole procurement chain, from tenders to contracts. I diagnosed and resolved issues raised by government users and escalated bugs to the development team.',
    'work.cstc.role': 'Fullstack Developer',
    'work.cstc.company': 'CSTC Consulting',
    'work.cstc.description': 'Development of a school management software. I also contributed to PeopleRH, a human resources platform.',
    'work.army.role': 'IT Technician',
    'work.army.company': '9th Army Police Battalion – STIC',
    'work.army.description': 'Technical support in the battalion’s IT section (STIC): administering and troubleshooting the network, maintaining computers and helping staff with day-to-day technical problems.',

    'gallery.ciphermesh': 'End-to-end encrypted terminal chat. The relay forwards messages it cannot read.',
    'gallery.wormhole': 'Encrypted file sharing with no account. Links expire on their own after seven days.',
    'gallery.blog': 'A tech newspaper I write and edit: news worth reading, notes from what I study and essays on the craft of building software. Bilingual, with RSS and a newsletter.',
    'gallery.typehorizon': 'Typing survival game: a black hole pulls you in and only fast, accurate words keep you out.',
    'gallery.tamagotchi': 'A retro virtual pet for the web. Stats keep decaying even with the tab closed, just like the original.',
    'gallery.glasshouse': 'Red team C2 infrastructure and the blue team pipeline that detects it, in one closed lab.',
    'gallery.devileye': 'LAN scanner with a radar UI: discovers devices, fingerprints them and watches traffic per host.',
    'gallery.ewmap': 'Electronic warfare tactical map: simulated emitters, multilateration and jamming detection. RTL-SDR ready.',
    'gallery.phantomip': 'CLI that rotates your IP through Tor or proxies on a set interval, showing the current address live.',
    'gallery.jarvis': 'Voice assistant for Linux: listens, thinks through an LLM, answers aloud and runs commands.',
    'gallery.argus': 'Real-time face detection and recognition with a live feed in the browser.',
    'gallery.zerobit': 'A calm, safe disk cleaner for macOS: shows what takes up space and removes only what is safe to remove.',
    'gallery.logdriver': 'Activity log for ride-hailing drivers and operators: shifts, trips and earnings in one place.',
    'gallery.secretchat': 'The engine behind CipherMesh: terminal chat with libsodium and Double Ratchet, a zero-knowledge relay and a P2P mode.',
    'gallery.venomforge': 'Payload generation on top of msfvenom for Windows, Android and Linux, for authorised testing.',
    'gallery.particle': 'Particles that morph from one shape to another, drawn in real time in the browser.',
    'gallery.orus': 'My NeoVim setup, tuned for a day of TypeScript, Go and Rust.',

    // Rodapé
    'footer.invite': 'Tell me what you are building.',
    'footer.copy': 'Copy address',
    'footer.copied': 'Address copied',
    'footer.copy_failed': 'Select and copy the address',
    'footer.external': 'opens in a new window',
    'contact.email': 'contato.felipe.kreulich@gmail.com',

    // 404
    'not_found.title': 'Page not found',
    'not_found.description': 'The page you are looking for does not exist or has been moved.',
    'not_found.back_home': 'Back to home',
} as const

/**
 * O `pt` tem de cobrir todas as chaves do `en`. Se faltar uma, o build
 * falha — foi assim que apanhei `meta.title` a existir so em ingles.
 */
const pt: Record<keyof typeof en, string> = {
    'meta.title': 'Felipe Kreulich — Full Stack Developer',
    'meta.description': 'Desenvolvedor full stack em Lisboa, Portugal, com background em cibersegurança e redes.',

    'nav.language': 'Idioma',
    'nav.theme': 'Alternar entre tema claro e escuro',
    'nav.city': 'Lisboa',

    'intro.role': 'Desenvolvedor full stack',
    'intro.bio': 'Programador full stack, especializado em arquitetura de backend, APIs e segurança de aplicações. Trabalho com TypeScript, Node.js, Next.js e .NET sobre PostgreSQL, e com SwiftUI e Kotlin no mobile. Tenho experiência em criptografia aplicada, incluindo cifragem ponta a ponta e o protocolo Double Ratchet, e em infraestrutura com Kubernetes e CI/CD. Sou cofundador da Solvion, software house sediada em Portugal, onde lidero a arquitetura de cada projeto.',
    'intro.available': 'Disponível para novos projetos',
    'intro.cv': 'Descarregar CV',
    'intro.email': 'Enviar email',
    'intro.portrait_alt': 'Felipe Kreulich à secretária, de blazer escuro, com código nos monitores atrás',

    'work.experience': 'Percurso',
    'work.projects': 'Projetos',
    'work.soon': 'Em breve',
    'work.private': 'Repositório privado',
    'work.prev': 'Anterior',
    'work.next': 'Seguinte',
    'work.stack': 'Stack',
    'work.stack.lang': 'Linguagens',
    'work.stack.front': 'Frontend',
    'work.stack.back': 'Backend',
    'work.stack.mobile': 'Mobile e desktop',
    'work.stack.data': 'Dados',
    'work.stack.infra': 'Infraestrutura',
    'work.stack.sec': 'Segurança e testes',
    'work.now': 'hoje',

    'work.pop.role': 'Desenvolvedor Fullstack',
    'work.pop.company': 'POP Tecnologia e Mobilidade',
    'work.pop.description': 'Aplicação de ride-hailing. Lidero uma equipa de três programadores e as decisões técnicas do projeto — backend, frontend, iOS, Android, DevOps, cloud e cibersegurança, mais os code reviews.',
    'work.az.role': 'Analista de Suporte',
    'work.az.company': 'AZ Tecnologia e Gestão',
    'work.az.description': 'Suporte ao SIGA, sistema de gestão pública usado por vários estados do Brasil, que cobre toda a cadeia de suprimentos, das licitações aos contratos. Diagnosticava e resolvia os problemas reportados pelos utilizadores dos órgãos públicos e encaminhava os erros para a equipa de desenvolvimento.',
    'work.cstc.role': 'Desenvolvedor Fullstack',
    'work.cstc.company': 'CSTC Consulting',
    'work.cstc.description': 'Desenvolvimento de um software de gestão escolar. Contribuí também para a PeopleRH, plataforma de recursos humanos.',
    'work.army.role': 'Técnico de TI',
    'work.army.company': '9.º Batalhão de Polícia do Exército – STIC',
    'work.army.description': 'Suporte técnico na secção de tecnologia do batalhão (STIC): administração e resolução de problemas na rede, manutenção de computadores e apoio aos militares nas questões técnicas do dia a dia.',

    'gallery.ciphermesh': 'Chat de terminal cifrado ponta a ponta. O relay encaminha mensagens que não consegue ler.',
    'gallery.wormhole': 'Partilha de ficheiros cifrada, sem conta. Os links expiram sozinhos ao fim de sete dias.',
    'gallery.blog': 'Um jornal de tecnologia que escrevo e edito: notícias que valem a leitura, notas do que estudo e ensaios sobre o ofício de construir software. Bilingue, com RSS e newsletter.',
    'gallery.typehorizon': 'Jogo de sobrevivência a escrever: um buraco negro puxa-te e só palavras rápidas e certas te safam.',
    'gallery.tamagotchi': 'Um bichinho virtual retro para a web. Os stats continuam a cair mesmo com a aba fechada, como no original.',
    'gallery.glasshouse': 'Infraestrutura de C2 de red team e o pipeline de blue team que a deteta, num laboratório fechado.',
    'gallery.devileye': 'Scanner de rede local com interface de radar: descobre dispositivos, identifica-os e acompanha o tráfego de cada um.',
    'gallery.ewmap': 'Mapa tático de guerra eletrónica: emissores simulados, multilateração e deteção de jamming. Pronto para RTL-SDR.',
    'gallery.phantomip': 'CLI que roda o teu IP via Tor ou proxies a intervalos definidos, com o endereço atual em tempo real.',
    'gallery.jarvis': 'Assistente de voz para Linux: ouve, pensa através de um LLM, responde em voz alta e executa comandos.',
    'gallery.argus': 'Deteção e reconhecimento facial em tempo real, com o feed ao vivo no browser.',
    'gallery.zerobit': 'Um limpador de disco calmo e seguro para macOS: mostra o que ocupa espaço e só remove o que é seguro remover.',
    'gallery.logdriver': 'Registo de atividade para condutores e operadores TVDE: turnos, viagens e ganhos num só sítio.',
    'gallery.secretchat': 'O motor do CipherMesh: chat de terminal com libsodium e Double Ratchet, relay zero-knowledge e modo P2P.',
    'gallery.venomforge': 'Geração de payloads sobre o msfvenom para Windows, Android e Linux, para testes autorizados.',
    'gallery.particle': 'Partículas que se transformam de uma forma noutra, desenhadas em tempo real no browser.',
    'gallery.orus': 'A minha configuração de NeoVim, afinada para um dia de TypeScript, Go e Rust.',

    'footer.invite': 'Conta-me o que estás a construir.',
    'footer.copy': 'Copiar endereço',
    'footer.copied': 'Endereço copiado',
    'footer.copy_failed': 'Seleciona e copia o endereço',
    'footer.external': 'abre numa janela nova',
    'contact.email': 'contato.felipe.kreulich@gmail.com',

    'not_found.title': 'Página não encontrada',
    'not_found.description': 'A página que procuras não existe ou mudou de sítio.',
    'not_found.back_home': 'Voltar ao início',
}

export const dictionaries = { en, pt } as const

export type Dictionary = (typeof dictionaries)[Locale]
export type TranslationKey = keyof Dictionary
