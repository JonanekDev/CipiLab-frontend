import { createI18n, type Locale } from "vue-i18n";

export type Lang = 'en' | 'cs';

const defaultLang: Lang = 'en';

export const availableLocales: Record<Lang, string> = {
  en: 'English',
  cs: 'Čeština',
};

const currentLanguage = localStorage.getItem('lang') as Lang || navigator.language.split('-')[0] as Lang || defaultLang;

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: currentLanguage,
    fallbackLocale: defaultLang,
    messages: {},
})


async function loadMessages(lang: Lang) {
    if (i18n.global.availableLocales.includes(lang)) return;
    const module = await import(`./locales/${lang}.json`);
    const messages = module.default;
    i18n.global.setLocaleMessage(lang, messages);
}

async function setLang(lang: Lang) {
    loadMessages(lang);
    localStorage.setItem('lang', lang);
    i18n.global.locale.value = lang;
}

loadMessages(currentLanguage);

export { i18n, setLang };