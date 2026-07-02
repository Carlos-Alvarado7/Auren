import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concat, EMPTY, map, Observable, of, tap } from 'rxjs';
import { API_BASE_URL, PUBLIC_MENU_SLUG } from './api.tokens';
import {
  AdminMenu,
  CreateProductInput,
  MenuCategory,
  MenuProduct,
  PublicMenu
} from './menu.models';
import { normalizeAdminMenu, normalizePublicMenu } from './normalize-menu';

const PUBLIC_MENU_CACHE_PREFIX = 'auren.public-menu.';
const PUBLIC_MENU_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface PublicMenuCacheEntry {
  savedAt: number;
  menu: PublicMenu;
}

@Injectable({ providedIn: 'root' })
export class MenuApiService {
  constructor(private readonly http: HttpClient) {}

  getPublicMenu(slug = PUBLIC_MENU_SLUG): Observable<PublicMenu> {
    const cachedMenu = this.getCachedPublicMenu(slug);
    const remoteMenu$ = this.http.get<PublicMenu>(`${API_BASE_URL}/menu/${slug}`).pipe(
      map(normalizePublicMenu),
      tap((menu) => this.cachePublicMenu(slug, menu))
    );

    if (!cachedMenu) {
      return remoteMenu$;
    }

    return concat(of(cachedMenu), remoteMenu$.pipe(catchError(() => EMPTY)));
  }

  getAdminMenu(): Observable<AdminMenu> {
    return this.http.get<AdminMenu>(`${API_BASE_URL}/admin/menu`).pipe(map(normalizeAdminMenu));
  }

  updateMeta(input: { brandName?: string; subtitle?: string }): Observable<AdminMenu> {
    return this.http.patch<AdminMenu>(`${API_BASE_URL}/admin/menu/meta`, input).pipe(map(normalizeAdminMenu));
  }

  createCategory(input: Partial<MenuCategory> & { title: string }): Observable<AdminMenu> {
    return this.http.post<AdminMenu>(`${API_BASE_URL}/admin/menu/categories`, input).pipe(map(normalizeAdminMenu));
  }

  updateCategory(categoryId: string, input: Partial<MenuCategory>): Observable<AdminMenu> {
    return this.http
      .patch<AdminMenu>(`${API_BASE_URL}/admin/menu/categories/${categoryId}`, input)
      .pipe(map(normalizeAdminMenu));
  }

  deleteCategory(categoryId: string): Observable<AdminMenu> {
    return this.http
      .delete<AdminMenu>(`${API_BASE_URL}/admin/menu/categories/${categoryId}`)
      .pipe(map(normalizeAdminMenu));
  }

  createProduct(categoryId: string, input: CreateProductInput): Observable<AdminMenu> {
    return this.http
      .post<AdminMenu>(`${API_BASE_URL}/admin/menu/categories/${categoryId}/products`, input)
      .pipe(map(normalizeAdminMenu));
  }

  updateProduct(categoryId: string, productId: string, input: Partial<MenuProduct>): Observable<AdminMenu> {
    return this.http
      .patch<AdminMenu>(`${API_BASE_URL}/admin/menu/categories/${categoryId}/products/${productId}`, input)
      .pipe(map(normalizeAdminMenu));
  }

  deleteProduct(categoryId: string, productId: string): Observable<AdminMenu> {
    return this.http
      .delete<AdminMenu>(`${API_BASE_URL}/admin/menu/categories/${categoryId}/products/${productId}`)
      .pipe(map(normalizeAdminMenu));
  }

  reorder(input: {
    categories?: Array<{ categoryId: string; sortOrder: number }>;
    categoryId?: string;
    products?: Array<{ productId: string; sortOrder: number }>;
  }): Observable<AdminMenu> {
    return this.http.patch<AdminMenu>(`${API_BASE_URL}/admin/menu/reorder`, input).pipe(map(normalizeAdminMenu));
  }

  publish(): Observable<AdminMenu> {
    return this.http.post<AdminMenu>(`${API_BASE_URL}/admin/menu/publish`, {}).pipe(map(normalizeAdminMenu));
  }

  private getCachedPublicMenu(slug: string): PublicMenu | null {
    try {
      const rawEntry = localStorage.getItem(this.getPublicMenuCacheKey(slug));
      if (!rawEntry) {
        return null;
      }

      const entry = JSON.parse(rawEntry) as PublicMenuCacheEntry;
      if (!entry.menu || Date.now() - entry.savedAt > PUBLIC_MENU_CACHE_TTL_MS) {
        localStorage.removeItem(this.getPublicMenuCacheKey(slug));
        return null;
      }

      return normalizePublicMenu(entry.menu);
    } catch {
      return null;
    }
  }

  private cachePublicMenu(slug: string, menu: PublicMenu): void {
    try {
      const entry: PublicMenuCacheEntry = {
        savedAt: Date.now(),
        menu
      };
      localStorage.setItem(this.getPublicMenuCacheKey(slug), JSON.stringify(entry));
    } catch {
      // Storage can fail in private mode or when quota is exceeded; the network path still works.
    }
  }

  private getPublicMenuCacheKey(slug: string): string {
    return `${PUBLIC_MENU_CACHE_PREFIX}${slug}`;
  }
}
