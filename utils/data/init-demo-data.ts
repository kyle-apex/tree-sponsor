import { prisma, Prisma } from 'utils/prisma/init';

export default async function initDemoData(userId: number) {
  const participationForm = {
    name: 'Core Team Participation Agreement',
    path: 'participation-agreement',
    description: `<p>To complete the process of joining the Core Team, please complete the following to:</p><ul><li>Agree to the Core Team commitments</li><li>Setup your bio for the TreeFolksYP website</li></ul>`,
    questions: [
      {
        question: 'Name',
        description: 'hey',
        type: 'text',
        placeholder: '',
        required: true,
      },
      {
        question: 'Email',
        description: '',
        type: 'text',
        placeholder: 'Your email',
        required: true,
      },
      {
        question: 'I agree to do my best to attend at least 50% of Core Team meetings.',
        required: true,
        options: ['I agree'],
        type: 'checkbox',
        description:
          'Meetings will be 6:30-8pm on Wednesdays (typically the second Wednesday of the month).  Half will be virtual on Zoom, but the first two will be in person.',
      },
      {
        question: 'I agree to assist in the planning of at least one event this year.',
        required: true,
        options: ['I agree'],
        type: 'checkbox',
        description: '',
      },
      {
        question: 'I agree to provide my input by filling out surveys, etc.',
        required: true,
        options: ['I agree'],
        type: 'checkbox',
        description: '',
      },
      {
        question: 'I agree to maintain active TreeFolksYP membership.',
        required: true,
        options: ['I agree'],
        type: 'checkbox',
        description:
          'Signup at https://treefolks.org/yp with a membership donation level starting at $20/year directly to TreeFolks (tax-deductible)',
      },
      {
        question: 'I agree to help promote TreeFolksYP events that I plan to attend to people in my network',
        required: true,
        options: ['I agree'],
        type: 'checkbox',
        description: '',
      },
      {
        question: 'If I need to end my membership on the Core Team, I will communicate with the TFYP Executive Committee.',
        required: true,
        options: ['I agree'],
        type: 'checkbox',
        description: '',
      },
      {
        question: 'Website Bio',
        required: true,
        options: ['Include my bio on the website', 'I do not want to be listed on the TreeFolks Core Team website'],
        type: 'radio',
        default: 'Include my bio on the website',
        description: 'Please complete the following for the Core Team section on the TreeFolks website https://treefolks.org/yp',
      },
      {
        question: 'Website Bio: Title/Occupation (Ex: Accountant, Engineer)',
        required: false,
        type: 'text',
        description: '',
      },
      {
        question: 'Website Bio: Short 2-3 sentence bio covering your interest in TreeFolks/environment',
        required: false,
        type: 'multiline',
        description: `Ex: I spend my days working on my computer, so I love a chance to get outside, enjoy nature, and play sports (tennis, volleyball, flag football).  Unfortunately, I don't have a place to plant trees of my own, but TreeFolks gives me a chance to support planting trees all across Austin!`,
      },
      {
        question: 'Website Bio: Headshot (square shaped picture would work best)',
        required: false,
        type: 'image',
        description: `Don’t have one you like? Head outside and take a quick selfie with some greenery in the background!`,
        placeholder: 'Add headshot',
      },
    ],
  };

  const existingForm = await prisma.form.findFirst({ where: { name: participationForm.name } });

  if (!existingForm) {
    await prisma.form.create({
      data: {
        name: participationForm.name,
        path: participationForm.path,
        description: participationForm.description,
        questionsJson: participationForm.questions,
      },
    });
  }

  const eventCount = await prisma.event.count();
  if (eventCount != 0) return;

  const demoEvent = await prisma.event.create({
    data: {
      name: 'Summer Solstice Demo',
      startDate: new Date(),
      path: 'summer-solstice-demo',
      location: { create: { name: 'Better Half', latitude: 30.27114, longitude: -97.758657 } },
      user: { connect: { id: userId } },
    },
  });
  const tree1 = await prisma.tree.create({
    data: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ad48f002-d9c0-455a-922f-da330611d1e0/small',
      latitude: 30.27114,
      longitude: -97.758657,
      speciesId: 5483,
      createdByUserId: userId,
    },
  });
  const tree2 = await prisma.tree.create({
    data: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/a67d457a-eb88-4a42-b50a-84a1135fd78f/small',
      latitude: 30.27117,
      longitude: -97.758671,
      speciesId: 7996,
      createdByUserId: userId,
    },
  });
  const tree3 = await prisma.tree.create({
    data: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/bae023bc-a37f-4fae-bf6d-cab81dd3ada0/small',
      latitude: 30.27117,
      longitude: -97.758695,
      speciesId: 7454,
      createdByUserId: userId,
    },
  });
  const tree4 = await prisma.tree.create({
    data: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ea0dd8a8-1d1a-40e0-bf44-0da762c17201/small',
      latitude: 30.27132,
      longitude: -97.758689,
      speciesId: 6635,
      createdByUserId: userId,
    },
  });

  await prisma.treeImage.createMany({
    data: [
      {
        uuid: 'ad48f002-d9c0-455a-922f-da330611d1e0',
        width: 500,
        height: 667,
        treeId: tree1.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/ad48f002-d9c0-455a-922f-da330611d1e0/small',
        sequence: 0,
        isLeaf: false,
      },
      {
        uuid: 'cf51f269-399e-4b75-8369-29cb33337f8f',
        width: 943,
        height: 944,
        treeId: tree1.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/cf51f269-399e-4b75-8369-29cb33337f8f/small',
        sequence: 1,
        isLeaf: true,
      },
      {
        uuid: '2219a9ee-d3af-45ce-8e04-c757599b43a7',
        width: 972,
        height: 973,
        treeId: tree2.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/2219a9ee-d3af-45ce-8e04-c757599b43a7/small',
        sequence: 1,
        isLeaf: true,
      },
      {
        uuid: 'a67d457a-eb88-4a42-b50a-84a1135fd78f',
        width: 500,
        height: 667,
        treeId: tree2.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/a67d457a-eb88-4a42-b50a-84a1135fd78f/small',
        sequence: 0,
        isLeaf: false,
      },
      {
        uuid: '12a056e3-583b-4370-a07c-896d2dc2a723',
        width: 1114,
        height: 1115,
        treeId: tree3.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/12a056e3-583b-4370-a07c-896d2dc2a723/small',
        sequence: 1,
        isLeaf: true,
      },
      {
        uuid: 'bae023bc-a37f-4fae-bf6d-cab81dd3ada0',
        width: 500,
        height: 375,
        treeId: tree3.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/bae023bc-a37f-4fae-bf6d-cab81dd3ada0/small',
        sequence: 0,
        isLeaf: false,
      },
      {
        uuid: 'ea0dd8a8-1d1a-40e0-bf44-0da762c17201',
        width: 500,
        height: 494,
        treeId: tree4.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/ea0dd8a8-1d1a-40e0-bf44-0da762c17201/small',
        sequence: 0,
        isLeaf: false,
      },
    ],
  });
}
