
import { Injectable } from '@angular/core';

export type ThemeType =
  | 'emerald'
  | 'white'
  | 'saffron'
  | 'blue'
  | 'graphite'
  | 'purple'
  | 'green'
  | 'orange';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  setTheme(theme: ThemeType) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  loadTheme() {
    const saved = localStorage.getItem('theme') as ThemeType;
    if (saved) this.setTheme(saved);
    else this.setTheme('emerald');
  }
}
