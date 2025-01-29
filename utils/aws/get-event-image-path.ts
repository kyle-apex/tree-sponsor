export default function getEventImagePath(uuid: string) {
  const directory = process.env.AWS_EVENT_IMAGE_DIRECTORY ?? 'event-images';
  return `${directory}/${uuid}`;
}
