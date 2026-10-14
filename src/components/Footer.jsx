import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Enquiry from "./Enquiry";
import footerLogo from "../assets/logo-black-small.jpg";
import { getFeaturedProducts } from "../services/productService";
import WhatsAppButton from "./WhatsAppButton";

const companyLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Products", path: "/products" },
  { name: "Contact Us", path: "/contact" },
];

const GST_NUMBER =
  import.meta.env.VITE_GST_NUMBER || "24BGIPC0870P1Z9";

export default function Footer() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const loadFeaturedProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setProductsError("");

      const products = await getFeaturedProducts();
      setFeaturedProducts(products);
    } catch (error) {
      setProductsError(
        error.message || "Unable to load featured products."
      );
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  const openEnquiry = () => setIsEnquiryOpen(true);
  const closeEnquiry = () => setIsEnquiryOpen(false);

  const copyGSTNumber = async () => {
    try {
      await navigator.clipboard.writeText(GST_NUMBER);
    } catch (error) {
      console.error("Unable to copy GST number:", error);
    }
  };

  return (
    <>
      <footer className="bg-brand-black text-brand-ivory">
        {/* Main Footer */}
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Company Information */}
            <div>
              <Link
                to="/"
                className="mb-5 inline-flex items-center gap-3"
                aria-label="Go to homepage"
              >
                <img
                  src={footerLogo}
                  alt="PA Indian Food Exports logo"
                  className="w-50 rounded-full object-contain"
                />
              </Link>

              <p className="max-w-sm text-sm leading-7 text-brand-ivory/65">
                Connecting quality Indian food products with businesses
                around the world. Contact us to discuss your product
                requirements and export enquiries.
              </p>

              <button
                type="button"
                onClick={openEnquiry}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
              >
                Send an Enquiry
                <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-brand-gold">
                Quick Links
              </h3>

              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-2 text-sm text-brand-ivory/65 transition-colors hover:text-brand-gold"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Products */}
            <div>
              <div className="mb-5 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-gold">
                  Featured Products
                </h3>

                {!productsLoading && (
                  <button
                    type="button"
                    onClick={loadFeaturedProducts}
                    disabled={productsLoading}
                    aria-label="Refresh featured products"
                    title="Refresh featured products"
                    className="rounded-full p-1.5 text-brand-ivory/50 transition-colors hover:bg-brand-gold/10 hover:text-brand-gold"
                  >
                    {/* <RefreshCw size={14} /> */}
                  </button>
                )}
              </div>

              {productsLoading ? (
                <p className="text-sm text-brand-ivory/50">
                  Loading featured products...
                </p>
              ) : productsError ? (
                <div>
                  <p className="text-sm leading-6 text-brand-ivory/60">
                    Featured products could not be loaded.
                  </p>

                  <button
                    type="button"
                    onClick={loadFeaturedProducts}
                    className="mt-3 inline-flex items-center gap-2 text-sm text-brand-gold transition-colors hover:text-brand-ivory"
                  >
                    <RefreshCw size={14} />
                    Try again
                  </button>
                </div>
              ) : featuredProducts.length > 0 ? (
                <ul className="space-y-3">
                  {featuredProducts.slice(0, 5).map((product) => (
                    <li key={product.id || product.slug}>
                      <Link
                        to={`/product/${product.slug}`}
                        className="group flex items-center justify-between gap-2 text-sm text-brand-ivory/65 transition-colors hover:text-brand-gold"
                      >
                        <span className="line-clamp-2">
                          {product.name}
                        </span>

                        <ArrowUpRight
                          size={14}
                          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-6 text-brand-ivory/50">
                  No featured products available at the moment.
                </p>
              )}

              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-ivory"
              >
                View All Products
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-brand-gold">
                Contact Us
              </h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-gold"
                  />

                  <div>
                    <p className="text-sm font-medium text-brand-ivory">
                      Our Location
                    </p>
                    <p className="mt-1 text-sm leading-6 text-brand-ivory/60">
                      {import.meta.env.VITE_BUSINESS_ADDRESS || "Jharoda Kalan, Delhi, India"}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-gold"
                  />

                  <div>
                    <p className="text-sm font-medium text-brand-ivory">
                      Email
                    </p>
                    <Link
                      mailto={import.meta.env.VITE_BUSINESS_EMAIL || "info@pmqenterprisesllp.com"}
                      className="mt-1 inline-block text-sm text-brand-ivory/60 transition-colors hover:text-brand-gold"
                    >
                      {import.meta.env.VITE_BUSINESS_EMAIL || "info@pmqenterprisesllp.com"}
                    </Link>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-gold"
                  />

                  <div>
                    <p className="text-sm font-medium text-brand-ivory">
                      Phone
                    </p>
                    <Link
                      tel={import.meta.env.VITE_BUSINESS_PHONE || "+91-9761696089"}
                      className="mt-1 inline-block text-sm text-brand-ivory/60 transition-colors hover:text-brand-gold"
                    >
                      {import.meta.env.VITE_BUSINESS_PHONE || "+91-9761696089"}
                    </Link>
                  </div>
                </li>
              </ul>

              {/* GST Information */}
              <div className="mt-6 rounded-xl border border-brand-ivory/10 bg-brand-dark/60 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-gold"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-ivory/70">
                      GSTIN
                    </p>

                    <p className="mt-1 break-all text-sm text-brand-ivory">
                      {GST_NUMBER}
                    </p>

                    <button
                      type="button"
                      onClick={copyGSTNumber}
                      className="mt-2 text-xs font-medium text-brand-gold transition-colors hover:text-brand-ivory"
                    >
                      Copy GSTIN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="border-t border-brand-ivory/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
            <p className="text-xs text-brand-ivory/50">
              © {new Date().getFullYear()} PMQ Enterprises LLP. All
              rights reserved. Created with ❤️
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-brand-ivory/50">
              <button
                type="button"
                onClick={openEnquiry}
                className="transition-colors hover:text-brand-gold"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      </footer>

      { /* WhatsApp Floating Button */}
      <WhatsAppButton
        phoneNumber={import.meta.env.VITE_BUSINESS_PHONE || "+91-9761696089"}
        message="Hello, I am interested in your export products. Please share more details."
        floating={true}
      />

      {/* Enquiry Modal */}
      {isEnquiryOpen && (
        <Enquiry
          isOpen={isEnquiryOpen}
          onClose={closeEnquiry}
        />
      )}
    </>
  );
}