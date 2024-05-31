function hashString(str) {
  let hash = 5381, i = str.length;
  while (i) { hash = (hash * 33) ^ str.charCodeAt(--i); }
  return hash >>> 0;
}

let compiler;

document.querySelectorAll('script[type="application/clojurescript"]').forEach(async (cljs) => {
  const text = cljs.innerHTML;
  const id = hashString(text);

  let js = localStorage.getItem(`lit-squint.main__${id}`);
  if (!js) {
    if (!compiler) compiler = await import('https://esm.run/squint-cljs/lib/compiler');
    js = compiler.compileString(text).replace(
      "from 'squint-cljs/",
      "from 'https://esm.run/squint-cljs/"
    );
    localStorage.clear();
    localStorage.setItem(`lit-squint.main__${id}`, js);
  }

  const script = document.createElement('script');
  script.type = 'module';
  script.innerHTML = js;
  document.body.appendChild(script);
});
