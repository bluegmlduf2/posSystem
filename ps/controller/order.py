from flask import Blueprint, render_template,request,jsonify
from model import order

order_ab = Blueprint('order_ab', __name__)

@order_ab.route('/menu' ,methods=['GET','POST', 'PUT', 'DELETE'])
def menu():
    if request.method == 'POST':
        args=request.get_json()
        '''메뉴대분류 가져오기'''
        return order.getMenu(args)
    #     print(data['email'])
    # if request.method == 'PUT':
    #     user = request.args.get('email')
    # if request.method == 'DELETE':
    #     user = request.args.get('email')

    #return make_response(jsonify({'status': True}), 200)
    
