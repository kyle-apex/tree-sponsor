import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SearchBox from 'components/form/SearchBox';
import React, { useEffect, useState } from 'react';
import { PartialLocation } from 'interfaces';
import NearMeIcon from '@mui/icons-material/NearMe';
import Box from '@mui/material/Box';
import parsedGet from 'utils/api/parsed-get';
import LocationListItems from './LocationListItems';

const LocationSearch = ({
  onClickLocation,
  onClickSelect,
}: {
  onClickLocation?: (locationId: number | string) => void;
  onClickSelect?: () => void;
}) => {
  const [searchText, setSearchText] = useState('');
  const [locations, setLocations] = useState<PartialLocation[]>([
    { name: 'Hello', address: '178 Whatever' },
    { name: 'Hello Motto', address: '1378 Whatever' },
  ]);

  const fetchLocations = async () => {
    if (searchText?.length > 0) setLocations(await parsedGet('/api/locations/search?search_text=' + encodeURIComponent(searchText)));
  };

  useEffect(() => {
    fetchLocations();
  }, [searchText]);

  return (
    <div>
      <SearchBox onChange={setSearchText} label='Search Location'></SearchBox>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onClickSelect}>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex' }} gap={1}>
                  <NearMeIcon></NearMeIcon> Select on a map
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
        <LocationListItems locations={locations} onSelect={onClickLocation} />
      </List>
    </div>
  );
};
// Search Box on Top -> searches using search-by-coordinate.ts or similar
// Link to Choose on Map
// Top entries from existing trees including neighborhoods/places

// selecting sends the Location information

export default LocationSearch;
