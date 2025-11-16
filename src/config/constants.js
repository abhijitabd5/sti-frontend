// Dropdown constants for the application

// Institution Information
export const INSTITUTION_INFO = {
  name: 'Shahabuddin Training Institute',
  establishedYear: 2018,
  experience: '7+', // years
  studentsTrained: '2500+',
  partners: '150+',
  placementRate: '95%',
  contact: {
    address: 'Near Mahabar Mood, Barkattha, Barhi, Hazaribagh, Jharkhand (825405)',
    mobile: {
      primary: '+91 6206832852',
      secondary: '+91 9431374996'
    },
    email: 'shahabuddintraining@gmail.com'
  }
};

// About Section Information
export const ABOUT_INFO = {
  title: INSTITUTION_INFO.name,
  subtitle: 'Building Careers, Transforming Lives',
  description: `Since ${INSTITUTION_INFO.establishedYear}, ${INSTITUTION_INFO.name} has been the premier destination for heavy equipment training. We've trained over ${INSTITUTION_INFO.studentsTrained} students and maintain a ${INSTITUTION_INFO.placementRate} job placement rate.`,
  mission: 'To provide world-class heavy equipment training that prepares students for successful careers in construction, mining, and related industries.',
  features: [
    'State-of-the-art training facility',
    'Experienced industry instructors',
    'Modern fleet of training equipment',
    'Job placement assistance',
    'Industry-recognized certifications',
    'Flexible scheduling options'
  ],
  stats: [
    { label: 'Students Trained', value: INSTITUTION_INFO.studentsTrained },
    { label: 'Job Placement Rate', value: INSTITUTION_INFO.placementRate },
    { label: 'Years of Experience', value: INSTITUTION_INFO.experience },
    { label: 'Industry Partners', value: INSTITUTION_INFO.partners }
  ]
};

// Social media and promotion sources
export const SOURCES = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'threads', label: 'Threads' },
  { value: 'offline', label: 'Offline' },
  { value: 'sms_campaign', label: 'SMS Campaign' },
  { value: 'other', label: 'Other' }
];

// Indian states for address/location dropdowns
export const INDIAN_STATES = [
  { value: 'andhra_pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal_pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal_pradesh', label: 'Himachal Pradesh' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'madhya_pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil_nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar_pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west_bengal', label: 'West Bengal' },
  // Union Territories
  { value: 'andaman_nicobar', label: 'Andaman and Nicobar Islands' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'dadra_nagar_haveli_daman_diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'jammu_kashmir', label: 'Jammu and Kashmir' },
  { value: 'ladakh', label: 'Ladakh' },
  { value: 'lakshadweep', label: 'Lakshadweep' },
  { value: 'puducherry', label: 'Puducherry' }
];

// Helper functions for working with dropdown data
export const getSourceLabel = (value) => {
  const source = SOURCES.find(s => s.value === value);
  return source ? source.label : value;
};

export const getStateLabel = (value) => {
  const state = INDIAN_STATES.find(s => s.value === value);
  return state ? state.label : value;
};

// Convert state slug to display name (for backend data)
export const getStateDisplayName = (stateSlug) => {
  const state = INDIAN_STATES.find(s => s.value === stateSlug);
  return state ? state.label : stateSlug;
};

// Get array of just values (for backend compatibility)
export const getSourceValues = () => SOURCES.map(s => s.value);
export const getStateValues = () => INDIAN_STATES.map(s => s.value);