import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Search,
  SlidersHorizontal,
  PackageOpen,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { fetchProducts, getAllCategories } from "../services/productService";
import Enquiry from "../components/Enquiry";

function ProductListing() {
  const { category } = useParams();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts(forceRefresh = false) {
    try {
      setLoading(true);
      setError("");

      const [productData, categoryData] = await Promise.all([
        fetchProducts({ forceRefresh }),
        getAllCategories(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      setError(
        err.message || "We couldn't load our products. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const openEnquiry = () => setIsEnquiryOpen(true);
  const closeEnquiry = () => setIsEnquiryOpen(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const activeCategory = useMemo(() => {
    if (!category || category === "all") return null;

    return categories.find((item) => item.slug === category) || null;
  }, [category, categories]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category && category !== "all") {
      result = result.filter((product) => product.categorySlug === category);
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.shortDescription,
          product.description,
          product.origin,
          ...(product.applications || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || "")),
        );
        break;

      case "name-desc":
        result.sort((a, b) =>
          String(b.name || "").localeCompare(String(a.name || "")),
        );
        break;

      case "category":
        result.sort((a, b) =>
          String(a.category || "").localeCompare(String(b.category || "")),
        );
        break;

      case "featured":
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return result;
  }, [products, category, search, sortBy]);

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-brand-black px-5 py-24 text-center text-brand-ivory sm:px-8">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <RefreshCw className="mb-5 h-8 w-8 animate-spin text-brand-gold" />
          <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">
            Our collection
          </p>
          <h1 className="mt-3 text-2xl font-light sm:text-3xl">
            Loading products
          </h1>
          <p className="mt-3 text-sm text-brand-ivory/60">
            Please wait while we fetch our latest catalogue.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] bg-brand-black px-5 py-24 text-center text-brand-ivory sm:px-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">
          Catalogue unavailable
        </p>
        <h1 className="mt-4 text-3xl font-light">
          We couldn't load the products
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-brand-ivory/60">
          {error}
        </p>
        <button
          type="button"
          onClick={() => loadProducts(true)}
          className="mt-8 inline-flex items-center gap-2 border border-brand-gold px-6 py-3 text-sm text-brand-gold transition hover:bg-brand-gold hover:text-brand-dark"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-brand-black text-brand-ivory">
        {/* Page introduction */}
        <section className="border-b border-brand-gold/15 bg-brand-dark px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-brand-gold">
              <span className="h-px w-10 bg-brand-gold" />
              Quality sourced. Globally delivered.
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
                  Our <span className="text-brand-gold">Products</span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-brand-ivory/65 sm:text-base">
                  Explore our export catalogue of food products and agricultural
                  commodities. Select a product to discover its specifications
                  and discuss your sourcing requirements.
                </p>
              </div>

              <div className="border-l border-brand-gold/30 pl-5 md:text-right">
                <p className="text-3xl font-light text-brand-gold">
                  {filteredProducts.length.toString().padStart(2, "0")}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brand-ivory/50">
                  {filteredProducts.length === 1 ? "Product" : "Products"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Catalogue */}
        <section className="px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            {/* Category filters */}
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                to="/products"
                className={`border px-4 py-2 text-xs uppercase tracking-wider transition ${
                  !category || category === "all"
                    ? "border-brand-gold bg-brand-gold text-brand-dark"
                    : "border-brand-ivory/15 text-brand-ivory/70 hover:border-brand-gold hover:text-brand-gold"
                }`}
              >
                All products
              </Link>

              {categories.map((item) => (
                <Link
                  key={item.slug}
                  to={`/products/${item.slug}`}
                  className={`border px-4 py-2 text-xs uppercase tracking-wider transition ${
                    category === item.slug
                      ? "border-brand-gold bg-brand-gold text-brand-dark"
                      : "border-brand-ivory/15 text-brand-ivory/70 hover:border-brand-gold hover:text-brand-gold"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search and sort */}
            <div className="mb-10 grid gap-4 border-y border-brand-ivory/10 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/70"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products, categories or applications..."
                  aria-label="Search products"
                  className="w-full border border-brand-ivory/15 bg-brand-dark py-3 pl-11 pr-4 text-sm text-brand-ivory outline-none transition placeholder:text-brand-ivory/35 focus:border-brand-gold"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-brand-ivory/65">
                <SlidersHorizontal size={17} className="text-brand-gold" />
                <span className="whitespace-nowrap">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort products"
                  className="min-w-0 border border-brand-ivory/15 bg-brand-dark px-3 py-3 text-sm text-brand-ivory outline-none focus:border-brand-gold"
                >
                  <option value="featured">Featured first</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="category">Category</option>
                </select>
              </label>
            </div>

            {/* Selected category */}
            {activeCategory && (
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-brand-gold">
                  Category
                </p>
                <h2 className="mt-2 text-2xl font-light">
                  {activeCategory.name}
                </h2>
              </div>
            )}

            {/* Product grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const image = product.image || product.gallery?.[0] || "";

                  return (
                    <article
                      key={product.id || product.slug}
                      className="group flex min-w-0 flex-col border border-brand-ivory/10 bg-brand-dark transition duration-300 hover:border-brand-gold/50"
                    >
                      <Link
                        to={`/product/${product.slug}`}
                        className="relative block overflow-hidden bg-brand-black"
                      >
                        <div className="overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <PackageOpen
                                size={48}
                                strokeWidth={1}
                                className="text-brand-gold/50"
                              />
                            </div>
                          )}
                        </div>

                        {product.featured && (
                          <span className="absolute left-3 top-3 bg-brand-gold px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-brand-dark">
                            Featured
                          </span>
                        )}
                      </Link>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold/80">
                          {product.category || "Our collection"}
                        </p>

                        <h2 className="mt-3 text-xl font-light leading-snug transition group-hover:text-brand-gold">
                          <Link to={`/product/${product.slug}`}>
                            {product.name}
                          </Link>
                        </h2>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-ivory/60">
                          {product.shortDescription ||
                            product.description ||
                            "Contact us for product specifications and export enquiries."}
                        </p>

                        <div className="mt-auto pt-6">
                          <Link
                            to={`/product/${product.slug}`}
                            className="inline-flex items-center gap-2 border-t border-brand-ivory/10 pt-4 text-xs uppercase tracking-[0.18em] text-brand-gold transition hover:text-brand-ivory"
                          >
                            View details
                            <ArrowRight
                              size={15}
                              className="transition group-hover:translate-x-1"
                            />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="border border-brand-ivory/10 px-6 py-16 text-center">
                <PackageOpen
                  size={38}
                  strokeWidth={1}
                  className="mx-auto text-brand-gold"
                />

                <h2 className="mt-5 text-2xl font-light">No products found</h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-brand-ivory/60">
                  {products.length === 0
                    ? "There are currently no active products in the catalogue."
                    : "Try a different search term or browse all available products."}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    window.history.pushState({}, "", "/products");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-ivory"
                >
                  <ArrowDown size={15} />
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Export enquiry banner */}
        <div className="border-b border-brand-gold/20 bg-brand-dark">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-brand-gold">
                Let&apos;s work together
              </p>
              <h2 className="text-2xl font-light leading-snug sm:text-3xl">
                Looking for a reliable{" "}
                <span className="font-medium text-brand-gold">
                  Indian export partner?
                </span>
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Connect with us to discuss your product requirements, packaging
                preferences and bulk enquiries.
              </p>
            </div>

            <Link
              onClick={openEnquiry}
              className="inline-flex w-fit shrink-0 items-center gap-3 border border-brand-gold bg-brand-gold px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark transition hover:bg-transparent hover:text-brand-gold"
            >
              Send an enquiry <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      {isEnquiryOpen && (
        <Enquiry isOpen={isEnquiryOpen} onClose={closeEnquiry} />
      )}
    </>
  );
}

export default ProductListing;
