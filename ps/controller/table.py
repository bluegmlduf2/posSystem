from flask import Blueprint, render_template,request
from model import table

# 라우팅 기본경로 table을 가지는 블루프린터 객체를 생성
table_ab = Blueprint('table_ab', __name__)

# 애너테이션함수:클로저를이용하여해당함수실행전에실행됨
# 이 경우 /table/index 가 된다
@table_ab.route('/index',methods=['GET','POST', 'PUT', 'DELETE'])
def index():
    '''테이블 메인 페이지'''
    if request.method == 'GET':
        return render_template('/table.html')

@order_ab.route('/table' ,methods=['GET','POST', 'PUT', 'DELETE'])
def table():
    if request.method == 'POST':
        args=request.get_json()
        '''테이블리스트 가져오기'''
        return table.getTable(args)