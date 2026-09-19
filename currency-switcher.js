(() => {
  "use strict";

  const STORAGE_KEY = "handben-currency";

  const currencies = [
    {
      code: "MAD",
      symbol: "DH",
      name: "Moroccan Dirham"
    },
    {
      code: "USD",
      symbol: "$",
      name: "US Dollar"
    },
    {
      code: "EUR",
      symbol: "€",
      name: "Euro"
    },
    {
      code: "GBP",
      symbol: "£",
      name: "British Pound"
    }
  ];

  const supportedCurrencies = new Set(
    currencies.map(currency => currency.code)
  );

  /* =====================================================
     STYLES
  ===================================================== */

  function addStyles() {
    if (
      document.getElementById(
        "handben-side-currency-styles"
      )
    ) {
      return;
    }

    const style = document.createElement("style");

    style.id = "handben-side-currency-styles";

    style.textContent = `
      .hb-menu-currency {
        position: relative;
        z-index: 6;
        flex-shrink: 0;
        margin: 0 20px 12px;
        border: 1px solid rgba(74, 55, 40, .10);
        border-radius: 19px;
        background:
          linear-gradient(
            135deg,
            rgba(255, 255, 255, .72),
            rgba(247, 241, 234, .58)
          );
        box-shadow:
          0 10px 30px rgba(63, 44, 30, .055),
          inset 0 1px 0 rgba(255, 255, 255, .82);
        backdrop-filter: blur(18px) saturate(1.25);
        -webkit-backdrop-filter: blur(18px) saturate(1.25);
        overflow: hidden;
        opacity: 0;
        transform: translateY(12px);
        transition:
          opacity .65s ease,
          transform .75s cubic-bezier(.16, 1, .3, 1),
          border-color .3s ease,
          box-shadow .3s ease;
      }

      .side-navigation.active .hb-menu-currency {
        opacity: 1;
        transform: translateY(0);
        transition-delay: .88s;
      }

      .hb-menu-currency.is-open {
        border-color: rgba(74, 55, 40, .17);
        box-shadow:
          0 15px 38px rgba(63, 44, 30, .09),
          inset 0 1px 0 rgba(255, 255, 255, .9);
      }

      .hb-menu-currency__trigger {
        width: 100%;
        min-height: 66px;
        padding: 10px 14px;
        border: 0;
        background: transparent;
        display: grid;
        grid-template-columns: 40px 1fr auto 25px;
        align-items: center;
        gap: 11px;
        color: #4a3728;
        text-align: left;
        cursor: pointer;
        font-family:
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          "DM Sans",
          Arial,
          sans-serif;
      }

      .hb-menu-currency__trigger:focus-visible {
        outline: 2px solid #a59782;
        outline-offset: -3px;
        border-radius: 17px;
      }

      .hb-menu-currency__icon {
        width: 40px;
        height: 40px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4a3728;
        background:
          linear-gradient(
            145deg,
            rgba(255, 255, 255, .95),
            rgba(236, 226, 216, .74)
          );
        border: 1px solid rgba(74, 55, 40, .08);
        box-shadow:
          0 7px 18px rgba(74, 55, 40, .075),
          inset 0 1px 0 rgba(255, 255, 255, .9);
        transition:
          transform .45s cubic-bezier(.16, 1, .3, 1),
          background .3s ease;
      }

      .hb-menu-currency__trigger:hover
      .hb-menu-currency__icon {
        transform: rotate(-7deg) scale(1.06);
        background: #fff;
      }

      .hb-menu-currency__icon svg {
        width: 18px;
        height: 18px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.45;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .hb-menu-currency__details {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .hb-menu-currency__label {
        color: #a59782;
        font-size: 8px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: 1.7px;
        text-transform: uppercase;
      }

      .hb-menu-currency__name {
        color: #4a3728;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 14px;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .hb-menu-currency__selected {
        min-width: 48px;
        height: 29px;
        padding: 0 10px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #4a3728;
        color: #fff;
        font-size: 9px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: 1px;
        box-shadow: 0 6px 16px rgba(74, 55, 40, .16);
      }

      .hb-menu-currency__arrow {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #a59782;
        transition:
          transform .45s cubic-bezier(.16, 1, .3, 1),
          color .3s ease;
      }

      .hb-menu-currency__arrow svg {
        width: 12px;
        height: 12px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .hb-menu-currency.is-open
      .hb-menu-currency__arrow {
        color: #4a3728;
        transform: rotate(180deg);
      }

      .hb-menu-currency__expand {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition:
          grid-template-rows .5s cubic-bezier(.16, 1, .3, 1),
          opacity .3s ease;
      }

      .hb-menu-currency.is-open
      .hb-menu-currency__expand {
        grid-template-rows: 1fr;
        opacity: 1;
      }

      .hb-menu-currency__expand-inner {
        min-height: 0;
        overflow: hidden;
      }

      .hb-menu-currency__options {
        position: relative;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 7px;
        margin: 0 11px 11px;
        padding-top: 11px;
        border-top: 1px solid rgba(74, 55, 40, .075);
      }

      .hb-menu-currency__options::before {
        content: "";
        position: absolute;
        top: -1px;
        left: 25%;
        width: 50%;
        height: 1px;
        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(165, 151, 130, .65),
            transparent
          );
      }

      .hb-menu-currency__option {
        position: relative;
        min-width: 0;
        min-height: 57px;
        padding: 7px 4px;
        border: 1px solid transparent;
        border-radius: 13px;
        background: rgba(255, 255, 255, .38);
        color: #77695d;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-family:
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          "DM Sans",
          Arial,
          sans-serif;
        transition:
          transform .3s cubic-bezier(.16, 1, .3, 1),
          background .25s ease,
          border-color .25s ease,
          color .25s ease,
          box-shadow .3s ease;
      }

      .hb-menu-currency__option:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, .88);
        border-color: rgba(74, 55, 40, .09);
        color: #4a3728;
        box-shadow: 0 8px 18px rgba(74, 55, 40, .07);
      }

      .hb-menu-currency__option:focus-visible {
        outline: 2px solid #a59782;
        outline-offset: 1px;
      }

      .hb-menu-currency__option-symbol {
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 15px;
        line-height: 1;
      }

      .hb-menu-currency__option-code {
        font-size: 8px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: 1px;
      }

      .hb-menu-currency__check {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: #4a3728;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 7px;
        opacity: 0;
        transform: scale(.5);
        transition:
          opacity .25s ease,
          transform .35s cubic-bezier(.16, 1, .3, 1);
      }

      .hb-menu-currency__option[
        aria-checked="true"
      ] {
        background: #4a3728;
        border-color: #4a3728;
        color: #fff;
        box-shadow: 0 9px 20px rgba(74, 55, 40, .17);
      }

      .hb-menu-currency__option[
        aria-checked="true"
      ] .hb-menu-currency__check {
        opacity: 1;
        transform: scale(1);
      }

      @media (max-width: 600px) {
        .hb-menu-currency {
          margin: 0 11px 9px;
          border-radius: 17px;
        }

        .hb-menu-currency__trigger {
          min-height: 60px;
          padding: 8px 11px;
          grid-template-columns:
            36px 1fr auto 22px;
          gap: 9px;
        }

        .hb-menu-currency__icon {
          width: 36px;
          height: 36px;
          border-radius: 11px;
        }

        .hb-menu-currency__name {
          font-size: 13px;
        }

        .hb-menu-currency__selected {
          min-width: 44px;
          height: 27px;
          padding: 0 8px;
          font-size: 8px;
        }

        .hb-menu-currency__options {
          gap: 5px;
          margin: 0 8px 8px;
          padding-top: 8px;
        }

        .hb-menu-currency__option {
          min-height: 52px;
          border-radius: 11px;
        }

        .hb-menu-currency__option-symbol {
          font-size: 14px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .hb-menu-currency,
        .hb-menu-currency * {
          transition-duration: .01ms !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     CURRENT CURRENCY
  ===================================================== */

  function getSavedCurrency() {
    try {
      const saved = String(
        localStorage.getItem(STORAGE_KEY) || ""
      ).toUpperCase();

      if (supportedCurrencies.has(saved)) {
        return saved;
      }
    } catch (_) {}

    return "";
  }

  function getCurrentCurrency() {
    const apiCurrency = String(
      window.HandBenCurrency?.code || ""
    ).toUpperCase();

    if (supportedCurrencies.has(apiCurrency)) {
      return apiCurrency;
    }

    return getSavedCurrency() || "USD";
  }

  function getCurrencyInformation(code) {
    return currencies.find(
      currency => currency.code === code
    ) || currencies[1];
  }

  /* =====================================================
     CREATE SWITCHER
  ===================================================== */

  function createCurrencySwitcher() {
    if (
      document.querySelector(
        ".hb-menu-currency"
      )
    ) {
      return true;
    }

    const sideMenu = document.querySelector(
      ".side-navigation"
    );

    if (!sideMenu) {
      return false;
    }

    const footer = sideMenu.querySelector(
      ".menu-footer"
    );

    const currencyBox =
      document.createElement("section");

    currencyBox.className =
      "hb-menu-currency";

    currencyBox.setAttribute(
      "aria-label",
      "Currency settings"
    );

    currencyBox.innerHTML = `
      <button
        class="hb-menu-currency__trigger"
        type="button"
        aria-expanded="false"
        aria-controls="handbenCurrencyOptions"
      >
        <span
          class="hb-menu-currency__icon"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.5"/>
            <path d="M3.5 12h17"/>
            <path
              d="M12 3.5
                 c2.8 3.1 2.8 13.9 0 17"
            />
            <path
              d="M12 3.5
                 c-2.8 3.1-2.8 13.9 0 17"
            />
          </svg>
        </span>

        <span class="hb-menu-currency__details">
          <span class="hb-menu-currency__label">
            Shopping currency
          </span>

          <span class="hb-menu-currency__name">
            US Dollar
          </span>
        </span>

        <span class="hb-menu-currency__selected">
          USD
        </span>

        <span
          class="hb-menu-currency__arrow"
          aria-hidden="true"
        >
          <svg viewBox="0 0 12 12">
            <path d="m2.5 4.25 3.5 3.5 3.5-3.5"/>
          </svg>
        </span>
      </button>

      <div class="hb-menu-currency__expand">
        <div class="hb-menu-currency__expand-inner">
          <div
            class="hb-menu-currency__options"
            id="handbenCurrencyOptions"
            role="radiogroup"
            aria-label="Choose your currency"
          >
            ${currencies.map(currency => `
              <button
                class="hb-menu-currency__option"
                type="button"
                role="radio"
                aria-checked="false"
                aria-label="${currency.name}"
                data-currency="${currency.code}"
              >
                <span
                  class="hb-menu-currency__check"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <span
                  class="hb-menu-currency__option-symbol"
                >
                  ${currency.symbol}
                </span>

                <span
                  class="hb-menu-currency__option-code"
                >
                  ${currency.code}
                </span>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    if (footer) {
      sideMenu.insertBefore(
        currencyBox,
        footer
      );
    } else {
      sideMenu.appendChild(currencyBox);
    }
    [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel"
].forEach(eventName => {
  currencyBox.addEventListener(
    eventName,
    event => {
      event.stopPropagation();
    },
    {
      passive: true
    }
  );
});

    const trigger =
      currencyBox.querySelector(
        ".hb-menu-currency__trigger"
      );

    const selectedCode =
      currencyBox.querySelector(
        ".hb-menu-currency__selected"
      );

    const selectedName =
      currencyBox.querySelector(
        ".hb-menu-currency__name"
      );

    const options = [
      ...currencyBox.querySelectorAll(
        ".hb-menu-currency__option"
      )
    ];

    /* =====================================================
       OPEN AND CLOSE
    ===================================================== */

    function openSwitcher() {
      currencyBox.classList.add("is-open");

      trigger.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    function closeSwitcher() {
      currencyBox.classList.remove("is-open");

      trigger.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    function toggleSwitcher() {
      if (
        currencyBox.classList.contains(
          "is-open"
        )
      ) {
        closeSwitcher();
      } else {
        openSwitcher();
      }
    }

    /* =====================================================
       SYNCHRONIZE DISPLAY
    ===================================================== */

    function synchronizeCurrency(code) {
      const requestedCode = String(
        code || ""
      ).toUpperCase();

      const finalCode =
        supportedCurrencies.has(requestedCode)
          ? requestedCode
          : getCurrentCurrency();

      const information =
        getCurrencyInformation(finalCode);

      selectedCode.textContent =
        information.code;

      selectedName.textContent =
        information.name;

      options.forEach(option => {
        option.setAttribute(
          "aria-checked",
          String(
            option.dataset.currency
              === finalCode
          )
        );
      });
    }

    /* =====================================================
       CHANGE CURRENCY
    ===================================================== */

    function changeCurrency(code) {
      if (!supportedCurrencies.has(code)) {
        return;
      }

      try {
        localStorage.setItem(
          STORAGE_KEY,
          code
        );
      } catch (_) {}

      if (
        typeof window.HandBenCurrency?.set
          === "function"
      ) {
        window.HandBenCurrency.set(code);
      } else {
        window.dispatchEvent(
          new CustomEvent(
            "handben:currencychange",
            {
              detail: {
                currency: code
              }
            }
          )
        );
      }

      synchronizeCurrency(code);
      closeSwitcher();
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    trigger.addEventListener(
      "click",
      event => {
        event.stopPropagation();
        toggleSwitcher();
      }
    );

    options.forEach((option, index) => {
      option.addEventListener(
        "click",
        event => {
          event.stopPropagation();

          changeCurrency(
            option.dataset.currency
          );
        }
      );

      option.addEventListener(
        "keydown",
        event => {
          const allowedKeys = [
            "ArrowRight",
            "ArrowLeft",
            "ArrowDown",
            "ArrowUp",
            "Home",
            "End"
          ];

          if (
            !allowedKeys.includes(event.key)
          ) {
            return;
          }

          event.preventDefault();

          let nextIndex = index;

          if (event.key === "Home") {
            nextIndex = 0;
          } else if (event.key === "End") {
            nextIndex =
              options.length - 1;
          } else if (
            event.key === "ArrowRight" ||
            event.key === "ArrowDown"
          ) {
            nextIndex =
              (index + 1) %
              options.length;
          } else {
            nextIndex =
              (
                index -
                1 +
                options.length
              ) % options.length;
          }

          options[nextIndex].focus();
        }
      );
    });

    document.addEventListener(
      "click",
      event => {
        if (
          !currencyBox.contains(
            event.target
          )
        ) {
          closeSwitcher();
        }
      }
    );

    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape" &&
          currencyBox.classList.contains(
            "is-open"
          )
        ) {
          closeSwitcher();
          trigger.focus();
        }
      }
    );

    window.addEventListener(
      "storage",
      event => {
        if (
          event.key === STORAGE_KEY
        ) {
          synchronizeCurrency(
            event.newValue
          );
        }
      }
    );

    window.addEventListener(
      "handben:currencychange",
      event => {
        synchronizeCurrency(
          event.detail?.currency
        );
      }
    );

    synchronizeCurrency(
      getCurrentCurrency()
    );

    /* انتظار نظام العملة الأصلي إن تأخر قليلًا */

    let attempts = 0;

    const synchronizationTimer =
      window.setInterval(() => {
        synchronizeCurrency(
          getCurrentCurrency()
        );

        attempts++;

        if (
          window.HandBenCurrency ||
          attempts >= 60
        ) {
          window.clearInterval(
            synchronizationTimer
          );
        }
      }, 150);

    return true;
  }

  /* =====================================================
     INITIALIZATION
  ===================================================== */

  function initializeCurrencySwitcher() {
    addStyles();

    if (createCurrencySwitcher()) {
      return;
    }

    /*
     * في حال تم إنشاء القائمة الجانبية
     * لاحقًا بواسطة Firebase أو JavaScript.
     */

    const observer =
      new MutationObserver(() => {
        if (createCurrencySwitcher()) {
          observer.disconnect();
        }
      });

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

    window.setTimeout(() => {
      observer.disconnect();
    }, 10000);
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeCurrencySwitcher,
      { once: true }
    );
  } else {
    initializeCurrencySwitcher();
  }
})();
