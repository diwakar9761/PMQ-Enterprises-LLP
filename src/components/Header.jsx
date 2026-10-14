
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import Logo from "../assets/logo-black-small.jpg";
import {
  getAllProducts,
  getAllCategories,
} from "../services/productService";
import Enquiry from "./Enquiry";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors duration-200 ${
    isActive
      ? "text-brand-gold"
      : "text-brand-ivory hover:text-brand-gold"
  }`;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogueLoading, setCatalogueLoading] = useState(true);
  const [catalogueError, setCatalogueError] = useState(false);

  // Load products and categories from Google Sheets.
  const loadCatalogue = useCallback(async () => {
    setCatalogueLoading(true);
    setCatalogueError(false);

    try {
      const [productData, categoryData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (error) {
      console.error("Unable to load header catalogue:", error);
      setCatalogueError(true);
    } finally {
      setCatalogueLoading(false);
    }
  }, []);

  const openEnquiry = () => setIsEnquiryOpen(true);
  const closeEnquiry = () => setIsEnquiryOpen(false);

  useEffect(() => {
    loadCatalogue();
  }, [loadCatalogue]);

  // Group products under their respective categories.
  const productCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      products: products.filter(
        (product) => product.categorySlug === category.slug
      ),
    }));
  }, [categories, products]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
    setMobileCategoryOpen(null);
  };

  return (
    <>
    <header className="relative z-50 border-b border-brand-gold/20 bg-brand-black text-brand-ivory">
      {/* Top information bar */}
      <div className="border-b border-white/10 bg-brand-dark">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <p className="tracking-wider text-white/65">
            INDIAN ORIGIN{" "}
            <span className="px-2 text-brand-gold">|</span>
            GLOBAL REACH
          </p>

          <p className="tracking-wide text-white/80">
            GSTIN:
            <span className="ml-2 font-medium tracking-wider text-brand-gold">
              {import.meta.env.VITE_GST_NUMBER || "GEVPS5600k"}
            </span>
          </p>
        </div>
      </div>

      {/* Main navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          aria-label="Home"
          className=""
        >
          <img
            src={Logo}
            alt="PA brand logo"
            className="w-40"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          {/* Dynamic products dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 py-5 text-sm font-medium tracking-wide text-brand-ivory transition-colors hover:text-brand-gold"
              aria-haspopup="true"
            >
              Products
              <ChevronDown
                size={15}
                className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
              />
            </button>

            <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 translate-y-2 border border-brand-gold/25 bg-brand-dark opacity-0 shadow-2xl shadow-black/50 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {/* Dropdown heading */}
              <div className="border-b border-brand-gold/20 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">
                  Our Collection
                </p>

                <Link
                  to="/products"
                  className="mt-2 inline-flex items-center gap-2 text-sm text-brand-ivory hover:text-brand-gold"
                >
                  View all products
                  <ArrowUpRight size={15} />
                </Link>
              </div>

              {/* Dynamic categories */}
              <div className="max-h-[65vh] py-2">
                {catalogueLoading && (
                  <p className="px-5 py-4 text-sm text-white/50">
                    Loading catalogue...
                  </p>
                )}

                {!catalogueLoading &&
                  catalogueError && (
                    <div className="px-5 py-4">
                      <p className="text-sm text-white/60">
                        Unable to load the catalogue.
                      </p>

                      <button
                        type="button"
                        onClick={loadCatalogue}
                        className="mt-2 text-xs text-brand-gold hover:text-brand-ivory"
                      >
                        Try again
                      </button>
                    </div>
                  )}

                {!catalogueLoading &&
                  !catalogueError &&
                  productCategories.length === 0 && (
                    <p className="px-5 py-4 text-sm text-white/50">
                      No product categories available.
                    </p>
                  )}

                {!catalogueLoading &&
                  !catalogueError &&
                  productCategories.map((category) => (
                    <div
                      key={category.slug}
                      className="group/category relative"
                    >
                      <div className="flex items-center justify-between border-l-2 border-transparent px-5 py-3 transition-colors hover:border-brand-gold hover:bg-white/5">
                        <Link
                          to={`/products/${category.slug}`}
                          className="flex-1 text-sm text-brand-ivory hover:text-brand-gold"
                        >
                          {category.name}
                        </Link>

                        {category.products.length > 0 && (
                          <ChevronRight
                            size={15}
                            className="text-brand-gold/70"
                          />
                        )}
                      </div>

                      {/* Second-level product menu */}
                      {category.products.length > 0 && (
                        <div className="invisible absolute left-full top-0 ml-px w-64 -translate-x-1 opacity-0 transition-all duration-200 group-hover/category:visible group-hover/category:translate-x-0 group-hover/category:opacity-100 group-focus-within/category:visible group-focus-within/category:translate-x-0 group-focus-within/category:opacity-100">
                          <div className="border border-brand-gold/25 bg-brand-dark py-3 shadow-2xl shadow-black/50">
                            <p className="px-4 pb-2 text-xs uppercase tracking-widest text-brand-gold">
                              {category.name}
                            </p>

                            {category.products.map((product) => (
                              <Link
                                key={product.id || product.slug}
                                to={`/product/${product.slug}`}
                                className="block px-4 py-2.5 text-sm text-brand-ivory/80 transition-colors hover:bg-white/5 hover:text-brand-gold"
                              >
                                {product.name}
                              </Link>
                            ))}

                            <div className="mt-2 border-t border-white/10 pt-2">
                              <Link
                                to={`/products/${category.slug}`}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-brand-gold"
                              >
                                View category
                                <ArrowUpRight size={13} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>

          <Link
            onClick={openEnquiry}
            className="inline-flex items-center gap-2 border border-brand-gold bg-brand-gold px-5 py-3 text-xs font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:bg-transparent hover:text-brand-gold"
          >
            Contact us
            <ArrowUpRight size={15} />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex items-center justify-center border border-brand-gold/30 p-2 text-brand-gold lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-brand-gold/20 bg-brand-dark px-4 pb-5 pt-3 lg:hidden"
        >
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `block border-b border-white/10 py-3 text-sm ${
                isActive ? "text-brand-gold" : "text-brand-ivory"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `block border-b border-white/10 py-3 text-sm ${
                isActive ? "text-brand-gold" : "text-brand-ivory"
              }`
            }
          >
            About
          </NavLink>

          {/* Mobile products accordion */}
          <button
            type="button"
            onClick={() => setMobileProductsOpen((open) => !open)}
            className="flex w-full items-center justify-between border-b border-white/10 py-3 text-sm text-brand-ivory"
            aria-expanded={mobileProductsOpen}
          >
            Products
            <ChevronDown
              size={17}
              className={`text-brand-gold transition-transform ${
                mobileProductsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mobileProductsOpen && (
            <div className="border-b border-white/10 py-2 pl-3">
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="block py-3 text-sm font-medium text-brand-gold"
              >
                View all products →
              </Link>

              {catalogueLoading && (
                <p className="py-3 text-sm text-white/50">
                  Loading catalogue...
                </p>
              )}

              {!catalogueLoading && catalogueError && (
                <div className="py-3">
                  <p className="text-sm text-white/60">
                    Unable to load products.
                  </p>

                  <button
                    type="button"
                    onClick={loadCatalogue}
                    className="mt-2 text-xs text-brand-gold"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!catalogueLoading &&
                !catalogueError &&
                productCategories.map((category) => {
                  const expanded = mobileCategoryOpen === category.slug;

                  return (
                    <div key={category.slug}>
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          to={`/products/${category.slug}`}
                          onClick={closeMobileMenu}
                          className="flex-1 py-3 text-sm text-brand-ivory/80"
                        >
                          {category.name}
                        </Link>

                        {category.products.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setMobileCategoryOpen(
                                expanded ? null : category.slug
                              )
                            }
                            className="p-2 text-brand-gold"
                            aria-label={`Show ${category.name} products`}
                            aria-expanded={expanded}
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {expanded && (
                        <div className="mb-2 border-l border-brand-gold/30 pl-4">
                          {category.products.map((product) => (
                            <Link
                              key={product.id || product.slug}
                              to={`/product/${product.slug}`}
                              onClick={closeMobileMenu}
                              className="block py-2.5 text-sm text-white/65 transition-colors hover:text-brand-gold"
                            >
                              {product.name}
                            </Link>
                          ))}

                          <Link
                            to={`/products/${category.slug}`}
                            onClick={closeMobileMenu}
                            className="block py-2.5 text-xs font-medium text-brand-gold"
                          >
                            View category →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          <NavLink
            to="/contact"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `block border-b border-white/10 py-3 text-sm ${
                isActive ? "text-brand-gold" : "text-brand-ivory"
              }`
            }
          >
            Contact
          </NavLink>

          <Link
            to="/contact"
            onClick={closeMobileMenu}
            className="mt-4 flex items-center justify-center gap-2 bg-brand-gold px-5 py-3 text-sm font-semibold uppercase tracking-widest text-brand-dark"
          >
            Export Enquiry
            <ArrowUpRight size={16} />
          </Link>

          <p className="mt-5 text-xs text-white/60">
            GSTIN:{" "}
            <span className="text-brand-gold">24BGIPC0870P1Z9</span>
          </p>
        </nav>
      )}
    </header>
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