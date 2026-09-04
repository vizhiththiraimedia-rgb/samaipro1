"use client";





import { createContext, useContext, useEffect, useState } from "react";


import { SupportedLanguage, getLanguageFromCookie, LANGUAGES } from "@/lib/i18n";





interface LanguageContextType {


  language: SupportedLanguage;


  setLanguage: (lang: SupportedLanguage) => void;


  t: (key: string, values?: Record<string, string>) => string;


  dir: "ltr" | "rtl";


}





const translations: Partial<Record<SupportedLanguage, Record<string, string>>> = {


  en: {


    "app.name": "Methjothisa",


    "app.tagline": "The Complete Global Astrology Intelligence Platform",


    "nav.home": "Home",
    "section.astrologers": "Our Astrologers",
    "section.astrologersDesc": "Connect with our experienced astrologers for personalized astrological analysis and guidance.",

    "services.freeHoroscope": "Free Horoscope",
    "services.kundliMatching": "Kundli Matching",
    "services.careerHoroscope": "Career Horoscope",
    "services.marriagePredictions": "Marriage Predictions",
    "services.wealthHoroscope": "Wealth Horoscope",
    "services.healthHoroscope": "Health Horoscope",
    "services.numerology": "Numerology",
    "services.gemRecommendation": "Gem Recommendation",


    "nav.charts": "Charts",


    "nav.reports": "Reports",


    "nav.dashboard": "Dashboard",


    "nav.login": "Login",


    "nav.signup": "Sign Up",


    "hero.title": "Unlock Your Cosmic Destiny",


    "hero.subtitle": "AI-powered astrology with mathematically accurate Swiss Ephemeris calculations",


    "hero.cta": "Get Your Free Birth Chart",


    "form.name": "Full Name",


    "form.gender": "Gender",


    "form.dob": "Date of Birth",


    "form.birthTime": "Birth Time",


    "form.birthPlace": "Birth Place",


    "form.submit": "Generate Chart",


    "zodiac.check": "Check Your Horoscope",


    "zodiac.aries": "Aries",


    "zodiac.taurus": "Taurus",


    "zodiac.gemini": "Gemini",


    "zodiac.cancer": "Cancer",


    "zodiac.leo": "Leo",


    "zodiac.virgo": "Virgo",


    "zodiac.libra": "Libra",


    "zodiac.scorpio": "Scorpio",


    "zodiac.sagittarius": "Sagittarius",


    "zodiac.capricorn": "Capricorn",


    "zodiac.aquarius": "Aquarius",


    "zodiac.pisces": "Pisces",


    "section.freeHoroscope": "Get FREE Horoscope in 30 seconds",


    "section.services": "Our Astrology Services",


    "section.offers": "Seasonal Offers",


    "section.testimonials": "Testimonials From Renowned Astrologers",


    "section.vedicAstrology": "Vedic Astrology Predictions",


    "section.celebrityHoroscope": "Celebrity Horoscope",


    "section.remedies": "Astrology Remedies - Puja / Havan",


    "footer.rights": "All rights reserved",


    "footer.product": "Product",


    "footer.company": "Company",


    "footer.legal": "Legal",


    "footer.support": "Support",


    "footer.freeReports": "Free Reports",


    "footer.horoscopes": "Horoscopes",


    "footer.predictions": "Predictions",


    "footer.matching": "Matching",


    "footer.transits": "Transits",


    "footer.consultAstrologer": "Consult Astrologer",


    "footer.apps": "Apps & Software",


    "footer.blog": "Blog",


    "footer.contactUs": "Contact Us",


    "footer.aboutUs": "About Us",


    "footer.privacyPolicy": "Privacy Policy",


    "footer.termsOfService": "Terms of Service",


    "footer.cookiePolicy": "Cookie Policy",


    "footer.gdpr": "GDPR",


    "astrologer.experience": "Exp",


    "astrologer.consultNow": "Consult Now",


    "offer.buyNow": "Buy Now",


    "offer.originalPrice": "Original Price",


    "offer.discount": "OFF",


    "offer.pages": "Number of pages",


    "offer.languages": "Available Languages",


    "offer.deliveredAs": "Delivered as",


    "offer.pdfEmail": "PDF via E-mail/WhatsApp",


    "remedy.education": "Education",


    "remedy.business": "Business",


    "remedy.health": "Health",


    "remedy.marriage": "Marriage",


    "remedy.finance": "Finance",


    "remedy.happiness": "Happiness",


    "remedy.children": "Children",


    "remedy.wealth": "Wealth",


    "remedy.home": "Home",


    "remedy.career": "Career",


    "remedy.spiritual": "Spiritual Upliftment",


    "remedy.knowMore": "Know More",


    "celebrity.readMore": "Read More",


    "testimonial.readMore": "Read More",


    "form.language": "Language",


    "form.chartType": "Chart",


    "form.email": "Email",


    "form.phone": "Phone",


    "form.countryCode": "Country Code",


    "form.amPm": "AM/PM",


    "form.male": "Male",


    "form.female": "Female",


    "form.showHoroscope": "Show My Free Horoscope",


    "form.noCreditCard": "No credit card or signup required",


    "form.agreeTerms": "By choosing to continue, you agree to our Terms & Conditions and Privacy Policy",
    "nav.freeHoroscope": "Free Horoscope",
    "nav.kundliMatching": "Kundli Matching",
    "nav.services": "Services",
    "nav.consult": "Consult Astrologer",
    "menu.dailyHoroscope": "Daily Horoscope",
    "menu.weeklyHoroscope": "Weekly Horoscope",
    "menu.yearlyHoroscope": "Yearly Horoscope",
    "menu.careerHoroscope": "Career Horoscope",
    "menu.marriagePredictions": "Marriage Predictions",
    "menu.wealthHoroscope": "Wealth Horoscope",
    "menu.healthHoroscope": "Health Horoscope",
    "menu.numerology": "Numerology",
    "menu.gemstone": "Gem Recommendation",
    "hero.description": "Let astrology be the guiding light for you. Discover the hidden factors influencing your life and mould it better with personalised horoscope predictions.",
    "form.header": "Get FREE HOROSCOPE in 30 seconds.",
    "services.description": "From free horoscopes to premium reports, we offer comprehensive astrology solutions.",
    "horoscope.prediction.title": "Prediction",
    "horoscope.prediction.desc.daily": "Based on current planetary positions",
    "horoscope.prediction.desc.weekly": "Based on upcoming transits",
    "horoscope.prediction.desc.monthly": "Based on monthly solar alignments",
    "horoscope.prediction.desc.yearly": "Based on yearly planetary cycles",
    "horoscope.personality": "Personality",
    "horoscope.strengths": "Strengths",
    "horoscope.weaknesses": "Weaknesses",
    "horoscope.daily": "Daily",
    "horoscope.weekly": "Weekly",
    "horoscope.monthly": "Monthly",
    "horoscope.yearly": "Yearly",
    "form.nameGender": "Name & Gender",
    "form.birthDetails": "Birth Details",
    "form.date": "Date",
    "form.time": "Time",
    "form.place": "Place",
    "form.placeholderName": "Your name here",
    "form.placeholderPlace": "Start typing...",
    "form.submitFree": "Select language & get free horoscope ►►",

    "vedic.para1": "Astrological observations on life and character help you a lot. It lets you take maximum advantage of the favourable situations and prevent or lessen the adversities in life. The ancient science of astrology is far from being a myth or fallacy. When the approach is rational, studies are genuine and calculations are accurate, astrology brings out outstanding results, revealing details of various aspects of life.",

    "vedic.para2": "Methjothisa services are a fine blend of astrology and technology. Authentic Vedic Astrology is what we follow and we serve its essence using the latest technologies. Our software-generated horoscope reports are highly accurate. The solutions we provide are all based on our authentic research in Vedic Astrology.",

    "stats.customers": "Satisfied customers worldwide",

    "stats.languages": "Languages supported",

    "stats.research": "Years of research",


  },


  ta: {


    "app.name": "மேத்ஜோதிஷா",


    "app.tagline": "பூரண கionic globe ஜோதிட நுட்பத்தட்டம்",


    "nav.home": "முகப்பு",
    "services.freeHoroscope": "இலவச ஜாதகம்",
    "services.kundliMatching": "திருமண பொருத்தம்",
    "services.careerHoroscope": "தொழில் ஜாதகம்",
    "services.marriagePredictions": "திருமண கணிப்புகள்",
    "services.wealthHoroscope": "செல்வ ஜாதகம்",
    "services.healthHoroscope": "சுகாதார ஜாதகம்",
    "services.numerology": "எண் கணிதம்",
    "services.gemRecommendation": "ரத்தினக்கல் பரிந்துரை",


    "nav.charts": "வ {} விளக்கப்படங்கள்",


    "nav.reports": "அறிக்கைகள்",


    "nav.dashboard": "டாஷ்போர்டு",


    "nav.login": "உள்நுழை",


    "nav.signup": "பதிவு செய்",


    "hero.title": "உங்கள் கிரகிய வரலாற்றை கண்டறியவும்",


    "hero.subtitle": "அறிவியல் ரீதியாக சரியான சுவிஸ் எபிமரிஸ் கணக்கீடுகள்",


    "hero.cta": " உங்கள் இறப்பு வருவாய் காட்டி பெறுங்கள்",


    "form.name": "முழு பெயர்",


    "form.gender": "பாலினம்",


    "form.dob": "பிறந்த தேதி",


    "form.birthTime": "பிறந்த நேரம்",


    "form.birthPlace": "பிறந்த இடம்",


    "form.submit": "வ {} காட்டி உருவாக்கு",


    "footer.rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை",


    "zodiac.check": "உங்கள் ராசிபலன் சரிபார்க்கவும்",


    "zodiac.aries": "மேஷம்",


    "zodiac.taurus": "ரிஷபம்",


    "zodiac.gemini": "மிதுனம்",


    "zodiac.cancer": "கடகம்",


    "zodiac.leo": "சிங்",


    "zodiac.virgo": "கன்னி",


    "zodiac.libra": "துலா",


    "zodiac.scorpio": "விருச்சிகம்",


    "zodiac.sagittarius": "தனுசு",


    "zodiac.capricorn": "மகரம்",


    "zodiac.aquarius": "கும்பம்",


    "zodiac.pisces": "மீனம்",


    "section.freeHoroscope": "30 விநாடிகளில் இலவச ராசிபலன் பெறுங்கள்",


    "section.services": "எங்கள் ஜோதிட சேவைகள்",


    "section.astrologers": "ஜோதிடரை அணுகவும்",


    "section.offers": "பருவ Vadai offers",


    "section.testimonials": "பெயரplinied ஜோதிடர்களிலிருந்து வி�idenciaகள்",


    "section.vedicAstrology": "வேத ஜோதிட முன்னோட்டங்கள்",


    "section.celebrityHoroscope": "பிரபஞ்சமானவர்களின் ராசிபலன்",


    "section.remedies": "ஜோதிட திருத்தங்கள் - பூஜை / ஹவன்",


    "form.language": "மொழி",


    "form.chartType": "விளக்கப்படம்",


    "form.email": "மின்னஞ்சல்",


    "form.phone": "தொலைபேசி",


    "form.countryCode": "நாட்டுக் குறியீடு",


    "form.amPm": "AM/PM",


    "form.male": "ஆண்",


    "form.female": "பெண்",


    "form.showHoroscope": "எனது இலவச ராசிபலன் காட்டு",


    "form.noCreditCard": "கடன் அட்டை அல்லது பதிவு தேவையில்லை",


    "form.agreeTerms": "தொடர்வதன் மூலம், எங்கள் விதிமுற்றுகள் மற்றும் தனியுரிமைக் கொள்கைகளை ஏற்றத表妹 நீங்கள் ஒப்புக்கொள்கிறீர்கள்",


    "astrologer.experience": "அனுபவம்",


    "astrologer.consultNow": "இப்போது அணுகவும்",


    "offer.buyNow": "இப்போது வாங்கவும்",


    "offer.originalPrice": "மூல விலை",


    "offer.discount": "OFF",


    "offer.pages": "பக்கங்களின் எண்ணிக்கை",


    "offer.languages": " usable மொழிகள்",


    "offer.deliveredAs": "வழங்கப்படும் வகை",


    "offer.pdfEmail": "PDF மின்னஞ்சல்/WhatsApp வழி",


    "remedy.education": "கல்வி",


    "remedy.business": "வியாபாரம்",


    "remedy.health": "ஆரோக்கியம்",


    "remedy.marriage": "திருமணம்",


    "remedy.finance": "நிதி",


    "remedy.happiness": "மகிழ்ச்சி",


    "remedy.children": "குழந்தைகள்",


    "remedy.wealth": "செல்வம்",


    "remedy.home": "வீடு",


    "remedy.career": "வேலை",


    "remedy.spiritual": "ஆன்மீக உயர்வு",


    "remedy.knowMore": "மேலும் அறியவும்",


    "celebrity.readMore": "மேலும் படிக்கவும்",


    "testimonial.readMore": "மேலும் படிக்கவும்",


    "footer.product": "தயாரிப்பு",


    "footer.company": "நிறுவனம்",


    "footer.legal": "சட்ட",


    "footer.support": " ஆதரவு",


    "footer.freeReports": "இலவச அறிக்கைகள்",


    "footer.horoscopes": "ராசிபலன்கள்",


    "footer.predictions": "முன்னோட்டங்கள்",


    "footer.matching": "பட்டியல்",


    "footer.transits": "க{$} டர்கள்",


    "footer.consultAstrologer": "ஜோதிடரை அணுகவும்",


    "footer.apps": "பயன்பாடுகள் மற்றும் மொழிகள்",


    "footer.blog": "ப்ளாக்",


    "footer.contactUs": "எங்களை தொடர்பு காட்டவும்",


    "footer.aboutUs": "எங்களை பற்றி",


    "footer.privacyPolicy": "தனியுரிமைக் கொள்கை",


    "footer.termsOfService": "பணி விதிமுற்றுகள்",


    "footer.cookiePolicy": "குக்கி க Xu Jing",


    "footer.gdpr": "GDPR",


  },


  si: {

    "menu.dailyHoroscope": "දෛනික පලාඵල",
    "menu.weeklyHoroscope": "සතිපතා පලාඵල",
    "menu.yearlyHoroscope": "වාර්ෂික පලාඵල",
    "menu.careerHoroscope": "වෘත්තීය පලාඵල",
    "menu.marriagePredictions": "විවාහ අනාවැකි",
    "menu.wealthHoroscope": "ධන පලාඵල",
    "menu.healthHoroscope": "සෞඛ්‍ය පලාඵල",
    "menu.numerology": "සංඛ්‍යා ශාස්ත්‍රය",
    "menu.gemstone": "මැණික් නිර්දේශය",
    "nav.consult": "සේවාවන්",
    "nav.services": "සේවාවන්",


    "app.name": "මෙත් ජ්‍යෝතිෂය",


    "app.tagline": "ලොව ප්‍රමුඛතම ගෝලීය ජ්‍යෝතිෂ තොරතුරු පද්ධතිය",


    "nav.home": "මුල් පිටුව",
    "services.freeHoroscope": "නොමිලේ පලාඵල",
    "services.kundliMatching": "පොරොන්දම් ගැලපීම",
    "services.careerHoroscope": "රැකියා පලාඵල",
    "services.marriagePredictions": "විවාහ අනාවැකි",
    "services.wealthHoroscope": "ධන යෝග",
    "services.healthHoroscope": "සෞඛ්‍ය පලාඵල",
    "services.numerology": "සංඛ්‍යා විද්‍යාව",
    "services.gemRecommendation": "මැණික් නිර්දේශය",


    "nav.charts": "කේන්ද්‍ර සටහන්",


    "nav.reports": "විශ්ලේෂණ වාර්තා",


    "nav.dashboard": "පාලක පුවරුව",


    "nav.login": "පිවිසෙන්න",


    "nav.signup": "ලියාපදිංචි වන්න",


    "hero.title": "ඔබේ විශ්වීය ඉරණම අනාවරණය කරගන්න",


    "hero.subtitle": "ස්විස් එෆෙමරිස් ගණනය කිරීම් සහ AI තාක්ෂණයෙන් ක්‍රියාත්මක වන නිවැරදි ජ්‍යෝතිෂය",


    "hero.cta": "නොමිලේ ජන්ම පත්‍රය ලබාගන්න",


    "form.name": "සම්පූර්ණ නම",


    "form.gender": "ස්ත්‍රී පුරුෂ භාවය",


    "form.dob": "උපන් දිනය",


    "form.birthTime": "උපන් වේලාව",


    "form.birthPlace": "උපන් ස්ථානය",


    "form.submit": "කේන්ද්‍රය සකසන්න",


    "footer.rights": "සියලුම හිමිකම් ඇවිරිණි",


    "zodiac.check": "ඔබේ ලග්න පලාඵල පරීක්ෂා කරන්න",


    "zodiac.aries": "මේෂ",


    "zodiac.taurus": "වෘෂභ",


    "zodiac.gemini": "මිථුන",


    "zodiac.cancer": "කටක",


    "zodiac.leo": "සිංහ",


    "zodiac.virgo": "කන්‍යා",


    "zodiac.libra": "තුලා",


    "zodiac.scorpio": "වෘශ්චික",


    "zodiac.sagittarius": "ධනු",


    "zodiac.capricorn": "මකර",


    "zodiac.aquarius": "කුම්භ",


    "zodiac.pisces": "මීන",


    "section.freeHoroscope": "තත්පර 30 කින් නොමිලේ ලග්න පලාඵල ලබාගන්න",


    "section.services": "අපගේ ජ්‍යෝතිෂ සේවාවන්",


        "section.astrologers": "අපගේ ජ්‍යෝතිෂවේදීන්",
    "section.astrologersDesc": "ඔබටම විශේෂ වු ජ්‍යෝතිෂ්‍ය විග්‍රහයන් සහ මඟ පෙන්වීම් සඳහා අපගේ පළපුරුදු ජ්‍යෝතිෂ්‍යවේදීන් සමඟ සම්බන්ධ වන්න.",



    "section.offers": "විශේෂ වට්ටම් සහ දීමනා",


    "section.testimonials": "ජ්‍යෝතිෂවේදීන්ගේ සහ ගනුදෙනුකරුවන්ගේ අදහස්",


    "section.vedicAstrology": "වෛදික ජ්‍යෝතිෂ අනාවැකි",


    "section.celebrityHoroscope": "ප්‍රසිද්ධ පුද්ගලයින්ගේ කේන්ද්‍ර සටහන්",


    "section.remedies": "ජ්‍යෝතිෂ ප්‍රතිකර්ම - පූජා සහ හවන්",


    "form.language": "භාෂාව",


    "form.chartType": "කේන්ද්‍ර සටහන් ක්‍රමය",


    "form.email": "විද්‍යුත් තැපෑල (Email)",


    "form.phone": "දුරකථන අංකය",


    "form.countryCode": "රටේ කේතය",


    "form.amPm": "පෙ.ව. / ප.ව.",


    "form.male": "පුරුෂ",


    "form.female": "ස්ත්‍රී",


    "form.showHoroscope": "මගේ නොමිලේ පලාඵල පෙන්වන්න",


    "form.noCreditCard": "ක්‍රෙඩිට් කාඩ්පත් හෝ ලියාපදිංචි වීම් අවශ්‍ය නොවේ",


    "form.agreeTerms": "ඉදිරියට යාමෙන් ඔබ අපගේ සේවා නියමයන් සහ රහස්‍යතා ප්‍රතිපත්තියට එකඟ වේ",
    "nav.freeHoroscope": "නොමිලේ පලාඵල",
    "nav.kundliMatching": "පොරොන්දම් ගැලපීම",
    "hero.description": "ජ්‍යෝතිෂය ඔබේ ජීවිතයට මඟ පෙන්වන ආලෝකය වීමට ඉඩ හරින්න. ඔබේ ජීවිතයට බලපාන සැඟවුණු කරුණු සොයාගෙන පුද්ගලීකරණය කළ පලාඵල අනාවැකි සමඟ එය වඩාත් යහපත් ලෙස හැඩගස්වා ගන්න.",
    "form.header": "තත්පර 30කින් නොමිලේ ලග්න පලාඵල වාර්තාව ලබාගන්න.",
    "services.description": "නොමිලේ ලබා දෙන පලාඵල විස්තරවල සිට වෘත්තීය මට්ටමේ වාරික වාර්තා දක්වා, අපි ඔබට අවශ්‍ය සියලුම ජ්‍යෝතිෂ විසඳුම් ලබා දෙන්නෙමු.",
    "horoscope.prediction.title": "අනාවැකිය",
    "horoscope.prediction.desc.daily": "පවතින ග්‍රහ පිහිටීම් අනුව",
    "horoscope.prediction.desc.weekly": "ඉදිරි ග්‍රහ ගෝචරයන් පදනම් කොට",
    "horoscope.prediction.desc.monthly": "පවතින මාසික සූර්ය සංක්‍රමණයන් අනුව",
    "horoscope.prediction.desc.yearly": "වාර්ෂික ග්‍රහ චක්‍රයන් පදනම් කොට",
    "horoscope.personality": "පෞරුෂය සහ ගතිලක්ෂණ",
    "horoscope.strengths": "ශක්තීන්",
    "horoscope.weaknesses": "දුර්වලතා",
    "horoscope.daily": "දෛනික",
    "horoscope.weekly": "සතිපතා",
    "horoscope.monthly": "මාසික",
    "horoscope.yearly": "වාර්ෂික",
    "form.nameGender": "නම සහ ස්ත්‍රී/පුරුෂ භාවය",
    "form.birthDetails": "උපත් විස්තර",
    "form.date": "දිනය",
    "form.time": "වේලාව",
    "form.place": "ස්ථානය",
    "form.placeholderName": "ඔබගේ නම මෙතැනට",
    "form.placeholderPlace": "ලිවීම අරඹන්න...",
    "form.submitFree": "භාෂාව තෝරා නොමිලේ පලාඵල ලබාගන්න ►►",

    "vedic.para1": "ජීවිතය සහ චරිත ස්වභාවය පිළිබඳ ජ්‍යෝතිෂ නිරීක්ෂණ ඔබට බෙහෙවින් උපකාරී වේ. එමඟින් ජීවිතයේ වාසිදායක අවස්ථාවන්ගෙන් උපරිම ප්‍රයෝජන ගැනීමටත්, අහිතකර බලපෑම් වළක්වා ගැනීමට හෝ අවම කර ගැනීමටත් ඔබට මඟ පෙන්වයි. ජ්‍යෝතිෂය නමැති මෙම අතීත විද්‍යාව මිථ්‍යාවක් හෝ මුලාවක් නොවේ. තාර්කික ප්‍රවේශයක්, අවංක අධ්‍යයනයක් සහ නිවැරදි ගණනය කිරීම් ඔස්සේ ජ්‍යෝතිෂය මඟින් ජීවිතයේ විවිධ පැතිකඩයන් පිළිබඳ පැහැදිලි තොරතුරු අනාවරණය කරමින් විශිෂ්ට ප්‍රතිඵල ලබා දෙයි.",

    "vedic.para2": "මෙත් ජ්‍යෝතිෂ සේවාවන් යනු ජ්‍යෝතිෂයේ සහ නවීන තාක්ෂණයේ අපූරු එකතුවකි. අප අනුගමනය කරනු ලබන්නේ සත්‍ය වෛදික ජ්‍යෝතිෂය වන අතර, එහි සාරය නවීනතම තාක්ෂණය උපයෝගී කරගනිමින් අපි ඔබට සමීප කරවන්නෙමු. අපගේ මෘදුකාංග මඟින් ජනනය කරන කේන්ද්‍ර සටහන් සහ වාර්තා ඉතා නිවැරදි හා විශ්වසනීය වේ. අප ලබා දෙන සියලුම විසඳුම් වෛදික ජ්‍යෝතිෂය පිළිබඳ අපගේ පර්යේෂණ මත පදනම් වී ඇත.",

    "stats.customers": "ලොව පුරා තෘප්තිමත් පාරිභෝගිකයින්",

    "stats.languages": "භාෂා ගණනකට සහය දක්වයි",

    "stats.research": "වසර 35කට අධික පර්යේෂණ",


    "astrologer.experience": "අත්දැකීම්",


    "astrologer.consultNow": "දැන් උපදෙස් ලබාගන්න",


    "offer.buyNow": "දැන් මිලදී ගන්න",


    "offer.originalPrice": "මුල් මිල",


    "offer.discount": "වට්ටම",


    "offer.pages": "පිටු ගණන",


    "offer.languages": "භාෂාවන්",


    "offer.deliveredAs": "ලැබෙන ආකාරය",


    "offer.pdfEmail": "PDF (විද්‍යුත් තැපෑල හෝ WhatsApp හරහා)",


    "remedy.education": "අධ්‍යාපනය",


    "remedy.business": "ව්‍යාපාරික",


    "remedy.health": "සෞඛ්‍යය",


    "remedy.marriage": "විවාහය",


    "remedy.finance": "මූල්‍යමය",


    "remedy.happiness": "සතුට",


    "remedy.children": "දරුවන්",


    "remedy.wealth": "ධනය සහ සම්පත්",


    "remedy.home": "නිවස සහ දේපල",


    "remedy.career": "වෘත්තීය",


    "remedy.spiritual": "ආධ්‍යාත්මික දියුණුව",


    "remedy.knowMore": "තව දැනගන්න",


    "celebrity.readMore": "තව කියවන්න",


    "testimonial.readMore": "තව කියවන්න",


    "footer.product": "නිෂ්පාදන",


    "footer.company": "සමාගම",


    "footer.legal": "නීතිමය",


    "footer.support": "උපකාරක සේවාව",


    "footer.freeReports": "නොමිලේ වාර්තා",


    "footer.horoscopes": "පලාඵල",


    "footer.predictions": "අනාවැකි",


    "footer.matching": "පොරොන්දම් ගැලපීම",


    "footer.transits": "ග්‍රහ ගෝචරය",


    "footer.consultAstrologer": "ජ්‍යෝතිෂවේදීන් සම්බන්ධ කරගන්න",


    "footer.apps": "මෘදුකාංග සහ ඇප්ස්",


    "footer.blog": "ලිපි (Blog)",


    "footer.contactUs": "අප අමතන්න",


    "footer.aboutUs": "අප ගැන",


    "footer.privacyPolicy": "රහස්‍යතා ප්‍රතිපත්තිය",


    "footer.termsOfService": "සේවා නියමයන්",


    "footer.cookiePolicy": "කුකී ප්‍රතිපත්තිය",


    "footer.gdpr": "GDPR ආරක්ෂණ රීති",


  },


  hi: {


    "app.name": "मेथ्जोथिसा",


    "app.tagline": "विश्वगोरा ज्योतिष प्लेटफॉर्म",


    "nav.home": "होम",
    "services.freeHoroscope": "मुफ्त राशिफल",
    "services.kundliMatching": "कुंडली मिलान",
    "services.careerHoroscope": "करियर राशिफल",
    "services.marriagePredictions": "विवाह भविष्यवाणियां",
    "services.wealthHoroscope": "धन राशिफल",
    "services.healthHoroscope": "स्वास्थ्य राशिफल",
    "services.numerology": "अंक ज्योतिष",
    "services.gemRecommendation": "रत्न सिफारिश",


    "nav.charts": "चार्ट",


    "nav.reports": "रिपोर्ट्स",


    "nav.dashboard": "डैशबोर्ड",


    "nav.login": "लॉगिन",


    "nav.signup": "साइन अप",


    "hero.title": "अपना भाग्य खोजें",


    "hero.subtitle": "स्विस एफेमेरिस गणना के साथ AI-संचालित ज्योतिष",


    "hero.cta": "अपना मुफ्त जन्म चार्ट प्राप्त करें",


    "form.name": "पूरा नाम",


    "form.gender": "लिंग",


    "form.dob": "जन्म तिथि",


    "form.birthTime": "जन्म समय",


    "form.birthPlace": "जन्म स्थान",


    "form.submit": "चार्ट जनरेट करें",


    "footer.rights": "सर्वाधिकार सुरक्षित",


    "zodiac.check": "अपना राशिफल जांचें",


    "zodiac.aries": "मेष",


    "zodiac.taurus": "वृषभ",


    "zodiac.gemini": "मिथुन",


    "zodiac.cancer": "कर्क",


    "zodiac.leo": "सिंह",


    "zodiac.virgo": "कन्या",


    "zodiac.libra": "तुला",


    "zodiac.scorpio": "वृश्चिक",


    "zodiac.sagittarius": "धनु",


    "zodiac.capricorn": "मकर",


    "zodiac.aquarius": "कुंभ",


    "zodiac.pisces": "मीन",


    "section.freeHoroscope": "30 सेकंड में मुफ्त होरoscope प्राप्त करें",


    "section.services": "हमारी ज्योतिष सेवाएं",


    "section.astrologers": "ज्योतिषी से परामर्श लें",


    "section.offers": "मौसमी ऑफ़र",


    "section.testimonials": "प्रसिद्ध ज्योतिषियों की प्रशंसाएं",


    "section.vedicAstrology": "वैदिक ज्योतिष भविष्यवाणी",


    "section.celebrityHoroscope": "सेलेब्रिटी होरoscope",


    "section.remedies": "ज्योतिष उपचार - पूजा / हवन",


    "form.language": "भाषा",


    "form.chartType": "चार्ट",


    "form.email": "ईमेल",


    "form.phone": "फोन",


    "form.countryCode": "देश कोड",


    "form.amPm": "AM/PM",


    "form.male": "पुरुष",


    "form.female": "महिला",


    "form.showHoroscope": "मेरा मुफ्त होरoscope दिखाएं",


    "form.noCreditCard": "क्रेडिट कार्ड या साइनअप की आवश्यकता नहीं",


    "form.agreeTerms": "जारी रखते हुए, आप हमारे नियम और शर्तों और गोपनीयता नीति से सहमत हैं",


    "astrologer.experience": "अनुभव",


    "astrologer.consultNow": "अभी परामर्श लें",


    "offer.buyNow": "अभी खरीदें",


    "offer.originalPrice": "मूल मूल्य",


    "offer.discount": "OFF",


    "offer.pages": "पन्नों की संख्या",


    "offer.languages": "उपलब्ध भाषाएं",


    "offer.deliveredAs": "प्रसारित रूप",


    "offer.pdfEmail": "ईमेल/WhatsApp द्वारा PDF",


    "remedy.education": "शिक्षा",


    "remedy.business": "व्यापार",


    "remedy.health": "स्वास्थ्य",


    "remedy.marriage": "विवाह",


    "remedy.finance": "वित्त",


    "remedy.happiness": "खुशी",


    "remedy.children": "बच्चे",


    "remedy.wealth": "धन",


    "remedy.home": "घर",


    "remedy.career": "करियर",


    "remedy.spiritual": "आध्यात्मिक उन्नति",


    "remedy.knowMore": "और जानें",


    "celebrity.readMore": "और पढ़ें",


    "testimonial.readMore": "और पढ़ें",


    "footer.product": "उत्पाद",


    "footer.company": "कंपनी",


    "footer.legal": "कानूनी",


    "footer.support": "सहायता",


    "footer.freeReports": "नि:शुल्क रिपोर्ट",


    "footer.horoscopes": "होरoscope",


    "footer.predictions": "भविष्यवाणी",


    "footer.matching": "मैचिंग",


    "footer.transits": "ग्रह गति",


    "footer.consultAstrologer": "ज्योतिषी से परामर्श",


    "footer.apps": "ऐप और सॉफ्टवेयर",


    "footer.blog": "ब्लॉग",


    "footer.contactUs": "संपर्क करें",


    "footer.aboutUs": "हमारे बारे में",


    "footer.privacyPolicy": "गोपनीयता नीति",


    "footer.termsOfService": "सेवा की शर्तें",


    "footer.cookiePolicy": "कुकी नीति",


    "footer.gdpr": "GDPR",


  },


};





const LanguageContext = createContext<LanguageContextType | undefined>(undefined);





export function LanguageProvider({ children }: { children: React.ReactNode }) {


  const [language, setLanguageState] = useState<SupportedLanguage>("si");


  const [dbTranslations, setDbTranslations] = useState<any>({});


  


  useEffect(() => {


    fetch("/api/translations")


      .then(res => res.json())


      .then(result => {


        if (result.success && result.data) {


          setDbTranslations(result.data);


        }


      })


      .catch(console.error);


  }, []);





  useEffect(() => {


    const cookieLang = getLanguageFromCookie();


    if (cookieLang !== "si") {


      setLanguageState(cookieLang);


    }


  }, []);





  const dir = LANGUAGES.find((l) => l.code === language)?.code === "ar" ? "rtl" : "ltr";





  const setLanguage = (lang: SupportedLanguage) => {


    setLanguageState(lang);


    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000`;


  };





  const t = (key: string, values?: Record<string, string>): string => {


    let translation = translations[language]?.[key] || translations.en?.[key] || key;


    if (values) {


      Object.entries(values).forEach(([k, v]) => {


        translation = translation.replace(`{${k}}`, v);


      });


    }


    return translation;


  };





  return (


    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>


      {children}


    </LanguageContext.Provider>


  );


}





export const useLanguage = () => {


  const context = useContext(LanguageContext);


  if (!context) throw new Error("useLanguage must be used within LanguageProvider");


  return context;


};


