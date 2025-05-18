import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { prisma } from 'utils/prisma/init';

const WelcomeRedirect = ({ path }: { path: string }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(`/e/${path}/welcome`);
  }, []);
  return <></>;
};
export default WelcomeRedirect;

export async function getServerSideProps() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23);
  const event = await prisma.event.findFirst({
    where: {
      startDate: { lt: tomorrow },
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
