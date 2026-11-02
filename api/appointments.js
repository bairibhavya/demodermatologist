import {bookingConfigured,parseJson,reply,sameOrigin,sb} from '../lib/server.js';

const SERVICES=new Set(['acne-care','pigmentation','laser-treatments','hair-scalp','skin-rejuvenation','chemical-peels','general']);
const WINDOWS=new Set(['Morning','Afternoon','Evening']);
function validDate(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(value+'T00:00:00Z');
  if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)return false;
  const now=new Date();
  // Compare with the clinic's calendar date, not the server's UTC date.
  const parts=new Intl.DateTimeFormat('en-GB', {
    timeZone:process.env.CLINIC_TIMEZONE||'Asia/Kolkata',
    day:'2-digit',month:'2-digit',year:'numeric'
  }).formatToParts(now);
  const get=type=>parts.find(part=>part.type===type)?.value;
  const start=Date.UTC(Number(get('year')),Number(get('month'))-1,Number(get('day')));
  const diff=(date.getTime()-start)/86400000;
  return diff>=0&&diff<=90;
}
function safe(input){
  const s=x=>typeof x==='string'?x.trim():'';
  const name=s(input.name), phone=s(input.phone), email=s(input.email).toLowerCase();
  const service=s(input.service), preferred_date=s(input.preferred_date), preferred_time=s(input.preferred_time);
  if(name.length<2||name.length>100)throw Error('Please enter a valid name.');
  if(!/^[+\d()\s-]{8,20}$/.test(phone)||phone.replace(/\D/g,'').length<8||phone.replace(/\D/g,'').length>15)throw Error('Please enter a valid phone number.');
  if(email && (email.length>160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))throw Error('Please enter a valid email address.');
  if(!SERVICES.has(service))throw Error('Please select a consultation topic.');
  if(!validDate(preferred_date))throw Error('Choose a valid date within the next 90 days.');
  if(!WINDOWS.has(preferred_time))throw Error('Select a preferred time window.');
  if(input.consent!==true)throw Error('Please accept the privacy notice.');
  if(s(input.website))throw Error('Unable to process the request.');
  return {name,phone,email:email||null,service,preferred_date,preferred_time,consent_at:new Date().toISOString(),status:'requested'};
}
export default async function handler(req,res){
  if(req.method!=='POST')return reply(res,405,{message:'Method not allowed'},{Allow:'POST'});
  if(!sameOrigin(req))return reply(res,403,{message:'Request origin not permitted.'});
  if(!bookingConfigured())return reply(res,503,{message:'Online requests are temporarily unavailable.'});
  try{
    const data=await parseJson(req);
    const payload=safe(data);
    const token=typeof data.turnstileToken==='string'?data.turnstileToken:'';
    if(token.length<15||token.length>2500)throw Error('Complete the human verification.');
    const verifyBody=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY,response:token});
    const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim();
    if(ip && ip.length<70)verifyBody.set('remoteip',ip);
    const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
      method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:verifyBody,
      signal:AbortSignal.timeout(10000),
    });
    if(!verification.ok)return reply(res,502,{message:'Human verification is temporarily unavailable.'});
    const result=await verification.json();
    if(!result.success)return reply(res,422,{message:'Human verification failed. Please retry.'});
    // Optional hostname hardening; set for custom-domain production deployments.
    if(process.env.TURNSTILE_EXPECTED_HOSTNAME&&result.hostname!==process.env.TURNSTILE_EXPECTED_HOSTNAME){
      return reply(res,403,{message:'Verification hostname mismatch.'});
    }
    const response=await sb('/rest/v1/aurel_appointments?select=id',{
      method:'POST',
      headers:{'Content-Type':'application/json',Prefer:'return=representation'},
      body:JSON.stringify(payload),
    });
    if(!response.ok){console.error('Appointment database insert failed:',response.status);return reply(res,502,{message:'Unable to save the request. Please contact the clinic.'});}
    const items=await response.json();
    return reply(res,201,{ok:true,reference:String(items[0]?.id||'').slice(0,8).toUpperCase()});
  }catch(error){
    if(error.name==='TimeoutError')return reply(res,504,{message:'The booking service timed out. Please retry later.'});
    if(error instanceof SyntaxError)return reply(res,400,{message:'Invalid request.'});
    const msg=String(error.message||'Invalid request');
    const safeError=msg.startsWith('Supabase')?'Unable to process the request.':msg;
    return reply(res,400,{message:safeError});
  }
}
