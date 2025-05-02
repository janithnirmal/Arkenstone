import{r as s,j as c}from"./app-B9KEgK-f.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),i=(...e)=>e.filter((r,t,o)=>!!r&&r.trim()!==""&&o.indexOf(r)===t).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var f={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=s.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:t=2,absoluteStrokeWidth:o,className:a="",children:n,iconNode:l,...u},m)=>s.createElement("svg",{ref:m,...f,width:r,height:r,stroke:e,strokeWidth:o?Number(t)*24/Number(r):t,className:i("lucide",a),...u},[...l.map(([p,d])=>s.createElement(p,d)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=(e,r)=>{const t=s.forwardRef(({className:o,...a},n)=>s.createElement(w,{ref:n,iconNode:r,className:i(`lucide-${x(e)}`,o),...a}));return t.displayName=`${e}`,t};function j(e){return c.jsx(c.Fragment,{children:c.jsx("span",{className:"text-7xl animate-pulse",children:"💎"})})}export{j as A,h as c};
