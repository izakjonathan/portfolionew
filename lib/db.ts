import {neon} from '@neondatabase/serverless';
import {defaults} from './content';
import {initStore,type Query} from './store';
export const configured=()=>Boolean(process.env.DATABASE_URL||process.env.POSTGRES_URL);
export const query:Query=(strings,...values)=>{const url=process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!url)throw new Error('Connect a Neon database to enable saving.');return neon(url)(strings,...values);};
let schema:Promise<void>|undefined;
export async function ensureSchema(){if(!schema)schema=initStore(query).catch(e=>{schema=undefined;throw e;});return schema;}
export async function published(){if(!configured())return defaults;try{await ensureSchema();const [r]=await query`SELECT published FROM portfolio_content WHERE id=1`;const {validateDocument}=await import('./content');return validateDocument(r.published);}catch{console.error('Portfolio database unavailable; using bundled content.');return defaults;}}
