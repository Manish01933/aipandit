import { generateKundali } from './vedicCalculations';
import { generateTwentyPageKundaliReport } from './twentyPageKundaliEngine';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, detail: string) {
  if (condition) {
    results.push({ name: testName, passed: true, message: detail });
    console.log(`✅ [PASS] ${testName}: ${detail}`);
  } else {
    results.push({ name: testName, passed: false, message: detail });
    console.error(`❌ [FAIL] ${testName}: ${detail}`);
  }
}

console.log('==================================================');
console.log('     ASTRODOST AUTOMATED REGRESSION TEST SUITE     ');
console.log('==================================================\n');

// Test Case 1: Minakshi Birth Data & Astronomical Accuracy
const minakshiInput = {
  name: 'Minakshi',
  gender: 'female' as const,
  dob: '1986-03-01',
  tob: '22:30',
  place: 'Ludhiana, Punjab, India',
  latitude: 30.9010,
  longitude: 75.8573,
  timezone: 5.5,
};

const minakshiKundali = generateKundali(minakshiInput);

assert(
  minakshiKundali.ascendantSign === 'Libra',
  'Minakshi Ascendant Sign',
  `Expected Libra, got ${minakshiKundali.ascendantSign}`
);

assert(
  minakshiKundali.moonSign === 'Libra',
  'Minakshi Moon Sign',
  `Expected Libra, got ${minakshiKundali.moonSign}`
);

assert(
  minakshiKundali.birthNakshatra === 'Vishakha',
  'Minakshi Moon Nakshatra',
  `Expected Vishakha, got ${minakshiKundali.birthNakshatra}`
);

const minakshiSun = minakshiKundali.planets.find((p) => p.name === 'Sun');
assert(
  minakshiSun?.sign === 'Aquarius',
  'Minakshi Sun Sign',
  `Expected Aquarius, got ${minakshiSun?.sign}`
);

// Test Case 2: Mohit Birth Data & Astronomical Accuracy
const mohitInput = {
  name: 'Mohit',
  gender: 'male' as const,
  dob: '1979-12-10',
  tob: '01:00',
  place: 'Firozpur, Punjab, India',
  latitude: 30.9257,
  longitude: 74.6122,
  timezone: 5.5,
};

const mohitKundali = generateKundali(mohitInput);

assert(
  mohitKundali.ascendantSign === 'Virgo',
  'Mohit Ascendant Sign',
  `Expected Virgo, got ${mohitKundali.ascendantSign}`
);

assert(
  mohitKundali.moonSign === 'Leo',
  'Mohit Moon Sign',
  `Expected Leo, got ${mohitKundali.moonSign}`
);

assert(
  mohitKundali.birthNakshatra === 'Magha',
  'Mohit Moon Nakshatra',
  `Expected Magha, got ${mohitKundali.birthNakshatra}`
);

const mohitSun = mohitKundali.planets.find((p) => p.name === 'Sun');
assert(
  mohitSun?.sign === 'Scorpio',
  'Mohit Sun Sign',
  `Expected Scorpio, got ${mohitSun?.sign}`
);

// Test Case 3: Data Isolation & Non-Contamination
assert(
  minakshiKundali.ascendantSign !== mohitKundali.ascendantSign,
  'Data Isolation - Ascendants',
  'Minakshi (Libra) and Mohit (Virgo) are completely distinct'
);

assert(
  minakshiKundali.birthNakshatra !== mohitKundali.birthNakshatra,
  'Data Isolation - Nakshatras',
  'Minakshi (Vishakha) and Mohit (Magha) are completely distinct'
);

// Test Case 4: Vimshottari Dasha Date Precision
const minakshiActiveDasha = minakshiKundali.dashaPeriods.find((d) => d.current);
assert(
  Boolean(minakshiActiveDasha?.startDate.includes('-')),
  'Minakshi Dasha Date Formatting',
  `Active Dasha ${minakshiActiveDasha?.planet}: ${minakshiActiveDasha?.startDate} to ${minakshiActiveDasha?.endDate}`
);

const mohitActiveDasha = mohitKundali.dashaPeriods.find((d) => d.current);
assert(
  Boolean(mohitActiveDasha?.startDate.includes('-')),
  'Mohit Dasha Date Formatting',
  `Active Dasha ${mohitActiveDasha?.planet}: ${mohitActiveDasha?.startDate} to ${mohitActiveDasha?.endDate}`
);

// Test Case 5: 25-Page PDF Report Structure & Page Count Verification
const minakshiReport = generateTwentyPageKundaliReport(minakshiKundali);
assert(
  minakshiReport.pages.length === 25,
  '25-Page Report Page Count (Minakshi)',
  `Generated exactly ${minakshiReport.pages.length} pages`
);

const mohitReport = generateTwentyPageKundaliReport(mohitKundali);
assert(
  mohitReport.pages.length === 25,
  '25-Page Report Page Count (Mohit)',
  `Generated exactly ${mohitReport.pages.length} pages`
);

// Test Case 6: Name & Profile Personalization in Reports
assert(
  minakshiReport.nativeName === 'Minakshi',
  'Minakshi Report Personalization',
  `Native name mapped to ${minakshiReport.nativeName}`
);

assert(
  mohitReport.nativeName === 'Mohit',
  'Mohit Report Personalization',
  `Native name mapped to ${mohitReport.nativeName}`
);

// Test Case 7: Database Snapshot Backup Engine
import {
  createDatabaseBackup,
  getDatabaseIntegrityStatus,
  getCustomerIsolatedRecords,
  saveServerTransaction,
} from '../server/commerceRepository';

const backupResult = createDatabaseBackup('automated_regression_test');
assert(
  backupResult.success && backupResult.files.length > 0,
  'Database Snapshot Backup Creation',
  `Created snapshot ${backupResult.backupId} with ${backupResult.files.length} tables (${backupResult.totalSizeBytes} bytes)`
);

// Test Case 8: Database Integrity & Table Status
const dbStatus = getDatabaseIntegrityStatus();
assert(
  dbStatus.isHealthy && dbStatus.fileCount >= 5,
  'Database Integrity Status',
  `Database is healthy with ${dbStatus.fileCount} tables and ${dbStatus.backupCount} backups`
);

// Test Case 9: Customer Data Isolation Verification
const testCustomerA = 'user_cust_A_' + Date.now();
const testCustomerB = 'user_cust_B_' + Date.now();

saveServerTransaction({
  id: `TX-TEST-A-${Date.now()}`,
  userId: testCustomerA,
  clientName: 'Customer A',
  planId: 'plan_kundli_explorer',
  planTitle: 'Kundli Explorer',
  amount: 299,
  originalAmount: 299,
  discountAmount: 0,
  paymentMethod: 'free_coupon',
  status: 'captured',
  isVerified: true,
  createdAt: new Date().toISOString(),
});

const isolatedA = getCustomerIsolatedRecords(testCustomerA);
const isolatedB = getCustomerIsolatedRecords(testCustomerB);

assert(
  isolatedA.transactions.length >= 1 && isolatedA.transactions.every((t) => t.userId === testCustomerA),
  'Customer A Data Isolation',
  `Customer A accessed strictly their own ${isolatedA.transactions.length} transactions`
);

assert(
  isolatedB.transactions.length === 0,
  'Customer B Zero-Cross-Contamination',
  `Customer B cannot see Customer A's transactions (0 leaked)`
);

// Test Case 10: Ashtakoota Matchmaking 36 Gunas
import { calculateMatchmaking } from './vedicCalculations';
const matchResult = calculateMatchmaking(mohitInput, minakshiInput);
assert(
  typeof matchResult.totalPoints === 'number' && matchResult.totalPoints >= 0 && matchResult.totalPoints <= 36,
  'Ashtakoota Matchmaking Gunas Calculation',
  `Score: ${matchResult.totalPoints} / 36 Gunas (${matchResult.recommendation})`
);

// Test Case 11: Lo Shu Grid Magic Square
import { calculateLoShuGrid } from './loShuCalculations';
const loShuResult = calculateLoShuGrid('1986-03-01', 'Minakshi');
assert(
  Boolean(loShuResult && loShuResult.planes && loShuResult.planes.length === 8),
  'Lo Shu Grid Planes Calculation',
  `Calculated ${loShuResult.planes.length} Lo Shu planes with 8 distinct vitality planes`
);

// Test Case 12: Ank Jyotish (Numerology) Mulank & Bhagyank
import { calculateAnkJyotish } from './ankJyotishCalculations';
const ankResult = calculateAnkJyotish('Minakshi', '1986-03-01');
assert(
  ankResult.mulank === 1 && ankResult.bhagyank === 1,
  'Ank Jyotish Mulank & Bhagyank',
  `DOB 01-03-1986: Mulank=${ankResult.mulank}, Bhagyank=${ankResult.bhagyank}`
);

// Test Case 13: Jagannatha Hora Divisional Charts (D9 & D10)
import { calculateJagannathaHora } from './jagannathaHoraEngine';
const horaResult = calculateJagannathaHora(minakshiInput);
assert(
  Boolean(horaResult.vargas['D9'] && horaResult.vargas['D10']),
  'Jagannatha Hora D9 & D10 Generation',
  `D9 Navamsha Lagna=${horaResult.vargas['D9'].ascendantSign}, D10 Dashamsha Lagna=${horaResult.vargas['D10'].ascendantSign}`
);

// Test Case 14: Daily Panchang & Tithi
import { calculateDailyPanchang } from './vedicCalculations';
const panchangResult = calculateDailyPanchang('1986-03-01', 'Ludhiana, Punjab, India', 30.9010, 75.8573, 5.5);
assert(
  Boolean(panchangResult && panchangResult.tithi && panchangResult.nakshatra),
  'Panchang Calculation',
  `Tithi=${String(panchangResult.tithi)}, Nakshatra=${String(panchangResult.nakshatra)}`
);

console.log('\n==================================================');
const totalPassed = results.filter((r) => r.passed).length;
console.log(`RESULTS: ${totalPassed} / ${results.length} Tests Passed successfully.`);
console.log('==================================================\n');

if (totalPassed < results.length) {
  process.exit(1);
}
