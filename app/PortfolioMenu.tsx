'use client';
import {useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import {afterPaint} from '../lib/motion';
function MenuLabel({label}:{label:string}){return <span className="menu-label"><span className="menu-label-source">{label}</span><span className="menu-label-visual" aria-hidden="true">{Array.from(new Intl.Segmenter('en',{granularity:'grapheme'}).segment(label)).map(({segment,index},i)=><span className="menu-letter-mask" key={index} style={{'--letter-index':i} as CSSProperties}><span className="menu-letter-track"><span>{segment===' '?'\u00a0':segment}</span><span>{segment===' '?'\u00a0':segment}</span></span></span>)}</span></span>;}
export default function PortfolioMenu({open,name,links,motion,onClose,onNavigate,onMounted}:{open:boolean;name:string;links:[string,string][];motion:boolean;onClose:()=>void;onNavigate:(id:string)=>void;onMounted:(mounted:boolean)=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [phase,setPhase]=useState<'closed'|'opening'|'open'|'closing'>('closed');
 useLayoutEffect(()=>{
  const el=dialog.current;if(!el)return;
  const reduced=!motion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(open){
   onMounted(true);if(!el.open)el.showModal();setPhase('opening');
   if(reduced){setPhase('open');return;}
   return afterPaint(()=>setPhase('open'));
  }
  if(!el.open)return;
  const finish=()=>{el.close();setPhase('closed');onMounted(false);};
  if(reduced){finish();return;}
  setPhase('closing');
  const duration=parseFloat(getComputedStyle(el).getPropertyValue('--duration-menu'))||680;
  const timer=setTimeout(finish,duration+40);return()=>clearTimeout(timer);
 },[open,motion,onMounted]);
 return <dialog ref={dialog} className="menu-dialog" data-phase={phase} aria-label="Main menu" onCancel={e=>{e.preventDefault();onClose();}} onClose={onClose}>
  <div className="dialog-head"><span>{name}</span><button autoFocus onClick={onClose} aria-label="Close menu">Close <span aria-hidden="true">×</span></button></div>
  <nav aria-label="Expanded navigation">{links.map(([id,label],i)=><a key={id} href={`#${id}`} style={{'--item':i} as CSSProperties} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onNavigate(id);}}><span className="menu-index">0{i+1}</span><MenuLabel label={label}/><span className="menu-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.25"/></svg></span></a>)}</nav>
  <span className="menu-foot">Independent ideas. Selected work.</span>
 </dialog>;
}
