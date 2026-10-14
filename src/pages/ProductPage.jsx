
import { useEffect, useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Package,
  Send,
  ShieldCheck,
  Truck,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import {
  fetchProducts,
  getProductBySlug,
} from "../services/productService";
import Enquiry from "../components/Enquiry";

function ProductPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    country: "",
    quantity: "",
    message: "",
  });
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const openEnquiry = useCallback(() => {
  setIsEnquiryOpen(true);
}, []);

const closeEnquiry = useCallback(() => {
  setIsEnquiryOpen(false);
}, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const [productData, productsData] = await Promise.all([
          getProductBySlug(slug),
          fetchProducts(),
        ]);

        if (!cancelled) {
          setProduct(productData);
          setAllProducts(productsData);
          setActiveImage(
            productData?.gallery?.[0] ||
              productData?.image ||
              ""
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load product details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const relatedProducts = allProducts
    .filter(
      (item) =>
        item.slug !== product?.slug &&
        (item.featured ||
          item.categorySlug === product?.categorySlug)
    )
    .slice(0, 4);

  const gallery = product
    ? Array.from(
        new Set(
          [
            ...(product.gallery || []),
            product.image,
          ].filter(Boolean)
        )
      )
    : [];

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEnquirySubmit(event) {
    event.preventDefault();
    setFormError("");

    const businessEmail = import.meta.env.VITE_BUSINESS_EMAIL;

    if (!businessEmail) {
      setFormError(
        "The enquiry email is not configured yet. Please contact the website administrator."
      );
      return;
    }

    const subject = `Product enquiry: ${product.name}`;

    const message = [
      `Product: ${product.name}`,
      `Product slug: ${product.slug}`,
      "",
      `Name: ${formData.name}`,
      `Company: ${formData.company || "Not provided"}`,
      `Email: ${formData.email}`,
      `Country: ${formData.country || "Not provided"}`,
      `Required quantity: ${formData.quantity || "Not provided"}`,
      "",
      "Message:",
      formData.message || "Please share pricing and export details.",
    ].join("\n");

    const mailtoUrl =
      `mailto:${businessEmail}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoUrl;
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-brand-black px-5 text-brand-ivory">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-5 h-8 w-8 animate-spin text-brand-gold" />
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
            Product catalogue
          </p>
          <p className="mt-3 text-sm text-brand-ivory/60">
            Loading product details...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] bg-brand-black px-5 py-24 text-center text-brand-ivory">
        <h1 className="text-3xl font-light">
          Unable to load product
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-brand-ivory/60">
          {error}
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-ivory"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-[60vh] bg-brand-black px-5 py-24 text-center text-brand-ivory">
        <Package
          size={42}
          strokeWidth={1}
          className="mx-auto text-brand-gold"
        />
        <h1 className="mt-5 text-3xl font-light">
          Product not found
        </h1>
        <p className="mt-3 text-sm text-brand-ivory/60">
          This product may have been removed or is no longer available.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-ivory"
        >
          <ArrowLeft size={16} />
          Browse all products
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-brand-black text-brand-ivory">
        {/* Breadcrumb */}
        <div className="border-b border-brand-ivory/10 px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-xs text-brand-ivory/50">
            <Link to="/" className="transition hover:text-brand-gold">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="transition hover:text-brand-gold"
            >
              Products
            </Link>
            <span>/</span>
            {product.categorySlug && (
              <>
                <Link
                  to={`/products/${product.categorySlug}`}
                  className="transition hover:text-brand-gold"
                >
                  {product.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-brand-gold">{product.name}</span>
          </div>
        </div>

        {/* Product overview */}
        <section className="px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Gallery */}
            <div>
              <div className="relative overflow-hidden border border-brand-ivory/10 bg-brand-dark">
                <div className="aspect-square">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-brand-gold/60">
                      <ImageIcon size={56} strokeWidth={1} />
                      <span className="text-xs uppercase tracking-widest">
                        Product image coming soon
                      </span>
                    </div>
                  )}
                </div>

                {product.featured && (
                  <span className="absolute left-4 top-4 bg-brand-gold px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-brand-dark">
                    Featured product
                  </span>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={activeImage === image}
                      className={`aspect-square overflow-hidden border transition ${
                        activeImage === image
                          ? "border-brand-gold"
                          : "border-brand-ivory/10 opacity-70 hover:border-brand-gold/60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product information */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-brand-gold">
                <span className="h-px w-8 bg-brand-gold" />
                {product.category || "Our collection"}
              </div>

              <h1 className="mt-5 text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <p className="mt-6 text-sm leading-7 text-brand-ivory/65 sm:text-base">
                {product.shortDescription ||
                  product.description ||
                  "Contact us to learn more about this product and its export specifications."}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 border-y border-brand-ivory/10 py-6 sm:grid-cols-2">
                {product.origin && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-ivory/40">
                      Origin
                    </p>
                    <p className="mt-2 text-sm text-brand-ivory/90">
                      {product.origin}
                    </p>
                  </div>
                )}

                {product.grade && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-ivory/40">
                      Grade
                    </p>
                    <p className="mt-2 text-sm text-brand-ivory/90">
                      {product.grade}
                    </p>
                  </div>
                )}

                {product.minimumOrderQuantity && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-ivory/40">
                      Minimum order quantity
                    </p>
                    <p className="mt-2 text-sm text-brand-ivory/90">
                      {product.minimumOrderQuantity}
                    </p>
                  </div>
                )}

                {product.packaging && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-ivory/40">
                      Packaging
                    </p>
                    <p className="mt-2 text-sm text-brand-ivory/90">
                      {product.packaging}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="javascript:void(0)"
                  onClick={openEnquiry}
                  className="inline-flex items-center justify-center gap-2 bg-brand-gold px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-brand-dark transition hover:bg-brand-ivory"
                >
                  Enquire about this product
                  <ArrowRight size={16} />
                </a>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 border border-brand-ivory/20 px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-brand-ivory transition hover:border-brand-gold hover:text-brand-gold"
                >
                  <ArrowLeft size={15} />
                  All products
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-brand-ivory/10 pt-6 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    strokeWidth={1.3}
                    className="shrink-0 text-brand-gold"
                  />
                  <div>
                    <p className="text-xs">Quality focus</p>
                    <p className="mt-1 text-[11px] leading-5 text-brand-ivory/45">
                      Specifications confirmed per order
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package
                    size={20}
                    strokeWidth={1.3}
                    className="shrink-0 text-brand-gold"
                  />
                  <div>
                    <p className="text-xs">Export packaging</p>
                    <p className="mt-1 text-[11px] leading-5 text-brand-ivory/45">
                      Discuss available options
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck
                    size={20}
                    strokeWidth={1.3}
                    className="shrink-0 text-brand-gold"
                  />
                  <div>
                    <p className="text-xs">Global enquiries</p>
                    <p className="mt-1 text-[11px] leading-5 text-brand-ivory/45">
                      Ask about your destination
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description and specifications */}
        <section className="border-y border-brand-ivory/10 bg-brand-black px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
                Product overview
              </p>
              <h2 className="mt-4 text-3xl font-light sm:text-4xl">
                About this product
              </h2>
              <p className="mt-6 whitespace-pre-line text-sm leading-8 text-brand-ivory/65">
                {product.description ||
                  product.shortDescription ||
                  "Contact us for further information about this product."}
              </p>

              {product.applications?.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-light">Applications</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.applications.map((application, index) => (
                      <span
                        key={`${application}-${index}`}
                        className="border border-brand-ivory/15 px-3 py-2 text-xs text-brand-ivory/70"
                      >
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.features?.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-light">Product highlights</h3>
                  <ul className="mt-4 space-y-3">
                    {product.features.map((feature, index) => (
                      <li
                        key={`${feature}-${index}`}
                        className="flex items-start gap-3 text-sm leading-6 text-brand-ivory/65"
                      >
                        <Check
                          size={17}
                          className="mt-0.5 shrink-0 text-brand-gold"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
                Product data
              </p>
              <h2 className="mt-4 text-3xl font-light sm:text-4xl">
                Specifications
              </h2>

              <dl className="mt-7 divide-y divide-brand-ivory/10 border-y border-brand-ivory/10">
                {[
                  ["Category", product.category],
                  ["Grade", product.grade],
                  ["Colour", product.colour],
                  ["Material", product.material],
                  ["Origin", product.origin],
                  ["Moisture", product.moisture],
                  ["Shelf life", product.shelfLife],
                  ["Storage", product.storage],
                  ["Packaging", product.packaging],
                  ["Minimum order quantity", product.minimumOrderQuantity],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-4"
                    >
                      <dt className="text-xs leading-6 text-brand-ivory/45 sm:text-sm">
                        {label}
                      </dt>
                      <dd className="break-words text-right text-xs leading-6 text-brand-ivory/85 sm:text-sm">
                        {value}
                      </dd>
                    </div>
                  ))}

                {[
                  ["Certifications", product.certifications],
                  ["Documents", product.documents],
                ].map(([label, values]) =>
                  values?.length ? (
                    <div key={label} className="py-4">
                      <dt className="mb-3 text-xs text-brand-ivory/45 sm:text-sm">
                        {label}
                      </dt>
                      <dd className="flex flex-wrap gap-2">
                        {values.map((item, index) => {
                          const isLink =
                            typeof item === "object" &&
                            item !== null &&
                            item.url;

                          const text =
                            typeof item === "string"
                              ? item
                              : item.label || item.name || "View document";

                          return isLink ? (
                            <a
                              key={`${text}-${index}`}
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 border border-brand-gold/30 px-3 py-2 text-xs text-brand-gold hover:border-brand-gold"
                            >
                              <FileText size={14} />
                              {text}
                            </a>
                          ) : (
                            <span
                              key={`${text}-${index}`}
                              className="inline-flex items-center gap-2 border border-brand-ivory/10 px-3 py-2 text-xs text-brand-ivory/70"
                            >
                              <FileText size={14} />
                              {text}
                            </span>
                          );
                        })}
                      </dd>
                    </div>
                  ) : null
                )}
              </dl>

              <p className="mt-5 text-xs leading-6 text-brand-ivory/40">
                Specifications, available documents, certifications, and order
                quantities should be confirmed with us before placing an order.
              </p>
            </div>
          </div>
        </section>

        {/* Enquiry form */}
        {/* <section
          id="product-enquiry"
          className="scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
                Let's work together
              </p>
              <h2 className="mt-4 text-3xl font-light leading-tight sm:text-4xl">
                Request product information
              </h2>
              <p className="mt-5 text-sm leading-7 text-brand-ivory/60">
                Tell us about your requirements. Include your destination
                country and expected quantity so we can better understand
                your enquiry.
              </p>

              <div className="mt-8 flex items-start gap-3 border-l border-brand-gold/40 pl-4">
                <Send
                  size={18}
                  className="mt-1 shrink-0 text-brand-gold"
                />
                <p className="text-xs leading-6 text-brand-ivory/55">
                  Submit your details to prepare an email enquiry for this
                  product.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleEnquirySubmit}
              className="border border-brand-ivory/10 bg-brand-dark p-5 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="enquiry-name"
                    className="mb-2 block text-xs text-brand-ivory/65"
                  >
                    Full name *
                  </label>
                  <input
                    id="enquiry-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    autoComplete="name"
                    className="w-full border border-brand-ivory/15 bg-brand-black px-4 py-3 text-sm text-brand-ivory outline-none focus:border-brand-gold"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="enquiry-company"
                    className="mb-2 block text-xs text-brand-ivory/65"
                  >
                    Company
                  </label>
                  <input
                    id="enquiry-company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    autoComplete="organization"
                    className="w-full border border-brand-ivory/15 bg-brand-black px-4 py-3 text-sm text-brand-ivory outline-none focus:border-brand-gold"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="enquiry-email"
                    className="mb-2 block text-xs text-brand-ivory/65"
                  >
                    Business email *
                  </label>
                  <input
                    id="enquiry-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    className="w-full border border-brand-ivory/15 bg-brand-black px-4 py-3 text-sm text-brand-ivory outline-none focus:border-brand-gold"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="enquiry-country"
                    className="mb-2 block text-xs text-brand-ivory/65"
                  >
                    Destination country
                  </label>
                  <input
                    id="enquiry-country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    autoComplete="country-name"
                    className="w-full border border-brand-ivory/15 bg-brand-black px-4 py-3 text-sm text-brand-ivory outline-none focus:border-brand-gold"
                    placeholder="Country"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="enquiry-quantity"
                    className="mb-2 block text-xs text-brand-ivory/65"
                  >
                    Required quantity
                  </label>
                  <input
                    id="enquiry-quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full border border-brand-ivory/15 bg-brand-black px-4 py-3 text-sm text-brand-ivory outline-none focus:border-brand-gold"
                    placeholder="e.g. 1 metric tonne"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="enquiry-message"
                    className="mb-2 block text-xs text-brand-ivory/65"
                  >
                    Message
                  </label>
                  <textarea
                    id="enquiry-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full resize-y border border-brand-ivory/15 bg-brand-black px-4 py-3 text-sm text-brand-ivory outline-none focus:border-brand-gold"
                    placeholder="Tell us about your specifications, packaging, or delivery requirements..."
                  />
                </div>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="mt-5 text-sm leading-6 text-red-300"
                >
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-brand-gold px-6 py-4 text-xs uppercase tracking-[0.2em] text-brand-dark transition hover:bg-brand-ivory sm:w-auto"
              >
                Prepare enquiry email
                <ArrowRight size={16} />
              </button>

              <p className="mt-4 text-[11px] leading-5 text-brand-ivory/40">
                This opens your email application. The enquiry is not sent
                automatically by this website.
              </p>
            </form>
          </div>
        </section> */}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-brand-ivory/10 bg-brand-dark px-5 py-14 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
                    Discover more
                  </p>
                  <h2 className="mt-3 text-3xl font-light sm:text-4xl">
                    Related products
                  </h2>
                </div>

                <Link
                  to="/products"
                  className="hidden items-center gap-2 text-xs uppercase tracking-wider text-brand-gold transition hover:text-brand-ivory sm:inline-flex"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((item) => {
                  const image = item.image || item.gallery?.[0] || "";

                  return (
                    <Link
                      key={item.id || item.slug}
                      to={`/product/${item.slug}`}
                      className="group border border-brand-ivory/10 bg-brand-black transition hover:border-brand-gold/50"
                    >
                      <div className="overflow-hidden bg-brand-dark">
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-brand-gold/50">
                            <Package size={38} strokeWidth={1} />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/80">
                          {item.category}
                        </p>
                        <h3 className="mt-2 text-lg font-light group-hover:text-brand-gold">
                          {item.name}
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-2 text-xs text-brand-ivory/60">
                          View product
                          <ArrowRight
                            size={14}
                            className="transition group-hover:translate-x-1 group-hover:text-brand-gold"
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Enquiry
        isOpen={isEnquiryOpen}
        onClose={closeEnquiry}
        product={product}
      />
    </>
  );
}

export default ProductPage;
