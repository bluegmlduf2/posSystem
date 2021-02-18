from common import *

def getTable():
    conn = Connection()
    if conn:
        try:
            sql = """SELECT TT.TABLE_CD ,OT.ORDER_CD ,TT.RESER_PEOPLE ,SUM(ORDER_AMOUNT) AS AMT
                    FROM posDB.TABLE_TBL AS TT
                    JOIN posDB.ORDER_TBL AS OT 
                    ON TT.ORDER_CD = OT.ORDER_CD 
                    LEFT JOIN posDB.ORDER_DETAIL_TBL AS ODT
                    ON TT.ORDER_CD =ODT.ORDER_CD 
                    GROUP BY TT.TABLE_CD ,OT.ORDER_CD"""
            data = conn.executeAll(sql)
            json_data = json.dumps(data)
            return json_data
        except Exception as e:
            return json.dumps({'message': f'{e}'}), 400