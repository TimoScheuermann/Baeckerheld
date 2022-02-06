import Vue from 'vue';

export class SettingsUtils {
  public static dark = false;

  public static setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem('bh.settings.theme', theme);
    this.loadTheme();
  }

  public static toggleTheme(): void {
    this.setTheme(this.dark ? 'light' : 'dark');
  }

  public static setPrimary(color: string): void {
    localStorage.setItem('bh.settings.color', color);
    this.loadPrimary();
  }

  public static loadTheme(): void {
    let theme = localStorage.getItem('bh.settings.theme') || 'light';
    if (!['dark', 'light'].includes(theme)) theme = 'light';
    this.dark = theme === 'dark';
    Vue.prototype.$vm.setTheme(theme);
  }

  public static loadPrimary(): void {
    const color = localStorage.getItem('bh.settings.color');
    if (color) Vue.prototype.$vm.setColor('primary', color);
  }
}
