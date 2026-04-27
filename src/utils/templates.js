import { application } from "express"

export const jobAcceptTemplate =(firstName,jobRole,location,jobType)=>` <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0; padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Application Received! 🎉</h1>
      <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 16px;">We're excited to have you apply</p>
    </div>

    <!-- Body -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      
      <p style="color: #374151; font-size: 16px; margin-top: 0;">Hi <strong>${firstName}</strong> 👋,</p>
      
      <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
        Thank you for applying! We've successfully received your application and our team is reviewing it carefully.
      </p>

      <!-- Job Card -->
      <div style="background: #f3f4f6; border-left: 4px solid #667eea; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Applied Position</p>
        <h2 style="margin: 0 0 8px; color: #1f2937; font-size: 22px;">${jobRole}</h2>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">📍 ${location} &nbsp;|&nbsp; 💼 ${jobType}</p>
      </div>

      <!-- Steps -->
      <p style="color: #374151; font-size: 15px; font-weight: 600; margin-bottom: 12px;">What happens next?</p>
      
      <div style="display: flex; gap: 12px;">
        
        <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: #fafafa; border-radius: 8px;">
          <span style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">1</span>
          <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong style="color: #374151;">Application Review</strong><br/>Our HR team will carefully review your profile and resume.</p>
        </div>

        <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: #fafafa; border-radius: 8px;">
          <span style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">2</span>
          <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong style="color: #374151;">Initial Screening</strong><br/>If shortlisted, our HR will reach out to schedule a call.</p>
        </div>

        <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: #fafafa; border-radius: 8px;">
          <span style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">3</span>
          <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong style="color: #374151;">Final Decision</strong><br/>We'll notify you of the outcome as soon as possible.</p>
        </div>

      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">
        In the meantime, feel free to reach out if you have any questions. We typically respond within <strong>2-3 business days</strong>.
      </p>

      <!-- CTA -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;">View Your Application</a>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">© 2024 Your Company. All rights reserved.</p>
      <p style="color: #9ca3af; font-size: 13px; margin: 4px 0 0;">You're receiving this because you applied on our platform.</p>
    </div>

  </div>`


export const welcomeMessage=(firstName,lastName,email)=>`<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%); border-radius: 12px 12px 0 0; padding: 50px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">Welcome Aboard! 🚀</h1>
      <p style="color: #93c5fd; margin: 12px 0 0; font-size: 16px;">Your career journey starts here</p>
    </div>

    <!-- Body -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

      <p style="color: #374151; font-size: 17px; margin-top: 0;">Hey <strong>${firstName}</strong> 👋,</p>

      <p style="color: #6b7280; font-size: 15px; line-height: 1.8;">
        We're thrilled to have you join <strong style="color: #1e40af;">JobPortal</strong>. Your account is all set up and ready to go. Let's help you land your dream job! 💼
      </p>

      <!-- Account Info Card -->
      <div style="background: #eff6ff; border-radius: 10px; padding: 20px 24px; margin: 28px 0;">
        <p style="margin: 0 0 12px; color: #1e40af; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Your Account Details</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #9ca3af; font-size: 14px; width: 40%;">Full Name</td>
            <td style="padding: 6px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Email</td>
            <td style="padding: 6px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af; font-size: 14px;">Role</td>
            <td style="padding: 6px 0;">
              <span style="background: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: capitalize;">${user.role}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- What you can do -->
      <p style="color: #374151; font-size: 15px; font-weight: 700; margin-bottom: 16px;">Here's what you can do 👇</p>

      <div style="display: flex; flex-direction: column; gap: 10px;">

        <div style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <span style="font-size: 24px;">🔍</span>
          <div>
            <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">Browse Jobs</p>
            <p style="margin: 4px 0 0; color: #9ca3af; font-size: 13px;">Explore hundreds of job listings tailored for you</p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <span style="font-size: 24px;">📄</span>
          <div>
            <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">Build Your Profile</p>
            <p style="margin: 4px 0 0; color: #9ca3af; font-size: 13px;">Complete your profile to stand out to recruiters</p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <span style="font-size: 24px;">🔔</span>
          <div>
            <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">Get Job Alerts</p>
            <p style="margin: 4px 0 0; color: #9ca3af; font-size: 13px;">Stay updated with the latest openings in your field</p>
          </div>
        </div>

      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 36px;">
        <a href="#" style="background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%); color: white; padding: 15px 40px; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 700; display: inline-block; letter-spacing: 0.3px;">
          Start Exploring Jobs →
        </a>
      </div>

      <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; line-height: 1.6;">
        Need help? Reply to this email or contact us at<br/>
        <a href="mailto:support@jobportal.com" style="color: #1e40af; text-decoration: none;">support@jobportal.com</a>
      </p>

    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px 20px;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">© 2024 JobPortal. All rights reserved.</p>
      <p style="color: #9ca3af; font-size: 13px; margin: 6px 0 0;">
        You're receiving this because you just created an account with us.
      </p>
    </div>

  </div>`

export const jobPosting=(firstName,jobRole,companyName,location,salary,jobType)=>`<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #064e3b 0%, #059669 100%); border-radius: 12px 12px 0 0; padding: 50px 30px; text-align: center;">
      <div style="background: rgba(255,255,255,0.15); width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 30px;">📢</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 800;">Job Posted Successfully!</h1>
      <p style="color: #a7f3d0; margin: 10px 0 0; font-size: 15px;">Your listing is now live and visible to candidates</p>
    </div>

    <!-- Body -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

      <p style="color: #374151; font-size: 17px; margin-top: 0;">Hi <strong>${firstName}</strong> 👋,</p>

      <p style="color: #6b7280; font-size: 15px; line-height: 1.8;">
        Great news! Your job listing has been successfully posted on <strong style="color: #059669;">JobPortal</strong>. Candidates can now discover and apply for your opening.
      </p>

      <!-- Job Details Card -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 24px; margin: 28px 0;">
        <p style="margin: 0 0 16px; color: #059669; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Job Listing Details</p>
        
        <h2 style="margin: 0 0 16px; color: #1f2937; font-size: 22px; font-weight: 700;">${jobRole}</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 7px 0; color: #9ca3af; font-size: 13px; width: 40%;">🏢 Company</td>
            <td style="padding: 7px 0; color: #1f2937; font-size: 13px; font-weight: 600;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">📍 Location</td>
            <td style="padding: 7px 0; color: #1f2937; font-size: 13px; font-weight: 600;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">💼 Job Type</td>
            <td style="padding: 7px 0;">
              <span style="background: #dcfce7; color: #059669; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px;">${jobType}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">💰 Salary</td>
            <td style="padding: 7px 0; color: #1f2937; font-size: 13px; font-weight: 600;">${salary}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">📅 Posted On</td>
            <td style="padding: 7px 0; color: #1f2937; font-size: 13px; font-weight: 600;">${new Date().toDateString()}</td>
          </tr>
        </table>
      </div>

      <!-- Stats Section -->
      <p style="color: #374151; font-size: 15px; font-weight: 700; margin-bottom: 16px;">What to expect 📊</p>

      <div style="display: flex; gap: 12px; margin-bottom: 28px;">

        <div style="flex: 1; text-align: center; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px 10px;">
          <p style="margin: 0; font-size: 28px; font-weight: 800; color: #059669;">24h</p>
          <p style="margin: 6px 0 0; color: #9ca3af; font-size: 12px;">First applications typically arrive</p>
        </div>

        <div style="flex: 1; text-align: center; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px 10px;">
          <p style="margin: 0; font-size: 28px; font-weight: 800; color: #059669;">7d</p>
          <p style="margin: 6px 0 0; color: #9ca3af; font-size: 12px;">Peak application window</p>
        </div>

        <div style="flex: 1; text-align: center; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px 10px;">
          <p style="margin: 0; font-size: 28px; font-weight: 800; color: #059669;">∞</p>
          <p style="margin: 6px 0 0; color: #9ca3af; font-size: 12px;">Listing stays active until closed</p>
        </div>

      </div>

      <!-- Tips -->
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px;">
        <p style="margin: 0 0 12px; color: #d97706; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">💡 Tips to attract top candidates</p>
        <ul style="margin: 0; padding-left: 18px; color: #6b7280; font-size: 14px; line-height: 2;">
          <li>Respond to applications within <strong>48 hours</strong></li>
          <li>Keep your company profile <strong>up to date</strong></li>
          <li>Be clear about <strong>salary and benefits</strong></li>
        </ul>
      </div>

      <!-- CTA Buttons -->
      <div style="text-align: center; margin-top: 28px; display: flex; gap: 12px; justify-content: center;">
        <a href="#" style="background: linear-gradient(135deg, #064e3b 0%, #059669 100%); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block;">
          View Job Listing →
        </a>
        <a href="#" style="background: #f3f4f6; color: #374151; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block;">
          Manage Listings
        </a>
      </div>

      <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; line-height: 1.6;">
        Need help? Contact us at
        <a href="mailto:support@jobportal.com" style="color: #059669; text-decoration: none;">support@jobportal.com</a>
      </p>

    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px 20px;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">© 2024 JobPortal. All rights reserved.</p>
      <p style="color: #9ca3af; font-size: 13px; margin: 6px 0 0;">You're receiving this because you posted a job on our platform.</p>
    </div>

  </div>
  `