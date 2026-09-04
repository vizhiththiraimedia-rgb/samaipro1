// 
// HOME PAGE DATA CONFIGURATION
// This file acts as the central data source for the Home Page.
// For the Admin Panel, you can build API routes to overwrite these values or fetch them from a MySQL/MongoDB Database.
//

export const HERO_SLIDES = [
  {
    id: 0,
    image: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=2000",
    titleSi: "තත්පර 30 කින් නොමිලේ ලග්න පලාඵල ලබාගන්න",
    titleEn: "Get Your Free Horoscope In 30 Seconds",
    descSi: "ජ්‍යෝතිෂය ඔබේ ජීවිතයට මඟ පෙන්වන ආලෝකයක් වීමට ඉඩ හරින්න. ඔබේ ජීවිතයට බලපාන සැඟවුණු කරුණු සොයාගෙන පුද්ගලීකරණය කළ පලාඵල අනාවැකි සමඟ එය වඩාත් යහපත් ලෙස හැඩගස්වා ගන්න.",
    descEn: "Let astrology be the guiding light in your life. Discover hidden factors and shape your life better with personalized predictions.",
    showForm: true,
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000",
    titleSi: "විවාහ දෝෂ සහ පවුල් ජීවිතයේ ගැටලු සඳහා විසඳුම්",
    titleEn: "Remedies for Marriage & Family Problems",
    descSi: "පොරොන්දම් පරීක්ෂාව සහ විවාහ දෝෂ නිවැරදිව හඳුනාගෙන, සාර්ථක සහ සතුටුදායක පවුල් ජීවිතයක් සඳහා අවශ්‍ය ජ්‍යෝතිෂ්‍යමය පිළියම් සහ මඟපෙන්වීම් ලබාගන්න.",
    descEn: "Accurate marriage compatibility checking and remedies for doshas to ensure a happy and successful family life.",
    showForm: false,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000",
    titleSi: "වෘත්තීය දියුණුව සහ ධන යෝග පිළිබඳ නිවැරදි අනාවැකි",
    titleEn: "Accurate Predictions on Career & Wealth Opportunities",
    descSi: "ඔබගේ කේන්ද්‍රයට අනුව රැකියාවේ දියුණුව, නව ව්‍යාපාරික අවස්ථා සහ ධනය එක්රැස් වන කාල වකවානු නිවැරදිව දැනගන්න.",
    descEn: "Discover your career growth, business opportunities, and wealth accumulation periods based on your accurate birth chart.",
    showForm: false,
  }
];

export const ZODIAC_SIGNS = [
  { name: "Aries", nameSi: "මේෂ", dates: "Mar 21 - Apr 19", icon: "♈" },
  { name: "Taurus", nameSi: "වෘෂභ", dates: "Apr 20 - May 20", icon: "♉" },
  { name: "Gemini", nameSi: "මිථුන", dates: "May 21 - Jun 20", icon: "♊" },
  { name: "Cancer", nameSi: "කටක", dates: "Jun 21 - Jul 22", icon: "♋" },
  { name: "Leo", nameSi: "සිංහ", dates: "Jul 23 - Aug 22", icon: "♌" },
  { name: "Virgo", nameSi: "කන්‍යා", dates: "Aug 23 - Sep 22", icon: "♍" },
  { name: "Libra", nameSi: "තුලා", dates: "Sep 23 - Oct 22", icon: "♎" },
  { name: "Scorpio", nameSi: "වෘශ්චික", dates: "Oct 23 - Nov 21", icon: "♏" },
  { name: "Sagittarius", nameSi: "ධනු", dates: "Nov 22 - Dec 21", icon: "♐" },
  { name: "Capricorn", nameSi: "මකර", dates: "Dec 22 - Jan 19", icon: "♑" },
  { name: "Aquarius", nameSi: "කුම්භ", dates: "Jan 20 - Feb 18", icon: "♒" },
  { name: "Pisces", nameSi: "මීන", dates: "Feb 19 - Mar 20", icon: "♓" },
];

export const SERVICES = [
  { icon: "BarChart3", title: "Free Horoscope", translationKey: "services.freeHoroscope", href: "/free-horoscope", color: "from-sky-500 to-blue-600" },
  { icon: "Moon", title: "Kundli Matching", translationKey: "services.kundliMatching", href: "/kundli-matching", color: "from-blue-500 to-cyan-600" },
  { icon: "Sun", title: "Career Horoscope", translationKey: "services.careerHoroscope", href: "/career-horoscope", color: "from-amber-500 to-yellow-600" },
  { icon: "Heart", title: "Marriage Predictions", translationKey: "services.marriagePredictions", href: "/marriage-predictions", color: "from-pink-500 to-rose-600" },
  { icon: "TrendingUp", title: "Wealth Horoscope", translationKey: "services.wealthHoroscope", href: "/wealth-horoscope", color: "from-emerald-500 to-green-600" },
  { icon: "Shield", title: "Health Horoscope", translationKey: "services.healthHoroscope", href: "/health-horoscope", color: "from-red-500 to-orange-600" },
  { icon: "Globe", title: "Numerology", translationKey: "services.numerology", href: "/numerology", color: "from-sky-500 to-blue-600" },
  { icon: "Gem", title: "Gem Recommendation", translationKey: "services.gemRecommendation", href: "/gemstone", color: "from-violet-500 to-purple-600" },
];

export const ASTROLOGERS = [
  { id: "1", name: "M.T.H. Ayoma Mallawa", exp: "18 years", img: "https://ui-avatars.com/api/?name=AM&background=d946ef&color=fff", href: "/astrologers/1" },
  { id: "2", name: "Anusha kodagoda", exp: "10 years", img: "https://ui-avatars.com/api/?name=AK&background=dc2626&color=fff", href: "/astrologers/2" },
  { id: "3", name: "JothishyaLK", exp: "3 years", img: "https://ui-avatars.com/api/?name=JLK&background=1a365d&color=fff", href: "/astrologers/3" },
  { id: "4", name: "Dr. Dharmarathne", exp: "25 years", img: "https://ui-avatars.com/api/?name=DD&background=047857&color=fff", href: "/astrologers/4" },
];

export const REMEDIES = [
  { id: "1", nameEn: "Navagraha Shanthi", nameSi: "නවග්‍රහ ශාන්තිකර්මය", img: "https://media.istockphoto.com/id/1169046648/photo/hindu-priest-performing-puja-with-fire.jpg?s=612x612&w=0&k=20&c=wFssYJpL6f3D2a_h1Wn1Tf2H2jU2QnF1g3S6p3h0A7k=", href: "/remedies/1", price: "Rs. 15,000" },
  { id: "2", nameEn: "Seth Kavi", nameSi: "සෙත් කවි ගායනය", img: "https://media.istockphoto.com/id/1283856230/photo/traditional-oil-lamp-in-sri-lanka.jpg?s=612x612&w=0&k=20&c=ZtHl3T9Xo5L5F1r8e3U4b7N6J2K9L5F1r8e3U4b7N6J2K9=", href: "/remedies/2", price: "Rs. 3,500" },
  { id: "3", nameEn: "Bodhi Puja", nameSi: "බෝධි පූජාව", img: "https://media.istockphoto.com/id/1218844871/photo/buddhist-monk-praying-at-the-temple-in-sri-lanka.jpg?s=612x612&w=0&k=20&c=L5F1r8e3U4b7N6J2K9L5F1r8e3U4b7N6J2K9=", href: "/remedies/3", price: "Rs. 5,000" },
  { id: "4", nameEn: "Vasthu Doshaharana", nameSi: "වාස්තු දෝෂහරණය", img: "https://media.istockphoto.com/id/1169046648/photo/hindu-priest-performing-puja-with-fire.jpg?s=612x612&w=0&k=20&c=wFssYJpL6f3D2a_h1Wn1Tf2H2jU2QnF1g3S6p3h0A7k=", href: "/remedies/4", price: "Rs. 25,000" },
];

export const OFFERS = [
  { id: "1", titleEn: "New Year Special", titleSi: "අලුත් අවුරුදු දීමනාව", descEn: "Get 20% off on your Yearly Horoscope", descSi: "වාර්ෂික පලාඵල වාර්තාව සඳහා 20% ක වට්ටමක්", discount: "20% OFF", code: "ALUTH20" },
  { id: "2", titleEn: "Porondam Special", titleSi: "පොරොන්දම් පරීක්ෂාව", descEn: "Complete marriage matching report at discounted price", descSi: "පොරොන්දම් පරීක්ෂාව සඳහා විශේෂ වට්ටමක්", discount: "15% OFF", code: "VIVAHA15" },
  { id: "3", titleEn: "Vastu Checking", titleSi: "වාස්තු පරීක්ෂාව", descEn: "Get your home's vastu checked at flat rate", descSi: "ඔබේ නිවසේ වාස්තු දෝෂ පරීක්ෂාව සඳහා සුවිශේෂී වට්ටමක්", discount: "Rs. 1000 OFF", code: "VASTHU1K" },
];

export const CELEBRITIES = [
  { id: "1", nameEn: "Kumar Sangakkara", nameSi: "කුමාර් සංගක්කාර", signEn: "Scorpio", signSi: "වෘශ්චික", img: "https://ui-avatars.com/api/?name=KS&background=1a365d&color=fff" },
  { id: "2", nameEn: "Yohani De Silva", nameSi: "යොහානි ද සිල්වා", signEn: "Virgo", signSi: "කන්‍යා", img: "https://ui-avatars.com/api/?name=YD&background=d946ef&color=fff" },
  { id: "3", nameEn: "Bathiya Jayakody", nameSi: "භාතිය ජයකොඩි", signEn: "Aries", signSi: "මේෂ", img: "https://ui-avatars.com/api/?name=BJ&background=dc2626&color=fff" },
  { id: "4", nameEn: "Jacqueline Fernandez", nameSi: "ජැකලින් ෆර්නැන්ඩස්", signEn: "Leo", signSi: "සිංහ", img: "https://ui-avatars.com/api/?name=JF&background=047857&color=fff" },
];

export const TESTIMONIALS = [
  { id: "1", name: "අමල් පෙරේරා", location: "කොළඹ", rating: 5, reviewEn: "Very accurate predictions! Helped me a lot.", reviewSi: "ඉතා නිවැරදි අනාවැකි! මගේ අනාගත තීරණ වලට ගොඩක් උදව් වුණා. ස්තුතියි මෙත් ජ්‍යෝතිෂය." },
  { id: "2", name: "නයනා කුමාරි", location: "මහනුවර", rating: 5, reviewEn: "The marriage prediction was spot on.", reviewSi: "විවාහය ගැන කියපු දේවල් හරියටම හරිගියා. මට ගැළපෙනම කෙනා හොයාගන්න ලැබුණේ මේකෙන්." },
  { id: "3", name: "සුනිල් ශාන්ත", location: "ගාල්ල", rating: 4, reviewEn: "Good service and fast response.", reviewSi: "හොඳ සේවාවක්. පලාඵල වාර්තාව ඉක්මනින් ලැබුණා. හැමෝටම රෙකමන්ඩ් කරනවා." },
];
