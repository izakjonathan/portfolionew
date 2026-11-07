import {defaults,validateDocument,type Document} from './content.ts';
export type Query=(strings:TemplateStringsArray,...values:unknown[])=>Promise<Record<string,unknown>[]>;
export type State={revision:number;draft:Document;published:Document;previous:Document|null};
export async function initStore(db:Query){
 await db`CREATE TABLE IF NOT EXISTS portfolio_content(id integer PRIMARY KEY CHECK(id=1),revision integer NOT NULL DEFAULT 0,draft jsonb NOT NULL,published jsonb NOT NULL,previous jsonb,updated_at timestamptz NOT NULL DEFAULT now())`;
 await db`INSERT INTO portfolio_content(id,draft,published) VALUES(1,${JSON.stringify(defaults)}::jsonb,${JSON.stringify(defaults)}::jsonb) ON CONFLICT DO NOTHING`;
 await db`CREATE TABLE IF NOT EXISTS portfolio_media(id uuid PRIMARY KEY,data bytea NOT NULL,created_at timestamptz NOT NULL DEFAULT now())`;
}
export async function readStore(db:Query):Promise<State>{const [r]=await db`SELECT * FROM portfolio_content WHERE id=1`;return{revision:Number(r.revision),draft:validateDocument(r.draft),published:validateDocument(r.published),previous:r.previous?validateDocument(r.previous):null};}
export async function writeStore(db:Query,action:'save'|'publish'|'restore',revision:number,document?:Document){
 if(!Number.isSafeInteger(revision)||revision<0)throw new Error('Invalid revision.');
 const d=action==='restore'?undefined:validateDocument(document);
 if(d){const ids=[d.heroImage,d.profileImage,...d.projects.map(p=>p.image)].filter(s=>s.startsWith('/media/')).map(s=>s.slice(7));if(ids.length){const rows=await db`SELECT id::text FROM portfolio_media WHERE id=ANY(${ids}::uuid[])`;if(new Set(rows.map(r=>r.id)).size!==new Set(ids).size)throw new Error('Invalid image. Upload it again.');}}
 const data=JSON.stringify(d);
 const rows=action==='restore'?await db`UPDATE portfolio_content SET draft=previous,published=previous,previous=published,revision=revision+1,updated_at=now() WHERE id=1 AND revision=${revision} AND previous IS NOT NULL RETURNING id`:action==='publish'?await db`UPDATE portfolio_content SET draft=${data}::jsonb,previous=CASE WHEN published IS DISTINCT FROM ${data}::jsonb THEN published ELSE previous END,published=${data}::jsonb,revision=revision+1,updated_at=now() WHERE id=1 AND revision=${revision} RETURNING id`:await db`UPDATE portfolio_content SET draft=${data}::jsonb,revision=revision+1,updated_at=now() WHERE id=1 AND revision=${revision} RETURNING id`;
 if(!rows.length)throw new Error('CONFLICT: Content changed on another device, or there is no previous version. Reload before saving.');return readStore(db);
}
