var Hn = Object.defineProperty;
var Rs = (s) => {
  throw TypeError(s);
};
var Vn = (s, e, t) => e in s ? Hn(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var v = (s, e, t) => Vn(s, typeof e != "symbol" ? e + "" : e, t), ns = (s, e, t) => e.has(s) || Rs("Cannot " + t);
var u = (s, e, t) => (ns(s, e, "read from private field"), t ? t.call(s) : e.get(s)), k = (s, e, t) => e.has(s) ? Rs("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), w = (s, e, t, n) => (ns(s, e, "write to private field"), n ? n.call(s, t) : e.set(s, t), t), U = (s, e, t) => (ns(s, e, "access private method"), t);
var Ns = (s, e, t, n) => ({
  set _(a) {
    w(s, e, a, t);
  },
  get _() {
    return u(s, e, n);
  }
});
var Cs = (s, e, t) => (n, a) => {
  let r = -1;
  return i(0);
  async function i(o) {
    if (o <= r)
      throw new Error("next() called multiple times");
    r = o;
    let c, d = !1, l;
    if (s[o] ? (l = s[o][0][0], n.req.routeIndex = o) : l = o === s.length && a || void 0, l)
      try {
        c = await l(n, () => i(o + 1));
      } catch (h) {
        if (h instanceof Error && e)
          n.error = h, c = await e(h, n), d = !0;
        else
          throw h;
      }
    else
      n.finalized === !1 && t && (c = await t(n));
    return c && (n.finalized === !1 || d) && (n.res = c), n;
  }
}, Wn = /* @__PURE__ */ Symbol(), Zn = (s, e) => new Response(s, {
  headers: {
    // Normalize the media type (case-insensitive) while keeping parameters like the boundary
    "Content-Type": e.replace(/^[^;]+/, (n) => n.toLowerCase())
  }
}).formData(), qt = (s) => "headers" in s, zn = async (s, e = /* @__PURE__ */ Object.create(null)) => {
  const { all: t = !1, dot: n = !1 } = e, r = (qt(s) ? s.headers : s.raw.headers).get("Content-Type"), i = r == null ? void 0 : r.split(";")[0].trim().toLowerCase();
  return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? Jn(s, { all: t, dot: n }) : {};
};
async function Jn(s, e) {
  if (!qt(s) && s.bodyCache.formData)
    return Os(
      await s.bodyCache.formData,
      e
    );
  const t = qt(s) ? s.headers : s.raw.headers, n = await s.arrayBuffer(), a = Zn(n, t.get("Content-Type") || "");
  qt(s) || (s.bodyCache.formData = a);
  const r = await a;
  return r ? Os(r, e) : {};
}
function Os(s, e) {
  const t = /* @__PURE__ */ Object.create(null);
  return s.forEach((n, a) => {
    e.all || a.endsWith("[]") ? Kn(t, a, n) : t[a] = n;
  }), e.dot && Object.entries(t).forEach(([n, a]) => {
    n.includes(".") && (Gn(t, n, a), delete t[n]);
  }), t;
}
var Kn = (s, e, t) => {
  s[e] !== void 0 ? Array.isArray(s[e]) ? s[e].push(t) : s[e] = [s[e], t] : e.endsWith("[]") ? s[e] = [t] : s[e] = t;
}, Gn = (s, e, t) => {
  if (/(?:^|\.)__proto__\./.test(e))
    return;
  let n = s;
  const a = e.split(".");
  a.forEach((r, i) => {
    i === a.length - 1 ? n[r] = t : ((!n[r] || typeof n[r] != "object" || Array.isArray(n[r]) || n[r] instanceof File) && (n[r] = /* @__PURE__ */ Object.create(null)), n = n[r]);
  });
}, hn = (s) => {
  const e = s.split("/");
  return e[0] === "" && e.shift(), e;
}, Yn = (s) => {
  const { groups: e, path: t } = Xn(s), n = hn(t);
  return Qn(n, e);
}, Xn = (s) => {
  const e = [];
  return s = s.replace(/\{[^}]+\}/g, (t, n) => {
    const a = `@${n}`;
    return e.push([a, t]), a;
  }), { groups: e, path: s };
}, Qn = (s, e) => {
  for (let t = e.length - 1; t >= 0; t--) {
    const [n] = e[t];
    for (let a = s.length - 1; a >= 0; a--)
      if (s[a].includes(n)) {
        s[a] = s[a].replace(n, e[t][1]);
        break;
      }
  }
  return s;
}, Lt = {}, ea = (s, e) => {
  if (s === "*")
    return "*";
  const t = s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (t) {
    const n = `${s}#${e}`;
    return Lt[n] || (t[2] ? Lt[n] = e && e[0] !== ":" && e[0] !== "*" ? [n, t[1], new RegExp(`^${t[2]}(?=/${e})`)] : [s, t[1], new RegExp(`^${t[2]}$`)] : Lt[n] = [s, t[1], !0]), Lt[n];
  }
  return null;
}, Is = (s, e) => {
  try {
    return e(s);
  } catch {
    return s.replace(/(?:%[0-9A-Fa-f]{2})+/g, (t) => {
      try {
        return e(t);
      } catch {
        return t;
      }
    });
  }
}, ta = (s) => Is(s, decodeURI), fn = (s) => {
  const e = s.url, t = e.indexOf("/", e.indexOf(":") + 4);
  let n = t;
  for (; n < e.length; n++) {
    const a = e.charCodeAt(n);
    if (a === 37) {
      const r = e.indexOf("?", n), i = e.indexOf("#", n), o = r === -1 ? i === -1 ? void 0 : i : i === -1 ? r : Math.min(r, i), c = e.slice(t, o);
      return ta(c.includes("%25") ? c.replace(/%25/g, "%2525") : c);
    } else if (a === 63 || a === 35)
      break;
  }
  return e.slice(t, n);
}, sa = (s) => {
  const e = fn(s);
  return e.length > 1 && e.at(-1) === "/" ? e.slice(0, -1) : e;
}, Ne = (s, e, ...t) => (t.length && (e = Ne(e, ...t)), `${(s == null ? void 0 : s[0]) === "/" ? "" : "/"}${s}${e === "/" ? "" : `${(s == null ? void 0 : s.at(-1)) === "/" ? "" : "/"}${(e == null ? void 0 : e[0]) === "/" ? e.slice(1) : e}`}`), mn = (s) => {
  if (s.charCodeAt(s.length - 1) !== 63 || !s.includes(":"))
    return null;
  const e = s.split("/"), t = [];
  let n = "";
  return e.forEach((a) => {
    if (a !== "" && !/\:/.test(a))
      n += "/" + a;
    else if (/\:/.test(a))
      if (/\?/.test(a)) {
        t.length === 0 && n === "" ? t.push("/") : t.push(n);
        const r = a.replace("?", "");
        n += "/" + r, t.push(n);
      } else
        n += "/" + a;
  }), t.filter((a, r, i) => i.indexOf(a) === r);
}, as = (s) => /[%+]/.test(s) ? (s.indexOf("+") !== -1 && (s = s.replace(/\+/g, " ")), s.indexOf("%") !== -1 ? Is(s, gn) : s) : s, pn = (s, e, t) => {
  let n;
  if (!t && e && !/[%+]/.test(e)) {
    let i = s.indexOf("?", 8);
    if (i === -1)
      return;
    for (s.startsWith(e, i + 1) || (i = s.indexOf(`&${e}`, i + 1)); i !== -1; ) {
      const o = s.charCodeAt(i + e.length + 1);
      if (o === 61) {
        const c = i + e.length + 2, d = s.indexOf("&", c);
        return as(s.slice(c, d === -1 ? void 0 : d));
      } else if (o == 38 || isNaN(o))
        return "";
      i = s.indexOf(`&${e}`, i + 1);
    }
    if (n = /[%+]/.test(s), !n)
      return;
  }
  const a = {};
  n ?? (n = /[%+]/.test(s));
  let r = s.indexOf("?", 8);
  for (; r !== -1; ) {
    const i = s.indexOf("&", r + 1);
    let o = s.indexOf("=", r);
    o > i && i !== -1 && (o = -1);
    let c = s.slice(
      r + 1,
      o === -1 ? i === -1 ? void 0 : i : o
    );
    if (n && (c = as(c)), r = i, c === "")
      continue;
    let d;
    o === -1 ? d = "" : (d = s.slice(o + 1, i === -1 ? void 0 : i), n && (d = as(d))), t ? (a[c] && Array.isArray(a[c]) || (a[c] = []), a[c].push(d)) : a[c] ?? (a[c] = d);
  }
  return e ? a[e] : a;
}, na = pn, aa = (s, e) => pn(s, e, !0), gn = decodeURIComponent, Ms = (s) => Is(s, gn), et, G, ye, yn, _n, fs, he, rn, ra = (rn = class {
  constructor(s, e = "/", t = [[]]) {
    k(this, ye);
    /**
     * `.raw` can get the raw Request object.
     *
     * @see {@link https://hono.dev/docs/api/request#raw}
     *
     * @example
     * ```ts
     * // For Cloudflare Workers
     * app.post('/', async (c) => {
     *   const metadata = c.req.raw.cf?.hostMetadata?
     *   ...
     * })
     * ```
     */
    v(this, "raw");
    k(this, et);
    // Short name of validatedData
    k(this, G);
    v(this, "routeIndex", 0);
    /**
     * `.path` can get the pathname of the request.
     *
     * @see {@link https://hono.dev/docs/api/request#path}
     *
     * @example
     * ```ts
     * app.get('/about/me', (c) => {
     *   const pathname = c.req.path // `/about/me`
     * })
     * ```
     */
    v(this, "path");
    v(this, "bodyCache", {});
    k(this, he, (s) => {
      const { bodyCache: e, raw: t } = this, n = e[s];
      if (n)
        return n;
      const a = Object.keys(e)[0];
      return a ? e[a].then((r) => (a === "json" && (r = JSON.stringify(r)), new Response(r)[s]())) : e[s] = t[s]();
    });
    this.raw = s, this.path = e, w(this, G, t), w(this, et, {});
  }
  param(s) {
    return s ? U(this, ye, yn).call(this, s) : U(this, ye, _n).call(this);
  }
  query(s) {
    return na(this.url, s);
  }
  queries(s) {
    return aa(this.url, s);
  }
  header(s) {
    if (s)
      return this.raw.headers.get(s) ?? void 0;
    const e = {};
    return this.raw.headers.forEach((t, n) => {
      e[n] = t;
    }), e;
  }
  async parseBody(s) {
    return zn(this, s);
  }
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return u(this, he).call(this, "text").then((s) => JSON.parse(s));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return u(this, he).call(this, "text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return u(this, he).call(this, "arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return u(this, he).call(this, "arrayBuffer").then((s) => new Uint8Array(s));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return u(this, he).call(this, "blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return u(this, he).call(this, "formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(s, e) {
    u(this, et)[s] = e;
  }
  valid(s) {
    return u(this, et)[s];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [Wn]() {
    return u(this, G);
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return u(this, G)[0].map(([[, s]]) => s);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return u(this, G)[0].map(([[, s]]) => s)[this.routeIndex].path;
  }
}, et = new WeakMap(), G = new WeakMap(), ye = new WeakSet(), yn = function(s) {
  const e = u(this, G)[0][this.routeIndex][1][s], t = U(this, ye, fs).call(this, e);
  return t && /\%/.test(t) ? Ms(t) : t;
}, _n = function() {
  const s = {}, e = Object.keys(u(this, G)[0][this.routeIndex][1]);
  for (const t of e) {
    const n = U(this, ye, fs).call(this, u(this, G)[0][this.routeIndex][1][t]);
    n !== void 0 && (s[t] = /\%/.test(n) ? Ms(n) : n);
  }
  return s;
}, fs = function(s) {
  return u(this, G)[1] ? u(this, G)[1][s] : s;
}, he = new WeakMap(), rn), ia = {
  Stringify: 1
}, vn = async (s, e, t, n, a) => {
  typeof s == "object" && !(s instanceof String) && (s instanceof Promise || (s = s.toString()), s instanceof Promise && (s = await s));
  const r = s.callbacks;
  return r != null && r.length ? (a ? a[0] += s : a = [s], Promise.all(r.map((o) => o({ phase: e, buffer: a, context: n }))).then(
    (o) => Promise.all(
      o.filter(Boolean).map((c) => vn(c, e, !1, n, a))
    ).then(() => a[0])
  )) : Promise.resolve(s);
}, oa = "text/plain; charset=UTF-8", rs = (s, e) => ({
  "Content-Type": s,
  ...e
}), vt = (s, e) => new Response(s, e), kt, St, fe, tt, me, W, Rt, st, nt, Me, Nt, Ct, Ie, Ge, on, ca = (on = class {
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(s, e) {
    k(this, Ie);
    k(this, kt);
    k(this, St);
    /**
     * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
     *
     * @see {@link https://hono.dev/docs/api/context#env}
     *
     * @example
     * ```ts
     * // Environment object for Cloudflare Workers
     * app.get('*', async c => {
     *   const counter = c.env.COUNTER
     * })
     * ```
     */
    v(this, "env", {});
    k(this, fe);
    v(this, "finalized", !1);
    /**
     * `.error` can get the error object from the middleware if the Handler throws an error.
     *
     * @see {@link https://hono.dev/docs/api/context#error}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   await next()
     *   if (c.error) {
     *     // do something...
     *   }
     * })
     * ```
     */
    v(this, "error");
    k(this, tt);
    k(this, me);
    k(this, W);
    k(this, Rt);
    k(this, st);
    k(this, nt);
    k(this, Me);
    k(this, Nt);
    k(this, Ct);
    /**
     * `.render()` can create a response within a layout.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   return c.render('Hello!')
     * })
     * ```
     */
    v(this, "render", (...s) => (u(this, st) ?? w(this, st, (e) => this.html(e)), u(this, st).call(this, ...s)));
    /**
     * Sets the layout for the response.
     *
     * @param layout - The layout to set.
     * @returns The layout function.
     */
    v(this, "setLayout", (s) => w(this, Rt, s));
    /**
     * Gets the current layout for the response.
     *
     * @returns The current layout function.
     */
    v(this, "getLayout", () => u(this, Rt));
    /**
     * `.setRenderer()` can set the layout in the custom middleware.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```tsx
     * app.use('*', async (c, next) => {
     *   c.setRenderer((content) => {
     *     return c.html(
     *       <html>
     *         <body>
     *           <p>{content}</p>
     *         </body>
     *       </html>
     *     )
     *   })
     *   await next()
     * })
     * ```
     */
    v(this, "setRenderer", (s) => {
      w(this, st, s);
    });
    /**
     * `.header()` can set headers.
     *
     * @see {@link https://hono.dev/docs/api/context#header}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    v(this, "header", (s, e, t) => {
      this.finalized && w(this, W, vt(u(this, W).body, u(this, W)));
      const n = u(this, W) ? u(this, W).headers : u(this, Me) ?? w(this, Me, new Headers());
      e === void 0 ? n.delete(s) : t != null && t.append ? n.append(s, e) : n.set(s, e);
    });
    v(this, "status", (s) => {
      w(this, tt, s);
    });
    /**
     * `.set()` can set the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   c.set('message', 'Hono is hot!!')
     *   await next()
     * })
     * ```
     */
    v(this, "set", (s, e) => {
      u(this, fe) ?? w(this, fe, /* @__PURE__ */ new Map()), u(this, fe).set(s, e);
    });
    /**
     * `.get()` can use the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   const message = c.get('message')
     *   return c.text(`The message is "${message}"`)
     * })
     * ```
     */
    v(this, "get", (s) => u(this, fe) ? u(this, fe).get(s) : void 0);
    v(this, "newResponse", (...s) => U(this, Ie, Ge).call(this, ...s));
    /**
     * `.body()` can return the HTTP response.
     * You can set headers with `.header()` and set HTTP status code with `.status`.
     * This can also be set in `.text()`, `.json()` and so on.
     *
     * @see {@link https://hono.dev/docs/api/context#body}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *   // Set HTTP status code
     *   c.status(201)
     *
     *   // Return the response body
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    v(this, "body", (s, e, t) => U(this, Ie, Ge).call(this, s, e, t));
    /**
     * `.text()` can render text as `Content-Type:text/plain`.
     *
     * @see {@link https://hono.dev/docs/api/context#text}
     *
     * @example
     * ```ts
     * app.get('/say', (c) => {
     *   return c.text('Hello!')
     * })
     * ```
     */
    v(this, "text", (s, e, t) => !u(this, Me) && !u(this, tt) && !e && !t && !this.finalized ? new Response(s) : U(this, Ie, Ge).call(this, s, e, rs(oa, t)));
    /**
     * `.json()` can render JSON as `Content-Type:application/json`.
     *
     * @see {@link https://hono.dev/docs/api/context#json}
     *
     * @example
     * ```ts
     * app.get('/api', (c) => {
     *   return c.json({ message: 'Hello!' })
     * })
     * ```
     */
    v(this, "json", (s, e, t) => U(this, Ie, Ge).call(this, JSON.stringify(s), e, rs("application/json", t)));
    v(this, "html", (s, e, t) => {
      const n = (a) => U(this, Ie, Ge).call(this, a, e, rs("text/html; charset=UTF-8", t));
      return typeof s == "object" ? vn(s, ia.Stringify, !1, {}).then(n) : n(s);
    });
    /**
     * `.redirect()` can Redirect, default status code is 302.
     *
     * @see {@link https://hono.dev/docs/api/context#redirect}
     *
     * @example
     * ```ts
     * app.get('/redirect', (c) => {
     *   return c.redirect('/')
     * })
     * app.get('/redirect-permanently', (c) => {
     *   return c.redirect('/', 301)
     * })
     * ```
     */
    v(this, "redirect", (s, e) => {
      const t = String(s);
      return this.header(
        "Location",
        // Multibyes should be encoded
        // eslint-disable-next-line no-control-regex
        /[^\x00-\xFF]/.test(t) ? encodeURI(t) : t
      ), this.newResponse(null, e ?? 302);
    });
    /**
     * `.notFound()` can return the Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/context#notfound}
     *
     * @example
     * ```ts
     * app.get('/notfound', (c) => {
     *   return c.notFound()
     * })
     * ```
     */
    v(this, "notFound", () => (u(this, nt) ?? w(this, nt, () => vt()), u(this, nt).call(this, this)));
    w(this, kt, s), e && (w(this, me, e.executionCtx), this.env = e.env, w(this, nt, e.notFoundHandler), w(this, Ct, e.path), w(this, Nt, e.matchResult));
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    return u(this, St) ?? w(this, St, new ra(u(this, kt), u(this, Ct), u(this, Nt))), u(this, St);
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (u(this, me) && "respondWith" in u(this, me))
      return u(this, me);
    throw Error("This context has no FetchEvent");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (u(this, me))
      return u(this, me);
    throw Error("This context has no ExecutionContext");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return u(this, W) || w(this, W, vt(null, {
      headers: u(this, Me) ?? w(this, Me, new Headers())
    }));
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(s) {
    if (u(this, W) && s) {
      s = vt(s.body, s);
      for (const [e, t] of u(this, W).headers.entries())
        if (e !== "content-type")
          if (e === "set-cookie") {
            const n = u(this, W).headers.getSetCookie();
            s.headers.delete("set-cookie");
            for (const a of n)
              s.headers.append("set-cookie", a);
          } else
            s.headers.set(e, t);
    }
    w(this, W, s), this.finalized = !0;
  }
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    return u(this, fe) ? Object.fromEntries(u(this, fe)) : {};
  }
}, kt = new WeakMap(), St = new WeakMap(), fe = new WeakMap(), tt = new WeakMap(), me = new WeakMap(), W = new WeakMap(), Rt = new WeakMap(), st = new WeakMap(), nt = new WeakMap(), Me = new WeakMap(), Nt = new WeakMap(), Ct = new WeakMap(), Ie = new WeakSet(), Ge = function(s, e, t) {
  const n = u(this, W) ? new Headers(u(this, W).headers) : u(this, Me) ?? new Headers();
  if (typeof e == "object" && "headers" in e) {
    const r = e.headers instanceof Headers ? e.headers : new Headers(e.headers);
    for (const [i, o] of r)
      i.toLowerCase() === "set-cookie" ? n.append(i, o) : n.set(i, o);
  }
  if (t)
    for (const [r, i] of Object.entries(t))
      if (typeof i == "string")
        n.set(r, i);
      else {
        n.delete(r);
        for (const o of i)
          n.append(r, o);
      }
  const a = typeof e == "number" ? e : (e == null ? void 0 : e.status) ?? u(this, tt);
  return vt(s, { status: a, headers: n });
}, on), $ = "ALL", da = "all", la = ["get", "post", "put", "delete", "options", "patch"], wn = "Can not add a route since the matcher is already built.", In = class extends Error {
}, ua = "__COMPOSED_HANDLER", ha = (s) => s.text("404 Not Found", 404), Us = (s, e) => {
  if ("getResponse" in s) {
    const t = s.getResponse();
    return e.newResponse(t.body, t);
  }
  return console.error(s), e.text("Internal Server Error", 500);
}, Q, B, An, ee, Ce, Ht, Vt, at, fa = (at = class {
  constructor(e = {}) {
    k(this, B);
    v(this, "get");
    v(this, "post");
    v(this, "put");
    v(this, "delete");
    v(this, "options");
    v(this, "patch");
    v(this, "all");
    v(this, "on");
    v(this, "use");
    /*
      This class is like an abstract class and does not have a router.
      To use it, inherit the class and implement router in the constructor.
    */
    v(this, "router");
    v(this, "getPath");
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    v(this, "_basePath", "/");
    k(this, Q, "/");
    v(this, "routes", []);
    k(this, ee, ha);
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    v(this, "errorHandler", Us);
    /**
     * `.onError()` handles an error and returns a customized Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#error-handling}
     *
     * @param {ErrorHandler} handler - request Handler for error
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.onError((err, c) => {
     *   console.error(`${err}`)
     *   return c.text('Custom Error Message', 500)
     * })
     * ```
     */
    v(this, "onError", (e) => (this.errorHandler = e, this));
    /**
     * `.notFound()` allows you to customize a Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#not-found}
     *
     * @param {NotFoundHandler} handler - request handler for not-found
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.notFound((c) => {
     *   return c.text('Custom 404 Message', 404)
     * })
     * ```
     */
    v(this, "notFound", (e) => (w(this, ee, e), this));
    /**
     * `.fetch()` will be entry point of your app.
     *
     * @see {@link https://hono.dev/docs/api/hono#fetch}
     *
     * @param {Request} request - request Object of request
     * @param {Env} Env - env Object
     * @param {ExecutionContext} - context of execution
     * @returns {Response | Promise<Response>} response of request
     *
     */
    v(this, "fetch", (e, ...t) => U(this, B, Vt).call(this, e, t[1], t[0], e.method));
    /**
     * `.request()` is a useful method for testing.
     * You can pass a URL or pathname to send a GET request.
     * app will return a Response object.
     * ```ts
     * test('GET /hello is ok', async () => {
     *   const res = await app.request('/hello')
     *   expect(res.status).toBe(200)
     * })
     * ```
     * @see https://hono.dev/docs/api/hono#request
     */
    v(this, "request", (e, t, n, a) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, a) : (e = e.toString(), this.fetch(
      new Request(
        /^https?:\/\//.test(e) ? e : `http://localhost${Ne("/", e)}`,
        t
      ),
      n,
      a
    )));
    /**
     * `.fire()` automatically adds a global fetch event listener.
     * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
     * @deprecated
     * Use `fire` from `hono/service-worker` instead.
     * ```ts
     * import { Hono } from 'hono'
     * import { fire } from 'hono/service-worker'
     *
     * const app = new Hono()
     * // ...
     * fire(app)
     * ```
     * @see https://hono.dev/docs/api/hono#fire
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
     * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
     */
    v(this, "fire", () => {
      addEventListener("fetch", (e) => {
        e.respondWith(U(this, B, Vt).call(this, e.request, e, void 0, e.request.method));
      });
    });
    [...la, da].forEach((r) => {
      this[r] = (i, ...o) => (typeof i == "string" ? w(this, Q, i) : U(this, B, Ce).call(this, r, u(this, Q), i), o.forEach((c) => {
        U(this, B, Ce).call(this, r, u(this, Q), c);
      }), this);
    }), this.on = (r, i, ...o) => {
      for (const c of [i].flat()) {
        w(this, Q, c);
        for (const d of [r].flat())
          o.map((l) => {
            U(this, B, Ce).call(this, d.toUpperCase(), u(this, Q), l);
          });
      }
      return this;
    }, this.use = (r, ...i) => (typeof r == "string" ? w(this, Q, r) : (w(this, Q, "*"), i.unshift(r)), i.forEach((o) => {
      U(this, B, Ce).call(this, $, u(this, Q), o);
    }), this);
    const { strict: n, ...a } = e;
    Object.assign(this, a), this.getPath = n ?? !0 ? e.getPath ?? fn : sa;
  }
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(e, t) {
    const n = this.basePath(e);
    return t.routes.map((a) => {
      var i;
      let r;
      t.errorHandler === Us ? r = a.handler : (r = async (o, c) => (await Cs([], t.errorHandler)(o, () => a.handler(o, c))).res, r[ua] = a.handler), U(i = n, B, Ce).call(i, a.method, a.path, r, a.basePath);
    }), this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(e) {
    const t = U(this, B, An).call(this);
    return t._basePath = Ne(this._basePath, e), t;
  }
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(e, t, n) {
    let a, r;
    n && (typeof n == "function" ? r = n : (r = n.optionHandler, n.replaceRequest === !1 ? a = (c) => c : a = n.replaceRequest));
    const i = r ? (c) => {
      const d = r(c);
      return Array.isArray(d) ? d : [d];
    } : (c) => {
      let d;
      try {
        d = c.executionCtx;
      } catch {
      }
      return [c.env, d];
    };
    a || (a = (() => {
      const c = Ne(this._basePath, e), d = c === "/" ? 0 : c.length;
      return (l) => {
        const h = new URL(l.url);
        return h.pathname = this.getPath(l).slice(d) || "/", new Request(h, l);
      };
    })());
    const o = async (c, d) => {
      const l = await t(a(c.req.raw), ...i(c));
      if (l)
        return l;
      await d();
    };
    return U(this, B, Ce).call(this, $, Ne(e, "*"), o), this;
  }
}, Q = new WeakMap(), B = new WeakSet(), An = function() {
  const e = new at({
    router: this.router,
    getPath: this.getPath
  });
  return e.errorHandler = this.errorHandler, w(e, ee, u(this, ee)), e.routes = this.routes, e;
}, ee = new WeakMap(), Ce = function(e, t, n, a) {
  e = e.toUpperCase(), t = Ne(this._basePath, t);
  const r = {
    basePath: a !== void 0 ? Ne(this._basePath, a) : this._basePath,
    path: t,
    method: e,
    handler: n
  };
  this.router.add(e, t, [n, r]), this.routes.push(r);
}, Ht = function(e, t) {
  if (e instanceof Error)
    return this.errorHandler(e, t);
  throw e;
}, Vt = function(e, t, n, a) {
  if (a === "HEAD")
    return (async () => new Response(null, await U(this, B, Vt).call(this, e, t, n, "GET")))();
  const r = this.getPath(e, { env: n }), i = this.router.match(a, r), o = new ca(e, {
    path: r,
    matchResult: i,
    env: n,
    executionCtx: t,
    notFoundHandler: u(this, ee)
  });
  if (i[0].length === 1) {
    let d;
    try {
      d = i[0][0][0][0](o, async () => {
        o.res = await u(this, ee).call(this, o);
      });
    } catch (l) {
      return U(this, B, Ht).call(this, l, o);
    }
    return d instanceof Promise ? d.then(
      (l) => l || (o.finalized ? o.res : u(this, ee).call(this, o))
    ).catch((l) => U(this, B, Ht).call(this, l, o)) : d ?? u(this, ee).call(this, o);
  }
  const c = Cs(i[0], this.errorHandler, u(this, ee));
  return (async () => {
    try {
      const d = await c(o);
      if (!d.finalized)
        throw new Error(
          "Context is not finalized. Did you forget to return a Response object or `await next()`?"
        );
      return d.res;
    } catch (d) {
      return U(this, B, Ht).call(this, d, o);
    }
  })();
}, at), bn = [];
function ma(s, e) {
  const t = this.buildAllMatchers(), n = (a, r) => {
    const i = t[a] || t[$], o = i[2][r];
    if (o)
      return o;
    const c = r.match(i[0]);
    if (!c)
      return [[], bn];
    const d = c.indexOf("", 1);
    return [i[1][d], c];
  };
  return this.match = n, n(s, e);
}
var zt = "[^/]+", bt = ".*", xt = "(?:|/.*)", Ye = /* @__PURE__ */ Symbol(), pa = new Set(".\\+*[^]$()");
function ga(s, e) {
  return s.length === 1 ? e.length === 1 ? s < e ? -1 : 1 : -1 : e.length === 1 || s === bt || s === xt ? 1 : e === bt || e === xt ? -1 : s === zt ? 1 : e === zt ? -1 : s.length === e.length ? s < e ? -1 : 1 : e.length - s.length;
}
var Ue, De, te, $e, ya = ($e = class {
  constructor() {
    k(this, Ue);
    k(this, De);
    k(this, te, /* @__PURE__ */ Object.create(null));
  }
  insert(e, t, n, a, r) {
    if (e.length === 0) {
      if (u(this, Ue) !== void 0)
        throw Ye;
      if (r)
        return;
      w(this, Ue, t);
      return;
    }
    const [i, ...o] = e, c = i === "*" ? o.length === 0 ? ["", "", bt] : ["", "", zt] : i === "/*" ? ["", "", xt] : i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let d;
    if (c) {
      const l = c[1];
      let h = c[2] || zt;
      if (l && c[2] && (h === ".*" || (h = h.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(h))))
        throw Ye;
      if (d = u(this, te)[h], !d) {
        if (Object.keys(u(this, te)).some(
          (b) => b !== bt && b !== xt
        ))
          throw Ye;
        if (r)
          return;
        d = u(this, te)[h] = new $e(), l !== "" && w(d, De, a.varIndex++);
      }
      !r && l !== "" && n.push([l, u(d, De)]);
    } else if (d = u(this, te)[i], !d) {
      if (Object.keys(u(this, te)).some(
        (l) => l.length > 1 && l !== bt && l !== xt
      ))
        throw Ye;
      if (r)
        return;
      d = u(this, te)[i] = new $e();
    }
    d.insert(o, t, n, a, r);
  }
  buildRegExpStr() {
    const t = Object.keys(u(this, te)).sort(ga).map((n) => {
      const a = u(this, te)[n];
      return (typeof u(a, De) == "number" ? `(${n})@${u(a, De)}` : pa.has(n) ? `\\${n}` : n) + a.buildRegExpStr();
    });
    return typeof u(this, Ue) == "number" && t.unshift(`#${u(this, Ue)}`), t.length === 0 ? "" : t.length === 1 ? t[0] : "(?:" + t.join("|") + ")";
  }
}, Ue = new WeakMap(), De = new WeakMap(), te = new WeakMap(), $e), es, Ot, cn, _a = (cn = class {
  constructor() {
    k(this, es, { varIndex: 0 });
    k(this, Ot, new ya());
  }
  insert(s, e, t) {
    const n = [], a = [];
    for (let i = 0; ; ) {
      let o = !1;
      if (s = s.replace(/\{[^}]+\}/g, (c) => {
        const d = `@\\${i}`;
        return a[i] = [d, c], i++, o = !0, d;
      }), !o)
        break;
    }
    const r = s.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = a.length - 1; i >= 0; i--) {
      const [o] = a[i];
      for (let c = r.length - 1; c >= 0; c--)
        if (r[c].indexOf(o) !== -1) {
          r[c] = r[c].replace(o, a[i][1]);
          break;
        }
    }
    return u(this, Ot).insert(r, e, n, u(this, es), t), n;
  }
  buildRegExp() {
    let s = u(this, Ot).buildRegExpStr();
    if (s === "")
      return [/^$/, [], []];
    let e = 0;
    const t = [], n = [];
    return s = s.replace(/#(\d+)|@(\d+)|\.\*\$/g, (a, r, i) => r !== void 0 ? (t[++e] = Number(r), "$()") : (i !== void 0 && (n[Number(i)] = ++e), "")), [new RegExp(`^${s}`), t, n];
  }
}, es = new WeakMap(), Ot = new WeakMap(), cn), va = [/^$/, [], /* @__PURE__ */ Object.create(null)], Wt = /* @__PURE__ */ Object.create(null);
function xn(s) {
  return Wt[s] ?? (Wt[s] = new RegExp(
    s === "*" ? "" : `^${s.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (e, t) => t ? `\\${t}` : "(?:|/.*)"
    )}$`
  ));
}
function wa() {
  Wt = /* @__PURE__ */ Object.create(null);
}
function Ia(s) {
  var d;
  const e = new _a(), t = [];
  if (s.length === 0)
    return va;
  const n = s.map(
    (l) => [!/\*|\/:/.test(l[0]), ...l]
  ).sort(
    ([l, h], [b, x]) => l ? 1 : b ? -1 : h.length - x.length
  ), a = /* @__PURE__ */ Object.create(null);
  for (let l = 0, h = -1, b = n.length; l < b; l++) {
    const [x, O, F] = n[l];
    x ? a[O] = [F.map(([z]) => [z, /* @__PURE__ */ Object.create(null)]), bn] : h++;
    let N;
    try {
      N = e.insert(O, h, x);
    } catch (z) {
      throw z === Ye ? new In(O) : z;
    }
    x || (t[h] = F.map(([z, M]) => {
      const P = /* @__PURE__ */ Object.create(null);
      for (M -= 1; M >= 0; M--) {
        const [Se, gt] = N[M];
        P[Se] = gt;
      }
      return [z, P];
    }));
  }
  const [r, i, o] = e.buildRegExp();
  for (let l = 0, h = t.length; l < h; l++)
    for (let b = 0, x = t[l].length; b < x; b++) {
      const O = (d = t[l][b]) == null ? void 0 : d[1];
      if (!O)
        continue;
      const F = Object.keys(O);
      for (let N = 0, z = F.length; N < z; N++)
        O[F[N]] = o[O[F[N]]];
    }
  const c = [];
  for (const l in i)
    c[l] = t[i[l]];
  return [r, c, a];
}
function We(s, e) {
  if (s) {
    for (const t of Object.keys(s).sort((n, a) => a.length - n.length))
      if (xn(t).test(e))
        return [...s[t]];
  }
}
var Ae, be, ts, En, dn, Aa = (dn = class {
  constructor() {
    k(this, ts);
    v(this, "name", "RegExpRouter");
    k(this, Ae);
    k(this, be);
    v(this, "match", ma);
    w(this, Ae, { [$]: /* @__PURE__ */ Object.create(null) }), w(this, be, { [$]: /* @__PURE__ */ Object.create(null) });
  }
  add(s, e, t) {
    var o;
    const n = u(this, Ae), a = u(this, be);
    if (!n || !a)
      throw new Error(wn);
    n[s] || [n, a].forEach((c) => {
      c[s] = /* @__PURE__ */ Object.create(null), Object.keys(c[$]).forEach((d) => {
        c[s][d] = [...c[$][d]];
      });
    }), e === "/*" && (e = "*");
    const r = (e.match(/\/:/g) || []).length;
    if (/\*$/.test(e)) {
      const c = xn(e);
      s === $ ? Object.keys(n).forEach((d) => {
        var l;
        (l = n[d])[e] || (l[e] = We(n[d], e) || We(n[$], e) || []);
      }) : (o = n[s])[e] || (o[e] = We(n[s], e) || We(n[$], e) || []), Object.keys(n).forEach((d) => {
        (s === $ || s === d) && Object.keys(n[d]).forEach((l) => {
          c.test(l) && n[d][l].push([t, r]);
        });
      }), Object.keys(a).forEach((d) => {
        (s === $ || s === d) && Object.keys(a[d]).forEach(
          (l) => c.test(l) && a[d][l].push([t, r])
        );
      });
      return;
    }
    const i = mn(e) || [e];
    for (let c = 0, d = i.length; c < d; c++) {
      const l = i[c];
      Object.keys(a).forEach((h) => {
        var b;
        (s === $ || s === h) && ((b = a[h])[l] || (b[l] = [
          ...We(n[h], l) || We(n[$], l) || []
        ]), a[h][l].push([t, r - d + c + 1]));
      });
    }
  }
  buildAllMatchers() {
    const s = /* @__PURE__ */ Object.create(null);
    return Object.keys(u(this, be)).concat(Object.keys(u(this, Ae))).forEach((e) => {
      s[e] || (s[e] = U(this, ts, En).call(this, e));
    }), w(this, Ae, w(this, be, void 0)), wa(), s;
  }
}, Ae = new WeakMap(), be = new WeakMap(), ts = new WeakSet(), En = function(s) {
  const e = [];
  let t = s === $;
  return [u(this, Ae), u(this, be)].forEach((n) => {
    const a = n[s] ? Object.keys(n[s]).map((r) => [r, n[s][r]]) : [];
    a.length !== 0 ? (t || (t = !0), e.push(...a)) : s !== $ && e.push(
      ...Object.keys(n[$]).map((r) => [r, n[$][r]])
    );
  }), t ? Ia(e) : null;
}, dn), xe, pe, ln, ba = (ln = class {
  constructor(s) {
    v(this, "name", "SmartRouter");
    k(this, xe, []);
    k(this, pe, []);
    w(this, xe, s.routers);
  }
  add(s, e, t) {
    if (!u(this, pe))
      throw new Error(wn);
    u(this, pe).push([s, e, t]);
  }
  match(s, e) {
    if (!u(this, pe))
      throw new Error("Fatal error");
    const t = u(this, xe), n = u(this, pe), a = t.length;
    let r = 0, i;
    for (; r < a; r++) {
      const o = t[r];
      try {
        for (let c = 0, d = n.length; c < d; c++)
          o.add(...n[c]);
        i = o.match(s, e);
      } catch (c) {
        if (c instanceof In)
          continue;
        throw c;
      }
      this.match = o.match.bind(o), w(this, xe, [o]), w(this, pe, void 0);
      break;
    }
    if (r === a)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, i;
  }
  get activeRouter() {
    if (u(this, pe) || u(this, xe).length !== 1)
      throw new Error("No active router has been determined yet.");
    return u(this, xe)[0];
  }
}, xe = new WeakMap(), pe = new WeakMap(), ln), wt = /* @__PURE__ */ Object.create(null), xa = (s) => {
  for (const e in s)
    return !0;
  return !1;
}, Ee, q, Le, rt, H, ae, ve, it, Ea = (it = class {
  constructor(e, t, n) {
    k(this, ae);
    k(this, Ee);
    k(this, q);
    k(this, Le);
    k(this, rt, 0);
    k(this, H, wt);
    if (w(this, q, n || /* @__PURE__ */ Object.create(null)), w(this, Ee, []), e && t) {
      const a = /* @__PURE__ */ Object.create(null);
      a[e] = { handler: t, possibleKeys: [], score: 0 }, w(this, Ee, [a]);
    }
    w(this, Le, []);
  }
  insert(e, t, n) {
    w(this, rt, ++Ns(this, rt)._);
    let a = this;
    const r = Yn(t), i = [];
    for (let o = 0, c = r.length; o < c; o++) {
      const d = r[o], l = r[o + 1], h = ea(d, l), b = Array.isArray(h) ? h[0] : d;
      if (b in u(a, q)) {
        a = u(a, q)[b], h && i.push(h[1]);
        continue;
      }
      u(a, q)[b] = new it(), h && (u(a, Le).push(h), i.push(h[1])), a = u(a, q)[b];
    }
    return u(a, Ee).push({
      [e]: {
        handler: n,
        possibleKeys: i.filter((o, c, d) => d.indexOf(o) === c),
        score: u(this, rt)
      }
    }), a;
  }
  search(e, t) {
    var l;
    const n = [];
    w(this, H, wt);
    let r = [this];
    const i = hn(t), o = [], c = i.length;
    let d = null;
    for (let h = 0; h < c; h++) {
      const b = i[h], x = h === c - 1, O = [];
      for (let N = 0, z = r.length; N < z; N++) {
        const M = r[N], P = u(M, q)[b];
        P && (w(P, H, u(M, H)), x ? (u(P, q)["*"] && U(this, ae, ve).call(this, n, u(P, q)["*"], e, u(M, H)), U(this, ae, ve).call(this, n, P, e, u(M, H))) : O.push(P));
        for (let Se = 0, gt = u(M, Le).length; Se < gt; Se++) {
          const ks = u(M, Le)[Se], ue = u(M, H) === wt ? {} : { ...u(M, H) };
          if (ks === "*") {
            const Re = u(M, q)["*"];
            Re && (U(this, ae, ve).call(this, n, Re, e, u(M, H)), w(Re, H, ue), O.push(Re));
            continue;
          }
          const [qn, Ss, yt] = ks;
          if (!b && !(yt instanceof RegExp))
            continue;
          const X = u(M, q)[qn];
          if (yt instanceof RegExp) {
            if (d === null) {
              d = new Array(c);
              let Ve = t[0] === "/" ? 1 : 0;
              for (let _t = 0; _t < c; _t++)
                d[_t] = Ve, Ve += i[_t].length + 1;
            }
            const Re = t.substring(d[h]), Dt = yt.exec(Re);
            if (Dt) {
              if (ue[Ss] = Dt[0], U(this, ae, ve).call(this, n, X, e, u(M, H), ue), Dt[0].length === Re.length && u(X, q)["*"] && U(this, ae, ve).call(this, n, u(X, q)["*"], e, u(M, H), ue), xa(u(X, q))) {
                w(X, H, ue);
                const Ve = ((l = Dt[0].match(/\//)) == null ? void 0 : l.length) ?? 0;
                (o[Ve] || (o[Ve] = [])).push(X);
              }
              continue;
            }
          }
          (yt === !0 || yt.test(b)) && (ue[Ss] = b, x ? (U(this, ae, ve).call(this, n, X, e, ue, u(M, H)), u(X, q)["*"] && U(this, ae, ve).call(this, n, u(X, q)["*"], e, ue, u(M, H))) : (w(X, H, ue), O.push(X)));
        }
      }
      const F = o.shift();
      r = F ? O.concat(F) : O;
    }
    return n.length > 1 && n.sort((h, b) => h.score - b.score), [n.map(({ handler: h, params: b }) => [h, b])];
  }
}, Ee = new WeakMap(), q = new WeakMap(), Le = new WeakMap(), rt = new WeakMap(), H = new WeakMap(), ae = new WeakSet(), ve = function(e, t, n, a, r) {
  for (let i = 0, o = u(t, Ee).length; i < o; i++) {
    const c = u(t, Ee)[i], d = c[n] || c[$], l = {};
    if (d !== void 0 && (d.params = /* @__PURE__ */ Object.create(null), e.push(d), a !== wt || r && r !== wt))
      for (let h = 0, b = d.possibleKeys.length; h < b; h++) {
        const x = d.possibleKeys[h], O = l[d.score];
        d.params[x] = r != null && r[x] && !O ? r[x] : a[x] ?? (r == null ? void 0 : r[x]), l[d.score] = !0;
      }
  }
}, it), Pe, un, Ta = (un = class {
  constructor() {
    v(this, "name", "TrieRouter");
    k(this, Pe);
    w(this, Pe, new Ea());
  }
  add(s, e, t) {
    const n = mn(e);
    if (n) {
      for (let a = 0, r = n.length; a < r; a++)
        u(this, Pe).insert(s, n[a], t);
      return;
    }
    u(this, Pe).insert(s, e, t);
  }
  match(s, e) {
    return u(this, Pe).search(s, e);
  }
}, Pe = new WeakMap(), un), de = class extends fa {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(s = {}) {
    super(s), this.router = s.router ?? new ba({
      routers: [new Aa(), new Ta()]
    });
  }
}, ka = (s) => {
  const e = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...s
  }, t = /* @__PURE__ */ ((a) => typeof a == "string" ? a === "*" ? () => a : (r) => a === r ? r : null : typeof a == "function" ? a : (r) => a.includes(r) ? r : null)(e.origin), n = ((a) => typeof a == "function" ? a : Array.isArray(a) ? () => a : () => [])(e.allowMethods);
  return async function(r, i) {
    var d;
    function o(l, h) {
      r.res.headers.set(l, h);
    }
    const c = await t(r.req.header("origin") || "", r);
    if (c && o("Access-Control-Allow-Origin", c), e.credentials && o("Access-Control-Allow-Credentials", "true"), (d = e.exposeHeaders) != null && d.length && o("Access-Control-Expose-Headers", e.exposeHeaders.join(",")), r.req.method === "OPTIONS") {
      e.origin !== "*" && o("Vary", "Origin"), e.maxAge != null && o("Access-Control-Max-Age", e.maxAge.toString());
      const l = await n(r.req.header("origin") || "", r);
      l.length && o("Access-Control-Allow-Methods", l.join(","));
      let h = e.allowHeaders;
      if (!(h != null && h.length)) {
        const b = r.req.header("Access-Control-Request-Headers");
        b && (h = b.split(/\s*,\s*/));
      }
      return h != null && h.length && (o("Access-Control-Allow-Headers", h.join(",")), r.res.headers.append("Vary", "Access-Control-Request-Headers")), r.res.headers.delete("Content-Length"), r.res.headers.delete("Content-Type"), new Response(null, {
        headers: r.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await i(), e.origin !== "*" && r.header("Vary", "Origin", { append: !0 });
  };
}, C;
(function(s) {
  s.assertEqual = (a) => {
  };
  function e(a) {
  }
  s.assertIs = e;
  function t(a) {
    throw new Error();
  }
  s.assertNever = t, s.arrayToEnum = (a) => {
    const r = {};
    for (const i of a)
      r[i] = i;
    return r;
  }, s.getValidEnumValues = (a) => {
    const r = s.objectKeys(a).filter((o) => typeof a[a[o]] != "number"), i = {};
    for (const o of r)
      i[o] = a[o];
    return s.objectValues(i);
  }, s.objectValues = (a) => s.objectKeys(a).map(function(r) {
    return a[r];
  }), s.objectKeys = typeof Object.keys == "function" ? (a) => Object.keys(a) : (a) => {
    const r = [];
    for (const i in a)
      Object.prototype.hasOwnProperty.call(a, i) && r.push(i);
    return r;
  }, s.find = (a, r) => {
    for (const i of a)
      if (r(i))
        return i;
  }, s.isInteger = typeof Number.isInteger == "function" ? (a) => Number.isInteger(a) : (a) => typeof a == "number" && Number.isFinite(a) && Math.floor(a) === a;
  function n(a, r = " | ") {
    return a.map((i) => typeof i == "string" ? `'${i}'` : i).join(r);
  }
  s.joinValues = n, s.jsonStringifyReplacer = (a, r) => typeof r == "bigint" ? r.toString() : r;
})(C || (C = {}));
var Ds;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Ds || (Ds = {}));
const y = C.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), we = (s) => {
  switch (typeof s) {
    case "undefined":
      return y.undefined;
    case "string":
      return y.string;
    case "number":
      return Number.isNaN(s) ? y.nan : y.number;
    case "boolean":
      return y.boolean;
    case "function":
      return y.function;
    case "bigint":
      return y.bigint;
    case "symbol":
      return y.symbol;
    case "object":
      return Array.isArray(s) ? y.array : s === null ? y.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? y.promise : typeof Map < "u" && s instanceof Map ? y.map : typeof Set < "u" && s instanceof Set ? y.set : typeof Date < "u" && s instanceof Date ? y.date : y.object;
    default:
      return y.unknown;
  }
}, f = C.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class oe extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(r) {
      return r.message;
    }, n = { _errors: [] }, a = (r) => {
      for (const i of r.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(a);
        else if (i.code === "invalid_return_type")
          a(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          a(i.argumentsError);
        else if (i.path.length === 0)
          n._errors.push(t(i));
        else {
          let o = n, c = 0;
          for (; c < i.path.length; ) {
            const d = i.path[c];
            c === i.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(i))) : o[d] = o[d] || { _errors: [] }, o = o[d], c++;
          }
        }
    };
    return a(this), n;
  }
  static assert(e) {
    if (!(e instanceof oe))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, C.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const a of this.issues)
      if (a.path.length > 0) {
        const r = a.path[0];
        t[r] = t[r] || [], t[r].push(e(a));
      } else
        n.push(e(a));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
oe.create = (s) => new oe(s);
const ms = (s, e) => {
  let t;
  switch (s.code) {
    case f.invalid_type:
      s.received === y.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case f.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, C.jsonStringifyReplacer)}`;
      break;
    case f.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${C.joinValues(s.keys, ", ")}`;
      break;
    case f.invalid_union:
      t = "Invalid input";
      break;
    case f.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${C.joinValues(s.options)}`;
      break;
    case f.invalid_enum_value:
      t = `Invalid enum value. Expected ${C.joinValues(s.options)}, received '${s.received}'`;
      break;
    case f.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case f.invalid_return_type:
      t = "Invalid function return type";
      break;
    case f.invalid_date:
      t = "Invalid date";
      break;
    case f.invalid_string:
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : C.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
      break;
    case f.too_small:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "bigint" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : t = "Invalid input";
      break;
    case f.too_big:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? t = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : t = "Invalid input";
      break;
    case f.custom:
      t = "Invalid input";
      break;
    case f.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case f.not_multiple_of:
      t = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case f.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, C.assertNever(s);
  }
  return { message: t };
};
let Sa = ms;
function Ra() {
  return Sa;
}
const Na = (s) => {
  const { data: e, path: t, errorMaps: n, issueData: a } = s, r = [...t, ...a.path || []], i = {
    ...a,
    path: r
  };
  if (a.message !== void 0)
    return {
      ...a,
      path: r,
      message: a.message
    };
  let o = "";
  const c = n.filter((d) => !!d).slice().reverse();
  for (const d of c)
    o = d(i, { data: e, defaultError: o }).message;
  return {
    ...a,
    path: r,
    message: o
  };
};
function p(s, e) {
  const t = Ra(), n = Na({
    issueData: e,
    data: s.data,
    path: s.path,
    errorMaps: [
      s.common.contextualErrorMap,
      // contextual error map is first priority
      s.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === ms ? void 0 : ms
      // then global default map
    ].filter((a) => !!a)
  });
  s.common.issues.push(n);
}
class Z {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const a of t) {
      if (a.status === "aborted")
        return A;
      a.status === "dirty" && e.dirty(), n.push(a.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const a of t) {
      const r = await a.key, i = await a.value;
      n.push({
        key: r,
        value: i
      });
    }
    return Z.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const a of t) {
      const { key: r, value: i } = a;
      if (r.status === "aborted" || i.status === "aborted")
        return A;
      r.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), r.value !== "__proto__" && (typeof i.value < "u" || a.alwaysSet) && (n[r.value] = i.value);
    }
    return { status: e.value, value: n };
  }
}
const A = Object.freeze({
  status: "aborted"
}), At = (s) => ({ status: "dirty", value: s }), Y = (s) => ({ status: "valid", value: s }), Ls = (s) => s.status === "aborted", Ps = (s) => s.status === "dirty", ot = (s) => s.status === "valid", Jt = (s) => typeof Promise < "u" && s instanceof Promise;
var _;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(_ || (_ = {}));
class ce {
  constructor(e, t, n, a) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = a;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const js = (s, e) => {
  if (ot(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new oe(s.common.issues);
      return this._error = t, this._error;
    }
  };
};
function T(s) {
  if (!s)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: a } = s;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a } : { errorMap: (i, o) => {
    const { message: c } = s;
    return i.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? n ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: a };
}
class R {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return we(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: we(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new Z(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: we(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Jt(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    const n = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: we(e)
    }, a = this._parseSync({ data: e, path: n.path, parent: n });
    return js(n, a);
  }
  "~validate"(e) {
    var n, a;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: we(e)
    };
    if (!this["~standard"].async)
      try {
        const r = this._parseSync({ data: e, path: [], parent: t });
        return ot(r) ? {
          value: r.value
        } : {
          issues: t.common.issues
        };
      } catch (r) {
        (a = (n = r == null ? void 0 : r.message) == null ? void 0 : n.toLowerCase()) != null && a.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((r) => ot(r) ? {
      value: r.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: we(e)
    }, a = this._parse({ data: e, path: n.path, parent: n }), r = await (Jt(a) ? a : Promise.resolve(a));
    return js(n, r);
  }
  refine(e, t) {
    const n = (a) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a) : t;
    return this._refinement((a, r) => {
      const i = e(a), o = () => r.addIssue({
        code: f.custom,
        ...n(a)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, a) => e(n) ? !0 : (a.addIssue(typeof t == "function" ? t(n, a) : t), !1));
  }
  _refinement(e) {
    return new lt({
      schema: this,
      typeName: I.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return Te.create(this, this._def);
  }
  nullable() {
    return ut.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ie.create(this);
  }
  promise() {
    return Qt.create(this, this._def);
  }
  or(e) {
    return Gt.create([this, e], this._def);
  }
  and(e) {
    return Yt.create(this, e, this._def);
  }
  transform(e) {
    return new lt({
      ...T(this._def),
      schema: this,
      typeName: I.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new _s({
      ...T(this._def),
      innerType: this,
      defaultValue: t,
      typeName: I.ZodDefault
    });
  }
  brand() {
    return new Qa({
      typeName: I.ZodBranded,
      type: this,
      ...T(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new vs({
      ...T(this._def),
      innerType: this,
      catchValue: t,
      typeName: I.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return As.create(this, e);
  }
  readonly() {
    return ws.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Ca = /^c[^\s-]{8,}$/i, Oa = /^[0-9a-z]+$/, Ma = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Ua = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Da = /^[a-z0-9_-]{21}$/i, La = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Pa = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, ja = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, $a = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let is;
const Ba = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Fa = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, qa = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Ha = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Va = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Wa = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Tn = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Za = new RegExp(`^${Tn}$`);
function kn(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function za(s) {
  return new RegExp(`^${kn(s)}$`);
}
function Ja(s) {
  let e = `${Tn}T${kn(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Ka(s, e) {
  return !!((e === "v4" || !e) && Ba.test(s) || (e === "v6" || !e) && qa.test(s));
}
function Ga(s, e) {
  if (!La.test(s))
    return !1;
  try {
    const [t] = s.split(".");
    if (!t)
      return !1;
    const n = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a = JSON.parse(atob(n));
    return !(typeof a != "object" || a === null || "typ" in a && (a == null ? void 0 : a.typ) !== "JWT" || !a.alg || e && a.alg !== e);
  } catch {
    return !1;
  }
}
function Ya(s, e) {
  return !!((e === "v4" || !e) && Fa.test(s) || (e === "v6" || !e) && Ha.test(s));
}
class ge extends R {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== y.string) {
      const r = this._getOrReturnCtx(e);
      return p(r, {
        code: f.invalid_type,
        expected: y.string,
        received: r.parsedType
      }), A;
    }
    const n = new Z();
    let a;
    for (const r of this._def.checks)
      if (r.kind === "min")
        e.data.length < r.value && (a = this._getOrReturnCtx(e, a), p(a, {
          code: f.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), n.dirty());
      else if (r.kind === "max")
        e.data.length > r.value && (a = this._getOrReturnCtx(e, a), p(a, {
          code: f.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), n.dirty());
      else if (r.kind === "length") {
        const i = e.data.length > r.value, o = e.data.length < r.value;
        (i || o) && (a = this._getOrReturnCtx(e, a), i ? p(a, {
          code: f.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }) : o && p(a, {
          code: f.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }), n.dirty());
      } else if (r.kind === "email")
        ja.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
          validation: "email",
          code: f.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "emoji")
        is || (is = new RegExp($a, "u")), is.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
          validation: "emoji",
          code: f.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "uuid")
        Ua.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
          validation: "uuid",
          code: f.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "nanoid")
        Da.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
          validation: "nanoid",
          code: f.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "cuid")
        Ca.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
          validation: "cuid",
          code: f.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "cuid2")
        Oa.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
          validation: "cuid2",
          code: f.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "ulid")
        Ma.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
          validation: "ulid",
          code: f.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "url")
        try {
          new URL(e.data);
        } catch {
          a = this._getOrReturnCtx(e, a), p(a, {
            validation: "url",
            code: f.invalid_string,
            message: r.message
          }), n.dirty();
        }
      else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
        validation: "regex",
        code: f.invalid_string,
        message: r.message
      }), n.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (a = this._getOrReturnCtx(e, a), p(a, {
        code: f.invalid_string,
        validation: { includes: r.value, position: r.position },
        message: r.message
      }), n.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (a = this._getOrReturnCtx(e, a), p(a, {
        code: f.invalid_string,
        validation: { startsWith: r.value },
        message: r.message
      }), n.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (a = this._getOrReturnCtx(e, a), p(a, {
        code: f.invalid_string,
        validation: { endsWith: r.value },
        message: r.message
      }), n.dirty()) : r.kind === "datetime" ? Ja(r).test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
        code: f.invalid_string,
        validation: "datetime",
        message: r.message
      }), n.dirty()) : r.kind === "date" ? Za.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
        code: f.invalid_string,
        validation: "date",
        message: r.message
      }), n.dirty()) : r.kind === "time" ? za(r).test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
        code: f.invalid_string,
        validation: "time",
        message: r.message
      }), n.dirty()) : r.kind === "duration" ? Pa.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
        validation: "duration",
        code: f.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "ip" ? Ka(e.data, r.version) || (a = this._getOrReturnCtx(e, a), p(a, {
        validation: "ip",
        code: f.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "jwt" ? Ga(e.data, r.alg) || (a = this._getOrReturnCtx(e, a), p(a, {
        validation: "jwt",
        code: f.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "cidr" ? Ya(e.data, r.version) || (a = this._getOrReturnCtx(e, a), p(a, {
        validation: "cidr",
        code: f.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "base64" ? Va.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
        validation: "base64",
        code: f.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "base64url" ? Wa.test(e.data) || (a = this._getOrReturnCtx(e, a), p(a, {
        validation: "base64url",
        code: f.invalid_string,
        message: r.message
      }), n.dirty()) : C.assertNever(r);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((a) => e.test(a), {
      validation: t,
      code: f.invalid_string,
      ..._.errToObj(n)
    });
  }
  _addCheck(e) {
    return new ge({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ..._.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ..._.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ..._.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ..._.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ..._.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ..._.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ..._.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ..._.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ..._.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ..._.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ..._.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ..._.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ..._.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (e == null ? void 0 : e.offset) ?? !1,
      local: (e == null ? void 0 : e.local) ?? !1,
      ..._.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ..._.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ..._.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ..._.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ..._.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ..._.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ..._.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ..._.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ..._.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ..._.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, _.errToObj(e));
  }
  trim() {
    return new ge({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ge({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ge({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
ge.create = (s) => new ge({
  checks: [],
  typeName: I.ZodString,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...T(s)
});
function Xa(s, e) {
  const t = (s.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, a = t > n ? t : n, r = Number.parseInt(s.toFixed(a).replace(".", "")), i = Number.parseInt(e.toFixed(a).replace(".", ""));
  return r % i / 10 ** a;
}
class ct extends R {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== y.number) {
      const r = this._getOrReturnCtx(e);
      return p(r, {
        code: f.invalid_type,
        expected: y.number,
        received: r.parsedType
      }), A;
    }
    let n;
    const a = new Z();
    for (const r of this._def.checks)
      r.kind === "int" ? C.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.invalid_type,
        expected: "integer",
        received: "float",
        message: r.message
      }), a.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.too_small,
        minimum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), a.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.too_big,
        maximum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), a.dirty()) : r.kind === "multipleOf" ? Xa(e.data, r.value) !== 0 && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), a.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.not_finite,
        message: r.message
      }), a.dirty()) : C.assertNever(r);
    return { status: a.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, _.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, _.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, _.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, _.toString(t));
  }
  setLimit(e, t, n, a) {
    return new ct({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: _.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ct({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: _.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: _.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: _.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: _.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: _.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: _.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: _.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: _.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: _.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && C.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
ct.create = (s) => new ct({
  checks: [],
  typeName: I.ZodNumber,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...T(s)
});
class Et extends R {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== y.bigint)
      return this._getInvalidInput(e);
    let n;
    const a = new Z();
    for (const r of this._def.checks)
      r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.too_small,
        type: "bigint",
        minimum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), a.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.too_big,
        type: "bigint",
        maximum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), a.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), a.dirty()) : C.assertNever(r);
    return { status: a.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return p(t, {
      code: f.invalid_type,
      expected: y.bigint,
      received: t.parsedType
    }), A;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, _.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, _.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, _.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, _.toString(t));
  }
  setLimit(e, t, n, a) {
    return new Et({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: _.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: _.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: _.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: _.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: _.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: _.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Et.create = (s) => new Et({
  checks: [],
  typeName: I.ZodBigInt,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...T(s)
});
class ps extends R {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== y.boolean) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: y.boolean,
        received: n.parsedType
      }), A;
    }
    return Y(e.data);
  }
}
ps.create = (s) => new ps({
  typeName: I.ZodBoolean,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...T(s)
});
class Kt extends R {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== y.date) {
      const r = this._getOrReturnCtx(e);
      return p(r, {
        code: f.invalid_type,
        expected: y.date,
        received: r.parsedType
      }), A;
    }
    if (Number.isNaN(e.data.getTime())) {
      const r = this._getOrReturnCtx(e);
      return p(r, {
        code: f.invalid_date
      }), A;
    }
    const n = new Z();
    let a;
    for (const r of this._def.checks)
      r.kind === "min" ? e.data.getTime() < r.value && (a = this._getOrReturnCtx(e, a), p(a, {
        code: f.too_small,
        message: r.message,
        inclusive: !0,
        exact: !1,
        minimum: r.value,
        type: "date"
      }), n.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (a = this._getOrReturnCtx(e, a), p(a, {
        code: f.too_big,
        message: r.message,
        inclusive: !0,
        exact: !1,
        maximum: r.value,
        type: "date"
      }), n.dirty()) : C.assertNever(r);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Kt({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: _.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: _.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
Kt.create = (s) => new Kt({
  checks: [],
  coerce: (s == null ? void 0 : s.coerce) || !1,
  typeName: I.ZodDate,
  ...T(s)
});
class $s extends R {
  _parse(e) {
    if (this._getType(e) !== y.symbol) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: y.symbol,
        received: n.parsedType
      }), A;
    }
    return Y(e.data);
  }
}
$s.create = (s) => new $s({
  typeName: I.ZodSymbol,
  ...T(s)
});
class Bs extends R {
  _parse(e) {
    if (this._getType(e) !== y.undefined) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: y.undefined,
        received: n.parsedType
      }), A;
    }
    return Y(e.data);
  }
}
Bs.create = (s) => new Bs({
  typeName: I.ZodUndefined,
  ...T(s)
});
class Fs extends R {
  _parse(e) {
    if (this._getType(e) !== y.null) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: y.null,
        received: n.parsedType
      }), A;
    }
    return Y(e.data);
  }
}
Fs.create = (s) => new Fs({
  typeName: I.ZodNull,
  ...T(s)
});
class qs extends R {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Y(e.data);
  }
}
qs.create = (s) => new qs({
  typeName: I.ZodAny,
  ...T(s)
});
class gs extends R {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Y(e.data);
  }
}
gs.create = (s) => new gs({
  typeName: I.ZodUnknown,
  ...T(s)
});
class ke extends R {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return p(t, {
      code: f.invalid_type,
      expected: y.never,
      received: t.parsedType
    }), A;
  }
}
ke.create = (s) => new ke({
  typeName: I.ZodNever,
  ...T(s)
});
class Hs extends R {
  _parse(e) {
    if (this._getType(e) !== y.undefined) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: y.void,
        received: n.parsedType
      }), A;
    }
    return Y(e.data);
  }
}
Hs.create = (s) => new Hs({
  typeName: I.ZodVoid,
  ...T(s)
});
class ie extends R {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), a = this._def;
    if (t.parsedType !== y.array)
      return p(t, {
        code: f.invalid_type,
        expected: y.array,
        received: t.parsedType
      }), A;
    if (a.exactLength !== null) {
      const i = t.data.length > a.exactLength.value, o = t.data.length < a.exactLength.value;
      (i || o) && (p(t, {
        code: i ? f.too_big : f.too_small,
        minimum: o ? a.exactLength.value : void 0,
        maximum: i ? a.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: a.exactLength.message
      }), n.dirty());
    }
    if (a.minLength !== null && t.data.length < a.minLength.value && (p(t, {
      code: f.too_small,
      minimum: a.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.minLength.message
    }), n.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (p(t, {
      code: f.too_big,
      maximum: a.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => a.type._parseAsync(new ce(t, i, t.path, o)))).then((i) => Z.mergeArray(n, i));
    const r = [...t.data].map((i, o) => a.type._parseSync(new ce(t, i, t.path, o)));
    return Z.mergeArray(n, r);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new ie({
      ...this._def,
      minLength: { value: e, message: _.toString(t) }
    });
  }
  max(e, t) {
    return new ie({
      ...this._def,
      maxLength: { value: e, message: _.toString(t) }
    });
  }
  length(e, t) {
    return new ie({
      ...this._def,
      exactLength: { value: e, message: _.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ie.create = (s, e) => new ie({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: I.ZodArray,
  ...T(e)
});
function Xe(s) {
  if (s instanceof j) {
    const e = {};
    for (const t in s.shape) {
      const n = s.shape[t];
      e[t] = Te.create(Xe(n));
    }
    return new j({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof ie ? new ie({
    ...s._def,
    type: Xe(s.element)
  }) : s instanceof Te ? Te.create(Xe(s.unwrap())) : s instanceof ut ? ut.create(Xe(s.unwrap())) : s instanceof Be ? Be.create(s.items.map((e) => Xe(e))) : s;
}
class j extends R {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = C.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== y.object) {
      const d = this._getOrReturnCtx(e);
      return p(d, {
        code: f.invalid_type,
        expected: y.object,
        received: d.parsedType
      }), A;
    }
    const { status: n, ctx: a } = this._processInputParams(e), { shape: r, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof ke && this._def.unknownKeys === "strip"))
      for (const d in a.data)
        i.includes(d) || o.push(d);
    const c = [];
    for (const d of i) {
      const l = r[d], h = a.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: l._parse(new ce(a, h, a.path, d)),
        alwaysSet: d in a.data
      });
    }
    if (this._def.catchall instanceof ke) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: a.data[l] }
          });
      else if (d === "strict")
        o.length > 0 && (p(a, {
          code: f.unrecognized_keys,
          keys: o
        }), n.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const l of o) {
        const h = a.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: d._parse(
            new ce(a, h, a.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in a.data
        });
      }
    }
    return a.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const l of c) {
        const h = await l.key, b = await l.value;
        d.push({
          key: h,
          value: b,
          alwaysSet: l.alwaysSet
        });
      }
      return d;
    }).then((d) => Z.mergeObjectSync(n, d)) : Z.mergeObjectSync(n, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return _.errToObj, new j({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var r, i;
          const a = ((i = (r = this._def).errorMap) == null ? void 0 : i.call(r, t, n).message) ?? n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: _.errToObj(e).message ?? a
          } : {
            message: a
          };
        }
      } : {}
    });
  }
  strip() {
    return new j({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new j({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new j({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new j({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: I.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new j({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const n of C.objectKeys(e))
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const n of C.objectKeys(this.shape))
      e[n] || (t[n] = this.shape[n]);
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Xe(this);
  }
  partial(e) {
    const t = {};
    for (const n of C.objectKeys(this.shape)) {
      const a = this.shape[n];
      e && !e[n] ? t[n] = a : t[n] = a.optional();
    }
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const n of C.objectKeys(this.shape))
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let r = this.shape[n];
        for (; r instanceof Te; )
          r = r._def.innerType;
        t[n] = r;
      }
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Sn(C.objectKeys(this.shape));
  }
}
j.create = (s, e) => new j({
  shape: () => s,
  unknownKeys: "strip",
  catchall: ke.create(),
  typeName: I.ZodObject,
  ...T(e)
});
j.strictCreate = (s, e) => new j({
  shape: () => s,
  unknownKeys: "strict",
  catchall: ke.create(),
  typeName: I.ZodObject,
  ...T(e)
});
j.lazycreate = (s, e) => new j({
  shape: s,
  unknownKeys: "strip",
  catchall: ke.create(),
  typeName: I.ZodObject,
  ...T(e)
});
class Gt extends R {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function a(r) {
      for (const o of r)
        if (o.result.status === "valid")
          return o.result;
      for (const o of r)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = r.map((o) => new oe(o.ctx.common.issues));
      return p(t, {
        code: f.invalid_union,
        unionErrors: i
      }), A;
    }
    if (t.common.async)
      return Promise.all(n.map(async (r) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await r._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(a);
    {
      let r;
      const i = [];
      for (const c of n) {
        const d = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, l = c._parseSync({
          data: t.data,
          path: t.path,
          parent: d
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !r && (r = { result: l, ctx: d }), d.common.issues.length && i.push(d.common.issues);
      }
      if (r)
        return t.common.issues.push(...r.ctx.common.issues), r.result;
      const o = i.map((c) => new oe(c));
      return p(t, {
        code: f.invalid_union,
        unionErrors: o
      }), A;
    }
  }
  get options() {
    return this._def.options;
  }
}
Gt.create = (s, e) => new Gt({
  options: s,
  typeName: I.ZodUnion,
  ...T(e)
});
function ys(s, e) {
  const t = we(s), n = we(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === y.object && n === y.object) {
    const a = C.objectKeys(e), r = C.objectKeys(s).filter((o) => a.indexOf(o) !== -1), i = { ...s, ...e };
    for (const o of r) {
      const c = ys(s[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (t === y.array && n === y.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const a = [];
    for (let r = 0; r < s.length; r++) {
      const i = s[r], o = e[r], c = ys(i, o);
      if (!c.valid)
        return { valid: !1 };
      a.push(c.data);
    }
    return { valid: !0, data: a };
  } else return t === y.date && n === y.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class Yt extends R {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), a = (r, i) => {
      if (Ls(r) || Ls(i))
        return A;
      const o = ys(r.value, i.value);
      return o.valid ? ((Ps(r) || Ps(i)) && t.dirty(), { status: t.value, value: o.data }) : (p(n, {
        code: f.invalid_intersection_types
      }), A);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([r, i]) => a(r, i)) : a(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
Yt.create = (s, e, t) => new Yt({
  left: s,
  right: e,
  typeName: I.ZodIntersection,
  ...T(t)
});
class Be extends R {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== y.array)
      return p(n, {
        code: f.invalid_type,
        expected: y.array,
        received: n.parsedType
      }), A;
    if (n.data.length < this._def.items.length)
      return p(n, {
        code: f.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), A;
    !this._def.rest && n.data.length > this._def.items.length && (p(n, {
      code: f.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const r = [...n.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new ce(n, i, n.path, o)) : null;
    }).filter((i) => !!i);
    return n.common.async ? Promise.all(r).then((i) => Z.mergeArray(t, i)) : Z.mergeArray(t, r);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Be({
      ...this._def,
      rest: e
    });
  }
}
Be.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Be({
    items: s,
    typeName: I.ZodTuple,
    rest: null,
    ...T(e)
  });
};
class Xt extends R {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== y.object)
      return p(n, {
        code: f.invalid_type,
        expected: y.object,
        received: n.parsedType
      }), A;
    const a = [], r = this._def.keyType, i = this._def.valueType;
    for (const o in n.data)
      a.push({
        key: r._parse(new ce(n, o, n.path, o)),
        value: i._parse(new ce(n, n.data[o], n.path, o)),
        alwaysSet: o in n.data
      });
    return n.common.async ? Z.mergeObjectAsync(t, a) : Z.mergeObjectSync(t, a);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof R ? new Xt({
      keyType: e,
      valueType: t,
      typeName: I.ZodRecord,
      ...T(n)
    }) : new Xt({
      keyType: ge.create(),
      valueType: e,
      typeName: I.ZodRecord,
      ...T(t)
    });
  }
}
class Vs extends R {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== y.map)
      return p(n, {
        code: f.invalid_type,
        expected: y.map,
        received: n.parsedType
      }), A;
    const a = this._def.keyType, r = this._def.valueType, i = [...n.data.entries()].map(([o, c], d) => ({
      key: a._parse(new ce(n, o, n.path, [d, "key"])),
      value: r._parse(new ce(n, c, n.path, [d, "value"]))
    }));
    if (n.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of i) {
          const d = await c.key, l = await c.value;
          if (d.status === "aborted" || l.status === "aborted")
            return A;
          (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const d = c.key, l = c.value;
        if (d.status === "aborted" || l.status === "aborted")
          return A;
        (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Vs.create = (s, e, t) => new Vs({
  valueType: e,
  keyType: s,
  typeName: I.ZodMap,
  ...T(t)
});
class Tt extends R {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== y.set)
      return p(n, {
        code: f.invalid_type,
        expected: y.set,
        received: n.parsedType
      }), A;
    const a = this._def;
    a.minSize !== null && n.data.size < a.minSize.value && (p(n, {
      code: f.too_small,
      minimum: a.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.minSize.message
    }), t.dirty()), a.maxSize !== null && n.data.size > a.maxSize.value && (p(n, {
      code: f.too_big,
      maximum: a.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.maxSize.message
    }), t.dirty());
    const r = this._def.valueType;
    function i(c) {
      const d = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted")
          return A;
        l.status === "dirty" && t.dirty(), d.add(l.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...n.data.values()].map((c, d) => r._parse(new ce(n, c, n.path, d)));
    return n.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, t) {
    return new Tt({
      ...this._def,
      minSize: { value: e, message: _.toString(t) }
    });
  }
  max(e, t) {
    return new Tt({
      ...this._def,
      maxSize: { value: e, message: _.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Tt.create = (s, e) => new Tt({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: I.ZodSet,
  ...T(e)
});
class Ws extends R {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Ws.create = (s, e) => new Ws({
  getter: s,
  typeName: I.ZodLazy,
  ...T(e)
});
class Zs extends R {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return p(t, {
        received: t.data,
        code: f.invalid_literal,
        expected: this._def.value
      }), A;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Zs.create = (s, e) => new Zs({
  value: s,
  typeName: I.ZodLiteral,
  ...T(e)
});
function Sn(s, e) {
  return new dt({
    values: s,
    typeName: I.ZodEnum,
    ...T(e)
  });
}
class dt extends R {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return p(t, {
        expected: C.joinValues(n),
        received: t.parsedType,
        code: f.invalid_type
      }), A;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return p(t, {
        received: t.data,
        code: f.invalid_enum_value,
        options: n
      }), A;
    }
    return Y(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return dt.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return dt.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
dt.create = Sn;
class zs extends R {
  _parse(e) {
    const t = C.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== y.string && n.parsedType !== y.number) {
      const a = C.objectValues(t);
      return p(n, {
        expected: C.joinValues(a),
        received: n.parsedType,
        code: f.invalid_type
      }), A;
    }
    if (this._cache || (this._cache = new Set(C.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const a = C.objectValues(t);
      return p(n, {
        received: n.data,
        code: f.invalid_enum_value,
        options: a
      }), A;
    }
    return Y(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
zs.create = (s, e) => new zs({
  values: s,
  typeName: I.ZodNativeEnum,
  ...T(e)
});
class Qt extends R {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== y.promise && t.common.async === !1)
      return p(t, {
        code: f.invalid_type,
        expected: y.promise,
        received: t.parsedType
      }), A;
    const n = t.parsedType === y.promise ? t.data : Promise.resolve(t.data);
    return Y(n.then((a) => this._def.type.parseAsync(a, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Qt.create = (s, e) => new Qt({
  type: s,
  typeName: I.ZodPromise,
  ...T(e)
});
class lt extends R {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === I.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), a = this._def.effect || null, r = {
      addIssue: (i) => {
        p(n, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (r.addIssue = r.addIssue.bind(r), a.type === "preprocess") {
      const i = a.transform(n.data, r);
      if (n.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return A;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: n.path,
            parent: n
          });
          return c.status === "aborted" ? A : c.status === "dirty" || t.value === "dirty" ? At(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return A;
        const o = this._def.schema._parseSync({
          data: i,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? A : o.status === "dirty" || t.value === "dirty" ? At(o.value) : o;
      }
    }
    if (a.type === "refinement") {
      const i = (o) => {
        const c = a.refinement(o, r);
        if (n.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? A : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => o.status === "aborted" ? A : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (a.type === "transform")
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!ot(i))
          return A;
        const o = a.transform(i.value, r);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((i) => ot(i) ? Promise.resolve(a.transform(i.value, r)).then((o) => ({
          status: t.value,
          value: o
        })) : A);
    C.assertNever(a);
  }
}
lt.create = (s, e, t) => new lt({
  schema: s,
  typeName: I.ZodEffects,
  effect: e,
  ...T(t)
});
lt.createWithPreprocess = (s, e, t) => new lt({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: I.ZodEffects,
  ...T(t)
});
class Te extends R {
  _parse(e) {
    return this._getType(e) === y.undefined ? Y(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Te.create = (s, e) => new Te({
  innerType: s,
  typeName: I.ZodOptional,
  ...T(e)
});
class ut extends R {
  _parse(e) {
    return this._getType(e) === y.null ? Y(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ut.create = (s, e) => new ut({
  innerType: s,
  typeName: I.ZodNullable,
  ...T(e)
});
class _s extends R {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === y.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
_s.create = (s, e) => new _s({
  innerType: s,
  typeName: I.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...T(e)
});
class vs extends R {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, a = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return Jt(a) ? a.then((r) => ({
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new oe(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new oe(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
vs.create = (s, e) => new vs({
  innerType: s,
  typeName: I.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...T(e)
});
class Js extends R {
  _parse(e) {
    if (this._getType(e) !== y.nan) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: y.nan,
        received: n.parsedType
      }), A;
    }
    return { status: "valid", value: e.data };
  }
}
Js.create = (s) => new Js({
  typeName: I.ZodNaN,
  ...T(s)
});
class Qa extends R {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class As extends R {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const r = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return r.status === "aborted" ? A : r.status === "dirty" ? (t.dirty(), At(r.value)) : this._def.out._parseAsync({
          data: r.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const a = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return a.status === "aborted" ? A : a.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: a.value
      }) : this._def.out._parseSync({
        data: a.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new As({
      in: e,
      out: t,
      typeName: I.ZodPipeline
    });
  }
}
class ws extends R {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (a) => (ot(a) && (a.value = Object.freeze(a.value)), a);
    return Jt(t) ? t.then((a) => n(a)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ws.create = (s, e) => new ws({
  innerType: s,
  typeName: I.ZodReadonly,
  ...T(e)
});
var I;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(I || (I = {}));
const g = ge.create, re = ct.create, K = ps.create, er = gs.create;
ke.create;
const bs = ie.create, L = j.create;
Gt.create;
Yt.create;
Be.create;
const tr = Xt.create, xs = dt.create;
Qt.create;
Te.create;
ut.create;
class m extends Error {
  constructor(e, t, n = 400, a) {
    super(t), this.code = e, this.status = n, this.details = a;
  }
}
function sr(s) {
  return s instanceof m;
}
function os(s, e, t = {}) {
  const n = JSON.stringify({
    level: s,
    event: e,
    ...t
  });
  if (s === "error") {
    console.error(n);
    return;
  }
  if (s === "warn") {
    console.warn(n);
    return;
  }
  console.log(n);
}
const je = {
  info: (s, e) => os("info", s, e),
  warn: (s, e) => os("warn", s, e),
  error: (s, e) => os("error", s, e)
};
function nr() {
  return async (s, e) => {
    try {
      await e();
    } catch (t) {
      return Rn(t, s);
    }
  };
}
function Rn(s, e) {
  const t = e.get("requestId");
  return sr(s) ? (je.warn("app_error", { requestId: t, code: s.code, message: s.message }), e.json({ error: { code: s.code, message: s.message, details: s.details } }, s.status)) : s instanceof oe ? (je.warn("validation_error", { requestId: t, issues: s.issues }), e.json(
    { error: { code: "VALIDATION_ERROR", message: "Invalid request", details: s.flatten() } },
    400
  )) : (je.error("unhandled_error", {
    requestId: t,
    message: s instanceof Error ? s.message : String(s)
  }), e.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, 500));
}
function V(s) {
  const e = new Uint8Array(16);
  crypto.getRandomValues(e);
  const t = Array.from(e, (n) => n.toString(16).padStart(2, "0")).join("");
  return `${s}_${t}`;
}
function ar() {
  return async (s, e) => {
    const t = s.req.header("x-request-id") || V("req");
    s.set("requestId", t), s.header("x-request-id", t), await e();
  };
}
class rr {
  constructor(e) {
    this.adapters = e;
  }
  get(e) {
    const t = this.adapters.find((n) => n.type === e);
    if (!t)
      throw new m("CHANNEL_NOT_SUPPORTED", `Unsupported channel: ${e}`, 400);
    return t;
  }
}
async function Ks(s) {
  const e = new TextEncoder().encode(s), t = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(t), (n) => n.toString(16).padStart(2, "0")).join("");
}
async function Gs(s, e) {
  const t = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", t, new TextEncoder().encode(e));
  return Array.from(new Uint8Array(n), (a) => a.toString(16).padStart(2, "0")).join("");
}
async function Fe(s, e) {
  const t = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", t, new TextEncoder().encode(e));
  return se(new Uint8Array(n));
}
function ht(s, e) {
  if (s.length !== e.length) return !1;
  let t = 0;
  for (let n = 0; n < s.length; n += 1)
    t |= s.charCodeAt(n) ^ e.charCodeAt(n);
  return t === 0;
}
function se(s) {
  const e = typeof s == "string" ? new TextEncoder().encode(s) : s;
  let t = "";
  for (const n of e) t += String.fromCharCode(n);
  return btoa(t).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}
function Es(s) {
  return new TextDecoder().decode(Nn(s));
}
function Nn(s) {
  const e = s.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(s.length / 4) * 4, "="), t = atob(e), n = new Uint8Array(t.length);
  for (let a = 0; a < t.length; a += 1)
    n[a] = t.charCodeAt(a);
  return n;
}
async function ir(s, e = crypto.getRandomValues(new Uint8Array(16))) {
  const n = await crypto.subtle.importKey("raw", new TextEncoder().encode(s), "PBKDF2", !1, ["deriveBits"]), a = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: e, iterations: 1e5, hash: "SHA-256" },
    n,
    256
  );
  return `pbkdf2_sha256$100000$${se(e)}$${se(new Uint8Array(a))}`;
}
async function Cn(s, e) {
  if (!e) return !1;
  const [t, n, a, r] = e.split("$");
  if (t !== "pbkdf2_sha256" || !n || !a || !r) return !1;
  const i = Number(n);
  if (!Number.isInteger(i) || i < 1e4) return !1;
  const o = await crypto.subtle.importKey("raw", new TextEncoder().encode(s), "PBKDF2", !1, ["deriveBits"]), c = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: Nn(a), iterations: i, hash: "SHA-256" },
    o,
    256
  );
  return ht(se(new Uint8Array(c)), r);
}
function D() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
const or = L({
  event_id: g().optional(),
  event_type: g().default("message.created"),
  contact: L({
    external_id: g().optional(),
    name: g().optional(),
    avatar_url: g().optional()
  }).optional(),
  message: L({
    external_id: g().optional(),
    type: xs(["text", "image", "file", "audio", "video", "event"]).default("text"),
    text: g().optional(),
    attachments: bs(tr(er())).default([])
  }),
  timestamp: g().optional()
});
class cr {
  constructor() {
    v(this, "type", "custom_webhook");
  }
  async verify(e, t) {
    if (!t.webhookSecretCiphertext) return;
    const n = e.headers.get("x-supportly-signature");
    if (!n)
      throw new m("SIGNATURE_INVALID", "Missing webhook signature", 401);
    const a = await e.text(), r = await Gs(t.webhookSecretCiphertext, a);
    if (!ht(n, r))
      throw new m("SIGNATURE_INVALID", "Invalid webhook signature", 401);
  }
  async parseInbound(e, t) {
    var i, o, c, d, l;
    const n = or.parse(await e.json()), a = ((i = n.contact) == null ? void 0 : i.external_id) ?? n.event_id ?? await Ks(JSON.stringify(n)), r = ((o = n.contact) == null ? void 0 : o.external_id) ?? `anonymous:${await Ks(`${t.id}:${a}`)}`;
    return [
      {
        externalMessageId: n.message.external_id ?? n.event_id,
        externalContactId: r,
        externalThreadId: a,
        contactName: (c = n.contact) == null ? void 0 : c.name,
        contactAvatarUrl: (d = n.contact) == null ? void 0 : d.avatar_url,
        isAnonymous: !((l = n.contact) != null && l.external_id),
        messageType: n.message.type,
        content: n.message.text,
        attachments: n.message.attachments.map((h) => ({
          type: typeof h.type == "string" ? h.type : "file",
          url: typeof h.url == "string" ? h.url : void 0,
          fileId: typeof h.file_id == "string" ? h.file_id : void 0,
          mimeType: typeof h.mime_type == "string" ? h.mime_type : void 0,
          fileName: typeof h.file_name == "string" ? h.file_name : void 0,
          size: typeof h.size == "number" ? h.size : void 0
        })),
        rawPayload: n,
        receivedAt: n.timestamp ?? D()
      }
    ];
  }
  async sendMessage(e, t) {
    if (!e.outboundUrl)
      return { externalMessageId: t.messageId };
    const n = {
      event_type: "message.send",
      conversation_id: t.conversationId,
      message_id: t.messageId,
      message: {
        type: t.messageType,
        text: t.content,
        attachments: t.attachments ?? []
      }
    }, a = JSON.stringify(n), r = new Headers({ "content-type": "application/json" });
    e.webhookSecretCiphertext && r.set("x-supportly-signature", await Gs(e.webhookSecretCiphertext, a));
    const i = await fetch(e.outboundUrl, {
      method: "POST",
      headers: r,
      body: a
    });
    if (!i.ok)
      throw new m("MESSAGE_SEND_FAILED", `Outbound webhook failed: ${i.status}`, 502);
    return { externalMessageId: t.messageId };
  }
}
class dr {
  constructor() {
    v(this, "type", "forum");
  }
  async verify() {
  }
  async parseInbound() {
    return [];
  }
  async sendMessage(e, t) {
    return { externalMessageId: t.messageId };
  }
}
const On = L({
  id: re(),
  is_bot: K().optional(),
  first_name: g().optional(),
  last_name: g().optional(),
  username: g().optional()
}), lr = L({
  id: re(),
  type: g(),
  first_name: g().optional(),
  last_name: g().optional(),
  username: g().optional(),
  title: g().optional()
}), ur = L({
  message_id: re(),
  date: re(),
  chat: lr,
  from: On.optional(),
  text: g().optional()
}), hr = L({
  update_id: re(),
  message: ur.optional()
}), fr = L({
  ok: K(),
  result: L({
    message_id: re()
  }).optional(),
  description: g().optional()
}), mr = L({
  ok: K(),
  result: K().optional(),
  description: g().optional()
}), pr = L({
  ok: K(),
  result: On.extend({
    can_join_groups: K().optional(),
    can_read_all_group_messages: K().optional(),
    supports_inline_queries: K().optional()
  }).optional(),
  description: g().optional()
}), gr = L({
  ok: K(),
  result: L({
    url: g(),
    has_custom_certificate: K().optional(),
    pending_update_count: re(),
    ip_address: g().optional(),
    last_error_date: re().optional(),
    last_error_message: g().optional(),
    last_synchronization_error_date: re().optional(),
    max_connections: re().optional(),
    allowed_updates: bs(g()).optional()
  }).optional(),
  description: g().optional()
});
class Mn {
  constructor() {
    v(this, "type", "telegram");
  }
  async verify(e, t) {
    if (!t.webhookSecretCiphertext) return;
    const n = e.headers.get("x-telegram-bot-api-secret-token");
    if (!n || !ht(n, t.webhookSecretCiphertext))
      throw new m("SIGNATURE_INVALID", "Invalid Telegram webhook secret", 401);
  }
  async parseInbound(e) {
    var a;
    const t = hr.parse(await e.json()), n = t.message;
    return !((a = n == null ? void 0 : n.text) != null && a.trim()) || !n.from ? [] : [
      {
        externalMessageId: String(t.update_id),
        externalContactId: String(n.from.id),
        externalThreadId: String(n.chat.id),
        contactName: Ys(n.from) ?? Ys(n.chat),
        isAnonymous: !1,
        messageType: "text",
        content: n.text,
        attachments: [],
        rawPayload: t,
        receivedAt: new Date(n.date * 1e3).toISOString()
      }
    ];
  }
  async sendMessage(e, t) {
    if (t.messageType !== "text")
      throw new m("MESSAGE_TYPE_NOT_SUPPORTED", "Telegram media outbound is not supported yet", 400);
    const n = e.credentialCiphertext;
    if (!n)
      throw new m("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    const a = await fetch(`https://api.telegram.org/bot${n}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: t.externalThreadId,
        text: t.content ?? ""
      })
    }), r = fr.parse(await a.json().catch(() => ({ ok: !1 })));
    if (!a.ok || !r.ok || !r.result)
      throw new m(
        "MESSAGE_SEND_FAILED",
        `Telegram sendMessage failed: ${a.status}${r.description ? ` ${r.description}` : ""}`,
        502
      );
    return { externalMessageId: String(r.result.message_id) };
  }
  async setWebhook(e, t) {
    const n = mr.parse(
      await this.callTelegram(e, "setWebhook", {
        url: t.webhookUrl,
        secret_token: e.webhookSecretCiphertext || void 0,
        allowed_updates: ["message"],
        drop_pending_updates: t.dropPendingUpdates ?? !1
      })
    );
    if (!n.ok || !n.result)
      throw new m("TELEGRAM_SET_WEBHOOK_FAILED", n.description ?? "Telegram setWebhook failed", 502);
    return {
      ok: !0,
      description: n.description,
      webhookUrl: t.webhookUrl,
      webhookInfo: await this.getWebhookInfo(e)
    };
  }
  async testConnection(e, t) {
    const n = await this.getMe(e), a = await this.getWebhookInfo(e);
    return {
      bot: n,
      webhookInfo: a,
      webhookUrlMatches: t ? a.url === t : !!a.url,
      expectedWebhookUrl: t
    };
  }
  async getMe(e) {
    const t = pr.parse(await this.callTelegram(e, "getMe"));
    if (!t.ok || !t.result)
      throw new m("TELEGRAM_GET_ME_FAILED", t.description ?? "Telegram getMe failed", 502);
    return {
      id: t.result.id,
      isBot: t.result.is_bot,
      firstName: t.result.first_name,
      username: t.result.username
    };
  }
  async getWebhookInfo(e) {
    const t = gr.parse(await this.callTelegram(e, "getWebhookInfo"));
    if (!t.ok || !t.result)
      throw new m("TELEGRAM_GET_WEBHOOK_INFO_FAILED", t.description ?? "Telegram getWebhookInfo failed", 502);
    return {
      url: t.result.url,
      pendingUpdateCount: t.result.pending_update_count,
      lastErrorDate: t.result.last_error_date,
      lastErrorMessage: t.result.last_error_message,
      allowedUpdates: t.result.allowed_updates
    };
  }
  async callTelegram(e, t, n) {
    const a = e.credentialCiphertext;
    if (!a)
      throw new m("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    const r = await fetch(`https://api.telegram.org/bot${a}/${t}`, {
      method: n ? "POST" : "GET",
      headers: n ? { "content-type": "application/json" } : void 0,
      body: n ? JSON.stringify(n) : void 0
    }), i = await r.json().catch(() => ({ ok: !1 }));
    if (!r.ok) {
      const o = typeof i == "object" && i && "description" in i ? String(i.description) : `HTTP ${r.status}`;
      throw new m("TELEGRAM_API_FAILED", `Telegram ${t} failed: ${o}`, 502);
    }
    return i;
  }
}
function Ys(s) {
  return [s.first_name, s.last_name].filter(Boolean).join(" ").trim() || s.username || s.title || void 0;
}
class yr {
  constructor() {
    v(this, "type", "web_chat");
  }
  async verify() {
  }
  async parseInbound() {
    return [];
  }
  async sendMessage(e, t) {
    return { externalMessageId: t.messageId };
  }
}
class _r {
  constructor(e, t) {
    this.search = e, this.instanceName = t;
  }
  async uploadDocument(e) {
    return this.search.items.upload(e.path, e.content, {
      metadata: e.metadata
    });
  }
  async uploadDocumentAndPoll(e) {
    return this.search.items.uploadAndPoll(e.path, e.content, {
      metadata: e.metadata,
      timeoutMs: 3e4
    });
  }
  async deleteDocument(e) {
    await this.search.items.delete(e);
  }
  async listDocuments() {
    const e = [];
    let n = 1;
    for (; ; ) {
      const a = await this.search.items.list({
        page: n,
        per_page: 50,
        sort_by: "modified_at"
      }), r = a.result ?? [];
      e.push(...r);
      const i = a.result_info, o = (i == null ? void 0 : i.total_count) ?? e.length, c = (i == null ? void 0 : i.page) ?? n, d = (i == null ? void 0 : i.per_page) ?? 50;
      if (e.length >= o || r.length === 0 || (n = c + 1, n > Math.ceil(o / d) + 1)) break;
    }
    return e;
  }
  async searchKnowledge(e) {
    return ((await this.search.search({
      messages: [{ role: "user", content: e }],
      ai_search_options: {
        retrieval: {
          retrieval_type: "vector",
          max_num_results: 5,
          match_threshold: 0.35
        }
      }
    })).chunks ?? []).map((n) => {
      var a, r, i, o, c;
      return {
        id: n.id,
        title: String(((r = (a = n.item) == null ? void 0 : a.metadata) == null ? void 0 : r.filename) ?? ((i = n.item) == null ? void 0 : i.key) ?? "Knowledge"),
        path: ((o = n.item) == null ? void 0 : o.key) ?? "",
        score: n.score ?? 0,
        text: n.text ?? "",
        metadata: ((c = n.item) == null ? void 0 : c.metadata) ?? {}
      };
    });
  }
}
const vr = "@cf/meta/llama-3.1-8b-instruct", wr = "kb/", Ir = 4 * 1024 * 1024, Ar = "media/", br = 10 * 1024 * 1024, xr = 50 * 1024 * 1024;
class Er {
  constructor(e, t) {
    this.ai = e, this.env = t;
  }
  async generateKnowledgeReply(e) {
    const t = this.env.DEFAULT_AI_MODEL || vr, n = Date.now(), a = Tr(e.question, e.references), r = await this.ai.run(t, { prompt: a });
    return {
      text: kr(r),
      metadata: {
        model: t,
        latencyMs: Date.now() - n,
        referencesCount: e.references.length
      }
    };
  }
}
function Tr(s, e) {
  const t = e.map((n, a) => `Source ${a + 1}: ${n.title}
${n.text}`).join(`

`);
  return [
    "You are a customer support assistant.",
    "Answer the customer only using the knowledge context.",
    "If the answer is not in the context, say you are not sure and ask a human agent to help.",
    "",
    `Question: ${s}`,
    "",
    `Knowledge context:
${t}`
  ].join(`
`);
}
function kr(s) {
  if (typeof s == "string") return s;
  if (s && typeof s == "object") {
    const e = s;
    if (typeof e.response == "string") return e.response;
    if (typeof e.result == "string") return e.result;
    if (typeof e.text == "string") return e.text;
  }
  return "抱歉，我暂时无法根据知识库生成回答。";
}
class Sr {
  constructor(e, t, n) {
    this.aiSearch = e, this.workersAi = t, this.messages = n;
  }
  async maybeCreateReply(e) {
    var a;
    if (e.handoffStatus === "agent" || !((a = e.messageContent) != null && a.trim())) return null;
    const t = await this.aiSearch.searchKnowledge(e.messageContent);
    if (t.length === 0) return null;
    const n = await this.workersAi.generateKnowledgeReply({
      question: e.messageContent,
      references: t
    });
    return this.messages.createOutbound({
      conversationId: e.conversationId,
      channelAccountId: e.channelAccountId,
      senderType: "ai",
      content: n.text,
      status: "sending",
      aiMetadata: n.metadata,
      aiReferences: t.map((r) => ({
        id: r.id,
        title: r.title,
        path: r.path,
        score: r.score
      }))
    });
  }
}
function Xs(s) {
  return {
    id: s.id,
    channelType: s.channel_type,
    displayName: s.display_name,
    externalAccountId: s.external_account_id,
    credentialCiphertext: s.credential_ciphertext,
    webhookSecretCiphertext: s.webhook_secret_ciphertext,
    outboundUrl: s.outbound_url,
    status: s.status,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class Rr {
  constructor(e) {
    this.db = e;
  }
  async list() {
    return (await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        ORDER BY created_at DESC
        `
    ).all()).results.map(Xs);
  }
  async findById(e) {
    const t = await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        WHERE id = ?
        LIMIT 1
        `
    ).bind(e).first();
    return t ? Xs(t) : null;
  }
  async create(e) {
    const t = V("ch"), n = D();
    await this.db.prepare(
      `
        INSERT INTO channel_accounts (
          id,
          channel_type,
          display_name,
          external_account_id,
          credential_ciphertext,
          webhook_secret_ciphertext,
          outbound_url,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
        `
    ).bind(
      t,
      e.channelType,
      e.displayName,
      e.externalAccountId ?? null,
      e.credentialCiphertext ?? null,
      e.webhookSecretCiphertext ?? null,
      e.outboundUrl ?? null,
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created channel account not found");
    return a;
  }
}
class Nr {
  constructor(e, t) {
    this.channels = e, this.adapters = t;
  }
  listAccounts() {
    return this.channels.list();
  }
  createAccount(e) {
    return this.adapters.get(e.channelType), this.channels.create(e);
  }
  async getAccount(e) {
    const t = await this.channels.findById(e);
    if (!t)
      throw new m("CHANNEL_NOT_FOUND", "Channel account not found", 404);
    return t;
  }
  getAdapter(e) {
    return this.adapters.get(e.channelType);
  }
}
function _e(s) {
  return {
    id: s.id,
    channelAccountId: s.channel_account_id,
    externalContactId: s.external_contact_id,
    externalThreadId: s.external_thread_id,
    contactName: s.contact_name,
    contactAvatarUrl: s.contact_avatar_url,
    isAnonymous: s.is_anonymous === 1,
    status: s.status,
    handoffStatus: s.handoff_status,
    assigneeAdminUserId: s.assignee_admin_user_id,
    lastMessageId: s.last_message_id,
    lastMessageAt: s.last_message_at,
    unreadCount: s.unread_count,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    resolvedAt: s.resolved_at
  };
}
class Cr {
  constructor(e) {
    this.db = e;
  }
  async listOpen(e = 50) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE status = 'open'
        ORDER BY last_message_at DESC
        LIMIT ?
        `
    ).bind(e).all()).results.map(_e);
  }
  async listResolved(e = 50) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE status = 'resolved'
        ORDER BY resolved_at DESC
        LIMIT ?
        `
    ).bind(e).all()).results.map(_e);
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM conversations WHERE id = ? LIMIT 1").bind(e).first();
    return t ? _e(t) : null;
  }
  async findByExternalThread(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
          AND external_thread_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? _e(n) : null;
  }
  async findLatestByExternalContact(e, t) {
    const n = await this.db.prepare(
      "SELECT * FROM conversations WHERE channel_account_id = ? AND external_contact_id = ? ORDER BY last_message_at DESC LIMIT 1"
    ).bind(e, t).first();
    return n ? _e(n) : null;
  }
  async create(e) {
    const t = V("conv"), n = D();
    await this.db.prepare(
      `
        INSERT INTO conversations (
          id,
          channel_account_id,
          external_contact_id,
          external_thread_id,
          contact_name,
          contact_avatar_url,
          is_anonymous,
          status,
          handoff_status,
          unread_count,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'open', 'bot', 0, ?, ?)
        `
    ).bind(
      t,
      e.channelAccountId,
      e.externalContactId,
      e.externalThreadId,
      e.contactName ?? null,
      e.contactAvatarUrl ?? null,
      e.isAnonymous ? 1 : 0,
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created conversation not found");
    return a;
  }
  async findOrCreateByExternalThread(e) {
    return await this.findByExternalThread(e.channelAccountId, e.externalThreadId) ?? this.create(e);
  }
  async touchAfterInbound(e, t, n) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            unread_count = unread_count + 1,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, n, n, e).run();
  }
  async touchAfterOutbound(e, t, n) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, n, n, e).run();
  }
  async markRead(e) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET unread_count = 0,
            updated_at = ?
        WHERE id = ?
          AND unread_count > 0
        `
    ).bind(D(), e).run();
  }
  async setHandoffStatus(e, t) {
    await this.db.prepare("UPDATE conversations SET handoff_status = ?, updated_at = ? WHERE id = ?").bind(t, D(), e).run();
  }
  async resolve(e) {
    const t = D();
    await this.db.prepare("UPDATE conversations SET status = 'resolved', resolved_at = ?, updated_at = ? WHERE id = ?").bind(t, t, e).run();
  }
  async reopen(e) {
    await this.db.prepare("UPDATE conversations SET status = 'open', resolved_at = NULL, updated_at = ? WHERE id = ?").bind(D(), e).run();
  }
  async listByChannel(e, t = 50, n = 0) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
        ORDER BY last_message_at DESC
        LIMIT ? OFFSET ?
        `
    ).bind(e, t, n).all()).results.map(_e);
  }
  async listByExternalContact(e, t) {
    let n = "SELECT c.* FROM conversations c";
    const a = [];
    return t && (n += " INNER JOIN channel_accounts ca ON ca.id = c.channel_account_id AND ca.channel_type = ?", a.push(t)), n += " WHERE c.external_contact_id = ? ORDER BY c.last_message_at DESC", a.push(e), (await this.db.prepare(n).bind(...a).all()).results.map(_e);
  }
  async countByChannel(e) {
    const t = await this.db.prepare("SELECT COUNT(*) as cnt FROM conversations WHERE channel_account_id = ?").bind(e).first();
    return (t == null ? void 0 : t.cnt) ?? 0;
  }
  async listByChannelWithFirstMessage(e, t = 50, n = 0) {
    return (await this.db.prepare(
      `
        SELECT c.*, m.raw_payload_json AS first_message_raw_payload
        FROM conversations c
        LEFT JOIN messages m ON m.id = (
          SELECT id FROM messages
          WHERE conversation_id = c.id
          ORDER BY created_at ASC
          LIMIT 1
        )
        WHERE c.channel_account_id = ?
        ORDER BY c.last_message_at DESC
        LIMIT ? OFFSET ?
        `
    ).bind(e, t, n).all()).results.map((r) => ({
      ..._e(r),
      firstMessageRawPayload: r.first_message_raw_payload
    }));
  }
}
class Or {
  constructor(e, t, n) {
    this.conversations = e, this.messages = t, this.ai = n;
  }
  listOpenConversations() {
    return this.conversations.listOpen();
  }
  listResolvedConversations() {
    return this.conversations.listResolved();
  }
  async getConversation(e) {
    const t = await this.conversations.findById(e);
    if (!t)
      throw new m("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return t;
  }
  async receiveInboundMessage(e, t = {}) {
    if (e.inbound.externalMessageId) {
      const o = await this.messages.findByExternalMessageId(
        e.channelAccount.id,
        e.inbound.externalMessageId
      );
      if (o)
        return {
          conversationId: o.conversationId,
          inboundMessage: o,
          aiMessage: null,
          duplicate: !0
        };
    }
    const n = await this.conversations.findOrCreateByExternalThread({
      channelAccountId: e.channelAccount.id,
      externalContactId: e.inbound.externalContactId,
      externalThreadId: e.inbound.externalThreadId,
      contactName: e.inbound.contactName,
      contactAvatarUrl: e.inbound.contactAvatarUrl,
      isAnonymous: e.inbound.isAnonymous
    });
    n.status === "resolved" && await this.conversations.reopen(n.id);
    const a = await this.messages.createInbound({
      id: e.messageId,
      conversationId: n.id,
      channelAccountId: e.channelAccount.id,
      inbound: e.inbound
    }), r = a.message;
    if (!a.created)
      return {
        conversationId: r.conversationId,
        inboundMessage: r,
        aiMessage: null,
        duplicate: !0
      };
    if (await this.conversations.touchAfterInbound(n.id, r.id, r.createdAt), t.createAiReply === !1)
      return {
        conversationId: n.id,
        inboundMessage: r,
        aiMessage: null,
        duplicate: !1
      };
    const i = await this.createAiReply({
      conversationId: n.id,
      channelAccountId: e.channelAccount.id,
      messageContent: r.content,
      handoffStatus: n.handoffStatus
    });
    return {
      conversationId: n.id,
      inboundMessage: r,
      aiMessage: i,
      duplicate: !1
    };
  }
  async createAiReply(e) {
    const t = await this.ai.maybeCreateReply(e);
    return t && await this.conversations.touchAfterOutbound(e.conversationId, t.id, t.createdAt), t;
  }
  async setHandoff(e, t) {
    return await this.getConversation(e), await this.conversations.setHandoffStatus(e, t), this.getConversation(e);
  }
  async resolve(e) {
    return await this.getConversation(e), await this.conversations.resolve(e), this.getConversation(e);
  }
}
function It(s) {
  return {
    id: s.id,
    conversationId: s.conversation_id,
    channelAccountId: s.channel_account_id,
    externalMessageId: s.external_message_id,
    direction: s.direction,
    senderType: s.sender_type,
    senderAdminUserId: s.sender_admin_user_id,
    clientMessageId: s.client_message_id,
    messageType: s.message_type,
    content: s.content,
    attachmentsJson: s.attachments_json,
    rawPayloadJson: s.raw_payload_json,
    aiMetadataJson: s.ai_metadata_json,
    aiReferencesJson: s.ai_references_json,
    status: s.status,
    errorMessage: s.error_message,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
function Ts(s) {
  if (!s) return [];
  try {
    const e = JSON.parse(s);
    return Array.isArray(e) ? e.filter(Mr) : [];
  } catch {
    return [];
  }
}
function Mr(s) {
  if (!s || typeof s != "object") return !1;
  const e = s;
  return e.type !== "image" && e.type !== "file" && e.type !== "audio" && e.type !== "video" ? !1 : Ze(e.url) && Ze(e.fileId) && Ze(e.r2Key) && Ze(e.mimeType) && Ze(e.fileName) && Pt(e.size) && Pt(e.width) && Pt(e.height) && Pt(e.durationMs) && Ze(e.thumbnailR2Key);
}
function Ze(s) {
  return s === void 0 || typeof s == "string";
}
function Pt(s) {
  return s === void 0 || typeof s == "number";
}
function cs(s, e, t) {
  const n = Zt(s.rawPayloadJson);
  return {
    id: s.id,
    conversationId: s.conversationId,
    direction: s.direction,
    senderType: s.senderType,
    messageType: s.messageType,
    content: s.content,
    attachments: Ts(s.attachmentsJson),
    status: s.status,
    createdAt: s.createdAt,
    contactName: e,
    externalContactId: t,
    likeCount: n.likeCount,
    likedBy: n.likedBy,
    quotedMessageId: n.quotedMessageId
  };
}
function Zt(s) {
  if (!s)
    return { likeCount: 0, likedBy: [], tags: [], category: "综合讨论", isPinned: !1, isFeatured: !1, quotedMessageId: null };
  try {
    const e = JSON.parse(s);
    return {
      likeCount: typeof e.forumLikes == "number" ? e.forumLikes : 0,
      likedBy: Array.isArray(e.forumLikedBy) ? e.forumLikedBy : [],
      tags: Array.isArray(e.forumTags) ? e.forumTags : [],
      category: typeof e.forumCategory == "string" ? e.forumCategory : "综合讨论",
      isPinned: e.forumPinned === !0,
      isFeatured: e.forumFeatured === !0,
      quotedMessageId: typeof e.quotedMessageId == "string" ? e.quotedMessageId : null
    };
  } catch {
    return { likeCount: 0, likedBy: [], tags: [], category: "综合讨论", isPinned: !1, isFeatured: !1, quotedMessageId: null };
  }
}
const Qs = 30 * 24 * 60 * 60;
class Ur {
  constructor(e, t, n, a, r, i, o, c, d) {
    this.channels = e, this.conversations = t, this.messages = n, this.conversationService = a, this.realtime = r, this.media = i, this.endUsers = o, this.endUserAuth = c, this.tokenSecret = d;
  }
  async listTopics(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const n = e.limit ?? 50, a = e.offset ?? 0, [r, i] = await Promise.all([
      this.conversations.listByChannelWithFirstMessage(t.id, n, a),
      this.conversations.countByChannel(t.id)
    ]);
    let o = r.map((c) => {
      const d = ls(c.firstMessageRawPayload), l = Zt(c.firstMessageRawPayload);
      return {
        id: c.id,
        conversationId: c.id,
        title: d,
        authorName: c.contactName ?? "匿名用户",
        category: l.category ?? "综合讨论",
        messageCount: c.unreadCount,
        lastReplyAt: c.lastMessageAt ?? c.createdAt,
        createdAt: c.createdAt,
        tags: l.tags,
        isPinned: l.isPinned,
        isFeatured: l.isFeatured,
        likeCount: l.likeCount,
        likedBy: l.likedBy
      };
    });
    if (e.search) {
      const c = e.search.toLowerCase();
      o = o.filter(
        (d) => d.title.toLowerCase().includes(c) || d.authorName.toLowerCase().includes(c) || d.tags.some((l) => l.toLowerCase().includes(c))
      );
    }
    return e.tag && (o = o.filter((c) => c.tags.includes(e.tag))), e.category && (o = o.filter((c) => c.category === e.category)), e.sortBy === "replies" ? o.sort((c, d) => d.messageCount - c.messageCount) : e.sortBy === "hot" ? o.sort((c, d) => d.likeCount - c.likeCount || d.messageCount - c.messageCount) : o.sort((c, d) => c.isPinned !== d.isPinned ? c.isPinned ? -1 : 1 : new Date(d.lastReplyAt).getTime() - new Date(c.lastReplyAt).getTime()), { topics: o, total: i };
  }
  async createTopic(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const n = ds(e.visitorId), a = `forum:${n}:${V("forum_topic")}`, { contactName: r, externalContactId: i, isAnonymous: o } = await this.resolveEndUserIdentity(
      n,
      e.endUserToken
    ), c = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: t,
        inbound: {
          externalMessageId: a,
          externalContactId: i,
          externalThreadId: i,
          contactName: r,
          isAnonymous: o,
          messageType: "text",
          content: `**${e.title}**

${e.content.trim()}`,
          attachments: [],
          rawPayload: {
            source: "forum",
            forumTopicTitle: e.title,
            forumCategory: e.category ?? "综合讨论",
            forumTags: e.tags ?? [],
            forumLikes: 0,
            forumLikedBy: [],
            forumPinned: !1,
            forumFeatured: !1,
            pageUrl: e.pageUrl,
            pageTitle: e.pageTitle
          },
          receivedAt: D()
        }
      },
      { createAiReply: !1 }
    ), d = await this.signForumToken({
      version: 1,
      channelAccountId: t.id,
      visitorId: i,
      conversationId: c.conversationId,
      contactName: r,
      isAnonymous: o,
      exp: Math.floor(Date.now() / 1e3) + Qs
    });
    return {
      conversationId: c.conversationId,
      channelAccountId: t.id,
      visitorId: i,
      visitorToken: d,
      expiresAt: new Date(Date.now() + Qs * 1e3).toISOString(),
      message: cs(c.inboundMessage, r, i)
    };
  }
  async sendReply(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new m("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = ds(e.visitorId), r = `forum:${a}:${V("forum_reply")}`, { contactName: i, externalContactId: o, isAnonymous: c } = await this.resolveEndUserIdentity(
      a,
      e.endUserToken
    );
    let d = e.content.trim();
    if (e.quotedMessageId) {
      const h = await this.messages.findById(e.quotedMessageId);
      if (h && h.conversationId === e.conversationId) {
        const b = t.contactName && t.contactName !== "匿名用户" ? t.contactName : `用户${(t.externalContactId ?? "").slice(-5)}`, O = (h.content ?? "").substring(0, 500).split(`
`);
        let F = O.length;
        for (let P = 0; P < O.length; P++)
          if (/^> @.+ 说：$/.test(O[P].trim())) {
            F = P;
            break;
          }
        const N = O.slice(0, F), z = O.slice(F), M = [];
        if (!h.quotedMessageId && N.length > 0) {
          const P = N[0].trim();
          P.startsWith("**") && P.endsWith("**") && (N.shift(), N.length > 0 && N[0].trim() === "" && N.shift());
        }
        M.push(d), M.push("");
        for (const P of N) M.push(P.trim() === "" ? ">" : `> ${P}`);
        M.push(`> @${b} 说：`);
        for (const P of z) M.push(`> ${P}`);
        d = M.join(`
`);
      }
    }
    const l = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
        inbound: {
          externalMessageId: r,
          externalContactId: o,
          externalThreadId: t.externalThreadId ?? o,
          contactName: i,
          isAnonymous: c,
          messageType: "text",
          content: d,
          attachments: [],
          rawPayload: {
            source: "forum",
            forumLikes: 0,
            forumLikedBy: [],
            pageUrl: e.pageUrl,
            pageTitle: e.pageTitle,
            quotedMessageId: e.quotedMessageId || null
          },
          receivedAt: D()
        }
      },
      { createAiReply: !1 }
    );
    return l.duplicate || await this.realtime.notifyMessageCreated({
      conversation: t,
      message: l.inboundMessage
    }), {
      conversationId: l.conversationId,
      message: cs(l.inboundMessage, i, o),
      duplicate: l.duplicate
    };
  }
  async listMessages(e) {
    const t = await this.conversations.findById(e.conversationId), n = (t == null ? void 0 : t.contactName) ?? "论坛用户", a = (t == null ? void 0 : t.externalContactId) ?? "anonymous";
    return {
      messages: (await this.messages.listByConversationAfter(
        e.conversationId,
        e.afterMessageId
      )).map((i) => {
        let o = i.content;
        return o && (o = o.replace(/^\*\*.+?\*\*\n\n/, "")), cs({ ...i, content: o }, n, a);
      })
    };
  }
  async likeTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new m("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = ds(e.visitorId), r = await this.getFirstMessage(e.conversationId);
    if (!r)
      throw new m("MESSAGE_NOT_FOUND", "First message not found", 404);
    const i = Zt(r.rawPayloadJson), o = i.likedBy.includes(a);
    let c, d;
    return o ? (c = Math.max(0, i.likeCount - 1), d = i.likedBy.filter((l) => l !== a)) : (c = i.likeCount + 1, d = [...i.likedBy, a]), await this.updateMessageRawPayload(r.id, r.rawPayloadJson, {
      forumLikes: c,
      forumLikedBy: d
    }), { likeCount: c, liked: !o, likedBy: d };
  }
  async togglePin(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new m("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new m("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumPinned: e.pin
    }), { isPinned: e.pin };
  }
  async toggleFeatured(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new m("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new m("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumFeatured: e.feature
    }), { isFeatured: e.feature };
  }
  async getUserProfile(e) {
    const t = await this.conversations.listByExternalContact(e, "forum");
    if (t.length === 0) return null;
    const n = t[0].isAnonymous, a = t[0].contactName ?? "匿名用户";
    let r = 0, i = 0;
    const o = [];
    for (const c of t) {
      const d = await this.getFirstMessage(c.id), l = Zt((d == null ? void 0 : d.rawPayloadJson) ?? null);
      r += l.likeCount, i += Math.max(0, c.unreadCount - 1), d && o.push({
        id: c.id,
        conversationId: c.id,
        title: ls(d.rawPayloadJson),
        authorName: c.contactName ?? "匿名用户",
        messageCount: c.unreadCount,
        lastReplyAt: c.lastMessageAt ?? c.createdAt,
        createdAt: c.createdAt,
        tags: l.tags,
        isPinned: l.isPinned,
        isFeatured: l.isFeatured,
        likeCount: l.likeCount,
        likedBy: l.likedBy
      });
    }
    return {
      externalContactId: e,
      displayName: a,
      isAnonymous: n,
      topicCount: t.length,
      replyCount: i,
      totalLikesReceived: r,
      joinedAt: t[t.length - 1].createdAt,
      recentTopics: o.sort(
        (c, d) => new Date(d.lastReplyAt).getTime() - new Date(c.lastReplyAt).getTime()
      )
    };
  }
  async getUserNotifications(e) {
    const t = await this.conversations.listByExternalContact(e, "forum"), n = [];
    for (const a of t) {
      const r = await this.getFirstMessage(a.id), i = ls((r == null ? void 0 : r.rawPayloadJson) ?? null), o = Math.max(0, a.unreadCount - 1);
      n.push({
        topicId: a.id,
        topicTitle: i,
        replyCount: o,
        lastReplyAt: a.lastMessageAt ?? a.createdAt,
        lastReplyAuthor: a.contactName ?? "匿名用户",
        hasNewReplies: o > 0
      });
    }
    return n;
  }
  async requireConversationAccess(e, t) {
    const n = await this.conversations.findById(e);
    if (!n)
      throw new m("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const a = await this.channels.getAccount(n.channelAccountId);
    return this.assertForumChannel(a), {
      conversationId: n.id,
      visitorId: n.externalContactId ?? "anonymous"
    };
  }
  async resolveEndUserIdentity(e, t) {
    if (t) {
      const n = await this.endUserAuth.tryGetEndUser(`Bearer ${t}`);
      if (n)
        return {
          contactName: n.displayName || n.username,
          externalContactId: n.id,
          isAnonymous: !1
        };
    }
    return {
      contactName: "论坛用户",
      externalContactId: e,
      isAnonymous: !0
    };
  }
  assertForumChannel(e) {
    if (e.channelType !== "forum")
      throw new m("CHANNEL_NOT_FORUM", "Channel is not a forum channel", 400);
  }
  async getFirstMessage(e) {
    return this.messages.listByConversation(e, 1).then((t) => t[0] ?? null);
  }
  async updateMessageRawPayload(e, t, n) {
    let a = {};
    if (t)
      try {
        a = JSON.parse(t);
      } catch {
      }
    const r = { ...a, ...n };
    await this.messages.updateRawPayload(e, JSON.stringify(r));
  }
  async signForumToken(e) {
    const t = se(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = se(JSON.stringify(e)), a = await Fe(`${t}.${n}`, this.tokenSecret);
    return `${t}.${n}.${a}`;
  }
}
function ds(s) {
  const e = s.trim();
  return e ? e.length > 128 ? e.slice(0, 128) : e : "anonymous";
}
function ls(s) {
  if (!s) return "无标题";
  try {
    const e = JSON.parse(s);
    if (e.forumTopicTitle && typeof e.forumTopicTitle == "string")
      return e.forumTopicTitle.trim();
  } catch {
  }
  return "无标题";
}
function us(s) {
  return {
    id: s.id,
    title: s.title,
    sourceType: s.source_type,
    aiSearchInstanceId: s.ai_search_instance_id,
    aiSearchItemId: s.ai_search_item_id,
    aiSearchPath: s.ai_search_path,
    status: s.status,
    fileName: s.file_name,
    fileSize: s.file_size,
    mimeType: s.mime_type,
    checksum: s.checksum,
    metadataJson: s.metadata_json,
    errorMessage: s.error_message,
    createdByAdminUserId: s.created_by_admin_user_id,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    indexedAt: s.indexed_at,
    deletedAt: s.deleted_at
  };
}
class Dr {
  constructor(e) {
    this.db = e;
  }
  async list() {
    return (await this.db.prepare(
      `
        SELECT *
        FROM kb_documents
        WHERE deleted_at IS NULL
        ORDER BY updated_at DESC
        `
    ).all()).results.map(us);
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM kb_documents WHERE id = ? AND deleted_at IS NULL LIMIT 1").bind(e).first();
    return t ? us(t) : null;
  }
  async findByAiSearchItem(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM kb_documents
        WHERE ai_search_instance_id = ?
          AND ai_search_item_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? us(n) : null;
  }
  async create(e) {
    const t = V("kb"), n = D();
    await this.db.prepare(
      `
        INSERT INTO kb_documents (
          id,
          title,
          source_type,
          ai_search_instance_id,
          ai_search_item_id,
          ai_search_path,
          status,
          file_name,
          file_size,
          mime_type,
          checksum,
          metadata_json,
          created_by_admin_user_id,
          created_at,
          updated_at,
          indexed_at
        )
        VALUES (?, ?, 'upload', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      t,
      e.title,
      e.aiSearchInstanceId,
      e.aiSearchItemId ?? null,
      e.aiSearchPath,
      e.status ?? "processing",
      e.fileName ?? null,
      e.fileSize ?? 0,
      e.mimeType ?? null,
      e.checksum ?? null,
      e.metadataJson ?? "{}",
      e.createdByAdminUserId ?? null,
      n,
      n,
      e.indexedAt ?? (e.status === "indexed" ? n : null)
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created knowledge document not found");
    return a;
  }
  async markDeleted(e) {
    const t = D();
    await this.db.prepare("UPDATE kb_documents SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?").bind(t, t, e).run();
  }
  async upsertFromAiSearchItem(e) {
    const t = await this.findByAiSearchItem(e.aiSearchInstanceId, e.aiSearchItemId), n = D();
    if (t) {
      await this.db.prepare(
        `
          UPDATE kb_documents
          SET title = ?,
              source_type = 'upload',
              ai_search_path = ?,
              status = ?,
              file_name = ?,
              file_size = ?,
              mime_type = ?,
              metadata_json = ?,
              error_message = ?,
              updated_at = ?,
              indexed_at = ?,
              deleted_at = NULL
          WHERE id = ?
          `
      ).bind(
        e.title,
        e.aiSearchPath,
        e.status,
        e.fileName ?? null,
        e.fileSize ?? 0,
        e.mimeType ?? null,
        e.metadataJson ?? "{}",
        e.errorMessage ?? null,
        n,
        e.indexedAt ?? (e.status === "indexed" ? t.indexedAt ?? n : t.indexedAt),
        t.id
      ).run();
      const i = await this.findById(t.id);
      if (!i) throw new Error("Updated knowledge document not found");
      return { document: i, action: "updated" };
    }
    const a = V("kb");
    await this.db.prepare(
      `
        INSERT INTO kb_documents (
          id,
          title,
          source_type,
          ai_search_instance_id,
          ai_search_item_id,
          ai_search_path,
          status,
          file_name,
          file_size,
          mime_type,
          metadata_json,
          error_message,
          created_at,
          updated_at,
          indexed_at
        )
        VALUES (?, ?, 'upload', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      a,
      e.title,
      e.aiSearchInstanceId,
      e.aiSearchItemId,
      e.aiSearchPath,
      e.status,
      e.fileName ?? null,
      e.fileSize ?? 0,
      e.mimeType ?? null,
      e.metadataJson ?? "{}",
      e.errorMessage ?? null,
      n,
      n,
      e.indexedAt ?? (e.status === "indexed" ? n : null)
    ).run();
    const r = await this.findById(a);
    if (!r) throw new Error("Created knowledge document not found");
    return { document: r, action: "created" };
  }
}
function Oe(s) {
  return JSON.stringify(s ?? null);
}
class Lr {
  constructor(e, t) {
    this.knowledge = e, this.aiSearch = t;
  }
  listDocuments() {
    return this.knowledge.list();
  }
  async uploadDocument(e) {
    if (e.file.size > Ir)
      throw new m("KNOWLEDGE_FILE_TOO_LARGE", "Knowledge file is larger than 4MB", 400);
    const t = V("kb"), n = e.file.name.replace(/[^\w.\-]+/g, "_"), a = `${wr}${t}/${n}`, r = await jr(e.file), i = await this.uploadToAiSearch(a, r), o = await this.knowledge.create({
      title: e.title || e.file.name,
      aiSearchInstanceId: this.aiSearch.instanceName,
      aiSearchItemId: i.id,
      aiSearchPath: i.key || a,
      status: hs(i.status),
      fileName: e.file.name,
      fileSize: e.file.size,
      mimeType: e.file.type || void 0,
      metadataJson: Oe({ filename: e.file.name, source: "upload" }),
      indexedAt: hs(i.status) === "indexed" ? i.last_seen_at ?? i.created_at : void 0,
      createdByAdminUserId: e.createdByAdminUserId
    });
    try {
      return await this.syncFromAiSearch(), await this.knowledge.findById(o.id) ?? o;
    } catch {
      return o;
    }
  }
  async uploadToAiSearch(e, t) {
    try {
      return await this.aiSearch.uploadDocument({ path: e, content: t });
    } catch (n) {
      throw new m(
        "KNOWLEDGE_UPLOAD_FAILED",
        `AI Search upload failed: ${n instanceof Error ? n.message : String(n)}`,
        502
      );
    }
  }
  async deleteDocument(e) {
    const t = await this.knowledge.findById(e);
    if (!t)
      throw new m("KNOWLEDGE_DOCUMENT_NOT_FOUND", "Knowledge document not found", 404);
    t.aiSearchItemId && await this.aiSearch.deleteDocument(t.aiSearchItemId), await this.knowledge.markDeleted(e);
  }
  async syncFromAiSearch() {
    const e = await this.aiSearch.listDocuments(), t = {
      instanceName: this.aiSearch.instanceName,
      scanned: e.length,
      created: 0,
      updated: 0,
      failed: 0
    };
    for (const n of e)
      try {
        const a = hs(n.status), r = n.metadata ?? {}, i = jt(r.filename) ?? Pr(n.key), o = await this.knowledge.upsertFromAiSearchItem({
          title: jt(r.title) ?? i ?? n.key,
          aiSearchInstanceId: this.aiSearch.instanceName,
          aiSearchItemId: n.id,
          aiSearchPath: n.key,
          status: a,
          fileName: i,
          fileSize: n.file_size ?? 0,
          mimeType: jt(r.mime_type) ?? jt(r.content_type),
          metadataJson: Oe({
            ...r,
            ai_search_source_id: n.source_id,
            ai_search_status: n.status,
            chunks_count: n.chunks_count,
            created_at: n.created_at,
            last_seen_at: n.last_seen_at
          }),
          errorMessage: a === "failed" ? `AI Search item status: ${n.status ?? "unknown"}` : void 0,
          indexedAt: a === "indexed" ? n.last_seen_at ?? n.created_at : void 0
        });
        o.action === "created" && (t.created += 1), o.action === "updated" && (t.updated += 1);
      } catch {
        t.failed += 1;
      }
    return t;
  }
}
function hs(s) {
  switch (s) {
    case "completed":
      return "indexed";
    case "error":
    case "skipped":
      return "failed";
    case "queued":
    case "running":
    case "outdated":
    default:
      return "processing";
  }
}
function jt(s) {
  return typeof s == "string" && s.trim() ? s : void 0;
}
function Pr(s) {
  return s.split("/").filter(Boolean).at(-1) ?? s;
}
async function jr(s) {
  return $r(s) ? s.text() : s.arrayBuffer();
}
function $r(s) {
  const e = s.name.toLowerCase(), t = s.type.toLowerCase();
  return t.startsWith("text/") || t === "application/json" || t === "application/xml" || t === "application/x-yaml" || e.endsWith(".md") || e.endsWith(".mdx") || e.endsWith(".txt") || e.endsWith(".html") || e.endsWith(".htm") || e.endsWith(".json") || e.endsWith(".csv") || e.endsWith(".yaml") || e.endsWith(".yml");
}
const en = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]), tn = /* @__PURE__ */ new Set(["video/mp4", "video/webm", "video/quicktime"]);
class Br {
  constructor(e, t) {
    this.bucket = e, this.messages = t;
  }
  async storeUpload(e) {
    var l;
    const t = this.requireBucket(), n = ((l = e.fileName) == null ? void 0 : l.trim()) || e.file.name || "upload", a = Fr(e.mimeType || e.file.type, n), r = qr(a), i = r === "image" ? br : xr;
    if (e.file.size > i)
      throw new m(
        "MEDIA_FILE_TOO_LARGE",
        `${r === "image" ? "Image" : "Video"} file is too large`,
        400,
        { maxBytes: i }
      );
    const o = V("att"), c = Un(n || o), d = `${Ar}${e.conversationId}/${e.messageId}/${o}/${c}`;
    return await t.put(d, e.file.stream(), {
      httpMetadata: {
        contentType: a,
        contentDisposition: sn(n || c)
      },
      customMetadata: {
        conversationId: e.conversationId,
        messageId: e.messageId,
        attachmentId: o,
        fileName: n || c
      }
    }), {
      messageType: r,
      attachment: {
        type: r,
        r2Key: d,
        fileName: n || c,
        mimeType: a,
        size: e.file.size
      }
    };
  }
  async getMessageAttachmentResponse(e) {
    const t = await this.messages.findById(e.messageId);
    if (!t || t.conversationId !== e.conversationId)
      throw new m("MESSAGE_NOT_FOUND", "Message not found", 404);
    const n = Ts(t.attachmentsJson)[e.attachmentIndex];
    if (!n)
      throw new m("ATTACHMENT_NOT_FOUND", "Attachment not found", 404);
    if (!n.r2Key) {
      if (n.url) return Response.redirect(n.url, 302);
      throw new m("ATTACHMENT_NOT_FOUND", "Attachment is not stored in Supportly", 404);
    }
    const a = this.requireBucket(), r = e.request.headers.get("range"), i = await a.get(
      n.r2Key,
      r ? { range: e.request.headers } : void 0
    );
    if (!i)
      throw new m("ATTACHMENT_NOT_FOUND", "Attachment file not found", 404);
    const o = new Headers();
    if (i.writeHttpMetadata(o), o.set("etag", i.httpEtag), o.set("accept-ranges", "bytes"), o.set("cache-control", "private, max-age=300"), o.set("content-type", n.mimeType || o.get("content-type") || "application/octet-stream"), n.fileName && !o.has("content-disposition") && o.set("content-disposition", sn(n.fileName)), i.range) {
      const c = Vr(i.range, i.size);
      return o.set("content-range", `bytes ${c.start}-${c.end}/${i.size}`), o.set("content-length", String(c.length)), new Response(i.body, { status: 206, headers: o });
    }
    return o.set("content-length", String(i.size)), new Response(i.body, { headers: o });
  }
  requireBucket() {
    if (!this.bucket)
      throw new m("MEDIA_STORAGE_NOT_CONFIGURED", "Media storage is not configured", 500);
    return this.bucket;
  }
}
function Fr(s, e) {
  const t = s.trim().toLowerCase();
  if (t && t !== "application/octet-stream")
    return t;
  const n = Hr(e);
  if (!n)
    throw new m("MEDIA_MIME_TYPE_REQUIRED", "Media file type is required", 400);
  return n;
}
function qr(s) {
  if (en.has(s)) return "image";
  if (tn.has(s)) return "video";
  throw new m("MEDIA_TYPE_NOT_SUPPORTED", "Only image and video files are supported", 400, {
    allowedMimeTypes: [...en, ...tn]
  });
}
function Un(s) {
  return s.trim().replace(/[^\w.\-]+/g, "_").replace(/^_+|_+$/g, "") || "upload";
}
function Hr(s) {
  const e = s.toLowerCase();
  if (e.endsWith(".jpg") || e.endsWith(".jpeg")) return "image/jpeg";
  if (e.endsWith(".png")) return "image/png";
  if (e.endsWith(".gif")) return "image/gif";
  if (e.endsWith(".webp")) return "image/webp";
  if (e.endsWith(".mp4")) return "video/mp4";
  if (e.endsWith(".webm")) return "video/webm";
  if (e.endsWith(".mov") || e.endsWith(".qt")) return "video/quicktime";
}
function sn(s) {
  return `inline; filename="${Un(s).replace(/["\\]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(s)}`;
}
function Vr(s, e) {
  const t = s;
  if (typeof t.offset == "number" && typeof t.length == "number") {
    const r = t.offset, i = Math.min(e - 1, t.offset + t.length - 1);
    return { start: r, end: i, length: i - r + 1 };
  }
  if (typeof t.offset == "number" && typeof t.end == "number") {
    const r = t.offset, i = Math.min(e - 1, t.end);
    return { start: r, end: i, length: i - r + 1 };
  }
  const n = Math.min(e, t.suffix ?? e);
  return { start: Math.max(0, e - n), end: e - 1, length: n };
}
class Wr {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM messages WHERE id = ? LIMIT 1").bind(e).first();
    return t ? It(t) : null;
  }
  async findByExternalMessageId(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE channel_account_id = ?
          AND external_message_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? It(n) : null;
  }
  async findByClientMessageId(e) {
    const t = await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
          AND sender_type = ?
          AND (
            (? IS NULL AND sender_admin_user_id IS NULL)
            OR sender_admin_user_id = ?
          )
          AND client_message_id = ?
        LIMIT 1
        `
    ).bind(
      e.conversationId,
      e.senderType,
      e.senderAdminUserId ?? null,
      e.senderAdminUserId ?? null,
      e.clientMessageId
    ).first();
    return t ? It(t) : null;
  }
  async listByConversation(e, t = 100) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        LIMIT ?
        `
    ).bind(e, t).all()).results.map(It);
  }
  async listByConversationAfter(e, t, n = 100) {
    if (!t)
      return this.listByConversation(e, n);
    const a = await this.findById(t);
    return !a || a.conversationId !== e ? [] : (await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
          AND (
            created_at > ?
            OR (created_at = ? AND id > ?)
          )
        ORDER BY created_at ASC, id ASC
        LIMIT ?
        `
    ).bind(e, a.createdAt, a.createdAt, a.id, n).all()).results.map(It);
  }
  async createInbound(e) {
    const t = e.id ?? V("msg"), n = e.inbound.receivedAt || D();
    await this.db.prepare(
      `
        INSERT OR IGNORE INTO messages (
          id,
          conversation_id,
          channel_account_id,
          external_message_id,
          direction,
          sender_type,
          message_type,
          content,
          attachments_json,
          raw_payload_json,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, 'inbound', 'customer', ?, ?, ?, ?, 'received', ?, ?)
        `
    ).bind(
      t,
      e.conversationId,
      e.channelAccountId,
      e.inbound.externalMessageId ?? null,
      e.inbound.messageType,
      e.inbound.content ?? null,
      Oe(e.inbound.attachments),
      Oe(e.inbound.rawPayload),
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (a) return { message: a, created: !0 };
    if (e.inbound.externalMessageId) {
      const r = await this.findByExternalMessageId(e.channelAccountId, e.inbound.externalMessageId);
      if (r) return { message: r, created: !1 };
    }
    throw new Error("Created inbound message not found");
  }
  async createOutbound(e) {
    const t = e.id ?? V("msg"), n = D();
    await this.db.prepare(
      `
        INSERT INTO messages (
          id,
          conversation_id,
          channel_account_id,
          direction,
          sender_type,
          sender_admin_user_id,
          client_message_id,
          message_type,
          content,
          attachments_json,
          ai_metadata_json,
          ai_references_json,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, 'outbound', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      t,
      e.conversationId,
      e.channelAccountId,
      e.senderType,
      e.senderAdminUserId ?? null,
      e.clientMessageId ?? null,
      e.messageType ?? "text",
      e.content,
      Oe(e.attachments ?? []),
      Oe(e.aiMetadata ?? {}),
      Oe(e.aiReferences ?? []),
      e.status,
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created outbound message not found");
    return a;
  }
  async updateRawPayload(e, t) {
    await this.db.prepare("UPDATE messages SET raw_payload_json = ? WHERE id = ?").bind(t, e).run();
  }
  async markSent(e, t) {
    await this.db.prepare(
      `
        UPDATE messages
        SET status = 'sent',
            external_message_id = COALESCE(?, external_message_id),
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t ?? null, D(), e).run();
  }
  async markFailed(e, t) {
    await this.db.prepare(
      `
        UPDATE messages
        SET status = 'failed',
            error_message = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, D(), e).run();
  }
}
class Zr {
  constructor(e, t, n, a, r) {
    this.channels = e, this.conversations = t, this.messages = n, this.realtime = a, this.media = r;
  }
  async listConversationMessages(e, t) {
    if (!await this.conversations.findById(e))
      throw new m("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return await this.conversations.markRead(e), this.messages.listByConversationAfter(e, t);
  }
  async sendAgentMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new m("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const i = await this.messages.findByClientMessageId({
        conversationId: t.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (i) return i;
    }
    const n = await this.channels.getAccount(t.channelAccountId), a = this.channels.getAdapter(n), r = await this.messages.createOutbound({
      conversationId: t.id,
      channelAccountId: n.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      content: e.content,
      attachments: [],
      status: "sending"
    });
    try {
      const i = await a.sendMessage(n, {
        conversationId: t.id,
        externalThreadId: t.externalThreadId,
        messageId: r.id,
        messageType: "text",
        content: e.content,
        attachments: []
      });
      await this.messages.markSent(r.id, i.externalMessageId), await this.conversations.touchAfterOutbound(t.id, r.id, r.createdAt);
      const o = await this.messages.findById(r.id), c = await this.conversations.findById(t.id);
      return o && c && await this.realtime.notifyMessageCreated({
        conversation: c,
        message: o
      }), o ?? { ...r, status: "sent", externalMessageId: i.externalMessageId ?? null };
    } catch (i) {
      throw await this.messages.markFailed(r.id, i instanceof Error ? i.message : "Message send failed"), i;
    }
  }
  async sendAgentMediaMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new m("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const d = await this.messages.findByClientMessageId({
        conversationId: t.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (d) return d;
    }
    const n = await this.channels.getAccount(t.channelAccountId), a = this.channels.getAdapter(n), r = V("msg"), i = await this.media.storeUpload({
      conversationId: t.id,
      messageId: r,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), o = zr(e.content), c = await this.messages.createOutbound({
      id: r,
      conversationId: t.id,
      channelAccountId: n.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      messageType: i.messageType,
      content: o,
      attachments: [i.attachment],
      status: "sending"
    });
    try {
      const d = await a.sendMessage(n, {
        conversationId: t.id,
        externalThreadId: t.externalThreadId,
        messageId: c.id,
        messageType: i.messageType,
        content: o,
        attachments: [i.attachment]
      });
      await this.messages.markSent(c.id, d.externalMessageId), await this.conversations.touchAfterOutbound(t.id, c.id, c.createdAt);
      const l = await this.messages.findById(c.id), h = await this.conversations.findById(t.id);
      return l && h && await this.realtime.notifyMessageCreated({
        conversation: h,
        message: l
      }), l ?? { ...c, status: "sent", externalMessageId: d.externalMessageId ?? null };
    } catch (d) {
      throw await this.messages.markFailed(c.id, d instanceof Error ? d.message : "Message send failed"), d;
    }
  }
  markSent(e, t) {
    return this.messages.markSent(e, t);
  }
  markFailed(e, t) {
    return this.messages.markFailed(e, t);
  }
}
function zr(s) {
  const e = s == null ? void 0 : s.trim();
  return e || null;
}
function Qe(s) {
  return {
    id: s.id,
    conversationId: s.conversationId,
    direction: s.direction,
    senderType: s.senderType,
    messageType: s.messageType,
    content: s.content,
    attachments: Ts(s.attachmentsJson),
    status: s.status,
    createdAt: s.createdAt
  };
}
const Jr = "admin", Kr = "https://supportly.internal/__notify";
class Gr {
  constructor(e) {
    this.env = e;
  }
  async notifyMessageCreated(e) {
    const t = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: Qe(e.message)
    }, n = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: e.message
    }, a = {
      type: "conversation.updated",
      conversation: e.conversation
    }, r = await Promise.allSettled([
      this.notifyVisitor(e.conversation.id, t),
      this.notifyAdmin(n),
      this.notifyAdmin(a)
    ]);
    for (const i of r)
      i.status === "rejected" && je.warn("realtime_notify_failed", {
        conversationId: e.conversation.id,
        messageId: e.message.id,
        error: i.reason instanceof Error ? i.reason.message : String(i.reason)
      });
  }
  async notifyVisitor(e, t) {
    const n = this.env.VISITOR_STREAM.idFromName(e), a = this.env.VISITOR_STREAM.get(n);
    await this.notify(a, t);
  }
  async notifyAdmin(e) {
    const t = this.env.ADMIN_STREAM.idFromName(Jr), n = this.env.ADMIN_STREAM.get(t);
    await this.notify(n, e);
  }
  async notify(e, t) {
    const n = await e.fetch(Kr, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(t)
    });
    if (!n.ok)
      throw new Error(`Realtime notify failed with status ${n.status}`);
  }
}
function nn(s) {
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    passwordHash: s.password_hash,
    role: s.role,
    status: s.status,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class Yr {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM admin_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return t ? nn(t) : null;
  }
  async findByEmail(e) {
    const t = await this.db.prepare("SELECT * FROM admin_users WHERE lower(email) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return t ? nn(t) : null;
  }
}
const Xr = 60 * 60 * 24 * 7;
class Qr {
  constructor(e, t) {
    this.adminUsers = e, this.jwtSecret = t;
  }
  async login(e, t) {
    const n = await this.adminUsers.findByEmail(e), a = n ? await Cn(t, n.passwordHash) : !1;
    if (!n || !a)
      throw new m("INVALID_CREDENTIALS", "Invalid email or password", 401);
    const r = Math.floor(Date.now() / 1e3) + Xr;
    return {
      token: await this.signToken({
        sub: n.id,
        email: n.email,
        name: n.name,
        role: n.role,
        exp: r
      }),
      tokenType: "Bearer",
      expiresAt: new Date(r * 1e3).toISOString(),
      adminUser: ti(n)
    };
  }
  async requireAdminUser(e) {
    const t = ei(e.authorization);
    if (t) {
      const a = await this.verifyToken(t), r = await this.adminUsers.findById(a.sub);
      if (!r)
        throw new m("UNAUTHORIZED", "Admin user not found", 401);
      return r;
    }
    if (!e.adminUserId)
      throw new m("UNAUTHORIZED", "Missing admin user", 401);
    const n = await this.adminUsers.findById(e.adminUserId);
    if (!n)
      throw new m("UNAUTHORIZED", "Admin user not found", 401);
    return n;
  }
  async signToken(e) {
    const t = se(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = se(JSON.stringify(e)), a = await Fe(this.jwtSecret, `${t}.${n}`);
    return `${t}.${n}.${a}`;
  }
  async verifyToken(e) {
    const [t, n, a] = e.split(".");
    if (!t || !n || !a)
      throw new m("UNAUTHORIZED", "Invalid auth token", 401);
    const r = await Fe(this.jwtSecret, `${t}.${n}`);
    if (!ht(a, r))
      throw new m("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(Es(n));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new m("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function ei(s) {
  if (!s) return null;
  const [e, t] = s.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !t ? null : t;
}
function ti(s) {
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    role: s.role
  };
}
function $t(s) {
  return {
    id: s.id,
    username: s.username,
    email: s.email,
    passwordHash: s.password_hash,
    displayName: s.display_name,
    status: s.status,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class si {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return t ? $t(t) : null;
  }
  async findByUsername(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return t ? $t(t) : null;
  }
  async findByUsernameAny(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) LIMIT 1").bind(e).first();
    return t ? $t(t) : null;
  }
  async listAll() {
    return (await this.db.prepare("SELECT * FROM end_users ORDER BY created_at DESC LIMIT 200").all()).results.map($t);
  }
  async approve(e) {
    const t = D();
    return await this.db.prepare("UPDATE end_users SET status = 'active', updated_at = ? WHERE id = ? AND status = 'pending'").bind(t, e).run(), this.findById(e);
  }
  async deactivate(e) {
    const t = D();
    await this.db.prepare("UPDATE end_users SET status = 'pending', updated_at = ? WHERE id = ?").bind(t, e).run();
  }
  async anonymizeConversations(e) {
    const t = D();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 1, contact_name = '匿名访客', updated_at = ? WHERE external_contact_id = ?"
    ).bind(t, e).run();
  }
  async restoreConversations(e, t) {
    const n = D();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 0, contact_name = ?, updated_at = ? WHERE external_contact_id = ?"
    ).bind(t, n, e).run();
  }
  async getConversationCounts() {
    const e = await this.db.prepare("SELECT external_contact_id, COUNT(*) as count FROM conversations GROUP BY external_contact_id").all();
    return new Map(e.results.map((t) => [t.external_contact_id, t.count]));
  }
  async create(e) {
    var i;
    const t = V("eu"), n = await ir(e.password), a = D(), r = ((i = e.displayName) == null ? void 0 : i.trim()) || e.username;
    return await this.db.prepare(
      "INSERT INTO end_users (id, username, email, password_hash, display_name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)"
    ).bind(t, e.username, e.email ?? null, n, r, a, a).run(), {
      id: t,
      username: e.username,
      email: e.email ?? null,
      displayName: r,
      passwordHash: n,
      status: "pending",
      createdAt: a,
      updatedAt: a
    };
  }
}
const ni = 60 * 60 * 24 * 7;
class ai {
  constructor(e, t) {
    this.endUsers = e, this.jwtSecret = t;
  }
  async login(e, t) {
    const n = await this.endUsers.findByUsername(e), a = n ? await Cn(t, n.passwordHash) : !1;
    if (!n || !a)
      throw new m("INVALID_CREDENTIALS", "Invalid username or password", 401);
    const r = Math.floor(Date.now() / 1e3) + ni;
    return {
      token: await this.signToken({
        sub: n.id,
        username: n.username,
        displayName: n.displayName,
        exp: r
      }),
      tokenType: "Bearer",
      expiresAt: new Date(r * 1e3).toISOString(),
      user: Bt(n)
    };
  }
  async register(e) {
    if (await this.endUsers.findByUsernameAny(e.username))
      throw new m("USERNAME_TAKEN", "Username is already taken", 409);
    const n = await this.endUsers.create(e);
    return Bt(n);
  }
  async listUsers() {
    const [e, t] = await Promise.all([
      this.endUsers.listAll(),
      this.endUsers.getConversationCounts()
    ]);
    return e.map((n) => ({
      ...Bt(n),
      conversationCount: t.get(n.id) ?? 0
    }));
  }
  async approveUser(e) {
    const t = await this.endUsers.approve(e);
    if (!t)
      throw new m("END_USER_NOT_FOUND", "End user not found or already approved", 404);
    return await this.endUsers.restoreConversations(t.id, t.displayName), Bt(t);
  }
  async deactivateUser(e) {
    await this.endUsers.anonymizeConversations(e), await this.endUsers.deactivate(e);
  }
  async requireEndUser(e) {
    const t = ri(e);
    if (!t)
      throw new m("UNAUTHORIZED", "Missing auth token", 401);
    const n = await this.verifyToken(t), a = await this.endUsers.findById(n.sub);
    if (!a)
      throw new m("UNAUTHORIZED", "End user not found", 401);
    return a;
  }
  async tryGetEndUser(e) {
    try {
      return await this.requireEndUser(e);
    } catch {
      return null;
    }
  }
  async signToken(e) {
    const t = se(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = se(JSON.stringify(e)), a = await Fe(this.jwtSecret, `${t}.${n}`);
    return `${t}.${n}.${a}`;
  }
  async verifyToken(e) {
    const [t, n, a] = e.split(".");
    if (!t || !n || !a)
      throw new m("UNAUTHORIZED", "Invalid auth token", 401);
    const r = await Fe(this.jwtSecret, `${t}.${n}`);
    if (!ht(a, r))
      throw new m("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(Es(n));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new m("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function ri(s) {
  if (!s) return null;
  const [e, t] = s.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !t ? null : t;
}
function Bt(s) {
  return {
    id: s.id,
    username: s.username,
    displayName: s.displayName,
    email: s.email,
    status: s.status,
    createdAt: s.createdAt
  };
}
const ii = 30 * 24 * 60 * 60;
class oi {
  constructor(e, t, n, a, r, i, o, c) {
    this.channels = e, this.conversations = t, this.messages = n, this.conversationService = a, this.realtime = r, this.media = i, this.endUsers = o, this.tokenSecret = c;
  }
  async createSession(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertWebChatChannel(t);
    const n = ci(e.visitorId), a = !!(e.endUserId && e.endUserName), r = a ? `${e.endUserId}` : n, i = Math.floor(Date.now() / 1e3) + ii, o = await this.signToken({
      version: 1,
      channelAccountId: t.id,
      visitorId: r,
      contactName: a ? e.endUserName : "匿名访客",
      isAnonymous: !a,
      exp: i
    }), c = await this.conversations.findLatestByExternalContact(t.id, r);
    return {
      conversationId: (c == null ? void 0 : c.id) ?? "",
      channelAccountId: t.id,
      visitorId: r,
      visitorToken: o,
      expiresAt: new Date(i * 1e3).toISOString()
    };
  }
  async sendVisitorMediaMessage(e) {
    const { conversationId: t, claims: n } = await this.ensureConversation(e.token, e.conversationId || void 0), a = await this.channels.getAccount(n.channelAccountId), r = e.clientMessageId ? `widget:${n.visitorId}:${e.clientMessageId}` : V("widget_evt"), i = await this.messages.findByExternalMessageId(a.id, r);
    if (i)
      return {
        conversationId: i.conversationId,
        inboundMessage: Qe(i),
        aiMessage: null,
        duplicate: !0
      };
    const o = V("msg"), c = await this.media.storeUpload({
      conversationId: t,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage({
      channelAccount: a,
      inbound: {
        externalMessageId: r,
        externalContactId: n.visitorId,
        externalThreadId: n.visitorId,
        contactName: n.contactName,
        isAnonymous: n.isAnonymous,
        messageType: c.messageType,
        content: di(e.content),
        attachments: [c.attachment],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: D()
      },
      messageId: o
    }, { createAiReply: !1 });
    return d.duplicate || await this.notifyVisitorMessageResult(d), {
      conversationId: d.conversationId,
      inboundMessage: Qe(d.inboundMessage),
      aiMessage: null,
      duplicate: d.duplicate
    };
  }
  async sendVisitorMessage(e, t = {}) {
    const { conversationId: n, claims: a } = await this.ensureConversation(e.token, e.conversationId || void 0), r = await this.channels.getAccount(a.channelAccountId), i = await this.conversationService.receiveInboundMessage({
      channelAccount: r,
      inbound: {
        externalMessageId: e.clientMessageId ? `widget:${a.visitorId}:${e.clientMessageId}` : V("widget_evt"),
        externalContactId: a.visitorId,
        externalThreadId: a.visitorId,
        contactName: a.contactName,
        isAnonymous: a.isAnonymous,
        messageType: "text",
        content: e.content.trim(),
        attachments: [],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: D()
      }
    }, { createAiReply: t.createAiReply });
    return i.aiMessage && await this.messages.markSent(i.aiMessage.id, i.aiMessage.id), t.notifyRealtime !== !1 && await this.notifyVisitorMessageResult(i), {
      conversationId: i.conversationId,
      inboundMessage: Qe(i.inboundMessage),
      aiMessage: i.aiMessage ? Qe({ ...i.aiMessage, status: "sent" }) : null,
      duplicate: i.duplicate
    };
  }
  async completeVisitorMessage(e) {
    try {
      const t = await this.conversations.findById(e.conversationId), n = await this.messages.findById(e.inboundMessageId);
      if (!t || !n || n.conversationId !== t.id) return;
      await this.realtime.notifyMessageCreated({
        conversation: t,
        message: n
      });
      const a = await this.conversationService.createAiReply({
        conversationId: t.id,
        channelAccountId: t.channelAccountId,
        messageContent: n.content,
        handoffStatus: t.handoffStatus
      });
      if (!a) return;
      await this.messages.markSent(a.id, a.id);
      const r = await this.conversations.findById(t.id) ?? t;
      await this.realtime.notifyMessageCreated({
        conversation: r,
        message: { ...a, status: "sent" }
      });
    } catch (t) {
      je.warn("widget_message_background_failed", {
        conversationId: e.conversationId,
        inboundMessageId: e.inboundMessageId,
        error: t instanceof Error ? t.message : String(t)
      });
    }
  }
  async ensureConversation(e, t) {
    const n = await this.verifyToken(e), a = await this.channels.getAccount(n.channelAccountId);
    if (this.assertWebChatChannel(a), !n.isAnonymous && !await this.endUsers.findById(n.visitorId))
      throw new m("END_USER_NOT_FOUND", "End user not found", 401);
    if (t && t !== "_") {
      const i = await this.conversations.findById(t);
      if (!i)
        throw new m("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
      if (i.channelAccountId !== n.channelAccountId || i.externalContactId !== n.visitorId)
        throw new m("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
      return { conversationId: t, claims: n };
    }
    return { conversationId: (await this.conversations.findOrCreateByExternalThread({
      channelAccountId: a.id,
      externalContactId: n.visitorId,
      externalThreadId: n.visitorId,
      contactName: n.contactName,
      isAnonymous: n.isAnonymous
    })).id, claims: n };
  }
  async notifyVisitorMessageResult(e) {
    const t = e.duplicate ? null : await this.conversations.findById(e.conversationId);
    t && (await this.realtime.notifyMessageCreated({
      conversation: t,
      message: e.inboundMessage
    }), e.aiMessage && await this.realtime.notifyMessageCreated({
      conversation: t,
      message: { ...e.aiMessage, status: "sent" }
    }));
  }
  async listMessages(e) {
    return await this.verifyConversationAccess(e.conversationId, e.token), (await this.messages.listByConversationAfter(e.conversationId, e.afterMessageId, 100)).map(Qe);
  }
  requireConversationAccess(e, t) {
    return this.verifyConversationAccess(e, t);
  }
  assertWebChatChannel(e) {
    if (e.channelType !== "web_chat")
      throw new m("CHANNEL_NOT_WEB_CHAT", "Channel is not a Web Chat channel", 400);
    if (e.status !== "active")
      throw new m("CHANNEL_INACTIVE", "Channel is not active", 400);
  }
  async verifyConversationAccess(e, t) {
    const n = await this.verifyToken(t), a = await this.conversations.findById(e);
    if (!a)
      throw new m("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (a.channelAccountId !== n.channelAccountId || a.externalContactId !== n.visitorId || a.externalThreadId !== n.visitorId)
      throw new m("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
    return n;
  }
  async signToken(e) {
    const t = se(JSON.stringify(e)), n = await Fe(this.tokenSecret, t);
    return `${t}.${n}`;
  }
  async verifyToken(e) {
    const [t, n] = e.split(".");
    if (!t || !n)
      throw new m("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const a = await Fe(this.tokenSecret, t);
    if (!ht(n, a))
      throw new m("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const r = JSON.parse(Es(t));
    if (!r.version || !r.channelAccountId || !r.visitorId || !r.contactName || r.isAnonymous === void 0 || !r.exp)
      throw new m("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    if (r.exp < Math.floor(Date.now() / 1e3))
      throw new m("VISITOR_TOKEN_EXPIRED", "Visitor token has expired", 401);
    return r;
  }
}
function ci(s) {
  const e = s.trim().slice(0, 128);
  if (!e)
    throw new m("VISITOR_ID_INVALID", "Visitor id cannot be empty", 400);
  return e;
}
function di(s) {
  return (s == null ? void 0 : s.trim()) ?? "";
}
function E(s) {
  const e = new rr([new cr(), new dr(), new Mn(), new yr()]), t = new Rr(s.DB), n = new Cr(s.DB), a = new Wr(s.DB), r = new Dr(s.DB), i = new Yr(s.DB), o = s.KB_INSTANCE_NAME ?? "supportly-dev", c = new _r(s.AI_SEARCH.get(o), o), d = new Er(s.AI, s), l = new Sr(c, d, a), h = new Nr(t, e), b = new Or(n, a, l), x = new Gr(s), O = new Br(s.MEDIA_BUCKET, a), F = new Zr(
    h,
    n,
    a,
    x,
    O
  ), N = new Lr(r, c), z = new Qr(i, s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"), M = new si(s.DB), P = new ai(
    M,
    s.END_USER_JWT_SECRET ?? "supportly-dev-enduser-secret-change-before-deploy"
  ), Se = new oi(
    h,
    n,
    a,
    b,
    x,
    O,
    M,
    s.WIDGET_TOKEN_SECRET ?? s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
  ), gt = new Ur(
    h,
    n,
    a,
    b,
    x,
    O,
    M,
    P,
    s.WIDGET_TOKEN_SECRET ?? s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
  );
  return {
    adapters: e,
    channels: h,
    conversations: b,
    messages: F,
    media: O,
    realtime: x,
    knowledge: N,
    auth: z,
    endUserAuth: P,
    widget: Se,
    forum: gt
  };
}
function Mt() {
  return async (s, e) => {
    const t = s.req.header("x-admin-user-id"), n = s.req.header("authorization"), r = await E(s.env).auth.requireAdminUser({ adminUserId: t, authorization: n });
    s.set("adminUserId", r.id), s.set("adminUser", {
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role
    }), await e();
  };
}
function S(s, e) {
  return Response.json({ data: s }, e);
}
function Ut(s) {
  return S(s, { status: 201 });
}
function li() {
  return new Response(null, { status: 204 });
}
const qe = new de();
qe.get("/ws", async (s) => {
  var o, c;
  ui(s.req.raw);
  const e = E(s.env), t = (o = s.req.query("token")) == null ? void 0 : o.trim(), n = await e.auth.requireAdminUser({
    adminUserId: ((c = s.req.query("adminUserId")) == null ? void 0 : c.trim()) || s.req.header("x-admin-user-id"),
    authorization: t ? `Bearer ${t}` : s.req.header("authorization")
  }), a = s.env.ADMIN_STREAM.idFromName("admin"), r = s.env.ADMIN_STREAM.get(a), i = hi(s.req.raw, {
    "x-supportly-admin-user-id": n.id
  });
  return r.fetch(i);
});
qe.use("*", Mt());
qe.get("/", (s) => S({ ok: !0 }));
qe.get("/end-users", async (s) => {
  const e = E(s.env);
  return S(await e.endUserAuth.listUsers());
});
qe.post("/end-users/:id/approve", async (s) => {
  const e = E(s.env);
  return S(await e.endUserAuth.approveUser(s.req.param("id")));
});
qe.post("/end-users/:id/deactivate", async (s) => (await E(s.env).endUserAuth.deactivateUser(s.req.param("id")), S({ deactivated: !0 })));
function ui(s) {
  var e;
  if (((e = s.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new m("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function hi(s, e) {
  const t = new URL(s.url);
  t.searchParams.delete("token"), t.searchParams.delete("adminUserId");
  const n = new Headers(s.headers);
  n.delete("authorization"), n.delete("x-admin-user-id");
  for (const [a, r] of Object.entries(e))
    n.set(a, r);
  return new Request(t.toString(), {
    method: s.method,
    headers: n
  });
}
const ft = new de(), fi = L({
  email: g().email(),
  password: g().min(1)
});
ft.post("/login", async (s) => {
  const e = fi.parse(await s.req.json()), t = E(s.env);
  return S(await t.auth.login(e.email, e.password));
});
ft.get("/me", Mt(), (s) => S(s.get("adminUser")));
const mi = L({
  username: g().trim().min(2).max(50),
  password: g().min(6).max(128),
  email: g().email().optional(),
  displayName: g().trim().max(100).optional()
}), pi = L({
  username: g().trim().min(1),
  password: g().min(1)
});
ft.post("/end-user/register", async (s) => {
  const e = mi.parse(await s.req.json()), t = E(s.env);
  return S(await t.endUserAuth.register(e));
});
ft.post("/end-user/login", async (s) => {
  const e = pi.parse(await s.req.json()), t = E(s.env);
  return S(await t.endUserAuth.login(e.username, e.password));
});
ft.get("/end-user/me", async (s) => {
  const t = await E(s.env).endUserAuth.requireEndUser(s.req.header("authorization"));
  return S({
    id: t.id,
    username: t.username,
    displayName: t.displayName,
    email: t.email
  });
});
const gi = L({
  channelType: xs(["custom_webhook", "telegram", "whatsapp", "wechat", "web_chat", "forum"]),
  displayName: g().min(1),
  externalAccountId: g().optional(),
  credentialCiphertext: g().optional(),
  webhookSecretCiphertext: g().optional(),
  outboundUrl: g().url().optional()
}), Dn = L({
  webhookUrl: g().url().optional(),
  dropPendingUpdates: K().optional()
}), mt = new de();
mt.use("*", Mt());
mt.get("/", async (s) => {
  const e = E(s.env);
  return S((await e.channels.listAccounts()).map(Ln));
});
mt.post("/", async (s) => {
  const e = gi.parse(await s.req.json()), t = E(s.env);
  return Ut(Ln(await t.channels.createAccount(e)));
});
mt.post("/:id/telegram/set-webhook", async (s) => {
  const e = Dn.parse(await s.req.json().catch(() => ({}))), t = E(s.env), n = await t.channels.getAccount(s.req.param("id")), a = Pn(t.channels.getAdapter(n));
  return S(
    await a.setWebhook(n, {
      webhookUrl: e.webhookUrl ?? jn(s.req.url, n.id),
      dropPendingUpdates: e.dropPendingUpdates
    })
  );
});
mt.post("/:id/telegram/test", async (s) => {
  const e = Dn.pick({ webhookUrl: !0 }).parse(await s.req.json().catch(() => ({}))), t = E(s.env), n = await t.channels.getAccount(s.req.param("id")), a = Pn(t.channels.getAdapter(n));
  return S(await a.testConnection(n, e.webhookUrl ?? jn(s.req.url, n.id)));
});
function Ln(s) {
  return {
    ...s,
    credentialCiphertext: null
  };
}
function Pn(s) {
  if (s instanceof Mn) return s;
  throw new m("CHANNEL_NOT_TELEGRAM", "Channel is not a Telegram channel", 400);
}
function jn(s, e) {
  return `${new URL(s).origin}/webhooks/${e}`;
}
const yi = L({
  clientMessageId: g().trim().min(1).max(128).optional(),
  content: g().min(1)
}), _i = L({
  status: xs(["bot", "agent"])
}), le = new de();
le.get("/:id/messages/:messageId/attachments/:index", async (s) => {
  var n, a;
  const e = E(s.env), t = (n = s.req.query("token")) == null ? void 0 : n.trim();
  return await e.auth.requireAdminUser({
    adminUserId: ((a = s.req.query("adminUserId")) == null ? void 0 : a.trim()) || s.req.header("x-admin-user-id"),
    authorization: t ? `Bearer ${t}` : s.req.header("authorization")
  }), e.media.getMessageAttachmentResponse({
    conversationId: s.req.param("id"),
    messageId: s.req.param("messageId"),
    attachmentIndex: wi(s.req.param("index")),
    request: s.req.raw
  });
});
le.use("*", Mt());
le.get("/", async (s) => {
  const e = E(s.env);
  return s.req.query("status") === "resolved" ? S(await e.conversations.listResolvedConversations()) : S(await e.conversations.listOpenConversations());
});
le.get("/:id", async (s) => {
  const e = E(s.env);
  return S(await e.conversations.getConversation(s.req.param("id")));
});
le.get("/:id/messages", async (s) => {
  const e = E(s.env);
  return S(await e.messages.listConversationMessages(s.req.param("id"), s.req.query("after") || void 0));
});
le.post("/:id/messages", async (s) => {
  const e = yi.parse(await s.req.json()), t = E(s.env);
  return S(
    await t.messages.sendAgentMessage({
      conversationId: s.req.param("id"),
      adminUserId: s.get("adminUserId"),
      clientMessageId: e.clientMessageId,
      content: e.content
    })
  );
});
le.post("/:id/messages/media", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!vi(t))
    throw new m("VALIDATION_ERROR", "file is required", 400);
  const n = E(s.env);
  return S(
    await n.messages.sendAgentMediaMessage({
      conversationId: s.req.param("id"),
      adminUserId: s.get("adminUserId"),
      clientMessageId: Ft(e, "clientMessageId", 128),
      content: Ft(e, "content", 2e3),
      file: t,
      fileName: Ft(e, "fileName", 300),
      mimeType: Ft(e, "mimeType", 100)
    })
  );
});
le.post("/:id/handoff", async (s) => {
  const e = _i.parse(await s.req.json()), t = E(s.env);
  return S(await t.conversations.setHandoff(s.req.param("id"), e.status));
});
le.post("/:id/resolve", async (s) => {
  const e = E(s.env);
  return S(await e.conversations.resolve(s.req.param("id")));
});
function vi(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
function Ft(s, e, t) {
  const n = s.get(e);
  if (typeof n != "string") return;
  const a = n.trim();
  if (a) {
    if (a.length > t)
      throw new m("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
function wi(s) {
  const e = Number(s);
  if (!Number.isInteger(e) || e < 0)
    throw new m("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
const $n = new de();
$n.get("/", (s) => s.json({ ok: !0 }));
const pt = new de();
pt.use("*", Mt());
function Ii(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "arrayBuffer" in s;
}
pt.get("/documents", async (s) => {
  const e = E(s.env);
  return S(await e.knowledge.listDocuments());
});
pt.post("/documents", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!Ii(t))
    throw new m("VALIDATION_ERROR", "file is required", 400);
  const n = e.get("title"), a = E(s.env);
  return Ut(
    await a.knowledge.uploadDocument({
      file: t,
      title: typeof n == "string" ? n : void 0,
      createdByAdminUserId: s.get("adminUserId")
    })
  );
});
pt.post("/sync/ai-search", async (s) => {
  const e = E(s.env);
  return S(await e.knowledge.syncFromAiSearch());
});
pt.delete("/documents/:id", async (s) => (await E(s.env).knowledge.deleteDocument(s.req.param("id")), li()));
const Bn = new de();
Bn.post("/:channelAccountId", async (s) => {
  const e = s.req.query("debug") === "1" || s.req.header("x-debug-response") === "true", t = E(s.env), n = await t.channels.getAccount(s.req.param("channelAccountId")), a = t.channels.getAdapter(n);
  await a.verify(s.req.raw.clone(), n);
  const r = await a.parseInbound(s.req.raw.clone(), n);
  let i = 0, o = 0, c = 0, d = 0;
  const l = [];
  for (const b of r) {
    const x = await t.conversations.receiveInboundMessage({ channelAccount: n, inbound: b });
    let O = !1, F;
    if (x.duplicate ? o += 1 : i += 1, x.aiMessage) {
      c += 1;
      try {
        const N = await a.sendMessage(n, {
          conversationId: x.conversationId,
          externalThreadId: b.externalThreadId,
          messageId: x.aiMessage.id,
          messageType: "text",
          content: x.aiMessage.content ?? ""
        });
        await t.messages.markSent(x.aiMessage.id, N.externalMessageId), O = !0, je.info("ai_reply_sent", {
          requestId: s.get("requestId"),
          conversationId: x.conversationId,
          messageId: x.aiMessage.id,
          externalMessageId: N.externalMessageId
        });
      } catch (N) {
        await t.messages.markFailed(
          x.aiMessage.id,
          N instanceof Error ? N.message : "AI reply send failed"
        ), d += 1, F = N instanceof Error ? N.message : String(N), je.warn("ai_reply_send_failed", {
          requestId: s.get("requestId"),
          conversationId: x.conversationId,
          messageId: x.aiMessage.id,
          error: N instanceof Error ? N.message : String(N)
        });
      }
    }
    e && l.push({
      conversationId: x.conversationId,
      inboundMessageId: x.inboundMessage.id,
      duplicate: x.duplicate,
      aiMessage: x.aiMessage ? {
        id: x.aiMessage.id,
        content: x.aiMessage.content,
        status: O ? "sent" : x.aiMessage.status
      } : null,
      aiReplySent: O,
      aiReplySendError: F
    });
  }
  const h = {
    received: r.length,
    accepted: i,
    duplicates: o,
    aiReplies: c,
    aiReplySendFailures: d
  };
  return S(e ? { ...h, results: l } : h);
});
const Ai = L({
  channelAccountId: g().min(1),
  visitorId: g().min(1).max(128),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional()
}), bi = L({
  clientMessageId: g().trim().min(1).max(128).optional(),
  content: g().trim().min(1).max(2e3),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional()
}), He = new de();
He.get("/ws", async (s) => {
  var o;
  xi(s.req.raw);
  const e = (o = s.req.query("conversationId")) == null ? void 0 : o.trim();
  if (!e)
    throw new m("CONVERSATION_ID_REQUIRED", "Conversation id is required", 400);
  const n = await E(s.env).widget.requireConversationAccess(e, Fn(s.req.raw, s.req.query("token"))), a = s.env.VISITOR_STREAM.idFromName(e), r = s.env.VISITOR_STREAM.get(a), i = ki(s.req.raw, {
    "x-supportly-conversation-id": e,
    "x-supportly-visitor-id": n.visitorId
  });
  return r.fetch(i);
});
He.post("/conversations", async (s) => {
  const e = Ai.parse(await s.req.json()), t = E(s.env), n = s.req.header("authorization"), a = n ? await t.endUserAuth.requireEndUser(n) : null;
  return Ut(await t.widget.createSession({
    ...e,
    endUserId: a == null ? void 0 : a.id,
    endUserName: a == null ? void 0 : a.displayName
  }));
});
He.post("/conversations/:conversationId/messages", async (s) => {
  const e = bi.parse(await s.req.json()), t = E(s.env), n = await t.widget.sendVisitorMessage(
    {
      conversationId: s.req.param("conversationId"),
      token: ss(s.req.raw),
      clientMessageId: e.clientMessageId,
      content: e.content,
      pageUrl: e.pageUrl,
      pageTitle: e.pageTitle
    },
    { createAiReply: !1, notifyRealtime: !1 }
  );
  return n.duplicate || s.executionCtx.waitUntil(
    t.widget.completeVisitorMessage({
      conversationId: n.conversationId,
      inboundMessageId: n.inboundMessage.id
    })
  ), S(n);
});
He.post("/conversations/:conversationId/messages/media", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!Ei(t))
    throw new m("VALIDATION_ERROR", "file is required", 400);
  const a = await E(s.env).widget.sendVisitorMediaMessage({
    conversationId: s.req.param("conversationId"),
    token: ss(s.req.raw),
    clientMessageId: ze(e, "clientMessageId", 128),
    content: ze(e, "content", 2e3),
    file: t,
    fileName: ze(e, "fileName", 300),
    mimeType: ze(e, "mimeType", 100),
    pageUrl: ze(e, "pageUrl", 2048),
    pageTitle: ze(e, "pageTitle", 300)
  });
  return S(a);
});
He.get("/conversations/:conversationId/messages", async (s) => {
  const e = E(s.env), t = s.req.param("conversationId");
  return S(!t || t === "_" ? { messages: [] } : {
    messages: await e.widget.listMessages({
      conversationId: t,
      token: ss(s.req.raw),
      afterMessageId: s.req.query("after") || void 0
    })
  });
});
He.get("/conversations/:conversationId/messages/:messageId/attachments/:index", async (s) => {
  const e = E(s.env), t = s.req.param("conversationId");
  return await e.widget.requireConversationAccess(t, Fn(s.req.raw, s.req.query("token"))), e.media.getMessageAttachmentResponse({
    conversationId: t,
    messageId: s.req.param("messageId"),
    attachmentIndex: Ti(s.req.param("index")),
    request: s.req.raw
  });
});
function ss(s) {
  const e = s.headers.get("authorization"), t = "Bearer ";
  if (!(e != null && e.startsWith(t)))
    throw new m("VISITOR_TOKEN_REQUIRED", "Visitor token is required", 401);
  return e.slice(t.length).trim();
}
function Fn(s, e) {
  return e != null && e.trim() ? e.trim() : ss(s);
}
function xi(s) {
  var e;
  if (((e = s.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new m("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function Ei(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
function ze(s, e, t) {
  const n = s.get(e);
  if (typeof n != "string") return;
  const a = n.trim();
  if (a) {
    if (a.length > t)
      throw new m("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
function Ti(s) {
  const e = Number(s);
  if (!Number.isInteger(e) || e < 0)
    throw new m("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function ki(s, e) {
  const t = new URL(s.url);
  t.searchParams.delete("token");
  const n = new Headers(s.headers);
  n.delete("authorization");
  for (const [a, r] of Object.entries(e))
    n.set(a, r);
  return new Request(t.toString(), {
    method: s.method,
    headers: n
  });
}
const Si = L({
  channelAccountId: g().min(1),
  visitorId: g().min(1).max(128),
  title: g().trim().min(1).max(200),
  content: g().trim().min(1).max(5e4),
  category: g().max(30).optional(),
  tags: bs(g().max(30)).max(5).optional(),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional(),
  endUserToken: g().optional()
}), Ri = L({
  visitorId: g().min(1).max(128),
  content: g().trim().min(1).max(5e4),
  quotedMessageId: g().optional(),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional(),
  endUserToken: g().optional()
}), Ni = L({
  visitorId: g().min(1).max(128)
}), Ci = L({
  pin: K()
}), Oi = L({
  feature: K()
}), ne = new de();
ne.get("/config", async (s) => {
  const e = s.env.FORUM_CHANNEL_ID;
  if (!e)
    throw new m("FORUM_NOT_FOUND", "FORUM_CHANNEL_ID not configured", 404);
  return S({
    channelId: e,
    title: s.env.FORUM_TITLE || "社区论坛",
    primaryColor: s.env.FORUM_PRIMARY_COLOR || "#2563eb",
    categories: (s.env.FORUM_CATEGORIES || "综合讨论,技术交流,问题反馈,资源分享,公告通知").split(",").map((t) => t.trim())
  });
});
ne.get("/channels/:channelAccountId/topics", async (s) => {
  const e = E(s.env), t = an(s.req.query("limit"), 50), n = an(s.req.query("offset"), 0);
  return S(
    await e.forum.listTopics({
      channelAccountId: s.req.param("channelAccountId"),
      limit: t,
      offset: n,
      search: s.req.query("search") || void 0,
      sortBy: s.req.query("sort") || void 0,
      tag: s.req.query("tag") || void 0,
      category: s.req.query("category") || void 0
    })
  );
});
ne.post("/channels/:channelAccountId/topics", async (s) => {
  const e = Si.parse(await s.req.json()), t = E(s.env);
  return Ut(await t.forum.createTopic(e));
});
ne.post("/topics/:conversationId/replies", async (s) => {
  const e = Ri.parse(await s.req.json()), t = E(s.env);
  return Ut(
    await t.forum.sendReply({
      conversationId: s.req.param("conversationId"),
      ...e
    })
  );
});
ne.get("/topics/:conversationId/messages", async (s) => {
  const e = E(s.env), t = s.req.param("conversationId");
  return S(!t || t === "_" ? { messages: [] } : await e.forum.listMessages({
    conversationId: t,
    afterMessageId: s.req.query("after") || void 0
  }));
});
ne.post("/topics/:conversationId/like", async (s) => {
  const e = Ni.parse(await s.req.json()), t = E(s.env);
  return S(
    await t.forum.likeTopic({
      conversationId: s.req.param("conversationId"),
      visitorId: e.visitorId
    })
  );
});
ne.post("/topics/:conversationId/pin", async (s) => {
  const e = Ci.parse(await s.req.json()), t = E(s.env);
  return S(
    await t.forum.togglePin({
      conversationId: s.req.param("conversationId"),
      pin: e.pin
    })
  );
});
ne.post("/topics/:conversationId/feature", async (s) => {
  const e = Oi.parse(await s.req.json()), t = E(s.env);
  return S(
    await t.forum.toggleFeatured({
      conversationId: s.req.param("conversationId"),
      feature: e.feature
    })
  );
});
ne.get("/users/:externalContactId/profile", async (s) => {
  const t = await E(s.env).forum.getUserProfile(
    s.req.param("externalContactId")
  );
  return S(t);
});
ne.get("/users/:externalContactId/notifications", async (s) => {
  const e = E(s.env);
  return S(
    await e.forum.getUserNotifications(
      s.req.param("externalContactId")
    )
  );
});
function an(s, e) {
  if (!s) return e;
  const t = parseInt(s, 10);
  return Number.isFinite(t) && t > 0 ? t : e;
}
const J = new de();
J.use("*", ar());
J.use(
  "*",
  ka({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Authorization",
      "Content-Type",
      "Range",
      "X-Admin-User-Id",
      "X-Debug-Response",
      "X-Request-Id",
      "X-Supportly-Signature",
      "X-Telegram-Bot-Api-Secret-Token"
    ],
    exposeHeaders: ["Accept-Ranges", "Content-Length", "Content-Range", "Content-Type", "X-Request-Id"],
    maxAge: 86400
  })
);
J.use("*", nr());
J.route("/health", $n);
J.route("/api/auth", ft);
J.route("/api/admin", qe);
J.route("/api/channels", mt);
J.route("/api/conversations", le);
J.route("/api/knowledge", pt);
J.route("/api/widget", He);
J.route("/api/forum", ne);
J.route("/webhooks", Bn);
J.onError((s, e) => Rn(s, e));
J.notFound((s) => s.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, 404));
class Ui {
  constructor(e, t) {
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var n;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      Je(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        Je(e, { type: "pong", serverTime: D() });
        return;
      }
      Je(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      Je(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const t = e.headers.get("x-supportly-admin-user-id");
    if (!t)
      return new Response("Missing admin identity", { status: 400 });
    const n = new WebSocketPair(), a = n[0], r = n[1], i = {
      kind: "admin",
      adminUserId: t,
      connectedAt: D()
    };
    return r.serializeAttachment(i), this.state.acceptWebSocket(r), Je(r, { type: "connected", connectionKind: "admin", serverTime: D() }), new Response(null, { status: 101, webSocket: a });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return !t || t.type !== "message.new" && t.type !== "conversation.updated" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(t), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const t of this.state.getWebSockets())
      Je(t, e);
  }
}
function Je(s, e) {
  if (s.readyState === 1)
    try {
      s.send(JSON.stringify(e));
    } catch {
      s.close(1011, "Send failed");
    }
}
class Di {
  constructor(e, t) {
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var n;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      Ke(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        Ke(e, { type: "pong", serverTime: D() });
        return;
      }
      Ke(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      Ke(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const t = e.headers.get("x-supportly-conversation-id"), n = e.headers.get("x-supportly-visitor-id");
    if (!t || !n)
      return new Response("Missing connection identity", { status: 400 });
    const a = new WebSocketPair(), r = a[0], i = a[1], o = {
      kind: "visitor",
      conversationId: t,
      visitorId: n,
      connectedAt: D()
    };
    return i.serializeAttachment(o), this.state.acceptWebSocket(i), Ke(i, { type: "connected", connectionKind: "visitor", serverTime: D() }), new Response(null, { status: 101, webSocket: r });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return !t || t.type !== "message.new" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(t), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const t of this.state.getWebSockets())
      Ke(t, e);
  }
}
function Ke(s, e) {
  if (s.readyState === 1)
    try {
      s.send(JSON.stringify(e));
    } catch {
      s.close(1011, "Send failed");
    }
}
export {
  Ui as AdminStream,
  Di as VisitorStream,
  J as default
};
