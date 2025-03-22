import { Form, FormResponse } from '@prisma/client';
import { PartialUser, FormQuestion } from 'interfaces';

/**
 * Formats email content for form submission notifications
 * @param form The form that was submitted
 * @param formResponse The form response data
 * @param submittingUser The user who submitted the form
 * @returns Object containing email subject, plain text body, and HTML body
 */
export default async function formatFormResponseNotification(
  form: Form,
  formResponse: FormResponse,
  submittingUser: PartialUser,
): Promise<{ subject: string; body: string; html: string }> {
  try {
    const subject = `${form.name}: ${submittingUser.name || submittingUser.email}`;

    const responses = formResponse.responsesJson as unknown as FormQuestion[];

    const userDisplay = submittingUser.name ? `${submittingUser.name} (${submittingUser.email})` : submittingUser.email;

    // HTML Body
    const html = `
      <div style="font-family: sans-serif;">
        <h1 style="color: #486e62;">${form.name}</h1>
        <p>A new form response has been submitted by ${userDisplay}.</p>
        <h2 style="color: #486e62;">Responses:</h2>
        ${responses
          .map(
            response => `
    <div>
      <h3 style="color: #486e62;">${response.question}</h3>
      <p>${response.value}</p>
    </div>
  `,
          )
          .join('')}
      </div>
    `;

    // Plain Text Body (Fallback)
    const body = `
      ${form.name}

      A new form response has been submitted by ${userDisplay}.

      Responses:
      ${responses.map(response => `${response.question}: ${response.value}`).join('\n')}
    `;

    return { subject, body, html };
  } catch (error) {
    console.error('[formatFormResponseNotification] Error formatting email content:', error);
    throw error;
  }
}
