import * as yup from 'yup';
import onChange from 'on-change';
import view from './view.js';

yup.setLocale({
  string: {
    url: 'errMessages.notValidUrl',
  },
});

const schema = yup.string().url().required()
  .test({
    name: 'isUniq',
    message: 'errMessages.exist',
    test: (value, testContext) => {
      return Promise.resolve(!testContext.options.includes(value))
    }
  });

const validate = (url, urlsArray) => schema.validate(url, urlsArray);

const FORMSTATES = {
  filling: 'filling',
  sending: 'sending',
  finished: 'finished',
  failed: 'failed'
}

const app = (i18nextInstance) => {
  console.log('da')
  const state = {
    form: {
      state: FORMSTATES.filling,
    },
    feeds: ['https://ru.hexlet.io/lessons.rss']
  };

  validate('https://ru.hexlet.io/lessons.rss', state.feeds)
    .then(console.log)
    .catch((e) => {
      console.dir(e);
      console.log(e.errors.map(key => i18nextInstance.t(key)));
    })

};

export default app;