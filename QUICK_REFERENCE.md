# Certificate Verification - Quick Reference Card

## 🎯 What Changed?

Certificate verification now requires **additional security fields** (mobile number or date of birth) to prevent unauthorized access.

---

## 📋 Quick Facts

| Item | Value |
|------|-------|
| **API Method** | POST (changed from GET) |
| **Endpoint** | `/api/public/certificates/verify` |
| **Required Fields** | Certificate Number + (Mobile OR DOB) |
| **Mobile Format** | Exactly 10 digits |
| **DOB Format** | DD-MM-YYYY (e.g., 15-06-1995) |
| **Age Restriction** | Must be 18+ years old |
| **New Features** | Download PDF, QR verification |

---

## 🔧 For Developers

### Import
```javascript
import { publicCertificateApi } from '@/services/api/publicCertificateApi';
```

### Verify Certificate
```javascript
const result = await publicCertificateApi.verifyCertificate({
  certificateNumber: 'STI-2024-0001',
  mobileNumber: '9876543210',      // Optional
  dateOfBirth: '15-06-1995'        // Optional (DD-MM-YYYY)
});
```

### Download Certificate
```javascript
const blob = await publicCertificateApi.downloadCertificate({
  certificateNumber: 'STI-2024-0001',
  mobileNumber: '9876543210'
});

// Trigger download
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'certificate.pdf';
a.click();
window.URL.revokeObjectURL(url);
```

### Verify by QR Code
```javascript
const result = await publicCertificateApi.verifyByQRCode('A7B9C2D4');
```

---

## 👤 For End Users

### How to Verify

1. Click **"Verify Certificate"** in navbar
2. Enter **Certificate Number** (required)
3. Enter **Mobile Number** OR **Date of Birth** (at least one)
4. Click **"Verify Certificate"**
5. View certificate details
6. Click **"Download Certificate"** (optional)

### Field Requirements

**Certificate Number:**
- ✅ Required
- Example: `STI-2024-0001`

**Mobile Number:**
- ⚠️ Optional (but need mobile OR DOB)
- Must be exactly 10 digits
- Example: `9876543210`
- ❌ No spaces, dashes, or country code

**Date of Birth:**
- ⚠️ Optional (but need mobile OR DOB)
- Must be at least 18 years old
- Format: DD-MM-YYYY
- Example: `15-06-1995`

---

## ❌ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Certificate number is required" | Empty certificate field | Enter certificate number |
| "Please provide either mobile number or date of birth" | Both security fields empty | Enter mobile OR DOB |
| "Mobile number must be exactly 10 digits" | Wrong mobile format | Enter exactly 10 digits |
| "Certificate verification failed - mobile number does not match" | Wrong mobile | Check mobile or try DOB |
| "Certificate verification failed - date of birth does not match" | Wrong DOB | Check DOB or try mobile |
| "Certificate not found" | Invalid certificate number | Verify certificate number |

---

## 📁 Modified Files

1. `src/components/common/VerifyCertificateModal.jsx` - UI component
2. `src/services/api/publicCertificateApi.js` - API service

---

## 📚 Documentation

- **Full Details:** `docs/CERTIFICATE_VERIFICATION_UPDATE.md`
- **API Docs:** `docs/Public_Certificate_Verification_API.md`
- **Test Plan:** `CERTIFICATE_VERIFICATION_TEST_PLAN.md`
- **Comparison:** `docs/CERTIFICATE_VERIFICATION_COMPARISON.md`
- **Summary:** `CERTIFICATE_VERIFICATION_FINAL_SUMMARY.md`

---

## ✅ Testing Checklist

**Must Test:**
- [ ] Verify with mobile only
- [ ] Verify with DOB only
- [ ] Verify with both fields
- [ ] Download certificate
- [ ] Wrong mobile error
- [ ] Wrong DOB error
- [ ] Mobile auto-formatting
- [ ] Date picker 18+ limit
- [ ] Dark mode
- [ ] Mobile responsive

---

## 🚀 Deployment

**Before Deploy:**
1. Backend API must be deployed first
2. Test in staging environment
3. Verify API endpoints are correct

**After Deploy:**
1. Test verification flow
2. Test download feature
3. Monitor error logs
4. Check user feedback

---

## 🔒 Security Benefits

- ✅ Multi-factor verification
- ✅ Prevents unauthorized access
- ✅ Protects student privacy
- ✅ Age verification (18+)
- ✅ Flexible security options

---

## 💡 Tips

**For Best Results:**
- Use both mobile AND DOB for strongest verification
- Ensure mobile number matches student records
- Ensure DOB matches student records
- Use modern browser for best experience
- Check network connection if errors occur

**Mobile Users:**
- Native date picker will appear
- Numeric keyboard for mobile input
- Touch-friendly interface
- Responsive design

**Desktop Users:**
- Calendar date picker
- Keyboard navigation supported
- Dark mode available
- Full-width modal

---

## 📞 Need Help?

**Check:**
1. Browser console for errors
2. Network tab for API responses
3. This quick reference
4. Full documentation

**Common Solutions:**
- Clear browser cache
- Try different browser
- Check internet connection
- Verify input formats
- Contact support

---

**Last Updated:** May 1, 2026  
**Status:** ✅ Ready for Testing  
**Version:** 2.0 (Enhanced Security)
