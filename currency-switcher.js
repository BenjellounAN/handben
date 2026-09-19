(() => {
  "use strict";

  const currencies = [
    { code: "MAD", symbol: "DH", name: "Moroccan Dirham" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" }
  ];

  const supported = new Set(
    currencies.map(item => item.code)
  );

  const style = document.createElement("style");

  style.id = "handben-currency-switcher-styles";

  style.textContent = `
    .hb-currency {
      position: absolute;
      right: 19.6%;
      top: 72px;
      z-index: 40;
      color: #fff;
      font-family: "DM Sans", Arial, sans-serif;
    }

    .hb-currency--standalone {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999;
      color: #332820;
    }

    .hb-currency__trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 88px;
      height: 43px;
      padding: 0 13px;
      border: 1px solid rgba(255, 255, 255, .3);
      border-radius: 999px;
      background: rgba(36, 28, 22, .16);
      color: inherit;
      cursor: pointer;
      box-shadow:
        0 8px 28px rgba(20, 15, 10, .09),
        inset 0 1px 0 rgba(255, 255, 255, .22);
      backdrop-filter: blur(18px) saturate(1.35);
      -webkit-backdrop-filter: blur(18px) saturate(1.35);
      transition:
        background .3s ease,
        border-color .3s ease,
        color .3s ease,
        transform .25s ease,
        box-shadow .3s ease;
    }

    .hb-currency__trigger:hover {
      transform: translateY(-1px);
      background: rgba(36, 28, 22, .28);
      box-shadow:
        0 12px 32px rgba(20, 15, 10, .14),
        inset 0 1px 0 rgba(255, 255, 255, .25);
    }

    .hb-currency__trigger:focus-visible {
      outline: 2px solid #cdbb9f;
      outline-offset: 3px;
    }

    .hb-currency__globe {
      width: 15px;
      height: 15px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.55;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: .88;
    }

    .hb-currency__code {
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: .12em;
    }

    .hb-currency__chevron {
      width: 10px;
      height: 10px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform .3s ease;
    }

    .hb-currency.is-open .hb-currency__chevron {
      transform: rotate(180deg);
    }

    .navbar.scrolled .hb-currency {
      color: #2f251e;
    }

    .navbar.scrolled .hb-currency__trigger,
    .hb-currency--standalone .hb-currency__trigger {
      background: rgba(255, 255, 255, .66);
      border-color: rgba(74, 55, 40, .12);
      box-shadow:
        0 9px 28px rgba(47, 36, 28, .09),
        inset 0 1px 0 rgba(255, 255, 255, .7);
    }

    .navbar.scrolled .hb-currency__trigger:hover,
    .hb-currency--standalone .hb-currency__trigger:hover {
      background: rgba(255, 255, 255, .92);
    }

    .hb-currency__menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 218px;
      padding: 8px;
      border: 1px solid rgba(74, 55, 40, .11);
      border-radius: 19px;
      background: rgba(255, 253, 249, .96);
      box-shadow:
        0 24px 65px rgba(39, 28, 20, .18),
        inset 0 1px 0 rgba(255, 255, 255, .8);
      backdrop-filter: blur(22px) saturate(1.25);
      -webkit-backdrop-filter: blur(22px) saturate(1.25);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-7px) scale(.97);
      transform-origin: top right;
      transition:
        opacity .22s ease,
        visibility .22s ease,
        transform .28s cubic-bezier(.16, 1, .3, 1);
    }

    .hb-currency.is-open .hb-currency__menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .hb-currency__option {
      display: grid;
      grid-template-columns: 34px 1fr 18px;
      align-items: center;
      gap: 9px;
      width: 100%;
      min-height: 48px;
      padding: 7px 9px;
      border: 0;
      border-radius: 13px;
      background: transparent;
      color: #41352c;
      text-align: left;
      cursor: pointer;
      transition:
        background .2s ease,
        transform .2s ease;
    }

    .hb-currency__option:hover,
    .hb-currency__option:focus-visible {
      background: #f2ece5;
      outline: 0;
      transform: translateX(2px);
    }

    .hb-currency__symbol {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: #f1ece6;
      color: #6f5b49;
      font-size: 11px;
      font-weight: 700;
    }

    .hb-currency__text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .hb-currency__text strong {
      color: #2d251f;
      font-size: 11px;
      letter-spacing: .04em;
    }

    .hb-currency__text span {
      color: #988b80;
      font-size: 9px;
      white-space: nowrap;
    }

    .hb-currency__check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 17px;
      height: 17px;
      border: 1px solid #d8cec4;
      border-radius: 50%;
      color: transparent;
      font-size: 10px;
    }

    .hb-currency__option[aria-checked="true"] {
      background: #f7f3ee;
    }

    .hb-currency__option[aria-checked="true"]
    .hb-currency__symbol {
      background: #49372a;
      color: #fff;
    }

    .hb-currency__option[aria-checked="true"]
    .hb-currency__check {
      border-color: #49372a;
      background: #49372a;
      color: #fff;
    }

    @media (max-width: 1170px) {
      .hb-currency {
        right: 19.6vw;
        top: 6.15vw;
      }
    }

    @media (max-width: 600px) {
      .hb-currency {
        right: 19.2vw;
        top: 5.8vw;
      }

      .hb-currency__trigger {
        min-width: 57px;
        height: 35px;
        padding: 0 9px;
        gap: 6px;
      }

      .hb-currency__globe {
        display: none;
      }

      .hb-currency__code {
        font-size: 9px;
      }

      .hb-currency__menu {
        right: -8px;
        width: 205px;
      }

      .hb-currency--standalone {
        top: 10px;
        right: 10px;
      }

      .hb-currency--standalone
      .hb-currency__trigger {
        min-width: 67px;
        height: 38px;
      }
    }

    @media (max-width: 390px) {
      .hb-currency {
        right: 19vw;
      }

      .hb-currency__menu {
        right: -12px;
        width: 196px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hb-currency * {
        transition-duration: .01ms !important;
      }
    }
  `;

  document.head.append(style);

  function currentCode() {
    const apiCode = String(
      window.HandBenCurrency?.code || ""
    ).toUpperCase();

    if (supported.has(apiCode)) {
      return apiCode;
    }

    try {
      const saved = String(
        localStorage.getItem("handben-currency") || ""
      ).toUpperCase();

      if (supported.has(saved)) {
        return saved;
      }
    } catch (_) {}

    return "USD";
  }

  function createSwitcher() {
    if (document.querySelector(".hb-currency")) {
      return;
    }

    const host = document.querySelector(".navbar");
    const root = document.createElement("div");

    root.className =
      "hb-currency" +
      (host ? "" : " hb-currency--standalone");

    root.innerHTML = `
      <button
        class="hb-currency__trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label="Change currency"
      >
        <svg
          class="hb-currency__globe"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9"/>
          <path
            d="M3 12h18
               M12 3c3 3.4 3 14.6 0 18
               M12 3c-3 3.4-3 14.6 0 18"
          />
        </svg>

        <span class="hb-currency__code">
          USD
        </span>

        <svg
          class="hb-currency__chevron"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path d="m2.5 4.25 3.5 3.5 3.5-3.5"/>
        </svg>
      </button>

      <div
        class="hb-currency__menu"
        role="menu"
        aria-label="Choose currency"
      >
        ${currencies.map(item => `
          <button
            class="hb-currency__option"
            type="button"
            role="menuitemradio"
            aria-checked="false"
            data-currency="${item.code}"
          >
            <span class="hb-currency__symbol">
              ${item.symbol}
            </span>

            <span class="hb-currency__text">
              <strong>${item.code}</strong>
              <span>${item.name}</span>
            </span>

            <span class="hb-currency__check">
              ✓
            </span>
          </button>
        `).join("")}
      </div>
    `;

    (host || document.body).append(root);

    const trigger = root.querySelector(
      ".hb-currency__trigger"
    );

    const options = [
      ...root.querySelectorAll(
        ".hb-currency__option"
      )
    ];

    const close = () => {
      root.classList.remove("is-open");

      trigger.setAttribute(
        "aria-expanded",
        "false"
      );
    };

    const sync = code => {
      const requestedCode = String(
        code || ""
      ).toUpperCase();

      const next = supported.has(requestedCode)
        ? requestedCode
        : currentCode();

      root.querySelector(
        ".hb-currency__code"
      ).textContent = next;

      options.forEach(option => {
        option.setAttribute(
          "aria-checked",
          String(
            option.dataset.currency === next
          )
        );
      });
    };

    trigger.addEventListener(
      "click",
      event => {
        event.stopPropagation();

        const open =
          root.classList.toggle("is-open");

        trigger.setAttribute(
          "aria-expanded",
          String(open)
        );

        if (open) {
          options.find(
            option =>
              option.getAttribute(
                "aria-checked"
              ) === "true"
          )?.focus();
        }
      }
    );

    options.forEach((option, index) => {
      option.addEventListener(
        "click",
        () => {
          const code =
            option.dataset.currency;

          try {
            localStorage.setItem(
              "handben-currency",
              code
            );
          } catch (_) {}

          if (
            typeof window.HandBenCurrency?.set
              === "function"
          ) {
            window.HandBenCurrency.set(code);
          }

          sync(code);
          close();
          trigger.focus();
        }
      );

      option.addEventListener(
        "keydown",
        event => {
          const keys = [
            "ArrowDown",
            "ArrowUp",
            "Home",
            "End"
          ];

          if (!keys.includes(event.key)) {
            return;
          }

          event.preventDefault();

          let next;

          if (event.key === "Home") {
            next = 0;
          } else if (event.key === "End") {
            next = options.length - 1;
          } else {
            next =
              (
                index +
                (
                  event.key === "ArrowDown"
                    ? 1
                    : -1
                ) +
                options.length
              ) % options.length;
          }

          options[next].focus();
        }
      );
    });

    document.addEventListener(
      "click",
      event => {
        if (!root.contains(event.target)) {
          close();
        }
      }
    );

    document.addEventListener(
      "keydown",
      event => {
        if (event.key === "Escape") {
          close();
          trigger.focus();
        }
      }
    );

    window.addEventListener(
      "storage",
      event => {
        if (
          event.key === "handben-currency"
        ) {
          sync(event.newValue);
        }
      }
    );

    window.addEventListener(
      "handben:currencychange",
      event => {
        sync(event.detail?.currency);
      }
    );

    sync();

    let attempts = 0;

    const timer = setInterval(() => {
      sync();

      if (
        window.HandBenCurrency ||
        ++attempts > 60
      ) {
        clearInterval(timer);
      }
    }, 150);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      createSwitcher,
      { once: true }
    );
  } else {
    createSwitcher();
  }
})();
