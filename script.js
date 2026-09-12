/* ============================================================
   NAVBAR SCROLL EFFECT
============================================================= */
(function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let ticking = false;

  function updateNavbar() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  setTimeout(updateNavbar, 100);
})();

/* ============================================================
   CART FUNCTIONS
============================================================= */
function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function changeQty(button, change) {
  const item = button.closest(".cart-item");
  if (!item) return;
  const number = item.querySelector(".qty-number");
  let qty = parseInt(number.textContent);
  qty += change;
  if (qty < 1) qty = 1;
  number.textContent = qty;
  updateCart();
}

function removeItem(button) {
  const item = button.closest(".cart-item");
  if (!item) return;
  item.style.opacity = "0";
  item.style.transform = "translateX(30px)";
  setTimeout(() => {
    item.remove();
    updateCart();
  }, 250);
}

function updateCart() {
  const items = document.querySelectorAll(".cart-item");
  let subtotal = 0;
  let totalQuantity = 0;
  items.forEach(item => {
    const price = parseFloat(item.dataset.price);
    const quantity = parseInt(item.querySelector(".qty-number").textContent);
    subtotal += price * quantity;
    totalQuantity += quantity;
  });

  const subtotalEl = document.getElementById("subtotal");
  const cartCountEl = document.getElementById("cartCount");
  if (subtotalEl) subtotalEl.textContent = "$" + subtotal.toFixed(0);
  if (cartCountEl) cartCountEl.textContent = totalQuantity;

  const emptyCart = document.getElementById("emptyCart");
  const cartItems = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");

  if (items.length === 0) {
    if (emptyCart) emptyCart.classList.add("active");
    if (cartItems) cartItems.style.display = "none";
    if (footer) footer.style.display = "none";
  } else {
    if (emptyCart) emptyCart.classList.remove("active");
    if (cartItems) cartItems.style.display = "block";
    if (footer) footer.style.display = "block";
  }

  const shippingMessage = document.getElementById('shippingMessage');
  const shippingPercent = document.getElementById('shippingPercent');
  const shippingProgressBar = document.getElementById('shippingProgressBar');
  const shippingCost = document.getElementById('shippingCost');
  const totalElement = document.getElementById('total');

  const freeShippingThreshold = 120;
  const shippingPrice = 20;

  let progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  let remainingAmount = Math.max(freeShippingThreshold - subtotal, 0);

  if (shippingProgressBar) shippingProgressBar.style.width = progressPercent + '%';
  if (shippingPercent) shippingPercent.textContent = Math.round(progressPercent) + '%';

  let shippingCostValue = subtotal >= freeShippingThreshold ? 0 : shippingPrice;
  if (shippingCost) shippingCost.textContent = shippingCostValue === 0 ? 'Free' : '$' + shippingCostValue;

  let totalValue = subtotal + shippingCostValue;
  if (totalElement) totalElement.textContent = '$' + totalValue.toFixed(0);

  if (subtotal >= freeShippingThreshold) {
    if (shippingMessage) shippingMessage.innerHTML = 'Brilliant! You\'ve unlocked FREE delivery! 🎉';
    if (shippingPercent) shippingPercent.style.display = 'none';
    if (shippingProgressBar) shippingProgressBar.style.width = '100%';
  } else {
    if (shippingMessage) shippingMessage.innerHTML = `You're only <strong>$${remainingAmount.toFixed(0)}</strong> away from FREE delivery! 🎁`;
    if (shippingPercent) shippingPercent.style.display = 'inline';
  }
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeCart();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateCart);
} else {
  updateCart();
}

/* ============================================================
   SIDE MENU FUNCTIONS
============================================================= */
(function() {
  const openButton = document.getElementById("menuOpenButton");
  const closeButton = document.getElementById("menuCloseButton");
  const navigation = document.getElementById("sideNavigation");
  const backdrop = document.getElementById("menuBackdrop");

  if (!openButton || !closeButton || !navigation || !backdrop) return;

  function openMenu() {
    navigation.classList.add("active");
    backdrop.classList.add("active");
    document.body.classList.add("menu-is-open");
  }

  function closeMenu() {
    navigation.classList.remove("active");
    backdrop.classList.remove("active");
    document.body.classList.remove("menu-is-open");
  }

  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll(".category-item").forEach(function(category) {
    category.addEventListener("click", function() {
      closeMenu();
    });
  });

  let touchStartX = 0;
  let touchEndX = 0;

  navigation.addEventListener("touchstart", function(event) {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  navigation.addEventListener("touchmove", function(event) {
    touchEndX = event.touches[0].clientX;
  }, { passive: true });

  navigation.addEventListener("touchend", function() {
    const distance = touchEndX - touchStartX;
    if (distance < -80) closeMenu();
    touchStartX = 0;
    touchEndX = 0;
  });
})();

/* ============================================================
   SEARCH ENGINE
============================================================= */
(function() {
  const products = [
    { name: "Handmade Moroccan Berber Carpet", category: "Moroccan Carpets", price: "1,290 MAD", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=700" },
    { name: "Luxury Moroccan Leather Pouf", category: "Moroccan Leather", price: "499 MAD", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700" },
    { name: "Traditional Moroccan Ceramic Pottery", category: "Pottery & Decor", price: "249 MAD", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=700" },
    { name: "Handmade Moroccan Ceramic Bowl", category: "Pottery & Decor", price: "179 MAD", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=700" },
    { name: "Natural Moroccan Argan Oil", category: "Argan Oil", price: "159 MAD", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700" },
    { name: "Moroccan Handmade Straw Basket", category: "Straw Home Decor", price: "199 MAD", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=700" },
    { name: "Luxury Moroccan Cushion Cover", category: "Pillow Cases", price: "129 MAD", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=700" },
    { name: "Moroccan Handmade Blanket", category: "Moroccan Blankets", price: "449 MAD", image: "https://images.unsplash.com/photo-1583845112203-454c1b3e7b8f?w=700" },
    { name: "Moroccan Copper Side Table", category: "Copper Furniture", price: "2,490 MAD", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700" },
    { name: "Traditional Moroccan Pastry Selection", category: "Moroccan Pastries", price: "299 MAD", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700" }
  ];

  const trigger = document.getElementById("searchTrigger");
  const overlay = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("closeSearch");
  const input = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  const defaultContent = document.getElementById("defaultContent");
  const resultsContainer = document.getElementById("resultsContainer");

  if (!trigger || !overlay || !closeBtn || !input || !clearBtn) return;

  function openSearch() {
    overlay.classList.add("active");
    overlay.classList.remove("closing");
    document.body.style.overflow = "hidden";
    setTimeout(() => input.focus(), 500);
  }

  function closeSearch() {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.classList.remove("active");
      overlay.classList.remove("closing");
      document.body.style.overflow = "";
      input.value = "";
      clearBtn.style.display = "none";
      if (defaultContent) defaultContent.style.display = "block";
      if (resultsContainer) resultsContainer.innerHTML = "";
    }, 550);
  }

  trigger.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").trim();
  }

  function smartSearch(query) {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      defaultContent.style.display = "block";
      resultsContainer.innerHTML = "";
      clearBtn.style.display = "none";
      return;
    }
    clearBtn.style.display = "flex";
    defaultContent.style.display = "none";
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
    const scoredResults = products.map(product => {
      const name = normalize(product.name);
      const category = normalize(product.category);
      let score = 0;
      if (name === normalizedQuery) score += 200;
      if (name.includes(normalizedQuery)) score += 100;
      if (category.includes(normalizedQuery)) score += 80;
      queryWords.forEach(word => {
        if (name.includes(word)) score += 35;
        if (category.includes(word)) score += 25;
        name.split(" ").forEach(nameWord => {
          if (nameWord.startsWith(word)) score += 15;
        });
      });
      return { ...product, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
    renderResults(scoredResults, normalizedQuery);
  }

  function highlight(text, query) {
    const words = query.split(/\s+/).filter(Boolean);
    let output = text;
    words.forEach(word => {
      if (!word) return;
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      output = output.replace(new RegExp(`(${escaped})`, "gi"), "<strong>$1</strong>");
    });
    return output;
  }

  function renderResults(results, query) {
    if (!results.length) {
      resultsContainer.innerHTML = `
           <div class="empty">
          <div class="empty-circle">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M16.5 16.5L21 21"></path>
            </svg>
          </div>
          < }

div class="empty-title">Nothing found</div>
             <div class="empty-text"> constTry another word, category or product.</ shoulddiv>
        </div>
      `;
     Show return;
    }
    let html = `<div class="results-title">${results.length} results found</div>`;
    results.forEach((product, index) => {
      const match = Math.min(99, Math.max(78, Math.round(product.score / 2)));
      html += `
        <div class="result-item" style="animation-delay:${index * 45}ms" data-product="${product.name}">
          <img class="result-image" src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="result-info">
            <div class="result-name">${highlight(product.name, query)}</div>
            <div class="result-category">${product.category}</div>
            <div class="result-bottom">
              <div class="result-price">${product.price}</div>
              <div class="match-badge">${match}% match</div>
            </div>
          </div>
          <div class="result-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18L15 12L9 6"></path>
            </svg>
          </div>
        </div>
      `;
    });
    resultsContainer.innerHTML = html;
    document.querySelectorAll(".result-item").forEach(item => {
      item.addEventListener("click", () => {
        console.log("Selected:", item.dataset.product);
      });
    });
  }

  input.addEventListener("input", () => smartSearch(input.value));

  clearBtn.addEventListener("click", () => {
    input.value = "";
    input.focus();
    smartSearch("");
  });

  document.querySelectorAll(".tag").forEach(tag => {
    tag.addEventListener("click", () => {
      const value = tag.textContent.trim();
      input.value = value;
      smartSearch(value);
      input.focus();
    });
  });

  document.querySelectorAll(".discover-card").forEach(card => {
    card.addEventListener("click", () => {
      const value = card.dataset.search;
      input.value = value;
      smartSearch(value);
      input.focus();
    });
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const first = document.querySelector(".result-item");
      if (first) first.click();
    }
  });
})();

/* ============================================================
   CATEGORY SLIDER (drag)
============================================================= */
(function() {
  const slider = document.querySelector(".category-slider");
  if (!slider) return;

  document.querySelectorAll(".category").forEach(category => {
    category.addEventListener("click", () => {
      document.querySelectorAll(".category").forEach(item => {
        item.classList.remove("active");
      });
      category.classList.add("active");
      category.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    });
  });

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  slider.addEventListener("mousedown", (event) => {
    isDragging = true;
    slider.classList.add("dragging");
    startX = event.pageX - slider.offsetLeft;
    startScrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mouseup", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const distance = (x - startX) * 1.5;
    slider.scrollLeft = startScrollLeft - distance;
  });
})();

/* ============================================================
   STICKY BAR + NAVBAR SYNC
============================================================= */
(function() {
  const navbar = document.getElementById('navbar');
  const stickyBar = document.getElementById('freeShippingSticky');
  if (!navbar || !stickyBar) return;

  let ticking = false;
  let stickyVisible = false;

  function updateNavbarAndSticky() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
Sticky = currentScroll > 100;
    if (shouldShowSticky && !stickyVisible) {
      stickyBar.classList.add('visible');
      navbar.classList.add('with-sticky');
      document.body.classList.add('has-sticky-bar');
      stickyVisible = true;
    } else if (!shouldShowSticky && stickyVisible) {
      stickyBar.classList.remove('visible');
      navbar.classList.remove('with-sticky');
      document.body.classList.remove('has-sticky-bar');
      stickyVisible = false;
    }
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarAndSticky);
      ticking = true;
    }
  });

  window.addEventListener('resize', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarAndSticky);
      ticking = true;
    }
  });

  setTimeout(updateNavbarAndSticky, 100);
})();

/* ============================================================
   MOBILE TEXT ADJUST
============================================================= */
(function() {
  function adjustTextForMobile() {
    const breakLine = document.querySelector(".desktop-break");
    if (breakLine) {
      if (window.innerWidth <= 600) {
        breakLine.style.display = "none";
      } else {
        breakLine.style.display = "inline";
      }
    }
  }
  adjustTextForMobile();
  window.addEventListener("resize", adjustTextForMobile);
})();

/* ============================================================
   PRODUCT COLOR SWITCH (with background color change)
============================================================= */
(function() {
  document.querySelectorAll(".product-card").forEach(function(card) {
    const image = card.querySelector(".product-image");
    const imageWrapper = card.querySelector(".product-image-wrapper");
    const colorText = card.querySelector(".product-color");
    const colors = card.querySelectorAll(".color-item");
    const nextButton = card.querySelector(".color-next");
    const colorSlider = card.querySelector(".color-slider");
    let isTransitioning = false;

    colors.forEach(function(color) {
      color.addEventListener("click", function() {
        if (isTransitioning) return;

        colors.forEach(function(item) {
          item.classList.remove("active");
        });
        color.classList.add("active");

        const newImage = color.dataset.image;
        const material = color.dataset.name || "";
        const selectedColor = color.dataset.color || "";
        const bgColor = color.dataset.bgColor || '#1a1a1a';

        if (colorText) {
          colorText.innerHTML = material + "<br>" + selectedColor;
        }

        if (imageWrapper) {
          imageWrapper.style.backgroundColor = bgColor;
        }

        if (!image || !newImage) return;
        if (image.getAttribute("src") === newImage) return;

        isTransitioning = true;
        image.style.transition = 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)';
        image.style.opacity = '0';
        image.style.transform = 'scale(0.95)';

        setTimeout(function() {
          image.src = newImage;
          image.onload = function() {
            image.style.opacity = '1';
            image.style.transform = 'scale(1)';
            setTimeout(function() {
              isTransitioning = false;
            }, 100);
          };
          setTimeout(function() {
            image.style.opacity = '1';
            image.style.transform = 'scale(1)';
            isTransitioning = false;
          }, 800);
        }, 250);
      });
    });

    if (nextButton && colorSlider) {
      nextButton.addEventListener("click", function() {
        colorSlider.scrollBy({
          left: colorSlider.clientWidth * .72,
          behavior: "smooth"
        });
      });
    }

    if (colorSlider) {
      colorSlider.addEventListener("wheel", function(event) {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          event.preventDefault();
          colorSlider.scrollLeft += event.deltaY;
        }
      }, { passive: false });
    }
  });
})();

/* ============================================================
   FAVORITE TOGGLE
============================================================= */
(function() {
  document.querySelectorAll(".favorite").forEach(function(button) {
    button.addEventListener("click", function() {
      button.classList.toggle("active");
    });
  });
})();

/* ============================================================
   PRODUCT VARIANT SWITCH (NEW GRID)
============================================================= */
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".product-card").forEach(function(card) {
    const image = card.querySelector(".product-image");
    const imageWrapper = card.querySelector(".product-image-wrapper");
    const variantText = card.querySelector(".product-variant-text");
    const variants = card.querySelectorAll(".color-item");
    const variantSlider = card.querySelector(".variant-slider");
    const nextButton = card.querySelector(".color-next");

    if (!image || !imageWrapper || !variants.length) return;

    let changingImage = false;

    variants.forEach(function(variant) {
      variant.addEventListener("click", function() {
        if (changingImage) return;

        const newImage = variant.dataset.image;
        const newName = variant.dataset.name || "";
        const newColor = variant.dataset.color || "";
        const newBackground = variant.dataset.bgColor || "#f2f0ed";

        variants.forEach(function(item) {
          item.classList.remove("active");
        });
        variant.classList.add("active");

        if (variantText) {
          variantText.style.opacity = "0";
          variantText.style.transform = "translateY(4px)";
          setTimeout(function() {
            variantText.textContent = newName + (newColor ? " • " + newColor : "");
            variantText.style.opacity = "1";
            variantText.style.transform = "translateY(0)";
          }, 120);
        }

        imageWrapper.style.backgroundColor = newBackground;

        if (!newImage || image.getAttribute("src") === newImage) return;

        changingImage = true;
        image.style.opacity = "0";
        image.style.transform = "scale(.96) translateY(4px)";

        const preload = new Image();
        preload.src = newImage;
        preload.onload = function() {
          setTimeout(function() {
            image.src = newImage;
            image.style.opacity = "1";
            image.style.transform = "scale(1) translateY(0)";
            changingImage = false;
          }, 170);
        };
        preload.onerror = function() {
          image.src = newImage;
          image.style.opacity = "1";
          image.style.transform = "scale(1)";
          changingImage = false;
        };
      });
    });

    if (nextButton && variantSlider) {
      nextButton.addEventListener("click", function() {
        variantSlider.scrollBy({
          left: variantSlider.clientWidth * .72,
          behavior: "smooth"
        });
      });
    }

    if (variantSlider) {
      variantSlider.addEventListener("wheel", function(event) {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          event.preventDefault();
          variantSlider.scrollLeft += event.deltaY;
        }
      }, { passive: false });
    }
  });

  document.querySelectorAll(".favorite").forEach(function(button) {
    button.addEventListener("click", function() {
      const active = button.classList.toggle("active");
      button.setAttribute("aria-label", active ? "Remove from favorites" : "Add to favorites");
    });
  });
});

/* ============================================================
   PREMIUM POTTERY CTA
============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const potteryBtn = document.querySelector('.pottery-btn');
  if (!potteryBtn) return;

  potteryBtn.addEventListener('click', (e) => {
    const targetId = potteryBtn.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  potteryBtn.addEventListener('pointerdown', (e) => {
    const rect = potteryBtn.getBoundingClientRect();
    const ripple = document.createElement('span');

    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.25)';
    ripple.style.pointerEvents = 'none';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.left = `${e.clientX - rect.left - 5}px`;
    ripple.style.top = `${e.clientY - rect.top - 5}px`;
    ripple.style.transform = 'scale(0)';
    ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    ripple.style.zIndex = '10';

    potteryBtn.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(20)';
      ripple.style.opacity = '0';
    });

    setTimeout(() => ripple.remove(), 700);
  });
});
