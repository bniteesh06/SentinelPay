import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import About from '../components/About';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Stats />
      <About />
    </main>
  );
}
