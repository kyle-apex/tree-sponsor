import { prisma } from 'utils/prisma/init';

export async function updateSpeciesPriority() {
  await prisma.$executeRaw`UPDATE Species s

    LEFT JOIN (SELECT count(*) as priority, speciesId from Tree where speciesId IS NOT NULL GROUP BY speciesId) as s2 ON
        s.id=s2.speciesId
    SET
        s.searchPriority  = s2.priority + s.isInTexas
    WHERE s2.priority IS NOT NULL`;
}
