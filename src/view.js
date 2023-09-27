import { FORMPROCESSSTATES } from "./FORMPROCESSSTATES.js";

const renderFeeds = (state, elements) => {
  const feedEls = state.feeds.map((feed) => {
    const feedEl = document.createElement('li');
    feedEl.classList.add(...'list-group-item border-0 border-end-0'.split(' '));

    const header = document.createElement('h3');
    header.classList.add(...'h6 m-0'.split(' '));
    header.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add(...'m-0 small text-black-50'.split(' '));
    p.textContent = feed.description;
    
    feedEl.append(header, p);
    return feedEl;
  });

  elements.feeds.innerHTML = '';
  
  const feedsContainer = document.createElement('div');
  feedsContainer.setAttribute('class', 'card border-0');
  feedsContainer.innerHTML = `<div class="card-body"><h2 class="card-title h4">Фиды</h2></div><ul class="list-group border-0 rounded-0"></ul>`
  console.log(feedsContainer);
  feedsContainer.querySelector('ul').append(...feedEls);
  elements.feeds.append(feedsContainer);
};

const renderPosts = (state, elements) => {
  const postEls = state.posts.map((post) => {
    const postEl = document.createElement('li');
    postEl.classList.add(...'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0'.split(' '));

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', post.link)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;

    const btn = document.createElement('btn');
    btn.classList.add(...'btn btn-outline-primary btn-sm'.split(' '));
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.textContent = 'Просмотр';

    postEl.append(a, btn);
    return postEl;
  });

  elements.posts.innerHTML = '';
  const postsContainer = document.createElement('div');
  postsContainer.setAttribute('class', 'card border-0');
  postsContainer.innerHTML = `<div class="card-body"><h2 class="card-title h4">Посты</h2></div><ul class="list-group border-0 rounded-0"></ul>`;
  postsContainer.querySelector('ul').append(...postEls);
  elements.posts.append(postsContainer);
}

const handlerFormState = (state, elements, i18nextInstance, value, preValue) => {
  if (value === FORMPROCESSSTATES.sending || preValue === FORMPROCESSSTATES.sending) {
    elements.form.querySelector('[type="submit"]').classList.toggle('disabled');
  }

  if (value === FORMPROCESSSTATES.failed) {
    elements.input.classList.add('is-invalid');

    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
  }

  if (value === FORMPROCESSSTATES.finished) {
    elements.input.classList.remove('is-invalid');

    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    renderFeeds(state, elements);
    renderPosts(state, elements);
    elements.input.value = '';
    elements.input.focus();
  }
}

export default (state, elements, i18nextInstance) => (path, value, preValue) => {
  switch (path) {
    case 'form.state': {
      handlerFormState(state, elements, i18nextInstance, value, preValue);
      break;
    };
    case 'form.messageObj': {
      if (value !== null) {
        elements.feedback.textContent = i18nextInstance.t(value.messageKey);
      }
      break;
    }
  }
};
