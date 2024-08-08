import {
  BusStop,
  ChannelRoute,
  CityCamera,
  LineName,
  LineRoute, SpeedReducer,
  SpeedReducerGroup,
} from '@models/interfaces';

export interface AllData {
  busStops: BusStop[];
  cityCameras: CityCamera[];
  linesNames: LineName[];
  linesRoutes: LineRoute[];
  channelsRoutes: ChannelRoute[];
  speedReducersGroups: SpeedReducerGroup[];
}
