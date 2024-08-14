import { Component, Input, OnInit } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import {
  latLng,
  MapOptions,
  tileLayer,
  Map,
  Control,
  geoJSON,
  LatLng,
  marker,
  icon,
} from 'leaflet';
import { Feature, Point } from 'geojson';
import { LeafletLayersTreeComponent } from './controls/leaflet-layers-tree/leaflet-layers-tree.component';
import { CommonModule } from '@angular/common';
import { AllData } from '@models/interfaces';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule, LeafletLayersTreeComponent, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  options: MapOptions = {
    zoom: 13,
    center: latLng(-17.779223, -63.18164),
    attributionControl: false,
    maxBoundsViscosity: 1.0,
    zoomAnimation: true,
  };

  map!: Map;
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
  @Input() allData!: AllData;

  overlayTree: Control.Layers.TreeObject = {
    label: 'Puntos de Interés',
    children: [],
  };

  educationCentersGroupsObj: {[p: string]: string} = {
    'MÓDULOS EDUCATIVOS':  'MÓDULO EDUCATIVO',
    'COLEGIOS PRIVADOS': 'COLEGIO PRIVADO',
    'EDUCACIÓN ESPECIAL': 'EDUCACIÓN ESPECIAL',
    'UNIVERSIDADES': 'UNIVERSIDAD',
    'INSTITUOS': 'INSTITUTO',
    'EDUCACIÓN COMPLEMENTARIA': 'EDUCACIÓN COMPLEMENTARIA'
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
                properties: {},
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [27, 27],
                  iconUrl: '/assets/images/bus-stop.svg',
                }),
              });
            },
            onEachFeature(feature, layer) {
              layer.bindPopup(feature.properties.location);
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
                properties: {
                  location: element.location,
                },
              };
            }),
          } as any,
          {
            pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
              return marker(latlng, {
                icon: icon({
                  iconSize: [52, 52],
                  iconUrl: '/assets/images/camera.svg',
                }),
              });
            },
            onEachFeature(feature, layer) {
              layer.bindPopup(feature.properties.location);
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
                    properties: {
                      location: element.location,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [23, 23],
                      iconUrl: '/assets/images/bump.svg',
                    }),
                  });
                },
                onEachFeature(feature, layer) {
                  layer.bindPopup(feature.properties.location);
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
                    properties: {
                      location: element.location,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [29, 29],
                      iconUrl: '/assets/images/traffic-light.svg',
                    }),
                  });
                },
                onEachFeature(feature, layer) {
                  layer.bindPopup(feature.properties.location);
                },
              }
            ),
          };
        }),
      },
      {
        label: 'Educación',
        selectAllCheckbox: true,
        children: this.allData.educationCentersGroups.map((group) => {
          return {
            label: group.type,
            layer: geoJSON(
              {
                type: 'FeatureCollection',
                features: group.educationCenters.map((element) => {
                  return {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: element.geom.coordinates,
                    },
                    properties: {
                      name: `${this.educationCentersGroupsObj[group.type]}: ${element.name}`,
                    },
                  };
                }),
              } as any,
              {
                pointToLayer(_: Feature<Point, any>, latlng: LatLng) {
                  return marker(latlng, {
                    icon: icon({
                      iconSize: [23, 23],
                      iconUrl: '/assets/images/education.svg',
                    }),
                  });
                },
                onEachFeature(feature, layer) {
                  layer.bindPopup(feature.properties.name);
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

  onMapReady(map: Map) {
    this.map = map;
    this.map.addLayer(this.googleMapsLayer);
  }
}
