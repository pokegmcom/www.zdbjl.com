/*! jq-lite - 极简 jQuery 兼容层（约 1.2KB），仅实现本站用到的 API */
(function (w, d) {
  function W(nodes) { this.n = nodes; }
  W.prototype.each = function (fn) {
    for (var i = 0; i < this.n.length; i++) fn.call(this.n[i], i, this.n[i]);
    return this;
  };
  W.prototype.ready = function (fn) {
    if (d.readyState !== "loading") fn();
    else d.addEventListener("DOMContentLoaded", fn);
    return this;
  };
  W.prototype.on = function (ev, fn) {
    return this.each(function () { this.addEventListener(ev, fn); });
  };
  W.prototype.click = function (fn) {
    return fn ? this.on("click", fn) : this.each(function () { this.click(); });
  };
  W.prototype.scroll = function (fn) { return this.on("scroll", fn); };
  W.prototype.addClass = function (c) {
    return this.each(function () { this.classList.add(c); });
  };
  W.prototype.removeClass = function (c) {
    return this.each(function () { this.classList.remove(c); });
  };
  W.prototype.toggleClass = function (c) {
    return this.each(function () { this.classList.toggle(c); });
  };
  W.prototype.hasClass = function (c) {
    return !!(this.n[0] && this.n[0].classList && this.n[0].classList.contains(c));
  };
  W.prototype.attr = function (k, v) {
    if (v === undefined) { var e = this.n[0]; return e && e.getAttribute ? e.getAttribute(k) : undefined; }
    return this.each(function () { this.setAttribute(k, v); });
  };
  W.prototype.data = function (k) {
    var e = this.n[0];
    if (!e) return undefined;
    var v = e.getAttribute("data-" + k);
    return v;
  };
  W.prototype.append = function (html) {
    return this.each(function () { this.insertAdjacentHTML("beforeend", html); });
  };
  W.prototype.remove = function () {
    return this.each(function () { if (this.parentNode) this.parentNode.removeChild(this); });
  };
  W.prototype.show = function () {
    return this.each(function () { this.style.display = ""; });
  };
  W.prototype.hide = function () {
    return this.each(function () { this.style.display = "none"; });
  };
  W.prototype.scrollTop = function (v) {
    var e = this.n[0];
    if (!e) return 0;
    if (e === w || e === d || e === d.body || e === d.documentElement) {
      var y = w.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop || 0;
      if (v === undefined) return y;
      w.scrollTo(0, v);
      return this;
    }
    if (v === undefined) return e.scrollTop;
    e.scrollTop = v;
    return this;
  };
  W.prototype.length = 0;

  function $(sel) {
    if (typeof sel === "function") {
      if (d.readyState !== "loading") sel();
      else d.addEventListener("DOMContentLoaded", sel);
      return;
    }
    if (sel === w || sel === d) return new W([sel]);
    if (sel && sel.nodeType === 1) return new W([sel]);
    if (typeof sel === "string") return new W(Array.prototype.slice.call(d.querySelectorAll(sel)));
    return new W([]);
  }
  $.fn = W.prototype;
  w.$ = w.jQuery = $;
})(window, document);
