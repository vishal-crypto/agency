'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader, Card } from '@/components/ui';
import { TESTIMONIALS } from '@/lib/constants';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <Section className="bg-gradient-to-b from-zinc-950 to-zinc-900/50">
      <SectionHeader
        badge="Client Success"
        title="Trusted by Industry Leaders"
        subtitle="Don't take our word for it. Here's what our clients have to say about working with us."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {TESTIMONIALS.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <Quote className="w-8 h-8 text-violet-500/30 mb-4 shrink-0" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              
              <p className="text-zinc-300 leading-relaxed mb-6 flex-1">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">{testimonial.name}</div>
                  <div className="text-sm text-zinc-500">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
