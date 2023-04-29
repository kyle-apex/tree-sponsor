export default function capitalizeFirst(str: string): string {
  if (!str) return '';
  else return str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
}
