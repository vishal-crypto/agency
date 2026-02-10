import type { Service, Testimonial, CaseStudy } from '@/types';

export const SITE_CONFIG = {
  name: 'Elevate Agency',
  description: 'Premium digital marketing solutions for ambitious brands',
  tagline: 'Transform Your Digital Presence',
  email: 'hello@elevateagency.com',
  phone: '+1 (555) 123-4567',
  address: '123 Marketing Ave, Suite 500, New York, NY 10001',
};

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/about', label: 'About' },
  { href: '/book', label: 'Book a Call' },
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Digital Strategy',
    description: 'Comprehensive digital roadmaps that align with your business goals and drive measurable growth.',
    icon: 'Compass',
    features: [
      'Market & competitor analysis',
      'Customer journey mapping',
      'KPI framework development',
      'Growth opportunity identification',
    ],
  },
  {
    id: '2',
    title: 'Performance Marketing',
    description: 'Data-driven campaigns across paid channels that maximize ROI and scale your customer acquisition.',
    icon: 'TrendingUp',
    features: [
      'Google & Meta Ads management',
      'Programmatic advertising',
      'Conversion rate optimization',
      'Attribution modeling',
    ],
  },
  {
    id: '3',
    title: 'SEO & Content',
    description: 'Organic growth strategies that build authority, drive traffic, and establish thought leadership.',
    icon: 'Search',
    features: [
      'Technical SEO audits',
      'Content strategy & creation',
      'Link building campaigns',
      'Local SEO optimization',
    ],
  },
  {
    id: '4',
    title: 'Brand Development',
    description: 'Distinctive brand identities that resonate with your audience and differentiate you from competitors.',
    icon: 'Palette',
    features: [
      'Brand strategy & positioning',
      'Visual identity design',
      'Brand guidelines',
      'Messaging framework',
    ],
  },
  {
    id: '5',
    title: 'Social Media',
    description: 'Strategic social presence that builds community, drives engagement, and amplifies your brand voice.',
    icon: 'Share2',
    features: [
      'Platform strategy',
      'Content calendar management',
      'Community management',
      'Influencer partnerships',
    ],
  },
  {
    id: '6',
    title: 'Analytics & Insights',
    description: 'Deep data analysis that uncovers opportunities and provides actionable business intelligence.',
    icon: 'BarChart3',
    features: [
      'Custom dashboard setup',
      'Data integration',
      'Performance reporting',
      'Predictive analytics',
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'TechFlow',
    content: 'Elevate transformed our digital presence completely. Our lead generation increased by 340% within the first six months. Their strategic approach and attention to detail is unmatched.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Roberts',
    role: 'VP Marketing',
    company: 'Innovate Inc',
    content: 'Working with Elevate has been a game-changer. They don\'t just execute—they think like partners invested in our success. Our CAC dropped by 45% while scaling spend.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emma Williams',
    role: 'Founder',
    company: 'StyleHouse',
    content: 'The team\'s creativity and data-driven approach helped us break into new markets. Our brand awareness metrics have never been stronger.',
    rating: 5,
  },
  {
    id: '4',
    name: 'David Park',
    role: 'CMO',
    company: 'GrowthLabs',
    content: 'Elevate delivered results that exceeded our expectations. Their holistic approach to digital marketing gave us a competitive edge we didn\'t know was possible.',
    rating: 5,
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'Scaling E-commerce Revenue 5x',
    client: 'StyleHouse',
    industry: 'E-commerce / Fashion',
    challenge: 'StyleHouse was struggling with high customer acquisition costs and low return on ad spend across paid channels.',
    solution: 'We implemented a full-funnel strategy combining performance marketing, retargeting optimization, and landing page improvements.',
    results: [
      'Increased ROAS from 2.1x to 5.8x',
      'Reduced CAC by 62%',
      'Grew monthly revenue from $200K to $1.2M',
    ],
    metrics: [
      { label: 'Revenue Growth', value: '5x' },
      { label: 'ROAS Increase', value: '176%' },
      { label: 'CAC Reduction', value: '62%' },
    ],
  },
  {
    id: '2',
    title: 'B2B Lead Generation Overhaul',
    client: 'TechFlow',
    industry: 'SaaS / Enterprise',
    challenge: 'TechFlow needed to build a predictable pipeline of enterprise leads but lacked the infrastructure and strategy.',
    solution: 'We developed a multi-channel ABM strategy combining LinkedIn advertising, content marketing, and marketing automation.',
    results: [
      'Generated 340% more qualified leads',
      'Shortened sales cycle by 28%',
      'Achieved 12x ROI on marketing spend',
    ],
    metrics: [
      { label: 'Lead Increase', value: '340%' },
      { label: 'Sales Cycle', value: '-28%' },
      { label: 'Marketing ROI', value: '12x' },
    ],
  },
  {
    id: '3',
    title: 'Brand Repositioning & Launch',
    client: 'GreenLife',
    industry: 'Consumer Goods',
    challenge: 'GreenLife needed to differentiate in a crowded sustainability market and connect with younger demographics.',
    solution: 'Complete brand overhaul including positioning, visual identity, and launch campaign across digital and social channels.',
    results: [
      'Brand awareness increased 280%',
      'Social following grew from 5K to 150K',
      'Achieved sell-out launch in 72 hours',
    ],
    metrics: [
      { label: 'Brand Awareness', value: '+280%' },
      { label: 'Social Growth', value: '30x' },
      { label: 'Launch Success', value: '72hrs' },
    ],
  },
];

export const STATS = [
  { value: '150+', label: 'Clients Served' },
  { value: '$50M+', label: 'Revenue Generated' },
  { value: '340%', label: 'Avg. Growth Rate' },
  { value: '98%', label: 'Client Retention' },
];

export const WORKING_HOURS_DEFAULT = {
  start: 9, // 9 AM
  end: 17, // 5 PM
  slotDuration: 30, // minutes
  workDays: [1, 2, 3, 4, 5], // Monday to Friday
};

export const BOOKING_SETTINGS = {
  maxDaysInAdvance: 30,
  minNoticeHours: 24,
  slotDurationMinutes: 30,
};
