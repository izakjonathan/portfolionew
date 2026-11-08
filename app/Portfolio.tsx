'use client';
import {useCallback,useEffect,useRef,useState,type CSSProperties} from 'react';
import {defaults,validateDocument,type Document,type Project} from '../lib/content';
import {afterPaint} from '../lib/motion';
import {useFrameNavigation} from './useFrameNavigation';
import RevealHeading from './RevealHeading';
import TextReveals from './TextReveals';
import PortfolioMenu from './PortfolioMenu';
import PortfolioSplash from './PortfolioSplash';
import LandingServices from './LandingServices';
function UpArrow(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.25"/></svg>;}
function PracticeMark(){return <svg className="practice-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M12 50h76M50 12v76M23 23l54 54M23 77l54-54" stroke="currentColor" strokeWidth="9"/></svg>;}
function Arrow(){return <svg viewBox="0 0 42 76" fill="none" aria-hidden="true"><path d="M21 2v69M3 51l18 21 18-21" stroke="currentColor" strokeWidth="1.4"/></svg>;}
function ProjectImage({project,parallax}:{project:Project;parallax:boolean}){return <div className={`project-image ${parallax?'frame-image-motion':''}`}>{project.image?<img src={project.image} alt={project.alt} loading="eager" style={{objectPosition:`${project.cropX}% ${project.cropY}%`}}/>:<div className="project-empty">{project.title}</div>}</div>;}
export default function Portfolio({initial=defaults,preview=false}:{initial?:Document;preview?:boolean}){
 const [document,setDocument]=useState(initial);const [menu,setMenu]=useState(false);const [ready,setReady]=useState(false);const [detail,setDetail]=useState<Project|null>(null);const [menuMounted,setMenuMounted]=useState(false);const [intro,setIntro]=useState(!preview);const finishIntro=useCallback(()=>setIntro(false),[]);const detailRef=useRef<HTMLDialogElement>(null);const mainRef=useRef<HTMLElement>(null);
 const frameIds=['home',...document.projects.map((p,i)=>i===0?'work':`project-${p.id}`),...(document.projects.length?[]:['work']),'about',...document.services.map((service,i)=>i===0?'services':`service-${service.id}`),'contact'];
 const navigation=useFrameNavigation(frameIds,document.motion,menu||menuMounted||intro||!!detail,mainRef);
 const frameId=frameIds[navigation.index];
 const projectIndex=navigation.index-1;
 const activeProject=frameId==='work'||frameId?.startsWith('project-')?document.projects[projectIndex]:undefined;
 useEffect(()=>{if(intro)return;return afterPaint(()=>setReady(true));},[intro]);
 useEffect(()=>{const next=document.projects[navigation.index]?.image;if(next){const image=new window.Image();image.src=next;}},[document.projects,navigation.index]);
 useEffect(()=>{if(!preview)return;const receive=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='portfolio-preview')return;try{setDocument(validateDocument(event.data.document));}catch{}};addEventListener('message',receive);parent.postMessage({type:'portfolio-preview-ready'},location.origin);return()=>removeEventListener('message',receive);},[preview]);
 useEffect(()=>{if(detail)detailRef.current?.showModal();else detailRef.current?.close();},[detail]);
 useEffect(()=>{if(preview)return;const meta=window.document.querySelector('meta[name="theme-color"]');const old=meta?.getAttribute('content');meta?.setAttribute('content',document.background);return()=>{if(old)meta?.setAttribute('content',old);};},[document.background,preview]);
 const go=(id:string)=>{setMenu(false);setDetail(null);const target=frameIds.indexOf(id);if(target>=0)navigation.go(target,menu||menuMounted);};
 const renderFrame=(index:number,outgoing=false)=>{
  const frameId=frameIds[index],projectIndex=index-1;
  const activeProject=frameId==='work'||frameId?.startsWith('project-')?document.projects[projectIndex]:undefined;
  const service=document.services.find((service,i)=>(i===0?'services':`service-${service.id}`)===frameId);
  return (<section key={frameId} id={outgoing?undefined:frameId} inert={outgoing} aria-hidden={outgoing||undefined} className={`frame ${outgoing?'frame-outgoing':'frame-current'} ${frameId==='home'?'landing':activeProject?'work-frame':frameId==='work'?'empty-work-frame':`${frameId}-frame`}`} aria-label={frameId==='home'?`${document.name.replace('\n',' ')} portfolio`:activeProject?`${document.workTitle}: ${activeProject.title}`:frameId==='about'?'About':service?service.title.replace('\n',' '):frameId==='contact'?document.contactLabel:document.workTitle}>
    {frameId==='home'?<>
     {document.heroImage&&<img className="hero-image" src={document.heroImage} alt={document.heroAlt} fetchPriority="high" style={{objectPosition:`${document.heroX}% ${document.heroY}%`}}/>}
     <div className="landing-copy">
      <div className="landing-meta" data-reveal><span><span className="status-dot"/>Independent design practice</span><span>Copenhagen, DK</span></div>
      <RevealHeading as="h1" className="landing-title">{document.landingTitle}</RevealHeading>
      <div className="landing-bottom">
       <div className="landing-offer"><span className="micro-label" data-reveal>From the first idea to the final interaction.</span><LandingServices text={document.landingServices} enabled={document.motion} active={!outgoing&&!intro&&!menu&&!menuMounted&&!detail}/></div>
       {document.projects.length>0&&<div className="landing-selection" data-reveal><div className="selection-label"><span>Selected projects</span><span>01 — {String(document.projects.length).padStart(2,'0')}</span></div><div className="selection-images">{document.projects.slice(0,2).map((project,i)=><a key={project.id} href={i===0?'#work':`#project-${project.id}`} onClick={e=>{e.preventDefault();go(i===0?'work':`project-${project.id}`);}} aria-label={`Explore ${project.title}`}><img src={project.image} alt={project.alt}/><span>{project.title}<UpArrow/></span></a>)}</div></div>}
      </div>
     </div>
     <a href="#work" className="down" aria-label="Discover selected work" onClick={e=>{e.preventDefault();go('work');}}><span>Scroll to explore</span><Arrow/></a>
    </>:activeProject?<div className="frame-work-content">
     <header className="section-header"><span className="micro-label">{document.workTitle}</span><span>{String(projectIndex+1).padStart(2,'0')} / {String(document.projects.length).padStart(2,'0')}</span></header>
     <article className="project">
      <div className="project-heading"><RevealHeading as="h2">{activeProject.title}</RevealHeading><span className="project-year">{activeProject.year}</span></div>
      <button className="project-open" onClick={()=>setDetail(activeProject)} aria-label={`View ${activeProject.title}`}><ProjectImage project={activeProject} parallax={document.motion&&document.parallax}/><span className="project-view">View project <UpArrow/></span></button>
      <div className="project-caption" data-reveal><span>{activeProject.category}</span><p>{activeProject.description}</p><button className="text-link" onClick={()=>setDetail(activeProject)} aria-label={`Read about ${activeProject.title}`}>Explore case <UpArrow/></button></div>
     </article>
     <div className="work-pagination"><button disabled={projectIndex===0} onClick={()=>go(projectIndex===1?'work':`project-${document.projects[projectIndex-1].id}`)} aria-label="Previous project">← Previous</button><span>Project {String(projectIndex+1).padStart(2,'0')}</span><button disabled={projectIndex===document.projects.length-1} onClick={()=>go(`project-${document.projects[projectIndex+1].id}`)} aria-label="Next project">Next →</button></div>
    </div>:frameId==='work'?<div className="frame-copy" data-frame-scroll tabIndex={0}><RevealHeading>{document.workTitle}</RevealHeading><p>Projects coming soon.</p></div>:service?<div className="frame-copy service" data-frame-scroll tabIndex={0}>
      <div className="copy-topline"><span className="micro-label">What I do</span><span>0{document.services.indexOf(service)+1} / 0{document.services.length}</span></div>
      <div className="service-heading"><RevealHeading>{service.title}</RevealHeading><PracticeMark/></div>
      <div className="service-lower"><RevealHeading as="p" className="eyebrow">{service.label}</RevealHeading><div><RevealHeading as="p" className="service-copy">{service.description}</RevealHeading><div className="service-tags" data-reveal>{service.tags.split(/\s*·\s*/).filter(Boolean).map((tag,i)=><span key={tag}><small>0{i+1}</small>{tag}<span aria-hidden="true">↗</span></span>)}</div></div></div>
     </div>:frameId==='about'?<div className="frame-copy about" data-frame-scroll tabIndex={0}>
      <div className="copy-topline"><span className="micro-label">Behind the work</span><span>Copenhagen, DK</span></div>
      <div className="about-composition"><div className="about-title"><RevealHeading>{document.aboutTitle}</RevealHeading></div>{document.profileImage&&<figure className="profile"><img className="profile-image" src={document.profileImage} alt={`Portrait of ${document.name.replace('\n',' ')}`}/><figcaption>{document.name.replace('\n',' ')}<span>Design + Code</span></figcaption></figure>}</div>
      <div className="about-bottom"><span className="eyebrow">An independent perspective.</span><RevealHeading as="p" className="about-copy">{document.about}</RevealHeading></div>
     </div>:<div className="frame-copy contact" data-frame-scroll tabIndex={0}>
      <div className="copy-topline"><span className="micro-label">Next starts here</span><span>Copenhagen / Worldwide</span></div>
      <div className="contact-title"><RevealHeading>{document.contactTitle}</RevealHeading><PracticeMark/></div>
      <div className="contact-bottom"><span className="eyebrow">Have something in mind?<br/>Let’s talk it through.</span><div>{document.email?<a className="contact-link" data-reveal href={`mailto:${document.email}`}><span>{document.email}</span><UpArrow/></a>:<p className="contact-placeholder">Contact details coming soon.</p>}{document.instagram&&<a className="social-link" href={document.instagram} target="_blank" rel="noopener noreferrer">Instagram <UpArrow/></a>}</div></div>
      <div className="colophon"><span>{document.name.replace('\n',' ')}</span><span>Independent by design.</span><span>© {new Date().getFullYear()}</span></div>
     </div>}

   </section>);
 };
 const vars={'--frame-direction':navigation.direction,'--paper':document.background,'--ink':document.foreground,'--grain':document.grain/100*.14} as CSSProperties;
 return <div className={`portfolio ${ready?'is-ready':''} ${document.motion?'':'no-motion'}`} style={vars} data-intro={intro&&document.motion?'splash':'ready'}>
  {intro&&!preview&&<PortfolioSplash name={document.name} enabled={document.motion} onComplete={finishIntro}/>}
  <a className="skip" href="#work" onClick={e=>{e.preventDefault();go('work');}}>Skip to work</a>
  <nav aria-label="Main navigation" className="corners" inert={intro&&!preview&&document.motion} data-intro-inert><a href="#home" className="corner top-left" onClick={e=>{e.preventDefault();go('home');}}>{document.name}</a><button className="corner top-right" aria-haspopup="dialog" aria-expanded={menu} onClick={()=>setMenu(true)}>{document.menuLabel}</button><a className="corner bottom-left" href="#contact" onClick={e=>{e.preventDefault();go('contact');}}>{document.contactLabel}</a><a className="corner bottom-right" href="#work" onClick={e=>{e.preventDefault();go('work');}}>{document.workLabel}</a></nav>
  <main ref={mainRef} className="frame-stage" tabIndex={-1} aria-label="Portfolio sections" data-phase={navigation.phase} inert={intro&&!preview&&document.motion} data-intro-inert>
   {navigation.previous!==null&&renderFrame(navigation.previous,true)}
   {renderFrame(navigation.index)}
  </main>
  {frameId!=='home'&&<div className="frame-position" aria-hidden="true"><span>{String(navigation.index+1).padStart(2,'0')}</span><span className="position-rule"/><span>{String(frameIds.length).padStart(2,'0')}</span></div>}
  <TextReveals stage={mainRef} frame={frameId} enabled={document.motion} covered={intro||menu||menuMounted}/>
  <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{frameId==='home'?'Home':activeProject?activeProject.title:frameId==='about'?'About':frameId==='services'||frameId?.startsWith('service-')?'Services':frameId==='work'?document.workTitle:document.contactLabel}. Section {navigation.index+1} of {frameIds.length}.</span>
  <PortfolioMenu open={menu} name={document.name} links={[["work",document.workLabel],["about","About"],...(document.services.length?[["services","Services"] as [string,string]]:[]),["contact",document.contactLabel]]} motion={document.motion} onClose={()=>setMenu(false)} onNavigate={go} onMounted={setMenuMounted}/>
  <dialog ref={detailRef} className="detail-dialog" aria-label={detail?.title||'Project details'} onCancel={()=>setDetail(null)} onClose={()=>setDetail(null)}><div className="dialog-head"><span>Selected work / Case study</span><button autoFocus onClick={()=>setDetail(null)}>Close ×</button></div>{detail&&<div className="detail-content"><p className="eyebrow">{detail.category} / {detail.year}</p><RevealHeading>{detail.title}</RevealHeading><ProjectImage project={detail} parallax={false}/><p className="detail-description">{detail.description}</p>{detail.status&&<p className="eyebrow">{detail.status}</p>}{detail.subtitle&&<p className="detail-subtitle">{detail.subtitle}</p>}{(["challenge","approach","solution","outcome"] as const).map(key=>detail[key]&&<section className="case-section" key={key}><h3>{key[0].toUpperCase()+key.slice(1)}</h3><p>{detail[key]}</p></section>)}{detail.url&&<a className="contact-link" href={detail.url} target="_blank" rel="noopener noreferrer">Visit project <span className="inline-arrow"><UpArrow/></span></a>}</div>}</dialog>
 </div>;
}
