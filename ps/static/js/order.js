// Get modal element
const modal_order = document.querySelector('#orderBg');

// Get open modal button
const modalBtn_order = document.querySelectorAll('.ordBtn');
modalBtn_order.forEach(btn => { btn.addEventListener('click', openModal) });

// Get close button
const closeBtn_order = document.querySelectorAll('.ordcloseBtn');
closeBtn_order.forEach(btn => { btn.addEventListener('click', closeModal) });

// Listen for outside click
window.addEventListener('click', outsideClick);

// Open modal
function openModal() {
    modal_order.style.display = 'block'; /* none -> display */ 
}

// Close modal
function closeModal() {
    modal_order.style.display = 'none'; /* display -> none */
}

// Click outside and close (모달 밖을 클릭)
function outsideClick(e) {
    if (e.target == modal_order) {
        modal_order.style.display = 'none';
    }
}