import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const formatCount = (count: number, isCurrency?: boolean): string => {
  if (isCurrency && count) {
    return '$' + count.toFixed(2);
  } else if (isCurrency) return '$0';
  else return count || count === 0 ? count + '' : '';
};

const StatisticIconDisplay = ({
  label,
  description,
  isLoading,
  icon,
  color,
  showUpIcon,
  showDownIcon,
  count,
  isCurrency,
}: {
  label: string;
  description?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  color?: string;
  showUpIcon?: boolean;
  showDownIcon?: boolean;
  count: number;
  isCurrency?: boolean;
}) => {
  //<StatisticIconDisplay icon={} showUpIcon={} showDownIcon={} color={} label={} description={}></StatisticIconDisplay>
  return (
    <>
      <Typography variant='h4' color={color}>
        {showUpIcon && <ArrowDropUpIcon fontSize='medium' />}
        {showDownIcon && <ArrowDropDownIcon fontSize='medium' />}
        {!!icon && !isLoading && <>{icon} </>}
        {isLoading && <CircularProgress size={20}></CircularProgress>}
        {formatCount(count, isCurrency)}
      </Typography>
      <Typography variant='subtitle2'>{label}</Typography>
      {description && (
        <Typography variant='body2' color='textSecondary'>
          {description}
        </Typography>
      )}
    </>
  );
};
export default StatisticIconDisplay;
