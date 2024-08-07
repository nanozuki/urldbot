import {
  cleanUrl,
  type Doctor,
  getUrlFromRedirectHTML,
  Reply,
  cleanUrlReply,
} from './doctor';

export const bilibili: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'www.bilibili.com' || url.hostname === 'bilibili.com') {
    return [{ title: 'Clean URL', href: cleanUrl(url).href }];
  }
  if (url.hostname === 'b23.tv') {
    const u = await getUrlFromRedirectHTML(url.href);
    if (u) {
      return [cleanUrlReply(u)];
    }
    return [];
  }
  return [];
};

export const twitter: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'twitter.com' || url.hostname === 'x.com') {
    const parts = url.pathname.substring(1).split('/');
    if (parts.length !== 3 || parts[1] !== 'status') {
      return [cleanUrlReply(url)];
    }
    const fxHost =
      url.hostname === 'twitter.com' ? 'fxtwitter.com' : 'fixupx.com';
    return [
      { title: 'FxTwitter', href: `https://${fxHost}${url.pathname}` },
      { title: 'VxTwitter', href: `https://vx.twitter.com${url.pathname}` },
    ];
  }
  return [];
};

export const xhs: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'xhslink.com') {
    const u = await getUrlFromRedirectHTML(url.href);
    if (u) {
      return [{ title: '小红书', href: u.href }];
    }
    return [];
  }
  return [];
};

export const youtube: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'youtu.be') {
    const query = new URLSearchParams();
    query.set('v', url.pathname.substring(1));
    if (url.searchParams.get('t')) {
      query.set('t', url.searchParams.get('t') as string);
    }
    const target = new URL('https://youtube.com/watch');
    target.search = query.toString();
    return [{ title: 'Youtube', href: target.href }];
  }
  return [];
};
