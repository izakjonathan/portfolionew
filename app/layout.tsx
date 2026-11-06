import type {Metadata,Viewport} from 'next';
import './globals.css';
import {introBootstrap} from '../lib/intro-bootstrap';
export const metadata:Metadata={title:'Izak Hyllested — Portfolio',description:'Selected work and independent digital experiences.'};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#c6beac'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><link rel="preload" href="/fonts/BricolageGrotesque-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><script dangerouslySetInnerHTML={{__html:introBootstrap}}/>{children}</body></html>;}
