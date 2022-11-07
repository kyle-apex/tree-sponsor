//import AdapterDayjs from '@mui/lab/AdapterDayjs';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
// TODO: Date not updating
const DateField = ({ value, setValue, label }: { value: Date | null; setValue: (value: Date | null) => void; label?: string }) => {
  console.log('rerender', value);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        renderInput={props => <TextField size='small' {...props} />}
        label={label}
        value={value}
        onChange={newValue => {
          console.log('onChange', newValue);
          setValue(newValue);
        }}
      />
    </LocalizationProvider>
  );
};
export default DateField;
