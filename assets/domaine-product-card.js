/* ---------------------------------------------------------------------------
   <domaine-product-card> web component

   Powers the interactivity for snippets/domaine-product-card.liquid:
     - clicking a colour swatch swaps the card's imagery, price, sale badge and
       product links to the chosen variant,
     - hovering the card reveals the secondary image (handled in CSS via
       Tailwind's group-hover; this script just keeps the secondary <img> in
       sync with the selected colour).

   All markup classes used here are also present in the Liquid template, and
   Tailwind scans this file (see `@source "./**/*.js"` in tailwind.css), so the
   utilities are always generated.
--------------------------------------------------------------------------- */
(function () {
  if (customElements.get("domaine-product-card")) return;

  // Classes that mark the currently selected swatch.
  var SELECTED_RING = ["ring-1", "ring-offset-2", "ring-offset-white", "ring-[#0A4874]"];

  class DomaineProductCard extends HTMLElement {
    connectedCallback() {
      this.primaryImage = this.querySelector("[data-primary-image]");
      this.secondaryImage = this.querySelector("[data-secondary-image]");
      this.badge = this.querySelector("[data-badge]");
      this.priceEl = this.querySelector("[data-price]");
      this.links = this.querySelectorAll("[data-card-link]");
      this.swatches = Array.prototype.slice.call(this.querySelectorAll("[data-swatch]"));

      this.swatches.forEach(
        function (btn) {
          btn.addEventListener("click", this.select.bind(this, btn));
        }.bind(this)
      );
    }

    select(btn) {
      var d = btn.dataset;

      // Swap the imagery for the chosen colour. Drop srcset so the new src wins.
      if (this.primaryImage && d.primary) {
        this.primaryImage.src = d.primary;
        this.primaryImage.removeAttribute("srcset");
      }
      if (this.secondaryImage) {
        this.secondaryImage.src = d.secondary || d.primary;
        this.secondaryImage.removeAttribute("srcset");
      }

      // Pricing + sale badge.
      var onSale = d.onSale === "true";
      if (this.priceEl) {
        this.priceEl.innerHTML = onSale
          ? '<s class="text-[#111111] line-through">' + d.compare + "</s>" +
            '<span class="text-red-600">' + d.price + "</span>"
          : '<span class="text-[#111111]">' + d.price + "</span>";
      }
      if (this.badge) this.badge.classList.toggle("hidden", !onSale);

      // Point the product links at the selected variant.
      if (d.url) {
        this.links.forEach(function (link) {
          link.href = d.url;
        });
      }

      // Move the selected ring + update accessibility state.
      this.swatches.forEach(function (s) {
        var selected = s === btn;
        s.setAttribute("aria-pressed", selected ? "true" : "false");
        SELECTED_RING.forEach(function (cls) {
          s.classList.toggle(cls, selected);
        });
      });
    }
  }

  customElements.define("domaine-product-card", DomaineProductCard);
})();
