/*
 * Навігатор репо. Підключення на будь-якій сторінці — один рядок:
 *
 *   <script src="ROOT_nav/nav.js" data-root="ROOT"></script>
 *
 * де ROOT — шлях від сторінки до кореня репо: "./" для кореня,
 * "../" для research/page.html, "../../" для research/screens/page.html.
 * Скрипт сам підтягує _nav/nav.css, _nav/tree.js і іконку сайту favicon.svg.
 * Для темної сторінки додай клас на <html class="nav-dark"> — навігатор стане темним.
 */
(function () {
  var script = document.currentScript;
  var root = (script && script.getAttribute("data-root")) || "./";
  if (root.slice(-1) !== "/") root += "/";

  function resolve(path) {
    return new URL(root + path, document.baseURI).href;
  }

  // Порівнюємо адреси без query і без кінцевого index.html.
  // Hash враховуємо: стан екрана може жити на тій самій сторінці під #якорем.
  function normalize(href) {
    var u = new URL(href, document.baseURI);
    return (u.origin + u.pathname).replace(/\/index\.html$/, "/") + u.hash;
  }

  function markCurrent(nav) {
    var here = normalize(location.href);
    var links = nav.querySelectorAll(".repo-nav__link");
    // Якщо жоден пункт не збігся разом з #якорем (якір усередині сторінки,
    // а не стан екрана в дереві) — порівнюємо без якоря.
    var exact = Array.prototype.some.call(links, function (a) { return normalize(a.href) === here; });
    if (!exact) here = here.replace(/#.*$/, "");
    links.forEach(function (a) {
      var target = exact ? normalize(a.href) : normalize(a.href).replace(/#.*$/, "");
      var on = target === here;
      a.classList.toggle("is-current", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = root + "_nav/nav.css";
  document.head.appendChild(css);

  // Іконка сайту для всіх сторінок. Без неї браузер шукає /favicon.ico
  // у корені домену github.io, поза репо, і отримує 404.
  if (!document.querySelector('link[rel~="icon"]')) {
    var icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.href = root + "favicon.svg";
    document.head.appendChild(icon);
  }

  function build() {
    var tree = window.NAV_TREE || [];

    var nav = document.createElement("nav");
    nav.className = "repo-nav";
    nav.setAttribute("aria-label", "Навігатор репо");

    var head = document.createElement("a");
    head.className = "repo-nav__head";
    head.href = resolve("index.html");
    head.textContent = "shukhliada-app";
    nav.appendChild(head);

    function list(items, depth) {
      var ul = document.createElement("ul");
      ul.className = "repo-nav__list";
      items.forEach(function (item) {
        var li = document.createElement("li");
        if (item.branch) {
          var label = document.createElement("div");
          label.className = "repo-nav__branch";
          label.textContent = item.branch;
          li.appendChild(label);
          li.appendChild(list(item.items || [], depth));
        } else {
          var a = document.createElement("a");
          a.className = "repo-nav__link";
          a.href = resolve(item.path);
          a.textContent = item.title;
          a.style.setProperty("--depth", depth);
          li.appendChild(a);
          if (item.children && item.children.length) {
            li.appendChild(list(item.children, depth + 1));
          }
        }
        ul.appendChild(li);
      });
      return ul;
    }

    nav.appendChild(list(tree, 0));
    markCurrent(nav);
    window.addEventListener("hashchange", function () { markCurrent(nav); });
    document.body.insertBefore(nav, document.body.firstChild);
    document.documentElement.classList.add("has-repo-nav");
  }

  var tree = document.createElement("script");
  tree.src = root + "_nav/tree.js";
  tree.onload = function () {
    if (document.body) build();
    else document.addEventListener("DOMContentLoaded", build);
  };
  tree.onerror = function () {
    console.error("Навігатор: не знайдено " + tree.src + " — перевір data-root.");
  };
  document.head.appendChild(tree);
})();
