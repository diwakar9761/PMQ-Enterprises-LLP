
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  PackageCheck,
  Sprout,
  Truck,
  RefreshCw,
} from "lucide-react";

import {
  getAllProducts,
  getAllCategories,
} from "../services/productService";
import Enquiry from "../components/Enquiry";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85";

const strengths = [
  {
    icon: Sprout,
    title: "Careful Sourcing",
    description:
      "Product sourcing guided by your specifications and target market requirements.",
  },
  {
    icon: PackageCheck,
    title: "Flexible Packaging",
    description:
      "Discuss retail-ready, private-label and bulk packaging options.",
  },
  {
    icon: Globe2,
    title: "Global Focus",
    description:
      "A catalogue designed to serve international buyers and distributors.",
  },
  {
    icon: Truck,
    title: "Export Coordination",
    description:
      "Coordinate order requirements, documentation and shipping arrangements.",
  },
];

function getProductImage(product) {
  return (
    product?.image ||
    product?.gallery?.find((image) => typeof image === "string" && image) ||
    FALLBACK_IMAGE
  );
}

function LoadingMessage() {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-white/55">
      <RefreshCw size={17} className="animate-spin text-brand-gold" />
      Loading catalogue...
    </div>
  );
}

function CatalogueError({ onRetry }) {
  return (
    <div className="border border-white/10 bg-brand-dark px-5 py-8 text-center">
      <p className="text-sm text-white/65">
        We couldn't load the product catalogue.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 text-sm text-brand-gold transition hover:text-brand-ivory"
      >
        <RefreshCw size={15} />
        Try again
      </button>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    const openEnquiry = () => setIsEnquiryOpen(true);
  const closeEnquiry = () => setIsEnquiryOpen(false);

  async function loadCatalogue(forceRefresh = false) {
    setLoading(true);
    setError(false);

    try {
      const [productData, categoryData] = await Promise.all([
        getAllProducts({ forceRefresh }),
        getAllCategories(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      console.error("Unable to load homepage catalogue:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalogue();
  }, []);

  // Build homepage category cards from active Google Sheets products.
  const dynamicCategories = useMemo(() => {
    return categories
      .map((category) => {
        const categoryProducts = products.filter(
          (product) => product.categorySlug === category.slug
        );

        const productWithImage = categoryProducts.find(
          (product) =>
            product.image ||
            product.gallery?.some(
              (image) => typeof image === "string" && image
            )
        );

        const firstProduct = categoryProducts[0];

        return {
          ...category,
          products: categoryProducts,
          image: getProductImage(productWithImage || firstProduct),
          description:
            firstProduct?.shortDescription?.trim() ||
            `${categoryProducts.length} product${
              categoryProducts.length === 1 ? "" : "s"
            } available in this category.`,
        };
      })
      .filter((category) => category.products.length > 0);
  }, [categories, products]);

  // Only products marked featured in the sheet appear in this section.
  const featuredProducts = useMemo(() => {
    return products.filter((product) => product.featured);
  }, [products]);

  return (
    <>
    <div className="overflow-hidden bg-brand-black text-brand-ivory">
      {/* Hero */}
      <section className="relative isolate min-h-[620px] border-b border-brand-gold/15 sm:min-h-[680px]">
        <img
          src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=90"
          alt="An arrangement of fresh ingredients and spices"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-black via-brand-black/90 to-brand-black/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-black/80 via-transparent to-brand-black/20" />

        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-20 sm:min-h-[680px] sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-brand-gold" />
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-brand-gold sm:text-sm">
                Indian Food Exports
              </p>
            </div>

            <h1 className="text-4xl font-light leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              The richness of India.
              <span className="mt-2 block font-medium text-brand-gold">
                Delivered worldwide.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Discover Indian food products for international markets.
              Explore our catalogue and connect with us for sourcing,
              packaging and bulk export enquiries.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-3 bg-brand-gold px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark transition hover:bg-brand-ivory"
              >
                Explore our products
                <ArrowRight size={17} />
              </Link>

              <Link
                onClick={openEnquiry}
                className="inline-flex items-center justify-center gap-3 border border-brand-gold/70 bg-black/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-ivory transition hover:bg-brand-gold hover:text-brand-dark"
              >
                Request an enquiry
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.15em] text-white/55">
              <span>Indian Origin</span>
              <span className="h-1 w-1 rounded-full bg-brand-gold" />
              <span>Quality Focus</span>
              <span className="h-1 w-1 rounded-full bg-brand-gold" />
              <span>Global Markets</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 hidden border-l border-t border-brand-gold/25 bg-brand-black/70 px-8 py-5 backdrop-blur-sm md:block">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">
            From India, with purpose
          </p>
        </div>
      </section>

      {/* Introduction strip */}
      <section className="border-b border-brand-gold/15 bg-brand-dark">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-7 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Sprout className="shrink-0 text-brand-gold" size={22} />
            <div>
              <p className="text-sm font-medium">Indian food products</p>
              <p className="mt-1 text-xs text-white/50">
                A diverse product catalogue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:justify-center">
            <PackageCheck className="shrink-0 text-brand-gold" size={22} />
            <div>
              <p className="text-sm font-medium">Packaging options</p>
              <p className="mt-1 text-xs text-white/50">
                Based on product and order needs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:justify-end">
            <Globe2 className="shrink-0 text-brand-gold" size={22} />
            <div>
              <p className="text-sm font-medium">Export enquiries</p>
              <p className="mt-1 text-xs text-white/50">
                Connect with our team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
              Explore our catalogue
            </p>

            <h2 className="mt-4 text-3xl font-light sm:text-4xl">
              Categories for{" "}
              <span className="font-medium">every market</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
              Browse our product categories and discover options for
              wholesale, distribution and international sourcing.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 text-sm text-brand-gold transition hover:text-brand-ivory"
          >
            View all categories <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-10">
          {loading ? (
            <LoadingMessage />
          ) : error ? (
            <CatalogueError onRetry={() => loadCatalogue(true)} />
          ) : dynamicCategories.length === 0 ? (
            <div className="border border-white/10 bg-brand-dark px-5 py-10 text-center">
              <p className="text-white/65">
                Our product categories are being updated.
              </p>
              <Link
                to="/products"
                className="mt-4 inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-ivory"
              >
                Explore the catalogue <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {dynamicCategories.map((category, index) => (
                <Link
                  key={category.slug}
                  to={`/products/${category.slug}`}
                  className="group relative min-h-[330px] overflow-hidden border border-white/10 bg-brand-dark"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs tracking-[0.2em] text-brand-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>

                    <h3 className="text-xl font-medium">
                      {category.name}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/65">
                      {category.description}
                    </p>

                    <p className="mt-3 text-xs text-brand-gold">
                      {category.products.length}{" "}
                      {category.products.length === 1 ? "product" : "products"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About / brand story */}
      <section className="border-y border-brand-gold/15 bg-brand-dark">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:gap-16 lg:px-8 lg:py-24">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85"
              alt="Ingredients prepared for cooking"
              loading="lazy"
              className="h-[350px] w-full object-cover sm:h-[440px]"
            />

            <div className="absolute -bottom-4 -right-3 border border-brand-gold/60 bg-brand-black px-5 py-4 sm:-right-5">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">
                Indian origin
              </p>
              <p className="mt-1 text-sm text-brand-ivory">
                International ambition
              </p>
            </div>
          </div>

          <div className="pt-3 md:pt-0">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
              About our approach
            </p>

            <h2 className="mt-5 text-3xl font-light leading-tight sm:text-4xl">
              Rooted in India.
              <span className="mt-2 block font-medium text-brand-gold">
                Focused on the world.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/60">
              We aim to connect international buyers with Indian food
              products through clear communication, thoughtful sourcing
              and export-oriented service.
            </p>

            <p className="mt-4 text-sm leading-7 text-white/60">
              Whether you are a wholesaler, importer, distributor or
              private-label buyer, tell us what your market needs so we
              can discuss suitable products and supply requirements.
            </p>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-3 border-b border-brand-gold pb-2 text-sm font-medium text-brand-gold transition hover:text-brand-ivory"
            >
              Discover our company <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why work with us */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
            Built around your requirements
          </p>

          <h2 className="mt-4 text-3xl font-light sm:text-4xl">
            A considered approach to{" "}
            <span className="font-medium">export supply</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/55">
            Every enquiry starts with understanding the product,
            destination market and buyer&apos;s requirements.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="border border-white/10 bg-brand-dark p-6 transition duration-300 hover:border-brand-gold/50"
            >
              <div className="flex h-12 w-12 items-center justify-center border border-brand-gold/30 text-brand-gold">
                <Icon size={22} strokeWidth={1.5} />
              </div>

              <p className="mt-5 text-xs tracking-[0.15em] text-brand-gold">
                0{index + 1}
              </p>

              <h3 className="mt-2 text-lg font-medium">{title}</h3>

              <p className="mt-3 text-sm leading-7 text-white/55">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic featured products */}
      <section className="border-y border-brand-gold/15 bg-brand-dark">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-gold">
                Product selection
              </p>

              <h2 className="mt-4 text-3xl font-light sm:text-4xl">
                Explore selected{" "}
                <span className="font-medium">products</span>
              </h2>
            </div>

            <Link
              to="/products"
              className="inline-flex w-fit items-center gap-2 text-sm text-brand-gold hover:text-brand-ivory"
            >
              Browse catalogue <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10">
            {loading ? (
              <LoadingMessage />
            ) : error ? (
              <CatalogueError onRetry={() => loadCatalogue(true)} />
            ) : featuredProducts.length === 0 ? (
              <div className="border border-white/10 bg-brand-black px-5 py-10 text-center">
                <p className="text-white/65">
                  Featured products will appear here soon.
                </p>

                <p className="mt-2 text-sm text-white/45">
                  Browse our complete catalogue to explore available products.
                </p>

                <Link
                  to="/products"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-ivory"
                >
                  View all products <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <article
                    key={product.id || product.slug}
                    className="group border border-white/10 bg-brand-black"
                  >
                    <Link
                      to={`/product/${product.slug}`}
                      className="block"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        <span className="absolute left-4 top-4 bg-brand-black/85 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-brand-gold">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 p-5">
                        <div>
                          <h3 className="text-lg font-medium">
                            {product.name}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-sm text-white/50">
                            {product.shortDescription ||
                              "Explore product details and specifications."}
                          </p>
                        </div>

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-gold/40 text-brand-gold transition group-hover:bg-brand-gold group-hover:text-brand-dark">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
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
