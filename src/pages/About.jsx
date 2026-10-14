
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe2,
  Handshake,
  PackageCheck,
  ShieldCheck,
  Target,
} from "lucide-react";

const principles = [
  {
    icon: PackageCheck,
    title: "Product-focused approach",
    description:
      "We aim to connect buyers with products that suit their specifications, packaging needs, and intended applications.",
  },
  {
    icon: ShieldCheck,
    title: "Quality-conscious sourcing",
    description:
      "We value clear product specifications, transparent communication, and appropriate documentation throughout the buying process.",
  },
  {
    icon: Handshake,
    title: "Long-term partnerships",
    description:
      "We believe dependable communication and a clear understanding of buyer requirements are essential to lasting business relationships.",
  },
  {
    icon: Globe2,
    title: "Global trade mindset",
    description:
      "We work towards making product discovery and export enquiries straightforward for buyers exploring sourcing opportunities from India.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-ivory">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-brand-gold/20 bg-brand-dark">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-brand-gold/10" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-brand-gold/10" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-brand-gold">
            About Our Company
          </p>

          <h1 className="max-w-4xl text-4xl font-light leading-tight sm:text-5xl lg:text-7xl">
            Building connections
            <span className="block text-brand-gold">
              through global trade.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            We are building a business focused on connecting product
            requirements with suitable sourcing opportunities from India,
            with an emphasis on clear communication, thoughtful service, and
            long-term business relationships.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-ivory"
            >
              Explore Our Products
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/20 px-6 py-3.5 text-sm font-medium text-brand-ivory transition hover:border-brand-gold hover:text-brand-gold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-brand-gold">
            Who We Are
          </p>

          <h2 className="text-3xl font-light leading-snug sm:text-4xl">
            A practical approach to sourcing and export partnerships.
          </h2>
        </div>

        <div className="space-y-5 text-sm leading-8 text-white/65 sm:text-base">
          <p>
            Every successful business relationship starts with understanding
            the buyer. Product specifications, intended applications,
            packaging preferences, order quantities, and delivery
            expectations all play an important role in selecting the right
            sourcing solution.
          </p>

          <p>
            Our approach is centred on understanding these requirements and
            communicating clearly at every stage. We want buyers to be able
            to explore our product range, learn about available options, and
            share their requirements through a straightforward enquiry
            process.
          </p>

          <p>
            As we grow, our goal is to develop dependable business
            relationships built on transparency, responsiveness, and a
            shared commitment to meeting agreed requirements.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-white/10 bg-brand-dark">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-brand-gold">
              Our Principles
            </p>

            <h2 className="text-3xl font-light sm:text-4xl">
              What guides our approach
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
              Our focus is on making product enquiries clear, understanding
              buyer expectations, and building a strong foundation for
              long-term trade relationships.
            </p>
          </div>

          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {principles.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="bg-brand-dark p-7 transition hover:bg-white/[0.03] sm:p-9"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <Icon className="text-brand-gold" size={27} />
                    <span className="text-xs tracking-widest text-white/30">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium">{item.title}</h3>

                  <p className="mt-4 text-sm leading-7 text-white/60">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
