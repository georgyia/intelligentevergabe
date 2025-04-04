import nodemailer from 'nodemailer';

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('Missing required SMTP configuration');
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS?.replace(/\s/g, ''), // Remove spaces from app password
  },
  tls: {
    rejectUnauthorized: true,
  },
});

interface EmailTemplate {
  to: string;
  subject: string;
  name?: string;
  message?: string;
}

async function sendAdminNotification({ name, email, message }: { name?: string; email: string; message?: string }) {
  try {
    await transporter.sendMail({
      from: {
        name: 'Vergabevermerk Portal',
        address: process.env.SMTP_USER || 'contact@aiphase.de'
      },
      to: 'contact@aiphase.de',
      subject: 'Intelligente Vergabe - neue Anmeldung',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Neue Wartelisten-Anmeldung</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #1a365d; margin-top: 0;">Anmeldedaten:</h3>
            <p><strong>E-Mail:</strong> ${email}</p>
            <p><strong>Name:</strong> ${name || 'Nicht angegeben'}</p>
            <p><strong>Nachricht:</strong> ${message || 'Keine Nachricht'}</p>
            <p><strong>Zeitpunkt:</strong> ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</p>
          </div>
          
          <p style="color: #666;">
            Diese E-Mail wurde automatisch vom Vergabevermerk Portal System generiert.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
}

export async function sendConfirmationEmail({ to, subject, name, message }: EmailTemplate) {
  try {
    // First, send the admin notification
    await sendAdminNotification({ name, email: to, message });

    // Then send the confirmation email to the user
    const info = await transporter.sendMail({
      from: {
        name: 'AI Phase',
        address: process.env.SMTP_USER || 'contact@aiphase.de'
      },
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://www.aiphase.de" style="text-decoration: none;">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2013-ST8s1DrdckxFjciXs0AV91NxThedzt.png" 
                   alt="AI Phase" 
                   style="max-width: 200px; height: auto;" />
            </a>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Vielen Dank für Ihr Interesse!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Sehr ${name ? `geehrte(r) ${name}` : 'geehrte(r) Interessent(in)'},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            wir freuen uns über Ihr Interesse am Vergabevermerk Portal. Das Portal befindet sich derzeit in der Entwicklungsphase, 
            und wir arbeiten mit Hochdruck daran, Ihnen bald eine innovative Lösung zur Verfügung zu stellen.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Sobald das Portal verfügbar ist, werden wir Sie umgehend benachrichtigen.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <table style="margin: 0 auto;">
              <tr>
                <td style="padding: 0 10px;">
                  <a href="https://www.aiphase.de" 
                     style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Besuchen Sie unsere Website
                  </a>
                </td>
                <td style="padding: 0 10px;">
                  <a href="https://www.linkedin.com/company/ai-phase" 
                     style="background-color: #0077B5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Besuchen Sie uns auf LinkedIn
                  </a>
                </td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Mit freundlichen Grüßen,<br>
            Ihr AI Phase Team
          </p>
          
          <hr style="border: 1px solid #eee; margin: 30px 0;" />
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>AI Phase GmbH</p>
            <p>Kreuzenäckerweg 21</p>
            <p>61476 Kronberg im Taunus</p>
            <p><a href="mailto:contact@aiphase.de" style="color: #999; text-decoration: none;">contact@aiphase.de</a></p>
            <p><a href="https://www.aiphase.de" style="color: #999; text-decoration: none;">www.aiphase.de</a></p>
          </div>
        </div>
      `,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 