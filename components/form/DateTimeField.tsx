//import AdapterDayjs from '@mui/lab/AdapterDayjs';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
// TODO: Date not updating
const DateTimeField = ({
  value,
  setValue,
  label,
  minDateTime,
}: {
  value: Date | null;
  setValue: (value: Date | null) => void;
  label?: string;
  minDateTime?: Date;
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={props => <TextField size='small' {...props} />}
        label={label}
        value={value}
        onChange={newValue => {
          setValue(newValue);
        }}
        inputFormat='M/d/yy h:mm a'
        minDateTime={minDateTime}
      />
    </LocalizationProvider>
  );
};
export default DateTimeField;
