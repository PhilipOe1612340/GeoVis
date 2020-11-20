import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public readonly amenities: BehaviorSubject<{ name: string; latitude: number; longitude: number }[]>
    = new BehaviorSubject<{ name: string; latitude: number; longitude: number }[]>([]);

  constructor(private http: HttpClient) { }

  /**
   * Get Pubs from Backend
   */
  public getPubs(): Observable<{ name: string; latitude: number; longitude: number }[]> {
    const url = 'http://localhost:5000/pubs';
    return this.http.post<{ name: string; latitude: number; longitude: number }[]>(url, {}, httpOptions);
  }

  /**
   * Get amenities with type from Backend
   */
  public getAmenities(type: string): Observable<{ name: string; latitude: number; longitude: number }[]> {
    const url = 'http://localhost:5000/ofType';
    return this.http.post<{ name: string; latitude: number; longitude: number }[]>(url, { type }, httpOptions);
  }

  /**
   * Get amenities with type from Backend
   */
  public getAllAmenities(): Observable<string[]> {
    const url = 'http://localhost:5000/typesAvaliable';
    return this.http.get<string[]>(url, httpOptions);
  }
}
