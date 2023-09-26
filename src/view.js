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

  elements.feeds.innerHtml = '';
  const cardBody = document.createElement('div');
  
  elements.feeds.append(...feedEls);
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

  elements.posts.innerHtml = '';
  elements.posts.append(...postEls);
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
    console.log(state);
    renderFeeds(state, elements);
    renderPosts(state, elements);
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
