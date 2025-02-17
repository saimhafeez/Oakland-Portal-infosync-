import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { triggerToast } from './triggerToast';

export const getUserByUID = async (uid) => {
    try {
        // Reference to the user document using doc_id
        const userDocRef = doc(firestore, 'users', uid);

        // Fetch the user document
        const userDocSnapshot = await getDoc(userDocRef);

        // Check if the document exists
        if (userDocSnapshot.exists()) {
            // Extract user data from the document
            const userData = userDocSnapshot.data();
            return {
                ...userData,
                uid
            }
        } else {
            triggerToast('User not found!', 'warning')
        }
    } catch (error) {
        console.error('Error fetching user:', error.message);
        triggerToast(error.message, 'warning')
    }
}

export const resetPasswordByUID = async (uid, newPassword) => {
    try {
        // Fetch the user by UID
        const user = await auth.getUser(uid);

        // Update the user's password
        await auth.updatePassword(user.uid, newPassword);

        // Display success message or perform any other actions
        triggerToast('Password reset successfully!', 'success');
    } catch (error) {
        console.error('Error resetting password:', error.message);
        triggerToast(error.message, 'warning');
    }
}