import {
  BusStop,
  ChannelRoute,
  CityCamera,
  LineName,
  LineRoute, SpeedReducer,
} from '@models/interfaces';

export interface AllData {
  busStops: BusStop[];
  cityCameras: CityCamera[];
  linesNames: LineName[];
  linesRoutes: LineRoute[];
  channelsRoutes: ChannelRoute[];
  speedReducers: SpeedReducer[];
}
