'use client';
import {useLayoutEffect,type RefObject} from 'react';
import {afterPaint} from '../lib/motion';
/** Adapted from the source PageMotion: masked headings and staggered block arrivals. */
export default function TextReveals({stage,frame,covered,enabled}:{stage:RefObject<HTMLElement|null>;frame:string;covered:boolean;enabled:boolean}){
 useLayoutEffect(()=>{
  const elements=Array.from(stage.current?.querySelectorAll<HTMLElement>('.frame-current [data-reveal]')??[]);
  const reduce=!enabled||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pending=elements.filter(el=>el.dataset.revealed!=='true');
  pending.forEach(el=>{el.classList.add('reveal-pending');el.classList.remove('reveal-visible');});
  if(covered&&!reduce)return;
  const reveal=()=>pending.forEach((el,i)=>{el.style.setProperty('--reveal-delay',`${reduce?0:140+Math.min(i*80,160)}ms`);el.classList.remove('reveal-pending');el.classList.add('reveal-visible');el.dataset.revealed='true';});
  if(reduce){reveal();return;}
  return afterPaint(reveal);
 },[stage,frame,covered,enabled]);
 return null;
}
