import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL, PUBLIC_MENU_SLUG } from './api.tokens';
import {
  AdminMenu,
  CreateProductInput,
  MenuCategory,
  MenuProduct,
  PublicMenu
} from './menu.models';
import { normalizeAdminMenu, normalizePublicMenu } from './normalize-menu';

@Injectable({ providedIn: 'root' })
export class MenuApiService {
  constructor(private readonly http: HttpClient) {}

  getPublicMenu(slug = PUBLIC_MENU_SLUG): Observable<PublicMenu> {
    return this.http.get<PublicMenu>(`${API_BASE_URL}/menu/${slug}`).pipe(map(normalizePublicMenu));
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
}

