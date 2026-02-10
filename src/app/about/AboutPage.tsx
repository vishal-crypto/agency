'use client';

import { motion } from 'framer-motion';
import { Container, Card, Section, SectionHeader } from '@/components/ui';
import { STATS } from '@/lib/constants';
import { CTASection } from '@/components/sections';
import { Target, Heart, Zap, Users, Award, Globe } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'Every strategy we develop is focused on measurable outcomes that impact your bottom line.',
  },
  {
    icon: Heart,
    title: 'Client-Centric',
    description: 'We treat your business as our own, building partnerships based on trust and transparency.',
  },
  {
    icon: Zap,
    title: 'Innovation-First',
    description: 'We stay ahead of trends and leverage cutting-edge tools to give you a competitive edge.',
  },
  {
    icon: Users,
    title: 'Collaborative',
    description: 'We work as an extension of your team, ensuring alignment and open communication.',
  },
];

const team = [
  { name: 'Alex Morgan', role: 'CEO & Founder', bio: 'Former VP of Marketing at Fortune 500' },
  { name: 'Jordan Lee', role: 'Head of Strategy', bio: '15+ years in digital transformation' },
  { name: 'Taylor Chen', role: 'Creative Director', bio: 'Award-winning brand designer' },
  { name: 'Riley Parker', role: 'Head of Performance', bio: 'Ex-Google, data-driven marketer' },
];

export function AboutPage() {
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
              About Us
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
              Building Brands That
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Stand Out
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
              We&apos;re a team of strategists, creatives, and data scientists united 
              by a passion for helping ambitious brands reach their full potential.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats */}
      <Section className="py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Story Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>
                Elevate Agency was founded in 2018 with a simple mission: to help 
                forward-thinking brands cut through the noise and achieve meaningful 
                growth in the digital age.
              </p>
              <p>
                What started as a two-person team has grown into a full-service agency 
                serving clients across industries—from ambitious startups to established 
                enterprises.
              </p>
              <p>
                We believe that great marketing is built on the intersection of creativity 
                and data. Every campaign we run, every strategy we develop, is informed 
                by insights and optimized for results.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-32 h-32 text-violet-500/20" />
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-zinc-900/30">
        <SectionHeader
          badge="Our Values"
          title="What We Stand For"
          subtitle="The principles that guide everything we do."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-zinc-400">
                  {value.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeader
          badge="Our Team"
          title="Meet the Experts"
          subtitle="A diverse team of specialists dedicated to your success."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-4">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-violet-400 text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-zinc-500 text-sm">
                  {member.bio}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Awards */}
      <Section className="bg-zinc-900/30">
        <SectionHeader
          badge="Recognition"
          title="Awards & Accolades"
          subtitle="Recognized by industry leaders for excellence in digital marketing."
        />

        <div className="flex flex-wrap justify-center gap-8">
          {['Forbes 30 Under 30', 'Clutch Top Agency 2025', 'Google Premier Partner', 'Meta Business Partner'].map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 px-6 py-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
            >
              <Award className="w-5 h-5 text-violet-400" />
              <span className="text-zinc-300 font-medium">{award}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
