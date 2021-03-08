from flask import Blueprint, render_template,request,jsonify
from model import chart

chart_ab = Blueprint('chart_ab', __name__)

@chart_ab.route('/getChart' ,methods=['GET','POST', 'PUT', 'DELETE'])
def getChart():
    if request.method == 'POST':
        args=request.get_json()
        '''예약입력'''
        return chart.getChart(args)
