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
    if (!document.querySelector('.seat.active')) {
        alert('좌석을 선택해주세요.')
        return
    }

    let liTag=document.querySelector('.seat.active').children[0].children
    
    document.querySelector('#orderTop1').innerHTML=liTag[0].innerHTML
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
