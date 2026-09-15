document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.burger');
  var links = document.querySelector('nav.links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      burger.textContent = isOpen ? '✕' : '☰';
    });

    links.querySelectorAll('a:not(.nav-dropdown > a)').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
        burger.textContent = '☰';
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && links.classList.contains('open')) {
        burger.click();
      }
    });
  }

  var productDropdown = document.querySelector('.nav-dropdown');
  var productLink = productDropdown && productDropdown.querySelector(':scope > a');
  if (productDropdown && productLink) {
    productLink.addEventListener('click', function (event) {
      if (window.matchMedia('(max-width: 880px)').matches) {
        event.preventDefault();
        productDropdown.classList.toggle('open');
      }
    });
  }

  var galleryPhotos = Array.prototype.slice.call(document.querySelectorAll('.gallery-photo'));
  var lightbox = document.querySelector('.lightbox');
  var galleryFilters = document.querySelectorAll('.gallery-filter button');
  var galleryTiles = document.querySelectorAll('.gallery-tile');
  galleryFilters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      var selectedCategory = filter.getAttribute('data-filter');
      galleryFilters.forEach(function (button) { button.classList.remove('active'); });
      filter.classList.add('active');
      galleryTiles.forEach(function (tile) {
        tile.hidden = selectedCategory !== 'all' && tile.getAttribute('data-category') !== selectedCategory;
      });
    });
  });
  if (galleryPhotos.length && lightbox) {
    var lightboxImage = lightbox.querySelector('.lightbox-image');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var currentImage = 0;

    function showImage(index) {
      currentImage = (index + galleryPhotos.length) % galleryPhotos.length;
      lightboxImage.src = galleryPhotos[currentImage].src;
      lightboxImage.alt = galleryPhotos[currentImage].alt;
      lightboxCaption.textContent = galleryPhotos[currentImage].alt;
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
    }

    galleryPhotos.forEach(function (photo, index) {
      photo.addEventListener('click', function () { showImage(index); });
      photo.setAttribute('tabindex', '0');
      photo.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showImage(index);
        }
      });
    });

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
    }

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { showImage(currentImage - 1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { showImage(currentImage + 1); });
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showImage(currentImage - 1);
      if (event.key === 'ArrowRight') showImage(currentImage + 1);
    });
  }

  var productRows = Array.prototype.slice.call(document.querySelectorAll('.range-row'));
  productRows = productRows.filter(function (row) {
    return row.querySelector('.product-image');
  });
  if (productRows.length) {
    var productModal = document.createElement('div');
    productModal.className = 'product-modal';
    productModal.hidden = true;
    productModal.innerHTML = '<div class="product-modal-panel" role="dialog" aria-modal="true" aria-label="Product details">' +
      '<button class="product-modal-close" type="button" aria-label="Close product details">&times;</button>' +
      '<img class="product-modal-image" src="" alt="">' +
      '<div class="product-modal-content"><h2></h2><p></p><div class="product-modal-specs"></div></div>' +
      '</div>';
    document.body.appendChild(productModal);

    var modalImage = productModal.querySelector('.product-modal-image');
    var modalTitle = productModal.querySelector('h2');
    var modalDescription = productModal.querySelector('p');
    var modalSpecs = productModal.querySelector('.product-modal-specs');

    function openProduct(row) {
      var productImage = row.querySelector('.product-image');
      modalImage.src = productImage.src;
      modalImage.alt = productImage.alt;
      modalTitle.textContent = row.querySelector('h3').textContent;
      modalDescription.textContent = row.querySelector('p').textContent;
      modalSpecs.innerHTML = row.querySelector('.specs').innerHTML;
      productModal.hidden = false;
      document.body.classList.add('product-modal-open');
    }

    function closeProduct() {
      productModal.hidden = true;
      document.body.classList.remove('product-modal-open');
    }

    productRows.forEach(function (row) {
      row.classList.add('product-row-clickable');
      row.addEventListener('click', function (event) {
        event.preventDefault();
        openProduct(row);
      });
    });
    productModal.querySelector('.product-modal-close').addEventListener('click', closeProduct);
    productModal.addEventListener('click', function (event) {
      if (event.target === productModal) closeProduct();
    });
    document.addEventListener('keydown', function (event) {
      if (!productModal.hidden && event.key === 'Escape') closeProduct();
    });
  }
});
