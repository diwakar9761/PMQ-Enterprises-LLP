
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import {
  X,
  Send,
  Package,
  Mail,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  quantity: "",
  message: "",
};

export default function Enquiry({ isOpen, onClose, product = null }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setSuccess("");
    setFormData(initialFormData);
  }, [isOpen, product?.id, product?.slug]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadProducts() {
      setProductsLoading(true);

      try {
        const data = await getAllProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Unable to load enquiry products:", err);

        if (!cancelled) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || products.length === 0) return;

    const matchingProduct = products.find(
      (item) =>
        (product?.id && String(item.id) === String(product.id)) ||
        (product?.slug && item.slug === product.slug),
    );

    setSelectedProductId(matchingProduct ? String(matchingProduct.id) : "");
  }, [isOpen, product?.id, product?.slug, products]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setSuccess("");

    const selectedProduct = products.find(
      (item) => String(item.id) === selectedProductId,
    );

    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productName: selectedProduct.name,
          productId: selectedProduct.id,
        }),
      });

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit your enquiry.",
        );
      }

      setSuccess(
        "Thank you! Your enquiry has been submitted successfully. Our team will get back to you.",
      );

      setFormData(initialFormData);
      setSelectedProductId("");
    } catch (err) {
      console.error("Enquiry submission failed:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-sm border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-brand-ivory outline-none transition placeholder:text-white/35 focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "mb-2 block text-xs font-medium uppercase tracking-wider text-white/70";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        className="relative my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-brand-gold/30 bg-brand-black shadow-2xl"
      >
        {/* Popup header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-brand-dark px-5 py-5 sm:px-8">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-brand-gold">
              Product Enquiry
            </p>

            <h2
              id="enquiry-title"
              className="text-2xl font-light text-brand-ivory sm:text-3xl"
            >
              Let's discuss your requirements.
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Share your details and requirements with our team.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close enquiry form"
            className="shrink-0 border border-white/15 p-2 text-white/70 transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected product */}
        <div className="mx-5 mt-5 flex items-center gap-3 border border-brand-gold/20 bg-brand-gold/[0.06] p-4 sm:mx-8">
          <Package className="shrink-0 text-brand-gold" size={22} />

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Enquiring about
            </p>

            <p className="mt-1 truncate text-sm font-medium text-brand-ivory">
              {products.find(
                (item) => String(item.id) === selectedProductId,
              )?.name ||
                product?.name ||
                "Select a product below"}
            </p>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div
            role="status"
            className="mx-5 mt-5 flex items-start gap-3 border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300 sm:mx-8"
          >
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Enquiry submitted</p>
              <p className="mt-1 leading-6">{success}</p>

              <button
                type="button"
                onClick={onClose}
                className="mt-3 font-semibold underline underline-offset-4"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Enquiry form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="enquiry-name">
                  Full name *
                </label>

                <input
                  id="enquiry-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Your full name"
                  autoComplete="name"
                  maxLength={150}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="enquiry-email">
                  Business email *
                </label>

                <input
                  id="enquiry-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="you@company.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="enquiry-phone">
                  Phone / WhatsApp
                </label>

                <input
                  id="enquiry-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Country code + number"
                  autoComplete="tel"
                  maxLength={50}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="enquiry-company">
                  Company name
                </label>

                <input
                  id="enquiry-company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Your company"
                  autoComplete="organization"
                  maxLength={200}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="enquiry-product">
                  Select Product *
                </label>

                <select
                  id="enquiry-product"
                  name="product"
                  value={selectedProductId}
                  onChange={(event) =>
                    setSelectedProductId(event.target.value)
                  }
                  className={inputClass}
                  required
                  disabled={productsLoading || isSubmitting}
                >
                  <option value="" disabled className="text-black">
                    {productsLoading
                      ? "Loading products..."
                      : "Choose a product"}
                  </option>

                  {products.map((item) => (
                    <option
                      key={item.id}
                      value={String(item.id)}
                      className="text-black"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>

                {!productsLoading && products.length === 0 && (
                  <p className="mt-2 text-xs text-white/50">
                    No products are available. Please refresh and try again.
                  </p>
                )}
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="enquiry-quantity"
                >
                  Required Quantity
                </label>

                <input
                  id="enquiry-quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 500 kg or 2 tonnes"
                  maxLength={200}
                  disabled={isSubmitting}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className={labelClass}
                  htmlFor="enquiry-message"
                >
                  Message / specifications
                </label>

                <textarea
                  id="enquiry-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} min-h-28 resize-y`}
                  placeholder="Tell us about your packaging, destination, specifications, or other requirements."
                  rows={4}
                  maxLength={5000}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 text-sm text-red-300"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-xs text-white/45">
                <Mail size={15} className="shrink-0" />
                Your enquiry will be sent directly to our team.
              </p>

              <button
                type="submit"
                disabled={isSubmitting || productsLoading}
                className="inline-flex items-center justify-center gap-2 bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-ivory disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
