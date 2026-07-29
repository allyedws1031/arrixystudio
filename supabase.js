import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { demoData, fallbackProjects } from './data.js';

export { demoData };
export const SUPABASE_URL = 'https://ahmjkaqpgdajxibipchg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_ZABeQTjv5a0HayefGRnoHA_ny1qt9x5';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const REQUEST_TIMEOUT_MS = 3000;

function withTimeout(promise, timeoutMs = REQUEST_TIMEOUT_MS) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Supabase timeout após ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

/**
 * Busca os projetos sem permitir que uma requisição pendente bloqueie a interface.
 * Em timeout, erro de rede, erro de RLS ou resposta vazia, retorna o fallback local.
 */
export async function getProjects() {
  try {
    const query = supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    const { data, error } = await withTimeout(query, REQUEST_TIMEOUT_MS);

    if (error) throw error;
    return Array.isArray(data) && data.length ? data : fallbackProjects;
  } catch (error) {
    console.warn('[Artrixy] Projetos remotos indisponíveis; usando fallback local.', error);
    return fallbackProjects;
  }
}


export async function getTable(name, fallback){
  try{ const {data,error}=await supabase.from(name).select('*').order('order_index',{ascending:true}); if(error||!data||!data.length) return fallback; return data; }catch(e){ return fallback; }
}
export async function getSettings(){
  try{ const {data,error}=await supabase.from('site_settings').select('*').limit(1).single(); if(error||!data) return demoData.settings; return data; }catch(e){ return demoData.settings; }
}
