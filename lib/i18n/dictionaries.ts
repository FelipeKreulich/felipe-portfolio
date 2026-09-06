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
    // Metadados da rota (servidos, indexáveis)
    'meta.title': 'Felipe Kreulich — Full Stack Developer',
    'meta.description': 'Cybersecurity, cloud and DevOps, fullstack and embedded systems. Portfolio of Felipe Kreulich, based in Lisboa, Portugal.',

    // Hero
    // TODO: copy — placeholders ate o texto final chegar.
    'hero.eyebrow': 'Available for work — Lisboa, Portugal',
    'hero.headline': 'I build what does not exist yet',
    'hero.sub': 'Cybersecurity, cloud and DevOps, fullstack and embedded systems. I work where software meets metal and where technical decisions still have consequences.',
    'hero.cta_work': 'See work',
    'hero.cta_contact': 'Get in touch',

    // Header
    'portfolio.year': 'PORTFOLIO / 2025',
    'intro.title': 'Felipe',
    'intro.subtitle': 'Kreulich',
    'intro.description': 'Full Stack Developer crafting digital experiences at the intersection of',
    'intro.design': 'design',
    'intro.technology': 'technology',
    'intro.and': 'and',
    'intro.human_behavior': 'human behavior',
    'intro.available': 'Available for work',
    'intro.location': 'Lisboa, Portugal',
    'intro.cv_download': 'Download CV',
    'intro.currently': 'CURRENTLY',
    'intro.role': 'Full Stack Developer',
    'intro.company': '@ POP Tecnologia e Mobilidade',
    'intro.period': '2025 — Present',
    'intro.focus': 'FOCUS',
    
    // Work Section
    'work.title': 'Career',
    'work.period': '2021 — Present',
    'work.stack': 'Stack',
    'work.context': 'Context',
    'work.army.role': 'IT Technician / Developer',
    'work.army.company': '9th Army Police Battalion – STIC',
    'work.army.description': 'The materiel checkout ledger stopped being paper: the internal system I built could answer, at any moment, what was on loan and to whom. I also monitored network vulnerabilities and administered the battalion network.',
    'work.cstc.role': 'Fullstack Developer',
    'work.cstc.company': 'CSTC Consulting',
    'work.cstc.description': 'School management software now running in more than 30 schools across Portugal — it replaced the teaching platform where one existed, and became the first where none did. I also contributed to PeopleRH, a human resources platform.',
    'work.pop.role': 'Fullstack Developer',
    'work.pop.company': 'POP Tecnologia e Mobilidade',
    'work.pop.description': 'Ride-hailing application. I lead a team of three developers and own the technical decisions on the project — backend, frontend, iOS, Android, DevOps, cloud and security, plus code reviews.',
    'work.az.role': 'Support Analyst',
    'work.az.company': 'AZ Tecnologia e Gestão',
    'work.az.description': 'Support on the public-tender software used by several Brazilian states. For the support team itself I built an internal tool that pulled into one place the information that until then lived scattered across several.',
    
    // Projects Section
    'projects.description': 'A selection of my recent work and personal projects.',
    'projects.portfolio.title': 'Portfolio Website',
    'projects.portfolio.description': 'Modern portfolio built with Next.js, TypeScript, and Tailwind CSS. Features dark/light theme, multilingual support, and responsive design.',
    'projects.portfolio.tech': 'Next.js, TypeScript, Tailwind CSS',
    'projects.portfolio.link': 'View Project',
    'projects.wormhole.title': 'Worm Hole',
    'projects.wormhole.description': 'Private file sharing SaaS with CI/CD, Cron jobs, encryption, and unique links with auto-expiry.',
    'projects.wormhole.tech': 'Next.js, TypeScript, Tailwind CSS, Prisma, NeonDB, Vercel',
    'projects.wormhole.link': 'View Project',
    'projects.blog.title': 'Personal Blog',
    'projects.blog.description': 'Active blog built with React + Prisma + PostgreSQL.',
    'projects.blog.tech': 'React, TypeScript, Prisma, PostgreSQL',
    'projects.blog.link': 'View Project',
    'projects.ciphermesh.title': 'CipherMesh',
    'projects.ciphermesh.description': 'E2EE LAN chat with blind-relay WebSocket, Curve25519 + XSalsa20-Poly1305, Double Ratchet, PFS, P2P via mDNS, and Terminal UI.',
    'projects.ciphermesh.tech': 'WebSocket, Curve25519, XSalsa20-Poly1305, mDNS, Terminal UI',
    'projects.ciphermesh.link': 'View Project',
    'projects.technologies': 'Technologies',
    
    // Services Section
    'services.title': 'Services',
    'services.description': 'How I can help bring your ideas to life.',
    'services.development.title': 'Web Development',
    'services.development.description': 'Full-stack web applications with modern technologies and best practices.',
    'services.development.features': 'React & Next.js, TypeScript, Node.js, Database Design, API Development',
    'services.design.title': 'UI/UX Design',
    'services.design.description': 'User-centered design solutions that combine aesthetics with functionality.',
    'services.design.features': 'User Interface Design, User Experience, Prototyping, Design Systems, Responsive Design',
    'services.maintenance.title': 'Maintenance & Support',
    'services.maintenance.description': 'Ongoing support and maintenance to keep your applications running smoothly.',
    'services.maintenance.features': 'Bug Fixes, Performance Optimization, Security Updates, Feature Updates, Technical Support',
    'services.consulting.title': 'Technical Consulting',
    'services.consulting.description': 'Strategic guidance on technology decisions and project architecture.',
    'services.consulting.features': 'Code Review, Architecture Planning',
    'services.contact.title': 'Ready to Start Your Project?',
    'services.contact.description': 'Whether you need a quote or just want to discuss your ideas, I\'m here to help.',
    'services.contact.quote_button': 'Request Quote',
    'services.contact.question_button': 'Ask a Question',
    'services.contact.quote_subject': 'Project Quote Request',
    'services.contact.question_subject': 'General Question',
    'nav.services': 'Services',
    
    // Blog Section
    'blog.badge': 'Now Available',
    'blog.title': 'Explore My Blog',
    'blog.description': 'Dive into articles about technology, development, and insights from my journey as a developer.',
    'blog.cta': 'Visit Blog',
    'blog.subtitle': 'New articles every week',
    'blog.topic1.title': 'Web Development',
    'blog.topic1.description': 'Modern techniques, frameworks, and best practices for building amazing web applications.',
    'blog.topic2.title': 'Career & Growth',
    'blog.topic2.description': 'Tips, experiences, and lessons learned throughout my journey as a developer.',
    'blog.topic3.title': 'Technology & AI',
    'blog.topic3.description': 'Exploring the latest in technology, artificial intelligence, and their impact on development.',
    'blog.footer_text': 'Join me on this journey of continuous learning and discovery.',
    'blog.footer_cta': 'Read all articles',

    // Thoughts Section (kept for backwards compatibility)
    'thoughts.title': 'Recent Thoughts',
    'thoughts.future.title': 'The Future of Web Development',
    'thoughts.future.excerpt': 'Exploring how AI and automation are reshaping the way we build for the web.',
    'thoughts.design.title': 'Design Systems at Scale',
    'thoughts.design.excerpt': 'Lessons learned from building and maintaining design systems across multiple products.',
    'thoughts.performance.title': 'Performance-First Development',
    'thoughts.performance.excerpt': 'Why performance should be a first-class citizen in your development workflow.',
    'thoughts.code_review.title': 'The Art of Code Review',
    'thoughts.code_review.excerpt': 'Building better software through thoughtful and constructive code reviews.',
    'thoughts.read_more': 'Read more',
    'thoughts.feature_coming_soon': 'This feature is still being added. Coming soon!',
    
    // Calendar Section
    'calendar.title': 'Schedule a Meeting',
    'calendar.description': "Let's talk about your project and how I can help!",

    // Buy Me a Coffee Section
    'coffee.title': 'Support My Work',
    'coffee.subtitle': 'Enjoying my content?',
    'coffee.description': 'If you find my work valuable and want to support what I do, consider buying me a coffee! Your support helps me continue creating content, open-source projects, and sharing knowledge with the community.',
    'coffee.cta': 'Buy Me a Coffee',
    'coffee.badge': 'Every coffee counts!',
    'coffee.feature1': 'Support open-source',
    'coffee.feature2': 'Fund new projects',
    'coffee.feature3': 'Community driven',
    'coffee.thanks': 'Thank you for your support!',

    // Connect Section
    'connect.title': "Let's Connect",
    'connect.description': 'Always interested in new opportunities, collaborations, and conversations about technology and design.',
    'connect.email': 'contato.felipe.kreulich@gmail.com',
    'connect.elsewhere': 'ELSEWHERE',
    
    // About Section — o prefixo `about.` daqui era da secção de oito ecrãs,
    // apagada em "feat: três secções novas, oito antigas apagadas"; as
    // chaves ficaram órfãs no dicionário sem nenhum componente a lê-las.
    // Removidas para dar lugar às novas, mais abaixo — mantê-las dava
    // `about.title` duplicado no mesmo objeto, erro duro do TypeScript.

    // Footer
    'footer.copyright': '© 2025 Felipe Kreulich. All rights reserved.',
    'footer.built_with': 'Built with ❤️ by Felipe Kreulich',
    'footer.blog': 'Visit my blog',
    
    // Navigation
    'nav.intro': 'Intro',
    'nav.work': 'Work',
    'nav.projects': 'Projects',
    'nav.thoughts': 'Blog',
    'nav.calendar': 'Calendar',
    'nav.connect': 'Connect',
    'nav.about': 'About',
    'nav.manifesto': 'Manifesto',
    'nav.transition': 'Interlude',
    'nav.pulse': 'Pulse',

    // Manifesto — PROPOSTA, muda à vontade.
    'manifesto.line': 'An interface disappears when it works.',
    'nav.coffee': 'Coffee',
    
    // Secção de transição (ScrollExpand)
    'transition.hint': 'Keep scrolling',
    'transition.phrase': 'Design is deciding what to leave out.',
    'transition.title': 'What is felt before what is seen',
    'transition.body': 'Good experience goes unnoticed. Its absence never does — the button that never answers, the text that resists being read, the wait with no explanation. What I work on lives between those moments: rhythm, contrast, the time it takes to respond.',
    'transition.alt': 'Person seated on the floor against a wall of circuit boards, lit by magenta and blue neon.',

    // Índice de projetos (Fase 9)
    'projects.index.eyebrow': 'SELECTED WORK',
    'projects.index.title': 'Projects',
    'projects.status.live': 'LIVE',
    'projects.status.archived': 'ARCHIVED',
    'projects.status.private': 'PRIVATE',

    'projects.ciphermesh.summary': 'End-to-end encrypted terminal chat',
    'projects.ciphermesh.outcome': 'The relay forwards messages it cannot read. Key exchange is X25519 paired with ML-KEM-768, so traffic captured today does not open to a quantum computer later. Sealed sender hides who is talking to whom, and every envelope is padded to the same 128 bytes so length reveals nothing.',
    'projects.ciphermesh.metric': 'v2.14.1 on npm · 743 tests',
    'projects.ciphermesh.alt': 'CipherMesh landing page, dark, with the headline “The server can’t read a single word.”',

    'projects.wormhole.summary': 'Encrypted file sharing, no account',
    'projects.wormhole.outcome': 'Files are encrypted in the browser before they leave the device, so the server stores something it cannot open. Each upload returns one unique link that expires on its own after seven days — nothing to remember, nothing to revoke.',
    'projects.wormhole.metric': '100MB · expires in 7 days',
    'projects.wormhole.alt': 'Worm Hole landing page, dark with a starfield, headline “Share files privately.”',

    'projects.blog.summary': 'Writing on technology and development',
    'projects.blog.outcome': 'A place to write down what I learn while building. Being rebuilt.',
    'projects.blog.alt': 'Kreulich Blog landing page, dark, headline “Sharing knowledge and experiences.”',

    'pulse.phrase': 'Make every pixel pulse',

    // Agendar conversa (Fase 10)
    'schedule.eyebrow': 'SCHEDULE',
    'schedule.phrase': "Tell me what you're building.",
    'schedule.cta': 'Book 30 minutes',
    'schedule.or': 'or write to me at',
    'schedule.tz_lisbon': 'LISBON',
    'schedule.tz_yours': 'YOUR TIME ZONE',
    'schedule.tz_same': 'same time',
    'schedule.modal_title': 'Book 30 minutes',
    'schedule.modal_details': '30 MINUTES · GOOGLE MEET',
    'schedule.modal_close': 'Close',
    'schedule.loading': 'Loading calendar',
    'schedule.fallback': 'The calendar did not load. Open it in a new tab:',
    'schedule.fallback_link': 'Open Calendly',
    'schedule.done_title': 'Booked.',
    'schedule.done_body': 'The invitation is on its way to your inbox, with the meeting link. If it does not arrive, write to me directly.',
    'schedule.done_close': 'Close',

    // Rodapé (Fase 11)
    'footer.elsewhere': 'ELSEWHERE',
    'footer.repos': 'public repos',
    'footer.email_label': 'EMAIL',
    'footer.copy': 'Copy address',
    'footer.copied': 'Address copied',
    'footer.copy_failed': 'Select and copy the address',
    'footer.mailto': 'Open in mail client',
    'footer.external': 'opens in a new window',
    'footer.built': 'Made with ❤️ by FelipeKreulich',
    'footer.top': 'Back to top',

    'footer.settings': 'PREFERENCES',
    'footer.lang_label': 'Language',
    'footer.theme_label': 'Theme',
    'footer.theme_light': 'Light',
    'footer.theme_dark': 'Dark',
    'footer.coffee': 'Buy me a coffee',

    // Not Found Page
    'not_found.title': 'Page Not Found',
    'not_found.subtitle': '404',
    'not_found.description': 'The page you are looking for does not exist or has been moved.',
    'not_found.back_home': 'Back to Home',
    'not_found.or': 'or',
    'not_found.contact': 'contact me',
    'not_found.if_need_help': 'if you need help.',
    
    // Loading
    'loading.text': 'Loading...',

    // --- Redesenho 2026 ---
    'hero.portrait_alt': 'Illustrated portrait of Felipe Kreulich, white hair and glowing eyes',

    'about.title': 'About',
    'about.lead': 'I build scalable, secure and fast systems — from the database to the interface.',
    'about.body': 'I started on the other side of the desk. At AZ Tecnologia e Gestão I supported the public-tender software used by several Brazilian states, and that is where I wrote the first system that mattered: an internal tool that pulled into one place what the team had been hunting for across five. I learned early that a system is judged by whoever has to use it at three in the afternoon on a Tuesday, not by the architecture on the whiteboard.',
    'about.body_2': 'Since then: at the 9th Army Police Battalion I took the materiel ledger off paper and administered the network while monitoring its vulnerabilities; at CSTC I built school management software now running in more than thirty schools across Portugal. At POP Tecnologia e Mobilidade I own the technical decisions on a ride-hailing product — backend, frontend, iOS, Android, cloud and security.',
    'about.background': 'Background in cybersecurity and networking. Based in Lisbon, Portugal.',
    'about.stack_label': 'Stack',
    'about.stack': 'TypeScript · React · Next.js · Python · PHP · Laravel · .NET · Kotlin · Swift · AWS · PostgreSQL',

    'projects.title': 'Projects',
    'contact.title': 'Connect',
    'contact.intro': 'Tell me what you are building.',
    'contact.email': 'contato.felipe.kreulich@gmail.com',
    'contact.copy': 'Copy address',
    'contact.copied': 'Address copied',
    'contact.copy_failed': 'Select and copy the address',
    'contact.external': 'opens in a new window',

    'footer.made_by': 'Made by Felipe Kreulich',
    'footer.language': 'Language',

    // As máximas do anel. O japonês está em lib/kanji.ts; aqui vive só o
    // texto que o leitor de ecrã lê.
    'maxim.build_it_yourself': 'No one is coming. Build it yourself',
    'maxim.design_for_the_fall': 'Every system fails — design for the fall',
    'maxim.discipline': 'Discipline outlives motivation',
    'maxim.silence': 'Silence, then execution',
    'maxim.rebuild': 'Break it, understand it, rebuild it better',
    'maxim.abyss': 'The abyss stares back. Ship anyway',
} as const

/**
 * O `pt` tem de cobrir todas as chaves do `en`. Se faltar uma, o build
 * falha — foi assim que apanhei `meta.title` a existir so em ingles.
 */
const pt: Record<keyof typeof en, string> = {
    // Metadados da rota (servidos, indexáveis)
    'meta.title': 'Felipe Kreulich — Full Stack Developer',
    'meta.description': 'Cibersegurança, cloud e DevOps, fullstack e sistemas embebidos. Portfólio de Felipe Kreulich, em Lisboa, Portugal.',

    // Hero
    // TODO: copy — placeholders ate o texto final chegar. PT-PT.
    'hero.eyebrow': 'Disponível para trabalho — Lisboa, Portugal',
    'hero.headline': 'Construo o que ainda não existe',
    'hero.sub': 'Cibersegurança, cloud e DevOps, fullstack e sistemas embebidos. Trabalho onde o software toca o metal e onde as decisões técnicas ainda têm consequências.',
    'hero.cta_work': 'Ver trabalho',
    'hero.cta_contact': 'Falar comigo',

    'portfolio.year': 'PORTFÓLIO / 2025',
    'intro.title': 'Felipe',
    'intro.subtitle': 'Kreulich',
    'intro.description': 'Full Stack Developer criando experiências digitais na interseção entre',
    'intro.design': 'design',
    'intro.technology': 'tecnologia',
    'intro.and': 'e',
    'intro.human_behavior': 'comportamento humano',
    'intro.available': 'Disponível para trabalho',
    'intro.location': 'Lisboa, Portugal',
    'intro.cv_download': 'Download CV',
    'intro.currently': 'ATUALMENTE',
    'intro.role': 'Full Stack Developer',
    'intro.company': '@ POP Tecnologia e Mobilidade',
    'intro.period': '2025 — Presente',
    'intro.focus': 'FOCO',
    
    // Work Section
    'work.title': 'Percurso',
    'work.period': '2021 — Presente',
    'work.stack': 'Stack',
    'work.context': 'Contexto',
    'work.army.role': 'Técnico de TI / Desenvolvedor',
    'work.army.company': '9.º Batalhão de Polícia do Exército – STIC',
    'work.army.description': 'O livro de cautela de material deixou de ser em papel: o sistema interno que construí passou a responder, a qualquer momento, o que estava cautelado e com quem. Monitorizava também as vulnerabilidades e administrava a rede do batalhão.',
    'work.cstc.role': 'Desenvolvedor Fullstack',
    'work.cstc.company': 'CSTC Consulting',
    'work.cstc.description': 'Software de gestão escolar hoje a correr em mais de 30 escolas em Portugal — substituiu a plataforma de ensino das que já tinham uma, e foi a primeira das que não tinham. Contribuí também para a PeopleRH, plataforma de recursos humanos.',
    'work.pop.role': 'Desenvolvedor Fullstack',
    'work.pop.company': 'POP Tecnologia e Mobilidade',
    'work.pop.description': 'Aplicação de ride-hailing. Lidero uma equipa de três programadores e as decisões técnicas do projeto — backend, frontend, iOS, Android, DevOps, cloud e cibersegurança, mais os code reviews.',
    'work.az.role': 'Analista de Suporte',
    'work.az.company': 'AZ Tecnologia e Gestão',
    'work.az.description': 'Suporte ao software de licitação usado por vários estados do Brasil. Para a própria equipa de suporte, desenvolvi internamente uma ferramenta que juntou num só sítio a informação que até aí andava dispersa por vários.',
    
    // Projects Section
    'projects.description': 'Uma seleção dos meus trabalhos recentes e projetos pessoais.',
    'projects.portfolio.title': 'Website Portfolio',
    'projects.portfolio.description': 'Portfolio moderno construído com Next.js, TypeScript e Tailwind CSS. Inclui tema escuro/claro, suporte multilíngue e design responsivo.',
    'projects.portfolio.tech': 'Next.js, TypeScript, Tailwind CSS',
    'projects.portfolio.link': 'Ver Projeto',
    'projects.wormhole.title': 'Worm Hole',
    'projects.wormhole.description': 'SaaS de partilha de ficheiros privada com CI/CD, Cron jobs, encriptação e links únicos com expiração automática.',
    'projects.wormhole.tech': 'Next.js, TypeScript, Tailwind CSS, Prisma, NeonDB, Vercel',
    'projects.wormhole.link': 'Ver Projeto',
    'projects.blog.title': 'Blog Pessoal',
    'projects.blog.description': 'Blog ativo em React + Prisma + PostgreSQL.',
    'projects.blog.tech': 'React, TypeScript, Prisma, PostgreSQL',
    'projects.blog.link': 'Ver Projeto',
    'projects.ciphermesh.title': 'CipherMesh',
    'projects.ciphermesh.description': 'Chat E2EE para LAN com WebSocket relay cego, Curve25519 + XSalsa20-Poly1305, Double Ratchet, PFS, modo P2P via mDNS e Terminal UI.',
    'projects.ciphermesh.tech': 'WebSocket, Curve25519, XSalsa20-Poly1305, mDNS, Terminal UI',
    'projects.ciphermesh.link': 'Ver Projeto',
    'projects.technologies': 'Tecnologias',
    
    // Services Section
    'services.title': 'Serviços',
    'services.description': 'Como posso ajudar a dar vida às suas ideias.',
    'services.development.title': 'Desenvolvimento Web',
    'services.development.description': 'Aplicações web full-stack com tecnologias modernas e melhores práticas.',
    'services.development.features': 'React & Next.js, TypeScript, Node.js, Design de Base de Dados, Desenvolvimento de APIs',
    'services.design.title': 'Design UI/UX',
    'services.design.description': 'Soluções de design centradas no utilizador que combinam estética com funcionalidade.',
    'services.design.features': 'Design de Interface, Experiência do Utilizador, Prototipagem, Sistemas de Design, Design Responsivo',
    'services.maintenance.title': 'Manutenção e Suporte',
    'services.maintenance.description': 'Suporte contínuo e manutenção para manter as suas aplicações a funcionar perfeitamente.',
    'services.maintenance.features': 'Correção de Bugs, Otimização de Performance, Atualizações de Segurança, Atualizações de Funcionalidades, Suporte Técnico',
    'services.consulting.title': 'Consultoria Técnica',
    'services.consulting.description': 'Orientação estratégica sobre decisões tecnológicas e arquitetura de projetos.',
    'services.consulting.features': 'Revisão de Código, Planeamento de Arquitetura',
    'services.contact.title': 'Pronto para Começar o Seu Projeto?',
    'services.contact.description': 'Seja para solicitar um orçamento ou apenas discutir as suas ideias, estou aqui para ajudar.',
    'services.contact.quote_button': 'Solicitar Orçamento',
    'services.contact.question_button': 'Fazer uma Pergunta',
    'services.contact.quote_subject': 'Solicitação de Orçamento de Projeto',
    'services.contact.question_subject': 'Pergunta Geral',
    'nav.services': 'Serviços',
    
    // Blog Section
    'blog.badge': 'Disponível Agora',
    'blog.title': 'Explore o Meu Blog',
    'blog.description': 'Mergulhe em artigos sobre tecnologia, desenvolvimento e insights da minha jornada como programador.',
    'blog.cta': 'Visitar Blog',
    'blog.subtitle': 'Novos artigos toda semana',
    'blog.topic1.title': 'Desenvolvimento Web',
    'blog.topic1.description': 'Técnicas modernas, frameworks e melhores práticas para construir aplicações web incríveis.',
    'blog.topic2.title': 'Carreira e Crescimento',
    'blog.topic2.description': 'Dicas, experiências e lições aprendidas ao longo da minha jornada como programador.',
    'blog.topic3.title': 'Tecnologia e IA',
    'blog.topic3.description': 'Explorando o mais recente em tecnologia, inteligência artificial e seu impacto no desenvolvimento.',
    'blog.footer_text': 'Junte-se a mim nesta jornada de aprendizado contínuo e descoberta.',
    'blog.footer_cta': 'Ler todos os artigos',

    // Thoughts Section (kept for backwards compatibility)
    'thoughts.title': 'Pensamentos Recentes',
    'thoughts.future.title': 'O Futuro do Desenvolvimento Web',
    'thoughts.future.excerpt': 'Explorando como a IA e automação estão a reformular a forma como construímos para a web.',
    'thoughts.design.title': 'Sistemas de Design em Escala',
    'thoughts.design.excerpt': 'Lições aprendidas ao construir e manter sistemas de design em múltiplos produtos.',
    'thoughts.performance.title': 'Desenvolvimento com Foco na Performance',
    'thoughts.performance.excerpt': 'Por que a performance deve ser um cidadão de primeira classe no seu fluxo de trabalho de desenvolvimento.',
    'thoughts.code_review.title': 'A Arte da Revisão de Código',
    'thoughts.code_review.excerpt': 'Construir software melhor através de revisões de código pensativas e construtivas.',
    'thoughts.read_more': 'Ler mais',
    'thoughts.feature_coming_soon': 'Esta funcionalidade ainda está sendo adicionada. Em breve!',
    
    // Calendar Section
    'calendar.title': 'Agende uma Reunião',
    'calendar.description': 'Vamos conversar sobre seu projeto e como posso ajudar!',

    // Buy Me a Coffee Section
    'coffee.title': 'Apoie o Meu Trabalho',
    'coffee.subtitle': 'Gostando do meu conteúdo?',
    'coffee.description': 'Se acha o meu trabalho valioso e quer apoiar o que faço, considere comprar-me um café! O seu apoio ajuda-me a continuar a criar conteúdo, projetos open-source e a partilhar conhecimento com a comunidade.',
    'coffee.cta': 'Comprar um Café',
    'coffee.badge': 'Cada café conta!',
    'coffee.feature1': 'Apoiar open-source',
    'coffee.feature2': 'Financiar novos projetos',
    'coffee.feature3': 'Impulsionado pela comunidade',
    'coffee.thanks': 'Obrigado pelo seu apoio!',

    // Connect Section
    'connect.title': 'Vamos Conectar',
    'connect.description': 'Sempre interessado em novas oportunidades, colaborações e conversas sobre tecnologia e design.',
    'connect.email': 'contato.felipe.kreulich@gmail.com',
    'connect.elsewhere': 'OUTROS SÍTIOS',
    
    // About Section — ver a nota equivalente no `en`: chaves órfãs, removidas.

    // Footer
    'footer.copyright': '© 2025 Felipe Kreulich. Todos os direitos reservados.',
    'footer.built_with': 'Construído com ❤️ por Felipe Kreulich',
    'footer.blog': 'Visite meu blog',
    
    // Navigation
    'nav.intro': 'Introdução',
    'nav.work': 'Trabalho',
    'nav.projects': 'Projetos',
    'nav.thoughts': 'Blog',
    'nav.calendar': 'Agenda',
    'nav.connect': 'Conectar',
    'nav.about': 'Sobre',
    'nav.manifesto': 'Manifesto',
    'nav.transition': 'Interlúdio',
    'nav.pulse': 'Pulso',

    // Manifesto — PROPOSTA, muda à vontade.
    'manifesto.line': 'A interface desaparece quando funciona.',
    'nav.coffee': 'Café',
    
    // Secção de transição (ScrollExpand)
    'transition.hint': 'Continua a descer',
    'transition.phrase': 'Desenhar é decidir o que fica de fora.',
    'transition.title': 'O que se sente antes do que se vê',
    'transition.body': 'Uma boa experiência não se nota. A falta dela nota-se sempre — o botão que não responde, o texto que se recusa a ser lido, a espera sem explicação. O que trabalho está entre esses momentos: o ritmo, o contraste, o tempo que aquilo demora a responder.',
    'transition.alt': 'Pessoa sentada no chão, encostada a uma parede de placas de circuito, iluminada por néon magenta e azul.',

    // Índice de projetos (Fase 9)
    'projects.index.eyebrow': 'TRABALHO SELECIONADO',
    'projects.index.title': 'Projetos',
    'projects.status.live': 'ATIVO',
    'projects.status.archived': 'ARQUIVADO',
    'projects.status.private': 'PRIVADO',

    'projects.ciphermesh.summary': 'Chat de terminal cifrado ponta a ponta',
    'projects.ciphermesh.outcome': 'O relay encaminha mensagens que não consegue ler. A troca de chaves junta X25519 e ML-KEM-768, para que tráfego capturado hoje não abra a um computador quântico mais tarde. O sealed sender esconde quem fala com quem, e todos os envelopes têm os mesmos 128 bytes — o tamanho não denuncia nada.',
    'projects.ciphermesh.metric': 'v2.14.1 no npm · 743 testes',
    'projects.ciphermesh.alt': 'Página do CipherMesh, escura, com o título “The server can’t read a single word.”',

    'projects.wormhole.summary': 'Partilha de ficheiros cifrada, sem conta',
    'projects.wormhole.outcome': 'Os ficheiros são cifrados no browser antes de saírem do dispositivo, portanto o servidor guarda algo que não consegue abrir. Cada envio devolve um link único que expira sozinho ao fim de sete dias — nada para memorizar, nada para revogar.',
    'projects.wormhole.metric': '100MB · expira em 7 dias',
    'projects.wormhole.alt': 'Página do Worm Hole, escura com um campo de estrelas, título “Share files privately.”',

    'projects.blog.summary': 'Escrita sobre tecnologia e desenvolvimento',
    'projects.blog.outcome': 'Um sítio para escrever o que aprendo enquanto construo. A ser refeito.',
    'projects.blog.alt': 'Página do Kreulich Blog, escura, título “Sharing knowledge and experiences.”',

    'pulse.phrase': 'Faço cada pixel pulsar',

    // Agendar conversa (Fase 10)
    'schedule.eyebrow': 'AGENDAR',
    'schedule.phrase': 'Conta-me o que estás a construir.',
    'schedule.cta': 'Marcar 30 minutos',
    'schedule.or': 'ou escreve-me para',
    'schedule.tz_lisbon': 'LISBOA',
    'schedule.tz_yours': 'O TEU FUSO',
    'schedule.tz_same': 'mesma hora',
    'schedule.modal_title': 'Marcar 30 minutos',
    'schedule.modal_details': '30 MINUTOS · GOOGLE MEET',
    'schedule.modal_close': 'Fechar',
    'schedule.loading': 'A carregar o calendário',
    'schedule.fallback': 'O calendário não carregou. Abre-o num separador novo:',
    'schedule.fallback_link': 'Abrir o Calendly',
    'schedule.done_title': 'Marcado.',
    'schedule.done_body': 'O convite vai a caminho do teu email, com o link da reunião. Se não chegar, escreve-me directamente.',
    'schedule.done_close': 'Fechar',

    // Rodapé (Fase 11)
    'footer.elsewhere': 'ONDE ME ENCONTRAS',
    'footer.repos': 'repositórios públicos',
    'footer.email_label': 'EMAIL',
    'footer.copy': 'Copiar endereço',
    'footer.copied': 'Endereço copiado',
    'footer.copy_failed': 'Selecciona e copia o endereço',
    'footer.mailto': 'Abrir no cliente de email',
    'footer.external': 'abre numa janela nova',
    'footer.built': 'Feito com ❤️ por FelipeKreulich',
    'footer.top': 'Voltar ao topo',

    'footer.settings': 'PREFERÊNCIAS',
    'footer.lang_label': 'Idioma',
    'footer.theme_label': 'Tema',
    'footer.theme_light': 'Claro',
    'footer.theme_dark': 'Escuro',
    'footer.coffee': 'Paga-me um café',

    // Not Found Page
    'not_found.title': 'Página não encontrada',
    'not_found.subtitle': '404',
    'not_found.description': 'A página que você está procurando não existe ou foi movida.',
    'not_found.back_home': 'Voltar ao início',
    'not_found.or': 'ou',
    'not_found.contact': 'entra em contacto',
    'not_found.if_need_help': 'se precisar de ajuda.',
    
    // Loading
    'loading.text': 'Carregando...',

    // --- Redesenho 2026 ---
    'hero.portrait_alt': 'Retrato ilustrado de Felipe Kreulich, cabelo branco e olhos a brilhar',

    'about.title': 'Sobre',
    'about.lead': 'Construo sistemas escaláveis, seguros e rápidos — da base de dados à interface.',
    'about.body': 'Comecei do outro lado do balcão. Na AZ Tecnologia e Gestão dava suporte ao software de concursos públicos usado por vários estados brasileiros, e foi aí que escrevi o primeiro sistema que importou: uma ferramenta interna que juntou num sítio só a informação que a equipa andava a procurar em cinco. Aprendi cedo que um sistema se julga por quem tem de o usar às três da tarde de uma terça-feira, não pela arquitetura no quadro.',
    'about.body_2': 'Desde então: no 9.º Batalhão de Polícia do Exército tirei do papel o registo de material e administrei a rede enquanto lhe vigiava as vulnerabilidades; na CSTC construí software de gestão escolar que corre hoje em mais de trinta escolas em Portugal. Na POP Tecnologia e Mobilidade sou responsável pelas decisões técnicas de uma aplicação de mobilidade — backend, frontend, iOS, Android, cloud e segurança.',
    'about.background': 'Background em cibersegurança e redes. Lisboa, Portugal.',
    'about.stack_label': 'Stack',
    'about.stack': 'TypeScript · React · Next.js · Python · PHP · Laravel · .NET · Kotlin · Swift · AWS · PostgreSQL',

    'projects.title': 'Projetos',
    'contact.title': 'Ligações',
    'contact.intro': 'Conta-me o que estás a construir.',
    'contact.email': 'contato.felipe.kreulich@gmail.com',
    'contact.copy': 'Copiar endereço',
    'contact.copied': 'Endereço copiado',
    'contact.copy_failed': 'Seleciona e copia o endereço',
    'contact.external': 'abre numa janela nova',

    'footer.made_by': 'Feito por Felipe Kreulich',
    'footer.language': 'Idioma',

    'maxim.build_it_yourself': 'Ninguém vem. Constrói tu',
    'maxim.design_for_the_fall': 'Todos os sistemas falham — desenha para a queda',
    'maxim.discipline': 'A disciplina dura mais do que a motivação',
    'maxim.silence': 'Silêncio, e depois execução',
    'maxim.rebuild': 'Parte, percebe, reconstrói melhor',
    'maxim.abyss': 'O abismo devolve o olhar. Publica na mesma',
}

export const dictionaries = { en, pt } as const

export type Dictionary = (typeof dictionaries)[Locale]
export type TranslationKey = keyof Dictionary
