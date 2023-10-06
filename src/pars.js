const parsRssStream = (rssString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssString, `application/xml`);
  const rssNode = doc.querySelector('rss');
  const errNode = doc.querySelector("parsererror");

  if (errNode) {
    throw new Error('errMessages.notValidRss');
  }
  
  const channel = rssNode.querySelector('channel');
  const channelTitle = channel.querySelector('title').textContent;
  const channelDescription = channel.querySelector('description').textContent;
  
  const posts = [...channel.querySelectorAll('item')]
    .map((item) => (
      {
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent
      }
    ));
    
  return {
    feed: {
      title: channelTitle,
      description: channelDescription,
    },
    posts
  };
};

export default parsRssStream;
