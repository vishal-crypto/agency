'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container, Button, Card, Section, SectionHeader, Badge } from '@/components/ui';
import { CASE_STUDIES, TESTIMONIALS } from '@/lib/constants';
import { CTASection, TestimonialsSection } from '@/components/sections';
import { ArrowRight, TrendingUp, Star } from 'lucide-react';

export function CaseStudiesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-16 lg:pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-zinc-950 to-zinc-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <Container size="lg" className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-violet-400 uppercase bg-violet-500/10 rounded-full border border-violet-500/20">
              Case Studies
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
              Real Results for
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Real Businesses
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
              Explore our portfolio of success stories and see how we&apos;ve helped 
              brands achieve exceptional growth through strategic marketing.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Case Studies */}
      <Section className="py-8 lg:py-12">
        <div className="space-y-12 lg:space-y-20">
          {CASE_STUDIES.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Visual */}
                  <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[300px] rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TrendingUp className="w-20 h-20 text-violet-500/20" />
                    </div>
                    
                    {/* Metrics overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-gradient-to-t from-zinc-900">
                      <div className="flex gap-4 lg:gap-6">
                        {caseStudy.metrics.map((metric, i) => (
                          <div key={i} className="text-center">
                            <div className="text-lg lg:text-2xl font-bold text-white">
                              {metric.value}
                            </div>
                            <div className="text-[10px] lg:text-xs text-zinc-400">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="py-2 lg:py-4">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="info">{caseStudy.industry}</Badge>
                    </div>
                    
                    <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2">
                      {caseStudy.title}
                    </h2>
                    
                    <p className="text-violet-400 font-medium mb-4">
                      {caseStudy.client}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                          The Challenge
                        </h3>
                        <p className="text-zinc-400">
                          {caseStudy.challenge}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                          Our Solution
                        </h3>
                        <p className="text-zinc-400">
                          {caseStudy.solution}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                          Key Results
                        </h3>
                        <ul className="space-y-2">
                          {caseStudy.results.map((result, i) => (
                            <li key={i} className="flex items-center gap-2 text-zinc-300">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <TestimonialsSection />

      <CTASection />
    </>
  );
}
