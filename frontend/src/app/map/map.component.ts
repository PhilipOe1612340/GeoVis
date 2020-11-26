import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService, GeoObj, Properties } from '../services/data.service';
import { environment } from 'src/environments/environment';
import { countries } from './overlay';

class Icon extends L.Icon<L.IconOptions>{
  constructor(prop: Properties) {
    super({
      iconUrl: environment.server + '/glyphs/' + prop.icon,
      // iconSize: [150, 150],
      // iconAnchor: [75, 75],
      className: prop.countryClass || "zoom-icon",
    });
  }
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private amenitiesLayer: L.LayerGroup<any> = L.layerGroup();
  private iconMap: WeakMap<Properties, Icon> = new WeakMap<Properties, Icon>()
  private highlighted: any = null;
  private amenities: GeoObj[] = [];

  constructor(dataService: DataService) {
    dataService.amenities.subscribe(value => {
      this.amenities = value;
      this.updateAmenitiesLayer();
    });
  }

  private updateAmenitiesLayer(): void {
    if (!this.map) {
      return;
    }

    const info = new L.Control();

    const highlightFeature = (e: L.LeafletMouseEvent) => {
      if (this.highlighted !== null) {
        this.amenitiesLayer.resetStyle(this.highlighted);
        this.highlighted = null;
      }
      var layer = e.target;
      layer.setStyle(style);
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      // info.update(layer.feature.properties);
      this.highlighted = e.target;
    }

    const resetHighlight = (e: L.LeafletMouseEvent) => {
      this.amenitiesLayer.resetStyle(e.target);
      // info.update();
    }

    // Statistics information panel
    // info.onAdd = () => {
    //   // info._div = L.DomUtil.create('div', 'info');
    //   info.update();
    //   // return this._div;
    // };
    // info.addTo(this.map);

    // remove old amenities
    this.map.removeLayer(this.amenitiesLayer);

    // @ts-ignore
    // this.amenitiesLayer = L.geoJSON({ "type": "FeatureCollection", features: this.amenities }, {
    this.amenitiesLayer = L.geoJSON(countries, {
      clickable: true,
      // pointToLayer: (feature, latLng) => {
      //   return L.marker(latLng).bindPopup(feature.properties.name).openPopup();
      // },
      // onEachFeature: (feature: GeoObj, layer) => {
      //   if (feature.geometry.type === 'Polygon' && feature.properties.icon) {
      //     let center: L.LatLngExpression = feature.properties.center!;
      //     if (!center) {
      //       // @ts-ignore
      //       const bounds = layer.getBounds(); // Get bounds of polygon
      //       center = bounds.getCenter(); // Get center of bounds
      //     }

      //     // Use center to put marker on map
      //     let icon;
      //     if (this.iconMap.has(feature.properties)) {
      //       icon = this.iconMap.get(feature.properties);
      //     } else {
      //       icon = new Icon(feature.properties);
      //       this.iconMap.set(feature.properties, icon);
      //     }

      //     L.marker(center, { icon })
      //     var popup = L.popup()
      //       .setLatLng(center)
      //       .setContent(feature.properties.name)
      //       .openOn(this.map);
      //     // .bindPopup().openPopup(center).addTo(this.map);
      //   }
      // }

      onEachFeature: (_feature, layer) => {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: highlightFeature,
        });
      }
    });

    function getColor() {
      return "#ff0000";
    }

    const style = () => {
      return {
        stroke: true,
        fill: true,
        fillColor: getColor(),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    }

    // this.amenitiesLayer.addTo(this.map);
    this.map.addLayer(this.amenitiesLayer);

    this.map.on("zoomend", () => {
      const newZoom = (2 * this.map.getZoom() ** 2) + 'px';
      document.documentElement.style.setProperty("--zoom-image-size", newZoom);
    })
  }

  /**
   * Often divs and other HTML element are not available in the constructor. Thus we use onInit()
   */
  ngOnInit(): void {
    // basic setup, create a map in the div with the id "map"
    this.map = L.map('map', { crs: L.CRS.Simple }).setView([47.66, 9.175], 2);

    const bounds: L.LatLngBoundsExpression = [[-180, -180], [180, 180]];
    const image = L.imageOverlay('./assets/black.svg', bounds).addTo(this.map);
  }

  /**
   * Add a marker at the specified position to the map.
   * If a name is provided, also include a popup when marker is clicked.
   */
  public addMarker(latitude: number, longitude: number, name?: string): void {
    const marker = L.marker([latitude, longitude]);

    if (name) {
      marker.bindPopup(name);
    }

    marker.addTo(this.map);
  }
}
