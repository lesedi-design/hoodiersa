export type Product = {
  id: string;
  slug: string;
  name: string;
  descriptor: string;
  basePrice: number;
  image: string;
  bg: string;
  panel: string;
  darkText: boolean;
  accent: string;
  colors: { label: string; value: string }[];
};

export const PRODUCTS: Product[] = [
  {
    id: "01",
    slug: "jack-and-sally",
    name: "Moonlit Pairing",
    descriptor: "Two souls, one silver moon.",
    basePrice: 450,
    image: "/manus-storage/hoodiersa-jack-sally-inspired_40a99708.png",
    bg: "#B5342E",
    panel: "#C94F49",
    darkText: false,
    accent: "#F4D9D1",
    colors: [{ label: "Ritual red", value: "#B5342E" }, { label: "Ink", value: "#171515" }, { label: "Bone", value: "#EFE9DA" }],
  },
  {
    id: "02",
    slug: "oogie-boogie",
    name: "Burlap Moon",
    descriptor: "A crooked smile for moonless plans.",
    basePrice: 320,
    image: "/manus-storage/hoodiersa-burlap-ghoul-v2_05a3664e.png",
    bg: "#EFA8C4",
    panel: "#F2BBD1",
    darkText: true,
    accent: "#4E2839",
    colors: [{ label: "Candy pink", value: "#EFA8C4" }, { label: "Moss", value: "#8B997D" }, { label: "Oat", value: "#D6C29A" }],
  },
  {
    id: "03",
    slug: "checkered-character",
    name: "Patchwork Cat",
    descriptor: "Nine lives. One clean stitch.",
    basePrice: 250,
    image: "/manus-storage/hoodiersa-checkered-cat-v2_01b249dc.png",
    bg: "#939393",
    panel: "#B0B0B0",
    darkText: true,
    accent: "#302329",
    colors: [{ label: "Cemetery", value: "#939393" }, { label: "Night", value: "#171515" }, { label: "Check", value: "#F1EEDF" }],
  },
  {
    id: "04",
    slug: "corpse-bride",
    name: "Veil at Midnight",
    descriptor: "Something borrowed. Something blue.",
    basePrice: 380,
    image: "/manus-storage/hoodiersa-gothic-bride-v2_68496a7e.png",
    bg: "#DCDCDC",
    panel: "#EAEAEA",
    darkText: true,
    accent: "#2C4960",
    colors: [{ label: "Ghost", value: "#ECEBE5" }, { label: "Mist", value: "#B5D0D9" }, { label: "Ink", value: "#171515" }],
  },
];

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = typeof SIZE_ORDER[number];
export const SIZE_STEP = 14;
export function isValidSize(value: string): value is Size { return (SIZE_ORDER as readonly string[]).includes(value.trim().toUpperCase()); }

export function getPrice(productSlug: string, size: Size): number {
  const product = PRODUCTS.find((p) => p.slug === productSlug);
  if (!product) return 0;
  const stepIndex = SIZE_ORDER.indexOf(size);
  return product.basePrice + stepIndex * SIZE_STEP;
}

export type CartItem = {
  id: string; // unique cart item id (e.g. slug-color-size)
  productSlug: string;
  colorway: string;
  size: Size;
  quantity: number;
};
