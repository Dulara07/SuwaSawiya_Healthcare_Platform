export const MOCK_CAMPAIGNS = [{
  id: 'c1',
  title: 'Urgent Heart Surgery for Little Amara',
  patientName: 'Amara Perera',
  age: 5,
  category: 'Surgery',
  description: 'Amara needs an urgent congenital heart defect repair surgery to survive.',
  story: 'Amara was born with a congenital heart defect that has progressively worsened. Doctors at the National Hospital have recommended immediate surgery to repair the hole in her heart. Her parents, daily wage earners, have exhausted their savings on preliminary treatments. Without this surgery within the next 30 days, her condition could become critical. We are appealing to your kindness to help give Amara a chance at a healthy life.',
  imageUrl: 'https://images.unsplash.com/photo-1516574187841-69301976e495?auto=format&fit=crop&q=80&w=1000',
  goalAmount: 500000,
  raisedAmount: 350000,
  currency: 'LKR',
  deadline: '2023-12-31',
  status: 'Active',
  urgency: 'Critical',
  priorityScore: 9.8,
  partnerId: 'p1',
  partnerName: 'Hope Foundation',
  verified: true,
  createdAt: '2023-10-01',
  updates: [{
    id: 'u1',
    date: '2023-10-15',
    title: 'Surgery Scheduled',
    content: 'Thanks to early donors, we have booked a tentative date for the surgery.'
  }]
}, {
  id: 'c2',
  title: 'Kidney Transplant for Mr. Silva',
  patientName: 'Kamal Silva',
  age: 42,
  category: 'Transplant',
  description: 'Father of three requires a kidney transplant after chronic failure.',
  story: 'Kamal has been battling chronic kidney disease for 5 years. He is currently on dialysis twice a week, which is draining the family finances. A matching donor has been found, but the cost of the transplant procedure and post-operative medication is beyond their reach. Kamal is the sole breadwinner for his family of five.',
  imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000',
  goalAmount: 1500000,
  raisedAmount: 450000,
  currency: 'LKR',
  deadline: '2024-01-15',
  status: 'Active',
  urgency: 'High',
  priorityScore: 8.5,
  partnerId: 'p2',
  partnerName: 'Colombo General Trust',
  verified: true,
  createdAt: '2023-09-20',
  updates: []
}, {
  id: 'c3',
  title: 'Leukemia Treatment for Ravi',
  patientName: 'Ravi Kumar',
  age: 12,
  category: 'Cancer Treatment',
  description: '12-year-old Ravi needs chemotherapy and supportive care.',
  story: 'Ravi was diagnosed with Acute Lymphoblastic Leukemia last month. The prognosis is good with immediate and aggressive chemotherapy. His school friends miss him, and his parents are doing everything they can. The funds will cover 6 cycles of chemotherapy and hospital stays.',
  imageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=1000',
  goalAmount: 800000,
  raisedAmount: 120000,
  currency: 'LKR',
  deadline: '2024-02-28',
  status: 'Active',
  urgency: 'Medium',
  priorityScore: 7.2,
  partnerId: 'p1',
  partnerName: 'Hope Foundation',
  verified: true,
  createdAt: '2023-10-05',
  updates: []
}, {
  id: 'c4',
  title: 'Emergency ICU Care for Accident Victim',
  patientName: 'Nimali De Silva',
  age: 28,
  category: 'Emergency',
  description: 'Critical ICU support needed following a severe road accident.',
  story: 'Nimali was involved in a severe motorbike accident on her way to work. She suffered multiple fractures and head trauma. She is currently in the ICU on ventilator support. Every day in the ICU costs significantly, and her insurance limit has been exceeded.',
  imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
  goalAmount: 600000,
  raisedAmount: 550000,
  currency: 'LKR',
  deadline: '2023-11-10',
  status: 'Active',
  urgency: 'Critical',
  priorityScore: 9.5,
  partnerId: 'p3',
  partnerName: 'City Emergency Fund',
  verified: true,
  createdAt: '2023-10-25',
  updates: []
}, {
  id: 'c5',
  title: 'Cataract Surgery for Elderly Group',
  patientName: 'Various',
  age: 70,
  category: 'Surgery',
  description: 'Funding surgeries for 10 elderly patients in rural areas.',
  story: 'We have identified 10 elderly individuals in the Monaragala district who have lost their vision due to cataracts. This campaign aims to fund their transport, surgery, and post-op care to restore their sight and independence.',
  imageUrl: 'https://images.unsplash.com/photo-1584515933487-9d3005c03f80?auto=format&fit=crop&q=80&w=1000',
  goalAmount: 300000,
  raisedAmount: 50000,
  currency: 'LKR',
  deadline: '2024-03-01',
  status: 'Active',
  urgency: 'Low',
  priorityScore: 4.0,
  partnerId: 'p2',
  partnerName: 'Colombo General Trust',
  verified: true,
  createdAt: '2023-10-10',
  updates: []
}];
export const MOCK_TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      campaigns: 'Campaigns',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      dashboard: 'Dashboard',
      profile: 'Profile',
      adminDashboard: 'Admin Dashboard',
      donorLogin: 'Donor Login',
      partnerLogin: 'Partner Login',
      adminLogin: 'Admin Login',
      logout: 'Log out'
    },
    hero: {
      title: 'Healing Together, One Donation at a Time',
      subtitle: 'Secure, transparent crowdfunding for medical emergencies in Sri Lanka.',
      cta: 'Start a Campaign',
      secondaryCta: 'Donate Now'
    },
    filters: {
      urgency: 'Urgency',
      category: 'Category',
      search: 'Search campaigns...'
    },
    home: {
      raised: 'Raised',
      donors: 'Donors',
      verified: 'Verified',
      patients: 'Patients',
      urgentCases: 'Urgent Cases',
      urgentCasesDescription: 'These patients need your help immediately. Every donation makes a difference.',
      viewAllCampaigns: 'View all campaigns',
      unableToLoad: 'Unable to load live campaigns',
      showingSample: 'Showing sample campaigns instead',
      browseCategory: 'Browse by Category',
      categoryDescription: 'Find campaigns in your area of interest',
      fundraiserTitle: 'Want to fundraise for a patient?',
      fundraiserDescription: 'Join our network of hospitals and NGOs to help patients get the medical care they need.',
      registerPartner: 'Register as a Partner'
    },
    campaign: {
      raised: 'raised of',
      goal: 'goal',
      donate: 'Donate Now',
      story: 'The Story',
      updates: 'Updates'
    },
    footer: {
      rights: '© 2023 HealthBridge. All rights reserved.'
    }
  },
  si: {
    nav: {
      home: 'මුල් පිටුව',
      campaigns: 'ව්‍යාපාර',
      about: 'අපි ගැන',
      contact: 'සම්බන්ධ වන්න',
      login: 'ඇතුල් වන්න',
      dashboard: 'පාලක පුවරුව',
      profile: 'පැතිකඩ',
      adminDashboard: 'පරිපාලක පුවරුව',
      donorLogin: 'පරිත්‍යාගශීලී පිවිසුම',
      partnerLogin: 'හවුල්කරු පිවිසුම',
      adminLogin: 'පරිපාලක පිවිසුම',
      logout: 'ඉවත් වන්න'
    },
    hero: {
      title: 'එක්ව සුවපත් කරමු',
      subtitle: 'ශ්‍රී ලංකාවේ වෛද්‍ය හදිසි අවස්ථා සඳහා ආරක්ෂිත, විනිවිද පෙනෙන අරමුදල් රැස්කිරීම.',
      cta: 'ව්‍යාපාරයක් අරඹන්න',
      secondaryCta: 'ආධාර කරන්න'
    },
    filters: {
      urgency: 'හදිසිභාවය',
      category: 'වර්ගය',
      search: 'සොයන්න...'
    },
    home: {
      raised: 'එකතු කළ මුදල',
      donors: 'පරිත්‍යාගශීලීන්',
      verified: 'තහවුරු කළ',
      patients: 'රෝගීන්',
      urgentCases: 'හදිසි අවශ්‍යතා',
      urgentCasesDescription: 'මෙම රෝගීන්ට ඔබගේ උපකාරය වහාම අවශ්‍යයි. සෑම පරිත්‍යාගයක්ම වැදගත් වේ.',
      viewAllCampaigns: 'සියලුම ව්‍යාපාර බලන්න',
      unableToLoad: 'සජීවී ව්‍යාපාර පූරණය කළ නොහැක',
      showingSample: 'ඒ වෙනුවට ආදර්ශ ව්‍යාපාර පෙන්වයි',
      browseCategory: 'ප්‍රවර්ගය අනුව සොයන්න',
      categoryDescription: 'ඔබ කැමති ක්ෂේත්‍රයේ ව්‍යාපාර සොයන්න',
      fundraiserTitle: 'රෝගියෙකු වෙනුවෙන් අරමුදල් රැස් කිරීමට අවශ්‍යද?',
      fundraiserDescription: 'රෝගීන්ට අවශ්‍ය වෛද්‍ය ප්‍රතිකාර ලබාගැනීමට අපගේ රෝහල් සහ රාජ්‍ය නොවන සංවිධාන ජාලයට එක්වන්න.',
      registerPartner: 'හවුල්කරුවෙකු ලෙස ලියාපදිංචි වන්න'
    },
    campaign: {
      raised: 'රැස්කර ඇත',
      goal: 'ඉලක්කය',
      donate: 'ආධාර කරන්න',
      story: 'කතාව',
      updates: 'යාවත්කාලීන'
    },
    footer: {
      rights: '© 2023 HealthBridge. සියලුම හිමිකම් ඇවිරිණි.'
    }
  },
  ta: {
    nav: {
      home: 'முகப்பு',
      campaigns: 'பிரச்சாரங்கள்',
      about: 'எங்களைப் பற்றி',
      contact: 'தொடர்புக்கு',
      login: 'உள்நுழைய',
      dashboard: 'கட்டுப்பாட்டு பலகை',
      profile: 'சுயவிவரம்',
      adminDashboard: 'நிர்வாகக் கட்டுப்பாட்டு பலகை',
      donorLogin: 'நன்கொடையாளர் உள்நுழைவு',
      partnerLogin: 'கூட்டாளர் உள்நுழைவு',
      adminLogin: 'நிர்வாகி உள்நுழைவு',
      logout: 'வெளியேறு'
    },
    hero: {
      title: 'ஒன்றாக குணப்படுத்துவோம்',
      subtitle: 'இலங்கையில் மருத்துவ அவசரநிலைகளுக்கான பாதுகாப்பான நிதி திரட்டல்.',
      cta: 'பிரச்சாரத்தைத் தொடங்கு',
      secondaryCta: 'நன்கொடை அளியுங்கள்'
    },
    filters: {
      urgency: 'அவசரம்',
      category: 'வகை',
      search: 'தேடு...'
    },
    home: {
      raised: 'திரட்டப்பட்டது',
      donors: 'நன்கொடையாளர்கள்',
      verified: 'சரிபார்க்கப்பட்டது',
      patients: 'நோயாளிகள்',
      urgentCases: 'அவசரத் தேவைகள்',
      urgentCasesDescription: 'இந்த நோயாளிகளுக்கு உங்கள் உதவி உடனடியாகத் தேவை. ஒவ்வொரு நன்கொடையும் மாற்றத்தை ஏற்படுத்துகிறது.',
      viewAllCampaigns: 'அனைத்து பிரச்சாரங்களையும் காண்க',
      unableToLoad: 'நேரடி பிரச்சாரங்களை ஏற்ற முடியவில்லை',
      showingSample: 'அதற்குப் பதிலாக மாதிரி பிரச்சாரங்கள் காட்டப்படுகின்றன',
      browseCategory: 'வகை மூலம் தேடுக',
      categoryDescription: 'உங்கள் விருப்பத் துறையில் பிரச்சாரங்களைக் கண்டறியுங்கள்',
      fundraiserTitle: 'ஒரு நோயாளிக்காக நிதி திரட்ட விரும்புகிறீர்களா?',
      fundraiserDescription: 'நோயாளிகளுக்குத் தேவையான மருத்துவ சேவையைப் பெற உதவும் எங்கள் மருத்துவமனைகள் மற்றும் தன்னார்வ அமைப்புகளின் வலையமைப்பில் இணையுங்கள்.',
      registerPartner: 'கூட்டாளராகப் பதிவு செய்யுங்கள்'
    },
    campaign: {
      raised: 'திரட்டப்பட்டது',
      goal: 'இலக்கு',
      donate: 'நன்கொடை',
      story: 'கதை',
      updates: 'புதுப்பிப்புகள்'
    },
    footer: {
      rights: '© 2023 HealthBridge. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
    }
  }
};
