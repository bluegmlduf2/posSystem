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

// 모든 버튼 CLICK 시 STATE변경
document.querySelectorAll(".button").forEach((btn) => {
    let classChk = module.hasClass(btn.classList, ["b_btn", "m_btn", "s_btn"]);
    if (classChk[0]) {
        //클릭시 초기화 후 체크
        btn.addEventListener("click", () => {
            document.querySelectorAll("." + classChk[1]).forEach((elem) => {
                elem.classList.remove("active");
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
document.querySelectorAll("#orderMidMidMenu>ul>li").forEach((elem) => {
    elem.addEventListener("click", (e) => {

        if(nullCheck(e.target.innerText)){
            e.target.classList.remove("active")
            return false
        }
        let args = elem.getAttribute("data-val");

        module
            .ajax("POST", "/order/menuDetail", { menuCd: args })
            .then((result) => {
                let resultJson = JSON.parse(result); //menu_cd,menu_kind

                document
                    .querySelectorAll("#orderSmallMenu>ul>li")
                    .forEach((btn, idx) => {
                        btn.innerHTML = "";
                        btn.removeAttribute("data-val");
                        btn.classList.remove("active");

                        if (nullCheck(resultJson[idx])) {
                            return; //continue
                        }

                        let menuNm = resultJson[idx].MENU_NM;
                        let menuPrice = resultJson[idx].MENU_PRICE;
                        btn.innerHTML = `${menuNm}<br>${menuPrice}`;
                        btn.setAttribute(
                            "data-val",
                            JSON.stringify(resultJson[idx])
                        );
                    });
            })
            .catch((result) => {
                console.log(result);
            });
    });
});

/**
 * 메뉴소분류클릭
 */
document.querySelectorAll("#orderSmallMenu>ul>li").forEach((btn, idx) => {
    btn.addEventListener("dblclick", () => {
        btn.classList.remove("active");
    });
    //클릭시 초기화 후 체크
    // btn.addEventListener("click", () => {
        
    //     // document.querySelectorAll(".seat").forEach((seatCls) => {
    //     //     seatCls.classList.remove("active");
    //     // });
    //     //btn.classList.toggle("active");
    // });
    // 더블클릭시 체크 해제
    // btn.addEventListener("dblclick", () => {
    //     btn.classList.toggle("active");
    // });
    // btn.innerHTML = "";
    // btn.removeAttribute("data-val");

    // if (nullCheck(resultJson[idx])) {
    //     return; //continue
    // }

    // let menuNm = resultJson[idx].MENU_NM;
    // btn.innerHTML = menuNm;
    // btn.setAttribute("data-val", JSON.stringify(resultJson[idx]));
});
