export const demoData = {
  settings: {
    site_title: 'Artrixy Studio', hero_description: 'Design com propósito, tecnologia com estética e experiências digitais criadas para gerar presença, confiança e resultado.',
    about_text: 'A Artrixy Studio nasce para unir estética editorial, estratégia e desenvolvimento em projetos digitais que conectam marcas e pessoas.',
    whatsapp_url: 'https://wa.me/5500000000000', resume_url: '#', github_url: '#', linkedin_url: '#', instagram_url: '#', email: 'contato@artrixy.com'
  },
  services: [
    {id:1,title:'Design Gráfico',description:'Identidade visual, social media, peças impressas e comunicação visual.',icon:'✒'},
    {id:2,title:'Web Design',description:'Sites modernos, responsivos e focados na melhor experiência do usuário.',icon:'▣'},
    {id:3,title:'Desenvolvimento',description:'Soluções web completas com tecnologias modernas e escaláveis.',icon:'</>'},
    {id:4,title:'Projetos Digitais',description:'Sistemas personalizados, automações, dashboards e plataformas web.',icon:'🚀'}
  ],
  categories:[{id:1,name:'Todos'},{id:2,name:'Web Design'},{id:3,name:'Desenvolvimento'},{id:4,name:'Identidade Visual'}],
  projects:[
    {id:1,slug:'barmy-zone',title:'BARMY ZONE',category:'Desenvolvimento',description:'Plataforma para fãs com experiência visual premium.',cover:'',featured:true,technologies:['HTML','CSS','JavaScript','Supabase'],problem:'Organizar conteúdos e interações de fãs em uma experiência moderna.',solution:'Interface responsiva, cards dinâmicos e estrutura com painel editável.',results:'Projeto com navegação clara, identidade forte e gestão simples.'},
    {id:2,slug:'atrix-nails',title:'Atrix Nails',category:'Web Design',description:'Sistema de agendamento online com estética delicada.',cover:'',featured:true,technologies:['React','Tailwind','Supabase'],problem:'Agendamentos manuais e pouca presença digital.',solution:'Landing page com fluxo visual de serviços e contato.',results:'Mais clareza para clientes e apresentação profissional.'},
    {id:3,slug:'studio-dashboard',title:'Studio Dashboard',category:'Dashboard',description:'Painel administrativo completo para edição de conteúdo.',cover:'',featured:true,technologies:['Supabase','JavaScript'],problem:'Necessidade de editar site sem mexer no código.',solution:'CRUD de projetos, textos, links e configurações.',results:'Autonomia total no gerenciamento do portfólio.'},
    {id:4,slug:'landing-pages',title:'Landing Pages',category:'Web Design',description:'Coleção de páginas criativas e modernas.',cover:'',featured:true,technologies:['HTML','CSS','JS'],problem:'Marcas precisavam vender ideias com impacto visual.',solution:'Páginas editoriais com copy e estética premium.',results:'Apresentações digitais mais fortes e memoráveis.'}
  ],
  stats:[{label:'Projetos concluídos',value:'+20'},{label:'Clientes satisfeitos',value:'+10'},{label:'Dedicação em cada detalhe',value:'100%'},{label:'Criatividade sem limites',value:'∞'}],
  technologies:['HTML','CSS','JavaScript','TypeScript','React','Tailwind','PHP','Supabase','Figma','Photoshop','Illustrator','Git','GitHub','VS Code'],
  skills:[];,
  testimonials:[{client:'Cliente Artrixy',text:'Visual sofisticado, entrega cuidadosa e resultado profissional.',role:'Marca digital'},{client:'Projeto Studio',text:'O painel facilitou a edição e deixou tudo mais organizado.',role:'Dashboard'},{client:'Landing Page',text:'A estética ficou premium e muito alinhada com a marca.',role:'Web Design'}]
};;

export const fallbackProjects = demoData.projects;
