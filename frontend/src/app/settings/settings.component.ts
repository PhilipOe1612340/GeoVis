import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService, GeoObj } from '../services/data.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  // location form stores and validates the inputs from our forms defined in the html document
  public locationForm: FormGroup;
  public allAmenities: string[] = [];
  public autoComplete = new FormControl();
  public filteredAmenities!: Observable<string[]>;

  constructor(fb: FormBuilder, private dataService: DataService) {
    this.locationForm = fb.group({
      latitude: fb.control(47.66, [
        Validators.required,
        Validators.min(-90),
        Validators.max(90),
      ]),
      longitude: fb.control(9.175, [
        Validators.required,
        Validators.min(-180),
        Validators.max(180),
      ]),
    });
  }

  ngOnInit(): void {
    this.dataService.getAllAmenities()
      .pipe(tap(v => console.log('number of amenities: ', v.length)))
      .subscribe(all => this.allAmenities = all);

    this.filteredAmenities = this.autoComplete.valueChanges.pipe(map(value => this._filter(value)));
  }

  private _filter(value: string): string[] {
    if (!value) {
      return this.allAmenities;
    }
    const filterValue = value.toLowerCase();
    return this.allAmenities.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * When the add marker button was clicked, emit the location where the marker should be added
   * @param marker Latitude and longitude of the marker
   */
  onSubmit(marker: { latitude: number; longitude: number }): void {
    const geo: GeoObj = {
      type: 'Point',
      coordinates: [marker.latitude, marker.longitude],
      properties: { name: 'myPoint' },
    } as any;
    this.dataService.amenities.next([geo]);
  }

  async addPubs(): Promise<void> {
    const pubs = await this.dataService.getPubs().toPromise();
    this.dataService.amenities.next(pubs);
  }

  async addType(element: HTMLInputElement): Promise<void> {
    const markers = await this.dataService.getAmenities(element.value).toPromise();
    this.dataService.amenities.next(markers);
  }
}
