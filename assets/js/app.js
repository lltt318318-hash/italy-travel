(() => {
  const ready = (fn) => {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  ready(() => {
    setupNav();
    setupSlider();
    setupChips();
    setupTabs();
    setupGallery();
    setupForm();
    setupBackTop();
  });

  function setupNav() {
    const toggle = document.querySelector(".menu-toggle");
    const list = document.querySelector(".nav-list");
    if (toggle && list) {
      toggle.addEventListener("click", () => list.classList.toggle("is-open"));
      list.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => list.classList.remove("is-open"));
      });
    }
    const currentPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-list a").forEach((link) => {
      const href = (link.getAttribute("href") || "").toLowerCase();
      if (href === currentPage) link.classList.add("is-active");
    });
  }

  function setupSlider() {
    const slider = document.querySelector("[data-slider]");
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll(".slide"));
    const dotsWrap = slider.querySelector(".slider-dots");
    const prev = slider.querySelector("[data-slide-prev]");
    const next = slider.querySelector("[data-slide-next]");
    if (!slides.length) return;
    let current = 0;
    let timer = 0;

    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `第 ${index + 1} 张`);
      dot.addEventListener("click", () => go(index, true));
      dotsWrap?.appendChild(dot);
      return dot;
    });

    function render() {
      slides.forEach((slide, index) => slide.classList.toggle("is-active", index === current));
      dots.forEach((dot, index) => dot.classList.toggle("is-active", index === current));
    }

    function go(index, manual) {
      current = (index + slides.length) % slides.length;
      render();
      if (manual) restart();
    }

    function restart() {
      clearInterval(timer);
      timer = window.setInterval(() => go(current + 1), 4200);
    }

    prev?.addEventListener("click", () => go(current - 1, true));
    next?.addEventListener("click", () => go(current + 1, true));
    render();
    restart();
  }

  function setupChips() {
    const groups = document.querySelectorAll("[data-filter-group]");
    groups.forEach((group) => {
      const chips = group.querySelectorAll(".chip");
      const targetSelector = group.dataset.target;
      if (!targetSelector) return;
      const items = document.querySelectorAll(`${targetSelector} [data-tags]`);
      chips.forEach((chip) => {
        chip.addEventListener("click", () => {
          chips.forEach((c) => c.classList.remove("is-active"));
          chip.classList.add("is-active");
          const tag = chip.dataset.filter || "all";
          items.forEach((item) => {
            const tags = (item.dataset.tags || "").split(/\s+/);
            const visible = tag === "all" || tags.includes(tag);
            item.style.display = visible ? "" : "none";
          });
        });
      });
    });
  }

  function setupTabs() {
    const groups = document.querySelectorAll("[data-tab-group]");
    groups.forEach((group) => {
      const tabs = group.querySelectorAll(".tab");
      const panelHost = document.querySelector(group.dataset.panels);
      if (!panelHost) return;
      const panels = panelHost.querySelectorAll(".tab-panel");
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t) => t.classList.remove("is-active"));
          panels.forEach((p) => p.classList.remove("is-active"));
          tab.classList.add("is-active");
          const key = tab.dataset.tab;
          const target = Array.from(panels).find((p) => p.dataset.panel === key);
          target?.classList.add("is-active");
        });
      });
    });
  }

  function setupGallery() {
    const tiles = document.querySelectorAll("[data-gallery] button");
    const dialog = document.getElementById("lightbox");
    if (!tiles.length || !dialog) return;
    const art = dialog.querySelector(".lightbox-art");
    const title = dialog.querySelector(".lightbox-title");
    const desc = dialog.querySelector(".lightbox-desc");
    tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        const cls = tile.dataset.art || "rome";
        const label = tile.dataset.title || "意大利风光";
        const description = tile.dataset.desc || "";
        if (art) {
          art.className = `lightbox-art card-art ${cls}`;
        }
        if (title) title.textContent = label;
        if (desc) desc.textContent = description;
        if (typeof dialog.showModal === "function") dialog.showModal();
      });
    });
    const close = dialog.querySelector("[data-close-lightbox]");
    close?.addEventListener("click", () => dialog.close());
  }

  function setupForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    const message = form.querySelector(".form-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const contact = (data.get("contact") || "").toString().trim();
      const note = (data.get("note") || "").toString().trim();
      if (!name || !contact || !note) {
        showMessage(message, "请填写姓名、联系方式和留言内容。", "is-error");
        return;
      }
      if (!/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(contact) && !/^[\d\s+()-]{6,}$/.test(contact)) {
        showMessage(message, "联系方式请填写邮箱或电话号码。", "is-error");
        return;
      }
      showMessage(message, `已收到 ${name} 的咨询，我们会尽快回复。`, "is-success");
      form.reset();
    });
  }

  function showMessage(node, text, modifier) {
    if (!node) return;
    node.textContent = text;
    node.classList.remove("is-success", "is-error");
    node.classList.add(modifier);
  }

  function setupBackTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-top";
    btn.setAttribute("aria-label", "返回顶部");
    btn.textContent = "↑";
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(btn);
    const onScroll = () => {
      if (window.scrollY > 320) btn.classList.add("is-visible");
      else btn.classList.remove("is-visible");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
