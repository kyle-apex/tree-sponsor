const GoogleCalendar = () => {
  return (
    <iframe
      src={
        process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL ||
        'https://calendar.google.com/calendar/embed?src=treefolks.org_m6jreenfi823mfc8td4hva4i50%40group.calendar.google.com&ctz=America%2FChicago&mode=AGENDA&bgcolor=%2371998c&color=%230B8043'
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
