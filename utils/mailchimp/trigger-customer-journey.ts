import { mailchimpPost } from '.';

const triggerNewMemberWelcomeEmail = async (email: string): Promise<void> => {
  try {
    await mailchimpPost('customer-journeys/journeys/2655/steps/16631/actions/trigger', {
      email_address: email,
    });
  } catch (err) {
    console.error('Error triggering new member welcome email journey:', err);
  }
};

export default triggerNewMemberWelcomeEmail;
