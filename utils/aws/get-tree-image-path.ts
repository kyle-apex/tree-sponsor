export default function getTreeImagePath(uuid: string) {
  const directory = process.env.AWS_TREE_IMAGE_DIRECTORY ?? 'tree-images';
  return `${directory}/${uuid}`;
}
