// Libs
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  Inbox,
  ArrowLeftRight,
  Users,
  Zap,
  GalleryVerticalEnd,
  BookOpen,
  Boxes,
  Clock,
  ShieldCheck,
  Palette,
} from "lucide-react";

export interface ShowcaseTab {
  key: string;
  label: string;
  icon: LucideIcon;
  image: string;
  alt: string;
}

export const BOOK_DEMO_URL =
  "https://calendly.com/trishaneww/30min?month=2026-06";

export const FOOTER_FEATURE_LINKS = [
  { label: "Calendar sync", href: "#calendar" },
  { label: "Automated reminders", href: "#reminders" },
  { label: "Payments & deposits", href: "#payments" },
  { label: "Flashbook", href: "#flashbook" },
];

export const SHOWCASE_ROTATE_MS = 4000;

export const SHOWCASE_TABS: ShowcaseTab[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    image: "/landing/dashboard.png",
    alt: "Inkspace dashboard with earnings, booking pipeline and upcoming appointments",
  },
  {
    key: "calendar",
    label: "Calendar",
    icon: CalendarDays,
    image: "/landing/calendar.png",
    alt: "Inkspace weekly calendar of tattoo sessions and consultations",
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: Inbox,
    image: "/landing/bookings.png",
    alt: "Inkspace bookings inbox of client tattoo requests",
  },
  {
    key: "transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
    image: "/landing/transactions.png",
    alt: "Inkspace transactions view with income, deposits and payouts",
  },
  {
    key: "clients",
    label: "Clients",
    icon: Users,
    image: "/landing/clients.png",
    alt: "Inkspace client directory",
  },
  {
    key: "flashbook",
    label: "Flashbook",
    icon: Zap,
    image: "/landing/flashbook.png",
    alt: "Inkspace flashbook of available tattoo flash designs",
  },
  {
    key: "portfolio",
    label: "Portfolio",
    icon: GalleryVerticalEnd,
    image: "/landing/portfolio.png",
    alt: "Inkspace portfolio of finished tattoo work",
  },
  {
    key: "open-book",
    label: "Open Book",
    icon: BookOpen,
    image: "/landing/open-booking.png",
    alt: "Inkspace Open Book public booking page",
  },
];

export interface FeatureRow {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export const RIBBED_PANELS = [
  "/landing/ribbed-panel-1.png",
  "/landing/ribbed-panel-2.png",
  "/landing/ribbed-panel-3.png",
  "/landing/ribbed-panel-4.png",
  "/landing/ribbed-panel-5.png",
];

export const FEATURE_ROWS: FeatureRow[] = [
  {
    key: "openbook",
    eyebrow: "Open Book",
    title: "One link replaces the DM chaos",
    description:
      "Share your own customizable booking link and let clients send structured requests with every detail you need up front. No more piecing bookings together from Instagram DMs, cold emails, and scattered messages.",
    image: "/landing/open-book-panel.png",
    alt: "An artist's customizable Inkspace Open Book booking page",
  },
  {
    key: "calendar",
    eyebrow: "Scheduling",
    title: "Your calendar, always in sync",
    description:
      "Every session and consultation lives on one calendar — and syncs straight to your Google Calendar, so your whole life stays in one place and you never double-book.",
    image: "/landing/calendar-panel.png",
    alt: "Inkspace calendar syncing with Google Calendar",
  },
  {
    key: "reminders",
    eyebrow: "Automations",
    title: "We handle the busywork",
    description:
      "Inkspace automatically texts and emails your clients their appointment and deposit reminders — so you cut no-shows, keep your books full, and never have to chase anyone again.",
    image: "/landing/automation-panel.png",
    alt: "Automated SMS and email reminders sent to clients",
  },
  {
    key: "payments",
    eyebrow: "Payments",
    title: "Deposits that protect your time",
    description:
      "Clients pay a deposit to lock in their slot, balances are collected automatically, and payouts land in your account — powered by Stripe. No more no-shows, no more chasing payment.",
    image: "/landing/payments-panel.png",
    alt: "A client paying a deposit through Inkspace",
  },
  {
    key: "flashbook",
    eyebrow: "Flashbook",
    title: "Turn your flash into bookings",
    description:
      "Post your flash designs and let clients browse and book them directly. Your sheets become a storefront that books itself — day or night.",
    image: "/landing/flashbook-panel.png",
    alt: "Inkspace flashbook of bookable tattoo flash designs",
  },
];

export interface ValueProp {
  key: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const VALUE_PROPS: ValueProp[] = [
  {
    key: "one-place",
    icon: Boxes,
    title: "Everything in one place",
    description:
      "Bookings, calendar, clients, payments, flash, and portfolio all live in a single platform built for tattooing, so you stop juggling apps and DMs.",
  },
  {
    key: "less-admin",
    icon: Clock,
    title: "Less time on admin",
    description:
      "Structured booking requests, automated reminders, and deposits handle the busywork for you, freeing up hours every week.",
  },
  {
    key: "fewer-no-shows",
    icon: ShieldCheck,
    title: "Fewer no-shows",
    description:
      "Deposits secure every session and automatic reminders keep clients on track, protecting both your time and your income.",
  },
  {
    key: "built-for-artists",
    icon: Palette,
    title: "Built for artists",
    description:
      "Made specifically for tattoo artists and studios, from your shareable booking link right through to your portfolio.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "My booking link replaced a hundred Instagram DMs a week. Clients send me everything I need up front, so I just review and accept. I got hours of my week back.",
    name: "Brooke Mortensen",
    role: "Tattoo Artist · Portland",
    image: "/landing/artist-profile-2.png",
  },
  {
    quote:
      "Everything syncs to my Google Calendar automatically, so I finally stopped double-booking myself. My whole schedule lives in one place now.",
    name: "Jesse Hartley",
    role: "Tattoo Artist · Vancouver",
    image: "/landing/artist-profile-1.png",
  },
  {
    quote:
      "Inkspace texts and emails my clients their reminders for me. My no-shows basically disappeared and I'm not chasing anyone anymore.",
    name: "Camila Ferreira",
    role: "Tattoo Artist · Toronto",
    image: "/landing/artist-profile-3.png",
  },
  {
    quote:
      "Taking a deposit at booking changed everything. No-shows used to cost me real money. Now every session is secured and payouts just land in my account.",
    name: "Marco Delgado",
    role: "Studio Owner · Miami",
    image: "/landing/artist-profile-4.png",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "What is Inkspace?",
    answer:
      "Inkspace is an all-in-one platform built for tattoo artists. It brings your bookings, calendar, client requests, deposits and payments, flash, and portfolio into one place — so you can run your whole studio without juggling DMs, spreadsheets, and separate apps.",
  },
  {
    question: "How does my booking link work?",
    answer:
      "You get your own customizable Open Book link to share in your bio, posts, and messages. Clients open it and send a structured request with all the details you need — placement, size, references, budget — instead of scattered Instagram DMs and emails. You review each request and accept it in a couple of taps.",
  },
  {
    question: "Do my clients need an account to book?",
    answer:
      "No. Clients can send a request straight from your link. When it's time to confirm a session or pay a deposit, they create a quick account so they can track their booking — no separate app or setup required.",
  },
  {
    question: "How do deposits and payments work?",
    answer:
      "Payments run on Stripe. Clients pay a deposit to lock in their slot, the remaining balance is collected when you're ready, and payouts land directly in your bank account. Deposits protect your time against no-shows, and you never have to chase anyone for money.",
  },
  {
    question: "Does Inkspace sync with my Google Calendar?",
    answer:
      "Yes. Every session and consultation lives on your Inkspace calendar and syncs to your Google Calendar, so your bookings show up alongside the rest of your life and you never double-book.",
  },
  {
    question: "Will my clients get reminders automatically?",
    answer:
      "Yes. Inkspace automatically texts and emails your clients their appointment and deposit reminders. You set it once and we handle the follow-ups — fewer no-shows, zero manual chasing.",
  },
  {
    question: "Can I sell my flash and show my portfolio?",
    answer:
      "Absolutely. Post your flash designs so clients can browse and book them directly, and showcase your finished work in a portfolio that draws new clients in — all from the same profile as your booking link.",
  },
  {
    question: "How much does Inkspace cost?",
    answer:
      "You can start for free and explore the platform. Paid plans unlock the full suite for running your studio, and you can upgrade whenever you're ready. Book a demo and we'll walk you through the options.",
  },
];
