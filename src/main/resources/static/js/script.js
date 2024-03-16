document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const saveCartToLocalStorage = () => localStorage.setItem('cart', JSON.stringify(cart));

    const createElementWithClass = (elementType, className) => {
        const element = document.createElement(elementType);
        element.classList.add(className);
        return element;
    };

    const updateCartCount = () => {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0).toString();
    };

    const updateCartUI = () => {
        let totalValue = 0;
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const itemElement = createElementWithClass('div', 'cart-item');
            const removeBtn = createElementWithClass('button', 'remove-item-btn');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.setAttribute('data-product-id', item.id);

            const itemImg = createElementWithClass('img');
            itemImg.src = item.imageUrl;
            itemImg.alt = item.name;
            itemImg.style.width = "50px";

            const itemInfo = createElementWithClass('div');
            itemInfo.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;

            itemElement.append(removeBtn, itemImg, itemInfo);
            cartItemsContainer.appendChild(itemElement);

            totalValue += item.price * item.quantity;
        });

        document.getElementById('cart-total').textContent = totalValue.toFixed(2);
        attachRemoveButtonListeners();
        updateCartCount();
    };

    const attachRemoveButtonListeners = () => {
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-product-id');
                removeItemFromCart(productId);
            });
        });
    };

    const removeItemFromCart = (productId) => {
        const productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex > -1) {
            cart.splice(productIndex, 1);
            saveCartToLocalStorage();
            updateCartUI();
        }
    };

    document.querySelectorAll('.btn-purchase').forEach(button => {
        button.addEventListener('click', () => {
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

    document.getElementById('cart-icon').addEventListener('click', () => {
        document.getElementById('cart-menu').classList.add('open');
        updateCartUI();
    });

    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-menu').classList.remove('open');
    });

    updateCartUI();
});