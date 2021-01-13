// Get modal element
const modal_pay = document.querySelector("#payBg");

// Get open modal button
const modalBtn_pay = document.querySelectorAll(".payBtn");
modalBtn_pay.forEach((btn) => {
    btn.addEventListener("click", openModal);
});

// Get close button
const closeBtn_pay = document.querySelectorAll(".paycloseBtn");
closeBtn_pay.forEach((btn) => {
    btn.addEventListener("click", closeModal);
});

// Listen for outside click
window.addEventListener("click", outsideClick);

// Open modal
function openModal() {
    if (!document.querySelector(".seat.active")) {
        alert("좌석을 선택해주세요.");
        return;
    }

    let liTag = document.querySelector(".seat.active").children[0].children;

    document.querySelector("#payTabNum").innerHTML = liTag[0].innerHTML;
    modal_pay.style.display = "block"; /* none -> display */
}

// Close modal
function closeModal() {
    modal_pay.style.display = "none";
}

// Click outside and close
function outsideClick(e) {
    //e.target & modal_pay => payBg(background)
    if (e.target == modal_pay) {
        modal_pay.style.display = "none";
    }
}
