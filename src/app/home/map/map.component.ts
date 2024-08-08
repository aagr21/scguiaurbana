import { Component, inject, Input, OnInit } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import {
  latLng,
  MapOptions,
  tileLayer,
  Map as LMap,
  Control,
  geoJSON,
  LatLng,
  Layer,
  marker,
  icon,
} from 'leaflet';
import { Feature, Point } from 'geojson';
import { LeafletLayersTreeComponent } from './controls/leaflet-layers/leaflet-layers-tree.component';
import { MapService } from '@services/map.service';
import { CommonModule } from '@angular/common';
import { AllData, SpeedReducer } from '@models/interfaces';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule, LeafletLayersTreeComponent, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: 'Google Maps',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxNativeZoom: 20,
      }),
    ],
    zoom: 13,
    center: latLng(-17.779223, -63.18164),
    attributionControl: false,
    maxBoundsViscosity: 1.0,
    zoomAnimation: true,
  };

  map!: LMap;
  treeOptions: Control.Layers.TreeOptions = {
    namedToggle: true,
    selectorBack: false,
    collapsed: false,
  };

  googleMapsLayer = tileLayer(
    'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 22,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
  );

  baseTree: Control.Layers.TreeObject = {
    label: 'Imágenes',
    children: [
      {
        label: 'Google Maps',
        layer: this.googleMapsLayer,
        name: 'Google Maps',
      },
      {
        label: 'Google Satellite',
        layer: tileLayer(
          'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          {
            maxZoom: 22,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        ),
        name: 'Google Satellite',
      },
      {
        label: 'Open Street Map',
        layer: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 20,
        }),
        name: 'Open Street Map',
      },
    ],
  };
  mapService = inject(MapService);
  @Input() allData!: AllData;

  overlayTree: Control.Layers.TreeObject = {
    label: 'Puntos de Interés',
    children: [],
  };

  ngOnInit(): void {
    this.overlayTree.children = [
      {
        label: 'Paradas de Micros',
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: this.allData.busStops.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [30, 30],
                  iconUrl: '/assets/images/bus-stop.svg',
                }),
              });
            },
          }
        ),
      },
      {
        label: 'Cámaras',
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: this.allData.cityCameras.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: element.geom.coordinates,
                },
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [55, 55],
                  iconUrl: '/assets/images/camera.svg',
                }),
              });
            },
          }
        ),
      },
      {
        label: 'Canales de Transporte',
        layer: geoJSON(
          {
            type: 'FeatureCollection',
            features: this.allData.channelsRoutes.map((element) => {
              return {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: element.geom.coordinates,
                },
                properties: { strokeColor: element.color },
              };
            }),
          } as any,
          {
            style(feature) {
              return {
                color: feature!.properties.strokeColor,
                weight: 3.5,
              };
            },
          }
        ),
      },
      {
        label: 'Reductores',
        selectAllCheckbox: true,
        children: this.allData.speedReducersGroups.map((element) => {
          return {
            label: element.year,
            layer: geoJSON(
              {
                type: 'FeatureCollection',
                features: element.speedReducers.map((element) => {
                  return {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: element.geom.coordinates,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [25, 25],
                      iconUrl: '/assets/images/bump.png',
                    }),
                  });
                },
              }
            ),
          };
        }),
      },
      {
        label: 'Semáforos',
        selectAllCheckbox: true,
        children: this.allData.trafficLightsGroups.map((element) => {
          return {
            label: element.type,
            layer: geoJSON(
              {
                type: 'FeatureCollection',
                features: element.trafficLights.map((element) => {
                  return {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: element.geom.coordinates,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [37.5, 37.5],
                      iconUrl: '/assets/images/semaforo.svg',
                    }),
                  });
                },
              }
            ),
          };
        }),
      },
    ];
  }

  styleMap() {
    return 'height: 100%; width: 100%';
  }

  onMapReady(map: LMap) {
    this.map = map;
    this.map.addLayer(this.googleMapsLayer);
  }
}
