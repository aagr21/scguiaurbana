import {
  BusStop,
  ChannelRoute,
  CityCamera,
  EducationCenterGroup,
  LineName,
  LineRoute,
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
  educationCentersGroups: EducationCenterGroup[];
}
