import Box from '@mui/material/Box';
import parse from 'html-react-parser';
import xss from 'xss';
const SafeHTMLDisplay = ({ html }: { html: string }) => {
  if (!html) return null;
  const xssSafeHTML = xss(html);

  return xssSafeHTML ? <Box sx={{ textAlign: 'left', a: { color: theme => theme.palette.primary.main } }}>{parse(xssSafeHTML)}</Box> : null;
};
export default SafeHTMLDisplay;
