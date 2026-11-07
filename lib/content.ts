import {projects as legacyProjects} from './legacy-projects.ts';
export type Project = { id:string; title:string; category:string; year:string; description:string; image:string; alt:string; url:string; cropX:number; cropY:number; status?:string; subtitle?:string; challenge?:string; approach?:string; solution?:string; outcome?:string };
export type Service = {id:string;title:string;label:string;description:string;tags:string};
export type Document = { name:string; menuLabel:string; contactLabel:string; workLabel:string; background:string; foreground:string; aboutTitle:string; about:string; workTitle:string; contactTitle:string; email:string; instagram:string; heroImage:string; heroAlt:string; heroX:number; heroY:number; grain:number; motion:boolean; parallax:boolean; projects:Project[]; services:Service[]; profileImage:string };
const baseDefaults:Document = {
 services:[],profileImage:'',name:'Izak\nHyllested',menuLabel:'Menu',contactLabel:'Contact',workLabel:'Work',background:'#c6beac',foreground:'#bd1815',
 aboutTitle:'A considered approach.',about:'Independent ideas. Thoughtful digital experiences. A selection of projects, brought together in one place.',workTitle:'Selected work',contactTitle:'Let’s make\nsomething good.',email:'',instagram:'',heroImage:'',heroAlt:'',heroX:50,heroY:50,grain:12,motion:true,parallax:true,
 projects:[
 {id:'plaisir',title:'Plaisir',category:'Digital experience',year:'2026',description:'A wine bar concept, translated into a digital experience.',image:'/projects/plaisir.svg',alt:'Plaisir typographic project cover',url:'https://plaisir-nu.vercel.app',cropX:50,cropY:50},
 {id:'blaa',title:'Blågårds Apotek',category:'Web design & development',year:'2026',description:'A home for music, culture and late nights in Nørrebro.',image:'/projects/blaa.svg',alt:'Blågårds Apotek typographic project cover',url:'',cropX:50,cropY:50},
 {id:'next',title:'Your next project',category:'Open for conversation',year:'',description:'Have something in mind? Let’s talk.',image:'/projects/next.svg',alt:'A red asterisk on a warm beige background',url:'',cropX:50,cropY:50}
 ]
};
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function str(v:unknown,max=5000){if(typeof v!=='string'||v.length>max)throw new Error('Invalid text.');return v;}
export function safeLink(v:string,kind:'image'|'link'='link'){
 if(!v)return v;
 if(kind==='image'&&(/^\/media\/[0-9a-f-]{36}$/i.test(v)||/^\/projects\/[a-z0-9-]+\.(?:svg|webp)$/.test(v)))return v;
 try{const u=new URL(v);if(u.protocol==='https:'&&!u.username&&!u.password)return v;}catch{}
 throw new Error('Invalid URL. Use a full https:// address.');
}
export function validateDocument(value:unknown):Document{
 if(!record(value))throw new Error('Invalid document.');
 const d={} as Document;
 for(const key of ['name','menuLabel','contactLabel','workLabel','aboutTitle','about','workTitle','contactTitle','email','instagram','heroImage','heroAlt'] as const)d[key]=str(value[key],key==='about'?5000:500);
 for(const key of ['name','menuLabel','contactLabel','workLabel'] as const)if(!d[key].trim()||d[key].length>60)throw new Error('Invalid navigation label (1–60 characters).');
 for(const key of ['background','foreground'] as const){const v=str(value[key],7);if(!/^#[0-9a-f]{6}$/i.test(v))throw new Error('Invalid colour.');d[key]=v;}
 for(const key of ['grain','heroX','heroY'] as const){const v=value[key];if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>100)throw new Error('Invalid image or grain setting.');d[key]=v;}
 for(const key of ['motion','parallax'] as const){if(typeof value[key]!=='boolean')throw new Error('Invalid animation setting.');d[key]=value[key];}
 d.profileImage=str(value.profileImage??'',500);safeLink(d.profileImage,'image');
 if(value.services!==undefined&&!Array.isArray(value.services))throw new Error('Invalid services.');
 const services=value.services??[];if((services as unknown[]).length>12)throw new Error('Invalid services.');
 const serviceIds=new Set<string>();d.services=(services as unknown[]).map(v=>{if(!record(v))throw new Error('Invalid service.');const service={} as Service;for(const k of ['id','title','label','description','tags'] as const)service[k]=str(v[k],k==='description'?5000:500);if(!/^[a-z0-9-]{1,80}$/.test(service.id)||serviceIds.has(service.id)||!service.title.trim())throw new Error('Invalid service title or identifier.');serviceIds.add(service.id);return service;});
 safeLink(d.heroImage,'image');safeLink(d.instagram);
 if(d.email&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(d.email))throw new Error('Invalid email address.');
 if(!Array.isArray(value.projects)||value.projects.length>30)throw new Error('Invalid projects (maximum 30).');
 const ids=new Set<string>();
 d.projects=value.projects.map(v=>{if(!record(v))throw new Error('Invalid project.');const p={} as Project;for(const k of ['id','title','category','year','description','image','alt','url'] as const)p[k]=str(v[k],k==='description'?5000:500);if(!/^[a-z0-9-]{1,80}$/.test(p.id)||ids.has(p.id)||!p.title.trim())throw new Error('Invalid project title or identifier.');ids.add(p.id);for(const k of ['status','subtitle','challenge','approach','solution','outcome'] as const)if(v[k]!==undefined)p[k]=str(v[k],5000);safeLink(p.url);safeLink(p.image,'image');for(const k of ['cropX','cropY'] as const){if(typeof v[k]!=='number'||!Number.isFinite(v[k])||v[k]<0||v[k]>100)throw new Error('Invalid crop.');p[k]=v[k];}return p;});
 return d;
}

export const portfolioServices:Service[] = [
 {id:'visual-systems',title:'Visual\nSystems',label:'Identity / Direction',description:'Logos, typography, layout, brand systems, posters, menus and visual direction for businesses that need a sharper and more coherent identity.',tags:'Logos · Brand Systems · Print · Art Direction'},
 {id:'digital-interfaces',title:'Digital\nInterfaces',label:'Web / Product',description:'Websites, landing pages, dashboards and mobile-first interfaces designed around clarity, atmosphere and interaction.',tags:'Web Design · UI Design · Dashboards · Case Studies'},
 {id:'creative-development',title:'Creative\nDevelopment',label:'Build / Deploy',description:'Custom Next.js sites, interactive tools, small web applications and deployment workflows that turn design ideas into working products.',tags:'Frontend · Next.js · Vercel · Custom Tools'}
];
// Explicit editor import: preserves palette, motion, crops, existing work and custom copy.
export function importOldPortfolio(current:Document):Document {
 const projects=current.projects.filter(p=>p.id!=='next'||p.title!=='Your next project');
 for(const legacy of legacyProjects){if(projects.some(p=>p.id===legacy.slug||p.title===legacy.title))continue;projects.push({...legacy,id:legacy.slug,image:`/projects/${legacy.slug}.svg`,alt:`${legacy.title} typographic cover`,url:'',cropX:50,cropY:50});}
 return validateDocument({...current,projects,
  aboutTitle:current.aboutTitle===baseDefaults.aboutTitle?'Graphic Designer &\nCreative Developer':current.aboutTitle,
  about:current.about===baseDefaults.about?'I build visual systems, mobile-first web apps, editorial interfaces and experimental digital identities with a focus on typography, atmosphere and interaction.':current.about,
  email:current.email||'izakhyllested@icloud.com',profileImage:current.profileImage||'/projects/profile.webp',services:current.services.length?current.services:portfolioServices});
}

export const defaults:Document = importOldPortfolio(baseDefaults);
