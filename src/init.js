import resources from './locales/index.js';
import i18next from 'i18next';
import app from './app.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  const i18Data = {
    lng: 'ru',
    resources
  };
  i18nextInstance.init(i18Data)
    .then(() => app(i18nextInstance));
}