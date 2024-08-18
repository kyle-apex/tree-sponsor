import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
// TODO: Date not updating
const DateTimeField = ({
  value,
  setValue,
  label,
  minDateTime,
  onClose,
}: {
  value: Date | null;
  setValue: (value: Date | null) => void;
  label?: string;
  minDateTime?: Date;
  onClose?: (value: Date | null) => void;
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
        onClose={() => {
          setTimeout(() => {
            onClose(value);
          }, 100);
        }}
        inputFormat='M/d/yy h:mm a'
        minDateTime={minDateTime}
      />
    </LocalizationProvider>
  );
};
export default DateTimeField;
