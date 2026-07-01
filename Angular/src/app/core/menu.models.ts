export interface MenuVariant {
  name: string;
  priceCop: number;
  visible?: boolean;
  sortOrder?: number;
}

export interface MenuProduct {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  priceCop: number;
  variants: MenuVariant[];
  visible?: boolean;
  available: boolean;
  sortOrder: number;
}

export interface MenuCategory {
  id: string;
  _id?: string;
  title: string;
  icon?: string;
  visible?: boolean;
  sortOrder: number;
  products: MenuProduct[];
}

export interface PublicMenu {
  slug: string;
  brandName: string;
  subtitle: string;
  publishedAt?: string;
  categories: MenuCategory[];
}

export interface AdminMenuVersion {
  brandName: string;
  subtitle: string;
  categories: MenuCategory[];
}

export interface AdminMenu {
  _id: string;
  slug: string;
  draft: AdminMenuVersion;
  published: AdminMenuVersion;
  publishedAt?: string;
}

export interface AuthenticatedAdmin {
  email: string;
  role: 'admin';
}

export interface CreateProductInput {
  name: string;
  description?: string;
  priceCop: number;
  variants: MenuVariant[];
  visible: boolean;
  available: boolean;
}

