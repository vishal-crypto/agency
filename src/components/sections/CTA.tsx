'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button, Container } from '@/components/ui';
import { ArrowRight, Calendar } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/50 to-purple-950/50" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

      <Container size="md" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight">
            Ready to Transform Your
            <br />
            Digital Presence?
          </h2>

          <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto">
            Book a free strategy call and discover how we can help you achieve 
            your growth goals. No commitment required.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book">
              <Button variant="primary" size="lg" className="group">
                Book Your Free Strategy Call
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            30-minute call • No obligation • Actionable insights
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
