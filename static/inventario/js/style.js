// Modal functionality
const addProductBtn = document.getElementById('addProductBtn');
const addProductModal = document.getElementById('addProductModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const productForm = document.getElementById('productForm');

addProductBtn.addEventListener('click', () => {
    addProductModal.style.display = 'flex';
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        addProductModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === addProductModal) {
        addProductModal.style.display = 'none';
    }
});

// Form submission
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically send the data to a server
    alert('Producto agregado exitosamente');
    addProductModal.style.display = 'none';
    productForm.reset();
});