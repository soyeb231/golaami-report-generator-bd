
// বাংলা সংখ্যা রূপান্তর ফাংশন
export function toBanglaNumber(number: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return number.toString().replace(/\d/g, (digit) => bnDigits[parseInt(digit)]);
}

// ইংরেজি সংখ্যায় রূপান্তর ফাংশন
export function toEnglishNumber(banglaNumber: string): string {
  const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  let result = banglaNumber;
  bnDigits.forEach((bn, index) => {
    result = result.replace(new RegExp(bn, 'g'), enDigits[index]);
  });
  return result;
}

// বাংলা দিনের নাম
export const banglaDays = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 
  'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// বাংলা মাসের নাম
export const banglaMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

// তারিখ ফরম্যাটিং (২৭/০১/২০২৪) + ইং তারিখ + দিন
export function formatBanglaDate(dateObj: Date): string {
  const day = toBanglaNumber(dateObj.getDate().toString().padStart(2, '0'));
  const month = toBanglaNumber((dateObj.getMonth() + 1).toString().padStart(2, '0'));
  const year = toBanglaNumber(dateObj.getFullYear());
  const dayName = banglaDays[dateObj.getDay()];
  return `${day}/${month}/${year} ইং রোজ: ${dayName}`;
}

// আজকের তারিখ বাংলায়
export function getTodayInBangla(): string {
  return formatBanglaDate(new Date());
}

// সংখ্যাকে দুই অঙ্কে বাংলায় রূপান্তর
export function toBanglaTwoDigit(number: number): string {
  return toBanglaNumber(number.toString().padStart(2, '0'));
}
