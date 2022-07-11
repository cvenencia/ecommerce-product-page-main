if (!localStorage.cart) {
  localStorage.setItem('cart', '[]');
}

const productsWrapper = document.getElementById('cart-products-wrapper');
const cartIconWrapper = document.getElementById('cart-icon-wrapper');
const checkoutBtn = document.getElementById('checkout-btn');
const cart = JSON.parse(localStorage.getItem('cart'));

updateCartElements();

function addToCart() {
  if (amount > 0) {
    const item = {
      product,
      amount,
    };
    cart.push(item);
    updateCart();
  } else {
    alert('Add at least one element to the cart');
  }
}

function removeItemFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCartElements() {
  updateCartItemsAmountTag();
  productsWrapper.innerHTML = '';

  if (cart.length === 0) {
    const text = document.createElement('h4');
    text.innerHTML = `Your cart is empty.`;
    text.className = 'empty-cart-text';
    productsWrapper.appendChild(text);

    checkoutBtn.classList.add('hide');
  } else {
    checkoutBtn.classList.remove('hide');
    cart.forEach((e, i) => {
      const price = e.product.price.discounted ?? e.product.price.full;

      const cartProduct = document.createElement('div');
      cartProduct.innerHTML = `<img src="${
        e.product.images[0].thumbnail
      }" alt="Product thumbnail" class="rounded-border">
                <button id="pc-delete-${i}" class="delete-button" value="${i}" onclick="removeItemFromCart(this.value);">
                  <img src="images/icon-delete.svg" alt="Delete icon">
                </button>
                <div>
                  <p id="pc-title-${i}" class="light-text cut-text">${
        e.product.title
      }</p>
                  <span class="light-text spaced-text">
                    $<span id="pc-price-${i}">${price.toFixed(2)}</span>
                    x <span id="pc-amount-${i}">${e.amount}</span>
                    <strong class="dark-text">$<span id="pc-total-${i}">${(
        price * e.amount
      ).toFixed(2)}</span></strong>
                  </span>
                </div>`;
      cartProduct.className = 'cart-product-wrapper';
      cartProduct.id = i;
      productsWrapper.appendChild(cartProduct);
    });
  }
}

function updateCartItemsAmountTag() {
  if (cart.length === 0) {
    cartIconWrapper.classList.add('no-tag');
  } else {
    cartIconWrapper.setAttribute('item-amount', cart.length);
    cartIconWrapper.classList.remove('no-tag');
  }
}

function updateCartStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
  updateCartStorage();
  updateCartElements();
}

function buyCart() {
  localStorage.clear();
  cart.length = 0;
  updateCart();
}
