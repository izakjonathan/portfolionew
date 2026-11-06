'use client';
import {useCallback,useEffect,useRef,useState,type RefObject} from 'react';

/** One gesture advances one full frame. Trackpad momentum cannot queue more pages. */
export function useFrameNavigation(ids:string[],motion:boolean,blocked:boolean,stage:RefObject<HTMLElement|null>){
 const [index,setIndex]=useState(0);
 const [phase,setPhase]=useState<'idle'|'entering'>('idle');
 const [previous,setPrevious]=useState<number|null>(null);
 const [direction,setDirection]=useState(1);
 const current=useRef(0),locked=useRef(false),timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 const settings=useRef({ids,motion,blocked});
 settings.current={ids,motion,blocked};
 const go=useCallback((target:number,instant=false)=>{
  const config=settings.current;
  const next=Math.max(0,Math.min(config.ids.length-1,target));
  if(locked.current||next===current.current)return;
  timers.current.forEach(clearTimeout);timers.current=[];
  const forward=next>current.current?1:-1;
  const animate=!instant&&config.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const oldFrame=stage.current?.querySelector('.frame');
  const focusWasInside=oldFrame?.contains(document.activeElement);
  const land=()=>{
   current.current=next;setIndex(next);
   history.replaceState(null,'',`#${config.ids[next]}`);
   if(focusWasInside)stage.current?.focus({preventScroll:true});
  };
  setDirection(forward);
  if(!animate){setPrevious(null);land();setPhase('idle');return;}
  locked.current=true;setPrevious(current.current);land();setPhase('entering');
  timers.current.push(setTimeout(()=>{locked.current=false;setPrevious(null);setPhase('idle');},1200));
 },[stage]);
 const step=useCallback((delta:number)=>go(current.current+delta),[go]);
 useEffect(()=>{
  const root=document.documentElement;
  root.classList.add('portfolio-active');
  return()=>{root.classList.remove('portfolio-active');timers.current.forEach(clearTimeout);};
 },[]);
 const idKey=ids.join('|');
 useEffect(()=>{
  const readHash=()=>{const target=settings.current.ids.indexOf(location.hash.slice(1));if(target>=0)go(target,true);};
  // Initial hashes and browser history must reach the same exact stops as gestures.
  readHash();addEventListener('hashchange',readHash);
  if(current.current>=settings.current.ids.length)go(settings.current.ids.length-1,true);
  return()=>removeEventListener('hashchange',readHash);
 },[idKey,go]);
 useEffect(()=>{
  let wheelSum=0,gestureUsed=false,quiet:ReturnType<typeof setTimeout>|undefined;
  let touch:{x:number;y:number;target:EventTarget|null;innerScrolled:boolean}|null=null;
  const inner=(target:EventTarget|null)=>target instanceof Element?target.closest<HTMLElement>('[data-frame-scroll]'):null;
  const canScroll=(el:HTMLElement|null,delta:number)=>!!el&&el.scrollHeight>el.clientHeight+2&&(delta>0?el.scrollTop+el.clientHeight<el.scrollHeight-2:el.scrollTop>2);
  const isDialog=(target:EventTarget|null)=>target instanceof Element&&!!target.closest('dialog');
  const wheel=(event:WheelEvent)=>{
   if(settings.current.blocked||event.ctrlKey||isDialog(event.target))return;
   if(Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY)return;
   clearTimeout(quiet);quiet=setTimeout(()=>{gestureUsed=false;wheelSum=0;},200);
   if(canScroll(inner(event.target),event.deltaY)){gestureUsed=true;return;}
   event.preventDefault();
   if(locked.current){gestureUsed=true;return;}
   if(gestureUsed)return;
   const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
   if(Math.sign(delta)!==Math.sign(wheelSum))wheelSum=0;
   wheelSum+=delta;
   if(Math.abs(wheelSum)>=42){gestureUsed=true;step(Math.sign(wheelSum));}
  };
  const touchStart=(event:TouchEvent)=>{touch=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY,target:event.target,innerScrolled:false}:null;};
  const touchMove=(event:TouchEvent)=>{
   if(!touch||event.touches.length!==1||settings.current.blocked||isDialog(event.target))return;
   const delta=touch.y-event.touches[0].clientY;
   if(Math.abs(delta)<8)return;
   if(canScroll(inner(touch.target),delta)){touch.innerScrolled=true;return;}
   if(!touch.innerScrolled&&Math.abs(delta)>Math.abs(touch.x-event.touches[0].clientX))event.preventDefault();
  };
  const touchEnd=(event:TouchEvent)=>{
   if(!touch)return;const start=touch;touch=null;
   if(settings.current.blocked||start.innerScrolled||isDialog(start.target)||!event.changedTouches[0])return;
   const dy=start.y-event.changedTouches[0].clientY,dx=start.x-event.changedTouches[0].clientX;
   if(Math.abs(dy)>=48&&Math.abs(dy)>Math.abs(dx)*1.2)step(Math.sign(dy));
  };
  const key=(event:KeyboardEvent)=>{
   if(settings.current.blocked||event.ctrlKey||event.metaKey||event.altKey||isDialog(event.target))return;
   const target=event.target instanceof Element?event.target:null;
   if(target?.closest('input,textarea,select,[contenteditable="true"]'))return;
   const delta=['ArrowDown','PageDown'].includes(event.key)?1:['ArrowUp','PageUp'].includes(event.key)?-1:event.key===' '&&!target?.closest('button,a')?(event.shiftKey?-1:1):0;
   if(canScroll(inner(event.target),delta))return;
   if(delta){event.preventDefault();if(!event.repeat)step(delta);}
   else if(event.key==='Home'||event.key==='End'){event.preventDefault();go(event.key==='Home'?0:settings.current.ids.length-1);}
  };
  const cancelTouch=()=>{touch=null;};
  addEventListener('wheel',wheel,{passive:false});addEventListener('touchstart',touchStart,{passive:true});addEventListener('touchmove',touchMove,{passive:false});addEventListener('touchend',touchEnd,{passive:true});addEventListener('touchcancel',cancelTouch);addEventListener('keydown',key);
  return()=>{clearTimeout(quiet);removeEventListener('wheel',wheel);removeEventListener('touchstart',touchStart);removeEventListener('touchmove',touchMove);removeEventListener('touchend',touchEnd);removeEventListener('touchcancel',cancelTouch);removeEventListener('keydown',key);};
 },[go,step]);
 return{index:Math.min(index,ids.length-1),previous,phase,direction,go};
}
