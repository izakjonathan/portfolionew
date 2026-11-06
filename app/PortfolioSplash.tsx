'use client';
import {useEffect,useRef} from 'react';
import {runSplashSequence,type SplashTarget} from '../lib/splash-sequence';
const ease='cubic-bezier(0.22,1,0.36,1)';
export default function PortfolioSplash({name,enabled,onComplete}:{name:string;enabled:boolean;onComplete:()=>void}){
 const plate=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const root=document.documentElement;
  const query=matchMedia('(prefers-reduced-motion: reduce)');
  if(!enabled||query.matches||root.dataset.portfolioIntro!=='running'){onComplete();return;}
  let cancelled=false,finished=false;const animations=new Set<Animation>(),timers=new Map<ReturnType<typeof setTimeout>,()=>void>();
  const wait=(ms:number)=>new Promise<void>(resolve=>{const timer=setTimeout(()=>{timers.delete(timer);resolve();},ms);timers.set(timer,resolve);});
  const release=()=>{timers.forEach((resolve,timer)=>{clearTimeout(timer);resolve();});timers.clear();};
  const complete=()=>{if(finished)return;finished=true;release();root.dataset.portfolioIntro='ready';try{sessionStorage.setItem('portfolio-intro-v1','seen');}catch{}onComplete();};
  const stop=()=>{cancelled=true;animations.forEach(animation=>animation.cancel());complete();};
  const animate=async(target:SplashTarget,visible:boolean,duration:number,delay=0)=>{
   // A plain colour needs no photographic backdrop reveal; keep the source's name/plate cadence.
   if(target==='backdrop'||cancelled)return;
   const el=target==='plate'?plate.current:plate.current?.querySelector<HTMLElement>('.splash-name');if(!el)return;
   const movement=target==='logo';
   const animation=el.animate(visible?[{opacity:0,transform:movement?'translate3d(0,16px,0)':'none'},{opacity:1,transform:'none'}]:[{opacity:1,transform:'none'},{opacity:0,transform:movement?'translate3d(0,-10px,0)':'none'}],{duration,delay,easing:ease,fill:'forwards'});
   animations.add(animation);await animation.finished.catch(()=>{});
  };
  void(async()=>{try{await Promise.race([document.fonts.load('500 64px "Bricolage Grotesque"').catch(()=>{}),wait(1200)]);if(cancelled)return;await runSplashSequence({active:()=>!cancelled,showLogo:true,hold:1450,animate,wait,hero:()=>{},complete});}catch{stop();}})();
  document.addEventListener('pointerdown',stop,{once:true});document.addEventListener('keydown',stop,{once:true});query.addEventListener('change',stop);
  const watchdog=setTimeout(stop,7000);
  return()=>{cancelled=true;clearTimeout(watchdog);animations.forEach(a=>a.cancel());release();document.removeEventListener('pointerdown',stop);document.removeEventListener('keydown',stop);query.removeEventListener('change',stop);};
 },[enabled,onComplete]);
 const parts=name.trim().split(/\s+/);const lines=[parts[0],parts.slice(1).join(' ')].filter(Boolean);
 return <div ref={plate} className="portfolio-splash" aria-hidden="true"><div className="splash-name">{lines.map((line,i)=><span key={i}>{line}</span>)}</div></div>;
}
