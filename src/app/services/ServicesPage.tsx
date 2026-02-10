'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container, Button, Card, Section, SectionHeader } from '@/components/ui';
import { SERVICES } from '@/lib/constants';
import { CTASection } from '@/components/sections';
import {
  Compass,
  TrendingUp,
  Search,
  Palette,
  Share2,
  BarChart3,
  LucideIcon,
  ArrowRight,
  Check,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Compass,
  TrendingUp,
  Search,
  Palette,
  Share2,
  BarChart3,
};

export function ServicesPage() {
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
              Our Services
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
              Full-Stack Marketing
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
              From strategy to execution, we provide end-to-end marketing services 
              designed to accelerate your growth and maximize ROI.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Services Grid */}
      <Section className="py-8 lg:py-12">
        <div className="space-y-16 lg:space-y-24">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.icon] || Compass;
            const isReversed = index % 2 !== 0;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-violet-400" />
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    {service.title}
                  </h2>
                  
                  <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300">
                        <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-violet-400" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/book">
                    <Button variant="primary" className="group">
                      Get Started
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                
                {/* Visual */}
                <div className="flex-1 w-full hidden lg:block">
                  <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-24 h-24 text-violet-500/20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Process Section */}
      <Section className="bg-zinc-900/30">
        <SectionHeader
          badge="Our Process"
          title="How We Work"
          subtitle="A proven methodology that delivers consistent results for our clients."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Discovery', description: 'We dive deep into your business, goals, and challenges.' },
            { step: '02', title: 'Strategy', description: 'We develop a customized roadmap for your success.' },
            { step: '03', title: 'Execution', description: 'Our team implements with precision and agility.' },
            { step: '04', title: 'Optimization', description: 'Continuous improvement based on data and insights.' },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full text-center">
                <div className="text-4xl font-bold text-violet-500/30 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
