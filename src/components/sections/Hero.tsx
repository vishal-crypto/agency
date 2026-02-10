'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button, Container } from '@/components/ui';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-zinc-950 to-zinc-950" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      
      <Container size="lg" className="relative z-10 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-400 bg-violet-500/10 rounded-full border border-violet-500/20">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              Now Accepting New Clients for Q1 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-tight"
          >
            Scale Your Brand With
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              Strategic Marketing
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            We partner with ambitious brands to create data-driven marketing 
            strategies that drive growth, build authority, and deliver measurable ROI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/book">
              <Button variant="primary" size="lg" className="group">
                Book a Strategy Call
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/case-studies">
              <Button variant="outline" size="lg" className="group">
                <Play size={16} className="mr-2" />
                View Case Studies
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 lg:gap-16 max-w-3xl mx-auto"
          >
            {[
              { value: '150+', label: 'Clients Served' },
              { value: '$50M+', label: 'Revenue Generated' },
              { value: '340%', label: 'Avg. Growth Rate' },
              { value: '98%', label: 'Client Retention' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-zinc-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
