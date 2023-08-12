import Grid from '@mui/material/Grid';
import { PartialSpecies } from 'interfaces';
import HeightIcon from '@mui/icons-material/Height';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlaceIcon from '@mui/icons-material/Place';
//https://plantsservices.sc.egov.usda.gov/api/PlantCharacteristics/78328
/*
Active Growth Period (Spring and Summer
Height at 20 Years    

*/
const SpeciesDetails = ({ species }: { species: PartialSpecies }) => {
  return (
    <>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableBody>
            {species.height && (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ width: '10px', padding: '16px 0px' }} component='td' scope='row'>
                  <HeightIcon></HeightIcon>
                </TableCell>
                <TableCell>Mature Height</TableCell>
                <TableCell align='right'>{species.height}ft</TableCell>
              </TableRow>
            )}
            {species.longevity && (
              <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ width: '10px', padding: '16px 0px' }} component='td' scope='row'>
                  <WatchLaterIcon></WatchLaterIcon>
                </TableCell>
                <TableCell>Life Span</TableCell>
                <TableCell align='right'>{species.longevity}</TableCell>
              </TableRow>
            )}
            {species.growthRate && (
              <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ width: '10px', padding: '16px 0px' }} component='td' scope='row'>
                  <TrendingUpIcon></TrendingUpIcon>
                </TableCell>
                <TableCell>Growth Rate</TableCell>
                <TableCell align='right'>{species.growthRate}</TableCell>
              </TableRow>
            )}
            {species.isNative && (
              <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ width: '10px', padding: '16px 0px' }} component='td' scope='row'>
                  <PlaceIcon></PlaceIcon>
                </TableCell>
                <TableCell>Native to Texas</TableCell>
                <TableCell align='right'>{species.isNative ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default SpeciesDetails;
