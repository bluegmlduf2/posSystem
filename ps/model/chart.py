from common import *

def getChart(args):
    conn = Connection()
    if conn:
        try:
            amount=args['amount']
            date=args['date']
            #ChartData
            sql = """SELECT  PAY_DATE ,AMT,(AMT / {amount}) * 100 AS percentage FROM (
                SELECT DATE_FORMAT(pt.PAY_DATE , "%%Y-%%m-%%d") AS PAY_DATE ,SUM(odt.ORDER_AMOUNT) AS AMT 
                FROM PAY_TBL pt 
                LEFT JOIN ORDER_DETAIL_TBL odt ON pt.ORDER_CD =odt.ORDER_CD 
                GROUP BY DATE_FORMAT(pt.PAY_DATE , "%%Y-%%m-%%d")
                HAVING PAY_DATE BETWEEN DATE_ADD(DATE_FORMAT('{date}', "%%Y-%%m-%%d"),INTERVAL -1 WEEK) 
                AND DATE_FORMAT('{date}', "%%Y-%%m-%%d") 
            ) AS TOT
            """.format(date=date,amount=amount)
            data = conn.executeAll(sql)

            json_data = json.dumps(data)
            return json_data
        except Exception as e:
            return json.dumps({'message': f'{e}'}), 400
