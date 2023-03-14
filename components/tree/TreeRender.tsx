import { PartialTree } from 'interfaces';
import React from 'react';
const TreeRender = ({ tree, id }: { tree?: PartialTree; id: number }) => {
  //console.log('rerender tree', tree, id);
  return <></>;
};
export default React.memo(TreeRender);
