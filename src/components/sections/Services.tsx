'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader, Card } from '@/components/ui';
import { SERVICES } from '@/lib/constants';
import {
  Compass,
  TrendingUp,
  Search,
  Palette,
  Share2,
  BarChart3,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Compass,
  TrendingUp,
  Search,
  Palette,
  Share2,
  BarChart3,
};

export function ServicesSection() {
  return (
    <Section className="bg-zinc-950">
      <SectionHeader
        badge="Our Services"
        title="Everything You Need to Dominate Digital"
        subtitle="Comprehensive marketing solutions designed to accelerate your growth and maximize ROI across every channel."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {SERVICES.map((service, index) => {
          const Icon = iconMap[service.icon] || Compass;
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover glow className="h-full group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-5 group-hover:from-violet-500/30 group-hover:to-purple-500/30 transition-colors">
                  <Icon className="w-6 h-6 text-violet-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                
                <ul className="space-y-2.5">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-500">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
