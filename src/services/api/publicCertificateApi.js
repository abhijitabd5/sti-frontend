import httpClient from '../utils/httpClient';

// Public Certificate Verification API service
// Docs: docs/Certificates_API.md
// Endpoint: GET /api/public/certificates/verify/:certificateNumber

const extractData = (response) => {
  // Defensive extraction of payload shape { success, message, data, timestamp }
  if (response && response.data && typeof response.data === 'object') {
    return response.data.data ?? response.data;
  }
  return response;
};

export const publicCertificateApi = {
  // Verify certificate by certificate number
  async verifyCertificate(certificateNumber) {
    if (!certificateNumber) throw new Error('Certificate number is required');
    const response = await httpClient.get(`/public/certificates/verify/${certificateNumber}`);
    return extractData(response);
  },
};

export default publicCertificateApi;
