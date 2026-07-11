import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { normalizeCategoryIcon } from '../core/category-icons';

@Component({
  selector: 'auren-category-icon-svg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [ngSwitch]="normalizedIcon" viewBox="0 0 100 100" focusable="false" aria-hidden="true">
      <g *ngSwitchCase="'cloche'">
        <path class="icon-stroke icon-accent" d="M51 21v13" />
        <path class="icon-stroke icon-accent" d="M44 27h14" />
        <path class="icon-stroke" d="M22 67h56" />
        <path class="icon-stroke" d="M28 75h44" />
        <path class="icon-stroke" d="M22 64c2-18 14-30 28-30s26 12 28 30" />
        <path class="icon-stroke" d="M42 34c2-5 5-7 8-7s6 2 8 7" />
      </g>

      <g *ngSwitchCase="'fries'">
        <path class="icon-stroke" d="M34 37l4 39h24l4-39" />
        <path class="icon-stroke" d="M36 37h28" />
        <path class="icon-stroke icon-accent" d="M39 24v27" />
        <path class="icon-stroke icon-accent" d="M49 19v32" />
        <path class="icon-stroke icon-accent" d="M59 24v27" />
        <path class="icon-stroke" d="M41 76h18" />
      </g>

      <g *ngSwitchCase="'burger'">
        <path class="icon-stroke" d="M28 49c3-13 14-20 22-20s19 7 22 20" />
        <path class="icon-stroke" d="M25 55h50" />
        <path class="icon-stroke" d="M30 64h40" />
        <path class="icon-stroke" d="M27 72h46" />
        <path class="icon-fill" d="M42 42h4v4h-4zM54 38h4v4h-4z" />
      </g>

      <g *ngSwitchCase="'plus'">
        <path class="icon-stroke" d="M50 26v48" />
        <path class="icon-stroke" d="M26 50h48" />
        <path class="icon-stroke icon-accent" d="M32 32l36 36" />
        <path class="icon-stroke icon-accent" d="M68 32L32 68" />
      </g>

      <g *ngSwitchCase="'chicken'">
        <path class="icon-stroke" d="M39 58c-10-10-8-23 1-31 9-8 23-6 31 3 7 8 6 20-2 27-9 8-22 10-30 1Z" />
        <path class="icon-stroke" d="M35 62L21 76" />
        <path class="icon-stroke icon-accent" d="M21 76c-5 0-8-3-7-7 5-1 8 2 7 7Z" />
        <path class="icon-stroke icon-accent" d="M26 81c-1 5-5 8-9 6-1-5 3-8 9-6Z" />
      </g>

      <g *ngSwitchCase="'meat'">
        <path class="icon-stroke" d="M23 55c0-18 17-31 37-27 15 3 24 14 20 27-5 16-25 25-41 19-10-4-16-10-16-19Z" />
        <path class="icon-stroke icon-accent" d="M46 52c0-6 5-11 12-11s12 5 12 11-5 11-12 11-12-5-12-11Z" />
        <path class="icon-stroke icon-accent" d="M32 57c5 7 13 11 23 11" />
      </g>

      <g *ngSwitchCase="'grill'">
        <path class="icon-stroke" d="M24 43h52" />
        <path class="icon-stroke" d="M29 43l7 35" />
        <path class="icon-stroke" d="M71 43l-7 35" />
        <path class="icon-stroke icon-accent" d="M34 54h32" />
        <path class="icon-stroke icon-accent" d="M41 24c-8 7-8 13 0 19" />
        <path class="icon-stroke icon-accent" d="M54 20c-8 8-8 15 0 23" />
        <path class="icon-stroke icon-accent" d="M67 25c-6 6-6 12 0 18" />
      </g>

      <g *ngSwitchCase="'ribs'">
        <path class="icon-stroke" d="M28 35c11-7 33-7 44 0" />
        <path class="icon-stroke" d="M25 55c13-10 37-10 50 0" />
        <path class="icon-stroke" d="M30 73c10-7 30-7 40 0" />
        <path class="icon-stroke icon-accent" d="M38 32v43" />
        <path class="icon-stroke icon-accent" d="M50 29v48" />
        <path class="icon-stroke icon-accent" d="M62 32v43" />
      </g>

      <g *ngSwitchCase="'fish'">
        <path class="icon-stroke" d="M21 50c14-15 33-17 50 0-17 17-36 15-50 0Z" />
        <path class="icon-stroke" d="M71 50l15-12v24L71 50Z" />
        <path class="icon-stroke icon-accent" d="M43 37c-5 8-5 18 0 26" />
        <circle class="icon-fill" cx="32" cy="49" r="3" />
      </g>

      <g *ngSwitchCase="'shrimp'">
        <path class="icon-stroke" d="M66 35c-10-10-28-8-37 4-9 13 1 30 18 30 13 0 23-8 23-19" />
        <path class="icon-stroke icon-accent" d="M45 37c-2 13 5 24 18 29" />
        <path class="icon-stroke icon-accent" d="M58 32l14-10" />
        <path class="icon-stroke icon-accent" d="M63 38l18-2" />
        <circle class="icon-fill" cx="32" cy="45" r="3" />
      </g>

      <g *ngSwitchCase="'salad'">
        <path class="icon-stroke" d="M26 55h48c-2 14-12 22-24 22S28 69 26 55Z" />
        <path class="icon-stroke" d="M22 55h56" />
        <path class="icon-stroke icon-accent" d="M34 45c2-12 12-18 22-16-1 11-9 18-22 16Z" />
        <path class="icon-stroke icon-accent" d="M54 48c1-10 9-16 19-15-1 10-8 16-19 15Z" />
        <path class="icon-stroke icon-accent" d="M42 49c-6-7-5-16 1-23 7 6 8 15-1 23Z" />
      </g>

      <g *ngSwitchCase="'drink'">
        <path class="icon-stroke" d="M34 35h32l-4 43H38L34 35Z" />
        <path class="icon-stroke" d="M31 35h38" />
        <path class="icon-stroke icon-accent" d="M48 35L66 18" />
        <path class="icon-stroke icon-accent" d="M39 50h22" />
        <path class="icon-stroke" d="M42 78h16" />
      </g>

      <g *ngSwitchCase="'cocktail'">
        <path class="icon-stroke" d="M25 28h50L50 55 25 28Z" />
        <path class="icon-stroke" d="M50 55v24" />
        <path class="icon-stroke" d="M36 79h28" />
        <path class="icon-stroke icon-accent" d="M57 28l13-13" />
        <circle class="icon-fill" cx="72" cy="13" r="4" />
      </g>

      <g *ngSwitchCase="'wine'">
        <path class="icon-stroke" d="M38 23h24v18c0 9-5 16-12 16s-12-7-12-16V23Z" />
        <path class="icon-stroke icon-accent" d="M39 39h22" />
        <path class="icon-stroke" d="M50 57v20" />
        <path class="icon-stroke" d="M37 77h26" />
      </g>

      <g *ngSwitchCase="'coffee'">
        <path class="icon-stroke" d="M29 45h35v18c0 8-6 14-17 14S29 71 29 63V45Z" />
        <path class="icon-stroke" d="M64 49h7c5 0 8 3 8 8s-3 8-8 8h-7" />
        <path class="icon-stroke" d="M27 77h42" />
        <path class="icon-stroke icon-accent" d="M37 23c-5 6-5 11 0 17" />
        <path class="icon-stroke icon-accent" d="M50 20c-5 7-5 12 0 19" />
        <path class="icon-stroke icon-accent" d="M62 23c-5 6-5 11 0 17" />
      </g>

      <g *ngSwitchCase="'dessert'">
        <path class="icon-stroke" d="M27 51h46v25H27V51Z" />
        <path class="icon-stroke" d="M25 51c3-12 12-19 25-19s22 7 25 19" />
        <path class="icon-stroke icon-accent" d="M50 19v13" />
        <path class="icon-stroke icon-accent" d="M44 23c2-7 6-10 6-10s4 3 6 10" />
        <path class="icon-stroke icon-accent" d="M34 62h32" />
      </g>

      <g *ngSwitchCase="'icecream'">
        <path class="icon-stroke" d="M36 43c0-10 6-18 14-18s14 8 14 18" />
        <path class="icon-stroke" d="M32 45h36L50 80 32 45Z" />
        <path class="icon-stroke icon-accent" d="M42 58h16" />
        <path class="icon-stroke icon-accent" d="M47 68h6" />
      </g>

      <g *ngSwitchCase="'utensils'">
        <path class="icon-stroke" d="M33 22v55" />
        <path class="icon-stroke icon-accent" d="M25 22v19c0 5 3 9 8 9s8-4 8-9V22" />
        <path class="icon-stroke icon-accent" d="M29 22v21" />
        <path class="icon-stroke icon-accent" d="M37 22v21" />
        <path class="icon-stroke" d="M63 22c8 10 9 22 0 34v21" />
        <path class="icon-stroke icon-accent" d="M63 22v34" />
      </g>

      <g *ngSwitchCase="'pizza'">
        <path class="icon-stroke" d="M26 24c18 8 34 8 52 0L52 78 26 24Z" />
        <path class="icon-stroke icon-accent" d="M31 34c13 5 27 5 42 0" />
        <circle class="icon-fill" cx="48" cy="47" r="3" />
        <circle class="icon-fill" cx="56" cy="61" r="3" />
        <circle class="icon-fill" cx="42" cy="63" r="3" />
      </g>

      <g *ngSwitchCase="'pasta'">
        <path class="icon-stroke" d="M28 61h44c-2 11-11 18-22 18s-20-7-22-18Z" />
        <path class="icon-stroke" d="M24 61h52" />
        <path class="icon-stroke icon-accent" d="M35 47c4-5 9-5 13 0s9 5 13 0 8-5 12 0" />
        <path class="icon-stroke icon-accent" d="M31 37c5-5 10-5 15 0s10 5 15 0" />
        <path class="icon-stroke icon-accent" d="M50 23v30" />
      </g>

      <g *ngSwitchCase="'taco'">
        <path class="icon-stroke" d="M24 60c3-19 14-31 26-31s23 12 26 31H24Z" />
        <path class="icon-stroke" d="M28 60c8 10 36 10 44 0" />
        <circle class="icon-fill" cx="41" cy="47" r="3" />
        <circle class="icon-fill" cx="52" cy="40" r="3" />
        <circle class="icon-fill" cx="61" cy="50" r="3" />
      </g>

      <g *ngSwitchCase="'hotdog'">
        <path class="icon-stroke" d="M23 57c8-15 46-15 54 0" />
        <path class="icon-stroke" d="M24 66c12 9 40 9 52 0" />
        <path class="icon-stroke icon-accent" d="M31 56c8 8 30 8 38 0" />
        <path class="icon-stroke icon-accent" d="M34 49c9-11 23-11 32 0" />
      </g>

      <g *ngSwitchCase="'sandwich'">
        <path class="icon-stroke" d="M25 38h50v34H25V38Z" />
        <path class="icon-stroke" d="M25 38l25-16 25 16" />
        <path class="icon-stroke icon-accent" d="M28 53h44" />
        <path class="icon-stroke icon-accent" d="M35 63h30" />
        <circle class="icon-fill" cx="43" cy="36" r="2.5" />
        <circle class="icon-fill" cx="55" cy="34" r="2.5" />
      </g>

      <g *ngSwitchCase="'soup'">
        <path class="icon-stroke" d="M25 54h50c-2 13-12 22-25 22s-23-9-25-22Z" />
        <path class="icon-stroke" d="M22 54h56" />
        <path class="icon-stroke icon-accent" d="M36 24c-5 6-5 11 0 17" />
        <path class="icon-stroke icon-accent" d="M50 21c-5 7-5 13 0 20" />
        <path class="icon-stroke icon-accent" d="M64 24c-5 6-5 11 0 17" />
      </g>

      <g *ngSwitchCase="'rice'">
        <path class="icon-stroke" d="M25 56h50c-2 13-12 22-25 22s-23-9-25-22Z" />
        <path class="icon-stroke" d="M22 56h56" />
        <path class="icon-stroke icon-accent" d="M36 47l-7-13" />
        <path class="icon-stroke icon-accent" d="M47 47l-3-17" />
        <path class="icon-stroke icon-accent" d="M58 47l5-17" />
        <path class="icon-stroke icon-accent" d="M68 47l10-12" />
      </g>

      <g *ngSwitchCase="'pepper'">
        <path class="icon-stroke" d="M38 29c19 0 33 13 29 29-3 13-17 20-31 15 10-4 13-13 10-22-3-8-10-13-8-22Z" />
        <path class="icon-stroke icon-accent" d="M39 29c2-7 7-11 14-11" />
        <path class="icon-stroke icon-accent" d="M55 20c5 1 9 4 12 8" />
      </g>

      <g *ngSwitchCase="'breakfast'">
        <circle class="icon-stroke" cx="40" cy="50" r="18" />
        <circle class="icon-fill" cx="40" cy="50" r="6" />
        <path class="icon-stroke" d="M58 36h17v31H58V36Z" />
        <path class="icon-stroke icon-accent" d="M58 48h17" />
        <path class="icon-stroke icon-accent" d="M63 30h7" />
      </g>

      <g *ngSwitchDefault>
        <path class="icon-stroke" d="M50 22l28 28-28 28-28-28 28-28Z" />
      </g>
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 72%;
        height: 72%;
        color: inherit;
      }

      svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .icon-stroke {
        fill: none;
        stroke: currentColor;
        stroke-width: 4.2;
        stroke-linecap: square;
        stroke-linejoin: miter;
        vector-effect: non-scaling-stroke;
      }

      .icon-accent {
        stroke-width: 3.2;
      }

      .icon-fill {
        fill: currentColor;
      }
    `
  ]
})
export class CategoryIconSvgComponent {
  normalizedIcon = 'diamond';

  @Input()
  set icon(value: string | null | undefined) {
    this.normalizedIcon = normalizeCategoryIcon(value);
  }
}
