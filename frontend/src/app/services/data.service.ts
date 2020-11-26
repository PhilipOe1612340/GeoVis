import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Geometry, Feature, Point } from 'geojson';
import { environment } from 'src/environments/environment';

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
  private server: string = environment.server;

  constructor(private http: HttpClient) { }

  /**
   * Get Pubs from Backend
   */
  public getPubs(): Observable<GeoObj[]> {
    const url = this.server + '/pubs';
    return this.http.post<GeoObj[]>(url, {}, httpOptions);
  }

  /**
   * Get amenities with type from Backend
   */
  public getAmenities(type: string): Observable<GeoObj[]> {
    const url = this.server + '/ofType';
    return this.http.post<GeoObj[]>(url, { type }, httpOptions);
  }

  /**
   * Get amenities with type from Backend
   */
  public getAllAmenities(): Observable<string[]> {
    const url = this.server + '/typesAvaliable';
    return this.http.get<string[]>(url, httpOptions);
  }
}
