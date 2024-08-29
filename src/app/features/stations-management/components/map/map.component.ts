import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { TStationBasic, TStationListed } from '@/core/models/stations.model';
import { mapMarkerTemplate } from '../../utils';
import {
  MAP_LINE_COLOR,
  MARKER_CONNECTED_COLOR,
  MARKER_MAIN_COLOR,
  MARKER_REGULAR_COLOR,
} from '../../config/consts';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnChanges {
  @Input({ required: true }) mainStation!: Partial<Omit<TStationBasic, 'id'>>;

  @Input({ required: true }) connectedStations!: TStationListed[];

  @Input({ required: true }) disconnectedStations!: TStationListed[];

  @Output() mapClick = new EventEmitter<
    Pick<TStationBasic, 'latitude' | 'longitude'>
  >();

  @Output() connect = new EventEmitter<TStationListed>();

  @Output() disconnect = new EventEmitter<TStationListed>();

  private map?: Leaflet.Map;

  private markers: Leaflet.Marker[] = [];

  private routes: (Leaflet.Control | Leaflet.Polyline)[] = [];

  public options: Leaflet.MapOptions = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    ],
    zoom: 1,
    center: { lat: 20, lng: 90 },
  };

  ngOnChanges(): void {
    if (this.map) {
      this.rerenderMap();
      this.map.invalidateSize();
    }
  }

  public onMapReady(event: Leaflet.Map) {
    this.map = event;
    this.rerenderMap();
  }

  private rerenderMap() {
    this.resetMarkers();
    this.resetRoutes();
    this.initMainMarker();
    this.initDisconnectedMarkers();
    this.initConnectedMarkers();
    this.initRoutes();
  }

  private resetMarkers() {
    while (this.markers.length > 0) {
      this.markers.pop()?.remove();
    }
  }

  private resetRoutes() {
    while (this.routes.length > 0) {
      const route = this.routes.pop();
      if (route) {
        if (route instanceof Leaflet.Control) {
          this.map?.removeControl(route);
        } else {
          route.remove();
        }
      }
    }
  }

  private initMainMarker() {
    const { latitude, longitude, city } = this.mainStation;
    if (!latitude || !longitude) return;
    const mainSt: Omit<TStationBasic, 'id'> = {
      latitude,
      longitude,
      city: city ?? 'Unset',
    };
    const marker = this.generateMainMarker(mainSt);
    marker.addTo(this.map!);
    this.markers.push(marker);
  }

  private initConnectedMarkers() {
    this.connectedStations.forEach((station) => {
      const marker = this.generateMarker(station, true);
      marker.addTo(this.map!);
      this.markers.push(marker);
    });
  }

  private initDisconnectedMarkers() {
    this.disconnectedStations.forEach((station) => {
      const marker = this.generateMarker(station);
      marker.addTo(this.map!);
      this.markers.push(marker);
    });
  }

  private initRoutes() {
    const { latitude, longitude } = this.mainStation;
    if (latitude && longitude) {
      this.connectedStations.forEach((s) => {
        const route = this.generateLine(
          Leaflet.latLng(latitude, longitude),
          Leaflet.latLng(s.latitude, s.longitude),
        );
        route.addTo(this.map!);
        this.routes.push(route);
      });
    }
  }

  public mapClicked(event: Leaflet.LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    this.moveMainMarker(lat, lng);
  }

  private generateLine(from: Leaflet.LatLng, to: Leaflet.LatLng) {
    return Leaflet.polyline([from, to], { color: MAP_LINE_COLOR });
  }

  // MAIN MARKER
  private generateMainMarker(station: Omit<TStationBasic, 'id'>) {
    const position: Leaflet.LatLngExpression = {
      lat: station.latitude,
      lng: station.longitude,
    };
    const marker = Leaflet.marker(position, {
      draggable: true,
      icon: this.generateIcon(MARKER_MAIN_COLOR),
    });
    marker.on('dragend', (event) => this.mainMarkerDragEnd(event));
    marker.bindPopup(`
      <b>${station.city}</b>
    `);
    return marker;
  }

  private mainMarkerDragEnd(event: Leaflet.DragEndEvent) {
    const location = event.target.getLatLng();
    this.moveMainMarker(location.lat, location.lng);
  }

  private moveMainMarker(lat: number, lng: number) {
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      this.mapClick.emit({ latitude: lat, longitude: lng });
    }
  }

  // DISCONNECTED/CONNECTED MARKER
  private generateMarker(station: TStationListed, connected?: boolean) {
    const position: Leaflet.LatLngExpression = {
      lat: station.latitude,
      lng: station.longitude,
    };
    const markerId = `marker${station.id}`;
    const marker = Leaflet.marker(position, {
      draggable: false,
      icon: this.generateIcon(
        connected ? MARKER_CONNECTED_COLOR : MARKER_REGULAR_COLOR,
      ),
    });
    marker.bindPopup(`
      <b>${station.city}</b>
      <button
      class="p-button p-component ${connected ? 'p-button-danger' : 'p-button-success'}"
      id="${markerId}">
      ${connected ? 'Disconnect' : 'Connect'}
      </button>
    `);
    marker.on('popupopen', () => {
      const button = document.getElementById(markerId);
      if (button) {
        button.addEventListener(
          'click',
          () =>
            connected
              ? this.disconnect.emit(station)
              : this.connect.emit(station),
          { once: true },
        );
      }
    });
    return marker;
  }

  private generateIcon(color: string) {
    return Leaflet.divIcon({
      iconAnchor: [20, 39],
      popupAnchor: [0, -35],
      html: mapMarkerTemplate(color),
    });
  }
}
