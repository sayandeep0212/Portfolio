import React from 'react';
import Preloader from '@/components/Preloader';
import AutumnLeaves from '@/components/AutumnLeaves';
import NightMeteors from '@/components/NightMeteors';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Widgets from '@/components/Widgets';
import GithubActivity from '@/components/GithubActivity';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import Achievements from '@/components/Achievements';
import TechStacks from '@/components/TechStacks';
import Projects from '@/components/Projects';
import Blogs from '@/components/Blogs';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0d11] text-gray-900 dark:text-gray-100 flex flex-col selection:bg-[#00c0e8]/20 selection:text-[#007f99]">
      <Preloader />
      <AutumnLeaves />
      <NightMeteors />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6">
        <Hero />
        <About />
        <Widgets />
        <GithubActivity />
        <Experience />
        <Certifications />
        <Achievements />
        <TechStacks />
        <Projects />
        <Blogs />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
