import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
export function Layout({ children }) {
  return <div className="relative min-h-screen flex flex-col bg-transparent font-sans text-gray-900">
      <div className="healing-backdrop" aria-hidden="true">
        <div className="healing-backdrop__glow" />
        <div className="healing-backdrop__blob healing-backdrop__blob--mint" />
        <div className="healing-backdrop__blob healing-backdrop__blob--sky" />
        <div className="healing-backdrop__blob healing-backdrop__blob--rose" />
      </div>
      <Header />
      <main className="relative z-10 flex-grow">{children}</main>
      <Footer />
    </div>;
}
