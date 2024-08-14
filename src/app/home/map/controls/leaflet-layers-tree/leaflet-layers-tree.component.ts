/// <reference path="../../../../../../node_modules/leaflet.control.layers.tree/L.Control.Layers.Tree.d.ts"
import { Component, Input, OnDestroy } from '@angular/core';
import { Map, control, Control } from 'leaflet';
import '../../../../../../node_modules/leaflet.control.layers.tree/L.Control.Layers.Tree.js';

interface customMap extends Map {
  _unload: any;
}

@Component({
  selector: 'leaflet-layers-tree',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-layers-tree.component.html',
  styleUrl: './leaflet-layers-tree.component.scss',
})
export class LeafletLayersTreeComponent implements OnDestroy {
  private _map?: Map;
  public control: Control.Layers.Tree = new Control.Layers.Tree();

  constructor() {}
  

  ngOnInit() {}

  ngOnDestroy() {
    if (this.control && this.map) {
      this._map?.off('unload', (this.map as customMap)?._unload, this.control);
    }
    if (this._map && this.control) this._map.removeControl(this.control);
  }

  @Input() options: Control.Layers.TreeOptions = {};
  @Input() baseTree!: Control.Layers.TreeObject;
  @Input() overlayTree?: Control.Layers.TreeObject;

  @Input() set map(map: Map | undefined) {
    if (map) {
      this._map = map;
      this.control = control.layers.tree(
        this.baseTree,
        this.overlayTree,
        this.options
      );
      this.control.addTo(map);
    }
  }

  get map(): Map | undefined {
    return this._map;
  }
}
