import * as yup from 'yup';
import onChange from 'on-change';
import view from './view.js';

const schema = yup.string().url().required();

const validate = (url) => schema.validate(url);

export default () => {
  const state = {
    isValid: null,
    feeds: [],
    errMessage: '',
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.getElementById('url-input'),
  };

  const watchedState = onChange(state, view(state, elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validate(url)
      .then(() => {
        if (!state.feeds.includes(url)) {
          watchedState.feeds.push(url);
          watchedState.errMessage = '';
          watchedState.isValid = true;
          
        } else {
          watchedState.errMessage = 'RSS уже существует';
          watchedState.isValid = false;
        }
      })
      .catch((e) => {
        watchedState.errMessage = 'Ссылка должна быть валидным URL';
        watchedState.isValid = false;
      });
    
  });
};


// <p class="feedback m-0 position-absolute small text-danger">Ссылка должна быть валидным URL</p>
// <p class="feedback m-0 position-absolute small text-success">RSS успешно загружен</p>
// <p class="feedback m-0 position-absolute small text-success text-danger">RSS уже существует</p>