from flask import Blueprint, render_template,request
from model import order

order_ab = Blueprint('order_ab', __name__)

@order_ab.route('/menu' ,methods=['POST', 'PUT', 'DELETE'])
def menu():
    # if request.method == 'POST':
    #     data = request.get_json() #POST는 이렇게 요청메서드에 함께 오는 파라미터 값을 추출한다. data에는 dict 형식으로 값이 들어가게 된다. 
    #     print(data['email'])
    # if request.method == 'PUT':
    #     user = request.args.get('email')
    # if request.method == 'DELETE':
    #     user = request.args.get('email')

    #return make_response(jsonify({'status': True}), 200)
    '''메뉴대분류 가져오기'''
    return order.getMenu()
