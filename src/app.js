import * as yup from 'yup';
import onChange from 'on-change';
import view from './view.js';

yup.setLocale({
  mixed: {
    notOneOf: 'errMessages.exist'
  },
  string: {
    url: 'errMessages.notValidUrl',
  },
});


const validate = (url, urlsArray) => {
  const schema = yup.string().url().notOneOf(urlsArray).required();
  return schema.validate(url);
};

const FORMPROCESSSTATES = {
  filling: 'filling',
  sending: 'sending',
  finished: 'finished',
  failed: 'failed'
};

const app = (i18nextInstance) => {
  const state = {
    form: {
      processState: FORMPROCESSSTATES.filling,
      valid: null
    },
    uiState: {
      form: {
        messageKey: null
      }
    },
    feeds: []
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.getElementById('url-input'),
  };

  const watchedState = onChange(state, view(state, elements, i18nextInstance));

  
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validate(url, state.feeds)
      .then((url) => {
        watchedState.feeds.push(url);
        watchedState.uiState.form.messageKey = 'successMessage';
        watchedState.form.valid = true;
        watchedState.form.processState = FORMPROCESSSTATES.sending;
      })
      .catch((e) => {
        const key = e.errors[0]
        watchedState.uiState.form.messageKey = key;
        watchedState.form.valid = false;
      });

  });
};

export default app;