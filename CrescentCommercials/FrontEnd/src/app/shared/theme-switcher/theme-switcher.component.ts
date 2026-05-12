
import { Component } from '@angular/core';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html'
})
export class ThemeSwitcherComponent {
  constructor(private themeService: ThemeService) {}

  changeTheme(e: any) {
    this.themeService.setTheme(e.target.value);
  }
}
