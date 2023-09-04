import { TitleSection } from 'interfaces';

export const DEFAULT_DESCRIPTION =
  "This Token of Appre-tree-ation was given in support of TreeFolks' mission: planting, caring for, and giving away free trees!";
export const DEFAULT_TITLE_PREFIX = 'Thank you from ';
export const DESCRIPTION_PLACEHOLDER =
  '"I love this tree because..."     "Giving thanks in memory of..."     "I support the urban forest because..."';

export const MAP_STYLE = {
  SATELLITE: 'mapbox://styles/mapbox/satellite-streets-v11?optimize=true',
  STREET: 'mapbox://styles/mapbox/streets-v11?optimize=true',
  SIMPLE: 'mapbox://styles/mapbox/light-v10?optimize=true',
};

export const BASE_TITLE = 'TreeFolksYP';

export const TREE_BENEFITS: TitleSection[] = [
  { title: 'Pollution', description: 'Trees give us the air we breathe and remove toxins from the air' },
  { title: 'Flood Prevention', description: 'Roots help prevent soil erosion and soak up water to reduce flooding' },
  { title: 'Homes', description: 'Friends of all shapes and sizes call trees home and rely on them for food and shelter' },
  { title: 'Shade', description: 'Trees reduce electric bills and keep us cool' },
  { title: 'Atmosphere', description: 'Think of your favorite picnic, restaurant, bar, and/or park enhanced by trees' },
  { title: 'Activities', description: 'Do not forget to be grateful for climbing, swinging, decorating, and much more!' },
];
