'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OpeningPage from '@/components/OpeningPage';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CinematicScroll from '@/components/CinematicScroll';
import AboutSection from '@/components/sections/AboutSection';
import ServicesPreview from '@/components/sections/ServicesPreview';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';

export default function Page() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showPreloader && (
          <OpeningPage key="preloader" onComplete={() => setShowPreloader(false)} />
        )}
      </AnimatePresence>

      {!showPreloader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative min-h-screen flex flex-col"
        >
          <Navbar />
          <main className="flex-grow">
            <Hero />
            <CinematicScroll />
            <AboutSection />
            <ServicesPreview />
            <TestimonialsSection />
            <ContactSection />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
