import type { SiteConfig, SiteOptions } from '../../site/SiteOptions.js';

export const createSiteOptions = ({
  baseUrl = '/',
  lang = 'en-US',
  title = '',
  description = '',
  head = [],
  locales = {},
  theme = ['@vitebook/vue-default', {}]
}: SiteConfig): SiteOptions => ({
  baseUrl,
  lang,
  title,
  description,
  head,
  locales,
  theme
});
