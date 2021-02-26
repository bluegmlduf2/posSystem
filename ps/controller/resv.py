from flask import Blueprint, render_template,request,jsonify
from model import resv

resv_ab = Blueprint('resv_ab', __name__)

@resv_ab.route('/insertResv' ,methods=['GET','POST', 'PUT', 'DELETE'])
def insertResv():
    if request.method == 'POST':
        args=request.get_json()
        '''예약입력'''
        return resv.insertResv(args)

@resv_ab.route('/cancelResv' ,methods=['GET','POST', 'PUT', 'DELETE'])
def cancelResv():
    if request.method == 'POST':
        args=request.get_json()
        '''예약취소'''
        return resv.cancelResv(args)