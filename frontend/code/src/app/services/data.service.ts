import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Geometry, Feature, Point } from 'geojson';

export type GeoObj = Feature<Point | Geometry, { name: string }>;

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

  constructor(private http: HttpClient) { }

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
