// Clinic details and media are demonstration content; replace with verified practice information before public launch.
const u=(id,w=1200)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
export const media={
 hero:{src:u('photo-1699206791200-414d95e68450',1500),fallback:'/images/portrait-fallback.jpg'},
 beauty:{src:u('photo-1699206790960-87c88c897db7',1200),fallback:'/images/portrait-fallback.jpg'},
 clinic:{src:u('photo-1552693673-1bf958298935',1400),fallback:'/images/clinic-fallback.jpg'},
 room:{src:u('photo-1676312754401-d97fe43c2c4b',1400),fallback:'/images/room-fallback.jpg'},
 doctorA:{src:u('photo-1687293233752-ec42de2050db',900),fallback:'/images/doctor-fallback.jpg'},
 doctorB:{src:u('photo-1612349317150-e413f6a5b16d',900),fallback:'/images/doctor-b-fallback.jpg'},
 acne:{src:u('photo-1699207012725-72af224cca65',1000),fallback:'/images/acne-fallback.jpg'},
 pigment:{src:u('photo-1713085085470-fba013d67e65',1000),fallback:'/images/skin-fallback.jpg'},
 antiaging:{src:u('photo-1641182776047-277073d4c69c',1000),fallback:'/images/portrait-fallback.jpg'},
 laser:{src:u('photo-1552693673-1bf958298935',1000),fallback:'/images/laser-fallback.jpg'},
 hair:{src:u('photo-1531123897727-8f129e1688ce',1000),fallback:'/images/portrait-fallback.jpg'},
 rejuvenation:{src:u('photo-1761718210089-ba3bb5ccb54f',1000),fallback:'/images/skin-fallback.jpg'},
};
export const details=[
 {slug:'acne-care',title:'Acne Treatment',category:'Skin',image:'acne',short:'Personalised, evidence-led options for acne and post-acne marks.',description:'Acne can have several contributing factors. A qualified clinician can help assess your skin and discuss appropriate medical and procedural options.',features:['Acne and breakout assessment','Skin care and lifestyle review','Personalised treatment options','Follow-up and maintenance plan'],steps:['Consultation and skin history','Assessment and treatment planning','Care plan and aftercare review']},
 {slug:'pigmentation',title:'Pigmentation Care',category:'Skin',image:'pigment',short:'Thoughtful care for uneven tone, spots and discolouration.',description:'Pigmentation varies by cause and skin type. Assessment is important before choosing products or procedures.',features:['Assessment of dark spots','Sun protection guidance','Suitability-led treatment','Long-term maintenance'],steps:['Understand pigmentation triggers','Discuss safe treatment pathways','Review progress and aftercare']},
 {slug:'skin-rejuvenation',title:'Skin Rejuvenation',category:'Aesthetic',image:'antiaging',short:'Refine texture and restore a refreshed-looking appearance.',description:'Explore clinician-guided approaches for skin texture, hydration, and visible signs of ageing with realistic expectations.',features:['Texture and hydration review','Treatment suitability','Benefits and risks explained','Personal aftercare guidance'],steps:['Discuss your goals','Review treatment choices','Plan follow-up care']},
 {slug:'laser-treatments',title:'Laser Treatments',category:'Laser',image:'laser',short:'Consultations for precise technology-led skin treatments.',description:'Laser and light-based procedures require assessment of your skin type, indication and possible risks.',features:['Medical suitability check','Procedure and recovery advice','Aftercare instructions','Clinician-supervised planning'],steps:['Skin examination','Discuss technology and alternatives','Recovery and review plan']},
 {slug:'hair-scalp',title:'Hair & Scalp Care',category:'Hair',image:'hair',short:'Explore causes and care options for thinning or scalp concerns.',description:'Hair shedding and scalp conditions have multiple causes. The first step is a diagnosis-informed discussion.',features:['Scalp and hair history','Relevant test discussion','Treatment planning','Ongoing review'],steps:['Hair and scalp evaluation','Discuss appropriate investigations','Individual care plan']},
 {slug:'chemical-peels',title:'Chemical Peels',category:'Aesthetic',image:'rejuvenation',short:'A measured approach to resurfacing and skin radiance.',description:'The appropriate peel depends on your condition, skin type and tolerance. Professional guidance can help minimise complications.',features:['Skin sensitivity review','Peel suitability guidance','Preparation planning','Recovery and sun care advice'],steps:['Assess skin concerns','Select suitable approach','Aftercare and follow-up']},
];
export const categories=['All Treatments','Skin','Hair','Laser','Aesthetic'];
export const clinic={name:import.meta.env.VITE_CLINIC_NAME||'AUREL',phone:import.meta.env.VITE_CLINIC_PHONE||'',email:import.meta.env.VITE_CLINIC_EMAIL||'',address:import.meta.env.VITE_CLINIC_ADDRESS||'',maps:import.meta.env.VITE_CLINIC_MAP_URL||''};
export const faqs=[
 ['Is an appointment confirmed when I submit a request?','No. A request is not a confirmed appointment. The clinic will contact you to discuss availability when its booking service is enabled.'],
 ['What if I am not sure which treatment I need?','Select a general consultation. A qualified practitioner can assess your concern before making a treatment recommendation.'],
 ['Are treatment outcomes guaranteed?','No. Results vary by individual, medical history and treatment. Your clinician should discuss risks, benefits and realistic expectations.'],
 ['Can I upload patient photographs to this site?','No. This public form does not collect medical records or photographs. Contact the clinic about an approved secure channel.'],
 ['Does your clinic offer weekend appointments?','Actual clinic opening hours and appointment availability must be confirmed with the practice.'],
];
