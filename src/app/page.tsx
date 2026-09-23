import Link from "next/link";
import Logo from "@/components/Logo";

const features = [
  {
    title: "Scan & Order",
    description:
      "Scan the QR code at your table and your menu, offers, and rewards appear instantly.",
    bg: "bg-coral-100",
    fg: "text-coral-700",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 4h5v5H4V4Zm11 0h5v5h-5V4ZM4 15h5v5H4v-5Zm11 2h5m-5 3h5M15 15h1v1h-1v-1Zm4 0h1v1h-1v-1Z"
      />
    ),
  },
  {
    title: "AI Recommendations",
    description:
      "Get personalized food suggestions with clear explanations of why they're picked for you.",
    bg: "bg-butter-100",
    fg: "text-butter-700",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.4-6.4-1.4 1.4M7 17l-1.4 1.4m11.8 0L16 17M7 7 5.6 5.6M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      />
    ),
  },
  {
    title: "Voice Ordering",
    description:
      "Speak your order naturally — add, remove, or change items hands-free.",
    bg: "bg-sky-100",
    fg: "text-sky-700",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm-7-3a7 7 0 0 0 14 0M12 19v2"
      />
    ),
  },
  {
    title: "Live Order Tracking",
    description:
      "Watch your order move from kitchen to table with real-time status updates.",
    bg: "bg-mint-100",
    fg: "text-mint-700",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 8v4l3 2M12 3a9 9 0 1 0 9 9"
      />
    ),
  },
  {
    title: "Smart Offers & Rewards",
    description:
      "Earn loyalty points and unlock personalized offers as you dine.",
    bg: "bg-plum-100",
    fg: "text-plum-700",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m12 3 2.5 5.5L20 9l-4.5 4 1.3 6-4.8-3-4.8 3 1.3-6L4 9l5.5-.5L12 3Z"
      />
    ),
  },
  {
    title: "Digital Payment & Invoice",
    description:
      "Pay digitally and receive your invoice instantly — no waiting for the bill.",
    bg: "bg-saffron-100",
    fg: "text-saffron-700",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 8h18M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8l2-4h14l2 4M8 15h4"
      />
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white font-sans">
      <header className="flex w-full items-center justify-between px-6 py-5 sm:px-12">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-600"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-16 sm:px-12">
        <section className="relative flex max-w-2xl flex-col items-center gap-6 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-24 h-56 w-56 rounded-full bg-coral-100 opacity-60 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 -right-24 h-56 w-56 rounded-full bg-sky-100 opacity-60 blur-3xl"
          />
          <span className="relative rounded-full bg-saffron-100 px-3 py-1 text-xs font-medium text-saffron-700">
            स्वागत आहे · Smart Dining, Simplified
          </span>
          <h1 className="relative text-4xl font-semibold leading-tight tracking-tight text-terracotta-900 sm:text-5xl">
            A smarter way to dine, from table to bill.
          </h1>
          <p className="relative max-w-lg text-lg leading-8 text-terracotta-700/70">
            Scan the QR code at your table to browse a personalized menu,
            order by voice or tap, track your food live, and pay digitally —
            all in one seamless experience.
          </p>
          <div className="relative flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Link
              href="/register"
              className="flex h-12 items-center justify-center rounded-full bg-terracotta-500 px-6 text-white shadow-sm transition-colors hover:bg-terracotta-600"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="flex h-12 items-center justify-center rounded-full border border-cream-300 px-6 text-terracotta-800 transition-colors hover:border-transparent hover:bg-cream-100"
            >
              I already have an account
            </Link>
          </div>
        </section>

        <section className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-cream-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${feature.bg} ${feature.fg}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5.5 w-5.5"
                >
                  {feature.icon}
                </svg>
              </span>
              <h3 className="mt-4 text-base font-semibold text-terracotta-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-terracotta-700/60">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="flex w-full flex-col items-center gap-1 border-t border-cream-200 px-6 py-8 text-center text-sm text-terracotta-600/60">
        <span>आंगन · Aangan</span>
        <span>© {new Date().getFullYear()} Aangan. All rights reserved.</span>
      </footer>
    </div>
  );
}