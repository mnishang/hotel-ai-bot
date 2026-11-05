"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HomeViewProps {
  setActivePage: (page: 'home' | 'about' | 'rooms' | 'contact' | 'booking') => void;
}

export default function HomeView({ setActivePage }: HomeViewProps) {
  return (
    <div className="animate-fadeIn">
      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-8 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-stone-100 leading-tight">
            Transform Your Stay <br />
            <span className="not-italic font-sans font-light text-[#addfac]">Into Timeless Luxury</span>
          </h1>
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => setActivePage('booking')}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-[#addfac] text-black font-semibold text-sm px-8 py-4 rounded-xl shadow-xl hover:brightness-110 transition-all active:scale-95"
            >
             Book Now! <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative w-full h-[400px] md:h-[520px] rounded-3xl overflow-hidden border border-stone-800 shadow-2xl">
          {/* FIXED: Changed "pic 1.jpg" to "/pic 1.jpg" */}
          <img 
            src="/pic 1.jpg" 
            alt="Whisper of the Sea Resort Pool Overlooking Ocean" 
            className="w-full h-full object-cover brightness-90 saturate-[0.85] hover:scale-105 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/40 via-transparent to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#addfac]/10 blur-[100px] rounded-full pointer-events-none"></div>
        </div>
      </section>

      {/* ACCOMMODATIONS PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#addfac]/50"></div>
          <h2 className="text-xl md:text-2xl font-serif text-[#addfac] tracking-wide">Featured Accommodations</h2>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#addfac]/50"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FIXED: Added a leading "/" to the img fields below to map to your public files */}
          {[
            { title: "Deluxe Ocean Room", sub: "Modern Elegance", img: "/pic 2.jpg" },
            { title: "Whispering Waves Suite", sub: "Minimal & Functional Space", img: "/pic 3.jpg" },
            { title: "Sanctuary Ocean Villa", sub: "Comfort & Ultimate Style", img: "/pic 4.jpg" }
          ].map((suite, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden group border border-stone-900 shadow-xl aspect-[4/5] cursor-pointer">
              <img 
                src={suite.img} 
                alt={suite.title} 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-8 left-0 right-0 px-6 space-y-1">
                <h3 className="text-xl font-serif text-stone-100 tracking-wide">{suite.title}</h3>
                <p className="text-xs text-[#addfac]/80 italic font-light tracking-wide">{suite.sub}</p>
                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <button 
                    onClick={() => setActivePage('booking')}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-white border-b border-[#addfac] pb-1 hover:text-[#addfac]"
                  >
                    Book Now!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}