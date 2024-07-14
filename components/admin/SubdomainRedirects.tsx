import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { useAddToQuery, useGet, useRemoveFromQuery, useUpdateQueryById } from 'utils/hooks';
import { SubdomainRedirect } from '@prisma/client';
import axios from 'axios';
import DeleteIconButton from 'components/DeleteIconButton';
import TextField from '@mui/material/TextField';
import SplitRow from 'components/layout/SplitRow';
import TextFieldIsolated from 'components/form/TextFieldIsolated';
import LoadingButton from 'components/LoadingButton';

async function addToDatabase(newItem: Partial<SubdomainRedirect>) {
  const result = await axios.post('/api/subdomainRedirects', newItem);
  return result.data;
}
async function handleDelete(id: number) {
  await axios.delete('/api/subdomainRedirects/' + id);
}
async function handleUpdate(id: number, attributes: Record<string, unknown>) {
  await axios.patch('/api/subdomainRedirects/' + id, attributes);
}

const SubdomainRedirects = () => {
  const [newSubdomainRedirect, setNewSubdomainRedirect] = useState<Partial<SubdomainRedirect>>({});
  const {
    data: subdomainRedirects,
    refetch: refetchRoles,
    isFetching: isRolesFetching,
  } = useGet<SubdomainRedirect[]>('/api/subdomainRedirects', 'subdomainRedirects');

  const { add } = useAddToQuery<SubdomainRedirect>('subdomainRedirects', addToDatabase);
  const { remove } = useRemoveFromQuery(`subdomainRedirects`, handleDelete);
  const { updateById, isLoading } = useUpdateQueryById('subdomainRedirects', handleUpdate);

  return (
    <div>
      {subdomainRedirects?.map(subdomainRedirect => {
        return (
          <Accordion key={subdomainRedirect.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel3-content' id='panel3-header'>
              {subdomainRedirect.subdomain}.tfyp.org
            </AccordionSummary>
            <AccordionDetails>
              <TextFieldIsolated
                initialValue={subdomainRedirect.redirect}
                onChange={value => {
                  subdomainRedirect.redirect = value;
                }}
                label='Redirect'
                size='small'
                multiline={true}
              ></TextFieldIsolated>
            </AccordionDetails>
            <AccordionActions>
              <SplitRow>
                <DeleteIconButton onDelete={async () => remove(subdomainRedirect.id)}></DeleteIconButton>
                <LoadingButton
                  onClick={() => updateById(subdomainRedirect.id, { redirect: subdomainRedirect.redirect })}
                  isLoading={isLoading}
                >
                  Save
                </LoadingButton>
              </SplitRow>
            </AccordionActions>
          </Accordion>
        );
      })}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel3-content' id='panel3-header'>
          Add New Redirect
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            value={newSubdomainRedirect.subdomain}
            onChange={e => {
              setNewSubdomainRedirect(i => {
                return { ...i, subdomain: e.target.value };
              });
            }}
            label='Subdomain Name'
            size='small'
            autoCapitalize='off'
            autoComplete='off'
            sx={{ marginBottom: 3 }}
            helperText={'Will redirect from ' + (newSubdomainRedirect.subdomain || 'unspecified') + '.tfyp.org to the link provided below'}
            className='full-width'
          ></TextField>
          <TextField
            value={newSubdomainRedirect.redirect}
            onChange={e => {
              setNewSubdomainRedirect(i => {
                return { ...i, redirect: e.target.value };
              });
            }}
            label='Redirect Link'
            size='small'
            className='full-width'
            multiline
            autoCapitalize='off'
            autoComplete='off'
            sx={{ marginBottom: 3 }}
            helperText='Include https:// in the provided redirect link'
          ></TextField>
        </AccordionDetails>
        <AccordionActions>
          <SplitRow>
            <Button
              onClick={() => {
                setNewSubdomainRedirect({ subdomain: '', redirect: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                add(newSubdomainRedirect);
                setNewSubdomainRedirect({ subdomain: '', redirect: '' });
              }}
              disabled={!newSubdomainRedirect.subdomain || !newSubdomainRedirect.redirect}
            >
              Add New Redirect
            </Button>
          </SplitRow>
        </AccordionActions>
      </Accordion>
    </div>
  );
};
export default SubdomainRedirects;
