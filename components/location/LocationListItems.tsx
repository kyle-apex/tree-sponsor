import { PartialLocation } from 'interfaces';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import React from 'react';
const getSecondaryText = (location: PartialLocation) => {
  if (!location.placeName) return location.address;
  const splitAr = location.placeName.split(',');
  splitAr.pop();
  splitAr.pop();
  //splitAr.shift();
  return splitAr.join(',').replace(location.name + ', ', '');
};
const LocationListItems = ({ onSelect, locations }: { onSelect: (locationId: number | string) => void; locations: PartialLocation[] }) => {
  return (
    <List>
      {locations?.map(location => (
        <ListItem key={location.id || location.mapboxId} disablePadding>
          <ListItemButton
            onClick={() => {
              onSelect(location.id || location.mapboxId);
            }}
          >
            <ListItemText primary={location.name} secondary={getSecondaryText(location)} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default LocationListItems;
