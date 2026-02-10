'use client';

import Link from 'next/link';
import { Container } from '@/components/ui';
import { SITE_CONFIG, NAV_LINKS, SERVICES } from '@/lib/constants';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <Container size="xl">
        <div className="py-12 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block">
                <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {SITE_CONFIG.name}
                </span>
              </Link>
              <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                {SITE_CONFIG.description}. We help ambitious brands scale through
                strategic digital marketing.
              </p>
              <div className="flex gap-4 mt-6">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Services
              </h4>
              <ul className="space-y-3">
                {SERVICES.slice(0, 5).map((service) => (
                  <li key={service.id}>
                    <Link
                      href="/services"
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex items-start gap-3 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <Mail size={16} className="mt-0.5 shrink-0" />
                    {SITE_CONFIG.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="flex items-start gap-3 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <Phone size={16} className="mt-0.5 shrink-0" />
                    {SITE_CONFIG.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-400">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  {SITE_CONFIG.address}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-zinc-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/login"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
