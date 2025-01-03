import {
  cleanUrl,
  type Doctor,
  getUrlFromRedirect,
  Reply,
  cleanUrlReply,
} from './doctor';

const bilibili: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'www.bilibili.com' || url.hostname === 'bilibili.com') {
    return [{ title: 'Clean URL', href: cleanUrl(url).href }];
  }
  if (url.hostname === 'b23.tv' || url.hostname === 'bili2233.com') {
    const u = await getUrlFromRedirect(url.href);
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
    return [
      { title: 'FixupX', href: `https://fixupx.com${url.pathname}` },
      { title: 'FxTwitter', href: `https://fxtwitter.com${url.pathname}` },
      { title: 'VxTwitter', href: `https://vxtwitter.com${url.pathname}` },
    ];
  }
  return [];
};

const xhs: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'xhslink.com') {
    const u = await getUrlFromRedirect(url.href);
    if (u) {
      const href = cleanUrl(u, ['xsec_token']).href;
      return [{ title: '小红书', href: href }];
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

const zhihu: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname.includes('.zhihu.com')) {
    url.hostname = url.hostname.replace('.zhihu.com', '.fxzhihu.com');
    return [{ title: 'FxZhihu', href: url.href }];
  }
  return [];
};

export const cleaner: Doctor = async (url: URL): Promise<Reply[]> => {
  return [cleanUrlReply(url)];
};

export const doctors = [bilibili, twitter, xhs, youtube, zhihu];
