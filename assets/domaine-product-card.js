/* 
---------------------------------------------------------------------------
   Domaine product card interactivity.

   Powers snippets/domaine-product-card.liquid:
     - clicking a colour swatch swaps the card's imagery, price, sale badge and
       product links to the chosen variant,
     - hovering the card reveals the secondary image (handled in CSS via
       Tailwind's group-hover; this script keeps the secondary <img> in sync
       with the selected colour).

   Uses a single document-level click delegation listener (attached once, even
   if the file is included multiple times). This is robust regardless of how
   many cards are on the page or when they are added to the DOM — it does not
   rely on custom-element upgrade timing.

   All markup classes used here also appear in the Liquid template, and Tailwind
   scans this file (see `@source "*.js"` in tailwind.css), so the utilities
   are always generated.
--------------------------------------------------------------------------- 
*/
(function () {
  if (window.__domaineProductCardInit) return;
  window.__domaineProductCardInit = true;

  // Classes that mark the currently selected swatch.
  var SELECTED_RING = ["ring-1", "ring-offset-2", "ring-offset-white", "ring-[#0A4874]"];

  function selectSwatch(btn) {
    var card = btn.closest("domaine-product-card");
    if (!card) return;

    var d = btn.dataset;
    var primary = card.querySelector("[data-primary-image]");
    var secondary = card.querySelector("[data-secondary-image]");
    var badge = card.querySelector("[data-badge]");
    var priceEl = card.querySelector("[data-price-display]");

    // Swap the imagery for the chosen colour. Drop srcset so the new src wins.
    if (primary && d.primary) {
      primary.src = d.primary;
      primary.removeAttribute("srcset");
    }
    if (secondary) {
      secondary.src = d.secondary || d.primary;
      secondary.removeAttribute("srcset");
    }

    // Pricing + sale badge.
    var onSale = d.onSale === "true";
    if (priceEl) {
      priceEl.innerHTML = onSale
        ? '<s class="text-[#111111] line-through">' + d.compare + "</s>" +
          '<span class="text-red-600">' + d.price + "</span>"
        : '<span class="text-[#111111]">' + d.price + "</span>";
    }
    if (badge) badge.classList.toggle("hidden", !onSale);

    // Point the product links at the selected variant.
    if (d.url) {
      card.querySelectorAll("[data-card-link]").forEach(function (link) {
        link.href = d.url;
      });
    }

    // Move the selected ring + update accessibility state.
    card.querySelectorAll("[data-swatch]").forEach(function (s) {
      var selected = s === btn;
      s.setAttribute("aria-pressed", selected ? "true" : "false");
      SELECTED_RING.forEach(function (cls) {
        s.classList.toggle(cls, selected);
      });
    });
  }

  document.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-swatch]");
    if (btn) selectSwatch(btn);
  });
})();
