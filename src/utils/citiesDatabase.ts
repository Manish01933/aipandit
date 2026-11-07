export interface CityCoordinate {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  tz: number;
}

export const KNOWN_CITIES: CityCoordinate[] = [
  // Punjab & North India
  { name: 'Fazilka', state: 'Punjab', country: 'India', lat: 30.4037, lon: 74.0253, tz: 5.5 },
  { name: 'Firozpur', state: 'Punjab', country: 'India', lat: 30.9257, lon: 74.6122, tz: 5.5 },
  { name: 'Abohar', state: 'Punjab', country: 'India', lat: 30.1453, lon: 74.1994, tz: 5.5 },
  { name: 'Bathinda', state: 'Punjab', country: 'India', lat: 30.2110, lon: 74.9455, tz: 5.5 },
  { name: 'Muktsar', state: 'Punjab', country: 'India', lat: 30.4762, lon: 74.5168, tz: 5.5 },
  { name: 'Ludhiana', state: 'Punjab', country: 'India', lat: 30.9010, lon: 75.8573, tz: 5.5 },
  { name: 'Amritsar', state: 'Punjab', country: 'India', lat: 31.6340, lon: 74.8723, tz: 5.5 },
  { name: 'Jalandhar', state: 'Punjab', country: 'India', lat: 31.3260, lon: 75.5762, tz: 5.5 },
  { name: 'Patiala', state: 'Punjab', country: 'India', lat: 30.3398, lon: 76.3869, tz: 5.5 },
  { name: 'Chandigarh', state: 'Chandigarh', country: 'India', lat: 30.7333, lon: 76.7794, tz: 5.5 },
  { name: 'Mohali', state: 'Punjab', country: 'India', lat: 30.7046, lon: 76.7179, tz: 5.5 },
  { name: 'Panchkula', state: 'Haryana', country: 'India', lat: 30.6942, lon: 76.8606, tz: 5.5 },
  { name: 'Ambala', state: 'Haryana', country: 'India', lat: 30.3782, lon: 76.7767, tz: 5.5 },
  { name: 'Hisar', state: 'Haryana', country: 'India', lat: 29.1492, lon: 75.7217, tz: 5.5 },
  { name: 'Sirsa', state: 'Haryana', country: 'India', lat: 29.5349, lon: 75.0290, tz: 5.5 },
  { name: 'Karnal', state: 'Haryana', country: 'India', lat: 29.6857, lon: 76.9905, tz: 5.5 },
  { name: 'Panipat', state: 'Haryana', country: 'India', lat: 29.3909, lon: 76.9635, tz: 5.5 },
  { name: 'Gurugram', state: 'Haryana', country: 'India', lat: 28.4595, lon: 77.0266, tz: 5.5 },
  { name: 'Faridabad', state: 'Haryana', country: 'India', lat: 28.4089, lon: 77.3178, tz: 5.5 },
  { name: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { name: 'Delhi', state: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025, tz: 5.5 },
  { name: 'Noida', state: 'Uttar Pradesh', country: 'India', lat: 28.5355, lon: 77.3910, tz: 5.5 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', lat: 28.6692, lon: 77.4538, tz: 5.5 },
  { name: 'Meerut', state: 'Uttar Pradesh', country: 'India', lat: 28.9845, lon: 77.7064, tz: 5.5 },
  { name: 'Agra', state: 'Uttar Pradesh', country: 'India', lat: 27.1767, lon: 78.0081, tz: 5.5 },
  { name: 'Mathura', state: 'Uttar Pradesh', country: 'India', lat: 27.4924, lon: 77.6737, tz: 5.5 },
  { name: 'Vrindavan', state: 'Uttar Pradesh', country: 'India', lat: 27.5806, lon: 77.7006, tz: 5.5 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', lat: 26.4499, lon: 80.3319, tz: 5.5 },
  { name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'Prayagraj', state: 'Uttar Pradesh', country: 'India', lat: 25.4358, lon: 81.8463, tz: 5.5 },
  { name: 'Allahabad', state: 'Uttar Pradesh', country: 'India', lat: 25.4358, lon: 81.8463, tz: 5.5 },
  { name: 'Ayodhya', state: 'Uttar Pradesh', country: 'India', lat: 26.7922, lon: 82.1998, tz: 5.5 },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', country: 'India', lat: 26.7606, lon: 83.3732, tz: 5.5 },
  { name: 'Haridwar', state: 'Uttarakhand', country: 'India', lat: 29.9457, lon: 78.1642, tz: 5.5 },
  { name: 'Rishikesh', state: 'Uttarakhand', country: 'India', lat: 30.0869, lon: 78.2676, tz: 5.5 },
  { name: 'Dehradun', state: 'Uttarakhand', country: 'India', lat: 30.3165, lon: 78.0322, tz: 5.5 },
  { name: 'Shimla', state: 'Himachal Pradesh', country: 'India', lat: 31.1048, lon: 77.1734, tz: 5.5 },
  { name: 'Jammu', state: 'Jammu and Kashmir', country: 'India', lat: 32.7266, lon: 74.8570, tz: 5.5 },
  { name: 'Srinagar', state: 'Jammu and Kashmir', country: 'India', lat: 34.0837, lon: 74.7973, tz: 5.5 },

  // Rajasthan
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: 'Jodhpur', state: 'Rajasthan', country: 'India', lat: 26.2389, lon: 73.0243, tz: 5.5 },
  { name: 'Udaipur', state: 'Rajasthan', country: 'India', lat: 24.5854, lon: 73.7125, tz: 5.5 },
  { name: 'Kota', state: 'Rajasthan', country: 'India', lat: 25.2138, lon: 75.8648, tz: 5.5 },
  { name: 'Bikaner', state: 'Rajasthan', country: 'India', lat: 28.0229, lon: 73.3119, tz: 5.5 },
  { name: 'Ajmer', state: 'Rajasthan', country: 'India', lat: 26.4499, lon: 74.6399, tz: 5.5 },
  { name: 'Sri Ganganagar', state: 'Rajasthan', country: 'India', lat: 29.9038, lon: 73.8772, tz: 5.5 },
  { name: 'Hanumangarh', state: 'Rajasthan', country: 'India', lat: 29.5816, lon: 74.3294, tz: 5.5 },

  // Central, West & South India
  { name: 'Ujjain', state: 'Madhya Pradesh', country: 'India', lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', lat: 22.7196, lon: 75.8577, tz: 5.5 },
  { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', lat: 23.2599, lon: 77.4126, tz: 5.5 },
  { name: 'Gwalior', state: 'Madhya Pradesh', country: 'India', lat: 26.2183, lon: 78.1828, tz: 5.5 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', country: 'India', lat: 23.1815, lon: 79.9864, tz: 5.5 },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: 'Surat', state: 'Gujarat', country: 'India', lat: 21.1702, lon: 72.8311, tz: 5.5 },
  { name: 'Vadodara', state: 'Gujarat', country: 'India', lat: 22.3072, lon: 73.1812, tz: 5.5 },
  { name: 'Rajkot', state: 'Gujarat', country: 'India', lat: 22.3039, lon: 70.8022, tz: 5.5 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { name: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { name: 'Nagpur', state: 'Maharashtra', country: 'India', lat: 21.1458, lon: 79.0882, tz: 5.5 },
  { name: 'Nashik', state: 'Maharashtra', country: 'India', lat: 19.9975, lon: 73.7898, tz: 5.5 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Bangalore', state: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Mysuru', state: 'Karnataka', country: 'India', lat: 12.2958, lon: 76.6394, tz: 5.5 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'Madurai', state: 'Tamil Nadu', country: 'India', lat: 9.9252, lon: 78.1198, tz: 5.5 },
  { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', lat: 11.0168, lon: 76.9558, tz: 5.5 },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lon: 78.4867, tz: 5.5 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', lat: 17.6868, lon: 83.2185, tz: 5.5 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', lat: 16.5062, lon: 80.6480, tz: 5.5 },
  { name: 'Tirupati', state: 'Andhra Pradesh', country: 'India', lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'Patna', state: 'Bihar', country: 'India', lat: 25.5941, lon: 85.1376, tz: 5.5 },
  { name: 'Gaya', state: 'Bihar', country: 'India', lat: 24.7914, lon: 85.0002, tz: 5.5 },
  { name: 'Ranchi', state: 'Jharkhand', country: 'India', lat: 23.3441, lon: 85.3096, tz: 5.5 },
  { name: 'Bhubaneswar', state: 'Odisha', country: 'India', lat: 20.2961, lon: 85.8245, tz: 5.5 },
  { name: 'Puri', state: 'Odisha', country: 'India', lat: 19.8135, lon: 85.8312, tz: 5.5 },
  { name: 'Guwahati', state: 'Assam', country: 'India', lat: 26.1445, lon: 91.7362, tz: 5.5 },

  // International
  { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lon: 85.3240, tz: 5.75 },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, tz: -5 },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lon: -122.4194, tz: -8 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, tz: -5 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207, tz: -8 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 8 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, tz: 10 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, tz: 10 },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lon: 174.7633, tz: 12 },
];

export function lookupCityCoordinates(cityName: string): CityCoordinate | null {
  if (!cityName || !cityName.trim()) return null;
  const clean = cityName.toLowerCase().trim();
  
  // Exact name or startsWith match
  const exact = KNOWN_CITIES.find(
    (c) => c.name.toLowerCase() === clean || clean.startsWith(c.name.toLowerCase())
  );
  if (exact) return exact;

  // Substring match
  const sub = KNOWN_CITIES.find(
    (c) => clean.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(clean)
  );
  if (sub) return sub;

  return null;
}
