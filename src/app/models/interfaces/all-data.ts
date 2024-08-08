import {
  BusStop,
  ChannelRoute,
  CityCamera,
  LineName,
  LineRoute,
  SpeedReducer,
  SpeedReducerGroup,
  TrafficLightGroup,
} from '@models/interfaces';

export interface AllData {
  busStops: BusStop[];
  cityCameras: CityCamera[];
  linesNames: LineName[];
  linesRoutes: LineRoute[];
  channelsRoutes: ChannelRoute[];
  speedReducersGroups: SpeedReducerGroup[];
  trafficLightsGroups: TrafficLightGroup[];
}
