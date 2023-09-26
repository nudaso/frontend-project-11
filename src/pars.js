import _ from 'lodash';

export const parsRssStream = (rssString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssString, `application/xml`);
  const rssDoc = doc.querySelector('rss');

  if (rssDoc === null) {
    return rssDoc;
  }
  
  const channel = rssDoc.querySelector('channel');
  const channelTitle = channel.querySelector('title').textContent;
  const channelDescription = channel.querySelector('description').textContent;
  const channelId = _.uniqueId();
  const posts = [...channel.querySelectorAll('item')]
    .map((item) => (
      {
        for: channelId,
        guid: item.querySelector('guid').textContent,
        title: item.querySelector('title').textContent,
        descriprion: item.querySelector('description').textContent,
        pubDate: item.querySelector('pubDate').textContent,
        link: item.querySelector('link').textContent
      }
    ));
  
  return {
    feed: {
      title: channelTitle,
      descriprion: channelDescription,
      id: channelId
    },
    posts
  };
};