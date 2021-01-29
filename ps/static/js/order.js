// Get modal element
const modal_order = document.querySelector("#orderBg");

// Get open modal button
const modalBtn_order = document.querySelectorAll(".ordBtn");
modalBtn_order.forEach((btn) => {
    btn.addEventListener("click", openModal);
});

// Get close button
const closeBtn_order = document.querySelectorAll(".ordcloseBtn");
closeBtn_order.forEach((btn) => {
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

    document.querySelector("#orderTop1").innerHTML = liTag[0].innerHTML;
    modal_order.style.display = "block"; /* none -> display */
}

// Close modal
function closeModal() {
    modal_order.style.display = "none"; /* display -> none */
}

// Click outside and close (모달 밖을 클릭)
function outsideClick(e) {
    if (e.target == modal_order) {
        modal_order.style.display = "none";
    }
}

// CLICK 시 STATE변경
document.querySelectorAll(".button").forEach((btn) => {
    let classChk = module.hasClass(btn.classList, ["b_btn", "m_btn", "s_btn"]);
    if (classChk[0]) {
        //클릭시 초기화 후 체크
        btn.addEventListener("click", () => {
            document.querySelectorAll("." + classChk[1]).forEach((ele) => {
                ele.classList.remove("active");
            });
            btn.classList.toggle("active");
        });
        // 더블클릭시 체크 해제
        btn.addEventListener("dblclick", () => {
            btn.classList.toggle("active");
        });
    }
});

/**
 * 메뉴소분류가져오기
 */
function getMenuDetail() {
    document
    .querySelectorAll("#orderMidMidMenu>ul>li")
    .addEventListener('click',(e)=>{
        console.log(e.value)
    })

    // module
    //     .ajax("POST", "/order/menuDetail")
    //     .then((result) => {
    //         let resultJson = JSON.parse(result);//menu_cd,menu_kind

    //         document
    //             .querySelectorAll("#orderMidMidMenu>ul>li")
    //             .forEach((btn, idx) => {
    //                 btn.innerHTML = resultJson[idx].menu_kind;
    //                 btn.setAttribute('data-val', resultJson[idx].menu_cd);
    //                 //console.log(elem.dataset.val);
    //                 //console.log(elem.getAttribute('data-val')); // 데이터셋 미지원 브라우저에서는 getAttribute()로 접근해야 함
    //                 //elem.dataset.val = "1";
    //                 //elem.dataset //맵형태로 모든 데이터셋반환
    //             });
    //     })
    //     .catch((result) => {
    //         console.log(result);
    //     });
}