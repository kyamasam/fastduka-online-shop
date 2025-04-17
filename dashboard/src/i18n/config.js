import app from '../config/configApp';
import { createI18n } from 'vue-i18n';
import ar from './localization/ar/translation.json';
import en from './localization/en/translation.json';
import esp from './localization/en/translation.json';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: en,
        ar: ar,
        esp: esp,
    },
})

app.use(i18n);
