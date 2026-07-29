-- ARTRIXY STUDIO — SQL SUPABASE COMPLETO
create extension if not exists pgcrypto;

create table if not exists site_settings (
  id int primary key default 1,
  site_title text default 'Artrixy Studio',
  hero_description text,
  about_text text,
  whatsapp_url text,
  resume_url text,
  github_url text,
  linkedin_url text,
  instagram_url text,
  email text,
  logo_url text,
  favicon_url text,
  primary_color text default '#ff6dae',
  seo_title text,
  seo_description text,
  og_image text,
  updated_at timestamptz default now()
);

create table if not exists categories (id uuid primary key default gen_random_uuid(), name text not null, slug text unique, order_index int default 0, created_at timestamptz default now());
create table if not exists projects (id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null, category text, description text, cover text, banner text, mockup text, problem text, solution text, results text, technologies text[] default '{}', gallery text[] default '{}', project_url text, featured boolean default false, order_index int default 0, created_at timestamptz default now());
create table if not exists services (id uuid primary key default gen_random_uuid(), title text not null, description text, icon text, image text, order_index int default 0, created_at timestamptz default now());
create table if not exists technologies (id uuid primary key default gen_random_uuid(), name text not null, icon text, order_index int default 0);
create table if not exists skills (id uuid primary key default gen_random_uuid(), name text not null, level int default 80, order_index int default 0);
create table if not exists experiences (id uuid primary key default gen_random_uuid(), title text, company text, description text, start_date date, end_date date, order_index int default 0);
create table if not exists testimonials (id uuid primary key default gen_random_uuid(), client text, role text, text text, avatar text, order_index int default 0);
create table if not exists clients (id uuid primary key default gen_random_uuid(), name text, logo text, url text, order_index int default 0);
create table if not exists statistics (id uuid primary key default gen_random_uuid(), label text, value text, order_index int default 0);
create table if not exists social_links (id uuid primary key default gen_random_uuid(), name text, url text, icon text, order_index int default 0);
create table if not exists contacts (id uuid primary key default gen_random_uuid(), name text, email text, phone text, message text, created_at timestamptz default now());
create table if not exists admin_users (id uuid primary key default gen_random_uuid(), user_id uuid, email text unique, role text default 'admin', created_at timestamptz default now());

alter table site_settings enable row level security;
alter table categories enable row level security;
alter table projects enable row level security;
alter table services enable row level security;
alter table technologies enable row level security;
alter table skills enable row level security;
alter table experiences enable row level security;
alter table testimonials enable row level security;
alter table clients enable row level security;
alter table statistics enable row level security;
alter table social_links enable row level security;
alter table contacts enable row level security;
alter table admin_users enable row level security;

do $$ begin
  create policy "public read settings" on site_settings for select using (true);
  create policy "public read categories" on categories for select using (true);
  create policy "public read projects" on projects for select using (true);
  create policy "public read services" on services for select using (true);
  create policy "public read tech" on technologies for select using (true);
  create policy "public read skills" on skills for select using (true);
  create policy "public read experiences" on experiences for select using (true);
  create policy "public read testimonials" on testimonials for select using (true);
  create policy "public read clients" on clients for select using (true);
  create policy "public read stats" on statistics for select using (true);
  create policy "public read socials" on social_links for select using (true);
exception when duplicate_object then null; end $$;

do $$ declare t text; begin
  foreach t in array array['site_settings','categories','projects','services','technologies','skills','experiences','testimonials','clients','statistics','social_links','contacts'] loop
    execute format('drop policy if exists "admin all %s" on %I', t, t);
    execute format('create policy "admin all %s" on %I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t, t);
  end loop;
end $$;

insert into site_settings (id, hero_description, about_text, whatsapp_url, resume_url, github_url, linkedin_url, instagram_url, email, seo_title, seo_description) values
(1,'Design com propósito, tecnologia com estética e experiências digitais criadas para gerar presença, confiança e resultado.','A Artrixy Studio nasce para unir estética editorial, estratégia e desenvolvimento em projetos digitais que conectam marcas e pessoas.','https://wa.me/5500000000000','#','#','#','#','contato@artrixy.com','Artrixy Studio — Portfólio Profissional','Portfólio premium de design, web design e desenvolvimento.')
on conflict (id) do nothing;

insert into services(title,description,icon,order_index) values
('Design Gráfico','Identidade visual, social media, peças impressas e comunicação visual.','✒',1),('Web Design','Sites modernos, responsivos e focados na melhor experiência do usuário.','▣',2),('Desenvolvimento','Soluções web completas com tecnologias modernas e escaláveis.','</>',3),('Projetos Digitais','Sistemas personalizados, automações, dashboards e plataformas web.','🚀',4)
on conflict do nothing;
insert into projects(title,slug,category,description,featured,technologies,problem,solution,results,order_index) values
('BARMY ZONE','barmy-zone','Desenvolvimento','Plataforma para fãs com experiência visual premium.',true,array['HTML','CSS','JavaScript','Supabase'],'Organizar conteúdos e interações de fãs.','Interface responsiva, cards dinâmicos e painel editável.','Navegação clara, identidade forte e gestão simples.',1),
('Atrix Nails','atrix-nails','Web Design','Sistema de agendamento online com estética delicada.',true,array['React','Tailwind','Supabase'],'Agendamentos manuais e pouca presença digital.','Landing page com fluxo visual de serviços e contato.','Apresentação profissional e mais clareza para clientes.',2),
('Studio Dashboard','studio-dashboard','Dashboard','Painel administrativo completo para edição de conteúdo.',true,array['Supabase','JavaScript'],'Editar site sem mexer no código.','CRUD completo para conteúdo e projetos.','Autonomia total no gerenciamento.',3),
('Landing Pages','landing-pages','Web Design','Coleção de páginas criativas e modernas.',true,array['HTML','CSS','JS'],'Marcas precisavam apresentar ideias com impacto.','Páginas editoriais com estética premium.','Apresentações mais fortes e memoráveis.',4)
on conflict (slug) do nothing;
insert into technologies(name,order_index) values ('HTML',1),('CSS',2),('JavaScript',3),('TypeScript',4),('React',5),('Tailwind',6),('PHP',7),('Supabase',8),('Figma',9),('Photoshop',10),('Illustrator',11),('Git',12),('GitHub',13),('VS Code',14) on conflict do nothing;
-- A tabela skills começa vazia. Adicione habilidades somente pelo painel administrativo.
insert into statistics(label,value,order_index) values ('Projetos concluídos','+20',1),('Clientes satisfeitos','+10',2),('Dedicação em cada detalhe','100%',3),('Criatividade sem limites','∞',4) on conflict do nothing;
insert into testimonials(client,role,text,order_index) values ('Cliente Artrixy','Marca digital','Visual sofisticado, entrega cuidadosa e resultado profissional.',1),('Projeto Studio','Dashboard','O painel facilitou a edição e deixou tudo mais organizado.',2),('Landing Page','Web Design','A estética ficou premium e muito alinhada com a marca.',3) on conflict do nothing;

-- ATUALIZAÇÃO 2026: campos adicionais sem apagar dados existentes
alter table site_settings add column if not exists hero_eyebrow text default 'DESIGN • DESENVOLVIMENTO • ESTRATÉGIA';
alter table site_settings add column if not exists hero_title text default 'Artrixy';
alter table site_settings add column if not exists hero_accent text default 'studio';
alter table site_settings add column if not exists proof_text text default '+20 projetos entregues com criatividade e foco em resultados';
alter table site_settings add column if not exists services_title text;
alter table site_settings add column if not exists services_description text;
alter table site_settings add column if not exists projects_title text;
alter table site_settings add column if not exists about_title text;
alter table site_settings add column if not exists signature_text text;
alter table site_settings add column if not exists skills_title text;
alter table site_settings add column if not exists contact_title text;
alter table site_settings add column if not exists contact_description text;
alter table site_settings add column if not exists footer_text text;
alter table services add column if not exists link_url text;
alter table services add column if not exists active boolean default true;
alter table projects add column if not exists active boolean default true;
alter table experiences add column if not exists period text;

update site_settings set
 services_title=coalesce(services_title,'Soluções criativas para marcas que querem se destacar'),
 services_description=coalesce(services_description,'Design estratégico, tecnologia e criatividade trabalhando juntos.'),
 projects_title=coalesce(projects_title,'Projetos selecionados'),
 about_title=coalesce(about_title,'transformo ideias em experiências digitais'),
 signature_text=coalesce(signature_text,'Artrixy ♡'),
 skills_title=coalesce(skills_title,'Tecnologias e habilidades'),
 contact_title=coalesce(contact_title,'criatividade estratégica para o seu próximo projeto'),
 contact_description=coalesce(contact_description,'Entre em contato pelos canais abaixo.'),
 footer_text=coalesce(footer_text,'CRIAR • CONECTAR • TRANSFORMAR')
where id=1;

-- Bucket público para imagens do painel
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('site-media','site-media',true,5242880,array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
on conflict (id) do update set public=true, file_size_limit=5242880;

do $$ begin
  create policy "public read site media" on storage.objects for select using (bucket_id='site-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated upload site media" on storage.objects for insert to authenticated with check (bucket_id='site-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated update site media" on storage.objects for update to authenticated using (bucket_id='site-media') with check (bucket_id='site-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated delete site media" on storage.objects for delete to authenticated using (bucket_id='site-media');
exception when duplicate_object then null; end $$;


-- =========================================================
-- MÍDIA DE PROJETOS: IMAGENS + VÍDEOS (ATUALIZAÇÃO)
-- =========================================================
alter table projects add column if not exists video_url text;
alter table projects add column if not exists video_type text default 'upload' check (video_type in ('upload','embed'));
alter table projects add column if not exists media_type text default 'image' check (media_type in ('image','video'));

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
 'portfolio-media','portfolio-media',true,52428800,
 array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/ogg']
)
on conflict (id) do update set
 public=true,
 file_size_limit=52428800,
 allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "public read portfolio media" on storage.objects;
create policy "public read portfolio media" on storage.objects for select to public using (bucket_id='portfolio-media');
drop policy if exists "authenticated upload portfolio media" on storage.objects;
create policy "authenticated upload portfolio media" on storage.objects for insert to authenticated with check (bucket_id='portfolio-media');
drop policy if exists "authenticated update portfolio media" on storage.objects;
create policy "authenticated update portfolio media" on storage.objects for update to authenticated using (bucket_id='portfolio-media') with check (bucket_id='portfolio-media');
drop policy if exists "authenticated delete portfolio media" on storage.objects;
create policy "authenticated delete portfolio media" on storage.objects for delete to authenticated using (bucket_id='portfolio-media');

drop policy if exists "public read projects" on projects;
create policy "public read projects" on projects for select to anon, authenticated using (true);
