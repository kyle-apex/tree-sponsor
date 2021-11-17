const GoogleCalendar = () => {
  return (
    <iframe
      src={
        process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL ||
        'https://calendar.google.com/calendar/embed?src=treefolks.org_m6jreenfi823mfc8td4hva4i50%40group.calendar.google.com&ctz=America%2FChicago&mode=AGENDA'
      }
      style={{ border: 0 }}
      width='100%'
      height='400'
      frameBorder='0'
      scrolling='no'
    ></iframe>
  );
};

export default GoogleCalendar;
