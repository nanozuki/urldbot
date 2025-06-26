import {
  cleanUrl,
  type Doctor,
  getUrlFromRedirect,
  Reply,
  cleanUrlReply,
} from './doctor';

const bilibili: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname === 'www.bilibili.com' || url.hostname === 'bilibili.com') {
    return [cleanUrlReply(url)];
  }
  if (url.hostname === 'b23.tv' || url.hostname === 'bili2233.cn') {
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
  if (
    url.hostname === 'www.xiaohongshu.com' ||
    url.hostname === 'xiaohongshu.com'
  ) {
    return [{ title: '小红书', href: cleanUrl(url, ['xsec_token']).href }];
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
    return [{ title: 'FxZhihu', href: cleanUrl(url).href }];
  }
  return [];
};

const instagram: Doctor = async (url: URL): Promise<Reply[]> => {
  if (url.hostname.includes('.instagram.com')) {
    const parts = url.pathname.substring(1).split('/');
    if (parts.length === 0 || (parts.length === 1 && parts[0] !== 'oembed')) {
      // ref: https://github.com/Wikidepia/InstaFix/blob/main/main.go
      return [cleanUrlReply(url)];
    }
    url.hostname = url.hostname.replace('.instagram.com', '.ddinstagram.com');
    return [{ title: 'DDInstagram', href: cleanUrl(url).href }];
  }
  return [];
};

export const cleaner: Doctor = async (url: URL): Promise<Reply[]> => {
  return [cleanUrlReply(url)];
};

export const doctors = [bilibili, twitter, xhs, youtube, zhihu, instagram];
