function createElementWithClass(elementType, className) {
    const element = document.createElement(elementType);
    element.className = className;
    return element;
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('addProduct').addEventListener('click', () => {
        document.getElementById('productName').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productQuantity').value = '';
        document.getElementById('productImageUrl').value = '';
        document.getElementById('productCategoryId').value = '';

        document.querySelector('.modal-content').removeAttribute('data-product-id');

        // Show the modal
        $('#editProductModal').modal('show');
    });

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const saveCartToLocalStorage = () => localStorage.setItem('cart', JSON.stringify(cart));

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

    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.closest('.product-card').getAttribute('data-product-id');

            fetch(`/products/${productId}`)
                .then(response => response.json())
                .then(product => {
                    console.log(product);

                    document.getElementById('productName').value = product.name || '';
                    document.getElementById('productDescription').value = product.description || '';
                    document.getElementById('productPrice').value = product.price || '';
                    document.getElementById('productQuantity').value = product.quantity || '';
                    document.getElementById('productImageUrl').value = product.imageUrl || '';
                    document.getElementById('productCategoryId').value = product.category ? product.category.id : '';

                    document.querySelector('.modal-content').setAttribute('data-product-id', productId);

                    $('#editProductModal').modal('show');
                });
        });
    });

    document.getElementById('saveChanges').addEventListener('click', () => {
        const productId = document.querySelector('.modal-content').getAttribute('data-product-id');
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = parseFloat(document.getElementById('productPrice').value);
        const productQuantity = parseInt(document.getElementById('productQuantity').value);
        const productImageUrl = document.getElementById('productImageUrl').value;
        const productCategoryId = parseInt(document.getElementById('productCategoryId').value);

        if (!productName || !productDescription || isNaN(productPrice) || isNaN(productQuantity) || !productImageUrl || isNaN(productCategoryId)) {
            alert('All fields must be filled out');
            return;
        }

        const product = {
            id: productId,
            name: productName,
            description: productDescription,
            price: productPrice,
            quantity: productQuantity,
            imageUrl: productImageUrl,
            category: {
                id: productCategoryId
            }
        };

        const url = productId ? `/products/${productId}` : '/products';
        const method = productId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                    $('#editProductModal').modal('hide');
                } else {
                    alert('There was an error updating the product. Please try again.');
                }
            });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.closest('.product-card').getAttribute('data-product-id');
            if (confirm('Are you sure you want to delete this product?')) {
                fetch(`/products/${productId}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            alert('There was an error deleting the product. Please try again.');
                        }
                    });
            }
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
})
;