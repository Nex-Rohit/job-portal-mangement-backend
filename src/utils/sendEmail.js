import { configDotenv } from "dotenv";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export const sendEmailViaResend = (
  from = "developmentbyrohit@gmail.com",
  to,
  subject,
  job,
  feedback
) => {
  const html=`<p>Hey greeting from our side. You applied for ${job.role} and here is the feedback for the role</p><br>${feedback}`
  console.log('sent emaill..')
  resend.emails.send({
    from: from,
    to: to,
    subject: subject,
    html: html,
  });
};
