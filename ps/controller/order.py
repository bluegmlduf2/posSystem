from flask import Blueprint, render_template,request,jsonify
from model import order

order_ab = Blueprint('order_ab', __name__)

@order_ab.route('/menu' ,methods=['GET','POST', 'PUT', 'DELETE'])
def menu():
    if request.method == 'POST':
        args=request.get_json()
        '''메뉴중분류 가져오기'''
        return order.getMenu(args)
    #     print(data['email'])
    # if request.method == 'PUT':
    #     user = request.args.get('email')
    # if request.method == 'DELETE':
    #     user = request.args.get('email')

    #return make_response(jsonify({'status': True}), 200)
    
@order_ab.route('/menuDetail' ,methods=['GET','POST', 'PUT', 'DELETE'])
def menuDetail():
    if request.method == 'POST':
        args=request.get_json()
        '''메뉴중분류 가져오기'''
        return order.getMenuDetail(args)

@order_ab.route('/orderList' ,methods=['GET','POST', 'PUT', 'DELETE'])
def orderList():
    if request.method == 'POST':
        args=request.get_json()
        '''주문리스트 가져오기'''
        return order.getOrderList(args)        

@order_ab.route('/insertOrder' ,methods=['GET','POST', 'PUT', 'DELETE'])
def insertOrder():
    if request.method == 'POST':
        args=request.get_json()
        '''주문입력'''
        return order.insertOrder(args)

@order_ab.route('/cancelOrder' ,methods=['GET','POST', 'PUT', 'DELETE'])
def cancelOrder():
    if request.method == 'POST':
        args=request.get_json()
        '''주문입력'''
        return order.cancelOrder(args)
    #     print(data['email'])
    # if request.method == 'PUT':
    #     user = request.args.get('email')
    # if request.method == 'DELETE':
    #     user = request.args.get('email')

    #return make_response(jsonify({'status': True}), 200)