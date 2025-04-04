'use server';

import { sendConfirmationEmail } from '@/lib/email';

interface WaitlistFormData {
    email: string;
    name?: string;
    message?: string;
}

export async function submitToWaitlist(data: WaitlistFormData) {
    try {
        // Send confirmation email
        const emailResult = await sendConfirmationEmail({
            to: data.email,
            subject: 'Willkommen auf der Warteliste des Vergabevermerk Portals',
            name: data.name,
            message: data.message,
        });

        if (!emailResult.success) {
            throw new Error('Failed to send confirmation email');
        }

        // Here you could also store the waitlist entry in a database
        // For now, we'll just return success

        return { success: true };
    } catch (error) {
        console.error('Error submitting to waitlist:', error);
        return { success: false, error: 'Failed to process your request' };
    }
} 