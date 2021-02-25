from flask import Blueprint, render_template,request,jsonify
from model import pay

pay_ab = Blueprint('pay_ab', __name__)

@pay_ab.route('/insertPay' ,methods=['GET','POST', 'PUT', 'DELETE'])
def insertPay():
    if request.method == 'POST':
        args=request.get_json()
        '''주문입력'''
        return pay.insertPay(args)