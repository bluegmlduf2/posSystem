from common import *

def getChart(args):
    conn = Connection()
    if conn:
        try:
            amount=args['amount']
            date=args['date']

            #ChartData
            sql = """SELECT  PAY_DATE ,AMT,TRUNCATE((AMT / {amount}) * 100,1) AS PERCENTAGE FROM (
                SELECT DATE_FORMAT(pt.PAY_DATE , "%%Y-%%m-%%d") AS PAY_DATE ,SUM(odt.ORDER_AMOUNT) AS AMT 
                FROM PAY_TBL pt 
                LEFT JOIN ORDER_DETAIL_TBL odt ON pt.ORDER_CD =odt.ORDER_CD 
                GROUP BY DATE_FORMAT(pt.PAY_DATE , "%%Y-%%m-%%d")
                HAVING PAY_DATE BETWEEN DATE_ADD(DATE_FORMAT('{date}', "%%Y-%%m-%%d"),INTERVAL -1 WEEK) 
                AND DATE_FORMAT('{date}', "%%Y-%%m-%%d") 
            ) AS TOT
            """.format(date=date,amount=amount)
            data = conn.executeAll(sql)

            #ChartTotal
            sql = """SELECT TRUNCATE(SUM(AMT),0) AS SUM,TRUNCATE(AVG(AMT),0) AS AVG,AVG(TRUNCATE((AMT / {amount}) * 100,1)) AS PERAVG FROM (
                SELECT DATE_FORMAT(pt.PAY_DATE , "%%Y-%%m-%%d") AS PAY_DATE ,SUM(odt.ORDER_AMOUNT) AS AMT 
                FROM PAY_TBL pt 
                LEFT JOIN ORDER_DETAIL_TBL odt ON pt.ORDER_CD =odt.ORDER_CD 
                GROUP BY DATE_FORMAT(pt.PAY_DATE , "%%Y-%%m-%%d")
                HAVING PAY_DATE BETWEEN DATE_ADD(DATE_FORMAT('{date}', "%%Y-%%m-%%d"),INTERVAL -1 WEEK) 
                AND DATE_FORMAT('{date}', "%%Y-%%m-%%d") 
            ) AS TOT
            """.format(date=date,amount=amount)
            dataTotal = conn.executeAll(sql)

            json_data = json.dumps([data,dataTotal])
            return json_data
        except Exception as e:
            return json.dumps({'message': f'{e}'}), 400
