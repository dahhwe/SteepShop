document.addEventListener('DOMContentLoaded', function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        let totalValue = 0;
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.classList.add('remove-item-btn');
            removeBtn.setAttribute('data-product-id', item.id);


            const itemImg = document.createElement('img');
            itemImg.src = item.imageUrl;
            itemImg.alt = item.name;
            itemImg.style.width = "50px";

            const itemInfo = document.createElement('div');
            itemInfo.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;

            itemElement.appendChild(removeBtn);
            itemElement.appendChild(itemImg);
            itemElement.appendChild(itemInfo);

            cartItemsContainer.appendChild(itemElement);

            totalValue += item.price * item.quantity;
        });

        document.getElementById('cart-total').textContent = totalValue.toFixed(2);
        attachRemoveButtonListeners();
    }


    function attachRemoveButtonListeners() {
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id');
                removeItemFromCart(productId);
            });
        });
    }

    function removeItemFromCart(productId) {
        const productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex > -1) {
            cart.splice(productIndex, 1);
            saveCartToLocalStorage();
            updateCartUI();
        }
    }

    document.querySelectorAll('.btn-purchase').forEach(function (button) {
        button.addEventListener('click', function () {
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.card-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price-text').textContent.substring(1));
            const imageUrl = productCard.querySelector('img').src;

            const existingProductIndex = cart.findIndex(item => item.id === productId);
            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                    imageUrl: imageUrl
                });
            }

            saveCartToLocalStorage();
            updateCartUI();
        });
    });

    document.getElementById('cart-icon').addEventListener('click', function () {
        document.getElementById('cart-menu').classList.add('open');
        updateCartUI();
    });

    document.getElementById('close-cart').addEventListener('click', function () {
        document.getElementById('cart-menu').classList.remove('open');
    });

    updateCartUI();
});
