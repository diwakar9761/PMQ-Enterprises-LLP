
import { useCallback, useState } from "react";
import Logo from "../assets/logo-black-small.jpg";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  Mail,
  MessageSquareText,
  Package,
  MapPin,
  Phone,
  Clock,
  Building2,
  Copy,
} from "lucide-react";

import Enquiry from "../components/Enquiry";

// SAMPLE BUSINESS DETAILS — replace these before publishing.
const businessDetails = {
  name: import.meta.env.VITE_BUSINESS_NAME || "PMQ Enterprises LLP",
  tagline: import.meta.env.VITE_BUSINESS_TAGLINE || "Connecting Indian Products to Global Markets",
  phone: import.meta.env.VITE_BUSINESS_PHONE || "+91-9761696089",
  email: import.meta.env.VITE_BUSINESS_EMAIL || "info@pmqenterprisesllp.com",
  address: import.meta.env.VITE_BUSINESS_ADDRESS || "Jharoda Kalan, New Delhi, India",
  website: import.meta.env.VITE_BUSINESS_WEBSITE || "www.pmqenterprisesllp.com",
  hours: "Monday – Saturday, 9:30 AM – 6:00 PM",
  gstin: import.meta.env.VITE_GST_NUMBER || "GEVPS5600PP",
};

const contactItems = [
  {
    icon: Phone,
    label: "Phone",
    value: businessDetails.phone,
    href: `tel:${businessDetails.phone.replace(/\s/g, "")}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: businessDetails.email,
    href: `mailto:${businessDetails.email}`,
  },
  {
    icon: Globe2,
    label: "Website",
    value: businessDetails.website,
    href: businessDetails.website,
  },
];

export default function Contact() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const openEnquiry = useCallback(() => {
    setIsEnquiryOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setIsEnquiryOpen(false);
  }, []);

  const copyGSTIN = async () => {
    try {
      await navigator.clipboard.writeText(businessDetails.gstin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy GSTIN:", error);
    }
  };

  return (
    <main className="min-h-screen bg-brand-black text-brand-ivory">
      {/* Hero */}
      {/* <section className="relative overflow-hidden border-b border-brand-gold/20 bg-brand-dark">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-brand-gold/10" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-brand-gold">
            Contact Us
          </p>

          <h1 className="max-w-4xl text-4xl font-light leading-tight sm:text-5xl lg:text-7xl">
            Let's talk about
            <span className="block text-brand-gold">
              your requirements.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Looking for product details, specifications, packaging options,
            or a potential supply partner? Share your requirements with us
            and start a conversation.
          </p>

          <button
            type="button"
            onClick={openEnquiry}
            className="mt-9 inline-flex items-center gap-2 bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-ivory"
          >
            Send an Enquiry
            <ArrowRight size={17} />
          </button>
        </div>
      </section> */}

      {/* Business details and contact information */}
      <section className="mx-auto bg-brand-dark px-7 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-15 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left: Business information */}
          <aside className="h-fit border border-brand-gold/20 bg-brand-dark">
            <div className="border-b border-white/10 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                {/* Dummy text-based logo */}
                <div className="flex items-center justify-center border border-brand-gold/60 bg-brand-black">
                  <div className="text-center">
                    <img src={Logo} alt="Company Logo" className="h-full w-full object-contain" />
                  </div>
                </div>
              </div>

              <div className="mt-7 flex items-start gap-3">
                <MapPin
                  size={19}
                  className="mt-1 shrink-0 text-brand-gold"
                />
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Office Address
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    {businessDetails.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-0">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 border-b border-white/10 p-6 transition hover:bg-white/[0.02] sm:px-8"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-gold/25 text-brand-gold">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-white/45">
                      {label}
                    </p>
                    <a
                      href={href}
                      className="mt-2 inline-block break-words text-sm text-brand-ivory transition hover:text-brand-gold"
                    >
                      {value}
                    </a>
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="mt-1 shrink-0 text-white/30"
                  />
                </div>
              ))}

              <div className="flex items-start gap-4 border-b border-white/10 p-6 sm:px-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-gold/25 text-brand-gold">
                  <Clock size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Business Hours
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    {businessDetails.hours}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="p-6 sm:px-8 sm:py-7">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-brand-gold" />
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Business Registration
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/45">GSTIN</p>
                    <p className="mt-1 font-mono text-sm tracking-wide text-brand-ivory">
                      {businessDetails.gstin}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyGSTIN}
                    className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:border-brand-gold hover:text-brand-gold"
                  >
                    <Copy size={13} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Contact and enquiry options */}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-brand-gold">
              Get in Touch
            </p>

            <h2 className="text-3xl font-light leading-snug sm:text-4xl">
              Tell us what your business needs.
            </h2>

            <p className="mt-5 text-sm leading-8 text-white/60 sm:text-base">
              The more detail you can share about your product, required
              quantity, specifications, packaging, and destination market,
              the easier it is to understand your enquiry.
            </p>

            <button
              type="button"
              onClick={openEnquiry}
              className="mt-7 inline-flex items-center gap-2 border-b border-brand-gold pb-2 text-sm text-brand-gold transition hover:text-brand-ivory"
            >
              Open Enquiry Form
              <ArrowRight size={16} />
            </button>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <article className="border border-white/10 bg-brand-dark p-6 sm:p-7">
                <Mail className="mb-5 text-brand-gold" size={25} />

                <h3 className="text-lg font-medium">Product Enquiries</h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Ask about product availability, specifications, packaging,
                  order quantities, and pricing.
                </p>

                <button
                  type="button"
                  onClick={openEnquiry}
                  className="mt-5 text-sm text-brand-gold hover:text-brand-ivory"
                >
                  Make an enquiry →
                </button>
              </article>

              <article className="border border-white/10 bg-brand-dark p-6 sm:p-7">
                <Package className="mb-5 text-brand-gold" size={25} />

                <h3 className="text-lg font-medium">Bulk Requirements</h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Include your estimated volume, packaging preferences, and
                  any specific product requirements.
                </p>

                <button
                  type="button"
                  onClick={openEnquiry}
                  className="mt-5 text-sm text-brand-gold hover:text-brand-ivory"
                >
                  Discuss requirements →
                </button>
              </article>

              <article className="border border-white/10 bg-brand-dark p-6 sm:p-7">
                <Globe2 className="mb-5 text-brand-gold" size={25} />

                <h3 className="text-lg font-medium">Export Enquiries</h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Tell us your destination country and any applicable
                  specifications or documentation requirements.
                </p>

                <button
                  type="button"
                  onClick={openEnquiry}
                  className="mt-5 text-sm text-brand-gold hover:text-brand-ivory"
                >
                  Discuss export needs →
                </button>
              </article>

              <article className="border border-white/10 bg-brand-dark p-6 sm:p-7">
                <MessageSquareText
                  className="mb-5 text-brand-gold"
                  size={25}
                />

                <h3 className="text-lg font-medium">Business Partnerships</h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Interested in discussing a potential sourcing,
                  distribution, or business partnership? We welcome an
                  introduction.
                </p>

                <button
                  type="button"
                  onClick={openEnquiry}
                  className="mt-5 text-sm text-brand-gold hover:text-brand-ivory"
                >
                  Start a conversation →
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Helpful information */}
      {/* <section className="border-y border-white/10 bg-brand-dark">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-center lg:px-12">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-brand-gold">
              Help Us Understand
            </p>

            <h2 className="text-2xl font-light sm:text-3xl">
              What should you include in your enquiry?
            </h2>
          </div>

          <ul className="space-y-3 text-sm leading-7 text-white/65">
            <li>— Product name and required specifications</li>
            <li>— Estimated order quantity</li>
            <li>— Preferred packaging or product format</li>
            <li>— Destination country or delivery requirements</li>
            <li>— Any relevant quality or documentation requirements</li>
          </ul>
        </div>
      </section> */}

      {/* Final CTA */}
      {/* <section className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-20">
        <div>
          <h2 className="text-2xl font-light sm:text-3xl">
            Ready to discuss your requirements?
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/55">
            Explore the catalogue or send us your enquiry.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm transition hover:border-brand-gold hover:text-brand-gold"
          >
            Browse Products
          </Link>

          <button
            type="button"
            onClick={openEnquiry}
            className="inline-flex items-center gap-2 bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-ivory"
          >
            Contact Us
            <ArrowRight size={16} />
          </button>
        </div>
      </section> */}

      {/* Shared enquiry popup */}
      <Enquiry
        isOpen={isEnquiryOpen}
        onClose={closeEnquiry}
        product={null}
      />
    </main>
  );
}
