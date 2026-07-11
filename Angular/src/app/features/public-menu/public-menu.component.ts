import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable, catchError, concat, map, of, startWith, switchMap, timer } from 'rxjs';
import { getCategoryPanelClass } from '../../core/category-panel-class.util';
import { CopCurrencyPipe } from '../../core/cop-currency.pipe';
import { MenuApiService } from '../../core/menu-api.service';
import { PublicMenu } from '../../core/menu.models';
import { shouldShowPrice } from '../../core/visible-price.util';
import { CategoryIconSvgComponent } from '../../shared/category-icon-svg.component';

interface MenuViewState {
  loading: boolean;
  menu: PublicMenu | null;
  error: string | null;
}

@Component({
  selector: 'auren-public-menu',
  standalone: true,
  imports: [CommonModule, CopCurrencyPipe, CategoryIconSvgComponent],
  templateUrl: './public-menu.component.html',
  styleUrls: ['./public-menu.component.css']
})
export class PublicMenuComponent implements OnInit {
  private readonly publicMenuRefreshMs = 60_000;
  state$!: Observable<MenuViewState>;
  activeCategoryId = '';
  readonly shouldShowPrice = shouldShowPrice;

  constructor(private readonly menuApiService: MenuApiService) {}

  ngOnInit(): void {
    const initialMenu$ = this.menuApiService.getPublicMenu();
    const refreshMenu$ = timer(this.publicMenuRefreshMs, this.publicMenuRefreshMs).pipe(
      switchMap(() => this.menuApiService.refreshPublicMenu().pipe(catchError(() => EMPTY)))
    );

    this.state$ = concat(initialMenu$, refreshMenu$).pipe(
      map((menu) => {
        if (!this.activeCategoryId) {
          this.activeCategoryId = menu.categories[0]?.id ?? '';
        }

        return { loading: false, menu, error: null };
      }),
      startWith({ loading: true, menu: null, error: null }),
      catchError(() => of({ loading: false, menu: null, error: 'No pudimos cargar la carta en este momento.' }))
    );
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }

  categoryPanelClass(title: string): string {
    return getCategoryPanelClass(title);
  }

  scrollToCategory(categoryId: string): void {
    this.activeCategoryId = categoryId;
    document.getElementById(categoryId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
