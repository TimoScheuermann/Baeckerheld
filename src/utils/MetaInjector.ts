import { suffix } from '@/router';
import store from '@/store';

export class MetaInjector {
  static setPageTitle(title: string): void {
    store.commit('title', title);

    title += suffix;
    document.title = title;

    const gt = document.querySelector('meta[name="title"]');
    if (gt) gt.setAttribute('content', title);

    const twitter = document.querySelector('meta[property="twitter:title"]');
    if (twitter) twitter.setAttribute('content', title);

    const og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute('content', title);
  }
}
