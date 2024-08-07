export interface Reply {
  title: string;
  href: string;
}

export type Doctor = (url: URL) => Promise<Reply[]>;

const urlReg = /(https?:\/\/)?[-\w]+(\.[-\w]+)+(\/\S*[^\s\p{P}])?/iu;
const hrefReg = /href="(https:\/\/[^"<>]*)"/i;

/* Example for parse url

const u = new URL("https://example.com/users/23?name=Tom&score=2")

> URL {
  href: "https://example.com/users/23?name=Tom&score=2",
  origin: "https://example.com",
  protocol: "https:",
  username: "",
  password: "",
  host: "example.com",
  hostname: "example.com",
  port: "",
  pathname: "/users/23",
  search: "?name=Tom&score=2",
}

u.searchParams

> URLSearchParams { 'name' => 'Tom', 'score' => '2' }

u.searchParams.get('name')

> "Tom"
*/

function parseURL(url: string): URL | null {
  try {
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    return new URL(url);
  } catch {
    return null;
  }
}

export function getUrlFromMessage(message: string): URL | null {
  const match = message.match(urlReg);
  return match ? parseURL(match[0]) : null;
}

export async function getUrlFromRedirectHTML(url: string): Promise<URL | null> {
  const response = await fetch(url, { redirect: 'manual' });
  if (!response.ok || response.status >= 400) {
    return null;
  }
  const html = await response.text();
  const match = html.match(hrefReg);
  return match ? parseURL(match[1]) : null;
}

// cleanURL remove all query parameters in URL, except for the specified ones
export function cleanUrl(url: URL, except?: string[]): URL {
  const search = new URLSearchParams();
  for (const key of except || []) {
    const value = url.searchParams.get(key);
    if (value) {
      search.set(key, value);
    }
  }
  url.search = search.toString();
  return url;
}

export function cleanUrlReply(url: URL): Reply {
  return { title: 'Clean URL', href: cleanUrl(url).href };
}
