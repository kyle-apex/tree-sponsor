import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { prisma } from 'utils/prisma/init';

const PastEventRedirect = ({ path }: { path: string }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(`/e/${path}/quiz`);
  }, []);
  return <></>;
};
export default PastEventRedirect;

export async function getServerSideProps() {
  const today = new Date();
  const event = await prisma.event.findFirst({
    where: {
      startDate: { lt: today },
      isPrivate: { not: true },
    },
    orderBy: { startDate: 'desc' },
  });

  return {
    props: {
      path: event?.path ?? '',
    },
  };
}
