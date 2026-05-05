import 'piccolore';
import { j as decodeKey } from './chunks/astro/server_DF2SGbME.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CfUnM1AI.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/Dev/beluca.ne/","cacheDir":"file:///D:/Dev/beluca.ne/node_modules/.astro/","outDir":"file:///D:/Dev/beluca.ne/dist/","srcDir":"file:///D:/Dev/beluca.ne/src/","publicDir":"file:///D:/Dev/beluca.ne/public/","buildClientDir":"file:///D:/Dev/beluca.ne/dist/client/","buildServerDir":"file:///D:/Dev/beluca.ne/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"og.png","links":[],"scripts":[],"styles":[],"routeData":{"route":"/og.png","isIndex":false,"type":"endpoint","pattern":"^\\/og\\.png\\/?$","segments":[[{"content":"og.png","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/og.png.ts","pathname":"/og.png","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"writing/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/writing","isIndex":true,"type":"page","pattern":"^\\/writing\\/?$","segments":[[{"content":"writing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/writing/index.astro","pathname":"/writing","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/agent","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/agent\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"agent","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/agent.ts","pathname":"/api/agent","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://beluca.me","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/Dev/beluca.ne/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["D:/Dev/beluca.ne/src/pages/writing/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["D:/Dev/beluca.ne/src/pages/writing/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["D:/Dev/beluca.ne/src/components/Writing.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/writing/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/Dev/beluca.ne/src/pages/writing/[slug]/og.png.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/writing/[slug]/og.png@_@ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/writing/index@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/agent@_@ts":"pages/api/agent.astro.mjs","\u0000@astro-page:src/pages/og.png@_@ts":"pages/og.png.astro.mjs","\u0000@astro-page:src/pages/writing/[slug]/og.png@_@ts":"pages/writing/_slug_/og.png.astro.mjs","\u0000@astro-page:src/pages/writing/index@_@astro":"pages/writing.astro.mjs","\u0000@astro-page:src/pages/writing/[...slug]@_@astro":"pages/writing/_---slug_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BICT0Zuu.mjs","D:/Dev/beluca.ne/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DMMFv34H.mjs","D:\\Dev\\beluca.ne\\.astro\\content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","D:\\Dev\\beluca.ne\\.astro\\content-modules.mjs":"chunks/content-modules_B9QuZHtE.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_da4e-crd.mjs","D:/Dev/beluca.ne/src/content/blog/boring-aws-for-not-boring-ai.mdx?astroPropagatedAssets":"chunks/boring-aws-for-not-boring-ai_9gp-03bu.mjs","D:/Dev/beluca.ne/src/content/blog/notes-from-architecting-c-level.mdx?astroPropagatedAssets":"chunks/notes-from-architecting-c-level_CqySAd64.mjs","D:/Dev/beluca.ne/src/content/blog/tool-calling-rpc-with-anxiety.mdx?astroPropagatedAssets":"chunks/tool-calling-rpc-with-anxiety_CcM3N59-.mjs","D:/Dev/beluca.ne/src/content/blog/rag-retrieval-bad.mdx?astroPropagatedAssets":"chunks/rag-retrieval-bad_1onN62be.mjs","D:/Dev/beluca.ne/src/content/blog/boring-aws-for-not-boring-ai.mdx":"chunks/boring-aws-for-not-boring-ai_3BgAOTHj.mjs","D:/Dev/beluca.ne/src/content/blog/notes-from-architecting-c-level.mdx":"chunks/notes-from-architecting-c-level_FboSmra1.mjs","D:/Dev/beluca.ne/src/content/blog/tool-calling-rpc-with-anxiety.mdx":"chunks/tool-calling-rpc-with-anxiety_r1Uo2vbW.mjs","D:/Dev/beluca.ne/src/content/blog/rag-retrieval-bad.mdx":"chunks/rag-retrieval-bad_BeecZ6Wa.mjs","D:/Dev/beluca.ne/src/components/Chat.tsx":"_astro/Chat.BeGNOyGJ.js","@astrojs/react/client.js":"_astro/client.BKmgAojr.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.CvMBL83R.css","/avatar.png","/favicon.svg","/robots.txt","/_astro/Chat.BeGNOyGJ.js","/_astro/client.BKmgAojr.js","/_astro/index.95d291e9.7JMnjoTa.js","/_astro/index.CdJzaNS0.js","/og.png","/writing/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"aTjB2+c9PhqYqNVJFg9sf6RPINmnKscCWwDNSQ25vZk="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
