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
    if(document.querySelector('#menuList tbody').hasChildNodes()){
        if(!confirm('주문중인 정보가 있습니다.\n취소하고 닫겠습니까?')){
            return false
        }
    }
    

    document.querySelectorAll("#orderMidMidMenu>ul>li").forEach((btn, idx) => {
        btn.classList.remove("active");
    });

    document.querySelectorAll("#orderSmallMenu>ul>li").forEach((btn, idx) => {
        btn.innerHTML = "";
        btn.removeAttribute("data-val");
        btn.classList.remove("active");
    });

    document.querySelector('#menuList tbody').innerHTML='';
    modal_order.style.display = "none"; /* display -> none */
}

// Click outside and close (모달 밖을 클릭)
function outsideClick(e) {
    if (e.target == modal_order) {
        closeModal();
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
        if (nullCheck(e.target.innerText)) {
            e.target.classList.remove("active");
            return false;
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
});

/**
 * 주문버튼 클릭
 */
document.querySelector("#btnOrderAdd").addEventListener("click", (e) => {
    let orderAddData = null;

    document.querySelectorAll("#orderSmallMenu>ul>li").forEach((btn, idx) => {
        var chk = module.hasClass(btn.classList, "active");

        if (chk[0]) {
            //공백체크
            if (nullCheck(btn.innerText)) {
                btn.classList.remove("active");
                return false;
            }
            //dataset->JSONobj
            orderAddData = JSON.parse(btn.dataset.val);
        }
    });

    let orderKeys = document.querySelectorAll("#menuList tbody tr").length;
    let tbodyEle = document.querySelector("#menuList tbody");
    let trEle = document.createElement("tr");
    trEle.setAttribute("id", `order${orderKeys + 1}`);

    //이미 같은 메뉴를 등록한 경우
    let keyNum = [false];
    document.querySelectorAll("#menuList tbody tr td").forEach((e, i) => {
        var detailCd_bef = e.getAttribute("data-val");
        var detailCd_aft = orderAddData.MENU_DETAIL_CD;
        if (detailCd_bef == detailCd_aft) {
            //keyNum = [true, e.parentNode.getAttribute("id")];
            keyNum = [true, e.parentNode];
        }
    });

    if (keyNum[0]) {
        //동일한 주문이 이미 있을경우
        keyNum[1].children[2].innerText = `(${module.getCurTime()})`;
        keyNum[1].children[3].innerText = Number(keyNum[1].children[3].innerText) + 1;
        keyNum[1].children[4].innerText =
            Number(keyNum[1].children[4].innerText) + orderAddData.MENU_PRICE;
    } else {
        //신규주문
        var a1 = document.createElement("td");
        var a2 = document.createElement("td");
        var a3 = document.createElement("td");
        var a4 = document.createElement("td");
        var a5 = document.createElement("td");
        
        a1.setAttribute("data-val", orderAddData.MENU_DETAIL_CD); // a1.dataset.val=orderAddData.MENU_DETAIL_CD
        a1.innerText = orderKeys + 1;
        a2.innerText = orderAddData.MENU_NM;
        a3.innerText = `(${module.getCurTime()})`;
        a4.innerText = 1;
        a5.innerText = orderAddData.MENU_PRICE;

        trEle.appendChild(a1);
        trEle.appendChild(a2);
        trEle.appendChild(a3);
        trEle.appendChild(a4);
        trEle.appendChild(a5);

        tbodyEle.appendChild(trEle);
    }
});
