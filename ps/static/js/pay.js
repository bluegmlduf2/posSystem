// Get modal element
const modal_pay = document.querySelector('#payBg');

// Get open modal button
const modalBtn_pay = document.querySelectorAll('.payBtn');
modalBtn_pay.forEach(btn => { btn.addEventListener('click', openModal) });

// Get close button
const closeBtn_pay = document.querySelectorAll('.paycloseBtn');
closeBtn_pay.forEach(btn => { btn.addEventListener('click', closeModal) });

// Listen for outside click
window.addEventListener('click', outsideClick);

// Open modal
function openModal() {
    modal_pay.style.display = 'block';
}

// Close modal
function closeModal() {
    modal_pay.style.display = 'none';
}

// Click outside and close
function outsideClick(e) {
    if (e.target == modal_pay) {
        modal_pay.style.display = 'none';
    }
}