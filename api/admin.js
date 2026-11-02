import {configured,parseJson,reply,sameOrigin,sb,verifyAdmin} from '../lib/server.js';
const STATUSES=new Set(['requested','contacted','confirmed','completed','cancelled']);
const isUUID=x=>typeof x==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x);
export default async function handler(req,res){
  if(!['GET','PATCH'].includes(req.method))return reply(res,405,{message:'Method not allowed'},{Allow:'GET, PATCH'});
  if(!configured())return reply(res,503,{message:'The clinic database is not configured.'});
  if(req.method==='PATCH'&&!sameOrigin(req))return reply(res,403,{message:'Request origin not permitted.'});
  if(!await verifyAdmin(req))return reply(res,401,{message:'Your administrator session has expired or is not authorised.'});
  try{
    if(req.method==='GET'){
      const response=await sb('/rest/v1/aurel_appointments?select=id,name,phone,email,service,preferred_date,preferred_time,status,created_at&order=created_at.desc&limit=500');
      if(!response.ok)return reply(res,502,{message:'Could not load appointment requests.'});
      const data=await response.json();
      return reply(res,200,{appointments:data});
    }
    const payload=await parseJson(req);
    if(!isUUID(payload.id)||!STATUSES.has(payload.status))return reply(res,400,{message:'Invalid request ID or status.'});
    const response=await sb('/rest/v1/aurel_appointments?id=eq.'+encodeURIComponent(payload.id),{
      method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=representation'},
      body:JSON.stringify({status:payload.status,updated_at:new Date().toISOString()})
    });
    if(!response.ok)return reply(res,502,{message:'Could not update the appointment.'});
    const changed=await response.json();
    return reply(res,changed.length?200:404,changed.length?{ok:true}:{message:'Appointment not found.'});
  }catch(e){console.error('Admin endpoint failed',e.name);return reply(res,500,{message:'Something went wrong. Please try again.'});}
}
