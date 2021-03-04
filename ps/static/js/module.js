/* * 
    * -------------------------------- 
    * 모듈 패턴을 구현한 클로저 코드 
    * (자동호출 구조가 아니므로 인스턴스화 가능) 
    * 클로저:변수에 해당 함수를 저장해서 반환하는 형식 , 메모리가 반환되어도 사용가능 , 보안(지역변수공개안함) , 호출할수없는 변수(지역변수)호출가능
    * 
    * 객체 선언방식: 1. 객체리터럴 a={} //인스턴스화 불가
    * 객체 선언방식: 2.생성자함수 선언 function Person(name){this.name+name} , new Person('a') 로 선언하며 첫글자는 대문자가 관례 => 즉 new Person() 
    * 위의 객체 선언방식의 차이: 객체리터럴=재사용불가 ,생성자함수=재사용가능(인스턴스화)
    * 객체 리터럴 방식의 프로토타입 객체 : Object(Object.prototype) ->최상위
    * 생성자 함수 방식의 프로토타입 객체: Person(Person.prototype) -> 해당 객체
    * JS는 프로토타입언어이다. 객체의 __proto__를 타고 계속 상위객체로 올라감(상속같음)
    * 프로토타입언어는 OOP객체지향의 한 종류. JS는 클래스를 상속하는것과 다름. 객체의 원형(프로토타입)을 복제하는 방식
    * 생성한 객체의 __proto__를 계속 타고 올라가면 constructor: ƒ Object()가 존재하고 이 프로퍼티가 해당 객체를 생성한다.
    * 가비지컬렉터:메모리에 할당된 것을 지움->레퍼런스카운팅이0인것 , 레퍼런스카운팅:할당되어 참조된 수 최초 첫사용시 1이됨, a=null로 하면 레퍼런스카운팅0이 되어 가비지컬렉션의 정리대상이됨
    * 메모리누수방지: 전역변수=null , 이벤트언바인딩
    * 레퍼런스:메모리상의 주소, 함수 내에서 지역변수가 할당되고 객체가 호출되면 종료 된 후 메모리에 반환한다 
    * 객체명.property.변수명 사용이유 = 객체원형에 접근해서 영구적으로 추가 // property뜻:원형 //반복을 피해서 메모리절감
    * function Person(name){this.name=name;}
    //1.  객체명.prototype.프라퍼티명 은 객체의 원형에 접근하여 모든 인스턴스에서 공유함. 
    Person.prototype.sum = function(){return 'prototype : '+(this.name);}
    var kim = new Person('kim');
    //2.  인스턴스명.프라퍼티명 으로 추가 할 경우 해당 인스턴스에서만 사용함
    kim.sum = function(){return 'this : '+(this.name);}
    * function a(){ b=function(){return '1';}} 이런식으로 내부에서 함수를 선언해 줄 경우 인스턴스화할때 마다 함수를 생성하기때문에 메모리가 낭비. 그러므로 prototype을 사용
    * property===__propt__  
    * 생성자에 this를 사용하는 이유: this를 사용하지않으면 인스턴스생성시 전달한 변수가 저장되지않음
    * var a=function(name){this.name=name}
        new a('김')
        a {name: "김"}
      var b=function(args){name=args}
        new b('이')
        b {} //아무것도 표시되지 않음
    *JS는 웹브라우저의 렌더링머신에따라서 다르지만 인터프리터라고 생각.
    *타입스크립트는 JS를 컴파일하기때문에 사전에 에러를 알수있다
    * -------------------------------- 
* */

//이런 방식으로 선언하면 new module()로 사용하고 지역변수로 사용된 경우 함수호출후 메모리에서 반환
const module = (function () {
    //아래의 함수들이 전부 비공개됨(클로저)

    //시간함수
    function _getCurTime() {
        let today = new Date();
        let hour = today.getHours().toString().lpad(2, "0"); //자바스크립트는 인터프리터언어인데 lpad()를 module변수 아래에
        let min = today.getMinutes().toString().lpad(2, "0");

        return `${hour}시 ${min}분 `;
    }

    //시간+날짜함수
    function _getCurDate() {
        let today = new Date();
        let days = new Array("일", "월", "화", "수", "목", "금", "토");

        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let date = today.getDate();
        let day = days[today.getDay()];
        let hour = today.getHours().toString().lpad(2, "0");
        let min = today.getMinutes().toString().lpad(2, "0");

        return `${year}년 ${month}월 ${date}일 ${day}요일 \n ${hour}시 ${min}분 `;
    }

    //시간+날짜함수
    function _getCurDateHyphen() {
        let today = new Date();
        let days = new Array("일", "월", "화", "수", "목", "금", "토");

        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let date = today.getDate();
        let day = days[today.getDay()];
        let hour = today.getHours().toString().lpad(2, "0");
        let min = today.getMinutes().toString().lpad(2, "0");
        let sec = today.getSeconds().toString().lpad(2, "0");

        return `${year}-${month}-${date} ${hour}:${min}:${sec}`;
    }

    /**
     * 클래스 존재여부 체크
     * @param {classList} classList
     * @param {Array} className
     */
    function _hasClass(classList, className) {
        let chk = false;
        let eleNm = "";

        classList.forEach((k, v) => {
            let arrChk = className.indexOf(k);
            if (arrChk > -1) {
                eleNm = className[arrChk];
                chk = true;
            }
        });

        return [chk, eleNm];
        //아래의 객체리터럴의 반환형으로 function(){}형태로 한번더 안 감싸서 보내었기 때문에 공개됨
    }

    /** AJAX 공통*/
    function _ajax(http_method, url, sendData = {}, aync = true) {
        return ajax(http_method, url, sendData, aync); //여기서 실행하고 결과를 반환하면서 결과를 클로저시킨다
    }

    // 공개될 멤버 (특권 메소드) 정의
    // hasClass같은 경우는 function(){}으로 한번 더 안 감싼 상태기 때문에 공개됨 getCurTime,hasClass를 console.log()찍으면 나옴
    // 실행한 뒤 실행 결과를 넘길경우 클로저처리(비공개)됨
    return {
        getCurTime: function () {
            return _getCurTime(); //비공개
        }, //실행된 함수의 결과를 넘겨줌 ->비공개
        getCurDate: function () {
            return _getCurDate(); //비공개
        },
        getCurDateHyphen: function () {
            return _getCurDateHyphen(); //비공개
        },
        hasClass: _hasClass, //공개
        //실행되기 전의 함수소스코드를 통채로 넘겨줌 -> 공개
        ajax: _ajax,
    };
})();

/**
 * 좌측문자열채우기
 * @params
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
//String객체(원시객체).prototype.함수명으로 추가함
String.prototype.lpad = function (padLen, padStr) {
    var str = this;
    if (padStr.length > padLen) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    while (str.length < padLen) str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
};

/**
 * 컴마 3자릿수로 표시
 * @param {} str 
 */
Object.prototype.addComma=function (str) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return str.toString().replace(regexp, ',');
}

/**
 * 컴마 제거
 * @param {} str 
 */
Object.prototype.removeComma=function (str) {
    var regexp = /,/g;
    return str.toString().replace(regexp, '');
}

/**
 * NULL CHECK (if null return true )
 * @param {*} 체크할 파라미터
 */
function nullCheck(obj) {
    if (typeof obj === "object") {
        //빈객체인지체크
        if (Object.keys(obj).length == 0) {
            return true;
        } else {
            return false;
        }
    } else if (Array.isArray(obj)) {
        //빈배열인지체크
        if (obj.length == 0) {
            return true;
        } else {
            return false;
        }
    } else if (typeof obj === "string") {
        //문자열공백체크(정규식)
        if (obj.replace(/(\s*)/g, "")=="") {
            return true;
        } else {
            return false;
        }
    } else if (typeof obj === "undefined") {
        //undefiend 체크
        return true;
    }
}

/**
 * @param {*} http_method 'GET','POST', 'PUT', 'DELETE'
 * @param {*} url  URL
 * @param {*} sendData DATA
 * @param {*} aync true / false
 */
function ajax(http_method, url, sendData, aync) {
    return new Promise((resolve, reject) => {
        try {
            //프로미스내에서 resolve, reject를 만난 경우 즉시 종료됨 
            var xhr = new XMLHttpRequest(); // XMLHttpRequest객체 생성, 함수 내 지역변수로 선언 권장
            // onreadystatechange는 서버와의 통신이 끝났을 때 호출 됨
            xhr.onreadystatechange = function () {
                // readyState = 2 송신완료 , 3 수신대기중 , 4,통신완료
                if (xhr.readyState === 4) {
                    //401 인증실패(Unauthorized) ,403 접근거절(Forbidden),404 파일없음(Not Found)
                    if (xhr.status === 200 || xhr.status === 302) {
                        //console.log("통신성공");
                        resolve(xhr.responseText);
                    } else {
                        console.log("통신실패"); //이거 만약 안되면 promise로 처리해야함.
                        reject(xhr.responseText);
                    }
                }
            };
            jsonData = JSON.stringify(sendData); //문자열로 송수신하기때문에 json형태의 문자열로 변경해준다

            xhr.open(http_method, url, aync); // HTTP_METHOD / URL / true(비동기적), false(동기적)
            xhr.setRequestHeader("Content-Type", "application/json"); // JSON전송시 사용
            xhr.send(jsonData); //XMLHttpRequest객체가 통신을 시작
            //throw new Error("에러테스트 ")
        } catch (error) {
            //try문에서 문법적 오류가 있을 경우 캐치. 그리고 reject
            reject(error);
        }
    }).catch((result)=>{
        debugger
        throw new Error(JSON.parse(result).message)
    });
}

//GetWeek (날짜의 주를 가져온다)
Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
  var dayOfYear = ((today - onejan + 86400000)/86400000);
  return Math.ceil(dayOfYear/7)
};