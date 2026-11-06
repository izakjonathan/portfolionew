import type {Metadata,Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Izak Hyllested — Portfolio',description:'Selected work and independent digital experiences.'};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#c6beac'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
