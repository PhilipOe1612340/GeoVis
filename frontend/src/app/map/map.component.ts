import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService, GeoObj } from '../services/data.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private amenitiesLayer: L.LayerGroup<any> = L.layerGroup();
  private amenities: GeoObj[] = [];

  constructor(dataService: DataService) {
    dataService.amenities.subscribe((value: GeoObj[]) => {
      this.amenities = value;
      this.updateAmenitiesLayer();
    });
  }

  private updateAmenitiesLayer(): void {
    if (!this.map) {
      return;
    }
    // remove old amenities
    this.map.removeLayer(this.amenitiesLayer);

    // create a marker for each supplied amenity
    const markers = this.amenities.map((a: GeoObj) => L.geoJSON(a).bindPopup(a.properties?.name || 'no name'));

    // create a new layer group and add it to the map
    this.amenitiesLayer = L.layerGroup(markers);
    markers.forEach((m) => m.addTo(this.amenitiesLayer));
    this.map.addLayer(this.amenitiesLayer);
  }

  /**
   * Often divs and other HTML element are not available in the constructor. Thus we use onInit()
   */
  ngOnInit(): void {
    // some settings for a nice shadows, etc.
    const iconRetinaUrl = './assets/marker-icon-2x.png';
    const iconUrl = './assets/marker-icon.png';
    const shadowUrl = './assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = iconDefault;

    // basic setup, create a map in the div with the id "map"
    this.map = L.map('map').setView([47.66, 9.175], 13);

    // set a tilelayer, e.g. a world map in the background
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }
}
