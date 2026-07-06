import { demoData, getTable, getSettings } from './supabase.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const slug = new URLSearchParams(location.search).get('slug');
let projects = [];

async function loadData(){
  const settings = await getSettings();
  const services = await getTable('services', demoData.services);
  const stats = await getTable('statistics', demoData.stats);
  const tech = await getTable('technologies', demoData.technologies.map((name,i)=>({id:i,name})));
  const skills = await getTable('skills', demoData.skills);
  const testimonials = await getTable('testimonials', demoData.testimonials);
  projects = await getTable('projects', demoData.projects);
  hydrateSettings(settings); renderServices(services); renderProjects(projects); renderStats(stats); renderTech(tech); renderSkills(skills); renderTestimonials(testimonials); renderProjectDetail(projects); renderFilters(projects);
}
function hydrateSettings(s){
  if($('#heroDescription')) $('#heroDescription').textContent=s.hero_description||demoData.settings.hero_description;
  if($('#aboutText')) $('#aboutText').textContent=s.about_text||demoData.settings.about_text;
  if($('#navWhatsapp')) $('#navWhatsapp').href=s.whatsapp_url||'#';
  if($('#resumeBtn')) $('#resumeBtn').href=s.resume_url||'#';
  if($('#contactLinks')) $('#contactLinks').innerHTML=`<a class="btn pink" href="${s.whatsapp_url||'#'}" target="_blank">WhatsApp</a><a class="btn light" href="mailto:${s.email||''}">Email</a><a class="btn light" href="${s.github_url||'#'}" target="_blank">GitHub</a><a class="btn light" href="${s.linkedin_url||'#'}" target="_blank">LinkedIn</a><a class="btn light" href="${s.instagram_url||'#'}" target="_blank">Instagram</a><a class="btn dark" href="${s.resume_url||'#'}" target="_blank">Currículo PDF</a>`;
}
function serviceIcon(title){
  const t=(title||'').toLowerCase();
  if(t.includes('gráfico')||t.includes('grafico')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/></svg>';
  if(t.includes('web')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 22h8M12 18v4"/></svg>';
  if(t.includes('desenvol')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/><path d="m14.5 4-5 16"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.05 11A22 22 0 0 1 12 15z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>';
}
function renderServices(items){ const el=$('#servicesGrid'); if(!el)return; el.innerHTML=items.map(i=>`<article class="service-card reveal"><div class="icon-bubble">${serviceIcon(i.title)}</div><h3>${i.title}</h3><p>${i.description}</p><a href="portfolio.html">→</a></article>`).join(''); }
function coverClass(p,i){ const t=(p.title||'').toLowerCase(); if(t.includes('barmy')) return 'dark-cover'; if(t.includes('landing')) return 'landing'; return i%2?'light':''; }
function coverDecor(p){ const t=(p.title||'').toLowerCase(); if(t.includes('nails')) return '<span class="phone"></span><span class="phone" style="right:82px;bottom:20px;transform:rotate(7deg) scale(.86)"></span><span class="flower">✿</span>'; if(t.includes('dashboard')) return '<span class="screen"></span><span class="screen" style="right:28px;bottom:30px;transform:scale(.72)"></span>'; if(t.includes('landing')) return '<span class="screen"></span><span class="phone"></span><span class="flower">✦</span>'; return '<span class="mock"></span><span class="flower">✧</span>'; }
function card(p,i){return `<a class="project-card reveal" href="projeto.html?slug=${p.slug||p.id}"><div class="project-cover ${coverClass(p,i)}" ${p.cover?`style="background-image:linear-gradient(0deg,rgba(0,0,0,.18),rgba(255,220,235,.18)),url('${p.cover}');background-size:cover;background-position:center"`:''}><h3>${p.title}</h3>${coverDecor(p)}</div><div class="project-content"><small>${p.category||'Projeto'}</small><p>${p.description||''}</p><div class="tags">${(p.technologies||[]).slice(0,3).map(t=>`<span class="tag">${t}</span>`).join('')}</div></div></a>`}
function renderProjects(items){ if($('#featuredProjects')) $('#featuredProjects').innerHTML=items.filter(p=>p.featured).slice(0,4).map(card).join(''); if($('#portfolioGrid')) $('#portfolioGrid').innerHTML=items.map(card).join(''); }
function renderStats(items){ const el=$('#statsGrid'); if(!el)return; el.innerHTML=items.map(i=>`<div class="stat"><b>${i.value}</b><p>${i.label}</p></div>`).join(''); }
function renderTech(items){ const el=$('#techGrid'); if(!el)return; el.innerHTML=items.map(i=>`<span class="tech">${i.name||i}</span>`).join(''); }
function renderSkills(items){ const el=$('#skillList'); if(!el)return; el.innerHTML=''; }
function renderTestimonials(items){ const el=$('#testimonialGrid'); if(!el)return; el.innerHTML=items.map(i=>`<article class="testimonial"><p>“${i.text}”</p><b>${i.client}</b><small>${i.role||''}</small></article>`).join(''); }
function renderFilters(items){ const el=$('#categoryFilters'); if(!el)return; const cats=['Todos',...new Set(items.map(p=>p.category).filter(Boolean))]; el.innerHTML=cats.map((c,i)=>`<button class="${i==0?'active':''}" data-cat="${c}">${c}</button>`).join(''); el.onclick=e=>{if(e.target.tagName!=='BUTTON')return; $$('#categoryFilters button').forEach(b=>b.classList.remove('active')); e.target.classList.add('active'); const cat=e.target.dataset.cat; $('#portfolioGrid').innerHTML=(cat==='Todos'?items:items.filter(p=>p.category===cat)).map(card).join('')}; }
function renderProjectDetail(items){ const el=$('#projectDetail'); if(!el)return; const p=items.find(x=>(x.slug||String(x.id))===slug)||items[0]; document.title=`${p.title} — Artrixy Studio`; el.innerHTML=`<section class="section project-detail-hero"><div class="banner" ${p.cover?`style="background-image:linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,.1)),url('${p.cover}');background-size:cover;background-position:center"`:''}><div><small>${p.category}</small><h1>${p.title}</h1><p>${p.description}</p></div></div></section><section class="section detail-grid"><div class="detail-box"><small>PROBLEMA</small><p>${p.problem||'Texto editável no painel.'}</p></div><div class="detail-box"><small>SOLUÇÃO</small><p>${p.solution||'Texto editável no painel.'}</p></div><div class="detail-box"><small>RESULTADOS</small><p>${p.results||'Texto editável no painel.'}</p></div><div class="detail-box"><small>TECNOLOGIAS</small><div class="tags">${(p.technologies||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div></div></section><section class="section"><small>GALERIA / MOCKUPS</small><div class="gallery"><div></div><div></div><div></div></div>${p.project_url?`<p><a class="btn pink" href="${p.project_url}" target="_blank">Visitar projeto ↗</a></p>`:''}</section>`; }
function animateBars(){setTimeout(()=>$$('.bar span').forEach(b=>b.style.width=b.dataset.width),200)}
document.addEventListener('mousemove',e=>{const c=$('.cursor'); if(c){c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'}});
loadData();
