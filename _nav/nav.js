/*
 * Навігатор репо. Підключення на будь-якій сторінці — один рядок:
 *
 *   <script src="ROOT_nav/nav.js" data-root="ROOT"></script>
 *
 * де ROOT — шлях від сторінки до кореня репо: "./" для кореня,
 * "../" для research/page.html, "../../" для research/screens/page.html.
 * Скрипт сам підтягує _nav/tree.js, _nav/nav.css та іконку сайту favicon.svg.
 * Для темної сторінки додай клас на <html class="nav-dark"> — навігатор стане темним.
 *
 * Будова — як у навігаторі куратора: підпис «Шухляда · репо» і кнопка згортання;
 * вузли верхнього рівня з іконками; гілки без своєї сторінки («Екрани», групи) згортаються
 * кліком по назві; згорнутий навігатор — рейка з іконками. Навігатор живе в Shadow DOM:
 * стилі сторінок його не чіпають, і він однаковий скрізь.
 */
(function () {
  // Сторінка всередині iframe — без навігатора.
  if (window.self !== window.top) return;

  var script = document.currentScript;
  var root = (script && script.getAttribute("data-root")) || "./";
  if (root.slice(-1) !== "/") root += "/";
  var KEY_OPEN = "repo-nav-open";           // які вузли розгорнуто
  var KEY_COLLAPSED = "repo-nav-collapsed"; // "1" — навігатор згорнуто в рейку

  function resolve(path) { return new URL(root + path, document.baseURI).href; }

  // Порівнюємо адреси без query і без кінцевого index.html.
  function normalize(href, keepHash) {
    var u = new URL(href, document.baseURI);
    return u.origin + decodeURI(u.pathname).replace(/\/index\.html$/, "/") + (keepHash ? u.hash : "");
  }

  // Іконки вузлів верхнього рівня (Lucide 24×24, stroke). Ключ — icon у tree.js.
  var ICONS = {
    house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>'
  };

  // Стилі для самої сторінки (лише відступ під навігатор) і для Shadow DOM — той самий файл.
  var pageCss = document.createElement("link");
  pageCss.rel = "stylesheet";
  pageCss.href = root + "_nav/nav.css";
  document.head.appendChild(pageCss);

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
    var herePage = normalize(location.href);
    var links = [];
    var uid = 0;

    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY_OPEN) || "{}") || {}; } catch (e) { saved = {}; }
    function save() { try { localStorage.setItem(KEY_OPEN, JSON.stringify(saved)); } catch (e) { /* без збереження */ } }
    var collapsed = false;
    try { collapsed = localStorage.getItem(KEY_COLLAPSED) === "1"; } catch (e) { /* розгорнуто */ }

    function containsHere(node) {
      if (node.href && normalize(resolve(node.href)) === herePage) return true;
      return (node.children || []).some(containsHere);
    }

    function renderList(nodes, depth) {
      var ul = document.createElement("ul");
      ul.className = "nav-list";
      nodes.forEach(function (node) {
        var li = document.createElement("li");
        var row = document.createElement("div");
        row.className = "nav-row";
        var hasKids = node.children && node.children.length;

        var a;
        if (node.href) {
          a = document.createElement("a");
          a.className = "nav-link";
          a.href = resolve(node.href);
          links.push(a);
        } else {
          // Гілка без своєї сторінки: підпис, клік по ньому згортає гілку
          a = document.createElement("span");
          a.className = "nav-link nav-branch";
        }
        a.textContent = node.title;
        if (depth === 0) {
          a.title = node.title;
          if (containsHere(node)) a.classList.add("is-here");
          if (node.icon && ICONS[node.icon]) {
            a.insertAdjacentHTML("afterbegin", '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[node.icon] + "</svg>");
          } else if (window.console) console.warn("Навігатор: вузол верхнього рівня без icon — " + node.title);
        }
        var key = node.href || "branch:" + node.title;

        if (hasKids) {
          var id = "nav-sub-" + (++uid);
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "nav-toggle";
          btn.setAttribute("aria-controls", id);
          btn.setAttribute("aria-label", "Розгорнути або згорнути: " + node.title);
          var open = key in saved ? saved[key] : containsHere(node);
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          var sub = renderList(node.children, depth + 1);
          sub.id = id;
          sub.hidden = !open;
          var toggle = function () {
            var now = btn.getAttribute("aria-expanded") !== "true";
            btn.setAttribute("aria-expanded", now ? "true" : "false");
            sub.hidden = !now;
            saved[key] = now;
            save();
          };
          btn.addEventListener("click", toggle);
          if (!node.href) a.addEventListener("click", function () {
            // Згорнутий навігатор: клік по іконці гілки розгортає навігатор і цю гілку
            if (depth === 0 && collapsed) {
              setCollapsed(false);
              if (btn.getAttribute("aria-expanded") === "true") return;
            }
            toggle();
          });
          row.appendChild(btn);
          row.appendChild(a);
          li.appendChild(row);
          li.appendChild(sub);
        } else {
          row.classList.add("is-leaf");
          row.appendChild(a);
          li.appendChild(row);
        }
        ul.appendChild(li);
      });
      return ul;
    }

    // Поточна сторінка — aria-current="page"; розділ сторінки за #якорем — aria-current="location".
    // Якщо якір веде на стан, який сам є вузлом дерева, підсвічуємо його, а не сторінку.
    function markCurrent() {
      var full = normalize(location.href, true);
      var exactHash = location.hash && links.some(function (a) { return a.hash && normalize(a.href, true) === full; });
      links.forEach(function (a) {
        a.removeAttribute("aria-current");
        if (a.hash) {
          if (exactHash && normalize(a.href, true) === full) a.setAttribute("aria-current", "location");
        } else if (normalize(a.href) === herePage) {
          a.setAttribute("aria-current", "page");
        }
      });
    }

    var nav = document.createElement("nav");
    nav.className = "repo-nav";
    nav.setAttribute("aria-label", "Сторінки репо");
    if (document.documentElement.classList.contains("nav-dark")) nav.classList.add("is-dark");

    var head = document.createElement("div");
    head.className = "repo-nav-head";
    var label = document.createElement("a");
    label.className = "repo-nav-label";
    label.href = resolve("index.html");
    label.textContent = "Шухляда · репо";
    head.appendChild(label);

    var list = renderList(tree, 0);
    list.id = "repo-nav-tree";

    // Кнопка згортає весь навігатор у рейку з іконками
    var collapseBtn = document.createElement("button");
    collapseBtn.type = "button";
    collapseBtn.className = "repo-nav-collapse";
    collapseBtn.setAttribute("aria-controls", list.id);
    collapseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    function setCollapsed(next) {
      collapsed = next;
      try { localStorage.setItem(KEY_COLLAPSED, collapsed ? "1" : "0"); } catch (e) { /* без збереження */ }
      apply();
    }
    function apply() {
      nav.classList.toggle("is-collapsed", collapsed);
      document.body.classList.toggle("repo-nav-collapsed", collapsed);
      collapseBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
      collapseBtn.setAttribute("aria-label", collapsed ? "Розгорнути навігатор" : "Згорнути навігатор");
      collapseBtn.title = collapseBtn.getAttribute("aria-label");
      label.hidden = collapsed;
    }
    collapseBtn.addEventListener("click", function () { setCollapsed(!collapsed); });
    head.appendChild(collapseBtn);

    nav.appendChild(head);
    nav.appendChild(list);

    // Окремий хост із Shadow DOM: стилі сторінки всередину не протікають
    var host = document.createElement("div");
    host.id = "repo-nav-host";
    var shadow = host.attachShadow({ mode: "open" });
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = root + "_nav/nav.css";
    shadow.appendChild(css);
    shadow.appendChild(nav);
    document.body.insertBefore(host, document.body.firstChild);
    document.body.classList.add("has-repo-nav");
    apply();
    markCurrent();
    window.addEventListener("hashchange", markCurrent);
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
