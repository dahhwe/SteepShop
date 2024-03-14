document.addEventListener('DOMContentLoaded', function () {
    let cart = [];

    document.querySelectorAll('.btn-purchase').forEach(function (button) {
        button.addEventListener('click', function () {
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.card-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price-text').textContent.substring(1));
            const imageUrl = productCard.querySelector('img').src;

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                imageUrl: imageUrl
            };
            const existingProductIndex = cart.findIndex(item => item.id === productId);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(product);
            }

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

    function updateCartUI() {
        let totalValue = 0;
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            const itemImg = document.createElement('img');
            itemImg.src = item.imageUrl;
            itemImg.alt = item.name;

            const itemInfo = document.createElement('div');
            itemInfo.textContent = `${item.name} - $${item.price} x ${item.quantity}`;

            itemElement.appendChild(itemImg);
            itemElement.appendChild(itemInfo);

            cartItemsContainer.appendChild(itemElement);

            totalValue += item.price * item.quantity;
        });

        document.getElementById('cart-total').textContent = totalValue.toFixed(2);
    }
});