from flask import Blueprint, render_template
from model import table

# 라우팅 기본경로 table을 가지는 블루프린터 객체를 생성
table_ab = Blueprint('table_ab', __name__)

# 애너테이션함수:클로저를이용하여해당함수실행전에실행됨
# 이 경우 /table/index 가 된다
@table_ab.route('/index')
def index():
    '''테이블페이지'''
    return render_template('/table.html')
