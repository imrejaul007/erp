-- Update the user to mark as verified (bypass email verification)
UPDATE users 
SET "isVerified" = true, 
    "emailVerified" = NOW()
WHERE email = 'admin@oudperfume.ae';
