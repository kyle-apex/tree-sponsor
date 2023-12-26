import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// TODO: Date not updating
const DateField = ({ value, setValue, label }: { value: Date | null; setValue: (value: Date | null) => void; label?: string }) => {
  //console.log('rerender', value);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        renderInput={props => <TextField size='small' {...props} />}
        label={label}
        value={value}
        onChange={newValue => {
          //console.log('onChange', newValue);
          setValue(newValue);
        }}
      />
    </LocalizationProvider>
  );
};
export default DateField;
