import {bookingConfigured,reply} from '../lib/server.js';
export default function handler(req,res){
  if(req.method!=='GET')return reply(res,405,{message:'Method not allowed'},{Allow:'GET'});
  return reply(res,200,{
    bookingEnabled:bookingConfigured(),
    turnstileSiteKey:bookingConfigured()?process.env.TURNSTILE_SITE_KEY:null,
  });
}
