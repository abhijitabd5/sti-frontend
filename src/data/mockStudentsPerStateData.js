// Mock data for Students per State visualization
// Backend sends ALL states sorted by student count (including 0 counts)
export const mockStudentsPerStateData = {
  success: true,
  message: "Students per state data retrieved successfully",
  data: {
    states: [
      // Top states with students - using new backend format
      { state_name: "Maharashtra", state_slug: "maharashtra", student_count: 245, region_slug: "west_india", region_name: "West India" },
      { state_name: "Karnataka", state_slug: "karnataka", student_count: 189, region_slug: "south_india", region_name: "South India" },
      { state_name: "Tamil Nadu", state_slug: "tamil_nadu", student_count: 167, region_slug: "south_india", region_name: "South India" },
      { state_name: "Gujarat", state_slug: "gujarat", student_count: 143, region_slug: "west_india", region_name: "West India" },
      { state_name: "Uttar Pradesh", state_slug: "uttar_pradesh", student_count: 128, region_slug: "north_india", region_name: "North India" },
      { state_name: "Rajasthan", state_slug: "rajasthan", student_count: 112, region_slug: "north_india", region_name: "North India" },
      { state_name: "West Bengal", state_slug: "west_bengal", student_count: 98, region_slug: "east_india", region_name: "East India" },
      { state_name: "Andhra Pradesh", state_slug: "andhra_pradesh", student_count: 87, region_slug: "south_india", region_name: "South India" },
      { state_name: "Delhi", state_slug: "delhi", student_count: 85, region_slug: "north_india", region_name: "North India" },
      { state_name: "Telangana", state_slug: "telangana", student_count: 76, region_slug: "south_india", region_name: "South India" },
      { state_name: "Kerala", state_slug: "kerala", student_count: 65, region_slug: "south_india", region_name: "South India" },
      { state_name: "Punjab", state_slug: "punjab", student_count: 54, region_slug: "north_india", region_name: "North India" },
      { state_name: "Haryana", state_slug: "haryana", student_count: 48, region_slug: "north_india", region_name: "North India" },
      { state_name: "Odisha", state_slug: "odisha", student_count: 42, region_slug: "east_india", region_name: "East India" },
      { state_name: "Madhya Pradesh", state_slug: "madhya_pradesh", student_count: 38, region_slug: "central_india", region_name: "Central India" },
      { state_name: "Bihar", state_slug: "bihar", student_count: 35, region_slug: "east_india", region_name: "East India" },
      { state_name: "Jharkhand", state_slug: "jharkhand", student_count: 32, region_slug: "east_india", region_name: "East India" },
      { state_name: "Jammu and Kashmir", state_slug: "jammu_kashmir", student_count: 29, region_slug: "north_india", region_name: "North India" },
      { state_name: "Assam", state_slug: "assam", student_count: 28, region_slug: "northeast_india", region_name: "Northeast India" },
      { state_name: "Chhattisgarh", state_slug: "chhattisgarh", student_count: 25, region_slug: "central_india", region_name: "Central India" },
      { state_name: "Uttarakhand", state_slug: "uttarakhand", student_count: 22, region_slug: "north_india", region_name: "North India" },
      { state_name: "Himachal Pradesh", state_slug: "himachal_pradesh", student_count: 19, region_slug: "north_india", region_name: "North India" },
      { state_name: "Goa", state_slug: "goa", student_count: 16, region_slug: "west_india", region_name: "West India" },
      { state_name: "Tripura", state_slug: "tripura", student_count: 14, region_slug: "northeast_india", region_name: "Northeast India" },
      { state_name: "Manipur", state_slug: "manipur", student_count: 12, region_slug: "northeast_india", region_name: "Northeast India" },
      { state_name: "Puducherry", state_slug: "puducherry", student_count: 12, region_slug: "south_india", region_name: "South India" },
      { state_name: "Meghalaya", state_slug: "meghalaya", student_count: 11, region_slug: "northeast_india", region_name: "Northeast India" },
      { state_name: "Nagaland", state_slug: "nagaland", student_count: 9, region_slug: "northeast_india", region_name: "Northeast India" },
      { state_name: "Chandigarh", state_slug: "chandigarh", student_count: 8, region_slug: "north_india", region_name: "North India" },
      { state_name: "Arunachal Pradesh", state_slug: "arunachal_pradesh", student_count: 8, region_slug: "northeast_india", region_name: "Northeast India" },
      { state_name: "Mizoram", state_slug: "mizoram", student_count: 7, region_slug: "northeast_india", region_name: "Northeast India" },
      { state_name: "Sikkim", state_slug: "sikkim", student_count: 6, region_slug: "northeast_india", region_name: "Northeast India" },
      { state_name: "Dadra and Nagar Haveli and Daman and Diu", state_slug: "dadra_nagar_haveli_daman_diu", student_count: 5, region_slug: "west_india", region_name: "West India" },
      { state_name: "Ladakh", state_slug: "ladakh", student_count: 4, region_slug: "north_india", region_name: "North India" },
      { state_name: "Andaman and Nicobar Islands", state_slug: "andaman_nicobar", student_count: 3, region_slug: "south_india", region_name: "South India" },
      { state_name: "Lakshadweep", state_slug: "lakshadweep", student_count: 2, region_slug: "south_india", region_name: "South India" }
    ]
  }
};

// Indian regions mapping
export const INDIAN_REGIONS = {
  'North India': [
    'Delhi', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Ladakh',
    'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Uttarakhand', 'Chandigarh'
  ],
  'South India': [
    'Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana',
    'Puducherry', 'Lakshadweep', 'Andaman and Nicobar Islands'
  ],
  'West India': [
    'Goa', 'Gujarat', 'Maharashtra', 'Dadra and Nagar Haveli and Daman and Diu'
  ],
  'East India': [
    'Bihar', 'Jharkhand', 'Odisha', 'West Bengal'
  ],
  'Northeast India': [
    'Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Sikkim', 'Tripura'
  ],
  'Central India': [
    'Chhattisgarh', 'Madhya Pradesh'
  ]
};

// Function to simulate API delay
export const getMockStudentsPerStateData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStudentsPerStateData);
    }, 800); // Simulate network delay
  });
};