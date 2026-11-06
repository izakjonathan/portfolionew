import {configured,ensureSchema,query} from '../../../../lib/db';
import {readStore,writeStore} from '../../../../lib/store';
import {readJSON,requireSameOrigin,editorError} from '../../../../lib/editor-request';
export const dynamic='force-dynamic';
export async function GET(){if(!configured())return Response.json({ready:false,error:'Database is not connected. You can edit and preview; saving and uploads need Neon Postgres.'},{headers:{'Cache-Control':'no-store'}});try{await ensureSchema();return Response.json({ready:true,state:await readStore(query)},{headers:{'Cache-Control':'no-store'}});}catch(e){return editorError(e);}}
export async function POST(req:Request){try{requireSameOrigin(req);const b=await readJSON(req);if(!['save','publish','restore'].includes(String(b.action)))throw new Error('Invalid action.');await ensureSchema();const state=await writeStore(query,b.action as 'save'|'publish'|'restore',b.revision as number,b.document as never);return Response.json({state},{headers:{'Cache-Control':'no-store'}});}catch(e){return editorError(e);}}
