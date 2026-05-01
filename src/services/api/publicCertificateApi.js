import httpClient from '../utils/httpClient';

// Public Certificate Verification API service
// Docs: docs/Certificates_API.md
// Endpoint: POST /api/public/certificates/verify
// 
// Payload format:
// {
//   certificateNumber: string (required),
//   mobileNumber: string (optional, 10 digits),
//   dateOfBirth: string (optional, DD-MM-YYYY format)
// }
// 
// At least one of mobileNumber or dateOfBirth must be provided

const extractData = (response) => {
  // Defensive extraction of payload shape { success, message, data, timestamp }
  if (response && response.data && typeof response.data === 'object') {
    return response.data.data ?? response.data;
  }
  return response;
};

export const publicCertificateApi = {
  /**
   * Verify certificate with security fields
   * @param {Object} payload - Verification payload
   * @param {string} payload.certificateNumber - Certificate number (required)
   * @param {string} [payload.mobileNumber] - 10-digit mobile number (optional)
   * @param {string} [payload.dateOfBirth] - Date of birth in DD-MM-YYYY format (optional)
   * @returns {Promise<Object>} Certificate data if verification succeeds
   * @throws {Error} If validation fails or certificate not found
   */
  async verifyCertificate(payload) {
    if (!payload || !payload.certificateNumber) {
      throw new Error('Certificate number is required');
    }

    if (!payload.mobileNumber && !payload.dateOfBirth) {
      throw new Error('Either mobile number or date of birth is required');
    }

    // Validate mobile number format if provided
    if (payload.mobileNumber && !/^\d{10}$/.test(payload.mobileNumber)) {
      throw new Error('Mobile number must be exactly 10 digits');
    }

    // Validate date format if provided (DD-MM-YYYY)
    if (payload.dateOfBirth && !/^\d{2}-\d{2}-\d{4}$/.test(payload.dateOfBirth)) {
      throw new Error('Date of birth must be in DD-MM-YYYY format');
    }

    const response = await httpClient.post('/public/certificates/verify', payload);
    return extractData(response);
  },

  /**
   * Download certificate PDF with security verification
   * @param {Object} payload - Download payload
   * @param {string} payload.certificateNumber - Certificate number (required)
   * @param {string} [payload.mobileNumber] - 10-digit mobile number (optional)
   * @param {string} [payload.dateOfBirth] - Date of birth in DD-MM-YYYY format (optional)
   * @returns {Promise<Blob>} PDF file blob
   * @throws {Error} If validation fails or certificate not found
   */
  async downloadCertificate(payload) {
    if (!payload || !payload.certificateNumber) {
      throw new Error('Certificate number is required');
    }

    if (!payload.mobileNumber && !payload.dateOfBirth) {
      throw new Error('Either mobile number or date of birth is required');
    }

    // Validate mobile number format if provided
    if (payload.mobileNumber && !/^\d{10}$/.test(payload.mobileNumber)) {
      throw new Error('Mobile number must be exactly 10 digits');
    }

    // Validate date format if provided (DD-MM-YYYY)
    if (payload.dateOfBirth && !/^\d{2}-\d{2}-\d{4}$/.test(payload.dateOfBirth)) {
      throw new Error('Date of birth must be in DD-MM-YYYY format');
    }

    const response = await httpClient.post('/public/certificates/download', payload, {
      responseType: 'blob', // Important for file download
    });

    return response.data; // Return blob directly
  },

  /**
   * Verify certificate by QR code
   * @param {string} verificationCode - 8-character verification code from QR
   * @returns {Promise<Object>} Certificate data if verification succeeds
   * @throws {Error} If verification code is invalid or certificate not found
   */
  async verifyByQRCode(verificationCode) {
    if (!verificationCode) {
      throw new Error('Verification code is required');
    }

    const response = await httpClient.get(`/public/certificates/qr/${verificationCode}`);
    return extractData(response);
  },
};

export default publicCertificateApi;
