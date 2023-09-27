import * as yup from 'yup';
import onChange from 'on-change';
import view from './view.js';
import axios from 'axios';
import { FORMPROCESSSTATES } from './FORMPROCESSSTATES.js';
import { parsRssStream } from './pars.js';

const getIgnoreCORSUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

const getRssStringFromResponse = (response) => {
  const {data: {contents: rssString}} = response;
  return rssString;
};

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

const errorsHandler = (watchedState, error) => {
  
}

const app = (i18nextInstance) => {
  const state = {
    form: {
      state: FORMPROCESSSTATES.filling,
      messageObj: null,
    },
    uiState: {
      form: {

      },
    },
    feeds: [],
    posts: [],
    feedLinks: []
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.getElementById('url-input'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const watchedState = onChange(state, view(state, elements, i18nextInstance));
  
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validate(url, state.feedLinks)
      .then((url) => {
        watchedState.form.state = FORMPROCESSSTATES.sending;

        const response = axios.get(getIgnoreCORSUrl(url))
          .catch((e) => {
            throw new Error('errMessages.networkErr');
          });
        return response;
      })
      .then((res) => {
        const rssString = getRssStringFromResponse(res);
        const rssObj = parsRssStream(rssString);

        if (rssObj) {
          watchedState.feedLinks.unshift(url);
          watchedState.feeds.unshift({
            ...rssObj.feed,
            url
          });
          watchedState.posts.unshift(...rssObj.posts);
          watchedState.form.messageObj = {
            messageKey: 'successMessage'
          };
          watchedState.form.state = FORMPROCESSSTATES.finished;
          return;
        }



        throw new Error('errMessages.notValidRss');
      })
      .catch((e) => {
        watchedState.form.messageObj = {
          messageKey: e.message
        };
        watchedState.form.state = FORMPROCESSSTATES.failed;
        console.log('catch: ')
        console.dir(e)
      });

  });
};

export default app;