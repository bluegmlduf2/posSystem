/* 싱글턴은 기본적으로 하나의 인스턴스만 생성하기에 메모리를 절약하고 데이터의 유일성을 지킬수있음
그러나 하나의 인스턴스를 여러군데서 사용하기때문에 객체간 결합성이 높아져서 객체지향적이지 못하게 됨*/
const Singleton = (function () {
    var instance;
    var a = "privateValue";

    function initiate() {
        return {
            a: a,
            b: function () {
                alert(a);
            },
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = initiate();
            }
            return instance;
        },
    };
})();
