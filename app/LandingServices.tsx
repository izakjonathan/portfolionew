'use client';
import {useEffect,useState,useSyncExternalStore} from 'react';
import {serviceWords} from '../lib/landing';
const subscribeMotion=(notify:()=>void)=>{const query=matchMedia('(prefers-reduced-motion: reduce)');query.addEventListener('change',notify);return()=>query.removeEventListener('change',notify);};
const reducedSnapshot=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Persistent overlapping grid cells reserve the longest phrase's space. */
export default function LandingServices({text,enabled,active}:{text:string;enabled:boolean;active:boolean}){
 const words=serviceWords(text);
 const [index,setIndex]=useState(0),[previous,setPrevious]=useState<number|null>(null),[paused,setPaused]=useState(false),[hidden,setHidden]=useState(false);
 const reduced=useSyncExternalStore(subscribeMotion,reducedSnapshot,()=>true);
 const moving=enabled&&!reduced;
 const current=index%Math.max(words.length,1);
 useEffect(()=>{const visibility=()=>setHidden(document.hidden);visibility();document.addEventListener('visibilitychange',visibility);return()=>document.removeEventListener('visibilitychange',visibility);},[]);
 useEffect(()=>{
  if(!moving||!active||paused||hidden||words.length<2)return;
  const timer=setTimeout(()=>{setPrevious(current);setIndex((current+1)%words.length);},3600);
  return()=>clearTimeout(timer);
 },[moving,active,paused,hidden,current,words.length]);
 useEffect(()=>{if(previous===null)return;const timer=setTimeout(()=>setPrevious(null),1100);return()=>clearTimeout(timer);},[previous,index]);
 if(!words.length)return null;
 return <div className="landing-subtitle" data-reveal>
  <span className="sr-only">We do: {words.join(', ')}.</span>
  <div className={`landing-service-line ${moving?'is-rotating':'is-static'}`}>
   <span aria-hidden="true" className="landing-service-prefix">We do:</span>
   <span className="service-rotator" aria-hidden="true">{words.map((word,i)=><span key={word} className={`rotating-service ${i===current?'is-current':i===previous?'is-leaving':''}`}>{word}</span>)}</span>
   <span className="services-static" aria-hidden="true">{words.join(' · ')}</span>
   {moving&&words.length>1&&<button className="service-pause" type="button" aria-label={paused?'Play service animation':'Pause service animation'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 7 5-7 5Z" fill="currentColor"/></svg>:<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.4"/></svg>}</button>}
  </div>
 </div>;
}
