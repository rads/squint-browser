function hashString(str) {
  let hash = 5381, i = str.length;
  while (i) { hash = (hash * 33) ^ str.charCodeAt(--i); }
  return hash >>> 0;
}

function cacheKey(id) {
  return `squint-browser__${id}`;
}

export default async function squintBrowser(options = {}) {
  const cache = options.cache;
  const importMap = options.importMap ?? {
    imports: {
      "squint-cljs/": "https://cdn.jsdelivr.net/npm/squint-cljs@v0.7.110/"
    }
  };
  const scripts = options.scripts ?? (async () => {
    return document.querySelectorAll('script[type="application/squint-cljs"]');
  });

  let compiler;

  (await scripts()).forEach(async (cljs) => {
    const text = cljs.innerHTML;
    const id = cache ? hashString(text) : null;
    let js = cache?.getItem(cacheKey(id));
    if (!js) {
      if (!compiler) compiler = await import(`${importMap?.imports['squint-cljs/'] ?? 'squint-cljs/'}lib/compiler.js`);
      if (importMap) {
        js = compiler.compileString(text).replace(
          "from 'squint-cljs/",
          `from '${importMap.imports['squint-cljs/']}`
        );
      }
      cache?.setItem(cacheKey(id), js);
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = js;
    document.body.appendChild(script);
  });
}
