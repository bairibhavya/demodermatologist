import {adminIds,clearCookie,configured,parseJson,reply,sameOrigin,sessionCookie} from '../lib/server.js';
export default async function handler(req,res){
  if(!['POST','DELETE'].includes(req.method))return reply(res,405,{message:'Method not allowed'},{Allow:'POST, DELETE'});
  if(!sameOrigin(req))return reply(res,403,{message:'Request origin not permitted'});
  if(req.method==='DELETE')return reply(res,200,{ok:true},{'Set-Cookie':clearCookie(req)});
  if(!configured()||!process.env.SUPABASE_ANON_KEY||!adminIds().size)return reply(res,503,{message:'Admin login has not been configured by the clinic.'});
  try{
    const input=await parseJson(req);
    const email=typeof input.email==='string'?input.email.trim():'';
    const password=typeof input.password==='string'?input.password:'';
    if(!email||password.length<6||password.length>500)return reply(res,400,{message:'Enter a valid email and password.'});
    const url=process.env.SUPABASE_URL.replace(/\/$/,'');
    const response=await fetch(url+'/auth/v1/token?grant_type=password',{
      method:'POST',headers:{apikey:process.env.SUPABASE_ANON_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({email,password}),signal:AbortSignal.timeout(10000),
    });
    if(!response.ok)return reply(res,401,{message:'Invalid credentials or unauthorised account.'});
    const result=await response.json();
    if(!result.access_token||!adminIds().has(String(result.user?.id||'').toLowerCase()))return reply(res,403,{message:'This account is not authorised for the clinic console.'});
    return reply(res,200,{ok:true},{'Set-Cookie':sessionCookie(result.access_token,req)});
  }catch(e){console.error('Admin login error',e.name);return reply(res,500,{message:'Unable to sign in at the moment.'});}
}
