import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY, STORAGE_BUCKET } from './config.js';
const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);const $=s=>document.querySelector(s);let current='dashboard',editing=null;
const IMAGE_TYPES=['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];
const VIDEO_TYPES=['video/mp4','video/webm','video/ogg'];
function safeName(name){return String(name||'arquivo').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9._-]+/g,'-').replace(/-+/g,'-')}
async function uploadMedia(file,folder='projects'){
  if(!file)return '';
  const allowed=[...IMAGE_TYPES,...VIDEO_TYPES];
  if(!allowed.includes(file.type))throw new Error('Formato não permitido: '+file.type);
  const max=file.type.startsWith('video/')?52428800:10485760;
  if(file.size>max)throw new Error(`Arquivo maior que ${file.type.startsWith('video/')?'50 MB':'10 MB'}.`);
  const path=`${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName(file.name)}`;
  const {error}=await supabase.storage.from(STORAGE_BUCKET).upload(path,file,{cacheControl:'31536000',upsert:false,contentType:file.type});
  if(error)throw error;
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
function uploadField(id,label,accept,value=''){
 return `<div class="field upload-field"><label>${label}</label><input id="${id}" type="file" accept="${accept}"><small>Selecione do computador. A URL será preenchida automaticamente após salvar.</small>${value?`<div class="media-preview"><code>${esc(value)}</code></div>`:''}</div>`;
}
function embedUrl(url=''){
 const u=String(url).trim();
 const yt=u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
 if(yt)return `https://www.youtube.com/embed/${yt[1]}`;
 const vm=u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
 if(vm)return `https://player.vimeo.com/video/${vm[1]}`;
 return u;
}

const schemas={services:[['title','Título'],['description','Descrição','textarea'],['icon','Ícone'],['link_url','Link'],['order_index','Ordem','number'],['active','Ativo','checkbox']],statistics:[['value','Valor'],['label','Legenda'],['order_index','Ordem','number']],technologies:[['name','Nome'],['icon','Ícone/URL'],['order_index','Ordem','number']],skills:[['name','Nome'],['level','Nível %','number'],['order_index','Ordem','number']],experiences:[['title','Cargo/título'],['company','Empresa'],['period','Período'],['description','Descrição','textarea'],['order_index','Ordem','number']],testimonials:[['client','Cliente'],['role','Cargo/segmento'],['text','Depoimento','textarea'],['avatar','Avatar URL'],['order_index','Ordem','number']],social_links:[['name','Rede'],['url','URL'],['icon','Ícone'],['order_index','Ordem','number']],clients:[['name','Nome'],['logo','Logo URL'],['url','Site'],['order_index','Ordem','number']]};
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function toast(msg,error=false){const e=$('#toast');e.textContent=msg;e.className='toast show'+(error?' error':'');setTimeout(()=>e.className='toast',2600)}
async function boot(){const {data}=await supabase.auth.getSession();data.session?showAdmin():showLogin()}
function showLogin(){$('#loginPanel').classList.remove('hidden');$('#adminPanel').classList.add('hidden')}
function showAdmin(){$('#loginPanel').classList.add('hidden');$('#adminPanel').classList.remove('hidden');render(current)}
$('#loginBtn').onclick=async()=>{const b=$('#loginBtn');b.disabled=true;$('#loginMsg').textContent='Entrando...';const {error}=await supabase.auth.signInWithPassword({email:$('#loginEmail').value.trim(),password:$('#loginPassword').value});b.disabled=false;if(error){$('#loginMsg').textContent='Erro: '+error.message;return}showAdmin()};$('#logoutBtn').onclick=async()=>{await supabase.auth.signOut();showLogin()};
$('.admin-menu').onclick=e=>{const b=e.target.closest('button[data-tab]');if(!b)return;document.querySelectorAll('.admin-menu button').forEach(x=>x.classList.remove('active'));b.classList.add('active');current=b.dataset.tab;editing=null;render(current);if(innerWidth<900)$('.admin-sidebar').classList.remove('open')};$('.admin-mobile-toggle').onclick=()=>$('.admin-sidebar').classList.toggle('open');
async function count(t){const {count}=await supabase.from(t).select('*',{count:'exact',head:true});return count||0}
async function dashboard(){const vals=await Promise.all(['projects','services','testimonials','contacts'].map(count));$('#adminContent').innerHTML=`<h2>Visão geral</h2><p class="subtitle">Resumo rápido do conteúdo cadastrado.</p><div class="dashboard-grid">${[['Projetos',vals[0]],['Soluções',vals[1]],['Depoimentos',vals[2]],['Mensagens',vals[3]]].map(x=>`<div class="dashboard-card"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('')}</div><div class="admin-section"><h3>Ações rápidas</h3><p>Use o menu para editar textos, imagens, projetos, SEO, redes sociais e demais seções. As alterações públicas aparecem após salvar.</p></div>`}
function field([key,label,type='text'],value=''){if(type==='textarea')return `<div class="field"><label>${label}</label><textarea name="${key}">${esc(value)}</textarea></div>`;if(type==='checkbox')return `<label class="checkbox-row"><input name="${key}" type="checkbox" ${value!==false?'checked':''}> ${label}</label>`;return `<div class="field"><label>${label}</label><input name="${key}" type="${type}" value="${esc(value)}"></div>`}
async function settings(){const {data}=await supabase.from('site_settings').select('*').eq('id',1).maybeSingle();const s=data||{};const groups=[['Identidade e Hero',[['site_title','Nome do site'],['hero_eyebrow','Texto pequeno do Hero'],['hero_title','Título principal'],['hero_accent','Palavra em destaque'],['hero_description','Descrição do Hero','textarea'],['proof_text','Prova social']]],['Seções',[['services_title','Título de soluções'],['services_description','Descrição de soluções','textarea'],['projects_title','Título de projetos'],['about_title','Título Sobre'],['about_text','Texto Sobre','textarea'],['signature_text','Assinatura'],['skills_title','Título de habilidades'],['contact_title','Título do contato'],['contact_description','Descrição do contato','textarea'],['footer_text','Texto do rodapé']]],['Links',[['whatsapp_url','WhatsApp'],['email','Email'],['github_url','GitHub'],['linkedin_url','LinkedIn'],['instagram_url','Instagram']]],['SEO e aparência',[['primary_color','Cor principal'],['seo_title','Título SEO'],['seo_description','Descrição SEO','textarea'],['og_image','Imagem de compartilhamento'],['logo_url','Logo URL'],['favicon_url','Favicon URL']]]];$('#adminContent').innerHTML=`<h2>Site e SEO</h2><p class="subtitle">Edite os textos e configurações gerais sem abrir o código.</p><form id="settingsForm">${groups.map(g=>`<section class="admin-section"><h3>${g[0]}</h3><div class="form-grid">${g[1].map(f=>field(f,s[f[0]])).join('')}</div></section>`).join('')}<button class="btn pink" type="submit">Salvar configurações</button></form>`;$('#settingsForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target),payload={id:1};for(const [k,v] of fd)payload[k]=v;const {error}=await supabase.from('site_settings').upsert(payload);toast(error?error.message:'Configurações salvas',!!error)}}
async function projects(){
 const {data=[],error:listError}=await supabase.from('projects').select('*').order('order_index');
 if(listError){$('#adminContent').innerHTML=`<h2>Projetos</h2><div class="schema-alert"><b>Não foi possível carregar os projetos.</b><p>${esc(listError.message)}</p><p>Execute o arquivo <code>sql/ATUALIZAR_PROJETOS.sql</code> no SQL Editor do Supabase.</p></div>`;return}
 const p=editing||{};
 const categories=[...new Set(data.map(x=>x.category).filter(Boolean))];
 const preview=(url,type='image')=>url?`<div class="project-upload-preview">${type==='video'?`<video src="${esc(url)}" controls preload="metadata"></video>`:`<img src="${esc(url)}" alt="Prévia">`}<small>Arquivo atual</small></div>`:'';
 $('#adminContent').innerHTML=`
 <div class="project-admin-head"><div><h2>Projetos</h2><p class="subtitle">Adicione e edite projetos por etapas. Os campos principais ficam no início.</p></div><button class="btn pink" id="newProjectBtn">+ Novo projeto</button></div>
 <div class="project-admin-grid">
  <form id="projectForm" class="project-editor">
   <section class="project-form-card open"><button type="button" class="project-section-toggle"><span><b>1. Informações principais</b><small>Título, categoria, descrição e exibição</small></span><i>⌃</i></button><div class="project-section-body">
    <div class="form-grid">${field(['title','Título do projeto'],p.title)}${field(['slug','Identificador/slug'],p.slug)}</div>
    <div class="form-grid"><div class="field"><label>Categoria</label><input name="category" list="categoryList" value="${esc(p.category||'')}"><datalist id="categoryList">${categories.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>${field(['project_url','Link para visitar o projeto'],p.project_url)}</div>
    ${field(['description','Resumo curto para o card','textarea'],p.description)}
    <div class="form-grid compact">${field(['order_index','Ordem de exibição','number'],p.order_index||0)}${field(['featured','Exibir em destaque','checkbox'],p.featured)}${field(['active','Projeto visível','checkbox'],p.active)}</div>
   </div></section>

   <section class="project-form-card"><button type="button" class="project-section-toggle"><span><b>2. Capa e banner</b><small>Imagens que aparecem nos cards e na página do projeto</small></span><i>⌄</i></button><div class="project-section-body">
    <div class="media-edit-grid"><div>${field(['cover','URL da capa'],p.cover)}${uploadField('coverFile','Ou enviar capa do computador','image/*',p.cover)}${preview(p.cover)}</div><div>${field(['banner','URL do banner'],p.banner)}${uploadField('bannerFile','Ou enviar banner do computador','image/*',p.banner)}${preview(p.banner)}</div></div>
   </div></section>

   <section class="project-form-card"><button type="button" class="project-section-toggle"><span><b>3. Conteúdo do projeto</b><small>Problema, solução, resultados e tecnologias</small></span><i>⌄</i></button><div class="project-section-body">
    <div class="form-grid">${field(['problem','Problema','textarea'],p.problem)}${field(['solution','Solução','textarea'],p.solution)}</div>${field(['results','Resultados','textarea'],p.results)}
    <div class="field"><label>Tecnologias</label><input name="technologies" value="${esc((p.technologies||[]).join(', '))}" placeholder="React, Supabase, Figma"><small>Separe cada tecnologia por vírgula.</small></div>
   </div></section>

   <section class="project-form-card"><button type="button" class="project-section-toggle"><span><b>4. Galeria e vídeo</b><small>Opcional — imagens adicionais e vídeo demonstrativo</small></span><i>⌄</i></button><div class="project-section-body">
    <div class="field"><label>Galeria atual — uma URL por linha</label><textarea name="gallery">${esc((p.gallery||[]).join('\n'))}</textarea></div>
    <div class="field"><label>Adicionar imagens à galeria</label><input id="galleryFiles" type="file" accept="image/*" multiple><small>Você pode selecionar várias imagens.</small></div>
    <div class="form-grid"><div>${field(['video_url','Link de vídeo (YouTube, Vimeo ou arquivo)'],p.video_url)}${preview(p.video_url,'video')}</div>${uploadField('videoFile','Ou enviar vídeo do computador','video/mp4,video/webm,video/ogg',p.video_url)}</div>
   </div></section>

   <div id="uploadStatus" class="form-message"></div>
   <div class="project-savebar"><button class="btn pink" type="submit">${editing?'Salvar alterações':'Adicionar projeto'}</button>${editing?'<button class="btn light" type="button" id="cancelEdit">Cancelar edição</button>':''}</div>
  </form>

  <aside class="project-list-panel"><div class="project-list-title"><b>Projetos cadastrados</b><span>${data.length}</span></div><div class="project-search"><input id="projectSearch" placeholder="Buscar projeto..."></div><div class="admin-list project-admin-list">${data.map(x=>`<article class="project-admin-item" data-search="${esc(`${x.title} ${x.category}`.toLowerCase())}"><div class="project-admin-thumb">${x.cover||x.banner?`<img src="${esc(x.cover||x.banner)}" alt="">`:'<span>✦</span>'}</div><div class="project-admin-info"><b>${esc(x.title||'Sem título')}</b><small>${esc(x.category||'Sem categoria')}</small><div><span class="status-dot ${x.active===false?'off':''}"></span>${x.active===false?'Oculto':'Visível'} ${x.featured?'• Destaque':''}</div></div><div class="project-admin-actions"><button class="icon-btn edit" data-id="${x.id}" title="Editar">✎</button><button class="icon-btn duplicate" data-id="${x.id}" title="Duplicar">⧉</button><button class="icon-btn danger del" data-id="${x.id}" title="Excluir">×</button></div></article>`).join('')||'<p class="empty-admin">Nenhum projeto cadastrado.</p>'}</div></aside>
 </div>`;

 const titleInput=document.querySelector('[name="title"]'),slugInput=document.querySelector('[name="slug"]');
 titleInput?.addEventListener('input',()=>{if(!editing||!slugInput.dataset.touched)slugInput.value=safeName(titleInput.value).replace(/\.[^.]+$/,'')});
 slugInput?.addEventListener('input',()=>slugInput.dataset.touched='1');
 document.querySelectorAll('.project-section-toggle').forEach(btn=>btn.onclick=()=>{const card=btn.closest('.project-form-card');card.classList.toggle('open');btn.querySelector('i').textContent=card.classList.contains('open')?'⌃':'⌄'});
 $('#newProjectBtn').onclick=()=>{editing=null;projects();setTimeout(()=>document.querySelector('[name="title"]')?.focus(),50)};
 $('#projectSearch').oninput=e=>document.querySelectorAll('.project-admin-item').forEach(el=>el.hidden=!el.dataset.search.includes(e.target.value.toLowerCase().trim()));

 $('#projectForm').onsubmit=async e=>{
  e.preventDefault();const form=e.target,btn=form.querySelector('button[type=submit]'),status=$('#uploadStatus');btn.disabled=true;status.textContent='Salvando projeto...';
  try{
   const fd=new FormData(form),payload={};for(const [k,v] of fd)if(!(v instanceof File))payload[k]=v;
   if(!payload.title.trim())throw new Error('Informe o título do projeto.');
   if(!payload.slug.trim())payload.slug=safeName(payload.title);
   const coverFile=$('#coverFile').files[0],bannerFile=$('#bannerFile').files[0],videoFile=$('#videoFile').files[0],galleryFiles=[...$('#galleryFiles').files];
   if(coverFile){status.textContent='Enviando capa...';payload.cover=await uploadMedia(coverFile,'projects/covers')}
   if(bannerFile){status.textContent='Enviando banner...';payload.banner=await uploadMedia(bannerFile,'projects/banners')}
   if(videoFile){status.textContent='Enviando vídeo...';payload.video_url=await uploadMedia(videoFile,'projects/videos');payload.video_type='upload';payload.media_type='video'}
   else if(payload.video_url){payload.video_url=embedUrl(payload.video_url);payload.video_type=/youtube\.com\/embed|player\.vimeo\.com/.test(payload.video_url)?'embed':'upload';payload.media_type='video'}else{payload.media_type='image'}
   const currentGallery=(payload.gallery||'').split('\n').map(x=>x.trim()).filter(Boolean);for(const f of galleryFiles){status.textContent=`Enviando galeria (${currentGallery.length+1})...`;currentGallery.push(await uploadMedia(f,'projects/gallery'))}
   payload.gallery=currentGallery;payload.technologies=(payload.technologies||'').split(',').map(x=>x.trim()).filter(Boolean);payload.order_index=Number(payload.order_index||0);payload.featured=form.featured.checked;payload.active=form.active.checked;
   if(editing)payload.id=editing.id;
   let {error}=await supabase.from('projects').upsert(payload,{onConflict:'slug'});
   if(error&&/media_type|video_type|video_url.*schema cache/i.test(error.message))throw new Error('O banco ainda não recebeu as novas colunas de mídia. Execute sql/ATUALIZAR_PROJETOS.sql no Supabase e tente novamente.');
   if(error)throw error;
   toast(editing?'Projeto atualizado com sucesso':'Projeto adicionado com sucesso');editing=null;projects();
  }catch(err){toast(err.message||'Erro ao salvar',true);status.textContent=err.message||'Erro ao salvar'}finally{btn.disabled=false}
 };
 $('#cancelEdit')?.addEventListener('click',()=>{editing=null;projects()});
 $('.project-admin-list')?.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const row=data.find(x=>String(x.id)===b.dataset.id);if(b.classList.contains('edit')){editing=row;projects();scrollTo({top:0,behavior:'smooth'})}if(b.classList.contains('duplicate')){const copy={...row,id:undefined,title:`${row.title} — cópia`,slug:`${row.slug}-copia-${Date.now().toString().slice(-4)}`,featured:false};const {error}=await supabase.from('projects').insert(copy);toast(error?error.message:'Projeto duplicado',!!error);if(!error)projects()}if(b.classList.contains('del')&&confirm(`Excluir o projeto "${row.title}"?`)){const {error}=await supabase.from('projects').delete().eq('id',b.dataset.id);toast(error?error.message:'Projeto excluído',!!error);if(!error)projects()}});
}
function item(x,title,sub,img=''){return `<div class="table-item"><div class="table-info">${img?`<img class="table-thumb" src="${esc(img)}">`:''}<div><b>${esc(title||'Sem título')}</b><span>${esc(sub||'')}</span></div></div><div class="table-actions"><button class="btn light small edit" data-id="${x.id}">Editar</button><button class="btn dark small del" data-id="${x.id}">Excluir</button></div></div>`}
function bindList(table,data,reload){$('.admin-list')?.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const row=data.find(x=>String(x.id)===b.dataset.id);if(b.classList.contains('edit')){editing=row;render(current);scrollTo({top:0,behavior:'smooth'})}if(b.classList.contains('del')&&confirm('Excluir este item?')){const {error}=await supabase.from(table).delete().eq('id',b.dataset.id);toast(error?error.message:'Item excluído',!!error);if(!error)reload()}})}
async function generic(table){const schema=schemas[table],{data=[]}=await supabase.from(table).select('*').order('order_index');const p=editing||{};$('#adminContent').innerHTML=`<h2>${table.replace('_',' ')}</h2><p class="subtitle">Adicione, edite, ordene ou exclua itens desta seção.</p><form id="genericForm"><div class="form-grid">${schema.map(f=>field(f,p[f[0]])).join('')}</div><button class="btn pink" type="submit">${editing?'Atualizar':'Adicionar'} item</button>${editing?'<button class="btn light" id="cancelEdit" type="button">Cancelar</button>':''}</form><div class="admin-list">${data.map(x=>item(x,x.title||x.name||x.client||x.value,x.description||x.role||x.label||x.url,x.image||x.avatar||x.logo)).join('')}</div>`;$('#genericForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target),payload={};for(const [k,v] of fd)payload[k]=v;schema.forEach(f=>{if(f[2]==='number')payload[f[0]]=Number(payload[f[0]]||0);if(f[2]==='checkbox')payload[f[0]]=e.target.elements[f[0]].checked});if(editing)payload.id=editing.id;const {error}=await supabase.from(table).upsert(payload);toast(error?error.message:'Item salvo',!!error);if(!error){editing=null;generic(table)}};$('#cancelEdit')?.addEventListener('click',()=>{editing=null;generic(table)});bindList(table,data,()=>generic(table))}
async function contacts(){const {data=[]}=await supabase.from('contacts').select('*').order('created_at',{ascending:false});$('#adminContent').innerHTML=`<h2>Mensagens</h2><p class="subtitle">Contatos recebidos pelo site.</p><div class="admin-list">${data.length?data.map(x=>`<div class="table-item"><div><b>${esc(x.name||'Sem nome')}</b><span>${esc(x.email||'')} • ${new Date(x.created_at).toLocaleString('pt-BR')}</span><p>${esc(x.message||'')}</p></div><button class="btn dark small del" data-id="${x.id}">Excluir</button></div>`).join(''):'<p>Nenhuma mensagem recebida.</p>'}</div>`;bindList('contacts',data,contacts)}
async function media(){
 let files=[]; const {data,error}=await supabase.storage.from(STORAGE_BUCKET).list('',{limit:100,sortBy:{column:'created_at',order:'desc'}}); if(!error)files=data||[];
 $('#adminContent').innerHTML=`<h2>Biblioteca de mídia</h2><p class="subtitle">Envie imagens e vídeos diretamente do computador para o bucket portfolio-media.</p><div class="upload-zone"><input id="mediaFile" type="file" accept="image/*,video/mp4,video/webm,video/ogg" multiple><p>Imagens até 10 MB; vídeos até 50 MB.</p><button class="btn pink" id="uploadBtn">Enviar arquivos</button><div id="mediaStatus" class="form-message"></div></div><div class="media-grid">${files.filter(x=>x.name!=='.emptyFolderPlaceholder').map(x=>{const u=supabase.storage.from(STORAGE_BUCKET).getPublicUrl(x.name).data.publicUrl;const isVideo=/\.(mp4|webm|ogg)$/i.test(x.name);return `<div class="media-item">${isVideo?`<video src="${u}" controls preload="metadata"></video>`:`<img src="${u}" loading="lazy" decoding="async">`}<code>${esc(u)}</code><button class="btn light small copy" data-url="${u}">Copiar URL</button><button class="btn dark small media-del" data-name="${esc(x.name)}">Excluir</button></div>`}).join('')}</div>`;
 $('#uploadBtn').onclick=async()=>{const fs=[...$('#mediaFile').files];if(!fs.length)return toast('Selecione ao menos um arquivo',true);const btn=$('#uploadBtn');btn.disabled=true;try{let i=0;for(const f of fs){i++;$('#mediaStatus').textContent=`Enviando ${i} de ${fs.length}...`;await uploadMedia(f,'library')}toast('Upload concluído');media()}catch(err){toast(err.message,true)}finally{btn.disabled=false}};
 $('.media-grid')?.addEventListener('click',async e=>{const c=e.target.closest('.copy'),d=e.target.closest('.media-del');if(c){await navigator.clipboard.writeText(c.dataset.url);toast('URL copiada')}if(d&&confirm('Excluir arquivo?')){const {error}=await supabase.storage.from(STORAGE_BUCKET).remove([d.dataset.name]);toast(error?error.message:'Arquivo excluído',!!error);if(!error)media()}})
}
async function render(tab){editing=null;if(tab==='dashboard')return dashboard();if(tab==='settings')return settings();if(tab==='projects')return projects();if(tab==='contacts')return contacts();if(tab==='media')return media();return generic(tab)}
boot();
