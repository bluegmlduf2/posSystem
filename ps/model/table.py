from common import *

def getTable():
    conn = Connection()
    if conn:
        try:
            #MainTable
            sql = """SELECT 
                    TT.TABLE_CD 
                    ,OT.ORDER_CD 
                    ,DATE_FORMAT(OT.ORDER_TIME, '%%Y-%%m-%%d %%H:%%i') AS ORDER_TIME 
                    ,IFNULL(TT.RESER_PEOPLE,0) AS RESER_PEOPLE 
                    ,DATE_FORMAT(TT.RESER_TIME, '%%Y-%%m-%%d %%H:%%i') AS RESER_TIME
                    ,SUM(ORDER_AMOUNT) AS AMT
                    FROM posDB.TABLE_TBL AS TT
                    JOIN posDB.ORDER_TBL AS OT 
                    ON TT.ORDER_CD = OT.ORDER_CD 
                    LEFT JOIN posDB.ORDER_DETAIL_TBL AS ODT
                    ON TT.ORDER_CD =ODT.ORDER_CD 
                    GROUP BY TT.TABLE_CD ,OT.ORDER_CD"""
            dataMain = conn.executeAll(sql)

            #ResvTable
            sql = """SELECT 
                    TT.TABLE_CD
                    ,IFNULL(TT.RESER_PEOPLE,0) AS RESER_PEOPLE
                    ,DATE_FORMAT(TT.RESER_TIME, '%%Y-%%m-%%d %%H:%%i') AS RESER_TIME 
                    FROM posDB.TABLE_TBL AS TT
                    WHERE RESER_TIME IS NOT NULL"""
            dataResv = conn.executeAll(sql)

            json_data = json.dumps([dataMain,dataResv])
            return json_data
        except Exception as e:
            return json.dumps({'message': f'{e}'}), 400
