from flask import jsonify
from database import Connection
from common import *

def getTable(args):
    conn = Connection()
    if conn:
        try:
            sql = "select menu_cd,menu_kind from menu_tbl"
            data = conn.executeAll(sql)
            json_data = jsonify(data)
            return json_data
        except Exception as e:
            return jsonify({'message': f'{e}'}), 400