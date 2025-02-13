document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('home-link').addEventListener('click', loadHome);
    document.getElementById('products-link').addEventListener('click', loadProducts);
    document.getElementById('cart-link').addEventListener('click', loadCart);
    document.getElementById('orders-link').addEventListener('click', loadOrders);
    loadHome(); // Load home by default
});

function loadHome() {
    document.getElementById('content').innerHTML = '<h2>Welcome to Coza Store</h2>';
}

function loadProducts() {
    const products = [
        {
            id: 1,
            name: 'T-Shirt',
            description: 'A comfortable cotton t-shirt.',
            price: 19.99,
            imageUrl: 'https://via.placeholder.com/150'
        },
        {
            id: 2,
            name: 'Jeans',
            description: 'Stylish denim jeans.',
            price: 49.99,
            imageUrl: 'https://via.placeholder.com/150'
        },
        {
            id: 3,
            name: 'Jacket',
            description: 'A warm and cozy jacket.',
            price: 89.99,
            imageUrl: 'https://via.placeholder.com/150'
        }
    ];

    const content = document.getElementById('content');
    content.innerHTML = '<h2>Products</h2>';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        content.appendChild(productDiv);
    });
}

function loadCart() {
    const cartItems = [
        {
            id: 1,
            product: {
                name: 'T-Shirt',
                imageUrl: 'https://via.placeholder.com/150'
            },
            quantity: 2
        },
        {
            id: 2,
            product: {
                name: 'Jeans',
                imageUrl: 'https://via.placeholder.com/150'
            },
            quantity: 1
        }
    ];

    const content = document.getElementById('content');
    content.innerHTML = '<h2>Cart</h2>';
    cartItems.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <img src="${item.product.imageUrl}" alt="${item.product.name}">
            <h3>${item.product.name}</h3>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        content.appendChild(cartItemDiv);
    });
}

function loadOrders() {
    const orders = [
        {
            id: 1,
            status: 'Shipped'
        },
        {
            id: 2,
            status: 'Processing'
        }
    ];

    const content = document.getElementById('content');
    content.innerHTML = '<h2>Orders</h2>';
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p>Status: ${order.status}</p>
        `;
        content.appendChild(orderDiv);
    });
}

function addToCart(productId) {
    // Dummy function to simulate adding to cart
    alert(`Product ${productId} added to cart`);
    loadCart();
}

function removeFromCart(cartItemId) {
    // Dummy function to simulate removing from cart
    alert(`Cart item ${cartItemId} removed`);
    loadCart();
}
