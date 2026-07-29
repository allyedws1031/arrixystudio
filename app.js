import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
let supabase=null;
const CACHE_KEY='artrixy-public-cache-v2';
const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fallback={settings:{site_title:'Artrixy Studio',hero_eyebrow:'DESIGN • DESENVOLVIMENTO • ESTRATÉGIA',hero_title:'Artrixy',hero_accent:'studio',hero_description:'Design com propósito, tecnologia com estética e experiências digitais criadas para gerar presença, confiança e resultado.',proof_text:'+20 projetos entregues com criatividade e foco em resultados',services_title:'Soluções criativas para marcas que querem se destacar',services_description:'Design estratégico, tecnologia e criatividade trabalhando juntos.',projects_title:'Projetos selecionados',about_title:'transformo ideias em experiências digitais',about_text:'A Artrixy Studio nasce para unir estética editorial, estratégia e desenvolvimento em projetos digitais que conectam marcas e pessoas.',signature_text:'Artrixy ♡',skills_title:'Tecnologias e habilidades',contact_title:'criatividade estratégica para o seu próximo projeto',contact_description:'Entre em contato pelos canais abaixo.',footer_text:'CRIAR • CONECTAR • TRANSFORMAR',whatsapp_url:'#',resume_url:'#',email:'contato@artrixy.com'},services:[{title:'Design Gráfico',description:'Identidade visual, social media, peças impressas e comunicação visual.',icon:'✒'},{title:'Web Design',description:'Sites modernos, responsivos e focados na melhor experiência.',icon:'▣'},{title:'Desenvolvimento',description:'Soluções web completas com tecnologias modernas.',icon:'</>'},{title:'Projetos Digitais',description:'Sistemas, automações, dashboards e plataformas web.',icon:'🚀'}],projects:[{slug:'barmy-zone',title:'BARMY ZONE',category:'Desenvolvimento',description:'Plataforma para fãs com experiência visual premium.',featured:true,technologies:['HTML','CSS','JavaScript','Supabase'],problem:'Organizar conteúdos e interações.',solution:'Interface responsiva e painel editável.',results:'Navegação clara e gestão simples.'}],statistics:[{value:'+20',label:'Projetos concluídos'},{value:'+10',label:'Clientes satisfeitos'},{value:'100%',label:'Dedicação em cada detalhe'},{value:'∞',label:'Criatividade sem limites'}],technologies:[{name:'HTML'},{name:'CSS'},{name:'JavaScript'},{name:'React'},{name:'Supabase'},{name:'Figma'}],skills:[{name:'Design UI',level:94},{name:'Web Design',level:92}],testimonials:[{client:'Cliente Artrixy',role:'Marca digital',text:'Visual sofisticado, entrega cuidadosa e resultado profissional.'}],experiences:[],social_links:[]};
async function table(name,fb){if(!supabase)return fb;try{const {data,error}=await supabase.from(name).select('*').order('order_index',{ascending:true});return error||!data?.length?fb:data}catch{return fb}}
function renderAll(data){const d=data||fallback,settings=d.settings||fallback.settings,services=d.services||fallback.services,projects=d.projects||fallback.projects,statistics=d.statistics||fallback.statistics,technologies=d.technologies||fallback.technologies,skills=d.skills||fallback.skills,testimonials=d.testimonials||fallback.testimonials,experiences=d.experiences||fallback.experiences,socials=d.social_links||fallback.social_links;renderSettings(settings,socials);renderServices(services);renderProjects(projects);renderStats(statistics);renderTech(technologies);renderSkills(skills);renderTestimonials(testimonials);renderExperiences(experiences);renderDetail(projects);renderFilters(projects);applySeo(settings);document.documentElement.classList.add('content-ready')}
function readCache(){try{const value=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');return value&&value.data?value.data:null}catch{return null}}
function writeCache(data){try{localStorage.setItem(CACHE_KEY,JSON.stringify({savedAt:Date.now(),data}))}catch{}}
async function loadRemote(){if(!supabase)return;try{const [s,services,projects,statistics,technologies,skills,testimonials,experiences,socials]=await Promise.all([supabase.from('site_settings').select('*').eq('id',1).maybeSingle(),table('services',fallback.services),table('projects',fallback.projects),table('statistics',fallback.statistics),table('technologies',fallback.technologies),table('skills',fallback.skills),table('testimonials',fallback.testimonials),table('experiences',fallback.experiences),table('social_links',fallback.social_links)]);const data={settings:s.data||fallback.settings,services,projects,statistics,technologies,skills,testimonials,experiences,social_links:socials};renderAll(data);writeCache(data)}catch(e){console.warn('Conteúdo remoto indisponível; mantendo cache local.',e)}}
async function connectInBackground(){try{const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true}});await loadRemote()}catch(e){console.warn('Supabase não carregou; o site continua com conteúdo local.',e)}}
function setText(id,v){const e=$(id);if(e&&v)e.textContent=v}
function renderSettings(s,socials){setText('#brandName',(s.site_title||'Artrixy').split(' ')[0]);setText('#heroEyebrow',s.hero_eyebrow);setText('#heroTitle',s.hero_title);setText('#heroAccent',s.hero_accent);setText('#heroDescription',s.hero_description);setText('#proofText',s.proof_text);setText('#projectsTitle',s.projects_title);setText('#aboutText',s.about_text);setText('#signatureText',s.signature_text);setText('#skillsTitle',s.skills_title);setText('#contactTitle',s.contact_title);setText('#contactDescription',s.contact_description);setText('#footerBrand',s.site_title);setText('#footerText',s.footer_text);if($('#navWhatsapp'))$('#navWhatsapp').href=s.whatsapp_url||'#';if($('#resumeBtn'))$('#resumeBtn').href=s.resume_url||'#';if($('#contactLinks')){const base=[['WhatsApp',s.whatsapp_url,'pink'],['Email',s.email?`mailto:${s.email}`:'','light'],['Currículo PDF',s.resume_url,'dark']];const all=[...base,...socials.map(x=>[x.name,x.url,'light'])].filter(x=>x[1]&&x[1]!=='#');$('#contactLinks').innerHTML=all.map(x=>`<a class="btn ${x[2]}" href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>`).join('')}}
function renderServices(items){if(!$('#servicesGrid'))return;$('#servicesGrid').innerHTML=items.filter(x=>x.active!==false).map(x=>`<article class="service-card"><div class="service-icon">${esc(x.icon||'✦')}</div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>${x.link_url?`<a href="${esc(x.link_url)}">Saiba mais →</a>`:''}</article>`).join('')}
function projectCard(p){return `<a class="project-card" href="projeto.html?slug=${encodeURIComponent(p.slug||p.id)}"><div class="project-cover ${p.cover?'has-image':''}">${p.cover?`<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy" decoding="async">`:''}<h3>${esc(p.title)}</h3></div><div class="project-content"><small>${esc(p.category||'Projeto')}</small><p>${esc(p.description||'')}</p><div class="tags">${(p.technologies||[]).slice(0,3).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div></a>`}
function renderProjects(items){if($('#featuredProjects'))$('#featuredProjects').innerHTML=items.filter(x=>x.featured&&x.active!==false).slice(0,6).map(projectCard).join('');if($('#portfolioGrid'))$('#portfolioGrid').innerHTML=items.filter(x=>x.active!==false).map(projectCard).join('')}
function renderStats(items){if($('#statsGrid'))$('#statsGrid').innerHTML=items.map(x=>`<div class="stat"><b>${esc(x.value)}</b><p>${esc(x.label)}</p></div>`).join('')}
function renderTech(items){if($('#techGrid'))$('#techGrid').innerHTML=items.map(x=>`<span class="tech">${esc(x.name)}</span>`).join('')}
function renderSkills(items){if($('#skillList'))$('#skillList').innerHTML=items.map(x=>`<div class="skill"><div class="skill-head"><b>${esc(x.name)}</b><span>${Number(x.level||0)}%</span></div><div class="bar"><span style="width:${Math.min(100,Number(x.level||0))}%"></span></div></div>`).join('')}
function renderTestimonials(items){if($('#testimonialGrid'))$('#testimonialGrid').innerHTML=items.map(x=>`<article class="testimonial"><p>“${esc(x.text)}”</p><b>${esc(x.client)}</b><small>${esc(x.role||'')}</small></article>`).join('')}
function renderExperiences(items){const section=$('#experiencias'),list=$('#experienceList');if(!section||!list||!items.length)return;section.classList.remove('hidden-section');list.innerHTML=items.map(x=>`<article class="timeline-item"><div><small>${esc(x.period||'')}</small><h3>${esc(x.company||'')}</h3></div><div><h3>${esc(x.title||'')}</h3><p>${esc(x.description||'')}</p></div></article>`).join('')}
function renderFilters(items){const e=$('#categoryFilters');if(!e)return;const cats=['Todos',...new Set(items.map(x=>x.category).filter(Boolean))];e.innerHTML=cats.map((c,i)=>`<button class="${i?'':'active'}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');e.onclick=ev=>{if(ev.target.tagName!=='BUTTON')return;e.querySelectorAll('button').forEach(b=>b.classList.remove('active'));ev.target.classList.add('active');const cat=ev.target.dataset.cat,filtered=cat==='Todos'?items:items.filter(x=>x.category===cat);$('#portfolioGrid').innerHTML=filtered.map(projectCard).join('');$('#emptyProjects')?.classList.toggle('hidden',!!filtered.length)}}
function renderDetail(items){const el=$('#projectDetail');if(!el)return;const slug=new URLSearchParams(location.search).get('slug'),p=items.find(x=>String(x.slug||x.id)===slug)||items[0];if(!p){el.innerHTML='<section class="section page-hero"><h1>Projeto não encontrado</h1></section>';return}document.title=`${p.title} — Artrixy Studio`;const gallery=(p.gallery||[]).filter(Boolean);el.innerHTML=`<section class="section project-detail-hero"><div class="project-banner">${p.banner||p.cover?`<img src="${esc(p.banner||p.cover)}" alt="${esc(p.title)}">`:''}<div class="project-banner-content"><small>${esc(p.category||'PROJETO')}</small><h1>${esc(p.title)}</h1><p>${esc(p.description||'')}</p></div></div></section><section class="section detail-grid"><div class="detail-box"><small>PROBLEMA</small><p>${esc(p.problem||'Conteúdo editável no painel.')}</p></div><div class="detail-box"><small>SOLUÇÃO</small><p>${esc(p.solution||'Conteúdo editável no painel.')}</p></div><div class="detail-box"><small>RESULTADOS</small><p>${esc(p.results||'Conteúdo editável no painel.')}</p></div><div class="detail-box"><small>TECNOLOGIAS</small><div class="tags">${(p.technologies||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div></section>${gallery.length?`<section class="section"><small>GALERIA / MOCKUPS</small><div class="gallery">${gallery.map(x=>`<img src="${esc(x)}" loading="lazy" decoding="async" alt="Galeria ${esc(p.title)}">`).join('')}</div></section>`:''}${p.project_url?`<section class="section"><a class="btn pink" href="${esc(p.project_url)}" target="_blank" rel="noopener">Visitar projeto ↗</a></section>`:''}`}
function applySeo(s){if(s.seo_title)document.title=s.seo_title;const d=document.querySelector('meta[name=description]');if(d&&s.seo_description)d.content=s.seo_description;if(s.primary_color)document.documentElement.style.setProperty('--pink',s.primary_color)}
document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('open'));

function withTimeout(promise,ms){return Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))])}
function collectCriticalImages(data){
  const urls=[];
  const projects=data?.projects||[];
  const detailSlug=new URLSearchParams(location.search).get('slug');
  if(document.querySelector('#featuredProjects')) projects.filter(x=>x.featured&&x.active!==false).slice(0,6).forEach(x=>x.cover&&urls.push(x.cover));
  if(document.querySelector('#portfolioGrid')) projects.filter(x=>x.active!==false).forEach(x=>x.cover&&urls.push(x.cover));
  if(document.querySelector('#projectDetail')){
    const project=projects.find(x=>String(x.slug||x.id)===detailSlug)||projects[0];
    if(project){if(project.banner||project.cover)urls.push(project.banner||project.cover);(project.gallery||[]).slice(0,8).forEach(x=>x&&urls.push(x))}
  }
  return [...new Set(urls)].slice(0,18)
}
function preloadImages(urls,maxWait=2200){
  if(!urls.length)return Promise.resolve();
  const jobs=urls.map(url=>new Promise(resolve=>{const img=new Image();img.decoding='async';img.onload=img.onerror=resolve;img.src=url}));
  return Promise.race([Promise.allSettled(jobs),new Promise(resolve=>setTimeout(resolve,maxWait))])
}
function revealSite(){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.documentElement.classList.remove('site-loading');
    document.documentElement.classList.add('site-ready');
    document.querySelector('#siteLoader')?.setAttribute('aria-hidden','true');
  }))
}
async function fetchRemoteData(){
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
  supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true}});
  const [s,services,projects,statistics,technologies,skills,testimonials,experiences,socials]=await Promise.all([
    supabase.from('site_settings').select('*').eq('id',1).maybeSingle(),table('services',fallback.services),table('projects',fallback.projects),table('statistics',fallback.statistics),table('technologies',fallback.technologies),table('skills',fallback.skills),table('testimonials',fallback.testimonials),table('experiences',fallback.experiences),table('social_links',fallback.social_links)
  ]);
  return {settings:s.data||fallback.settings,services,projects,statistics,technologies,skills,testimonials,experiences,social_links:socials}
}
async function bootstrap(){
  const cached=readCache();
  let data=cached||fallback;
  try{
    data=await withTimeout(fetchRemoteData(),2600);
    writeCache(data);
  }catch(e){
    console.warn('Usando conteúdo local para manter o carregamento sincronizado.',e);
    // Atualiza apenas o cache em segundo plano, sem redesenhar partes da página nesta visita.
    setTimeout(async()=>{try{const fresh=await fetchRemoteData();writeCache(fresh)}catch{}},1200)
  }
  renderAll(data);
  await preloadImages(collectCriticalImages(data));
  if(document.fonts?.ready){try{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,900))])}catch{}}
  revealSite();
}
bootstrap().catch(()=>{renderAll(readCache()||fallback);revealSite()});
