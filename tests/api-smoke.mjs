import assert from 'node:assert/strict';
import config from '../api/config.js';
import appointments from '../api/appointments.js';
import login from '../api/admin-login.js';
import admin from '../api/admin.js';
const BASE_HEADERS={'origin':'https://aurel.example','host':'aurel.example','x-forwarded-host':'aurel.example','content-type':'application/json','x-forwarded-proto':'https'};
function res(){return {statusCode:0,headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v;},end(v){this.body=JSON.parse(v);}};}
function req(method='GET',body={},headers={}){return {method,headers:{...BASE_HEADERS,...headers},body};}
function assertStatus(r,code){assert.equal(r.statusCode,code,JSON.stringify(r.body));}
function addEnv(){process.env.SUPABASE_URL='https://example.supabase.co';process.env.SUPABASE_SERVICE_ROLE_KEY='private-service-role';process.env.SUPABASE_ANON_KEY='public-anon';process.env.TURNSTILE_SITE_KEY='sitekey123456789';process.env.TURNSTILE_SECRET_KEY='secretkey123456';process.env.ADMIN_USER_IDS='626bd604-fb38-4cf0-9510-0261a6723335';}
for(const name of ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','SUPABASE_ANON_KEY','TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY','ADMIN_USER_IDS'])delete process.env[name];
let r=res();config(req(),r);assertStatus(r,200);assert.equal(r.body.bookingEnabled,false);
r=res();await appointments(req('POST',{name:'Test'}, {'origin':''}),r);assertStatus(r,403);
r=res();await appointments(req('POST',{name:'Test'}),r);assertStatus(r,503);
addEnv();
r=res();config(req(),r);assertStatus(r,200);assert.equal(r.body.bookingEnabled,true);
const date=new Date();date.setUTCDate(date.getUTCDate()+2);const wanted=date.toISOString().slice(0,10);
const valid={name:'Test Person',phone:'+91 9876543210',email:'',service:'acne-care',preferred_date:wanted,preferred_time:'Morning',consent:true,website:'',turnstileToken:'0123456789TOKEN_VALID'};
r=res();await appointments(req('POST',{...valid,phone:'123'}),r);assertStatus(r,400);
let calls=[];
global.fetch=async (url,options)=>{
  calls.push([String(url),options]);
  if(String(url).includes('turnstile'))return new Response(JSON.stringify({success:true,hostname:'aurel.example'}),{status:200});
  if(String(url).includes('rest/v1/aurel_appointments') && options?.method==='POST')return new Response(JSON.stringify([{id:'8d3bfebf-7cd9-40f8-b65a-6ff4b0c1399e'}]),{status:201});
  if(String(url).includes('/auth/v1/token'))return new Response(JSON.stringify({access_token:'FAKE_AUTH_JWT',user:{id:'626bd604-fb38-4cf0-9510-0261a6723335'}}),{status:200});
  if(String(url).includes('/auth/v1/user'))return new Response(JSON.stringify({id:'626bd604-fb38-4cf0-9510-0261a6723335'}),{status:200});
  if(String(url).includes('rest/v1/aurel_appointments') && options?.method==='PATCH')return new Response(JSON.stringify([{id:'8d3bfebf-7cd9-40f8-b65a-6ff4b0c1399e'}]),{status:200});
  if(String(url).includes('rest/v1/aurel_appointments') && !options?.method)return new Response(JSON.stringify([{id:'8d3bfebf-7cd9-40f8-b65a-6ff4b0c1399e',name:'Test Person',status:'requested'}]),{status:200});
  return new Response('not found',{status:404});
};
r=res();await appointments(req('POST',valid),r);assertStatus(r,201);assert.equal(r.body.reference,'8D3BFEBF');
assert.equal(calls.filter(c=>c[0].includes('turnstile')).length,1);
r=res();await admin(req(),r);assertStatus(r,401);
r=res();await login(req('POST',{email:'admin@aurel.example',password:'valid123'}),r);assertStatus(r,200);assert.ok(r.headers['set-cookie'].includes('HttpOnly'));
const authHeaders={cookie:'aurel_clinic_session=FAKE_AUTH_JWT'};
r=res();await admin(req('GET',{},authHeaders),r);assertStatus(r,200);assert.equal(r.body.appointments.length,1);
r=res();await admin(req('PATCH',{id:'8d3bfebf-7cd9-40f8-b65a-6ff4b0c1399e',status:'confirmed'},authHeaders),r);assertStatus(r,200);
r=res();await login(req('DELETE',{}),r);assertStatus(r,200);assert.ok(r.headers['set-cookie'].includes('Max-Age=0'));
console.log('API smoke tests PASS: disabled booking, origin block, input validation, verified request, protected admin session, listing, status update, signout.');
