import * as yup from 'yup';
import onChange from 'on-change';
import view from './view.js';
import axios from 'axios';
import _ from 'lodash';
import { FORMPROCESSSTATES } from './FORMPROCESSSTATES.js';
import parsRssStream from './pars.js';

const getIgnoreCORSUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

const sendRequest = (url) => {
  const currentUrl = getIgnoreCORSUrl(url);
  return axios.get(currentUrl)
    .then((response) => {
      const {data: {contents: rssString}} = response;
      return rssString;
    })
    .catch(() => {
      throw new Error('errMessages.networkErr');
    });
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

const payloadRss = (rssObj, url) => {
  const {feed, posts} = rssObj;
  const feedId = _.uniqueId();
  const feedWithPayload = {
    ...feed,
    id: feedId,
    feedUrl: url,
  };

  const postsWithPayload = posts.map((post) => {
    return {
      ...post,
      feedId,
      id: _.uniqueId()
    };
  });

  return {
    feed: feedWithPayload,
    posts: postsWithPayload
  }
};

const UPDATE_INTERVAL = 5000;

const runUpdaterPosts = (state, watchedState) => {
  setTimeout(() => {
    const promises = state.feeds.map((feed) => {
      const {id, feedUrl} = feed;
      const postLinksForFeed = state.posts.filter(({feedId}) => feedId === id).map(({link}) => link);
      return sendRequest(feedUrl)
        .then(parsRssStream)
        .then((rssObj) => {
          const { posts: parsPosts } = rssObj;
          const newPosts = parsPosts.filter(({link}) => !postLinksForFeed.includes(link));
          
          if (!newPosts.length) {
            return;
          }
          const { posts: payloadNewPosts } = payloadRss({feed, posts: newPosts}, feedUrl);
          watchedState.posts.unshift(...payloadNewPosts);
        })
    });

    const promise = Promise.all(promises).finally(() => {
      runUpdaterPosts(state, watchedState)
    }, UPDATE_INTERVAL);

  }, UPDATE_INTERVAL);
}

const app = (i18nextInstance) => {
  const state = {
    form: {
      state: FORMPROCESSSTATES.filling,
      messageObj: null,
    },
    uiState: {
      posts: [],
      modal: {

      }
    },
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.getElementById('url-input'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: document.querySelector('.modal'),
  };

  const watchedState = onChange(state, view(state, elements, i18nextInstance));

  runUpdaterPosts(state, watchedState);
  
  elements.posts.addEventListener('click', (e) => {
    const { id: postId } = e.target.dataset;
    if (state.uiState.posts.find((postUi) => postUi.id === postId)) {
      return;
    }
    
    watchedState.uiState.posts.push({ id: postId, visited: true });
  });

  elements.modal.addEventListener('show.bs.modal', (e) => {
    const { id: targetId } = e.relatedTarget.dataset;

    const post = state.posts.find((post) => post.id === targetId);

    watchedState.uiState.modal = {
      title: post.title,
      description: post.description,
      link: post.link,
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const addedLinks = state.feeds.map((feed) => feed.feedUrl);
    validate(url, addedLinks)
      .then((url) => {
        watchedState.form.state = FORMPROCESSSTATES.sending;
        return sendRequest(url);
      })
      .then((data) => {
        const rssObj = parsRssStream(data);
        const {feed, posts} = payloadRss(rssObj, url);
        
        watchedState.feeds.unshift(feed);
        watchedState.posts.unshift(...posts);

        watchedState.form.messageObj = {
          messageKey: 'successMessage'
        };

        watchedState.form.state = FORMPROCESSSTATES.finished;
        
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
