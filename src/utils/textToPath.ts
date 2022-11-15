import { ElementNode, parse } from "svg-parser";
import { toHtml } from "hast-util-to-html";

const character_array: Record<string, string> = {
  0: "m3.6 0.1c-0.9 0-1.6-0.4-2-1.1s-0.7-1.9-0.7-3.3c0-2.9 0.9-4.4 2.7-4.4 0.9 0 1.6 0.4 2.1 1.1s0.7 1.8 0.7 3.3c-0.1 2.9-1 4.4-2.8 4.4zm0-0.9c0.6 0 1-0.3 1.3-0.8s0.4-1.4 0.4-2.7c0-1.2-0.1-2.1-0.4-2.7s-0.7-0.8-1.3-0.8c-0.6 0-1 0.3-1.3 0.8s-0.4 1.5-0.4 2.7c0 1.2 0.1 2.1 0.4 2.7s0.7 0.8 1.3 0.8z",
  1: "m4.4 0h-1v-5.3-2.1c-0.1 0.1-0.3 0.3-0.7 0.6l-0.8 0.7-0.6-0.7 2.2-1.8h0.9v8.6z",
  2: "m6.3 0h-5.4v-0.9l2.1-2.2c0.7-0.9 1.2-1.5 1.5-1.9s0.4-0.9 0.4-1.4c0-0.4-0.1-0.8-0.4-1s-0.6-0.4-1-0.4c-0.7 0-1.3 0.3-1.9 0.8l-0.6-0.7c0.8-0.7 1.6-1 2.5-1 0.8 0 1.4 0.2 1.8 0.6s0.7 1 0.7 1.7c0 0.5-0.1 0.9-0.3 1.4s-0.9 1.3-1.8 2.2l-1.7 1.8h4v1z",
  3: "m4.1-4.5c1.4 0.2 2.1 0.9 2.1 2.1 0 0.8-0.3 1.4-0.8 1.9s-1.3 0.6-2.4 0.6c-0.9 0-1.7-0.1-2.2-0.4v-1c0.7 0.3 1.4 0.5 2.2 0.5 1.4 0 2.1-0.6 2.1-1.7 0-1-0.7-1.5-2.2-1.5h-0.8v-0.9h0.8c0.6 0 1.1-0.1 1.4-0.4s0.5-0.7 0.5-1.2c0-0.4-0.1-0.7-0.4-0.9s-0.6-0.4-1-0.4c-0.7 0-1.4 0.2-2 0.7l-0.6-0.7c0.7-0.6 1.6-0.9 2.6-0.9 0.8 0 1.4 0.2 1.9 0.6s0.7 0.9 0.7 1.5c0 0.5-0.2 1-0.5 1.4s-0.8 0.6-1.4 0.7z",
  4: "m6.6-1.9h-1.3v1.9h-1v-1.9h-4v-0.9l3.9-5.8h1.1v5.7h1.2v1zm-2.3-1v-2.1c0-0.7 0-1.5 0.1-2.5h-0.1c-0.1 0.4-0.3 0.7-0.5 1l-2.4 3.6h2.9z",
  5: "m1-0.3v-1c0.6 0.3 1.3 0.5 2.1 0.5 1.3 0 2-0.6 2-1.8 0-1.1-0.7-1.7-2-1.7-0.3 0-0.8 0.1-1.4 0.2l-0.5-0.4 0.3-4h4v1h-3.1l-0.2 2.4c0.4-0.1 0.8-0.2 1.2-0.2 0.8 0 1.5 0.2 2 0.7s0.8 1.1 0.8 1.8c0 0.9-0.3 1.6-0.8 2.1s-1.3 0.8-2.3 0.8c-0.9 0-1.6-0.1-2.1-0.4z",
  6: "m5.7-8.6v0.9c-0.3-0.1-0.6-0.1-1-0.1-0.9 0-1.5 0.3-2 0.8s-0.7 1.4-0.7 2.6h0.1c0.4-0.7 1-1 1.8-1s1.4 0.2 1.8 0.7 0.6 1.1 0.6 1.9c0 0.9-0.2 1.6-0.7 2.1s-1.1 0.8-1.9 0.8c-0.9 0-1.5-0.3-2-1s-0.8-1.6-0.8-2.8c0-3.4 1.2-5 3.7-5 0.5 0 0.8 0 1.1 0.1zm-0.4 5.8c0-0.6-0.1-1-0.4-1.3s-0.7-0.4-1.2-0.4-0.9 0.1-1.2 0.5-0.5 0.6-0.5 1c0 0.6 0.2 1.1 0.5 1.5s0.7 0.6 1.2 0.6c0.5 0 0.9-0.2 1.2-0.5s0.4-0.7 0.4-1.4z",
  7: "m2 0l3.3-7.6h-4.5v-1h5.5v0.8l-3.2 7.8h-1.1z",
  8: "m4.5-4.5c1.2 0.6 1.8 1.4 1.8 2.3 0 0.7-0.3 1.2-0.8 1.7s-1.1 0.6-2 0.6c-0.8 0-1.5-0.2-2-0.6s-0.7-1-0.7-1.7c0-1 0.6-1.8 1.7-2.3-0.9-0.6-1.3-1.3-1.3-2.2 0-0.6 0.2-1.1 0.7-1.5s1-0.6 1.7-0.6c0.7 0 1.3 0.2 1.7 0.6s0.7 0.9 0.7 1.6c0 0.9-0.5 1.6-1.5 2.1zm-1.1 0.4c-0.9 0.5-1.4 1.1-1.4 1.9 0 0.9 0.5 1.4 1.6 1.4 0.5 0 0.9-0.1 1.2-0.4s0.4-0.6 0.4-1.1c0-0.4-0.1-0.7-0.4-0.9s-0.6-0.5-1.2-0.8l-0.2-0.1zm0.2-0.9c0.9-0.4 1.4-0.9 1.4-1.6 0-0.4-0.2-0.7-0.4-0.9s-0.6-0.3-1-0.3c-0.4 0-0.7 0.1-1 0.3s-0.4 0.5-0.4 0.9c0 0.4 0.1 0.6 0.3 0.9s0.6 0.5 1.1 0.7z",
  9: "m1.5 0v-0.9c0.3 0.1 0.6 0.1 1 0.1 0.9 0 1.5-0.3 2-0.8s0.7-1.4 0.7-2.6h-0.1c-0.4 0.7-1 1-1.8 1-0.7 0-1.3-0.2-1.8-0.7s-0.6-1.1-0.6-1.9c0-0.9 0.2-1.6 0.7-2.1s1.1-0.8 1.9-0.8c0.9 0 1.5 0.3 2 1s0.8 1.6 0.8 2.8c0 3.4-1.2 5-3.7 5-0.5 0-0.8 0-1.1-0.1zm0.4-5.8c0 0.6 0.1 1 0.4 1.3s0.7 0.5 1.2 0.5 0.9-0.2 1.2-0.5 0.5-0.7 0.5-1.1c0-0.6-0.2-1.1-0.5-1.5s-0.7-0.7-1.2-0.7c-0.5 0-0.9 0.2-1.2 0.5s-0.4 0.9-0.4 1.5z",
  A: "m5.9 0l-0.9-2.7h-2.8l-0.9 2.7h-1.1l2.8-8.6h1.1l2.9 8.6h-1.1zm-1.2-3.6l-0.8-2.5c-0.1-0.5-0.2-0.9-0.3-1.3-0.1 0.4-0.2 0.7-0.3 1l-0.8 2.8h2.2z",
  B: "m0.8-8.6h2.6c1.1 0 1.8 0.2 2.3 0.5s0.7 0.9 0.7 1.7c0 0.5-0.2 0.9-0.5 1.2s-0.7 0.6-1.2 0.7v0.1c1.3 0.2 1.9 0.9 1.9 2 0 0.8-0.2 1.4-0.7 1.8s-1.2 0.6-2 0.6h-3.1v-8.6zm1.1 3.7h1.7c0.6 0 1.1-0.1 1.3-0.3s0.4-0.6 0.4-1.1c0-0.5-0.1-0.8-0.4-1s-0.8-0.3-1.5-0.3h-1.5v2.7zm0 0.9v3.1h1.8c1.2 0 1.8-0.5 1.8-1.6 0-1-0.6-1.5-1.9-1.5h-1.7z",
  C: "m6.6-1.2v0.9c-0.6 0.3-1.3 0.4-2.1 0.4-1.2 0-2.1-0.4-2.8-1.1s-1-1.9-1-3.3c0-1.4 0.3-2.4 1-3.2s1.7-1.2 2.9-1.2c0.9 0 1.6 0.2 2.2 0.5l-0.3 0.9c-0.6-0.3-1.2-0.4-1.8-0.4-0.8 0-1.5 0.3-2 0.9s-0.8 1.5-0.8 2.5c0 1.1 0.2 2 0.7 2.6s1.2 0.9 2.1 0.9c0.5 0 1.1-0.2 1.9-0.4z",
  D: "m0.8 0v-8.6h2c1.2 0 2.2 0.4 2.9 1.1s1 1.8 1 3.1c0 1.4-0.4 2.5-1.1 3.2s-1.7 1.2-3 1.2h-1.8zm1.1-7.6v6.7h0.6c2.1 0 3.1-1.1 3.1-3.4 0-2.2-1-3.3-2.9-3.3h-0.8z",
  E: "m6.2 0h-4.9v-8.6h4.9v1h-3.8v2.6h3.6v1h-3.6v3h3.8v1z",
  F: "m2.5 0h-1.1v-8.6h4.9v1h-3.8v3h3.6v1h-3.6v3.6z",
  G: "m3.9-4.5h2.5v4.2c-0.8 0.3-1.6 0.4-2.5 0.4-1 0-1.8-0.4-2.4-1.2s-0.8-1.8-0.8-3.2c0-1.4 0.3-2.4 0.9-3.2s1.5-1.2 2.6-1.2c0.8 0 1.4 0.2 2 0.5l-0.3 1c-0.6-0.4-1.2-0.5-1.7-0.5-0.8 0-1.3 0.3-1.8 0.9s-0.6 1.4-0.6 2.5c0 2.3 0.8 3.4 2.3 3.4 0.4 0 0.8-0.1 1.2-0.2v-2.6h-1.4v-0.8z",
  H: "m6.4 0h-1.1v-4h-3.4v4h-1.1v-8.6h1.1v3.6h3.4v-3.6h1.1v8.6z",
  I: "m5.9 0h-4.6v-0.7l1.7-0.1v-6.9l-1.7-0.1v-0.7h4.5v0.7l-1.7 0.1v6.9l1.7 0.1v0.7z",
  J: "m0.8-0.2v-1c0.6 0.2 1.2 0.4 1.8 0.4s1.1-0.2 1.5-0.5 0.5-0.8 0.5-1.3v-5.9h1.1v5.9c0 0.8-0.3 1.5-0.8 2s-1.3 0.7-2.2 0.7c-0.8 0-1.5-0.1-1.9-0.3z",
  K: "m7 0h-1.2l-2.7-4.1-0.8 0.7v3.4h-1.1v-8.6h1.1v4.3l0.7-1 2.7-3.3h1.2l-3 3.8 3.1 4.8z",
  L: "m1.4 0v-8.6h1.1v7.6h3.7v1h-4.8z",
  M: "m3.1 0l-1.6-7.5c0.1 1 0.1 1.8 0.1 2.4v5.1h-0.9v-8.6h1.4l1.5 7 1.5-7h1.5v8.6h-1v-5.2c0-0.4 0-1.2 0.1-2.3l-1.7 7.5h-0.9z",
  N: "m6.4 0h-1.3l-3.4-7.1c0.1 1.1 0.1 1.9 0.1 2.5v4.6h-1v-8.6h1.2l3.4 7.1c-0.1-1.2-0.1-2-0.1-2.4v-4.7h1v8.6z",
  O: "m3.6 0.1c-2.1 0-3.1-1.5-3.1-4.4s1-4.4 3.1-4.4c1 0 1.8 0.4 2.3 1.1s0.8 1.9 0.8 3.3-0.2 2.5-0.8 3.3-1.3 1.1-2.3 1.1zm0-0.9c0.7 0 1.2-0.3 1.5-0.8s0.5-1.4 0.5-2.6c0-1.2-0.2-2.1-0.5-2.6s-0.8-0.9-1.5-0.9c-1.3 0-2 1.1-2 3.4s0.7 3.5 2 3.5z",
  P: "m2.1-3.3v3.3h-1.1v-8.6h2.4c2 0 3 0.8 3 2.5 0 0.9-0.3 1.5-0.8 2s-1.3 0.8-2.4 0.8h-1.1zm0-1h1c0.8 0 1.3-0.1 1.7-0.4s0.5-0.7 0.5-1.3c0-1.1-0.7-1.6-2-1.6h-1.2v3.3z",
  Q: "m5.1-0.2c0.3 0.7 0.9 1.3 1.6 1.8l-0.7 0.8c-0.9-0.6-1.6-1.4-1.9-2.3h-0.4c-2.1 0-3.1-1.5-3.1-4.4s1-4.4 3.1-4.4c1 0 1.8 0.4 2.3 1.1s0.8 1.9 0.8 3.3c-0.1 2.1-0.6 3.4-1.7 4.1zm-1.5-0.6c0.7 0 1.2-0.3 1.5-0.8s0.5-1.4 0.5-2.6c0-1.2-0.2-2.1-0.5-2.6s-0.8-0.9-1.5-0.9c-1.3 0-2 1.1-2 3.4s0.7 3.5 2 3.5z",
  R: "m2.2-3.5v3.5h-1.1v-8.6h2.1c2 0 3 0.8 3 2.4 0 1.1-0.6 1.9-1.7 2.3l2.4 3.9h-1.3l-2.1-3.5h-1.3zm0-1h1c0.7 0 1.2-0.1 1.5-0.4s0.5-0.7 0.5-1.2c0-0.6-0.2-0.9-0.5-1.2s-0.9-0.3-1.6-0.3h-0.9v3.1z",
  S: "m0.8-0.3v-1c0.9 0.3 1.7 0.5 2.5 0.5 1.4 0 2.1-0.5 2.1-1.4 0-0.4-0.1-0.7-0.4-0.9s-0.9-0.5-1.8-0.8c-0.8-0.3-1.4-0.7-1.7-1.1s-0.6-0.9-0.6-1.5c0-0.7 0.3-1.2 0.8-1.6s1.2-0.6 2.1-0.6c0.9 0 1.7 0.2 2.4 0.5l-0.4 1c-0.7-0.4-1.4-0.5-2.1-0.5-1.1 0-1.7 0.4-1.7 1.2 0 0.4 0.1 0.7 0.4 1s0.8 0.5 1.6 0.7c1 0.3 1.6 0.7 1.9 1.1s0.5 0.8 0.5 1.4c0 0.8-0.3 1.3-0.8 1.8s-1.4 0.6-2.3 0.6c-1.1 0-1.9-0.1-2.5-0.4z",
  T: "m4.1 0h-1.1v-7.6h-2.4v-1h6v1h-2.5v7.6z",
  U: "m6.5-8.6v5.6c0 1-0.2 1.8-0.7 2.3s-1.3 0.8-2.2 0.8c-1.9 0-2.9-1-2.9-3.1v-5.5h1.1v5.5c0 1.5 0.6 2.3 1.8 2.3s1.7-0.8 1.8-2.3v-5.5h1.1z",
  V: "m5.8-8.6h1.2l-2.9 8.6h-1.1l-2.8-8.6h1.1l1.7 5.4c0.2 0.5 0.3 1.1 0.5 2 0.1-0.6 0.3-1.2 0.5-2l1.8-5.4z",
  W: "m3.1-5.9h1l0.9 3c0.2 0.9 0.4 1.5 0.4 1.8 0-0.2 0.1-1.4 0.4-3.6l0.4-3.9h1l-1.1 8.6h-1.1l-1-3.4c-0.2-0.5-0.3-1.1-0.4-1.7-0.1 0.7-0.2 1.3-0.4 1.7l-0.9 3.4h-1.1l-1.2-8.6h1l0.5 3.9c0.1 0.7 0.2 1.4 0.3 2.2s0.1 1.3 0.1 1.4c0.1-0.5 0.2-1.2 0.4-1.8l0.8-3z",
  X: "m6.9 0h-1.3l-2-3.7-2.2 3.7h-1.1l2.7-4.5-2.5-4.1h1.2l1.9 3.3 2-3.3h1.1l-2.5 4.1 2.7 4.5z",
  Y: "m3.6-4.2l2.2-4.3h1.2l-2.9 5.2v3.3h-1.1v-3.3l-2.8-5.3h1.2l2.2 4.4z",
  Z: "m6.6 0h-6v-0.8l4.6-6.7h-4.5v-1h5.7v0.8l-4.6 6.7h4.8v1z",
  a: "m5.2 0l-0.2-0.9c-0.3 0.4-0.6 0.7-0.9 0.8s-0.8 0.2-1.3 0.2c-0.6 0-1.1-0.2-1.5-0.5s-0.5-0.8-0.5-1.4c0-1.3 1-2 3-2h1.2v-0.4c0-0.9-0.5-1.4-1.4-1.4-0.6-0.1-1.3 0.1-2 0.4l-0.4-0.8c0.8-0.4 1.6-0.6 2.3-0.6 0.9 0 1.5 0.2 1.9 0.6s0.6 0.8 0.6 1.6v4.4h-0.8zm-0.2-3.1h-1c-0.8 0-1.3 0.1-1.6 0.4s-0.5 0.5-0.5 1c0 0.7 0.4 1 1.2 1 0.6 0 1-0.2 1.4-0.5s0.5-0.8 0.5-1.4v-0.5z",
  b: "m2-0.8l-0.3 0.8h-0.8v-9.1h1.1v2.2 1.3c0.4-0.6 1-1 1.9-1 0.8 0 1.4 0.3 1.8 0.9s0.7 1.4 0.7 2.4c0 1.1-0.2 1.9-0.7 2.5s-1 0.9-1.8 0.9c-0.8 0-1.5-0.3-1.9-0.9zm0-2.4c0 0.9 0.1 1.5 0.4 1.9s0.7 0.6 1.3 0.6c1.1 0 1.6-0.8 1.6-2.5 0-1.6-0.5-2.4-1.6-2.4-0.6 0-1 0.2-1.3 0.6s-0.4 0.9-0.4 1.8z",
  c: "m6.2-6.2l-0.3 0.9c-0.6-0.2-1.2-0.3-1.6-0.3-1.4 0-2.2 0.8-2.2 2.4s0.7 2.4 2.1 2.4c0.6 0 1.2-0.1 1.9-0.4v0.9c-0.5 0.3-1.2 0.4-1.9 0.4-1 0-1.8-0.3-2.3-0.9s-0.9-1.3-0.9-2.4c0-1.1 0.3-1.9 0.8-2.5s1.4-0.9 2.4-0.9c0.7 0 1.4 0.2 2 0.4z",
  d: "m4.5-0.9c-0.5 0.7-1.1 1-1.9 1s-1.4-0.3-1.8-0.9-0.8-1.4-0.8-2.5c0-1.1 0.2-1.9 0.7-2.5s1.1-0.9 1.8-0.9c0.8 0 1.4 0.3 1.9 0.9h0.1c0-0.5-0.1-0.8-0.1-0.9v-2.6h1.1v9.3h-0.9l-0.1-0.9zm-0.1-2.1v-0.2c0-0.9-0.1-1.5-0.4-1.9s-0.7-0.6-1.3-0.6c-1.1 0-1.6 0.8-1.6 2.5 0 1.6 0.5 2.4 1.6 2.4 0.6 0 1-0.2 1.3-0.5s0.4-0.9 0.4-1.7z",
  e: "m6.4-3h-4.5c0 1.5 0.7 2.2 2 2.2 0.8 0 1.5-0.1 2.2-0.4v0.9c-0.7 0.3-1.4 0.4-2.2 0.4-1 0-1.7-0.3-2.3-0.9s-0.8-1.3-0.8-2.4c0-1 0.3-1.9 0.8-2.5s1.2-0.9 2.1-0.9c0.8 0 1.5 0.3 2 0.8s0.7 1.2 0.7 2.1v0.7zm-4.5-0.9h3.4c0-1.2-0.5-1.8-1.6-1.8s-1.7 0.6-1.8 1.8z",
  f: "m6.1-5.6h-2.3v5.6h-1v-5.6h-1.9v-0.6l1.9-0.2v-0.6c0-0.8 0.2-1.3 0.5-1.6s0.9-0.5 1.8-0.5c0.5 0 1 0.1 1.5 0.2l-0.3 0.8c-0.4-0.1-0.8-0.2-1.2-0.2-0.5 0-0.8 0.1-1 0.3s-0.3 0.5-0.3 1v0.6h2.3v0.8z",
  g: "m6.6-6.4v0.7l-1.2 0.1c0.3 0.3 0.4 0.7 0.4 1.2 0 0.6-0.2 1.1-0.6 1.5s-1 0.6-1.7 0.6h-0.5c-0.4 0.2-0.6 0.4-0.6 0.7s0.3 0.5 0.9 0.5h1.1c0.7 0 1.2 0.2 1.6 0.5s0.5 0.7 0.5 1.3c0 1.5-1.1 2.2-3.3 2.2-0.9 0-1.5-0.2-1.9-0.5s-0.7-0.7-0.7-1.3c0-0.8 0.5-1.4 1.4-1.6-0.4-0.2-0.6-0.5-0.6-0.9s0.3-0.8 0.8-1.1c-0.3-0.2-0.6-0.4-0.8-0.7s-0.3-0.7-0.3-1.1c0-0.7 0.2-1.3 0.6-1.7s1-0.6 1.8-0.6c0.3 0 0.6 0 0.9 0.1h2.2zm-2.5 6.3h-1.1c-0.9 0-1.3 0.4-1.3 1.2 0 0.7 0.5 1 1.6 1 1.5 0 2.3-0.4 2.3-1.3 0-0.3-0.1-0.6-0.3-0.7s-0.7-0.2-1.2-0.2zm-0.6-2.9c0.9 0 1.3-0.4 1.3-1.3s-0.4-1.4-1.3-1.4-1.3 0.4-1.3 1.3c0 0.9 0.4 1.4 1.3 1.4z",
  h: "m5.2 0v-4.1c0-1-0.5-1.5-1.4-1.5-1.2-0.1-1.8 0.7-1.8 2.3v3.3h-1.1v-9.1h1.1v2.7 0.8c0.4-0.7 1.1-1 2-1 1.5 0 2.3 0.8 2.3 2.3v4.3h-1.1z",
  i: "m3.2-5.6l-1.6-0.1v-0.7h2.6v5.6l2.1 0.1v0.7h-5.1v-0.7l2-0.1v-4.8zm0.5-3.5c0.4 0 0.6 0.2 0.6 0.7 0 0.2-0.1 0.4-0.2 0.5s-0.2 0.2-0.4 0.2c-0.4 0-0.6-0.3-0.6-0.7 0-0.5 0.2-0.7 0.6-0.7z",
  j: "m0.8 2.7v-0.9c0.5 0.1 1.1 0.2 1.7 0.2 0.5 0 0.8-0.1 1.1-0.3s0.4-0.5 0.4-0.9v-6.3l-2.5-0.2v-0.7h3.5v7.1c0 0.7-0.2 1.2-0.7 1.6s-1 0.6-1.8 0.6c-0.7 0-1.2-0.1-1.7-0.2zm3.6-11.8c0.4 0 0.6 0.2 0.6 0.7 0 0.4-0.2 0.7-0.6 0.7-0.5 0-0.7-0.3-0.7-0.7 0-0.5 0.2-0.7 0.7-0.7z",
  k: "m2.2-3.2l0.8-0.9 2.3-2.3h1.3l-2.8 2.7 3 3.7h-1.2l-2.5-3-0.8 0.5v2.5h-1v-9.1h1.1v4.2l-0.2 1.7z",
  l: "m3.1-8.3l-1.6-0.1v-0.7h2.6v8.3l2.1 0.1v0.7h-5.1v-0.7l2-0.1v-7.5z",
  m: "m5.7 0v-4.1c0-0.6-0.1-1-0.2-1.2s-0.2-0.4-0.4-0.4c-0.3 0-0.6 0.2-0.7 0.5s-0.3 0.9-0.3 1.6v3.6h-1v-4.1c0-1-0.2-1.5-0.7-1.5-0.3 0-0.6 0.2-0.7 0.5s-0.2 0.8-0.2 1.8v3.3h-1v-6.4h0.7l0.2 0.9h0.1c0.3-0.7 0.7-1 1.2-1 0.6 0 1.1 0.4 1.2 1.1 0.3-0.7 0.7-1.1 1.3-1.1 0.5 0 0.9 0.2 1.1 0.5s0.3 1 0.3 1.8v4.2h-0.9z",
  n: "m5.2 0v-4.1c0-1-0.5-1.5-1.4-1.5-1.2-0.1-1.8 0.7-1.8 2.3v3.3h-1.1v-6.4h0.9l0.2 0.8c0.4-0.7 1.1-1 2-1 1.5 0 2.3 0.8 2.3 2.3v4.3h-1.1z",
  o: "m3.6 0.1c-0.9 0-1.6-0.3-2.1-0.9s-0.8-1.4-0.8-2.4c0-1 0.3-1.8 0.8-2.4s1.2-0.9 2.1-0.9c0.9 0 1.5 0.3 2.1 0.9s0.8 1.4 0.8 2.4c0 1-0.3 1.9-0.8 2.4s-1.2 0.9-2.1 0.9zm0-0.9c1.2 0 1.8-0.8 1.8-2.5 0-1.6-0.6-2.4-1.8-2.4s-1.8 0.8-1.8 2.4c0 1.7 0.6 2.5 1.8 2.5z",
  p: "m2-0.8v0.9 2.7h-1.1v-9.3h0.9l0.2 0.9c0.4-0.7 1.1-1 1.9-1s1.4 0.3 1.8 0.9 0.7 1.4 0.7 2.4c0 1.1-0.2 1.9-0.7 2.5s-1 0.9-1.8 0.9c-0.8 0-1.5-0.3-1.9-0.9zm0-2.7v0.2c0 0.9 0.1 1.5 0.4 1.9s0.7 0.6 1.3 0.6c1.1 0 1.6-0.8 1.6-2.5 0-1.6-0.5-2.4-1.6-2.4-0.6 0-1 0.2-1.3 0.5s-0.4 1-0.4 1.7z",
  q: "m5.2-5.6l0.2-0.9h0.9v9.3h-1.1v-2.7c0-0.2 0-0.5 0.1-1h-0.1c-0.4 0.7-1.1 1-1.9 1s-1.4-0.3-1.8-0.9-0.7-1.4-0.7-2.4c0-1.1 0.2-1.9 0.7-2.5s1.1-0.9 1.8-0.9c0.8 0 1.5 0.4 1.9 1zm0 2.6v-0.2c0-0.9-0.1-1.5-0.4-1.9s-0.7-0.6-1.3-0.6c-1.1 0-1.6 0.8-1.6 2.5 0 1.6 0.5 2.4 1.6 2.4 0.6 0 1-0.2 1.3-0.5s0.4-0.9 0.4-1.7z",
  r: "m6.2-6.3l-0.3 1c-0.5-0.2-0.9-0.3-1.3-0.3-0.6 0-1.1 0.2-1.5 0.6s-0.5 0.8-0.5 1.5v3.5h-1.1v-6.4h0.9l0.1 1.2c0.3-0.5 0.6-0.8 1-1s0.8-0.3 1.3-0.3c0.5-0.1 0.9 0 1.4 0.2z",
  s: "m1.2-0.3v-1c0.8 0.3 1.5 0.5 2.2 0.5 1 0 1.6-0.3 1.6-0.9 0-0.2-0.1-0.4-0.3-0.6s-0.7-0.4-1.3-0.6c-1-0.3-1.5-0.7-1.8-0.9s-0.4-0.6-0.4-1c0-0.5 0.2-0.9 0.7-1.3s1-0.5 1.8-0.5c0.8 0 1.5 0.1 2.2 0.4l-0.3 1c-0.8-0.3-1.4-0.5-1.9-0.5-0.9 0-1.4 0.3-1.4 0.8 0 0.2 0.1 0.4 0.3 0.6s0.6 0.3 1.4 0.6c0.8 0.3 1.4 0.6 1.6 0.9s0.4 0.6 0.4 1c0 0.6-0.2 1-0.7 1.4s-1.1 0.5-1.9 0.5c-1 0-1.7-0.1-2.2-0.4z",
  t: "m6-0.9v0.8c-0.5 0.2-1 0.2-1.5 0.2-1.4 0-2.1-0.7-2.1-2v-3.7h-1.6v-0.6l1.6-0.3 0.5-1.7h0.6v1.7h2.5v0.8h-2.6v3.7c0 0.8 0.4 1.1 1.1 1.1 0.4 0.1 0.9 0.1 1.5 0z",
  u: "m5.4 0l-0.2-0.9c-0.4 0.7-1.1 1-2 1-1.5 0-2.3-0.8-2.3-2.3v-4.2h1.1v4.1c0 1 0.5 1.5 1.4 1.5 0.6 0 1.1-0.2 1.4-0.5s0.4-1 0.4-1.8v-3.3h1.1v6.4h-0.9z",
  v: "m2.9 0l-2.4-6.4h1.1l1.4 3.8c0.3 0.9 0.5 1.5 0.6 1.9 0-0.2 0.2-0.8 0.6-1.9l1.4-3.8h1.1l-2.4 6.4h-1.4z",
  w: "m3.6-5.4l-0.4 2-0.8 3.4h-1.1l-1.3-6.4h0.9l0.6 3.2c0.1 0.7 0.2 1.5 0.3 2.3 0.2-0.8 0.3-1.5 0.5-2.1l0.8-3.4h1.1l0.7 3.4c0.2 0.8 0.3 1.5 0.4 2.1 0.1-0.9 0.2-1.7 0.4-2.3l0.6-3.2h0.9l-1.3 6.4h-1.1l-0.8-3.5",
  x: "m3-3.3l-2.3-3.1h1.2l1.7 2.4 1.7-2.4h1.2l-2.3 3.1 2.4 3.3h-1.2l-1.8-2.6-1.8 2.6h-1.2l2.4-3.3z",
  y: "m0.5-6.4h1.1l1.5 3.8c0.3 0.8 0.5 1.4 0.5 1.7 0.1-0.4 0.3-1 0.5-1.7l1.4-3.8h1.1l-2.7 7.2c-0.2 0.7-0.5 1.2-0.9 1.6s-0.8 0.5-1.4 0.5c-0.3 0-0.7 0-1-0.1v-0.9c0.2 0.1 0.5 0.1 0.8 0.1 0.4 0 0.6-0.1 0.9-0.2s0.4-0.4 0.6-0.8l0.3-0.9-2.7-6.5z",
  z: "m6.1 0h-5v-0.7l3.9-4.9h-3.7v-0.8h4.7v0.9l-3.8 4.7h3.9v0.8z",
  //Special Characters from now on
  "?": "m1.7814-2.5802v-0.21a2.16 2.16 0 0 1 0.28 -1.15 3.42 3.42 0 0 1 0.94 -0.92 5 5 0 0 0 1 -0.91 1.56 1.56 0 0 0 0.24 -0.93 1.06 1.06 0 0 0 -0.44 -0.88 1.94 1.94 0 0 0 -1.21 -0.34 5.25 5.25 0 0 0 -2.17 0.53l-0.36-0.88a5.87 5.87 0 0 1 2.5 -0.57 3.16 3.16 0 0 1 2 0.57 1.84 1.84 0 0 1 0.74 1.53 2.3 2.3 0 0 1 -0.31 1.27 4.87 4.87 0 0 1 -1.19 1.12 3.56 3.56 0 0 0 -0.88 0.83 1.61 1.61 0 0 0 -0.19 0.84v0.11h-0.95zm0.52 1a0.69 0.69 0 0 1 0.76 0.78 0.69 0.69 0 0 1 -0.74 0.82 0.69 0.69 0 0 1 -0.76 -0.82 0.69 0.69 0 0 1 0.74 -0.81z",
  _: "m7.3 1.9h-7.4v-0.8h7.4v0.8z",
  "-": "m1.7-2.7v-1h3.9v1h-3.9z",
  "[": "m5.5 1.9h-3.1v-10.5h3.1v0.9h-2v8.7h2v0.9z",
  "]": "m1.7 1h2v-8.7h-2v-0.9h3.1v10.5h-3.1v-0.9z",
  "{": "m4.4 0.1c0 0.3 0.1 0.5 0.3 0.7s0.6 0.2 1.2 0.2v0.9c-1.7 0-2.6-0.6-2.6-1.7v-2c0-0.7-0.7-1.1-2-1.1v-0.9c1.3 0 2-0.4 2-1.1v-2c0-1.1 0.9-1.7 2.6-1.7v0.9c-0.6 0-1 0.1-1.2 0.2s-0.3 0.4-0.3 0.7v1.9c0 0.9-0.5 1.4-1.4 1.5v0.1c0.9 0.2 1.4 0.6 1.4 1.5v1.9z",
  "}": "m2.8-1.8c0-0.8 0.5-1.3 1.4-1.5v-0.1c-0.9-0.1-1.4-0.6-1.4-1.4v-1.9c0-0.3-0.1-0.5-0.3-0.7s-0.6-0.3-1.2-0.3v-0.9c1.7 0.1 2.6 0.6 2.6 1.8v2c0 0.7 0.7 1.1 2 1.1v0.9c-1.3 0-2 0.4-2 1.1v2c0 1.1-0.9 1.7-2.6 1.7v-1c0.6 0 0.9-0.1 1.2-0.2s0.3-0.4 0.3-0.7v-1.9z",
  "@": "m4.7-2.3c-0.3 0.7-0.8 1-1.4 1-0.5 0-0.8-0.2-1.1-0.6s-0.4-1-0.4-1.6c0-0.9 0.2-1.5 0.6-2s0.9-0.7 1.5-0.7c0.5 0 1 0.1 1.5 0.3l-0.2 2.4v0.4c0 0.7 0.1 1 0.4 1 0.4 0 0.6-0.7 0.6-2.2 0-1.1-0.2-1.9-0.7-2.6s-1-0.9-1.8-0.9c-0.9 0-1.6 0.4-2.1 1.1s-0.6 1.8-0.6 3.1c0 1.2 0.3 2.2 0.8 2.8s1.2 1 2.2 1c0.7 0 1.4-0.2 2-0.5v0.8c-0.7 0.4-1.4 0.6-2.1 0.6-1.2 0-2.1-0.4-2.7-1.2s-1-1.9-1-3.4c0-1.6 0.3-2.8 1-3.7s1.5-1.4 2.7-1.4c1 0 1.7 0.4 2.3 1.1s0.8 1.9 0.8 3.2c0 0.9-0.1 1.6-0.4 2.2s-0.6 0.8-1 0.8c-0.5 0-0.8-0.3-0.9-1zm-0.3-3.1c-0.2 0-0.4-0.1-0.6-0.1-0.3 0-0.6 0.2-0.8 0.6s-0.3 0.8-0.3 1.4c0 1 0.2 1.5 0.7 1.5s0.8-0.6 0.8-1.8l0.2-1.6z",
  "%": "m1.7-4.6c-0.5 0-0.9-0.2-1.2-0.6s-0.5-0.8-0.5-1.4c0-0.6 0.2-1.1 0.5-1.5s0.7-0.5 1.3-0.5c0.5 0 0.9 0.2 1.2 0.5s0.5 0.9 0.5 1.5c-0.1 0.6-0.2 1.1-0.5 1.5s-0.8 0.5-1.3 0.5zm0-0.7c0.5 0 0.8-0.4 0.8-1.3s-0.2-1.4-0.8-1.4c-0.5 0-0.8 0.5-0.8 1.4s0.3 1.3 0.8 1.3zm4.5-3.3l-4.3 8.6h-0.9l4.3-8.6h0.9zm-0.7 8.7c-0.5 0-0.9-0.2-1.3-0.5s-0.4-0.9-0.4-1.5c0-0.6 0.2-1.1 0.5-1.5s0.7-0.6 1.2-0.6c0.5 0 0.9 0.2 1.2 0.6s0.5 0.9 0.5 1.5c0 0.6-0.2 1.1-0.5 1.5s-0.7 0.5-1.2 0.5zm0-0.7c0.5 0 0.8-0.4 0.8-1.3s-0.3-1.3-0.8-1.3c-0.6 0-0.8 0.4-0.8 1.3s0.2 1.3 0.8 1.3z",
  "^": "m0.7-3.2l2.5-5.4h0.6l2.8 5.4h-1l-2.2-4.3-1.8 4.3h-0.9z",
  "+": "m3.2-3.8h-2.3v-0.9h2.3v-2.3h0.8v2.3h2.3v0.9h-2.3v2.3h-0.8v-2.3z",
  "=": "m0.9-5v-0.9h5.4v0.9h-5.4zm0 2.4v-0.9h5.4v0.9h-5.4z",
  "~": "m0.9-3.4v-0.9c0.4-0.5 0.9-0.7 1.4-0.7 0.4 0 0.9 0.1 1.5 0.4 0.5 0.2 0.9 0.3 1.2 0.3 0.4 0 0.9-0.2 1.3-0.7v0.9c-0.4 0.4-0.9 0.7-1.5 0.7-0.3 0-0.8-0.2-1.4-0.4-0.5-0.2-0.9-0.3-1.2-0.3-0.4 0-0.8 0.2-1.3 0.7z",
  "&": "m3.5-4.5l1.6 2c0.3-0.5 0.5-1 0.6-1.6h1.1c-0.2 0.9-0.6 1.7-1 2.4l1.4 1.7h-1.3l-0.7-1c-0.7 0.8-1.5 1.1-2.5 1.1-0.7 0-1.3-0.2-1.7-0.6s-0.6-1-0.6-1.7c0-0.5 0.1-1 0.4-1.3s0.7-0.8 1.4-1.2c-0.6-0.8-1-1.4-1-2.1 0-0.6 0.2-1 0.6-1.4s0.9-0.5 1.6-0.5c0.7 0 1.2 0.2 1.5 0.5s0.5 0.8 0.5 1.4c0 0.8-0.6 1.5-1.9 2.3zm1.1 2.8l-1.9-2.3c-0.8 0.4-1.2 1-1.2 1.7 0 0.4 0.1 0.8 0.4 1s0.6 0.4 0.9 0.4c0.6 0.1 1.2-0.2 1.8-0.8zm-1.6-3.6c0.5-0.3 0.9-0.6 1.1-0.8s0.3-0.5 0.3-0.8-0.2-0.5-0.3-0.7-0.5-0.2-0.8-0.2c-0.3 0-0.6 0.1-0.8 0.3s-0.3 0.4-0.3 0.7c0 0.4 0.3 1 0.8 1.5z",
  "*": "m4.2-9.1l-0.3 2.3 2.3-0.7 0.2 1.1-2.2 0.2 1.4 1.9-1 0.6-1-2.1-1 2.1-1-0.6 1.4-1.9-2.2-0.1 0.2-1.1 2.3 0.7-0.3-2.4h1.2z",
  "\\": "m2.3-8.6l3.7 8.6h-1l-3.8-8.6h1.1z",
  ":": "m3.6-6.6c0.5 0 0.7 0.3 0.7 0.8s-0.2 0.8-0.7 0.8-0.7-0.2-0.7-0.8 0.2-0.8 0.7-0.8zm0 5.1c0.5 0 0.7 0.3 0.7 0.8s-0.2 0.8-0.7 0.8-0.7-0.2-0.7-0.8c0-0.5 0.2-0.8 0.7-0.8z",
  ",": "m4.5-1.5l0.1 0.1c-0.2 0.9-0.6 1.9-1.1 3.1h-0.9c0.3-1.3 0.5-2.3 0.7-3.2h1.2z",
  $: "m4-0.7v1.3h-0.8v-1.3c-0.9 0.1-1.6 0-2.1-0.3v-1c0.8 0.4 1.5 0.5 2.1 0.5v-2.5c-0.7-0.3-1.3-0.6-1.6-0.9s-0.4-0.7-0.4-1.3c0-0.5 0.2-0.9 0.5-1.3s0.9-0.5 1.5-0.6v-1.1h0.8v1c0.7 0 1.4 0.2 2 0.5l-0.4 0.9c-0.6-0.2-1.1-0.4-1.6-0.4v2.5c0.8 0.3 1.3 0.6 1.6 0.9s0.5 0.7 0.5 1.2c0 1.1-0.7 1.7-2.1 1.9zm-0.8-4.3v-2.2c-0.7 0.1-1 0.5-1 1 0 0.3 0.1 0.5 0.2 0.7s0.4 0.4 0.8 0.5zm0.8 1.3v2.2c0.7-0.1 1.1-0.5 1.1-1.1 0-0.5-0.4-0.9-1.1-1.1z",
  "/": "m6-8.6l-3.7 8.6h-1l3.7-8.6h1z",
  ">": "m0.9-2.2l4.2-2-4.2-2v-0.9l5.4 2.6v0.6l-5.4 2.6v-0.9z",
  "(": "m4.3-8.6h1.1c-1.7 1.5-2.6 3.2-2.6 5.3 0 2 0.9 3.8 2.6 5.2h-1.1c-1.7-1.4-2.6-3.1-2.6-5.2s0.9-3.8 2.6-5.3z",
  "<": "m6.3-1.3l-5.4-2.6v-0.6l5.4-2.6v0.9l-4.2 2 4.2 2v0.9z",
  "|": "m3.2-9.1h0.8v12h-0.8v-12z",
  "`": "m4.8-7.3h-0.8c-0.6-0.5-1.1-1.1-1.6-1.8v-0.1h1.3c0.3 0.7 0.7 1.3 1 1.8v0.1z",
  ".": "m3.6-1.8c0.6 0 0.9 0.3 0.9 1s-0.3 1-0.9 1c-0.6 0-0.9-0.3-0.9-1s0.3-1 0.9-1z",
  "#": "m5.5-5.2l-0.4 1.9h1.4v0.8h-1.5l-0.5 2.5h-0.9l0.5-2.5h-1.7l-0.5 2.5h-0.8l0.5-2.5h-1.3v-0.8h1.4l0.4-1.9h-1.4v-0.8h1.5l0.5-2.5h0.9l-0.5 2.5h1.7l0.5-2.5h0.8l-0.5 2.5h1.3v0.8h-1.4zm-2.9 1.9h1.7l0.4-1.9h-1.8l-0.3 1.9z",
  '"': "m0.4-5.3c0.3-1 0.8-2.3 1.1-2.9l0.7-0.1c-0.3 0.8-0.6 2-0.7 2.9l-1.1 0.1zm1.8 0c0.3-1 0.8-2.3 1.1-2.9h0.7c-0.3 0.7-0.6 1.9-0.7 2.8l-1.1 0.1z",
  ")": "m2.9 1.9h-1.1c1.7-1.4 2.6-3.2 2.6-5.2s-0.9-3.8-2.6-5.2h1.1c1.7 1.4 2.6 3.2 2.6 5.2 0 2.1-0.9 3.8-2.6 5.2z",
  ";": "m4.2-1.4l0.1 0.1c-0.3 0.8-0.6 1.7-1.1 2.8h-0.8c0.2-1 0.4-2 0.6-2.9h1.2zm-0.6-5.2c0.5 0 0.7 0.3 0.7 0.8s-0.2 0.8-0.7 0.8-0.7-0.2-0.7-0.8 0.2-0.8 0.7-0.8z",
  "'": "m0.4-5.3c0.3-1 0.8-2.3 1.1-2.9l0.7-0.1c-0.2 0.8-0.6 2-0.7 2.9l-1.1 0.1z",
  "!": "m0.7-1.6c0.5 0 0.7 0.3 0.7 0.8 0.1 0.5-0.2 0.8-0.7 0.8s-0.7-0.3-0.7-0.8c0-0.6 0.2-0.8 0.7-0.8zm0.4-1h-0.7l-0.3-6.1h1.3l-0.3 6.1z",
};

const textToPath = (
  text: string,
  textAnchor: "start" | "end" | "middle" = "start"
) => {
  //   const { font, fontSize, letterSpacing, lineHeight } = options;
  const path = [];
  const fontSize = 11;
  const letterSpacing = 0.7;
  const lineHeight = 1;
  let x = 0;
  let y = 0;
  if (textAnchor === "end") {
    x = -text.length * letterSpacing * fontSize;
  } else if (textAnchor === "middle") {
    x = (-text.length * letterSpacing * fontSize) / 2;
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i] as string;
    const charPath = character_array[char];
    if (charPath) {
      // copy text-anchor to path
      path.push(`M${x} ${y} ${charPath}`);
      x += fontSize * letterSpacing;
    } else if (char === " ") {
      x += (fontSize * letterSpacing) / 2;
    } else if (char === "   ") {
      x += fontSize * letterSpacing * 3;
    } else if (char === "   ") {
      // 3 spaces = new line
      x = 0;
      y += fontSize * lineHeight;
    }
  }
  return path.join(" ");
};

function changeTextToPath(child5: ElementNode) {
  if (child5.tagName === "text") {
    const text = child5.children[0] as ElementNode;
    const textAnchor = child5.properties
      ? (child5.properties["text-anchor"] as string)
      : "";
    const path = textToPath(text.value as string, textAnchor as any);
    child5.tagName = "path";
    if (child5.properties) {
      const transform = child5.properties["transform"];
      child5.value = undefined;
      child5.properties = {
        d: path,
        xmlns: "http://www.w3.org/2000/svg",
        transform: transform as string,
        fill: "#333333",
      };
      child5.children = [];
      child5.tagName = "path";
      child5.metadata = undefined;
    }
  }
}

export function convertTextWithoutDom(svgString: string) {
  const obj = parse(svgString);
  // max depth is 5
  // it is possible to do it with recursion but it is not necessary
  // it is is easier to increase the depth if needed
  for (let i = 0; i < obj.children.length; i++) {
    const child = obj.children[i] as ElementNode;
    for (let i = 0; i < child.children.length; i++) {
      const child2 = child.children[i] as ElementNode;
      changeTextToPath(child2);
      for (let i = 0; i < child2.children.length; i++) {
        const child3 = child2.children[i] as ElementNode;
        changeTextToPath(child3);
        for (let i = 0; i < child3.children.length; i++) {
          const child4 = child3.children[i] as ElementNode;
          changeTextToPath(child4);
          for (let i = 0; i < child4.children.length; i++) {
            const child5 = child4.children[i] as ElementNode;
            changeTextToPath(child5);
          }
        }
      }
    }
  }
  // we need to convert the object to svg string
  return btoa(toHtml(obj.children as any));
}

// export default function convertTextInSvgStringIntoPath(svgString: string) {
//   const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
//   const textElements = svg.getElementsByTagName("text");
//   while (textElements.length > 0) {
//     const textElement = textElements[0];
//     const text = textElement?.textContent;
//     if (text) {
//       const path = svg.createElementNS("http://www.w3.org/2000/svg", "path");
//       path.setAttribute(
//         "d",
//         textToPath(text, textElement.getAttribute("text-anchor") as any)
//       );
//       textElement.parentNode?.replaceChild(path, textElement);
//     }
//   }
//   return svg.documentElement.outerHTML;
// }

// export function test() {
//   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="592" height="384" role="img"><rect width="592" height="384" fill="transparent"></rect><g transform="translate(50,10)"><g><line opacity="1" x1="43.57446808510638" x2="43.57446808510638" y1="0" y2="334" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="119.82978723404256" x2="119.82978723404256" y1="0" y2="334" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="196.08510638297872" x2="196.08510638297872" y1="0" y2="334" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="272.3404255319149" x2="272.3404255319149" y1="0" y2="334" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="348.59574468085106" x2="348.59574468085106" y1="0" y2="334" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="424.8510638297872" x2="424.8510638297872" y1="0" y2="334" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="501.1063829787234" x2="501.1063829787234" y1="0" y2="334" stroke="#dddddd" stroke-width="1"></line></g><g><line opacity="1" x1="0" x2="512" y1="319" y2="319" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="293" y2="293" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="267" y2="267" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="242" y2="242" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="216" y2="216" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="191" y2="191" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="165" y2="165" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="139" y2="139" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="114" y2="114" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="88" y2="88" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="63" y2="63" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="37" y2="37" stroke="#dddddd" stroke-width="1"></line><line opacity="1" x1="0" x2="512" y1="12" y2="12" stroke="#dddddd" stroke-width="1"></line></g><g transform="translate(0,334)"><g transform="translate(43.57446808510638,0)" style="opacity: 1;"><line x1="0" x2="0" y1="0" y2="5" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="start" transform="translate(0,10) rotate(45)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">Oct 02</text></g><g transform="translate(119.82978723404256,0)" style="opacity: 1;"><line x1="0" x2="0" y1="0" y2="5" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="start" transform="translate(0,10) rotate(45)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">Oct 09</text></g><g transform="translate(196.08510638297872,0)" style="opacity: 1;"><line x1="0" x2="0" y1="0" y2="5" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="start" transform="translate(0,10) rotate(45)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">Oct 16</text></g><g transform="translate(272.3404255319149,0)" style="opacity: 1;"><line x1="0" x2="0" y1="0" y2="5" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="start" transform="translate(0,10) rotate(45)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">Oct 23</text></g><g transform="translate(348.59574468085106,0)" style="opacity: 1;"><line x1="0" x2="0" y1="0" y2="5" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="start" transform="translate(0,10) rotate(45)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">Oct 30</text></g><g transform="translate(424.8510638297872,0)" style="opacity: 1;"><line x1="0" x2="0" y1="0" y2="5" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="start" transform="translate(0,10) rotate(45)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">Nov 06</text></g><g transform="translate(501.1063829787234,0)" style="opacity: 1;"><line x1="0" x2="0" y1="0" y2="5" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="start" transform="translate(0,10) rotate(45)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">Nov 13</text></g><line x1="0" x2="512" y1="0" y2="0" style="stroke: transparent; stroke-width: 1;"></line></g><g transform="translate(0,0)"><g transform="translate(0,319)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12160</text></g><g transform="translate(0,293)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12180</text></g><g transform="translate(0,267)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12200</text></g><g transform="translate(0,242)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12220</text></g><g transform="translate(0,216)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12240</text></g><g transform="translate(0,191)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12260</text></g><g transform="translate(0,165)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12280</text></g><g transform="translate(0,139)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12300</text></g><g transform="translate(0,114)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12320</text></g><g transform="translate(0,88)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12340</text></g><g transform="translate(0,63)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12360</text></g><g transform="translate(0,37)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12380</text></g><g transform="translate(0,12)" style="opacity: 1;"><line x1="0" x2="-5" y1="0" y2="0" style="stroke: rgb(119, 119, 119); stroke-width: 1;"></line><text dominant-baseline="central" text-anchor="end" transform="translate(-10,0) rotate(0)" style="font-family: sans-serif; font-size: 11px; fill: rgb(51, 51, 51);">12400</text></g><line x1="0" x2="0" y1="0" y2="334" style="stroke: transparent; stroke-width: 1;"></line></g><g><path d="M512,0L490.21276595744683,15L413.9574468085106,68L348.59574468085106,104L272.3404255319149,148L185.19148936170214,186L119.82978723404256,232L43.57446808510638,279L0,334L0,334L43.57446808510638,334L119.82978723404256,334L185.19148936170214,334L272.3404255319149,334L348.59574468085106,334L413.9574468085106,334L490.21276595744683,334L512,334Z" fill="rgba(232, 193, 160, 1)" fill-opacity="0.2" stroke-width="0" style="mix-blend-mode: normal;"></path></g><path d="M512,0L490.21276595744683,15L413.9574468085106,68L348.59574468085106,104L272.3404255319149,148L185.19148936170214,186L119.82978723404256,232L43.57446808510638,279L0,334" fill="none" stroke-width="2" stroke="#e8c1a0"></path><g><g transform="translate(0, 334)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g><g transform="translate(43.57446808510638, 279)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g><g transform="translate(119.82978723404256, 232)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g><g transform="translate(185.19148936170214, 186)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g><g transform="translate(272.3404255319149, 148)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g><g transform="translate(348.59574468085106, 104)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g><g transform="translate(413.9574468085106, 68)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g><g transform="translate(490.21276595744683, 15)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g><g transform="translate(512, 0)" style="pointer-events: none;"><circle r="3" fill="#e8c1a0" stroke="transparent" stroke-width="0" style="pointer-events: none;"></circle></g></g></g></svg>`;

//   console.log(convertTextWithoutDom(svg));

//   return Buffer.from(convertTextWithoutDom(svg)).toString("base64");
// }
