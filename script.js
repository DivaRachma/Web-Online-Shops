document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    const payButton = document.getElementById('pay-button');
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closePopup = document.querySelector('.close');
    let totalPrice = 0;
    let cartCount = 0;

    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID').format(angka);
    }

    function updateCartCount() {
        cartCountElement.textContent = cartCount;
    }

    function saveCartToLocalStorage() {
        const cartData = {
            items: cartItems.innerHTML,
            totalPrice: totalPrice,
            cartCount: cartCount
        };
        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    function loadCartFromLocalStorage() {
        const cartData = JSON.parse(localStorage.getItem('cart'));
        if (cartData) {
            cartItems.innerHTML = cartData.items;
            totalPrice = cartData.totalPrice;
            cartCount = cartData.cartCount;
            totalPriceElement.textContent = formatRupiah(totalPrice);
            updateCartCount();
            addRemoveItemListeners();
        }
    }

    function addRemoveItemListeners() {
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const listItem = button.closest('li');
                const itemPrice = parseFloat(listItem.dataset.price);
                cartItems.removeChild(listItem);

                // Perbarui total harga dan jumlah item di keranjang
                totalPrice -= itemPrice;
                totalPriceElement.textContent = formatRupiah(totalPrice);
                cartCount--;
                updateCartCount();

                // Simpan keranjang ke localStorage
                saveCartToLocalStorage();
            });
        });
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.closest('.product');
            const productName = product.dataset.name;
            const productPrice = parseFloat(product.dataset.price) * 10000; // Konversi ke Rupiah

            // Tambahkan item ke keranjang
            const listItem = document.createElement('li');
            listItem.textContent = `${productName} - Rp${formatRupiah(productPrice)}`;
            listItem.dataset.price = productPrice;
            listItem.classList.add('animate__animated', 'animate__fadeIn');

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Hapus';
            removeButton.classList.add('remove-item');
            listItem.appendChild(removeButton);

            cartItems.appendChild(listItem);

            // Perbarui total harga dan jumlah item di keranjang
            totalPrice += productPrice;
            totalPriceElement.textContent = formatRupiah(totalPrice);
            cartCount++;
            updateCartCount();

            // Simpan keranjang ke localStorage
            saveCartToLocalStorage();

            // Tambahkan event listener untuk tombol hapus
            addRemoveItemListeners();

            // Animasi tombol
            button.classList.add('animate__animated', 'animate__rubberBand');
            button.addEventListener('animationend', () => {
                button.classList.remove('animate__animated', 'animate__rubberBand');
            });
        });
    });

    if (payButton) {
        payButton.addEventListener('click', () => {
            if (totalPrice > 0) {
                // Simpan keranjang ke localStorage sebelum beralih ke halaman pembayaran
                saveCartToLocalStorage();
                window.location.href = 'payment.html';
            } else {
                alert('Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.');
            }
        });
    }

    // Fungsi untuk menangani pembayaran
    function handlePayment(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const total = document.getElementById('total').value;

        // Di sini Anda bisa menambahkan logika untuk memproses pembayaran
        // Misalnya, mengirim data ke server atau mengintegrasikan dengan gateway pembayaran

        alert(`Terima kasih, ${name}! Pembayaran Anda sebesar ${total} telah diproses menggunakan ${paymentMethod}.`);
        
        // Reset formulir
        document.getElementById('payment-form').reset();

        // Hapus keranjang dari localStorage
        localStorage.removeItem('cart');

        // Kosongkan keranjang di halaman pembayaran
        const cartDetails = document.getElementById('cart-details');
        cartDetails.innerHTML = '';
        document.getElementById('total').value = 'Rp0';
    }

    // Menambahkan event listener ke formulir pembayaran jika ada di halaman
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);

        // Muat data keranjang dari localStorage
        const cartData = JSON.parse(localStorage.getItem('cart'));
        if (cartData) {
            document.getElementById('total').value = `Rp${formatRupiah(cartData.totalPrice)}`;
            const cartDetails = document.getElementById('cart-details');
            cartDetails.innerHTML = cartData.items;
        }
    }

    // Fungsi pencarian produk
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const productContainer = document.querySelector('.product-container');

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const products = productContainer.querySelectorAll('.product');

        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Muat data keranjang dari localStorage saat halaman dimuat
    loadCartFromLocalStorage();

    // Event listener untuk membuka popup keranjang
    cartIcon.addEventListener('click', () => {
        cartPopup.style.display = 'flex';
    });

    // Event listener untuk menutup popup keranjang
    closePopup.addEventListener('click', () => {
        cartPopup.style.display = 'none';
    });

    // Menutup popup keranjang jika pengguna mengklik di luar konten popup
    window.addEventListener('click', (event) => {
        if (event.target === cartPopup) {
            cartPopup.style.display = 'none';
        }
    });
});