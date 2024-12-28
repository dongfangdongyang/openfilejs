/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
!function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).pako = {})
}(this, (function (t) {
  "use strict";

  function e(t) {
    let e = t.length;
    for (; --e >= 0;) t[e] = 0
  }

  const a = 256, i = 286, n = 30, s = 15,
    r = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]),
    o = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]),
    l = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]),
    h = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), d = new Array(576);
  e(d);
  const _ = new Array(60);
  e(_);
  const f = new Array(512);
  e(f);
  const c = new Array(256);
  e(c);
  const u = new Array(29);
  e(u);
  const w = new Array(n);

  function m(t, e, a, i, n) {
    this.static_tree = t, this.extra_bits = e, this.extra_base = a, this.elems = i, this.max_length = n, this.has_stree = t && t.length
  }

  let b, g, p;

  function k(t, e) {
    this.dyn_tree = t, this.max_code = 0, this.stat_desc = e
  }

  e(w);
  const v = t => t < 256 ? f[t] : f[256 + (t >>> 7)], y = (t, e) => {
    t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255
  }, x = (t, e, a) => {
    t.bi_valid > 16 - a ? (t.bi_buf |= e << t.bi_valid & 65535, y(t, t.bi_buf), t.bi_buf = e >> 16 - t.bi_valid, t.bi_valid += a - 16) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += a)
  }, z = (t, e, a) => {
    x(t, a[2 * e], a[2 * e + 1])
  }, A = (t, e) => {
    let a = 0;
    do {
      a |= 1 & t, t >>>= 1, a <<= 1
    } while (--e > 0);
    return a >>> 1
  }, E = (t, e, a) => {
    const i = new Array(16);
    let n, r, o = 0;
    for (n = 1; n <= s; n++) o = o + a[n - 1] << 1, i[n] = o;
    for (r = 0; r <= e; r++) {
      let e = t[2 * r + 1];
      0 !== e && (t[2 * r] = A(i[e]++, e))
    }
  }, R = t => {
    let e;
    for (e = 0; e < i; e++) t.dyn_ltree[2 * e] = 0;
    for (e = 0; e < n; e++) t.dyn_dtree[2 * e] = 0;
    for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
    t.dyn_ltree[512] = 1, t.opt_len = t.static_len = 0, t.sym_next = t.matches = 0
  }, Z = t => {
    t.bi_valid > 8 ? y(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0
  }, U = (t, e, a, i) => {
    const n = 2 * e, s = 2 * a;
    return t[n] < t[s] || t[n] === t[s] && i[e] <= i[a]
  }, S = (t, e, a) => {
    const i = t.heap[a];
    let n = a << 1;
    for (; n <= t.heap_len && (n < t.heap_len && U(e, t.heap[n + 1], t.heap[n], t.depth) && n++, !U(e, i, t.heap[n], t.depth));) t.heap[a] = t.heap[n], a = n, n <<= 1;
    t.heap[a] = i
  }, D = (t, e, i) => {
    let n, s, l, h, d = 0;
    if (0 !== t.sym_next) do {
      n = 255 & t.pending_buf[t.sym_buf + d++], n += (255 & t.pending_buf[t.sym_buf + d++]) << 8, s = t.pending_buf[t.sym_buf + d++], 0 === n ? z(t, s, e) : (l = c[s], z(t, l + a + 1, e), h = r[l], 0 !== h && (s -= u[l], x(t, s, h)), n--, l = v(n), z(t, l, i), h = o[l], 0 !== h && (n -= w[l], x(t, n, h)))
    } while (d < t.sym_next);
    z(t, 256, e)
  }, T = (t, e) => {
    const a = e.dyn_tree, i = e.stat_desc.static_tree, n = e.stat_desc.has_stree, r = e.stat_desc.elems;
    let o, l, h, d = -1;
    for (t.heap_len = 0, t.heap_max = 573, o = 0; o < r; o++) 0 !== a[2 * o] ? (t.heap[++t.heap_len] = d = o, t.depth[o] = 0) : a[2 * o + 1] = 0;
    for (; t.heap_len < 2;) h = t.heap[++t.heap_len] = d < 2 ? ++d : 0, a[2 * h] = 1, t.depth[h] = 0, t.opt_len--, n && (t.static_len -= i[2 * h + 1]);
    for (e.max_code = d, o = t.heap_len >> 1; o >= 1; o--) S(t, a, o);
    h = r;
    do {
      o = t.heap[1], t.heap[1] = t.heap[t.heap_len--], S(t, a, 1), l = t.heap[1], t.heap[--t.heap_max] = o, t.heap[--t.heap_max] = l, a[2 * h] = a[2 * o] + a[2 * l], t.depth[h] = (t.depth[o] >= t.depth[l] ? t.depth[o] : t.depth[l]) + 1, a[2 * o + 1] = a[2 * l + 1] = h, t.heap[1] = h++, S(t, a, 1)
    } while (t.heap_len >= 2);
    t.heap[--t.heap_max] = t.heap[1], ((t, e) => {
      const a = e.dyn_tree, i = e.max_code, n = e.stat_desc.static_tree, r = e.stat_desc.has_stree,
        o = e.stat_desc.extra_bits, l = e.stat_desc.extra_base, h = e.stat_desc.max_length;
      let d, _, f, c, u, w, m = 0;
      for (c = 0; c <= s; c++) t.bl_count[c] = 0;
      for (a[2 * t.heap[t.heap_max] + 1] = 0, d = t.heap_max + 1; d < 573; d++) _ = t.heap[d], c = a[2 * a[2 * _ + 1] + 1] + 1, c > h && (c = h, m++), a[2 * _ + 1] = c, _ > i || (t.bl_count[c]++, u = 0, _ >= l && (u = o[_ - l]), w = a[2 * _], t.opt_len += w * (c + u), r && (t.static_len += w * (n[2 * _ + 1] + u)));
      if (0 !== m) {
        do {
          for (c = h - 1; 0 === t.bl_count[c];) c--;
          t.bl_count[c]--, t.bl_count[c + 1] += 2, t.bl_count[h]--, m -= 2
        } while (m > 0);
        for (c = h; 0 !== c; c--) for (_ = t.bl_count[c]; 0 !== _;) f = t.heap[--d], f > i || (a[2 * f + 1] !== c && (t.opt_len += (c - a[2 * f + 1]) * a[2 * f], a[2 * f + 1] = c), _--)
      }
    })(t, e), E(a, d, t.bl_count)
  }, O = (t, e, a) => {
    let i, n, s = -1, r = e[1], o = 0, l = 7, h = 4;
    for (0 === r && (l = 138, h = 3), e[2 * (a + 1) + 1] = 65535, i = 0; i <= a; i++) n = r, r = e[2 * (i + 1) + 1], ++o < l && n === r || (o < h ? t.bl_tree[2 * n] += o : 0 !== n ? (n !== s && t.bl_tree[2 * n]++, t.bl_tree[32]++) : o <= 10 ? t.bl_tree[34]++ : t.bl_tree[36]++, o = 0, s = n, 0 === r ? (l = 138, h = 3) : n === r ? (l = 6, h = 3) : (l = 7, h = 4))
  }, I = (t, e, a) => {
    let i, n, s = -1, r = e[1], o = 0, l = 7, h = 4;
    for (0 === r && (l = 138, h = 3), i = 0; i <= a; i++) if (n = r, r = e[2 * (i + 1) + 1], !(++o < l && n === r)) {
      if (o < h) do {
        z(t, n, t.bl_tree)
      } while (0 != --o); else 0 !== n ? (n !== s && (z(t, n, t.bl_tree), o--), z(t, 16, t.bl_tree), x(t, o - 3, 2)) : o <= 10 ? (z(t, 17, t.bl_tree), x(t, o - 3, 3)) : (z(t, 18, t.bl_tree), x(t, o - 11, 7));
      o = 0, s = n, 0 === r ? (l = 138, h = 3) : n === r ? (l = 6, h = 3) : (l = 7, h = 4)
    }
  };
  let F = !1;
  const L = (t, e, a, i) => {
    x(t, 0 + (i ? 1 : 0), 3), Z(t), y(t, a), y(t, ~a), a && t.pending_buf.set(t.window.subarray(e, e + a), t.pending), t.pending += a
  };
  var N = (t, e, i, n) => {
    let s, r, o = 0;
    t.level > 0 ? (2 === t.strm.data_type && (t.strm.data_type = (t => {
      let e, i = 4093624447;
      for (e = 0; e <= 31; e++, i >>>= 1) if (1 & i && 0 !== t.dyn_ltree[2 * e]) return 0;
      if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return 1;
      for (e = 32; e < a; e++) if (0 !== t.dyn_ltree[2 * e]) return 1;
      return 0
    })(t)), T(t, t.l_desc), T(t, t.d_desc), o = (t => {
      let e;
      for (O(t, t.dyn_ltree, t.l_desc.max_code), O(t, t.dyn_dtree, t.d_desc.max_code), T(t, t.bl_desc), e = 18; e >= 3 && 0 === t.bl_tree[2 * h[e] + 1]; e--) ;
      return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e
    })(t), s = t.opt_len + 3 + 7 >>> 3, r = t.static_len + 3 + 7 >>> 3, r <= s && (s = r)) : s = r = i + 5, i + 4 <= s && -1 !== e ? L(t, e, i, n) : 4 === t.strategy || r === s ? (x(t, 2 + (n ? 1 : 0), 3), D(t, d, _)) : (x(t, 4 + (n ? 1 : 0), 3), ((t, e, a, i) => {
      let n;
      for (x(t, e - 257, 5), x(t, a - 1, 5), x(t, i - 4, 4), n = 0; n < i; n++) x(t, t.bl_tree[2 * h[n] + 1], 3);
      I(t, t.dyn_ltree, e - 1), I(t, t.dyn_dtree, a - 1)
    })(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, o + 1), D(t, t.dyn_ltree, t.dyn_dtree)), R(t), n && Z(t)
  }, B = {
    _tr_init: t => {
      F || ((() => {
        let t, e, a, h, k;
        const v = new Array(16);
        for (a = 0, h = 0; h < 28; h++) for (u[h] = a, t = 0; t < 1 << r[h]; t++) c[a++] = h;
        for (c[a - 1] = h, k = 0, h = 0; h < 16; h++) for (w[h] = k, t = 0; t < 1 << o[h]; t++) f[k++] = h;
        for (k >>= 7; h < n; h++) for (w[h] = k << 7, t = 0; t < 1 << o[h] - 7; t++) f[256 + k++] = h;
        for (e = 0; e <= s; e++) v[e] = 0;
        for (t = 0; t <= 143;) d[2 * t + 1] = 8, t++, v[8]++;
        for (; t <= 255;) d[2 * t + 1] = 9, t++, v[9]++;
        for (; t <= 279;) d[2 * t + 1] = 7, t++, v[7]++;
        for (; t <= 287;) d[2 * t + 1] = 8, t++, v[8]++;
        for (E(d, 287, v), t = 0; t < n; t++) _[2 * t + 1] = 5, _[2 * t] = A(t, 5);
        b = new m(d, r, 257, i, s), g = new m(_, o, 0, n, s), p = new m(new Array(0), l, 0, 19, 7)
      })(), F = !0), t.l_desc = new k(t.dyn_ltree, b), t.d_desc = new k(t.dyn_dtree, g), t.bl_desc = new k(t.bl_tree, p), t.bi_buf = 0, t.bi_valid = 0, R(t)
    },
    _tr_stored_block: L,
    _tr_flush_block: N,
    _tr_tally: (t, e, i) => (t.pending_buf[t.sym_buf + t.sym_next++] = e, t.pending_buf[t.sym_buf + t.sym_next++] = e >> 8, t.pending_buf[t.sym_buf + t.sym_next++] = i, 0 === e ? t.dyn_ltree[2 * i]++ : (t.matches++, e--, t.dyn_ltree[2 * (c[i] + a + 1)]++, t.dyn_dtree[2 * v(e)]++), t.sym_next === t.sym_end),
    _tr_align: t => {
      x(t, 2, 3), z(t, 256, d), (t => {
        16 === t.bi_valid ? (y(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8)
      })(t)
    }
  };
  var C = (t, e, a, i) => {
    let n = 65535 & t | 0, s = t >>> 16 & 65535 | 0, r = 0;
    for (; 0 !== a;) {
      r = a > 2e3 ? 2e3 : a, a -= r;
      do {
        n = n + e[i++] | 0, s = s + n | 0
      } while (--r);
      n %= 65521, s %= 65521
    }
    return n | s << 16 | 0
  };
  const M = new Uint32Array((() => {
    let t, e = [];
    for (var a = 0; a < 256; a++) {
      t = a;
      for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
      e[a] = t
    }
    return e
  })());
  var H = (t, e, a, i) => {
    const n = M, s = i + a;
    t ^= -1;
    for (let a = i; a < s; a++) t = t >>> 8 ^ n[255 & (t ^ e[a])];
    return -1 ^ t
  }, j = {
    2: "need dictionary",
    1: "stream end",
    0: "",
    "-1": "file error",
    "-2": "stream error",
    "-3": "data error",
    "-4": "insufficient memory",
    "-5": "buffer error",
    "-6": "incompatible version"
  }, K = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    Z_BINARY: 0,
    Z_TEXT: 1,
    Z_UNKNOWN: 2,
    Z_DEFLATED: 8
  };
  const {_tr_init: P, _tr_stored_block: Y, _tr_flush_block: G, _tr_tally: X, _tr_align: W} = B, {
      Z_NO_FLUSH: q,
      Z_PARTIAL_FLUSH: J,
      Z_FULL_FLUSH: Q,
      Z_FINISH: V,
      Z_BLOCK: $,
      Z_OK: tt,
      Z_STREAM_END: et,
      Z_STREAM_ERROR: at,
      Z_DATA_ERROR: it,
      Z_BUF_ERROR: nt,
      Z_DEFAULT_COMPRESSION: st,
      Z_FILTERED: rt,
      Z_HUFFMAN_ONLY: ot,
      Z_RLE: lt,
      Z_FIXED: ht,
      Z_DEFAULT_STRATEGY: dt,
      Z_UNKNOWN: _t,
      Z_DEFLATED: ft
    } = K, ct = 258, ut = 262, wt = 42, mt = 113, bt = 666, gt = (t, e) => (t.msg = j[e], e),
    pt = t => 2 * t - (t > 4 ? 9 : 0), kt = t => {
      let e = t.length;
      for (; --e >= 0;) t[e] = 0
    }, vt = t => {
      let e, a, i, n = t.w_size;
      e = t.hash_size, i = e;
      do {
        a = t.head[--i], t.head[i] = a >= n ? a - n : 0
      } while (--e);
      e = n, i = e;
      do {
        a = t.prev[--i], t.prev[i] = a >= n ? a - n : 0
      } while (--e)
    };
  let yt = (t, e, a) => (e << t.hash_shift ^ a) & t.hash_mask;
  const xt = t => {
    const e = t.state;
    let a = e.pending;
    a > t.avail_out && (a = t.avail_out), 0 !== a && (t.output.set(e.pending_buf.subarray(e.pending_out, e.pending_out + a), t.next_out), t.next_out += a, e.pending_out += a, t.total_out += a, t.avail_out -= a, e.pending -= a, 0 === e.pending && (e.pending_out = 0))
  }, zt = (t, e) => {
    G(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, xt(t.strm)
  }, At = (t, e) => {
    t.pending_buf[t.pending++] = e
  }, Et = (t, e) => {
    t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e
  }, Rt = (t, e, a, i) => {
    let n = t.avail_in;
    return n > i && (n = i), 0 === n ? 0 : (t.avail_in -= n, e.set(t.input.subarray(t.next_in, t.next_in + n), a), 1 === t.state.wrap ? t.adler = C(t.adler, e, n, a) : 2 === t.state.wrap && (t.adler = H(t.adler, e, n, a)), t.next_in += n, t.total_in += n, n)
  }, Zt = (t, e) => {
    let a, i, n = t.max_chain_length, s = t.strstart, r = t.prev_length, o = t.nice_match;
    const l = t.strstart > t.w_size - ut ? t.strstart - (t.w_size - ut) : 0, h = t.window, d = t.w_mask, _ = t.prev,
      f = t.strstart + ct;
    let c = h[s + r - 1], u = h[s + r];
    t.prev_length >= t.good_match && (n >>= 2), o > t.lookahead && (o = t.lookahead);
    do {
      if (a = e, h[a + r] === u && h[a + r - 1] === c && h[a] === h[s] && h[++a] === h[s + 1]) {
        s += 2, a++;
        do {
        } while (h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && s < f);
        if (i = ct - (f - s), s = f - ct, i > r) {
          if (t.match_start = e, r = i, i >= o) break;
          c = h[s + r - 1], u = h[s + r]
        }
      }
    } while ((e = _[e & d]) > l && 0 != --n);
    return r <= t.lookahead ? r : t.lookahead
  }, Ut = t => {
    const e = t.w_size;
    let a, i, n;
    do {
      if (i = t.window_size - t.lookahead - t.strstart, t.strstart >= e + (e - ut) && (t.window.set(t.window.subarray(e, e + e - i), 0), t.match_start -= e, t.strstart -= e, t.block_start -= e, t.insert > t.strstart && (t.insert = t.strstart), vt(t), i += e), 0 === t.strm.avail_in) break;
      if (a = Rt(t.strm, t.window, t.strstart + t.lookahead, i), t.lookahead += a, t.lookahead + t.insert >= 3) for (n = t.strstart - t.insert, t.ins_h = t.window[n], t.ins_h = yt(t, t.ins_h, t.window[n + 1]); t.insert && (t.ins_h = yt(t, t.ins_h, t.window[n + 3 - 1]), t.prev[n & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = n, n++, t.insert--, !(t.lookahead + t.insert < 3));) ;
    } while (t.lookahead < ut && 0 !== t.strm.avail_in)
  }, St = (t, e) => {
    let a, i, n, s = t.pending_buf_size - 5 > t.w_size ? t.w_size : t.pending_buf_size - 5, r = 0, o = t.strm.avail_in;
    do {
      if (a = 65535, n = t.bi_valid + 42 >> 3, t.strm.avail_out < n) break;
      if (n = t.strm.avail_out - n, i = t.strstart - t.block_start, a > i + t.strm.avail_in && (a = i + t.strm.avail_in), a > n && (a = n), a < s && (0 === a && e !== V || e === q || a !== i + t.strm.avail_in)) break;
      r = e === V && a === i + t.strm.avail_in ? 1 : 0, Y(t, 0, 0, r), t.pending_buf[t.pending - 4] = a, t.pending_buf[t.pending - 3] = a >> 8, t.pending_buf[t.pending - 2] = ~a, t.pending_buf[t.pending - 1] = ~a >> 8, xt(t.strm), i && (i > a && (i = a), t.strm.output.set(t.window.subarray(t.block_start, t.block_start + i), t.strm.next_out), t.strm.next_out += i, t.strm.avail_out -= i, t.strm.total_out += i, t.block_start += i, a -= i), a && (Rt(t.strm, t.strm.output, t.strm.next_out, a), t.strm.next_out += a, t.strm.avail_out -= a, t.strm.total_out += a)
    } while (0 === r);
    return o -= t.strm.avail_in, o && (o >= t.w_size ? (t.matches = 2, t.window.set(t.strm.input.subarray(t.strm.next_in - t.w_size, t.strm.next_in), 0), t.strstart = t.w_size, t.insert = t.strstart) : (t.window_size - t.strstart <= o && (t.strstart -= t.w_size, t.window.set(t.window.subarray(t.w_size, t.w_size + t.strstart), 0), t.matches < 2 && t.matches++, t.insert > t.strstart && (t.insert = t.strstart)), t.window.set(t.strm.input.subarray(t.strm.next_in - o, t.strm.next_in), t.strstart), t.strstart += o, t.insert += o > t.w_size - t.insert ? t.w_size - t.insert : o), t.block_start = t.strstart), t.high_water < t.strstart && (t.high_water = t.strstart), r ? 4 : e !== q && e !== V && 0 === t.strm.avail_in && t.strstart === t.block_start ? 2 : (n = t.window_size - t.strstart, t.strm.avail_in > n && t.block_start >= t.w_size && (t.block_start -= t.w_size, t.strstart -= t.w_size, t.window.set(t.window.subarray(t.w_size, t.w_size + t.strstart), 0), t.matches < 2 && t.matches++, n += t.w_size, t.insert > t.strstart && (t.insert = t.strstart)), n > t.strm.avail_in && (n = t.strm.avail_in), n && (Rt(t.strm, t.window, t.strstart, n), t.strstart += n, t.insert += n > t.w_size - t.insert ? t.w_size - t.insert : n), t.high_water < t.strstart && (t.high_water = t.strstart), n = t.bi_valid + 42 >> 3, n = t.pending_buf_size - n > 65535 ? 65535 : t.pending_buf_size - n, s = n > t.w_size ? t.w_size : n, i = t.strstart - t.block_start, (i >= s || (i || e === V) && e !== q && 0 === t.strm.avail_in && i <= n) && (a = i > n ? n : i, r = e === V && 0 === t.strm.avail_in && a === i ? 1 : 0, Y(t, t.block_start, a, r), t.block_start += a, xt(t.strm)), r ? 3 : 1)
  }, Dt = (t, e) => {
    let a, i;
    for (; ;) {
      if (t.lookahead < ut) {
        if (Ut(t), t.lookahead < ut && e === q) return 1;
        if (0 === t.lookahead) break
      }
      if (a = 0, t.lookahead >= 3 && (t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 3 - 1]), a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== a && t.strstart - a <= t.w_size - ut && (t.match_length = Zt(t, a)), t.match_length >= 3) if (i = X(t, t.strstart - t.match_start, t.match_length - 3), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= 3) {
        t.match_length--;
        do {
          t.strstart++, t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 3 - 1]), a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart
        } while (0 != --t.match_length);
        t.strstart++
      } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 1]); else i = X(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
      if (i && (zt(t, !1), 0 === t.strm.avail_out)) return 1
    }
    return t.insert = t.strstart < 2 ? t.strstart : 2, e === V ? (zt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.sym_next && (zt(t, !1), 0 === t.strm.avail_out) ? 1 : 2
  }, Tt = (t, e) => {
    let a, i, n;
    for (; ;) {
      if (t.lookahead < ut) {
        if (Ut(t), t.lookahead < ut && e === q) return 1;
        if (0 === t.lookahead) break
      }
      if (a = 0, t.lookahead >= 3 && (t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 3 - 1]), a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = 2, 0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - ut && (t.match_length = Zt(t, a), t.match_length <= 5 && (t.strategy === rt || 3 === t.match_length && t.strstart - t.match_start > 4096) && (t.match_length = 2)), t.prev_length >= 3 && t.match_length <= t.prev_length) {
        n = t.strstart + t.lookahead - 3, i = X(t, t.strstart - 1 - t.prev_match, t.prev_length - 3), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;
        do {
          ++t.strstart <= n && (t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 3 - 1]), a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart)
        } while (0 != --t.prev_length);
        if (t.match_available = 0, t.match_length = 2, t.strstart++, i && (zt(t, !1), 0 === t.strm.avail_out)) return 1
      } else if (t.match_available) {
        if (i = X(t, 0, t.window[t.strstart - 1]), i && zt(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return 1
      } else t.match_available = 1, t.strstart++, t.lookahead--
    }
    return t.match_available && (i = X(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < 2 ? t.strstart : 2, e === V ? (zt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.sym_next && (zt(t, !1), 0 === t.strm.avail_out) ? 1 : 2
  };

  function Ot(t, e, a, i, n) {
    this.good_length = t, this.max_lazy = e, this.nice_length = a, this.max_chain = i, this.func = n
  }

  const It = [new Ot(0, 0, 0, 0, St), new Ot(4, 4, 8, 4, Dt), new Ot(4, 5, 16, 8, Dt), new Ot(4, 6, 32, 32, Dt), new Ot(4, 4, 16, 16, Tt), new Ot(8, 16, 32, 32, Tt), new Ot(8, 16, 128, 128, Tt), new Ot(8, 32, 128, 256, Tt), new Ot(32, 128, 258, 1024, Tt), new Ot(32, 258, 258, 4096, Tt)];

  function Ft() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = ft, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(1146), this.dyn_dtree = new Uint16Array(122), this.bl_tree = new Uint16Array(78), kt(this.dyn_ltree), kt(this.dyn_dtree), kt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(16), this.heap = new Uint16Array(573), kt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(573), kt(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
  }

  const Lt = t => {
    if (!t) return 1;
    const e = t.state;
    return !e || e.strm !== t || e.status !== wt && 57 !== e.status && 69 !== e.status && 73 !== e.status && 91 !== e.status && 103 !== e.status && e.status !== mt && e.status !== bt ? 1 : 0
  }, Nt = t => {
    if (Lt(t)) return gt(t, at);
    t.total_in = t.total_out = 0, t.data_type = _t;
    const e = t.state;
    return e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = 2 === e.wrap ? 57 : e.wrap ? wt : mt, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = -2, P(e), tt
  }, Bt = t => {
    const e = Nt(t);
    var a;
    return e === tt && ((a = t.state).window_size = 2 * a.w_size, kt(a.head), a.max_lazy_match = It[a.level].max_lazy, a.good_match = It[a.level].good_length, a.nice_match = It[a.level].nice_length, a.max_chain_length = It[a.level].max_chain, a.strstart = 0, a.block_start = 0, a.lookahead = 0, a.insert = 0, a.match_length = a.prev_length = 2, a.match_available = 0, a.ins_h = 0), e
  }, Ct = (t, e, a, i, n, s) => {
    if (!t) return at;
    let r = 1;
    if (e === st && (e = 6), i < 0 ? (r = 0, i = -i) : i > 15 && (r = 2, i -= 16), n < 1 || n > 9 || a !== ft || i < 8 || i > 15 || e < 0 || e > 9 || s < 0 || s > ht || 8 === i && 1 !== r) return gt(t, at);
    8 === i && (i = 9);
    const o = new Ft;
    return t.state = o, o.strm = t, o.status = wt, o.wrap = r, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = n + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + 3 - 1) / 3), o.window = new Uint8Array(2 * o.w_size), o.head = new Uint16Array(o.hash_size), o.prev = new Uint16Array(o.w_size), o.lit_bufsize = 1 << n + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new Uint8Array(o.pending_buf_size), o.sym_buf = o.lit_bufsize, o.sym_end = 3 * (o.lit_bufsize - 1), o.level = e, o.strategy = s, o.method = a, Bt(t)
  };
  var Mt = {
    deflateInit: (t, e) => Ct(t, e, ft, 15, 8, dt),
    deflateInit2: Ct,
    deflateReset: Bt,
    deflateResetKeep: Nt,
    deflateSetHeader: (t, e) => Lt(t) || 2 !== t.state.wrap ? at : (t.state.gzhead = e, tt),
    deflate: (t, e) => {
      if (Lt(t) || e > $ || e < 0) return t ? gt(t, at) : at;
      const a = t.state;
      if (!t.output || 0 !== t.avail_in && !t.input || a.status === bt && e !== V) return gt(t, 0 === t.avail_out ? nt : at);
      const i = a.last_flush;
      if (a.last_flush = e, 0 !== a.pending) {
        if (xt(t), 0 === t.avail_out) return a.last_flush = -1, tt
      } else if (0 === t.avail_in && pt(e) <= pt(i) && e !== V) return gt(t, nt);
      if (a.status === bt && 0 !== t.avail_in) return gt(t, nt);
      if (a.status === wt && 0 === a.wrap && (a.status = mt), a.status === wt) {
        let e = ft + (a.w_bits - 8 << 4) << 8, i = -1;
        if (i = a.strategy >= ot || a.level < 2 ? 0 : a.level < 6 ? 1 : 6 === a.level ? 2 : 3, e |= i << 6, 0 !== a.strstart && (e |= 32), e += 31 - e % 31, Et(a, e), 0 !== a.strstart && (Et(a, t.adler >>> 16), Et(a, 65535 & t.adler)), t.adler = 1, a.status = mt, xt(t), 0 !== a.pending) return a.last_flush = -1, tt
      }
      if (57 === a.status) if (t.adler = 0, At(a, 31), At(a, 139), At(a, 8), a.gzhead) At(a, (a.gzhead.text ? 1 : 0) + (a.gzhead.hcrc ? 2 : 0) + (a.gzhead.extra ? 4 : 0) + (a.gzhead.name ? 8 : 0) + (a.gzhead.comment ? 16 : 0)), At(a, 255 & a.gzhead.time), At(a, a.gzhead.time >> 8 & 255), At(a, a.gzhead.time >> 16 & 255), At(a, a.gzhead.time >> 24 & 255), At(a, 9 === a.level ? 2 : a.strategy >= ot || a.level < 2 ? 4 : 0), At(a, 255 & a.gzhead.os), a.gzhead.extra && a.gzhead.extra.length && (At(a, 255 & a.gzhead.extra.length), At(a, a.gzhead.extra.length >> 8 & 255)), a.gzhead.hcrc && (t.adler = H(t.adler, a.pending_buf, a.pending, 0)), a.gzindex = 0, a.status = 69; else if (At(a, 0), At(a, 0), At(a, 0), At(a, 0), At(a, 0), At(a, 9 === a.level ? 2 : a.strategy >= ot || a.level < 2 ? 4 : 0), At(a, 3), a.status = mt, xt(t), 0 !== a.pending) return a.last_flush = -1, tt;
      if (69 === a.status) {
        if (a.gzhead.extra) {
          let e = a.pending, i = (65535 & a.gzhead.extra.length) - a.gzindex;
          for (; a.pending + i > a.pending_buf_size;) {
            let n = a.pending_buf_size - a.pending;
            if (a.pending_buf.set(a.gzhead.extra.subarray(a.gzindex, a.gzindex + n), a.pending), a.pending = a.pending_buf_size, a.gzhead.hcrc && a.pending > e && (t.adler = H(t.adler, a.pending_buf, a.pending - e, e)), a.gzindex += n, xt(t), 0 !== a.pending) return a.last_flush = -1, tt;
            e = 0, i -= n
          }
          let n = new Uint8Array(a.gzhead.extra);
          a.pending_buf.set(n.subarray(a.gzindex, a.gzindex + i), a.pending), a.pending += i, a.gzhead.hcrc && a.pending > e && (t.adler = H(t.adler, a.pending_buf, a.pending - e, e)), a.gzindex = 0
        }
        a.status = 73
      }
      if (73 === a.status) {
        if (a.gzhead.name) {
          let e, i = a.pending;
          do {
            if (a.pending === a.pending_buf_size) {
              if (a.gzhead.hcrc && a.pending > i && (t.adler = H(t.adler, a.pending_buf, a.pending - i, i)), xt(t), 0 !== a.pending) return a.last_flush = -1, tt;
              i = 0
            }
            e = a.gzindex < a.gzhead.name.length ? 255 & a.gzhead.name.charCodeAt(a.gzindex++) : 0, At(a, e)
          } while (0 !== e);
          a.gzhead.hcrc && a.pending > i && (t.adler = H(t.adler, a.pending_buf, a.pending - i, i)), a.gzindex = 0
        }
        a.status = 91
      }
      if (91 === a.status) {
        if (a.gzhead.comment) {
          let e, i = a.pending;
          do {
            if (a.pending === a.pending_buf_size) {
              if (a.gzhead.hcrc && a.pending > i && (t.adler = H(t.adler, a.pending_buf, a.pending - i, i)), xt(t), 0 !== a.pending) return a.last_flush = -1, tt;
              i = 0
            }
            e = a.gzindex < a.gzhead.comment.length ? 255 & a.gzhead.comment.charCodeAt(a.gzindex++) : 0, At(a, e)
          } while (0 !== e);
          a.gzhead.hcrc && a.pending > i && (t.adler = H(t.adler, a.pending_buf, a.pending - i, i))
        }
        a.status = 103
      }
      if (103 === a.status) {
        if (a.gzhead.hcrc) {
          if (a.pending + 2 > a.pending_buf_size && (xt(t), 0 !== a.pending)) return a.last_flush = -1, tt;
          At(a, 255 & t.adler), At(a, t.adler >> 8 & 255), t.adler = 0
        }
        if (a.status = mt, xt(t), 0 !== a.pending) return a.last_flush = -1, tt
      }
      if (0 !== t.avail_in || 0 !== a.lookahead || e !== q && a.status !== bt) {
        let i = 0 === a.level ? St(a, e) : a.strategy === ot ? ((t, e) => {
          let a;
          for (; ;) {
            if (0 === t.lookahead && (Ut(t), 0 === t.lookahead)) {
              if (e === q) return 1;
              break
            }
            if (t.match_length = 0, a = X(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, a && (zt(t, !1), 0 === t.strm.avail_out)) return 1
          }
          return t.insert = 0, e === V ? (zt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.sym_next && (zt(t, !1), 0 === t.strm.avail_out) ? 1 : 2
        })(a, e) : a.strategy === lt ? ((t, e) => {
          let a, i, n, s;
          const r = t.window;
          for (; ;) {
            if (t.lookahead <= ct) {
              if (Ut(t), t.lookahead <= ct && e === q) return 1;
              if (0 === t.lookahead) break
            }
            if (t.match_length = 0, t.lookahead >= 3 && t.strstart > 0 && (n = t.strstart - 1, i = r[n], i === r[++n] && i === r[++n] && i === r[++n])) {
              s = t.strstart + ct;
              do {
              } while (i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && n < s);
              t.match_length = ct - (s - n), t.match_length > t.lookahead && (t.match_length = t.lookahead)
            }
            if (t.match_length >= 3 ? (a = X(t, 1, t.match_length - 3), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (a = X(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), a && (zt(t, !1), 0 === t.strm.avail_out)) return 1
          }
          return t.insert = 0, e === V ? (zt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.sym_next && (zt(t, !1), 0 === t.strm.avail_out) ? 1 : 2
        })(a, e) : It[a.level].func(a, e);
        if (3 !== i && 4 !== i || (a.status = bt), 1 === i || 3 === i) return 0 === t.avail_out && (a.last_flush = -1), tt;
        if (2 === i && (e === J ? W(a) : e !== $ && (Y(a, 0, 0, !1), e === Q && (kt(a.head), 0 === a.lookahead && (a.strstart = 0, a.block_start = 0, a.insert = 0))), xt(t), 0 === t.avail_out)) return a.last_flush = -1, tt
      }
      return e !== V ? tt : a.wrap <= 0 ? et : (2 === a.wrap ? (At(a, 255 & t.adler), At(a, t.adler >> 8 & 255), At(a, t.adler >> 16 & 255), At(a, t.adler >> 24 & 255), At(a, 255 & t.total_in), At(a, t.total_in >> 8 & 255), At(a, t.total_in >> 16 & 255), At(a, t.total_in >> 24 & 255)) : (Et(a, t.adler >>> 16), Et(a, 65535 & t.adler)), xt(t), a.wrap > 0 && (a.wrap = -a.wrap), 0 !== a.pending ? tt : et)
    },
    deflateEnd: t => {
      if (Lt(t)) return at;
      const e = t.state.status;
      return t.state = null, e === mt ? gt(t, it) : tt
    },
    deflateSetDictionary: (t, e) => {
      let a = e.length;
      if (Lt(t)) return at;
      const i = t.state, n = i.wrap;
      if (2 === n || 1 === n && i.status !== wt || i.lookahead) return at;
      if (1 === n && (t.adler = C(t.adler, e, a, 0)), i.wrap = 0, a >= i.w_size) {
        0 === n && (kt(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0);
        let t = new Uint8Array(i.w_size);
        t.set(e.subarray(a - i.w_size, a), 0), e = t, a = i.w_size
      }
      const s = t.avail_in, r = t.next_in, o = t.input;
      for (t.avail_in = a, t.next_in = 0, t.input = e, Ut(i); i.lookahead >= 3;) {
        let t = i.strstart, e = i.lookahead - 2;
        do {
          i.ins_h = yt(i, i.ins_h, i.window[t + 3 - 1]), i.prev[t & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = t, t++
        } while (--e);
        i.strstart = t, i.lookahead = 2, Ut(i)
      }
      return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = 2, i.match_available = 0, t.next_in = r, t.input = o, t.avail_in = s, i.wrap = n, tt
    },
    deflateInfo: "pako deflate (from Nodeca project)"
  };
  const Ht = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
  var jt = function (t) {
    const e = Array.prototype.slice.call(arguments, 1);
    for (; e.length;) {
      const a = e.shift();
      if (a) {
        if ("object" != typeof a) throw new TypeError(a + "must be non-object");
        for (const e in a) Ht(a, e) && (t[e] = a[e])
      }
    }
    return t
  }, Kt = t => {
    let e = 0;
    for (let a = 0, i = t.length; a < i; a++) e += t[a].length;
    const a = new Uint8Array(e);
    for (let e = 0, i = 0, n = t.length; e < n; e++) {
      let n = t[e];
      a.set(n, i), i += n.length
    }
    return a
  };
  let Pt = !0;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1))
  } catch (t) {
    Pt = !1
  }
  const Yt = new Uint8Array(256);
  for (let t = 0; t < 256; t++) Yt[t] = t >= 252 ? 6 : t >= 248 ? 5 : t >= 240 ? 4 : t >= 224 ? 3 : t >= 192 ? 2 : 1;
  Yt[254] = Yt[254] = 1;
  var Gt = t => {
    if ("function" == typeof TextEncoder && TextEncoder.prototype.encode) return (new TextEncoder).encode(t);
    let e, a, i, n, s, r = t.length, o = 0;
    for (n = 0; n < r; n++) a = t.charCodeAt(n), 55296 == (64512 & a) && n + 1 < r && (i = t.charCodeAt(n + 1), 56320 == (64512 & i) && (a = 65536 + (a - 55296 << 10) + (i - 56320), n++)), o += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
    for (e = new Uint8Array(o), s = 0, n = 0; s < o; n++) a = t.charCodeAt(n), 55296 == (64512 & a) && n + 1 < r && (i = t.charCodeAt(n + 1), 56320 == (64512 & i) && (a = 65536 + (a - 55296 << 10) + (i - 56320), n++)), a < 128 ? e[s++] = a : a < 2048 ? (e[s++] = 192 | a >>> 6, e[s++] = 128 | 63 & a) : a < 65536 ? (e[s++] = 224 | a >>> 12, e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a) : (e[s++] = 240 | a >>> 18, e[s++] = 128 | a >>> 12 & 63, e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a);
    return e
  }, Xt = (t, e) => {
    const a = e || t.length;
    if ("function" == typeof TextDecoder && TextDecoder.prototype.decode) return (new TextDecoder).decode(t.subarray(0, e));
    let i, n;
    const s = new Array(2 * a);
    for (n = 0, i = 0; i < a;) {
      let e = t[i++];
      if (e < 128) {
        s[n++] = e;
        continue
      }
      let r = Yt[e];
      if (r > 4) s[n++] = 65533, i += r - 1; else {
        for (e &= 2 === r ? 31 : 3 === r ? 15 : 7; r > 1 && i < a;) e = e << 6 | 63 & t[i++], r--;
        r > 1 ? s[n++] = 65533 : e < 65536 ? s[n++] = e : (e -= 65536, s[n++] = 55296 | e >> 10 & 1023, s[n++] = 56320 | 1023 & e)
      }
    }
    return ((t, e) => {
      if (e < 65534 && t.subarray && Pt) return String.fromCharCode.apply(null, t.length === e ? t : t.subarray(0, e));
      let a = "";
      for (let i = 0; i < e; i++) a += String.fromCharCode(t[i]);
      return a
    })(s, n)
  }, Wt = (t, e) => {
    (e = e || t.length) > t.length && (e = t.length);
    let a = e - 1;
    for (; a >= 0 && 128 == (192 & t[a]);) a--;
    return a < 0 || 0 === a ? e : a + Yt[t[a]] > e ? a : e
  };
  var qt = function () {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
  };
  const Jt = Object.prototype.toString, {
    Z_NO_FLUSH: Qt,
    Z_SYNC_FLUSH: Vt,
    Z_FULL_FLUSH: $t,
    Z_FINISH: te,
    Z_OK: ee,
    Z_STREAM_END: ae,
    Z_DEFAULT_COMPRESSION: ie,
    Z_DEFAULT_STRATEGY: ne,
    Z_DEFLATED: se
  } = K;

  function re(t) {
    this.options = jt({level: ie, method: se, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: ne}, t || {});
    let e = this.options;
    e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new qt, this.strm.avail_out = 0;
    let a = Mt.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
    if (a !== ee) throw new Error(j[a]);
    if (e.header && Mt.deflateSetHeader(this.strm, e.header), e.dictionary) {
      let t;
      if (t = "string" == typeof e.dictionary ? Gt(e.dictionary) : "[object ArrayBuffer]" === Jt.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, a = Mt.deflateSetDictionary(this.strm, t), a !== ee) throw new Error(j[a]);
      this._dict_set = !0
    }
  }

  function oe(t, e) {
    const a = new re(e);
    if (a.push(t, !0), a.err) throw a.msg || j[a.err];
    return a.result
  }

  re.prototype.push = function (t, e) {
    const a = this.strm, i = this.options.chunkSize;
    let n, s;
    if (this.ended) return !1;
    for (s = e === ~~e ? e : !0 === e ? te : Qt, "string" == typeof t ? a.input = Gt(t) : "[object ArrayBuffer]" === Jt.call(t) ? a.input = new Uint8Array(t) : a.input = t, a.next_in = 0, a.avail_in = a.input.length; ;) if (0 === a.avail_out && (a.output = new Uint8Array(i), a.next_out = 0, a.avail_out = i), (s === Vt || s === $t) && a.avail_out <= 6) this.onData(a.output.subarray(0, a.next_out)), a.avail_out = 0; else {
      if (n = Mt.deflate(a, s), n === ae) return a.next_out > 0 && this.onData(a.output.subarray(0, a.next_out)), n = Mt.deflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === ee;
      if (0 !== a.avail_out) {
        if (s > 0 && a.next_out > 0) this.onData(a.output.subarray(0, a.next_out)), a.avail_out = 0; else if (0 === a.avail_in) break
      } else this.onData(a.output)
    }
    return !0
  }, re.prototype.onData = function (t) {
    this.chunks.push(t)
  }, re.prototype.onEnd = function (t) {
    t === ee && (this.result = Kt(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
  };
  var le = {
    Deflate: re, deflate: oe, deflateRaw: function (t, e) {
      return (e = e || {}).raw = !0, oe(t, e)
    }, gzip: function (t, e) {
      return (e = e || {}).gzip = !0, oe(t, e)
    }, constants: K
  };
  const he = 16209;
  var de = function (t, e) {
    let a, i, n, s, r, o, l, h, d, _, f, c, u, w, m, b, g, p, k, v, y, x, z, A;
    const E = t.state;
    a = t.next_in, z = t.input, i = a + (t.avail_in - 5), n = t.next_out, A = t.output, s = n - (e - t.avail_out), r = n + (t.avail_out - 257), o = E.dmax, l = E.wsize, h = E.whave, d = E.wnext, _ = E.window, f = E.hold, c = E.bits, u = E.lencode, w = E.distcode, m = (1 << E.lenbits) - 1, b = (1 << E.distbits) - 1;
    t:do {
      c < 15 && (f += z[a++] << c, c += 8, f += z[a++] << c, c += 8), g = u[f & m];
      e:for (; ;) {
        if (p = g >>> 24, f >>>= p, c -= p, p = g >>> 16 & 255, 0 === p) A[n++] = 65535 & g; else {
          if (!(16 & p)) {
            if (0 == (64 & p)) {
              g = u[(65535 & g) + (f & (1 << p) - 1)];
              continue e
            }
            if (32 & p) {
              E.mode = 16191;
              break t
            }
            t.msg = "invalid literal/length code", E.mode = he;
            break t
          }
          k = 65535 & g, p &= 15, p && (c < p && (f += z[a++] << c, c += 8), k += f & (1 << p) - 1, f >>>= p, c -= p), c < 15 && (f += z[a++] << c, c += 8, f += z[a++] << c, c += 8), g = w[f & b];
          a:for (; ;) {
            if (p = g >>> 24, f >>>= p, c -= p, p = g >>> 16 & 255, !(16 & p)) {
              if (0 == (64 & p)) {
                g = w[(65535 & g) + (f & (1 << p) - 1)];
                continue a
              }
              t.msg = "invalid distance code", E.mode = he;
              break t
            }
            if (v = 65535 & g, p &= 15, c < p && (f += z[a++] << c, c += 8, c < p && (f += z[a++] << c, c += 8)), v += f & (1 << p) - 1, v > o) {
              t.msg = "invalid distance too far back", E.mode = he;
              break t
            }
            if (f >>>= p, c -= p, p = n - s, v > p) {
              if (p = v - p, p > h && E.sane) {
                t.msg = "invalid distance too far back", E.mode = he;
                break t
              }
              if (y = 0, x = _, 0 === d) {
                if (y += l - p, p < k) {
                  k -= p;
                  do {
                    A[n++] = _[y++]
                  } while (--p);
                  y = n - v, x = A
                }
              } else if (d < p) {
                if (y += l + d - p, p -= d, p < k) {
                  k -= p;
                  do {
                    A[n++] = _[y++]
                  } while (--p);
                  if (y = 0, d < k) {
                    p = d, k -= p;
                    do {
                      A[n++] = _[y++]
                    } while (--p);
                    y = n - v, x = A
                  }
                }
              } else if (y += d - p, p < k) {
                k -= p;
                do {
                  A[n++] = _[y++]
                } while (--p);
                y = n - v, x = A
              }
              for (; k > 2;) A[n++] = x[y++], A[n++] = x[y++], A[n++] = x[y++], k -= 3;
              k && (A[n++] = x[y++], k > 1 && (A[n++] = x[y++]))
            } else {
              y = n - v;
              do {
                A[n++] = A[y++], A[n++] = A[y++], A[n++] = A[y++], k -= 3
              } while (k > 2);
              k && (A[n++] = A[y++], k > 1 && (A[n++] = A[y++]))
            }
            break
          }
        }
        break
      }
    } while (a < i && n < r);
    k = c >> 3, a -= k, c -= k << 3, f &= (1 << c) - 1, t.next_in = a, t.next_out = n, t.avail_in = a < i ? i - a + 5 : 5 - (a - i), t.avail_out = n < r ? r - n + 257 : 257 - (n - r), E.hold = f, E.bits = c
  };
  const _e = 15,
    fe = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]),
    ce = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]),
    ue = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]),
    we = new Uint8Array([16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
  var me = (t, e, a, i, n, s, r, o) => {
    const l = o.bits;
    let h, d, _, f, c, u, w = 0, m = 0, b = 0, g = 0, p = 0, k = 0, v = 0, y = 0, x = 0, z = 0, A = null;
    const E = new Uint16Array(16), R = new Uint16Array(16);
    let Z, U, S, D = null;
    for (w = 0; w <= _e; w++) E[w] = 0;
    for (m = 0; m < i; m++) E[e[a + m]]++;
    for (p = l, g = _e; g >= 1 && 0 === E[g]; g--) ;
    if (p > g && (p = g), 0 === g) return n[s++] = 20971520, n[s++] = 20971520, o.bits = 1, 0;
    for (b = 1; b < g && 0 === E[b]; b++) ;
    for (p < b && (p = b), y = 1, w = 1; w <= _e; w++) if (y <<= 1, y -= E[w], y < 0) return -1;
    if (y > 0 && (0 === t || 1 !== g)) return -1;
    for (R[1] = 0, w = 1; w < _e; w++) R[w + 1] = R[w] + E[w];
    for (m = 0; m < i; m++) 0 !== e[a + m] && (r[R[e[a + m]]++] = m);
    if (0 === t ? (A = D = r, u = 20) : 1 === t ? (A = fe, D = ce, u = 257) : (A = ue, D = we, u = 0), z = 0, m = 0, w = b, c = s, k = p, v = 0, _ = -1, x = 1 << p, f = x - 1, 1 === t && x > 852 || 2 === t && x > 592) return 1;
    for (; ;) {
      Z = w - v, r[m] + 1 < u ? (U = 0, S = r[m]) : r[m] >= u ? (U = D[r[m] - u], S = A[r[m] - u]) : (U = 96, S = 0), h = 1 << w - v, d = 1 << k, b = d;
      do {
        d -= h, n[c + (z >> v) + d] = Z << 24 | U << 16 | S | 0
      } while (0 !== d);
      for (h = 1 << w - 1; z & h;) h >>= 1;
      if (0 !== h ? (z &= h - 1, z += h) : z = 0, m++, 0 == --E[w]) {
        if (w === g) break;
        w = e[a + r[m]]
      }
      if (w > p && (z & f) !== _) {
        for (0 === v && (v = p), c += b, k = w - v, y = 1 << k; k + v < g && (y -= E[k + v], !(y <= 0));) k++, y <<= 1;
        if (x += 1 << k, 1 === t && x > 852 || 2 === t && x > 592) return 1;
        _ = z & f, n[_] = p << 24 | k << 16 | c - s | 0
      }
    }
    return 0 !== z && (n[c + z] = w - v << 24 | 64 << 16 | 0), o.bits = p, 0
  };
  const {
      Z_FINISH: be,
      Z_BLOCK: ge,
      Z_TREES: pe,
      Z_OK: ke,
      Z_STREAM_END: ve,
      Z_NEED_DICT: ye,
      Z_STREAM_ERROR: xe,
      Z_DATA_ERROR: ze,
      Z_MEM_ERROR: Ae,
      Z_BUF_ERROR: Ee,
      Z_DEFLATED: Re
    } = K, Ze = 16180, Ue = 16190, Se = 16191, De = 16192, Te = 16194, Oe = 16199, Ie = 16200, Fe = 16206, Le = 16209,
    Ne = t => (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);

  function Be() {
    this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
  }

  const Ce = t => {
    if (!t) return 1;
    const e = t.state;
    return !e || e.strm !== t || e.mode < Ze || e.mode > 16211 ? 1 : 0
  }, Me = t => {
    if (Ce(t)) return xe;
    const e = t.state;
    return t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = Ze, e.last = 0, e.havedict = 0, e.flags = -1, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Int32Array(852), e.distcode = e.distdyn = new Int32Array(592), e.sane = 1, e.back = -1, ke
  }, He = t => {
    if (Ce(t)) return xe;
    const e = t.state;
    return e.wsize = 0, e.whave = 0, e.wnext = 0, Me(t)
  }, je = (t, e) => {
    let a;
    if (Ce(t)) return xe;
    const i = t.state;
    return e < 0 ? (a = 0, e = -e) : (a = 5 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? xe : (null !== i.window && i.wbits !== e && (i.window = null), i.wrap = a, i.wbits = e, He(t))
  }, Ke = (t, e) => {
    if (!t) return xe;
    const a = new Be;
    t.state = a, a.strm = t, a.window = null, a.mode = Ze;
    const i = je(t, e);
    return i !== ke && (t.state = null), i
  };
  let Pe, Ye, Ge = !0;
  const Xe = t => {
    if (Ge) {
      Pe = new Int32Array(512), Ye = new Int32Array(32);
      let e = 0;
      for (; e < 144;) t.lens[e++] = 8;
      for (; e < 256;) t.lens[e++] = 9;
      for (; e < 280;) t.lens[e++] = 7;
      for (; e < 288;) t.lens[e++] = 8;
      for (me(1, t.lens, 0, 288, Pe, 0, t.work, {bits: 9}), e = 0; e < 32;) t.lens[e++] = 5;
      me(2, t.lens, 0, 32, Ye, 0, t.work, {bits: 5}), Ge = !1
    }
    t.lencode = Pe, t.lenbits = 9, t.distcode = Ye, t.distbits = 5
  }, We = (t, e, a, i) => {
    let n;
    const s = t.state;
    return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new Uint8Array(s.wsize)), i >= s.wsize ? (s.window.set(e.subarray(a - s.wsize, a), 0), s.wnext = 0, s.whave = s.wsize) : (n = s.wsize - s.wnext, n > i && (n = i), s.window.set(e.subarray(a - i, a - i + n), s.wnext), (i -= n) ? (s.window.set(e.subarray(a - i, a), 0), s.wnext = i, s.whave = s.wsize) : (s.wnext += n, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += n))), 0
  };
  var qe = {
    inflateReset: He,
    inflateReset2: je,
    inflateResetKeep: Me,
    inflateInit: t => Ke(t, 15),
    inflateInit2: Ke,
    inflate: (t, e) => {
      let a, i, n, s, r, o, l, h, d, _, f, c, u, w, m, b, g, p, k, v, y, x, z = 0;
      const A = new Uint8Array(4);
      let E, R;
      const Z = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
      if (Ce(t) || !t.output || !t.input && 0 !== t.avail_in) return xe;
      a = t.state, a.mode === Se && (a.mode = De), r = t.next_out, n = t.output, l = t.avail_out, s = t.next_in, i = t.input, o = t.avail_in, h = a.hold, d = a.bits, _ = o, f = l, x = ke;
      t:for (; ;) switch (a.mode) {
        case Ze:
          if (0 === a.wrap) {
            a.mode = De;
            break
          }
          for (; d < 16;) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          if (2 & a.wrap && 35615 === h) {
            0 === a.wbits && (a.wbits = 15), a.check = 0, A[0] = 255 & h, A[1] = h >>> 8 & 255, a.check = H(a.check, A, 2, 0), h = 0, d = 0, a.mode = 16181;
            break
          }
          if (a.head && (a.head.done = !1), !(1 & a.wrap) || (((255 & h) << 8) + (h >> 8)) % 31) {
            t.msg = "incorrect header check", a.mode = Le;
            break
          }
          if ((15 & h) !== Re) {
            t.msg = "unknown compression method", a.mode = Le;
            break
          }
          if (h >>>= 4, d -= 4, y = 8 + (15 & h), 0 === a.wbits && (a.wbits = y), y > 15 || y > a.wbits) {
            t.msg = "invalid window size", a.mode = Le;
            break
          }
          a.dmax = 1 << a.wbits, a.flags = 0, t.adler = a.check = 1, a.mode = 512 & h ? 16189 : Se, h = 0, d = 0;
          break;
        case 16181:
          for (; d < 16;) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          if (a.flags = h, (255 & a.flags) !== Re) {
            t.msg = "unknown compression method", a.mode = Le;
            break
          }
          if (57344 & a.flags) {
            t.msg = "unknown header flags set", a.mode = Le;
            break
          }
          a.head && (a.head.text = h >> 8 & 1), 512 & a.flags && 4 & a.wrap && (A[0] = 255 & h, A[1] = h >>> 8 & 255, a.check = H(a.check, A, 2, 0)), h = 0, d = 0, a.mode = 16182;
        case 16182:
          for (; d < 32;) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          a.head && (a.head.time = h), 512 & a.flags && 4 & a.wrap && (A[0] = 255 & h, A[1] = h >>> 8 & 255, A[2] = h >>> 16 & 255, A[3] = h >>> 24 & 255, a.check = H(a.check, A, 4, 0)), h = 0, d = 0, a.mode = 16183;
        case 16183:
          for (; d < 16;) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          a.head && (a.head.xflags = 255 & h, a.head.os = h >> 8), 512 & a.flags && 4 & a.wrap && (A[0] = 255 & h, A[1] = h >>> 8 & 255, a.check = H(a.check, A, 2, 0)), h = 0, d = 0, a.mode = 16184;
        case 16184:
          if (1024 & a.flags) {
            for (; d < 16;) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            a.length = h, a.head && (a.head.extra_len = h), 512 & a.flags && 4 & a.wrap && (A[0] = 255 & h, A[1] = h >>> 8 & 255, a.check = H(a.check, A, 2, 0)), h = 0, d = 0
          } else a.head && (a.head.extra = null);
          a.mode = 16185;
        case 16185:
          if (1024 & a.flags && (c = a.length, c > o && (c = o), c && (a.head && (y = a.head.extra_len - a.length, a.head.extra || (a.head.extra = new Uint8Array(a.head.extra_len)), a.head.extra.set(i.subarray(s, s + c), y)), 512 & a.flags && 4 & a.wrap && (a.check = H(a.check, i, c, s)), o -= c, s += c, a.length -= c), a.length)) break t;
          a.length = 0, a.mode = 16186;
        case 16186:
          if (2048 & a.flags) {
            if (0 === o) break t;
            c = 0;
            do {
              y = i[s + c++], a.head && y && a.length < 65536 && (a.head.name += String.fromCharCode(y))
            } while (y && c < o);
            if (512 & a.flags && 4 & a.wrap && (a.check = H(a.check, i, c, s)), o -= c, s += c, y) break t
          } else a.head && (a.head.name = null);
          a.length = 0, a.mode = 16187;
        case 16187:
          if (4096 & a.flags) {
            if (0 === o) break t;
            c = 0;
            do {
              y = i[s + c++], a.head && y && a.length < 65536 && (a.head.comment += String.fromCharCode(y))
            } while (y && c < o);
            if (512 & a.flags && 4 & a.wrap && (a.check = H(a.check, i, c, s)), o -= c, s += c, y) break t
          } else a.head && (a.head.comment = null);
          a.mode = 16188;
        case 16188:
          if (512 & a.flags) {
            for (; d < 16;) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            if (4 & a.wrap && h !== (65535 & a.check)) {
              t.msg = "header crc mismatch", a.mode = Le;
              break
            }
            h = 0, d = 0
          }
          a.head && (a.head.hcrc = a.flags >> 9 & 1, a.head.done = !0), t.adler = a.check = 0, a.mode = Se;
          break;
        case 16189:
          for (; d < 32;) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          t.adler = a.check = Ne(h), h = 0, d = 0, a.mode = Ue;
        case Ue:
          if (0 === a.havedict) return t.next_out = r, t.avail_out = l, t.next_in = s, t.avail_in = o, a.hold = h, a.bits = d, ye;
          t.adler = a.check = 1, a.mode = Se;
        case Se:
          if (e === ge || e === pe) break t;
        case De:
          if (a.last) {
            h >>>= 7 & d, d -= 7 & d, a.mode = Fe;
            break
          }
          for (; d < 3;) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          switch (a.last = 1 & h, h >>>= 1, d -= 1, 3 & h) {
            case 0:
              a.mode = 16193;
              break;
            case 1:
              if (Xe(a), a.mode = Oe, e === pe) {
                h >>>= 2, d -= 2;
                break t
              }
              break;
            case 2:
              a.mode = 16196;
              break;
            case 3:
              t.msg = "invalid block type", a.mode = Le
          }
          h >>>= 2, d -= 2;
          break;
        case 16193:
          for (h >>>= 7 & d, d -= 7 & d; d < 32;) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          if ((65535 & h) != (h >>> 16 ^ 65535)) {
            t.msg = "invalid stored block lengths", a.mode = Le;
            break
          }
          if (a.length = 65535 & h, h = 0, d = 0, a.mode = Te, e === pe) break t;
        case Te:
          a.mode = 16195;
        case 16195:
          if (c = a.length, c) {
            if (c > o && (c = o), c > l && (c = l), 0 === c) break t;
            n.set(i.subarray(s, s + c), r), o -= c, s += c, l -= c, r += c, a.length -= c;
            break
          }
          a.mode = Se;
          break;
        case 16196:
          for (; d < 14;) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          if (a.nlen = 257 + (31 & h), h >>>= 5, d -= 5, a.ndist = 1 + (31 & h), h >>>= 5, d -= 5, a.ncode = 4 + (15 & h), h >>>= 4, d -= 4, a.nlen > 286 || a.ndist > 30) {
            t.msg = "too many length or distance symbols", a.mode = Le;
            break
          }
          a.have = 0, a.mode = 16197;
        case 16197:
          for (; a.have < a.ncode;) {
            for (; d < 3;) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            a.lens[Z[a.have++]] = 7 & h, h >>>= 3, d -= 3
          }
          for (; a.have < 19;) a.lens[Z[a.have++]] = 0;
          if (a.lencode = a.lendyn, a.lenbits = 7, E = {bits: a.lenbits}, x = me(0, a.lens, 0, 19, a.lencode, 0, a.work, E), a.lenbits = E.bits, x) {
            t.msg = "invalid code lengths set", a.mode = Le;
            break
          }
          a.have = 0, a.mode = 16198;
        case 16198:
          for (; a.have < a.nlen + a.ndist;) {
            for (; z = a.lencode[h & (1 << a.lenbits) - 1], m = z >>> 24, b = z >>> 16 & 255, g = 65535 & z, !(m <= d);) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            if (g < 16) h >>>= m, d -= m, a.lens[a.have++] = g; else {
              if (16 === g) {
                for (R = m + 2; d < R;) {
                  if (0 === o) break t;
                  o--, h += i[s++] << d, d += 8
                }
                if (h >>>= m, d -= m, 0 === a.have) {
                  t.msg = "invalid bit length repeat", a.mode = Le;
                  break
                }
                y = a.lens[a.have - 1], c = 3 + (3 & h), h >>>= 2, d -= 2
              } else if (17 === g) {
                for (R = m + 3; d < R;) {
                  if (0 === o) break t;
                  o--, h += i[s++] << d, d += 8
                }
                h >>>= m, d -= m, y = 0, c = 3 + (7 & h), h >>>= 3, d -= 3
              } else {
                for (R = m + 7; d < R;) {
                  if (0 === o) break t;
                  o--, h += i[s++] << d, d += 8
                }
                h >>>= m, d -= m, y = 0, c = 11 + (127 & h), h >>>= 7, d -= 7
              }
              if (a.have + c > a.nlen + a.ndist) {
                t.msg = "invalid bit length repeat", a.mode = Le;
                break
              }
              for (; c--;) a.lens[a.have++] = y
            }
          }
          if (a.mode === Le) break;
          if (0 === a.lens[256]) {
            t.msg = "invalid code -- missing end-of-block", a.mode = Le;
            break
          }
          if (a.lenbits = 9, E = {bits: a.lenbits}, x = me(1, a.lens, 0, a.nlen, a.lencode, 0, a.work, E), a.lenbits = E.bits, x) {
            t.msg = "invalid literal/lengths set", a.mode = Le;
            break
          }
          if (a.distbits = 6, a.distcode = a.distdyn, E = {bits: a.distbits}, x = me(2, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, E), a.distbits = E.bits, x) {
            t.msg = "invalid distances set", a.mode = Le;
            break
          }
          if (a.mode = Oe, e === pe) break t;
        case Oe:
          a.mode = Ie;
        case Ie:
          if (o >= 6 && l >= 258) {
            t.next_out = r, t.avail_out = l, t.next_in = s, t.avail_in = o, a.hold = h, a.bits = d, de(t, f), r = t.next_out, n = t.output, l = t.avail_out, s = t.next_in, i = t.input, o = t.avail_in, h = a.hold, d = a.bits, a.mode === Se && (a.back = -1);
            break
          }
          for (a.back = 0; z = a.lencode[h & (1 << a.lenbits) - 1], m = z >>> 24, b = z >>> 16 & 255, g = 65535 & z, !(m <= d);) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          if (b && 0 == (240 & b)) {
            for (p = m, k = b, v = g; z = a.lencode[v + ((h & (1 << p + k) - 1) >> p)], m = z >>> 24, b = z >>> 16 & 255, g = 65535 & z, !(p + m <= d);) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            h >>>= p, d -= p, a.back += p
          }
          if (h >>>= m, d -= m, a.back += m, a.length = g, 0 === b) {
            a.mode = 16205;
            break
          }
          if (32 & b) {
            a.back = -1, a.mode = Se;
            break
          }
          if (64 & b) {
            t.msg = "invalid literal/length code", a.mode = Le;
            break
          }
          a.extra = 15 & b, a.mode = 16201;
        case 16201:
          if (a.extra) {
            for (R = a.extra; d < R;) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            a.length += h & (1 << a.extra) - 1, h >>>= a.extra, d -= a.extra, a.back += a.extra
          }
          a.was = a.length, a.mode = 16202;
        case 16202:
          for (; z = a.distcode[h & (1 << a.distbits) - 1], m = z >>> 24, b = z >>> 16 & 255, g = 65535 & z, !(m <= d);) {
            if (0 === o) break t;
            o--, h += i[s++] << d, d += 8
          }
          if (0 == (240 & b)) {
            for (p = m, k = b, v = g; z = a.distcode[v + ((h & (1 << p + k) - 1) >> p)], m = z >>> 24, b = z >>> 16 & 255, g = 65535 & z, !(p + m <= d);) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            h >>>= p, d -= p, a.back += p
          }
          if (h >>>= m, d -= m, a.back += m, 64 & b) {
            t.msg = "invalid distance code", a.mode = Le;
            break
          }
          a.offset = g, a.extra = 15 & b, a.mode = 16203;
        case 16203:
          if (a.extra) {
            for (R = a.extra; d < R;) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            a.offset += h & (1 << a.extra) - 1, h >>>= a.extra, d -= a.extra, a.back += a.extra
          }
          if (a.offset > a.dmax) {
            t.msg = "invalid distance too far back", a.mode = Le;
            break
          }
          a.mode = 16204;
        case 16204:
          if (0 === l) break t;
          if (c = f - l, a.offset > c) {
            if (c = a.offset - c, c > a.whave && a.sane) {
              t.msg = "invalid distance too far back", a.mode = Le;
              break
            }
            c > a.wnext ? (c -= a.wnext, u = a.wsize - c) : u = a.wnext - c, c > a.length && (c = a.length), w = a.window
          } else w = n, u = r - a.offset, c = a.length;
          c > l && (c = l), l -= c, a.length -= c;
          do {
            n[r++] = w[u++]
          } while (--c);
          0 === a.length && (a.mode = Ie);
          break;
        case 16205:
          if (0 === l) break t;
          n[r++] = a.length, l--, a.mode = Ie;
          break;
        case Fe:
          if (a.wrap) {
            for (; d < 32;) {
              if (0 === o) break t;
              o--, h |= i[s++] << d, d += 8
            }
            if (f -= l, t.total_out += f, a.total += f, 4 & a.wrap && f && (t.adler = a.check = a.flags ? H(a.check, n, f, r - f) : C(a.check, n, f, r - f)), f = l, 4 & a.wrap && (a.flags ? h : Ne(h)) !== a.check) {
              t.msg = "incorrect data check", a.mode = Le;
              break
            }
            h = 0, d = 0
          }
          a.mode = 16207;
        case 16207:
          if (a.wrap && a.flags) {
            for (; d < 32;) {
              if (0 === o) break t;
              o--, h += i[s++] << d, d += 8
            }
            if (4 & a.wrap && h !== (4294967295 & a.total)) {
              t.msg = "incorrect length check", a.mode = Le;
              break
            }
            h = 0, d = 0
          }
          a.mode = 16208;
        case 16208:
          x = ve;
          break t;
        case Le:
          x = ze;
          break t;
        case 16210:
          return Ae;
        default:
          return xe
      }
      return t.next_out = r, t.avail_out = l, t.next_in = s, t.avail_in = o, a.hold = h, a.bits = d, (a.wsize || f !== t.avail_out && a.mode < Le && (a.mode < Fe || e !== be)) && We(t, t.output, t.next_out, f - t.avail_out), _ -= t.avail_in, f -= t.avail_out, t.total_in += _, t.total_out += f, a.total += f, 4 & a.wrap && f && (t.adler = a.check = a.flags ? H(a.check, n, f, t.next_out - f) : C(a.check, n, f, t.next_out - f)), t.data_type = a.bits + (a.last ? 64 : 0) + (a.mode === Se ? 128 : 0) + (a.mode === Oe || a.mode === Te ? 256 : 0), (0 === _ && 0 === f || e === be) && x === ke && (x = Ee), x
    },
    inflateEnd: t => {
      if (Ce(t)) return xe;
      let e = t.state;
      return e.window && (e.window = null), t.state = null, ke
    },
    inflateGetHeader: (t, e) => {
      if (Ce(t)) return xe;
      const a = t.state;
      return 0 == (2 & a.wrap) ? xe : (a.head = e, e.done = !1, ke)
    },
    inflateSetDictionary: (t, e) => {
      const a = e.length;
      let i, n, s;
      return Ce(t) ? xe : (i = t.state, 0 !== i.wrap && i.mode !== Ue ? xe : i.mode === Ue && (n = 1, n = C(n, e, a, 0), n !== i.check) ? ze : (s = We(t, e, a, a), s ? (i.mode = 16210, Ae) : (i.havedict = 1, ke)))
    },
    inflateInfo: "pako inflate (from Nodeca project)"
  };
  var Je = function () {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1
  };
  const Qe = Object.prototype.toString, {
    Z_NO_FLUSH: Ve,
    Z_FINISH: $e,
    Z_OK: ta,
    Z_STREAM_END: ea,
    Z_NEED_DICT: aa,
    Z_STREAM_ERROR: ia,
    Z_DATA_ERROR: na,
    Z_MEM_ERROR: sa
  } = K;

  function ra(t) {
    this.options = jt({chunkSize: 65536, windowBits: 15, to: ""}, t || {});
    const e = this.options;
    e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(e.windowBits >= 0 && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new qt, this.strm.avail_out = 0;
    let a = qe.inflateInit2(this.strm, e.windowBits);
    if (a !== ta) throw new Error(j[a]);
    if (this.header = new Je, qe.inflateGetHeader(this.strm, this.header), e.dictionary && ("string" == typeof e.dictionary ? e.dictionary = Gt(e.dictionary) : "[object ArrayBuffer]" === Qe.call(e.dictionary) && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (a = qe.inflateSetDictionary(this.strm, e.dictionary), a !== ta))) throw new Error(j[a])
  }

  function oa(t, e) {
    const a = new ra(e);
    if (a.push(t), a.err) throw a.msg || j[a.err];
    return a.result
  }

  ra.prototype.push = function (t, e) {
    const a = this.strm, i = this.options.chunkSize, n = this.options.dictionary;
    let s, r, o;
    if (this.ended) return !1;
    for (r = e === ~~e ? e : !0 === e ? $e : Ve, "[object ArrayBuffer]" === Qe.call(t) ? a.input = new Uint8Array(t) : a.input = t, a.next_in = 0, a.avail_in = a.input.length; ;) {
      for (0 === a.avail_out && (a.output = new Uint8Array(i), a.next_out = 0, a.avail_out = i), s = qe.inflate(a, r), s === aa && n && (s = qe.inflateSetDictionary(a, n), s === ta ? s = qe.inflate(a, r) : s === na && (s = aa)); a.avail_in > 0 && s === ea && a.state.wrap > 0 && 0 !== t[a.next_in];) qe.inflateReset(a), s = qe.inflate(a, r);
      switch (s) {
        case ia:
        case na:
        case aa:
        case sa:
          return this.onEnd(s), this.ended = !0, !1
      }
      if (o = a.avail_out, a.next_out && (0 === a.avail_out || s === ea)) if ("string" === this.options.to) {
        let t = Wt(a.output, a.next_out), e = a.next_out - t, n = Xt(a.output, t);
        a.next_out = e, a.avail_out = i - e, e && a.output.set(a.output.subarray(t, t + e), 0), this.onData(n)
      } else this.onData(a.output.length === a.next_out ? a.output : a.output.subarray(0, a.next_out));
      if (s !== ta || 0 !== o) {
        if (s === ea) return s = qe.inflateEnd(this.strm), this.onEnd(s), this.ended = !0, !0;
        if (0 === a.avail_in) break
      }
    }
    return !0
  }, ra.prototype.onData = function (t) {
    this.chunks.push(t)
  }, ra.prototype.onEnd = function (t) {
    t === ta && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = Kt(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
  };
  var la = {
    Inflate: ra, inflate: oa, inflateRaw: function (t, e) {
      return (e = e || {}).raw = !0, oa(t, e)
    }, ungzip: oa, constants: K
  };
  const {Deflate: ha, deflate: da, deflateRaw: _a, gzip: fa} = le, {
    Inflate: ca,
    inflate: ua,
    inflateRaw: wa,
    ungzip: ma
  } = la;
  var ba = ha, ga = da, pa = _a, ka = fa, va = ca, ya = ua, xa = wa, za = ma, Aa = K, Ea = {
    Deflate: ba,
    deflate: ga,
    deflateRaw: pa,
    gzip: ka,
    Inflate: va,
    inflate: ya,
    inflateRaw: xa,
    ungzip: za,
    constants: Aa
  };
  t.Deflate = ba, t.Inflate = va, t.constants = Aa, t.default = Ea, t.deflate = ga, t.deflateRaw = pa, t.gzip = ka, t.inflate = ya, t.inflateRaw = xa, t.ungzip = za, Object.defineProperty(t, "__esModule", {value: !0})
}));

//
// // The Base64 + Gzip encoded string
// const encodedString = "H4sIAAAAAAAA/2zOwQqCQBDG8Xf5zpuY0MVzl65FDzDpqEs5u8yOFkTvHoIhpNfhx/efN3w6DyJeWpSmAztQ9BfWkRUlolcy3lH0WRfUguZ5kVWhh0NVyz/rDmOxcje6b7j9yqV6cc9X7+WXzIQNDi31fDouI5OYbnAIWy+3LDYvTCzNmSZoxddYkzHKhh6JP18AAAD//wEAAP//IvGuPwQBAAA=";
//
// // Step 2: Gzip Decompress
// const compressedData = base64ToUint8Array(encodedString);
// const decompressedData = pako.ungzip(compressedData, {to: 'string'});
// const json = JSON.parse(decompressedData)
// console.log("Decompressed Data:", json);
// json.energy = 200000;
// json.lastRollerBet = 200
// json.isRunning = false
// json.forceUpdate = "123455444444444"
// console.log("Decompressed Data:", json.energy);
// console.log("Decompressed Data:", json.lastRollerBet);
// console.log("Decompressed Data:", json);
//
// // Step 3: Gzip Compress and Base64 Encode
// const recompressedData = pako.gzip(json);
//
// const reEncodedString = uint8ArrayToBase64(recompressedData);
//
// console.log("Re-Encoded String:", reEncodedString);


function uint8ArrayToBase64(uint8Array) {
  const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
  return myBtoa(binaryString); // Encode binary string to Base64
}

// Step 1: Base64 Decode
function base64ToUint8Array(base64) {
  const binaryString = myAtob(base64); // Decode Base64 to binary string
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}


function myAtob(encodedStr) {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = '';
  let char1, char2, char3, char4;
  let i = 0;

  // Remove padding if any
  encodedStr = encodedStr.replace(/[^A-Za-z0-9\+\/=]/g, '');

  while (i < encodedStr.length) {
    // Get the 4 characters
    char1 = base64Chars.indexOf(encodedStr.charAt(i++));
    char2 = base64Chars.indexOf(encodedStr.charAt(i++));
    char3 = base64Chars.indexOf(encodedStr.charAt(i++));
    char4 = base64Chars.indexOf(encodedStr.charAt(i++));

    // Decode the 4 characters into 3 bytes
    str += String.fromCharCode((char1 << 2) | (char2 >> 4));
    if (char3 !== 64) {
      str += String.fromCharCode(((char2 & 15) << 4) | (char3 >> 2));
    }
    if (char4 !== 64) {
      str += String.fromCharCode(((char3 & 3) << 6) | char4);
    }
  }

  return str;
}


function myBtoa(str) {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let char1, char2, char3;
  let i = 0;

  // Ensure that the input string is in a valid format
  str = String(str);

  while (i < str.length) {
    // Get the first 3 characters, padding with 0 if necessary
    char1 = str.charCodeAt(i++);
    char2 = str.charCodeAt(i++);
    char3 = str.charCodeAt(i++);

    // Encode the 3 characters into 4 Base64 characters
    output += base64Chars.charAt(char1 >> 2);
    output += base64Chars.charAt(((char1 & 3) << 4) | (char2 >> 4));
    if (isNaN(char2)) {
      output += '=';
    } else {
      output += base64Chars.charAt(((char2 & 15) << 2) | (char3 >> 6));
    }
    if (isNaN(char2) || isNaN(char3)) {
      output += '=';
    } else {
      output += base64Chars.charAt(char3 & 63);
    }
  }
  return output;
}





var regex = /hortor002\.com$/;
// 捕获请求 URL
var url = $request.url;


console.log("$request.url 11111111111-11111111 Decompressed Data:", $request.url);
if (regex.test(url)){

  let obj = JSON.parse($response.body);
  // Step 2: Gzip Decompress
  const compressedData = base64ToUint8Array(obj.data);
  const decompressedData = pako.ungzip(compressedData, {to: 'string'});
  const json = JSON.parse(decompressedData)
  console.log("Decompressed Data:", json);
  json.energy = 200000;
  json.lastRollerBet = 200
  console.log("Decompressed Data:", json.energy);
  console.log("Decompressed Data:", json.lastRollerBet);
  // console.log("Decompressed Data:", json);

// Step 3: Gzip Compress and Base64 Encode
  const recompressedData = pako.gzip(json);

  const reEncodedString = uint8ArrayToBase64(recompressedData);
  obj.data = reEncodedString
  console.log("Re-Encoded String:", reEncodedString);
  $done({body: obj});
}



// //示例：使用 Pako 解压 gzip 响应
// if ($response) {
//   const gzippedData = encodedString; // 获取 gzip 数据
//   const decompressedData = pako.inflate(gzippedData, {to: 'string'}); // 解压为字符串
//   console.log("解压后的数据:", decompressedData);
//
// //返回解压后的数据
// $done({body: decompressedData});
// }
