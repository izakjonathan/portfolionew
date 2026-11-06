import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {defaults} from '../lib/content.ts';
import {initStore,readStore,writeStore,type Query} from '../lib/store.ts';
test('draft, publishing, rollback and stale revisions use real PostgreSQL semantics',async()=>{
 const pg=new PGlite();const db:Query=async(strings,...values)=>{let sql=strings[0];for(let i=0;i<values.length;i++)sql+=`$${i+1}`+strings[i+1];return(await pg.query(sql,values)).rows as Record<string,unknown>[];};
 try{await initStore(db);await initStore(db);let s=await readStore(db);assert.equal(s.revision,0);const draft={...defaults,about:'A new introduction.'};s=await writeStore(db,'save',0,draft);assert.equal(s.draft.about,draft.about);assert.equal(s.published.about,defaults.about);await assert.rejects(()=>writeStore(db,'publish',0,draft),/CONFLICT/);s=await writeStore(db,'publish',1,draft);assert.equal(s.published.about,draft.about);assert.equal(s.previous?.about,defaults.about);s=await writeStore(db,'publish',2,draft);assert.equal(s.previous?.about,defaults.about);s=await writeStore(db,'restore',3);assert.equal(s.published.about,defaults.about);assert.equal(s.draft.about,defaults.about);assert.equal(s.previous?.about,draft.about);await assert.rejects(()=>writeStore(db,'save',4,{...draft,heroImage:'/media/12345678-1234-1234-1234-123456789abc'}),/Invalid image/);
 const hex='5249464600000057454250';await db`INSERT INTO portfolio_media(id,data) VALUES(${'12345678-1234-1234-1234-123456789abc'}::uuid,decode(${hex},'hex'))`;const [media]=await db`SELECT encode(data,'hex') AS hex FROM portfolio_media LIMIT 1`;assert.equal(media.hex,hex);s=await writeStore(db,'save',4,{...draft,heroImage:'/media/12345678-1234-1234-1234-123456789abc'});assert.equal(s.revision,5);
 }finally{await pg.close();}
});
