import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { demoData } from './data.js';

export { demoData };
export const SUPABASE_URL = 'https://ahmjkaqpgdajxibipchg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_ZABeQTjv5a0HayefGRnoHA_ny1qt9x5';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export async function getTable(name, fallback){
  try{ const {data,error}=await supabase.from(name).select('*').order('order_index',{ascending:true}); if(error||!data||!data.length) return fallback; return data; }catch(e){ return fallback; }
}
export async function getSettings(){
  try{ const {data,error}=await supabase.from('site_settings').select('*').limit(1).single(); if(error||!data) return demoData.settings; return data; }catch(e){ return demoData.settings; }
}
