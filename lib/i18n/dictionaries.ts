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
    'intro.bio': 'I build scalable, secure and fast systems, from the database to the interface. At POP Tecnologia e Mobilidade I lead the technical decisions on a ride-hailing product: web, iOS, Android, cloud and security. Background in cybersecurity and networking.',
    'intro.available': 'Open to new projects',
    'intro.cv': 'Download CV',
    'intro.email': 'Send an email',
    'intro.portrait_alt': 'Felipe Kreulich at his desk, in a dark blazer, with code on the monitors behind him',

    // Trabalho
    'work.experience': 'Experience',
    'work.projects': 'Projects',
    'work.stack': 'Stack',
    'work.stack_list': 'TypeScript, React, Next.js, Node.js, PHP, Laravel, .NET, SwiftUI, Python, PostgreSQL, MySQL, AWS',
    'work.now': 'now',

    'work.pop.role': 'Fullstack Developer',
    'work.pop.company': 'POP Tecnologia e Mobilidade',
    'work.pop.description': 'Ride-hailing application. I lead a team of three developers and own the technical decisions on the project — backend, frontend, iOS, Android, DevOps, cloud and security, plus code reviews.',
    'work.az.role': 'Support Analyst',
    'work.az.company': 'AZ Tecnologia e Gestão',
    'work.az.description': 'Support on the public-tender software used by several Brazilian states. For the support team itself I built an internal tool that pulled into one place the information that until then lived scattered across several.',
    'work.cstc.role': 'Fullstack Developer',
    'work.cstc.company': 'CSTC Consulting',
    'work.cstc.description': 'School management software now running in more than 30 schools across Portugal — it replaced the teaching platform where one existed, and became the first where none did. I also contributed to PeopleRH, a human resources platform.',
    'work.army.role': 'IT Technician / Developer',
    'work.army.company': '9th Army Police Battalion – STIC',
    'work.army.description': 'The materiel checkout ledger stopped being paper: the internal system I built could answer, at any moment, what was on loan and to whom. I also monitored network vulnerabilities and administered the battalion network.',

    'projects.ciphermesh.summary': 'End-to-end encrypted terminal chat. The relay forwards messages it cannot read.',
    'projects.wormhole.summary': 'Encrypted file sharing with no account. Links expire on their own after seven days.',
    'projects.blog.summary': 'Writing on technology and what I learn while building.',

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
    'intro.bio': 'Construo sistemas escaláveis, seguros e rápidos, da base de dados à interface. Na POP Tecnologia e Mobilidade sou responsável pelas decisões técnicas de uma aplicação de mobilidade: web, iOS, Android, cloud e segurança. Background em cibersegurança e redes.',
    'intro.available': 'Disponível para novos projetos',
    'intro.cv': 'Descarregar CV',
    'intro.email': 'Enviar email',
    'intro.portrait_alt': 'Felipe Kreulich à secretária, de blazer escuro, com código nos monitores atrás',

    'work.experience': 'Percurso',
    'work.projects': 'Projetos',
    'work.stack': 'Stack',
    'work.stack_list': 'TypeScript, React, Next.js, Node.js, PHP, Laravel, .NET, SwiftUI, Python, PostgreSQL, MySQL, AWS',
    'work.now': 'hoje',

    'work.pop.role': 'Desenvolvedor Fullstack',
    'work.pop.company': 'POP Tecnologia e Mobilidade',
    'work.pop.description': 'Aplicação de ride-hailing. Lidero uma equipa de três programadores e as decisões técnicas do projeto — backend, frontend, iOS, Android, DevOps, cloud e cibersegurança, mais os code reviews.',
    'work.az.role': 'Analista de Suporte',
    'work.az.company': 'AZ Tecnologia e Gestão',
    'work.az.description': 'Suporte ao software de licitação usado por vários estados do Brasil. Para a própria equipa de suporte, desenvolvi internamente uma ferramenta que juntou num só sítio a informação que até aí andava dispersa por vários.',
    'work.cstc.role': 'Desenvolvedor Fullstack',
    'work.cstc.company': 'CSTC Consulting',
    'work.cstc.description': 'Software de gestão escolar hoje a correr em mais de 30 escolas em Portugal — substituiu a plataforma de ensino das que já tinham uma, e foi a primeira das que não tinham. Contribuí também para a PeopleRH, plataforma de recursos humanos.',
    'work.army.role': 'Técnico de TI / Desenvolvedor',
    'work.army.company': '9.º Batalhão de Polícia do Exército – STIC',
    'work.army.description': 'O livro de cautela de material deixou de ser em papel: o sistema interno que construí passou a responder, a qualquer momento, o que estava cautelado e com quem. Monitorizava também as vulnerabilidades e administrava a rede do batalhão.',

    'projects.ciphermesh.summary': 'Chat de terminal cifrado ponta a ponta. O relay encaminha mensagens que não consegue ler.',
    'projects.wormhole.summary': 'Partilha de ficheiros cifrada, sem conta. Os links expiram sozinhos ao fim de sete dias.',
    'projects.blog.summary': 'Escrita sobre tecnologia e o que aprendo enquanto construo.',

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
