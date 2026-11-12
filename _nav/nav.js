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
      // У запасному режимі підсвічуємо лише сторінку, а не її пункти-розділи з #якорем.
      var on = exact ? normalize(a.href) === here
                     : (a.hash === "" && normalize(a.href) === here);
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

    // Пункт із children — дропдаун: стрілка ховає/показує підпункти,
    // клік по назві, як і раніше, відкриває сторінку.
    // Розгорнуто той пункт, на сторінці якого ми зараз; вибір людини пам'ятаємо.
    var here = normalize(location.href).replace(/#.*$/, "");
    var subId = 0;

    function readOpen(key) {
      try { return localStorage.getItem("repo-nav:" + key); } catch (e) { return null; }
    }
    function saveOpen(key, open) {
      try { localStorage.setItem("repo-nav:" + key, open ? "1" : "0"); } catch (e) { /* без збереження */ }
    }

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
          var hasKids = item.children && item.children.length;
          var row = document.createElement("div");
          row.className = "repo-nav__row" + (hasKids ? "" : " is-leaf");
          row.style.setProperty("--depth", depth);

          var a = document.createElement("a");
          a.className = "repo-nav__link";
          a.href = resolve(item.path);
          a.textContent = item.title;

          if (hasKids) {
            var sub = list(item.children, depth + 1);
            sub.id = "repo-nav-sub-" + (++subId);
            var saved = readOpen(item.path);
            var isHere = normalize(a.href).replace(/#.*$/, "") === here;
            var open = saved === null ? isHere : saved === "1";

            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "repo-nav__toggle";
            btn.setAttribute("aria-controls", sub.id);
            btn.setAttribute("aria-label", "Розгорнути або згорнути: " + item.title);
            btn.setAttribute("aria-expanded", open ? "true" : "false");
            sub.hidden = !open;
            btn.addEventListener("click", function () {
              var next = btn.getAttribute("aria-expanded") !== "true";
              btn.setAttribute("aria-expanded", next ? "true" : "false");
              sub.hidden = !next;
              saveOpen(item.path, next);
            });

            row.appendChild(btn);
            row.appendChild(a);
            li.appendChild(row);
            li.appendChild(sub);
          } else {
            row.appendChild(a);
            li.appendChild(row);
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
