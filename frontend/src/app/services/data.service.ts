import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Geometry, Feature, Point } from 'geojson';

export interface Properties {
  name: string;
  center?: { lat: number, lng: number };
  icon?: string;
  countryClass?: string;
}

export type GeoObj = Feature<Point | Geometry, Properties>;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public readonly amenities: BehaviorSubject<GeoObj[]> = new BehaviorSubject<GeoObj[]>([]);

  constructor(private http: HttpClient) {
    setInterval(() => {

      this.amenities.next([{
        "type": "Feature",
        "properties": { name: "test polygon", icon: "0.jpg" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                53.0859375,
                56.559482483762245
              ],
              [
                18.6328125,
                49.15296965617042
              ],
              [
                23.5546875,
                46.31658418182218
              ],
              [
                37.96875,
                47.27922900257082
              ],
              [
                36.9140625,
                44.84029065139799
              ],
              [
                41.484375,
                44.08758502824516
              ],
              [
                42.5390625,
                40.44694705960048
              ],
              [
                48.515625,
                39.639537564366684
              ],
              [
                47.4609375,
                44.33956524809713
              ],
              [
                49.92187499999999,
                46.31658418182218
              ],
              [
                47.4609375,
                48.922499263758255
              ],
              [
                50.625,
                50.958426723359935
              ],
              [
                53.0859375,
                56.559482483762245
              ]
            ]
          ]
        }
      },
      ])
    }, 100)
  }

  /**
   * Get Pubs from Backend
   */
  public getPubs(): Observable<GeoObj[]> {
    const url = 'http://localhost:5000/pubs';
    return this.http.post<GeoObj[]>(url, {}, httpOptions);
  }

  /**
   * Get amenities with type from Backend
   */
  public getAmenities(type: string): Observable<GeoObj[]> {
    const url = 'http://localhost:5000/ofType';
    return this.http.post<GeoObj[]>(url, { type }, httpOptions);
  }

  /**
   * Get amenities with type from Backend
   */
  public getAllAmenities(): Observable<string[]> {
    const url = 'http://localhost:5000/typesAvaliable';
    return this.http.get<string[]>(url, httpOptions);
  }
}
