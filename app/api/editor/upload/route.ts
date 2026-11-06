import sharp from 'sharp';
import {randomUUID} from 'node:crypto';
import {ensureSchema,query} from '../../../../lib/db';
import {requireSameOrigin,editorError} from '../../../../lib/editor-request';
export const runtime='nodejs';
export async function POST(req:Request){try{requireSameOrigin(req);if(!req.body)throw new Error('Invalid image.');const reader=req.body.getReader();const chunks:Uint8Array[]=[];let size=0;try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4_000_000){await reader.cancel();throw new Error('Image must be smaller than 4 MB.');}chunks.push(value);}}finally{reader.releaseLock();}
 const source=Buffer.concat(chunks);const image=sharp(source,{limitInputPixels:40_000_000,animated:false});const meta=await image.metadata();if(!['jpeg','png','webp','avif','heif'].includes(meta.format||''))throw new Error('Image must be JPEG, PNG, WebP, AVIF or HEIC.');const data=await image.rotate().resize({width:2000,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer();if(data.length>1_500_000)throw new Error('Image is too detailed. Choose a smaller image.');await ensureSchema();const id=randomUUID();await query`INSERT INTO portfolio_media(id,data) VALUES(${id}::uuid,decode(${data.toString('hex')},'hex'))`;return Response.json({src:`/media/${id}`});}catch(e){return editorError(e);}}
