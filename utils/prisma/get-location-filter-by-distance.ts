// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TreeWhereInput } from '@prisma/client';

type WhereFilter = { AND: [] } | TreeWhereInput;

export const getLocationFilterByDistance = (latitude: number, longitude: number, distance: number): WhereFilter => {
  const feetPerLatitude = 364000;
  const feetPerLongitude = 288200;
  const whereFilter = {
    AND: [
      { latitude: { gt: latitude - distance / feetPerLatitude } },
      { latitude: { lt: latitude + distance / feetPerLatitude } },
      { longitude: { gt: longitude - distance / feetPerLongitude } },
      { longitude: { lt: longitude + distance / feetPerLongitude } },
    ],
  };
  console.log('whereFilter', whereFilter);
  return whereFilter;
};
