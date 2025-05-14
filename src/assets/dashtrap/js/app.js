class ThemeLayout {
  constructor() {
    this.html = document.getElementsByTagName("html")[0];

    // Only call knob() if it exists to prevent errors
    $(function () {
      if ($.fn.knob) {
        $('[data-plugin="knob"]').knob();
      } else {
        console.warn("jQuery knob plugin not found");
      }
    });
  }

  initComponents() {
    Waves.init();
    lucide.createIcons();

    [...document.querySelectorAll('[data-bs-toggle="popover"]')].forEach(e => new bootstrap.Popover(e));
    [...document.querySelectorAll('[data-bs-toggle="tooltip"]')].forEach(e => new bootstrap.Tooltip(e));
    [...document.querySelectorAll(".offcanvas")].forEach(e => new bootstrap.Offcanvas(e));

    const toastPlacement = document.getElementById("toastPlacement");
    if (toastPlacement) {
      document.getElementById("selectToastPlacement").addEventListener("change", function () {
        if (!toastPlacement.dataset.originalClass) {
          toastPlacement.dataset.originalClass = toastPlacement.className;
        }
        toastPlacement.className = toastPlacement.dataset.originalClass + " " + this.value;
      });
    }

    [].slice.call(document.querySelectorAll(".toast")).forEach(e => new bootstrap.Toast(e));

    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    const alertBtn = document.getElementById("liveAlertBtn");
    if (alertBtn) {
      alertBtn.addEventListener("click", () => {
        const message = "Nice, you triggered this alert message!";
        const type = "success";
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
          <div class="alert alert-${type} alert-dismissible" role="alert">
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        alertPlaceholder.append(wrapper);
      });
    }

    // 💡 Force light theme
    document.documentElement.setAttribute("data-bs-theme", "light");
    sessionStorage.setItem("themeMode", "light");

    const themeSwitcher = document.getElementById("theme-mode");
    if (themeSwitcher) {
      themeSwitcher.addEventListener("click", function () {
        const currentTheme = document.documentElement.getAttribute("data-bs-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-bs-theme", newTheme);
        sessionStorage.setItem("themeMode", newTheme);
      });
    }
  }

  initfullScreenListener() {
    const el = document.querySelector('[data-bs-toggle="fullscreen"]');
    if (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.toggle("fullscreen-enable");

        if (
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement
        ) {
          if (document.cancelFullScreen) document.cancelFullScreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        } else {
          if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
          else if (document.documentElement.mozRequestFullScreen) document.documentElement.mozRequestFullScreen();
          else if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      });
    }
  }

  initFormValidation() {
    document.querySelectorAll(".needs-validation").forEach(form => {
      form.addEventListener("submit", e => {
        if (!form.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
        }
        form.classList.add("was-validated");
      }, false);
    });
  }

  initMainMenu() {
    const menuItems = $(".app-menu");
    if (!menuItems.length) return;

    const collapses = $(".app-menu .menu-item .collapse");

    $(".app-menu li [data-bs-toggle='collapse']").on("click", function () {
      return false;
    });

    collapses.on({
      "show.bs.collapse": function (e) {
        const parentCollapse = $(e.target).parents(".collapse.show");
        $(".app-menu .collapse.show").not(e.target).not(parentCollapse).collapse("hide");
      }
    });

    const menuLinks = document.querySelectorAll(".app-menu .menu-link");
    const currentURL = window.location.href.split(/[?#]/)[0];

    menuLinks.forEach(link => {
      if (link.href === currentURL) {
        link.classList.add("active");
        let el = link.parentNode;
        while (el && el !== document.body) {
          el.classList.add("active");
          if (el.classList.contains("collapse")) {
            el.classList.add("show");
          }
          el = el.parentNode;
        }
      }
    });

    // Auto scroll to active
    setTimeout(() => {
      const activeLink = document.querySelector("li.active .active");
      if (!activeLink) return;

      const menuWrapper = document.querySelector(".main-menu .simplebar-content-wrapper");
      if (!menuWrapper) return;

      const offsetTop = activeLink.offsetTop - 300;
      if (offsetTop <= 100) return;

      const duration = 600;
      const start = menuWrapper.scrollTop;
      const change = offsetTop - start;
      let currentTime = 0;

      function animateScroll() {
        currentTime += 20;
        const val = currentTime / duration;
        const eased = val < 1 ? change / 2 * val * val + start : -change / 2 * ((val - 1) * (val - 3) - 1) + start;
        menuWrapper.scrollTop = eased;
        if (currentTime < duration) setTimeout(animateScroll, 20);
      }

      animateScroll();
    }, 200);
  }

  reverseQuery(el, selector) {
    while (el) {
      if (el.parentElement && el.parentElement.querySelector(selector) === el) return el;
      el = el.parentElement;
    }
    return null;
  }

  initSwitchListener() {
    const toggleBtn = document.querySelector(".button-toggle-menu");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (this.html.getAttribute("data-sidebar-size") === "full") {
          this.showBackdrop();
        }
        this.html.classList.toggle("sidebar-enable");
      });
    }
  }

  showBackdrop() {
    const scrollbarWidth = (() => {
      const div = document.createElement("div");
      div.style.width = "100px";
      div.style.height = "100px";
      div.style.overflow = "scroll";
      document.body.appendChild(div);
      const width = div.offsetWidth - div.clientWidth;
      document.body.removeChild(div);
      return width;
    })();

    const backdrop = document.createElement("div");
    backdrop.id = "custom-backdrop";
    backdrop.className = "offcanvas-backdrop fade show";
    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth + "px";

    backdrop.addEventListener("click", () => {
      this.html.classList.remove("sidebar-enable");
      this.hideBackdrop();
    });
  }

  hideBackdrop() {
    const backdrop = document.getElementById("custom-backdrop");
    if (backdrop) {
      document.body.removeChild(backdrop);
      document.body.style.overflow = null;
      document.body.style.paddingRight = null;
    }
  }

  init() {
    this.initComponents();
    this.initfullScreenListener();
    this.initFormValidation();
    this.initMainMenu();
    this.initSwitchListener();
  }
}

(new ThemeLayout()).init();
