import {
  cleanUrl,
  type Doctor,
  getUrlFromRedirectHTML,
  Reply,
  cleanUrlReply,
} from './doctor';

const bilibili: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'www.bilibili.com' || url.hostname === 'bilibili.com') {
    return [{ title: 'Clean URL', href: cleanUrl(url).href }];
  }
  if (url.hostname === 'b23.tv') {
    const u = await getUrlFromRedirectHTML(url.href);
    console.log('get u: ', u);
    if (u) {
      return [
        {
          title: 'Bilibili',
          href: cleanUrl(u).href,
        },
      ];
    }
    return [];
  }
  return [];
};

const twitter: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'twitter.com' || url.hostname === 'x.com') {
    const parts = url.pathname.substring(1).split('/');
    if (parts.length !== 3 || parts[1] !== 'status') {
      return [cleanUrlReply(url)];
    }
    const fxHost =
      url.hostname === 'twitter.com' ? 'fxtwitter.com' : 'fixupx.com';
    return [
      { title: 'FxTwitter', href: `https://${fxHost}${url.pathname}` },
      { title: 'VxTwitter', href: `https://vxtwitter.com${url.pathname}` },
    ];
  }
  return [];
};

const xhs: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'xhslink.com') {
    const u = await getUrlFromRedirectHTML(url.href);
    if (u) {
      if (u.pathname.startsWith('/discovery/item/')) {
        u.pathname = u.pathname.replace('/discovery/item/', '/explore/');
      }
      return [{ title: '小红书', href: cleanUrl(u).href }];
    }
    return [];
  }
  return [];
};

const youtube: Doctor = async (url: URL): Promise<Reply[]> => {
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

export const cleaner: Doctor = async (url: URL): Promise<Reply[]> => {
  return [cleanUrlReply(url)];
};

export const doctors = [bilibili, twitter, xhs, youtube];
