'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {defaults,validateDocument,type Document,type Project} from '../lib/content';
import {afterPaint} from '../lib/motion';
import {useFrameNavigation} from './useFrameNavigation';
function UpArrow(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.25"/></svg>;}
function Arrow(){return <svg viewBox="0 0 42 76" fill="none" aria-hidden="true"><path d="M21 2v69M3 51l18 21 18-21" stroke="currentColor" strokeWidth="1.4"/></svg>;}
function ProjectImage({project,parallax}:{project:Project;parallax:boolean}){return <div className={`project-image ${parallax?'frame-image-motion':''}`}>{project.image?<img src={project.image} alt={project.alt} loading="eager" style={{objectPosition:`${project.cropX}% ${project.cropY}%`}}/>:<div className="project-empty">{project.title}</div>}</div>;}
export default function Portfolio({initial=defaults,preview=false}:{initial?:Document;preview?:boolean}){
 const [document,setDocument]=useState(initial);const [menu,setMenu]=useState(false);const [ready,setReady]=useState(false);const [detail,setDetail]=useState<Project|null>(null);const menuRef=useRef<HTMLDialogElement>(null);const detailRef=useRef<HTMLDialogElement>(null);const mainRef=useRef<HTMLElement>(null);
 const frameIds=['home',...document.projects.map((p,i)=>i===0?'work':`project-${p.id}`),...(document.projects.length?[]:['work']),'about','contact'];
 const navigation=useFrameNavigation(frameIds,document.motion,menu||!!detail,mainRef);
 const frameId=frameIds[navigation.index];
 const projectIndex=navigation.index-1;
 const activeProject=frameId==='work'||frameId?.startsWith('project-')?document.projects[projectIndex]:undefined;
 useEffect(()=>afterPaint(()=>setReady(true)),[]);
 useEffect(()=>{const next=document.projects[navigation.index]?.image;if(next){const image=new window.Image();image.src=next;}},[document.projects,navigation.index]);
 useEffect(()=>{if(!preview)return;const receive=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='portfolio-preview')return;try{setDocument(validateDocument(event.data.document));}catch{}};addEventListener('message',receive);parent.postMessage({type:'portfolio-preview-ready'},location.origin);return()=>removeEventListener('message',receive);},[preview]);
 useEffect(()=>{if(menu)menuRef.current?.showModal();else menuRef.current?.close();},[menu]);
 useEffect(()=>{if(detail)detailRef.current?.showModal();else detailRef.current?.close();},[detail]);
 useEffect(()=>{if(preview)return;const meta=window.document.querySelector('meta[name="theme-color"]');const old=meta?.getAttribute('content');meta?.setAttribute('content',document.background);return()=>{if(old)meta?.setAttribute('content',old);};},[document.background,preview]);
 const go=(id:string)=>{setMenu(false);setDetail(null);const target=frameIds.indexOf(id);if(target>=0)navigation.go(target);};
 const vars={'--frame-direction':navigation.direction,'--paper':document.background,'--ink':document.foreground,'--grain':document.grain/100*.14} as CSSProperties;
 return <div className={`portfolio ${ready?'is-ready':''} ${document.motion?'':'no-motion'}`} style={vars}>
  <a className="skip" href="#work" onClick={e=>{e.preventDefault();go('work');}}>Skip to work</a>
  <nav aria-label="Main navigation" className="corners"><a href="#home" className="corner top-left" onClick={e=>{e.preventDefault();go('home');}}>{document.name}</a><button className="corner top-right" aria-haspopup="dialog" aria-expanded={menu} onClick={()=>setMenu(true)}>{document.menuLabel}</button><a className="corner bottom-left" href="#contact" onClick={e=>{e.preventDefault();go('contact');}}>{document.contactLabel}</a><a className="corner bottom-right" href="#work" onClick={e=>{e.preventDefault();go('work');}}>{document.workLabel}</a></nav>
  <main ref={mainRef} className="frame-stage" tabIndex={-1} aria-label="Portfolio sections" data-phase={navigation.phase}>
   <section key={frameId} id={frameId} className={`frame ${frameId==='home'?'landing':activeProject?'work-frame':frameId==='work'?'empty-work-frame':`${frameId}-frame`}`} aria-label={frameId==='home'?`${document.name.replace('\n',' ')} portfolio`:activeProject?`${document.workTitle}: ${activeProject.title}`:frameId==='about'?'About':frameId==='contact'?document.contactLabel:document.workTitle}>
    {frameId==='home'?<>
     <h1 className="sr-only">{document.name.replace('\n',' ')} — Portfolio</h1>
     {document.heroImage&&<img className="hero-image" src={document.heroImage} alt={document.heroAlt} fetchPriority="high" style={{objectPosition:`${document.heroX}% ${document.heroY}%`}}/>}
     <a href="#work" className="down" aria-label="Discover selected work" onClick={e=>{e.preventDefault();go('work');}}><Arrow/></a>
    </>:activeProject?<div className="frame-work-content">
     <header className="section-header"><h2>{document.workTitle}</h2><span>{String(projectIndex+1).padStart(2,'0')} / {String(document.projects.length).padStart(2,'0')}</span></header>
     <article className="project"><button className="project-open" onClick={()=>setDetail(activeProject)} aria-label={`View ${activeProject.title}`}><ProjectImage project={activeProject} parallax={document.motion&&document.parallax}/><div className="project-caption"><span className="project-number">{String(projectIndex+1).padStart(2,'0')}</span><h3>{activeProject.title}</h3><span className="project-arrow"><UpArrow/></span></div></button><div className="project-meta"><span>{activeProject.category}</span><span>{activeProject.year}</span></div></article>
    </div>:frameId==='work'?<div className="frame-copy" data-frame-scroll tabIndex={0}><h2>{document.workTitle}</h2><p>Projects coming soon.</p></div>:frameId==='about'?<div className="frame-copy about" data-frame-scroll tabIndex={0}><p className="eyebrow">A little introduction</p><h2>{document.aboutTitle}</h2><p className="about-copy">{document.about}</p></div>:<div className="frame-copy contact" data-frame-scroll tabIndex={0}><p className="eyebrow">Have something in mind?</p><h2>{document.contactTitle}</h2>{document.email?<a className="contact-link" href={`mailto:${document.email}`}>{document.email}<span className="inline-arrow"><UpArrow/></span></a>:<p className="contact-placeholder">Contact details coming soon.</p>}{document.instagram&&<a className="social-link" href={document.instagram} target="_blank" rel="noopener noreferrer">Instagram <span className="inline-arrow"><UpArrow/></span></a>}<div className="colophon"><span>{document.name.replace('\n',' ')}</span><span>© {new Date().getFullYear()}</span></div></div>}
   </section>
  </main>
  <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{frameId==='home'?'Home':activeProject?activeProject.title:frameId==='about'?'About':frameId==='work'?document.workTitle:document.contactLabel}. Section {navigation.index+1} of {frameIds.length}.</span>
  <dialog ref={menuRef} className="menu-dialog" aria-label="Main menu" onCancel={()=>setMenu(false)} onClose={()=>setMenu(false)}><div className="dialog-head"><span>{document.name}</span><button autoFocus onClick={()=>setMenu(false)} aria-label="Close menu">Close <span aria-hidden="true">×</span></button></div><nav aria-label="Expanded navigation">{[['work',document.workLabel],['about','About'],['contact',document.contactLabel]].map(([id,label],i)=><a key={id} href={`#${id}`} onClick={e=>{e.preventDefault();go(id);}}><span className="menu-index">0{i+1}</span><span>{label}</span><span className="menu-arrow"><UpArrow/></span></a>)}</nav><span className="menu-foot">Independent ideas. Selected work.</span></dialog>
  <dialog ref={detailRef} className="detail-dialog" aria-label={detail?.title||'Project details'} onCancel={()=>setDetail(null)} onClose={()=>setDetail(null)}><div className="dialog-head"><span>Selected work</span><button autoFocus onClick={()=>setDetail(null)}>Close ×</button></div>{detail&&<div className="detail-content"><p className="eyebrow">{detail.category} / {detail.year}</p><h2>{detail.title}</h2><ProjectImage project={detail} parallax={false}/><p className="detail-description">{detail.description}</p>{detail.url&&<a className="contact-link" href={detail.url} target="_blank" rel="noopener noreferrer">Visit project <span className="inline-arrow"><UpArrow/></span></a>}</div>}</dialog>
 </div>;
}
