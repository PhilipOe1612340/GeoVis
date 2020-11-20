from flask import Flask, jsonify, request
from flask_cors import CORS
from psycopg2 import sql
import psycopg2

from db import DBConnector

db = DBConnector()
app = Flask(__name__)
CORS(app)

def getQuery(amenityType):
    return sql.SQL("""WITH konstanz AS 
        (SELECT way
        FROM planet_osm_polygon
        WHERE admin_level='8' and name = 'Konstanz')
        SELECT points.name, ST_Y(points.way) as latitude , ST_X(points.way) as longitude
        from planet_osm_point points join konstanz on st_contains(konstanz.way, points.way)
        where points.amenity = {}
        """).format(sql.Literal(amenityType)
    )

@app.route('/pubs', methods=["GET", "POST"])
def pubs():
    query = sql.SQL("""WITH konstanz AS 
    (SELECT way
    FROM planet_osm_polygon
    WHERE admin_level='8' and name = 'Konstanz')
    SELECT points.name, ST_Y(points.way) as latitude , ST_X(points.way) as longitude
    from planet_osm_point points join konstanz on st_contains(konstanz.way, points.way)
    where points.amenity in ('bar', 'pub')
    """)
    
    # stmt = sql.SQL(""" SELECT count(*) FROM {table_name}""").format(
    #     table_name=sql.Identifier('planet_osm_polygon')
    # )
    # sql.Literal(amenity).as_string(connection)

    results = db.execute(query)
    
    return jsonify([{'name': r[0], 'latitude': r[1], 'longitude': r[2]} for r in results]), 200


@app.route('/ofType', methods=['GET', 'POST'])
def ofType():
    body = request.json
    print(body)
    amenityType = body['type']
    
    results = db.execute(getQuery(amenityType))
    return jsonify([{'name': r[0], 'latitude': r[1], 'longitude': r[2]} for r in results]), 200

@app.route('/typesAvaliable', methods=['GET'])
def allTypes():
    results = db.execute(sql.SQL("""Select point.amenity from planet_osm_point as point
        inner JOIN planet_osm_polygon as region 
        ON ST_Contains(region.way, point.way) 
        WHERE region.admin_level='8' and region.name = 'Konstanz' and point.amenity is not Null and point.name is not Null
        group by point.amenity"""))
    return jsonify([r[0] for r in results]), 200

