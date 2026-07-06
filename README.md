# Artrixy Studio

Projeto limpo em HTML, CSS e JavaScript, sem páginas aleatórias.

## Arquivos principais
- `index.html` — Home estilo referência enviada.
- `portfolio.html` — página separada do portfólio com cards dinâmicos.
- `projeto.html` — página individual de cada projeto.
- `admin.html` — painel ADM com login via Supabase.
- `style.css` — todo o visual do site.
- `script.js` — renderização dinâmica do site.
- `admin.js` — login e CRUD do painel.
- `supabase.js` — conexão Supabase.
- `sql/supabase.sql` — banco completo.
- `prompts/prompts-imagens.md` — prompts para IA.

## Como abrir no VS Code
Abra a pasta no VS Code e use a extensão **Live Server** no `index.html`.

## Supabase
1. Entre no Supabase.
2. Abra SQL Editor.
3. Cole e execute `sql/supabase.sql`.
4. Vá em Authentication > Users e crie seu usuário ADM com email e senha.
5. Abra `admin.html` e faça login.

## Observação
O site tenta buscar tudo no Supabase. Se as tabelas ainda não existirem, ele usa dados demonstrativos para não quebrar.
