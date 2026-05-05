import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bn0Kxd_7.mjs';
import { manifest } from './manifest_BICT0Zuu.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/agent.astro.mjs');
const _page2 = () => import('./pages/og.png.astro.mjs');
const _page3 = () => import('./pages/writing/_slug_/og.png.astro.mjs');
const _page4 = () => import('./pages/writing.astro.mjs');
const _page5 = () => import('./pages/writing/_---slug_.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/agent.ts", _page1],
    ["src/pages/og.png.ts", _page2],
    ["src/pages/writing/[slug]/og.png.ts", _page3],
    ["src/pages/writing/index.astro", _page4],
    ["src/pages/writing/[...slug].astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "1792917e-c7da-46d2-b805-bb7d7fc4e27f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
