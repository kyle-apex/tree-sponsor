import Image from 'next/image';
const LeafImage = ({ width = '20px', height = '20px' }: { width?: string; height?: string }) => {
  return <Image width={width} height={height} src='/leaf.svg'></Image>;
};

export default LeafImage;
