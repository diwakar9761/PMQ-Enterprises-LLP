
const API_URL = import.meta.env.VITE_PRODUCTS_API_URL;

let cachedProducts = null;
let lastFetchedAt = 0;
let pendingRequest = null;

const CACHE_DURATION = 60 * 1000; // 1 minute

const ARRAY_FIELDS = [
  "gallery",
  "applications",
  "certifications",
  "features",
  "documents",
];

function toBoolean(value) {
  return value === true || String(value).trim().toLowerCase() === "true";
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  // Supports JSON arrays returned by Apps Script.
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProduct(product) {
  const normalized = { ...product };

  ARRAY_FIELDS.forEach((field) => {
    normalized[field] = toArray(normalized[field]);
  });

  normalized.featured = toBoolean(normalized.featured);
  normalized.isActive = toBoolean(normalized.isActive);

  normalized.category = String(normalized.category || "Other").trim();
  normalized.categorySlug =
    String(normalized.categorySlug || "").trim() ||
    slugify(normalized.category);

  normalized.slug =
    String(normalized.slug || "").trim() ||
    slugify(normalized.name);

  normalized.id =
    String(normalized.id || "").trim() ||
    normalized.slug;

  normalized.gallery = normalized.gallery.length
    ? normalized.gallery
    : normalized.image
      ? [normalized.image]
      : [];

  return normalized;
}

export async function fetchProducts({ forceRefresh = false } = {}) {
  if (!API_URL) {
    throw new Error(
      "Google Sheets API URL is missing. Check VITE_PRODUCTS_API_URL in your .env file."
    );
  }

  const cacheIsValid =
    cachedProducts &&
    Date.now() - lastFetchedAt < CACHE_DURATION;

  if (!forceRefresh && cacheIsValid) {
    return cachedProducts;
  }

  if (!forceRefresh && pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = (async () => {
    const response = await fetch(API_URL, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Product API returned HTTP ${response.status}.`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Unable to load products from Google Sheets.");
    }

    if (!Array.isArray(data.products)) {
      throw new Error("The API response does not contain a products array.");
    }

    const products = data.products
      .map(normalizeProduct)
      .filter((product) => product.isActive);

    cachedProducts = products;
    lastFetchedAt = Date.now();

    return products;
  })();

  try {
    return await pendingRequest;
  } finally {
    pendingRequest = null;
  }
}

export async function getAllProducts() {
  return fetchProducts();
}

export async function getFeaturedProducts() {
  const products = await fetchProducts();
  return products.filter((product) => product.featured);
}

export async function getProductBySlug(slug) {
  const products = await fetchProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductsByCategory(categorySlug) {
  const products = await fetchProducts();

  if (!categorySlug || categorySlug === "all") {
    return products;
  }

  return products.filter(
    (product) => product.categorySlug === categorySlug
  );
}

export async function getAllCategories() {
  const products = await fetchProducts();
  const uniqueCategories = new Map();

  products.forEach((product) => {
    const slug = product.categorySlug || slugify(product.category);

    if (slug && !uniqueCategories.has(slug)) {
      uniqueCategories.set(slug, {
        name: product.category || "Other",
        slug,
      });
    }
  });

  return Array.from(uniqueCategories.values());
}

export async function searchProducts(searchTerm = "") {
  const products = await fetchProducts();
  const query = searchTerm.trim().toLowerCase();

  if (!query) return products;

  return products.filter((product) =>
    [
      product.name,
      product.category,
      product.shortDescription,
      product.description,
      product.origin,
    ].some((value) => String(value || "").toLowerCase().includes(query))
  );
}
