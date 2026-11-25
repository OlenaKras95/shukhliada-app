/*
 * Навігатор репо. Підключення на будь-якій сторінці — один рядок:
 *
 *   <script src="ROOT_nav/nav.js" data-root="ROOT"></script>
 *
 * де ROOT — шлях від сторінки до кореня репо: "./" для кореня,
 * "../" для research/page.html, "../../" для research/screens/page.html.
 * Скрипт сам підтягує _nav/tree.js, _nav/nav.css та іконку сайту favicon.svg.
 *
 * Будова — як у навігаторі куратора, але без іконок: підпис «Шухляда · репо» і кнопка згортання;
 * гілки без своєї сторінки («Екрани», групи) згортаються кліком по назві;
 * згорнутий навігатор — вузька смуга з кнопкою «Розгорнути». Навігатор живе в Shadow DOM:
 * стилі сторінок його не чіпають, і він однаковий скрізь.
 */
(function () {
  // Сторінка всередині iframe — без навігатора.
  if (window.self !== window.top) return;

  var script = document.currentScript;
  var root = (script && script.getAttribute("data-root")) || "./";
  if (root.slice(-1) !== "/") root += "/";
  var KEY_OPEN = "repo-nav-open";           // які вузли розгорнуто
  var KEY_COLLAPSED = "repo-nav-collapsed"; // "1" — навігатор згорнуто у вузьку смугу

  function resolve(path) { return new URL(root + path, document.baseURI).href; }

  // Порівнюємо адреси без query і без кінцевого index.html.
  function normalize(href, keepHash) {
    var u = new URL(href, document.baseURI);
    return u.origin + decodeURI(u.pathname).replace(/\/index\.html$/, "/") + (keepHash ? u.hash : "");
  }

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
          if (!node.href) a.addEventListener("click", toggle);
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

    var head = document.createElement("div");
    head.className = "repo-nav-head";
    var label = document.createElement("a");
    label.className = "repo-nav-label";
    label.href = resolve("index.html");
    label.textContent = "Шухляда · репо";
    head.appendChild(label);

    var list = renderList(tree, 0);
    list.id = "repo-nav-tree";

    // Кнопка згортає весь навігатор у вузьку смугу
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
