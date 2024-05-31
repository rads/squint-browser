# squint-browser

Run ClojureScript in `<script>` tags without a build step using the [squint](https://github.com/squint-cljs/squint) compiler.

[Click here for an example.](https://rads.github.io/squint-browser/)

## Usage

Add the following code at the end of the `<body>` tag:

```html
<script type="module">
  import squintBrowser from 'https://cdn.jsdelivr.net/gh/rads/squint-browser@v0.0.2/squint-browser.min.js';
  squintBrowser();
</script>
```

Now you can write inline ClojureScript using script tags. Make sure to put them _before_ the other script we added:

```html
<script type="application/squint-cljs">
  (println "Hello world!")
</script>
```

### Options

You can pass in options to the `squintBrowser` function:

```html
<script type="module">
  import squintBrowser from 'https://cdn.jsdelivr.net/gh/rads/squint-browser@v0.0.2/squint-browser.min.js';
  squintBrowser({
    // Cache compiled scripts using getItem and setItem. If all scripts are
    // cached, the compiler won't get loaded at all and no compilation will
    // occur. Note that if you use persistent storage, you need to clean up old
    // cache entries yourself or the cache will grow indefinitely.
    cache: localStorage,

    // Override the function to find source scripts.
    scripts: async () => {
      return document.querySelectorAll('script[type="application/clojurescript"]');
    }

    // Override the default import map used when loading scripts.
    // This can be used to override the squint-cljs compiler version.
    importMap: {
      imports: {
        "squint-cljs/": "https://esm.run/squint-cljs/"
      }
    }
  });
</script>
```
