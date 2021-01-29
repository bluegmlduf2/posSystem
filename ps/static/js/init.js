/**
 * INIT
 */
(() => {
    getMenu(); //메뉴중분류가져오기
})();

/**
 * 메뉴중분류가져오기
 */
function getMenu() {
    module
        .ajax("POST", "/order/menu")
        .then((result) => {
            let resultJson = JSON.parse(result); //menu_cd,menu_kind

            document
                .querySelectorAll("#orderMidMidMenu>ul>li")
                .forEach((btn, idx) => {
                    debugger
                    let menuKind = resultJson[idx].menu_kind;
                    if (menuKind.nullCheck()) {
                        debugger
                    }
                    btn.innerHTML = menuKind;
                    btn.setAttribute("data-val", resultJson[idx].menu_cd);
                    //console.log(elem.dataset.val);
                    //console.log(elem.getAttribute('data-val')); // 데이터셋 미지원 브라우저에서는 getAttribute()로 접근해야 함
                    //elem.dataset.val = "1";
                    //elem.dataset //맵형태로 모든 데이터셋반환
                });
        })
        .catch((result) => {
            console.log(result);
        });
}
