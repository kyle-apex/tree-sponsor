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

  // Check if products already exist
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    // Create default product entries
    await prisma.product.createMany({
      data: [
        { id: 1, name: 'Membership', amount: 60, stripeId: 'DEMOPRODUCT' },
        { id: 2, name: 'Single Tree Membership ($20/yr donation)', amount: 20, stripeId: 'prod_LOw0xUNJQbjuVW' },
        { id: 3, name: 'Grove Membership ($60/yr donation)', amount: 60, stripeId: 'prod_MGSp90KVVSBREh' },
        { id: 4, name: 'TreeFolksYP Single Tree Membership', amount: 20, stripeId: 'prod_JRjSothUvXWAEM' },
        { id: 5, name: 'TreeFolksYP Grove Membership', amount: 60, stripeId: 'prod_JRiOlFKYJtya8i' },
        { id: 6, name: 'Single Tree Membership ($20/yr donation)', amount: 20, stripeId: 'prod_M7Ti0e60gyxvKf' },
        { id: 7, name: 'Forest Membership ($100/yr donation)', amount: 100, stripeId: 'prod_N0pAlpBxf9j5bp' },
        { id: 8, name: 'Forest Membership ($100/yr donation)', amount: 100, stripeId: 'prod_LUOM1QC9NbDiC8' },
        { id: 9, name: 'Forest+ Membership ($200/yr donation)', amount: 200, stripeId: 'prod_MFfWQuRZEsbzre' },
        { id: 10, name: 'Grove Membership ($60/yr donation)', amount: 60, stripeId: 'prod_LFB9Tv21zs3FBE' },
        { id: 12, name: 'TreeFolks Young Professionals Annual Donation', amount: 60, stripeId: 'prod_INxmgMZBOkB5D2' },
        { id: 13, name: 'Single Tree Membership ($20/yr = 1 tree/yr)', amount: 20, stripeId: 'prod_JUO8cHuAiRgYrV' },
        { id: 15, name: 'Forest+ Membership ($200/yr = 10 trees/yr)', amount: 200, stripeId: 'prod_L1SzAOSor1qY9q' },
        { id: 16, name: 'Grove Membership ($60/yr = 3 trees/yr)', amount: 60, stripeId: 'prod_JhyG9dRdTHYCte' },
        { id: 17, name: 'Stripe Feed (Recurring Donation)', amount: 27, stripeId: 'prod_JZecuYW3EI0ec6' },
        { id: 18, name: 'Stripe Feed (Recurring Donation)', amount: 250, stripeId: 'prod_IyWy5udCYLrlgr' },
        { id: 19, name: 'TFYP Tree Donation', amount: 100, stripeId: 'prod_HWl8O9XK4U099w' },
        { id: 20, name: 'Stripe Feed (Recurring Donation)', amount: 25, stripeId: 'prod_E7OFixZKOPjlXv' },
        { id: 21, name: 'TFYP Tree Donation', amount: 60, stripeId: 'prod_HAVl2LI8VgS5Np' },
        { id: 22, name: 'TFYP Tree Donation', amount: 20, stripeId: 'prod_GnQaMh1P930PrB' },
        { id: 27, name: 'Stripe Feed (Recurring Donation)', amount: 20, stripeId: 'prod_IenzpHzEpwHFza' },
        { id: 28, name: 'Stripe Feed (Recurring Donation)', amount: 50, stripeId: 'prod_FRmPavlwyQl6z5' },
        { id: 29, name: 'TFYP Tree Donation', amount: 60, stripeId: 'prod_G7kmYy8tIXJI6E' },
        { id: 30, name: 'TFYP Tree Donation', amount: 20, stripeId: 'prod_G74eNUS803eHaY' },
        { id: 33, name: 'Young Professionals Membership', amount: 1, stripeId: 'prod_G6zhgdevCO49RT' },
        { id: 34, name: 'Central Leader Membership', amount: 1, stripeId: 'prod_Ew8Dh6F9vRXt6n' },
        { id: 38, name: 'Stripe Feed (Recurring Donation)', amount: 40, stripeId: 'prod_F5oToTk1nofSWt' },
        { id: 39, name: 'TFYP Tree Donation', amount: 60, stripeId: 'prod_FIAAHm7JfWP6fg' },
        { id: 40, name: 'TFYP Tree Donation', amount: 20, stripeId: 'prod_F52RlSXNnJz6jx' },
        { id: 41, name: 'TFYP Tree Donation', amount: 20, stripeId: 'prod_D2WyOQQAcvV40e' },
        { id: 43, name: 'Stripe Feed (Recurring Donation)', amount: 100, stripeId: 'prod_E3ssW1Vj3qDsq0' },
      ],
    });
  }

  // Check if demo event already exists
  const demoEventExists = await prisma.event.findFirst({
    where: {
      path: 'summer-solstice-demo',
    },
  });

  let demoEvent;
  if (!demoEventExists) {
    demoEvent = await prisma.event.create({
      data: {
        name: 'Summer Solstice Demo',
        startDate: new Date(),
        path: 'summer-solstice-demo',
        location: { create: { name: 'Better Half', latitude: 30.27114, longitude: -97.758657 } },
        user: { connect: { id: userId } },
      },
    });
    console.log('Created demo event');
  } else {
    demoEvent = demoEventExists;
  }

  // Check if demo trees already exist
  const tree1Exists = await prisma.tree.findFirst({
    where: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ad48f002-d9c0-455a-922f-da330611d1e0/small',
    },
  });

  const tree2Exists = await prisma.tree.findFirst({
    where: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/a67d457a-eb88-4a42-b50a-84a1135fd78f/small',
    },
  });

  const tree3Exists = await prisma.tree.findFirst({
    where: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/bae023bc-a37f-4fae-bf6d-cab81dd3ada0/small',
    },
  });

  const tree4Exists = await prisma.tree.findFirst({
    where: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ea0dd8a8-1d1a-40e0-bf44-0da762c17201/small',
    },
  });

  // Create trees if they don't exist
  let tree1, tree2, tree3, tree4;

  if (!tree1Exists) {
    tree1 = await prisma.tree.create({
      data: {
        pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ad48f002-d9c0-455a-922f-da330611d1e0/small',
        latitude: 30.27114,
        longitude: -97.758657,
        speciesId: 5483,
        createdByUserId: userId,
      },
    });
    console.log('Created demo tree 1');
  } else {
    tree1 = tree1Exists;
  }

  if (!tree2Exists) {
    tree2 = await prisma.tree.create({
      data: {
        pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/a67d457a-eb88-4a42-b50a-84a1135fd78f/small',
        latitude: 30.27117,
        longitude: -97.758671,
        speciesId: 7996,
        createdByUserId: userId,
      },
    });
    console.log('Created demo tree 2');
  } else {
    tree2 = tree2Exists;
  }

  if (!tree3Exists) {
    tree3 = await prisma.tree.create({
      data: {
        pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/bae023bc-a37f-4fae-bf6d-cab81dd3ada0/small',
        latitude: 30.27117,
        longitude: -97.758695,
        speciesId: 7454,
        createdByUserId: userId,
      },
    });
    console.log('Created demo tree 3');
  } else {
    tree3 = tree3Exists;
  }

  if (!tree4Exists) {
    tree4 = await prisma.tree.create({
      data: {
        pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ea0dd8a8-1d1a-40e0-bf44-0da762c17201/small',
        latitude: 30.27132,
        longitude: -97.758689,
        speciesId: 6635,
        createdByUserId: userId,
      },
    });
    console.log('Created demo tree 4');
  } else {
    tree4 = tree4Exists;
  }

  // Check if tree images already exist
  const treeImagesExist = await prisma.treeImage.findMany({
    where: {
      uuid: {
        in: [
          'ad48f002-d9c0-455a-922f-da330611d1e0',
          'cf51f269-399e-4b75-8369-29cb33337f8f',
          '2219a9ee-d3af-45ce-8e04-c757599b43a7',
          'a67d457a-eb88-4a42-b50a-84a1135fd78f',
          '12a056e3-583b-4370-a07c-896d2dc2a723',
          'bae023bc-a37f-4fae-bf6d-cab81dd3ada0',
          'ea0dd8a8-1d1a-40e0-bf44-0da762c17201',
        ],
      },
    },
    select: { uuid: true },
  });

  // Get list of existing image UUIDs
  const existingImageUuids = treeImagesExist.map(image => image.uuid);

  // Filter out images that already exist
  const treeImagesToCreate = [
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
  ].filter(image => !existingImageUuids.includes(image.uuid));

  // Create tree images if they don't exist
  if (treeImagesToCreate.length > 0) {
    await prisma.treeImage.createMany({
      data: treeImagesToCreate,
    });
    console.log(`Created ${treeImagesToCreate.length} demo tree images`);
  }

  // Create test users with recent subscriptions
  const testUserCount = await prisma.user.count({
    where: {
      email: {
        in: ['testuser1@example.com', 'testuser2@example.com', 'testuser3@example.com'],
      },
    },
  });

  if (testUserCount < 3) {
    // Create test users
    const testUser1 = await prisma.user.create({
      data: {
        name: 'Test User 1',
        email: 'testuser1@example.com',
        displayName: 'Test User 1',
        stripeCustomerId: 'cus_test1',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
    });

    const testUser2 = await prisma.user.create({
      data: {
        name: 'Test User 2',
        email: 'testuser2@example.com',
        displayName: 'Test User 2',
        stripeCustomerId: 'cus_test2',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
    });

    const testUser3 = await prisma.user.create({
      data: {
        name: 'Test User 3',
        email: 'testuser3@example.com',
        displayName: 'Test User 3',
        stripeCustomerId: 'cus_test3',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
    });

    // Get current date and dates within the last month
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const threeWeeksAgo = new Date(now);
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    // Set expiration dates (1 year from creation)
    const oneYearFromNow = new Date(now);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const oneYearFromOneWeekAgo = new Date(oneWeekAgo);
    oneYearFromOneWeekAgo.setFullYear(oneYearFromOneWeekAgo.getFullYear() + 1);

    const oneYearFromTwoWeeksAgo = new Date(twoWeeksAgo);
    oneYearFromTwoWeeksAgo.setFullYear(oneYearFromTwoWeeksAgo.getFullYear() + 1);

    const oneYearFromThreeWeeksAgo = new Date(threeWeeksAgo);
    oneYearFromThreeWeeksAgo.setFullYear(oneYearFromThreeWeeksAgo.getFullYear() + 1);

    // Create subscriptions for test users
    await prisma.subscription.create({
      data: {
        createdDate: now,
        lastPaymentDate: now,
        expirationDate: oneYearFromNow,
        status: 'active',
        stripeCustomerId: testUser1.stripeCustomerId,
        stripeId: 'sub_test1',
        userId: testUser1.id,
        productId: 3, // Grove Membership ($60/yr donation)
      },
    });

    await prisma.subscription.create({
      data: {
        createdDate: oneWeekAgo,
        lastPaymentDate: oneWeekAgo,
        expirationDate: oneYearFromOneWeekAgo,
        status: 'active',
        stripeCustomerId: testUser2.stripeCustomerId,
        stripeId: 'sub_test2',
        userId: testUser2.id,
        productId: 7, // Forest Membership ($100/yr donation)
      },
    });

    await prisma.subscription.create({
      data: {
        createdDate: twoWeeksAgo,
        lastPaymentDate: twoWeeksAgo,
        expirationDate: oneYearFromTwoWeeksAgo,
        status: 'active',
        stripeCustomerId: testUser3.stripeCustomerId,
        stripeId: 'sub_test3',
        userId: testUser3.id,
        productId: 2, // Single Tree Membership ($20/yr donation)
      },
    });

    // Add a second subscription for testUser1
    await prisma.subscription.create({
      data: {
        createdDate: threeWeeksAgo,
        lastPaymentDate: threeWeeksAgo,
        expirationDate: oneYearFromThreeWeeksAgo,
        status: 'active',
        stripeCustomerId: testUser1.stripeCustomerId,
        stripeId: 'sub_test1_additional',
        userId: testUser1.id,
        productId: 9, // Forest+ Membership ($200/yr donation)
      },
    });

    console.log('Created test users with recent subscriptions');
  }
}
