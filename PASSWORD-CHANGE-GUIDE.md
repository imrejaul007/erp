# Password Change Guide - URGENT SECURITY

**Status**: 🔴 CRITICAL - Do this NOW!
**Time Required**: 2 minutes
**Current Password**: `admin123` ⚠️

---

## 🚨 Why This is CRITICAL

Your system is using the **default password** `admin123`:
- ❌ Anyone can guess this password
- ❌ Your business data is at risk
- ❌ Customer information exposed
- ❌ Sales and inventory data vulnerable

**Change it NOW before doing anything else!**

---

## 🔐 How to Change Password

### Method 1: Via Web Interface (Recommended)

**Step 1**: Login
```
URL: https://oud-erp.onrender.com/auth/signin
Email: admin@oudperfume.ae
Password: admin123
```

**Step 2**: Go to Profile
```
After login, click on your profile icon/name
Or go to: /profile
```

**Step 3**: Change Password
```
1. Look for "Security" or "Change Password" section
2. Enter current password: admin123
3. Enter new password: [YOUR STRONG PASSWORD]
4. Confirm new password: [YOUR STRONG PASSWORD]
5. Click "Save" or "Update Password"
```

### Method 2: Via API (If UI doesn't work)

**Using curl**:
```bash
# Login first to get session token
curl -X POST https://oud-erp.onrender.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oudperfume.ae","password":"admin123"}'

# Change password (replace [NEW_PASSWORD])
curl -X POST https://oud-erp.onrender.com/api/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: [YOUR_SESSION_COOKIE]" \
  -d '{"currentPassword":"admin123","newPassword":"[NEW_PASSWORD]"}'
```

---

## 💪 Creating a Strong Password

### Requirements:
- ✅ At least 8 characters (12+ recommended)
- ✅ Mix of uppercase and lowercase letters
- ✅ Include numbers
- ✅ Include special characters (!@#$%^&*)
- ✅ NOT a dictionary word
- ✅ NOT personal info (name, birthday, etc.)

### Good Examples:
```
Oud@Palace2024!
P3rfum€#Business
MyErp$2024Strong!
```

### Bad Examples (DON'T USE):
```
admin123 ❌ (current - too simple)
password ❌ (too common)
12345678 ❌ (too simple)
oudperfume ❌ (too obvious)
```

---

## 📝 Password Storage

After changing, **WRITE IT DOWN** and store securely:

1. **Physical**: Write on paper, lock in safe
2. **Digital**: Use password manager (1Password, LastPass, Bitwarden)
3. **Don't**: Email it to yourself, save in plain text file

---

## ✅ Verification

After changing password:

1. **Log out** completely
2. **Try logging in** with old password (`admin123`)
   - Should FAIL ✅
3. **Log in** with new password
   - Should WORK ✅
4. **Test on another device** (if available)
   - Verify new password works everywhere

---

## 🔄 If You Forget New Password

Don't worry! You can reset it:

### Option 1: Password Reset (If Email Configured)
```
1. Go to: /auth/signin
2. Click "Forgot Password"
3. Enter email: admin@oudperfume.ae
4. Check email for reset link
5. Set new password
```

### Option 2: Database Reset (Advanced)
If you have database access:
```sql
-- Hash new password with bcrypt (12 rounds)
-- Then update:
UPDATE users
SET password = '[HASHED_PASSWORD]'
WHERE email = 'admin@oudperfume.ae';
```

### Option 3: Contact Support
If locked out, contact your developer or database administrator.

---

## 🎯 After Password Change

Once password is changed, update documentation:

1. ✅ Remove "admin123" from any saved notes
2. ✅ Store new password securely
3. ✅ Share with trusted staff (if needed)
4. ✅ Mark this task as COMPLETE

---

## 📋 Checklist

- [ ] Read this guide
- [ ] Choose strong password
- [ ] Login with old password (admin123)
- [ ] Go to /profile
- [ ] Change password
- [ ] Write down new password
- [ ] Store securely
- [ ] Logout
- [ ] Login with new password (verify)
- [ ] Mark task complete ✅

---

## ⚠️ Security Tips

### Do's:
- ✅ Change password immediately
- ✅ Use unique password (not used elsewhere)
- ✅ Store password securely
- ✅ Share only with trusted staff
- ✅ Change regularly (every 90 days)

### Don'ts:
- ❌ Share password via email
- ❌ Write password in exposed places
- ❌ Use same password for multiple accounts
- ❌ Keep using default password
- ❌ Save password in browser (on shared computers)

---

## 🆘 Need Help?

If you have issues:
1. Check if you're typing correctly (case-sensitive)
2. Clear browser cache and try again
3. Try different browser
4. Check if caps lock is on
5. Contact system administrator

---

**STOP READING AND DO THIS NOW!**

Go to https://oud-erp.onrender.com and change the password!

---

**Last Updated**: 2025-10-23
**Priority**: 🔴 CRITICAL
**Time**: 2 minutes
**Status**: WAITING FOR YOU!
