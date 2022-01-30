import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';

const DateTimeField = ({ value, setValue, label }: { value: Date | null; setValue: (value: Date | null) => void; label?: string }) => {
  console.log('setValue', value, setValue);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        renderInput={props => <TextField {...props} />}
        label={label}
        value={value}
        onChange={newValue => {
          setValue(newValue);
        }}
        inputFormat='M/D/YY h:m a'
      />
    </LocalizationProvider>
  );
};
export default DateTimeField;
