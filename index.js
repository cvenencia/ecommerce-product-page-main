const body = document.querySelector('body');
const cartContainer = document.getElementById('cart-container');
const amountElement = document.getElementById('amount');
const currentImage = document.getElementById('current-img');
const currentExpandedImage = document.getElementById('expanded-image');
const imagesContainer = document.getElementById('images-container');
const expandedImageContainer = document.getElementById(
  'expanded-image-container'
);
const category = document.getElementById('category');
const title = document.getElementById('title');
const description = document.getElementById('description');
const finalPrice = document.getElementById('final-price');
const discount = document.getElementById('discount');
const previousPrice = document.getElementById('previous-price');
const iconMenu = document.getElementById('icon-menu');
const closeMenuIcon = document.getElementById('close-menu-icon');
const nav = document.getElementById('nav');
const bgCover = document.getElementById('bg-cover');
const imgSelectorLeft = document.getElementById('btn-image-selector-left');
const imgSelectorRight = document.getElementById('btn-image-selector-right');

let imgCarousel;
let imgCarouselExpanded;
let index = 0;
let expandedIndex = 0;
let product;
let amount = 0;

load('product.json');

function load(url) {
  fetch(url)
    .then((res) => res.json())
    .then(getData);
}

function getData(d) {
  product = d;
  loadData();
}

function loadData() {
  // Images
  currentImage.src = product.images[0].full;
  if (product.images.length > 1) {
    imgCarousel = document.createElement('div');
    imgCarousel.id = 'img-carousel';
    imgCarousel.className = 'img-carousel';

    imgCarouselExpanded = document.createElement('div');
    imgCarouselExpanded.id = 'img-carousel-expanded';
    imgCarouselExpanded.className = 'img-carousel img-carousel-expanded';

    product.images.forEach((img, index) => {
      let checked = '';
      if (index === 0) {
        checked = ' checked';
      }

      imgCarousel.innerHTML += `<input id="thumb-${index}" value="${index}" type="radio" name="thumbnail-selector" onclick="selectImageProduct(parseInt(this.value));"${checked}>
        <label for="thumb-${index}">
          <div class="img-thumbnail"><img src="${img.thumbnail}" alt="Product thumbnail" class="rounded-border"></div>
        </label>`;

      imgCarouselExpanded.innerHTML += `<input id="expanded-thumb-${index}" value="${index}" type="radio" name="expanded-thumbnail-selector" onclick="selectExpandedImageProduct(parseInt(this.value));" checked>
      <label for="expanded-thumb-${index}">
        <div class="img-thumbnail"><img src="${img.thumbnail}" alt="Product thumbnail" class="rounded-border"></div>
      </label>`;
    });

    imagesContainer.appendChild(imgCarousel);
    expandedImageContainer.appendChild(imgCarouselExpanded);
  }

  // Product description
  category.innerText = product.category;
  title.innerText = product.title;
  description.innerText = product.description;
  if (product.price.discounted) {
    finalPrice.innerText = '$' + product.price.discounted.toFixed(2);
    discount.innerText = product.price.discount + '%';
    previousPrice.innerText = '$' + product.price.full.toFixed(2);
  } else {
    finalPrice.innerText = '$' + product.price.full.toFixed(2);
    discount.classList.add('hide');
    previousPrice.classList.add('hide');
  }

  checkOverflowCarousel();
  checkDeviceWidth();
}

function incrementAmount() {
  amount += 1;
  amountElement.innerText = amount;
}

function decrementAmount() {
  if (amount > 0) {
    amount -= 1;
    amountElement.innerText = amount;
  }
}

function toggleCart() {
  if (cartContainer.classList.contains('hide')) {
    cartContainer.classList.remove('hide');
  } else {
    cartContainer.classList.add('hide');
  }
}

function selectImageProduct(index) {
  expandedIndex = parseInt(index);
  currentImage.src = product.images[index].full;
}

function selectExpandedImageProduct(index) {
  expandedIndex = parseInt(index);
  updateExpandedImage();
}

function moveImage(amount) {
  expandedIndex += amount;
  index += amount;

  const lastIndex = product.images.length;
  if (index < 0) index = lastIndex - 1;
  if (index >= lastIndex) index = 0;

  updateCarousel();
}

function moveExpandedImage(amount) {
  expandedIndex += amount;

  const lastIndex = product.images.length;
  if (expandedIndex < 0) expandedIndex = lastIndex - 1;
  if (expandedIndex >= lastIndex) expandedIndex = 0;

  updateExpandedImage();
}

function checkOverflowCarousel() {
  if (imgCarousel)
    if (
      imgCarousel.scrollHeight > imgCarousel.clientHeight ||
      imgCarousel.scrollWidth > imgCarousel.clientWidth
    ) {
      imgCarousel.style = 'justify-content: start;';
      imgCarouselExpanded.style = 'justify-content: start;';
    } else {
      imgCarousel.style = '';
      imgCarouselExpanded.style = '';
    }
}

function updateCarousel() {
  if (imgCarousel) document.getElementById(`thumb-${index}`).checked = true;
  currentImage.src = product.images[index].full;
}

function updateExpandedImage() {
  if (imgCarousel)
    document.getElementById(`expanded-thumb-${expandedIndex}`).checked = true;
  currentExpandedImage.src = product.images[expandedIndex].full;
}

function expandImage() {
  if (imgCarousel) {
    document.getElementById(`expanded-thumb-${expandedIndex}`).checked = true;
  } else {
    document
      .querySelectorAll('.expanded-img-wrapper > button')
      .forEach((e) => e.classList.add('hide'));
  }

  animateOpacityIn(bgCover);
  animateOpacityIn(expandedImageContainer);
  updateExpandedImage();
}

function hideExpandedImage() {
  animateOpacityOut(bgCover);
  animateOpacityOut(expandedImageContainer);
}

function animateOpacityIn(element) {
  element.classList.remove('hide');
  element.classList.add('an-opacity-in');
  element.addEventListener('animationend', function remove() {
    element.classList.remove('an-opacity-in');
    element.removeEventListener('animationend', remove);
  });
}

function animateOpacityOut(element) {
  if (!element.classList.contains('hide')) {
    element.classList.add('an-opacity-out');
    element.addEventListener('animationend', function remove() {
      element.classList.add('hide');
      element.classList.remove('an-opacity-out');

      element.removeEventListener('animationend', remove);
    });
  }
}

function openNavMenu() {
  animateOpacityIn(bgCover);
  nav.classList.add('an-open-nav');
  nav.addEventListener('animationend', function remove() {
    nav.classList.remove('hidden-nav');
    nav.classList.remove('an-open-nav');

    nav.removeEventListener('animationend', remove);
  });
}

function closeNavMenu() {
  animateOpacityOut(bgCover);
  nav.classList.add('an-close-nav');
  nav.addEventListener('animationend', function remove() {
    nav.classList.add('hidden-nav');
    nav.classList.remove('an-close-nav');

    nav.removeEventListener('animationend', remove);
  });
}

function hideEverything() {
  if (!expandedImageContainer.classList.contains('hide')) hideExpandedImage();
  else closeNavMenu();
}

function checkDeviceWidth() {
  if (window.innerWidth <= 700) {
    imgSelectorLeft.classList.remove('hide');
    imgSelectorRight.classList.remove('hide');
    currentImage.classList.remove('rounded-border');
    currentImage.removeAttribute('onclick');
    imgCarousel.classList.add('hide');

    hideEverything();
  } else {
    imgSelectorLeft.classList.add('hide');
    imgSelectorRight.classList.add('hide');
    currentImage.classList.add('rounded-border');
    currentImage.setAttribute('onclick', 'expandImage();');
    imgCarousel.classList.remove('hide');
  }

  if (window.innerWidth <= 900) {
    closeMenuIcon.classList.remove('hide');
    iconMenu.classList.remove('hide');
    nav.classList.add('hidden-nav');
  } else {
    closeMenuIcon.classList.add('hide');
    iconMenu.classList.add('hide');
  }
}

window.onresize = checkDeviceWidth;
