import React from 'react';
import { render } from 'test/test-utils';
//import Skeleton from '@mui/material/Skeleton';
//import dynamic from 'next/dynamic';
/*
const TextEditor = dynamic(() => import('components/TextEditor'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => (
    <>
      <Skeleton variant='text' sx={{ width: '15%' }} />
      <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 3 }} height={100} />
    </>
  ),
});*/
//import TextEditor from 'components/TextEditor';

describe('TextEditor', () => {
  it('should display a label', async () => {
    //const { findByText } = render(<TextEditor label='My Label'></TextEditor>);
    // this does not work until the mui-rte library is updated from version 2.0.1
    /*await waitFor(
      async () => {
        screen.debug();
        expect(await findByText('My Label')).toBeInTheDocument();
        screen.debug();
      },
      { timeout: 3000 },
    );*/
    //expect(await findByText('My Label')).toBeInTheDocument();
  });
});
