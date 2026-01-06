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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState<Record<number, boolean>>({});
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
                  setHasChanges(prev => ({ ...prev, [subdomainRedirect.id]: true }));
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
                  onClick={async () => {
                    await updateById(subdomainRedirect.id, { redirect: subdomainRedirect.redirect });
                    setSnackbarOpen(true);
                    setHasChanges(prev => ({ ...prev, [subdomainRedirect.id]: false }));
                  }}
                  isLoading={isLoading}
                  disabled={!hasChanges[subdomainRedirect.id]}
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
            inputProps={{ autoCapitalize: 'none' }}
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
            inputProps={{ autoCapitalize: 'none' }}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity='success' sx={{ width: '100%' }}>
          Saved successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};
export default SubdomainRedirects;
