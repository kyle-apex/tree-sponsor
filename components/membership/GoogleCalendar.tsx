const GoogleCalendar = () => {
  return (
    <iframe
      title='Google Calendar'
      src={
        process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL ||
        'https://calendar.google.com/calendar/embed?src=p98n056gtcfeuj437kjlm3ev516bpaop%40import.calendar.google.com&mode=AGENDA&bgcolor=%2371998c&color=%230B8043&ctz=America%2FChicago'
      }
      style={{ border: 'solid 5px #71998C' }}
      width='100%'
      height='400'
      frameBorder='0'
      scrolling='no'
      className='box-shadow'
    ></iframe>
  );
};

export default GoogleCalendar;
