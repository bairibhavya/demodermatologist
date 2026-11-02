/** Server-side utilities. Do not import in browser code. */
const ENVS=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'];
export const configured=()=>ENVS.every(name=>Boolean(process.env[name]));
export const bookingConfigured=()=>configured()&&Boolean(process.env.TURNSTILE_SITE_KEY)&&Boolean(process.env.TURNSTILE_SECRET_KEY);
export function reply(res, status, body, headers={}){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('X-Content-Type-Options','nosniff');
  for(const [key,val] of Object.entries(headers))res.setHeader(key,val);
  res.end(JSON.stringify(body));
}
export function sameOrigin(req){
  const origin=req.headers.origin;
  if(!origin)return false; // Mutating endpoints require Origin header.
  try{
    const host=req.headers['x-forwarded-host']||req.headers.host;
    const requestHost=new URL(origin).host;
    if(process.env.ALLOWED_ORIGIN) return new URL(process.env.ALLOWED_ORIGIN).origin === new URL(origin).origin;
    return requestHost===host;
  }catch{return false;}
}
export async function parseJson(req,limit=10000){
  if(!String(req.headers['content-type']||'').startsWith('application/json'))throw Error('JSON content type required');
  // Vercel may pre-parse req.body. Enforce raw and parsed size limits.
  if(req.body && typeof req.body==='object'){
    if(Buffer.byteLength(JSON.stringify(req.body))>limit)throw Error('Request too large');
    return req.body;
  }
  if(typeof req.body==='string'){
    if(Buffer.byteLength(req.body)>limit)throw Error('Request too large');
    return JSON.parse(req.body);
  }
  let value='';
  for await(const part of req){value+=part;if(Buffer.byteLength(value)>limit)throw Error('Request too large');}
  return JSON.parse(value||'{}');
}
export const environment=()=>({url:process.env.SUPABASE_URL?.replace(/\/$/,''),key:process.env.SUPABASE_SERVICE_ROLE_KEY});
export async function sb(path,options={}){
  const {url,key}=environment();
  if(!url||!key)throw Error('Supabase not configured');
  const response=await fetch(url+path,{
    ...options,
    headers:{apikey:key,Authorization:`Bearer ${key}`,Accept:'application/json',...(options.headers||{})},
    signal:AbortSignal.timeout(10000),
  });
  return response;
}
export function cookie(name,req){
  const all=String(req.headers.cookie||'').split(';').map(part=>part.trim());
  const found=all.find(part=>part.startsWith(name+'='));
  return found ? found.substring(name.length+1) : '';
}
export function adminIds(){return new Set(String(process.env.ADMIN_USER_IDS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean));}
export async function verifyAdmin(req){
  const token=cookie('aurel_clinic_session',req);
  if(!token||!adminIds().size)return false;
  const {url,key}=environment();
  if(!url||!key)return false;
  try{
    // Supabase Auth verifies signature, expiry, and user existence.
    const response=await fetch(url+'/auth/v1/user',{
      headers:{apikey:key,Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(10000)
    });
    if(!response.ok)return false;
    const user=await response.json();
    return Boolean(user?.id&&adminIds().has(String(user.id).toLowerCase()));
  }catch{return false;}
}
export function sessionCookie(token, req){
  const secure=(req.headers['x-forwarded-proto']==='https'||process.env.VERCEL_ENV==='production')?'; Secure':'';
  return `aurel_clinic_session=${token}; HttpOnly; SameSite=Strict; Path=/api/; Max-Age=3600${secure}`;
}
export function clearCookie(req){
  const secure=(req.headers['x-forwarded-proto']==='https'||process.env.VERCEL_ENV==='production')?'; Secure':'';
  return `aurel_clinic_session=; HttpOnly; SameSite=Strict; Path=/api/; Max-Age=0${secure}`;
}
