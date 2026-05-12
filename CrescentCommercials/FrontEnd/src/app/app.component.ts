import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

type Lang = 'en'|'ta'|'hi';
type Theme = 'emerald'|'white'|'saffron'|'sapphire'|'obsidian'|'crimson'|'amethyst'|'ivory'|'pearl'|'sand'|'ocean'|'graphite'|'royal'|'fresh'|'orange'|'teal'|'slate';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {
  lang: Lang = 'en';
  theme: Theme = 'sand';
  whatsappNumber = '919999999999';
  currentView = 'home';

  showProductsMenu = false;
  showMobileMenu   = false;
  showLangMenu     = false;
  showThemeMenu    = false;

  waxCarouselIndex         = 0;
  fireCrackerCarouselIndex = 0;
  touchStartX = 0;
  touchStartY = 0;

  homeSlideIndex = 0;
  private homeSlideTimer: any;

  cartItems: { title: string; category: string; image: string; qty: number }[] = [];
  get cartCount() { return this.cartItems.reduce((s, i) => s + i.qty, 0); }

  showCartEmail  = false;
  cartEmailName  = '';
  cartEmailFrom  = '';

  contactName    = '';
  contactEmail   = '';
  contactMessage = '';

  homeSlideImages = [
    'assets/products/MasterImage.png',
  ];

  themes: { label: string; value: Theme; accent: string; sub: string }[] = [
    { label: 'Sand',          value: 'sand',    accent: '#b45309', sub: 'Golden Sand & Amber'   },
    { label: 'Saffron Indian', value: 'saffron', accent: '#f59e0b', sub: 'Warm Heritage Gold'   },
    { label: 'Ivory',         value: 'ivory',   accent: '#166534', sub: 'Warm Cream & Forest'   },
    { label: 'Pearl',         value: 'pearl',   accent: '#1d4ed8', sub: 'Arctic White & Blue'   },
    { label: 'Fresh Green',   value: 'fresh',   accent: '#22c55e', sub: 'Safe & Non-Toxic'      },
    { label: 'Slate Minimal', value: 'slate',   accent: '#64748b', sub: 'Minimal Corporate'     },
  ];

  languages: { label: string; value: Lang; flag: string; short: string }[] = [
    { label: 'English', value: 'en', flag: '🇬🇧', short: 'EN'  },
    { label: 'தமிழ்',   value: 'ta', flag: '🇮🇳', short: 'தமி' },
    { label: 'हिन्दी',  value: 'hi', flag: '🇮🇳', short: 'हि'  },
  ];

  get currentTheme() { return this.themes.find(t => t.value === this.theme) ?? this.themes[0]; }
  get currentLang()  { return this.languages.find(l => l.value === this.lang)!; }

  ngOnInit() {
    const savedTheme = localStorage.getItem('crescent-theme') as Theme | null;
    if (savedTheme && this.themes.some(t => t.value === savedTheme)) {
      this.theme = savedTheme;
    }
    if (this.homeSlideImages.length > 1) {
      this.homeSlideTimer = setInterval(() => {
        this.homeSlideIndex = (this.homeSlideIndex + 1) % this.homeSlideImages.length;
      }, 2800);
    }
  }

  ngOnDestroy() {
    clearInterval(this.homeSlideTimer);
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('crescent-theme', theme);
    this.showThemeMenu = false;
  }

  t: Record<Lang, any> = {
    en: {
      home: 'Home', products: 'Products', contact: 'Contact Us',
      badge: 'Manufacturing  •  Trading  •  Authentic Indian Products',
      companyName: 'Crescent Commercials',
      tagline: 'Trusted Manufacturing. Authentic Indian Products.',
      aboutTitle: 'Who We Are',
      aboutText: 'Crescent Commercials is a diversified business delivering premium-quality consumer and commercial products across multiple categories including Wax Polish, Fireworks, Spices & Masala Products, and Clothing. We focus on quality, customer satisfaction, customization, and long-lasting relationships with retailers, wholesalers, and end customers.',
      missionTitle: 'Our Mission',
      missionText: 'Our mission is to provide reliable, high-quality products that enhance everyday living while maintaining exceptional standards in manufacturing, packaging, and customer service.',
      businessTitle: 'Our Business Lines',
      comingSoon: 'Coming Soon',
      explore: 'Explore',
      whatsapp: 'Contact via WhatsApp',
      contactTitle: 'Contact Crescent Commercials',
      contactText: 'For dealership, wholesale enquiry, product pricing and bulk orders, contact us directly.',
      waxPolishMenu: 'Wax Polish',
      firecrackersMenu: 'Fire Crackers',
      spicesMenu: 'Spices & Masala',
      clothingMenu: 'Clothing',
      idealFor: 'Ideal For',
      keyFeatures: 'Key Features',
      addToCart: 'Add to Cart',
      inCart: 'In Cart',
      waxPolishPageTitle: 'Golden Horse Wax Products',
      taglines: [
        'Quality That Shines Across Every Product',
        'Trusted Products for Homes & Businesses',
        'Premium Products, Crafted for Everyday Excellence',
        'From Floors to Flavors – Quality You Can Trust',
      ],
    },
    ta: {
      home: 'முகப்பு', products: 'தயாரிப்புகள்', contact: 'தொடர்பு',
      badge: 'உற்பத்தி  •  வர்த்தகம்  •  இந்திய தயாரிப்புகள்',
      companyName: 'Crescent Commercials',
      tagline: 'நம்பகமான உற்பத்தி. அசல் இந்திய தயாரிப்புகள்.',
      aboutTitle: 'நாங்கள் யார்',
      aboutText: 'Crescent Commercials ஒரு பன்முக வணிக நிறுவனம். Wax Polish, பட்டாசுகள், மசாலா மற்றும் ஆடைகள் உட்பட பல பிரிவுகளில் உயர்தர தயாரிப்புகளை வழங்குகிறோம். தரம், வாடிக்கையாளர் திருப்தி மற்றும் நீடித்த உறவுகளில் கவனம் செலுத்துகிறோம்.',
      missionTitle: 'எங்கள் இலக்கு',
      missionText: 'உயர்தர தயாரிப்புகள் மூலம் அன்றாட வாழ்க்கையை மேம்படுத்துவதும், உற்பத்தி, பேக்கேஜிங் மற்றும் சேவையில் சிறந்த தரத்தை பராமரிப்பதும் எங்கள் இலக்கு.',
      businessTitle: 'எங்கள் வணிக பிரிவுகள்',
      comingSoon: 'விரைவில்',
      explore: 'ஆராய',
      whatsapp: 'WhatsApp தொடர்பு',
      contactTitle: 'Crescent Commercials தொடர்பு',
      contactText: 'டீலர்ஷிப், மொத்த விற்பனை, விலை மற்றும் bulk orders க்கு தொடர்பு கொள்ளுங்கள்.',
      waxPolishMenu: 'Wax Polish',
      firecrackersMenu: 'தீவெட்டி',
      spicesMenu: 'மசாலா',
      clothingMenu: 'ஆடைகள்',
      idealFor: 'பயன்பாடு',
      keyFeatures: 'முக்கிய அம்சங்கள்',
      addToCart: 'கார்ட்டில் சேர்',
      inCart: 'கார்ட்டில் உள்ளது',
      waxPolishPageTitle: 'கோல்டன் ஹார்ஸ் வேக்ஸ் தயாரிப்புகள்',
      taglines: [
        'ஒவ்வொரு தயாரிப்பிலும் ஒளிரும் தரம்',
        'வீடுகளுக்கும் வணிகங்களுக்கும் நம்பகமான தயாரிப்புகள்',
        'அன்றாட சிறப்புக்காக உயர்தர தயாரிப்புகள்',
        'தளங்களிலிருந்து சுவைகள் வரை – நம்பகமான தரம்',
      ],
    },
    hi: {
      home: 'होम', products: 'प्रोडक्ट्स', contact: 'संपर्क करें',
      badge: 'निर्माण  •  ट्रेडिंग  •  भारतीय उत्पाद',
      companyName: 'Crescent Commercials',
      tagline: 'विश्वसनीय निर्माण। असली भारतीय उत्पाद।',
      aboutTitle: 'हम कौन हैं',
      aboutText: 'Crescent Commercials एक विविधीकृत व्यवसाय है जो Wax Polish, आतिशबाजी, मसाले और कपड़े सहित कई श्रेणियों में उच्च-गुणवत्ता वाले उत्पाद प्रदान करता है। हम गुणवत्ता, ग्राहक संतुष्टि और दीर्घकालिक संबंधों पर ध्यान केंद्रित करते हैं।',
      missionTitle: 'हमारा मिशन',
      missionText: 'हमारा मिशन विश्वसनीय, उच्च-गुणवत्ता वाले उत्पाद प्रदान करना है जो रोजमर्रा की जिंदगी को बेहतर बनाएं और निर्माण, पैकेजिंग तथा ग्राहक सेवा में असाधारण मानक बनाए रखें।',
      businessTitle: 'हमारी व्यापार श्रृंखला',
      comingSoon: 'जल्द आ रहा है',
      explore: 'देखें',
      whatsapp: 'WhatsApp संपर्क',
      contactTitle: 'Crescent Commercials संपर्क',
      contactText: 'डीलरशिप, होलसेल, कीमत और bulk orders के लिए सीधे संपर्क करें।',
      waxPolishMenu: 'Wax Polish',
      firecrackersMenu: 'पटाखे',
      spicesMenu: 'मसाले',
      clothingMenu: 'कपड़े',
      idealFor: 'आदर्श उपयोग',
      keyFeatures: 'मुख्य विशेषताएँ',
      addToCart: 'कार्ट में डालें',
      inCart: 'कार्ट में है',
      waxPolishPageTitle: 'गोल्डन हॉर्स वैक्स उत्पाद',
      taglines: [
        'हर उत्पाद में चमकती गुणवत्ता',
        'घरों और व्यवसायों के लिए विश्वसनीय उत्पाद',
        'रोज़मर्रा की उत्कृष्टता के लिए प्रीमियम उत्पाद',
        'फर्श से स्वाद तक – भरोसेमंद गुणवत्ता',
      ],
    }
  };

  businessLines: { icon: string; name: Record<Lang,string>; desc: Record<Lang,string>; comingSoon: boolean; id: string }[] = [
    {
      icon: '🟡', id: 'wax-polish',
      name: { en: 'Golden Horse Wax', ta: 'Golden Horse Wax', hi: 'Golden Horse Wax' },
      desc: { en: 'Premium wax polish and floor care products trusted by homes and industries.', ta: 'தரமான வாக்ஸ் பாலிஷ் மற்றும் தளப்பாலிஷ் தயாரிப்புகள்.', hi: 'प्रीमियम वैक्स पॉलिश और फ्लोर केयर उत्पाद।' },
      comingSoon: false
    },
    {
      icon: '🎆', id: 'fire-crackers',
      name: { en: 'Golden Horse Fireworks', ta: 'Golden Horse பட்டாசு', hi: 'Golden Horse आतिशबाजी' },
      desc: { en: 'Festival fire crackers — sparklers, rockets, flower pots and gift boxes.', ta: 'திருவிழா பட்டாசுகள் — ஸ்பார்க்லர்கள், ராக்கெட்கள், பூப்பானைகள்.', hi: 'त्योहारी पटाखे — फुलझड़ी, रॉकेट, फूलझड़ी और गिफ्ट बॉक्स।' },
      comingSoon: true
    },
    {
      icon: '🌶️', id: 'spices',
      name: { en: 'Spices & Masala', ta: 'மசாலா & சாம்பார் பொடி', hi: 'मसाले & मसाला' },
      desc: { en: 'Authentic Indian spice blends and masala powders. Coming soon.', ta: 'அசல் இந்திய மசாலா கலவைகள். விரைவில்.', hi: 'असली भारतीय मसाला मिश्रण। जल्द आ रहा है।' },
      comingSoon: true
    },
    {
      icon: '🧥', id: 'clothing',
      name: { en: 'Clothing', ta: 'ஆடைகள்', hi: 'कपड़े' },
      desc: { en: 'Quality Indian clothing and everyday apparel. Coming soon.', ta: 'தரமான இந்திய ஆடைகள். விரைவில்.', hi: 'गुणवत्तापूर्ण भारतीय कपड़े। जल्द आ रहा है।' },
      comingSoon: true
    }
  ];

  waxImages = [
    'assets/products/golden-horse-wax-polish.png',
    'assets/products/golden-horse-wax-polish-2.png'
  ];

  waxCarouselItems: {
    title: Record<Lang,string>; tag: Record<Lang,string>; category: Record<Lang,string>;
    description: Record<Lang,string>; image: string;
    idealFor: Record<Lang,string[]>; detailedBenefits: Record<Lang,{title:string;desc:string}[]>;
    simpleBenefits: Record<Lang,string[]>; keyFeatures: Record<Lang,string[]>;
  }[] = [
    {
      title:       { en:'Golden Horse Wax Polish', ta:'கோல்டன் ஹார்ஸ் வேக்ஸ் பாலிஷ்', hi:'गोल्डन हॉर्स वैक्स पॉलिश' },
      tag:         { en:'Wax Polish', ta:'வேக்ஸ் பாலிஷ்', hi:'वैक्स पॉलिश' },
      category:    { en:'Wax Polish', ta:'வேக்ஸ் பாலிஷ்', hi:'वैक्स पॉलिश' },
      description: {
        en:'Golden Horse wax polish is formulated to enhance and protect a wide range of surfaces, including marble, granite, red oxide, and cement floors. Its superior blend provides a brilliant, long-lasting shine while safeguarding surfaces from wear and dullness.',
        ta:'கோல்டன் ஹார்ஸ் வேக்ஸ் பாலிஷ் பளிங்கு, கிரானைட், சிவப்பு ஆக்சைடு மற்றும் சிமெண்ட் தளங்கள் உட்பட பல்வேறு மேற்பரப்புகளை மேம்படுத்தவும் பாதுகாக்கவும் தயாரிக்கப்பட்டுள்ளது. அதன் சிறந்த கலவை நீடித்த பளபளப்பை வழங்குகிறது.',
        hi:'गोल्डन हॉर्स वैक्स पॉलिश मार्बल, ग्रेनाइट, रेड ऑक्साइड और सीमेंट फर्श सहित विभिन्न सतहों को बेहतर बनाने और सुरक्षित करने के लिए तैयार की गई है। इसका बेहतरीन मिश्रण शानदार, दीर्घकालिक चमक प्रदान करता है।'
      },
      image:'assets/products/WaxPolish.png',
      idealFor:{
        en:['Marble','Granite','Red Oxide','Cement Floors','Wood Furniture','Artificial Leather','Mould Release','Fibre Glass'],
        ta:['பளிங்கு','கிரானைட்','சிவப்பு ஆக்சைடு','சிமெண்ட் தளங்கள்','மர தளபாடங்கள்','செயற்கை தோல்','அச்சு வெளியீடு','ஃபைபர் கிளாஸ்'],
        hi:['मार्बल','ग्रेनाइट','रेड ऑक्साइड','सीमेंट फर्श','लकड़ी का फर्नीचर','कृत्रिम चमड़ा','मोल्ड रिलीज','फाइबर ग्लास']
      },
      detailedBenefits:{
        en:[{title:'Superior Shine',desc:'High-gloss finish that enhances the natural colour and texture of your floors.'},{title:'Long-Lasting Protection',desc:'Shields floors from scratches, scuffs, and stains with durability that lasts for months.'},{title:'Easy Application',desc:'Effortless application designed for anyone to achieve professional results.'}],
        ta:[{title:'உயர்தர பளபளப்பு',desc:'தளங்களின் இயற்கை நிறம் மற்றும் அமைப்பை மேம்படுத்தும் உயர் பளபளப்பு.'},{title:'நீடித்த பாதுகாப்பு',desc:'மாதக் கணக்கில் நீடிக்கும் திறனுடன் கீறல், தேய்மானம் மற்றும் கறைகளிலிருந்து பாதுகாக்கிறது.'},{title:'எளிமையான பயன்பாடு',desc:'யாரும் தொழில்முறை முடிவுகளை எளிதாக அடைய வடிவமைக்கப்பட்டது.'}],
        hi:[{title:'बेहतरीन चमक',desc:'आपके फर्श के प्राकृतिक रंग को निखारने वाली उच्च-ग्लॉस फिनिश।'},{title:'दीर्घकालिक सुरक्षा',desc:'महीनों तक खरोंच, दाग और घिसाव से फर्श को बचाता है।'},{title:'आसान उपयोग',desc:'कोई भी आसानी से पेशेवर परिणाम पा सके, इसके लिए तैयार किया गया।'}]
      },
      simpleBenefits:{ en:[], ta:[], hi:[] },
      keyFeatures:{ en:[], ta:[], hi:[] }
    },
    {
      title:       { en:'Liquid Floor Polish', ta:'திரவ தள பாலிஷ்', hi:'लिक्विड फ्लोर पॉलिश' },
      tag:         { en:'Wax Polish', ta:'வேக்ஸ் பாலிஷ்', hi:'वैक्स पॉलिश' },
      category:    { en:'Wax Polish', ta:'வேக்ஸ் பாலிஷ்', hi:'वैக्स पॉलिश' },
      description: {
        en:'Our Golden Horse Liquid Floor Polish is a ready-to-use formulation that cleans, protects, and enhances the natural beauty of floors. It provides a smooth, glossy finish while forming a protective layer against dust, stains, and scuff marks. Suitable for marble, granite, red oxide, cement, and mosaic surfaces.',
        ta:'எங்கள் கோல்டன் ஹார்ஸ் திரவ தள பாலிஷ் தளங்களை சுத்தம் செய்து, பாதுகாத்து, அவற்றின் இயற்கை அழகை மேம்படுத்தும் தயாரிப்பு. பளிங்கு, கிரானைட், சிவப்பு ஆக்சைடு, சிமெண்ட் மற்றும் மொசைக் மேற்பரப்புகளுக்கு ஏற்றது.',
        hi:'हमारी Golden Horse लिक्विड फ्लोर पॉलिश फर्श को साफ, सुरक्षित और सुंदर बनाने वाली तैयार फार्मूलेशन है। मार्बल, ग्रेनाइट, रेड ऑक्साइड, सीमेंट और मोज़ेक सतहों के लिए उपयुक्त।'
      },
      image:'assets/products/Cera%20Fluida.png',
      idealFor:{
        en:['Marble','Granite','Red Oxide','Cement','Mosaic'],
        ta:['பளிங்கு','கிரானைட்','சிவப்பு ஆக்சைடு','சிமெண்ட்','மொசைக்'],
        hi:['मार्बल','ग्रेनाइट','रेड ऑक्साइड','सीमेंट','मोज़ेक']
      },
      detailedBenefits:{
        en:[{title:'Quick-Drying',desc:'Quick-drying formula with lasting shine.'},{title:'Wear Protection',desc:'Forms a protective layer against wear and tear.'},{title:'Easy to Maintain',desc:'Easy to apply and maintain with minimal effort.'}],
        ta:[{title:'விரைவில் உலரும்',desc:'நீடித்த பளபளப்புடன் விரைவில் உலரும் தயாரிப்பு.'},{title:'தேய்மான பாதுகாப்பு',desc:'தேய்மானத்திற்கு எதிராக பாதுகாப்பு அடுக்கை உருவாக்குகிறது.'},{title:'எளிதான பராமரிப்பு',desc:'குறைந்த முயற்சியில் தடவி பராமரிக்க எளிதானது.'}],
        hi:[{title:'जल्दी सूखता है',desc:'स्थायी चमक के साथ जल्दी सूखने वाला फार्मूला।'},{title:'घिसाव से सुरक्षा',desc:'टूट-फूट से बचाने के लिए एक सुरक्षात्मक परत बनाता है।'},{title:'आसान रखरखाव',desc:'न्यूनतम प्रयास से आसानी से लगाया और बनाए रखा जा सकता है।'}]
      },
      simpleBenefits:{ en:[], ta:[], hi:[] },
      keyFeatures:{ en:[], ta:[], hi:[] }
    },
    {
      title:       { en:'Leather Cream – P1', ta:'லெதர் கிரீம் – P1', hi:'लेदर क्रीम – P1' },
      tag:         { en:'Conditioning Cream', ta:'கண்டிஷனிங் கிரீம்', hi:'कंडीशनिंग क्रीम' },
      category:    { en:'Creamora Premium Leather', ta:'கிரீமோரா பிரீமியம் லெதர்', hi:'क्रीमोरा प्रीमियम लेदर' },
      description: {
        en:'Our premium Leather Cream is a rich, non-greasy emulsion designed to condition and penetrate deep into the pores of your leather goods. It replenishes essential natural oils lost over time due to sun, heat, and dry air. Regular use prevents drying, cracking, and stiffening, keeping leather supple, soft, and strong.',
        ta:'எங்கள் உயர்தர லெதர் கிரீம் தோல் பொருட்களின் துளைகளுக்கு ஆழமாக ஊடுருவி சீராக்கும் வகையில் வடிவமைக்கப்பட்டது. வழக்கமான பயன்பாடு தோலை வறட்சி மற்றும் விரிசலில் இருந்து பாதுகாத்து மிருதுவாகவும் வலிமையாகவும் வைத்திருக்கும்.',
        hi:'हमारी प्रीमियम लेदर क्रीम चमड़े के छिद्रों में गहराई तक जाने और कंडीशनिंग करने के लिए डिज़ाइन की गई है। नियमित उपयोग से चमड़ा सूखने और टूटने से बचता है तथा मुलायम और मजबूत रहता है।'
      },
      image:'assets/products/Creamora_PremiumLeatherCream_1L%20P1_S.png',
      idealFor:{ en:[], ta:[], hi:[] },
      detailedBenefits:{ en:[], ta:[], hi:[] },
      simpleBenefits:{
        en:['Shoes','Luxury hand bags and wallets','Leather Sofas and Car interiors','Jackets, boots, and accessories that need softening','Antique and vintage leather items that are dry and fragile'],
        ta:['காலணிகள்','ஆடம்பர கைப்பைகள் மற்றும் பணப்பைகள்','லெதர் சோஃபாக்கள் மற்றும் கார் உள்புறங்கள்','மென்மை தேவைப்படும் ஜாக்கெட்டுகள், பூட்ஸ் மற்றும் துணை உபகரணங்கள்','வறண்ட மற்றும் நொறுங்கக்கூடிய பழங்கால லெதர் பொருட்கள்'],
        hi:['जूते','लग्जरी हैंडबैग और वॉलेट','लेदर सोफा और कार इंटीरियर','नरमी चाहने वाले जैकेट, बूट्स और एक्सेसरीज़','सूखे और नाज़ुक पुराने चमड़े के आइटम']
      },
      keyFeatures:{ en:[], ta:[], hi:[] }
    },
    {
      title:       { en:'Leather Cream – P1/S', ta:'லெதர் கிரீம் – P1/S', hi:'लेदर क्रीम – P1/S' },
      tag:         { en:'Shine & Colour', ta:'பளபளப்பு மற்றும் நிறம்', hi:'चमक और रंग' },
      category:    { en:'Creamora Premium Leather', ta:'கிரீமோரா பிரீமியம் லெதர்', hi:'क्रीमोरा प्रीमियम लेदर' },
      description: {
        en:"Our Leather Polish is expertly formulated to do more than just shine. It gently cleanses the surface, fills in minor scuffs, and restores faded colour with rich, pigmented agents. It creates a protective, glossy layer that enhances your leather's colour depth and provides a stunning, mirror-like finish that lasts.",
        ta:'எங்கள் லெதர் பாலிஷ் வெறும் பளபளப்பிற்கு அப்பால் செயல்படுகிறது. சிறு கீறல்களை சரிசெய்து, மங்கிய நிறத்தை மீட்டெடுத்து, நீடித்த கண்ணாடி போன்ற பளபளப்பை வழங்குகிறது.',
        hi:'हमारी लेदर पॉलिश सिर्फ चमक से ज़्यादा करती है। यह छोटी खरोंचें भरती है, फीके रंग को बहाल करती है और दीर्घकालिक दर्पण जैसी चमक प्रदान करती है।'
      },
      image:'assets/products/Creamora_PremiumLeatherCream_4L%20P1_S.png',
      idealFor:{ en:[], ta:[], hi:[] },
      detailedBenefits:{ en:[], ta:[], hi:[] },
      simpleBenefits:{
        en:['Dress shoes and formal footwear','Leather briefcases and luggage','Belts and furniture that needs a colour refresh','Any item where a beautiful shine is desired'],
        ta:['ஔபசாரிக் காலணிகள்','லெதர் பிரீஃப்கேஸ்கள் மற்றும் சாமான்கள்','நிற புதுப்பிப்பு தேவைப்படும் பெல்ட்கள் மற்றும் தளபாடங்கள்','அழகான பளபளப்பு விரும்பப்படும் எந்தவொரு பொருளும்'],
        hi:['फॉर्मल जूते और पादत्राण','लेदर ब्रीफकेस और लगेज','रंग की जरूरत वाले बेल्ट और फर्नीचर','कोई भी आइटम जहाँ सुंदर चमक चाहिए']
      },
      keyFeatures:{ en:[], ta:[], hi:[] }
    },
    {
      title:       { en:'Leather Polish – Solvent Based', ta:'லெதர் பாலிஷ் – சாலவென்ட் அடிப்படை', hi:'लेदर पॉलिश – सॉल्वेंट बेस्ड' },
      tag:         { en:'Solvent Based', ta:'சாலவென்ட் அடிப்படை', hi:'सॉल्वेंट बेस्ड' },
      category:    { en:'Creamora Premium Leather', ta:'கிரீமோரா பிரீமியம் லெதர்', hi:'क्रीमोरा प्रीमियम लेदर' },
      description: {
        en:'Premium blend of natural waxes and solvents that penetrates leather, restores colour, and delivers a long-lasting, high-gloss protective finish. Ideal for shoes, bags, belts, and all leather goods.',
        ta:'இயற்கை மெழுகு மற்றும் சாலவென்ட்களின் சிறந்த கலவை, தோலுக்குள் ஊடுருவி நிறத்தை மீட்டெடுத்து நீடித்த பாதுகாப்பை வழங்குகிறது. காலணிகள், பைகள், பெல்ட்கள் மற்றும் அனைத்து லெதர் பொருட்களுக்கும் ஏற்றது.',
        hi:'प्राकृतिक मोम और सॉल्वेंट का प्रीमियम मिश्रण जो चमड़े में प्रवेश करता है, रंग बहाल करता है और दीर्घकालिक सुरक्षा देता है। जूते, बैग, बेल्ट और सभी चमड़े के सामान के लिए आदर्श।'
      },
      image:'assets/products/Creamora_LeatherPolish_SolvenBased_1kg_Front.png',
      idealFor:{ en:[], ta:[], hi:[] },
      detailedBenefits:{ en:[], ta:[], hi:[] },
      simpleBenefits:{
        en:['Shine that Lasts, Protection that Cares','Revive. Protect. Shine','Deep Gloss, Strong Protection','For Leather that Lives Longer','The Professional Shine for Every Leather'],
        ta:['நீடித்த பளபளப்பு, அக்கறையான பாதுகாப்பு','புத்துயிர். பாதுகாப்பு. பளபளப்பு','ஆழமான பளபளப்பு, வலிமையான பாதுகாப்பு','நீண்ட ஆயுள் கொண்ட தோலுக்காக','ஒவ்வொரு தோலுக்கும் தொழில்முறை பளபளப்பு'],
        hi:['लंबे समय तक चमक, सुरक्षित देखभाल','पुनर्जीवित करें. सुरक्षित करें. चमकाएं','गहरी चमक, मजबूत सुरक्षा','लंबे समय तक चलने वाले चमड़े के लिए','हर चमड़े के लिए पेशेवर चमक']
      },
      keyFeatures:{ en:[], ta:[], hi:[] }
    },
    {
      title:       { en:'Leather Polish – Water Based', ta:'லெதர் பாலிஷ் – நீர் அடிப்படை', hi:'लेदर पॉलिश – वॉटर बेस्ड' },
      tag:         { en:'Water Based', ta:'நீர் அடிப்படை', hi:'वॉटर बेस्ड' },
      category:    { en:'Creamora Premium Leather', ta:'கிரீமோரா பிரீமியம் லெதர்', hi:'क्रीमोरा प्रीमियम लेदर' },
      description: {
        en:'Our Leather Polish Emulsion is a premium water-based formulation designed to restore, protect, and maintain the natural beauty of leather. Specially crafted for ease of use, it penetrates deeply into the surface, nourishing the leather while providing a lasting shine.',
        ta:'எங்கள் லெதர் பாலிஷ் எமல்ஷன் தோலை மீட்டெடுக்க, பாதுகாக்க மற்றும் அதன் இயற்கை அழகை பராமரிக்க வடிவமைக்கப்பட்ட உயர்தர நீர் அடிப்படை தயாரிப்பு. ஆழமாக ஊடுருவி தோலை ஊட்டமளிக்கும்.',
        hi:'हमारी लेदर पॉलिश एमल्शन चमड़े को बहाल करने, सुरक्षित करने और उसकी प्राकृतिक सुंदरता बनाए रखने के लिए तैयार की गई प्रीमियम जल-आधारित फार्मूलेशन है।'
      },
      image:'assets/products/Creamora_PremiumLeatherCream_4L_P1.png',
      idealFor:{ en:[], ta:[], hi:[] },
      detailedBenefits:{ en:[], ta:[], hi:[] },
      simpleBenefits:{
        en:['Leather footwear','Bags, wallets, and belts','Upholstery and sofas','Car interiors','Jackets and other premium leather articles'],
        ta:['லெதர் காலணிகள்','பைகள், பணப்பைகள் மற்றும் பெல்ட்கள்','அப்ஹோல்ஸ்டரி மற்றும் சோஃபாக்கள்','கார் உள்புறங்கள்','ஜாக்கெட்டுகள் மற்றும் பிற உயர்தர லெதர் பொருட்கள்'],
        hi:['लेदर फुटवेयर','बैग, वॉलेट और बेल्ट','अपहोल्स्ट्री और सोफे','कार इंटीरियर','जैकेट और अन्य प्रीमियम चमड़े के लेख']
      },
      keyFeatures:{
        en:['Gentle Care: Conditions leather without leaving greasy residues','Brilliant Shine: Restores natural lustre and enhances appearance','Protective Layer: Guards against dust, stains, and moisture','Easy to Apply: Smooth, uniform spreading with quick drying','Eco-Friendly: Water-based emulsion, safe for domestic use'],
        ta:['மென்மையான பராமரிப்பு: கிரீஸ் இல்லாமல் தோலை சீராக்குகிறது','அற்புதமான பளபளப்பு: இயற்கை பொலிவை மீட்டெடுக்கிறது','பாதுகாப்பு அடுக்கு: தூசி, கறை மற்றும் ஈரப்பதத்திலிருந்து பாதுகாக்கிறது','எளிதாக தடவலாம்: விரைவில் உலரும் சீரான தடவல்','சுற்றுச்சூழல் நட்பு: நீர் அடிப்படை, வீட்டு உபயோகத்திற்கு பாதுகாப்பானது'],
        hi:['कोमल देखभाल: चिकनाई के बिना चमड़े को कंडीशन करता है','शानदार चमक: प्राकृतिक चमक बहाल करता है','सुरक्षात्मक परत: धूल, दाग और नमी से बचाता है','लगाने में आसान: त्वरित सुखाने के साथ समान फैलाव','पर्यावरण के अनुकूल: जल-आधारित, घरेलू उपयोग के लिए सुरक्षित']
      }
    }
  ];

  fireCrackerItems: { title: string; icon: string; description: string; image: string }[] = [
    {
      title: 'Sparklers',
      icon: '✨',
      image: 'assets/products/fireworks/sparklers.png',
      description: 'Beautiful hand-held sparklers for all occasions. Safe and vibrant, perfect for children and adults to celebrate festivals together.'
    },
    {
      title: 'Flower Pots',
      icon: '🌸',
      image: 'assets/products/fireworks/flower-pots.png',
      description: 'Colourful flower pot crackers that bloom with a stunning fountain-style visual display of sparks and light. A festival favourite.'
    },
    {
      title: 'Ground Chakkars',
      icon: '🌀',
      image: 'assets/products/fireworks/ground-chakkars.png',
      description: 'Fast-spinning ground wheels that create mesmerising spiral effects in vivid colours for a lively celebration.'
    },
    {
      title: 'Rockets',
      icon: '🚀',
      image: 'assets/products/fireworks/rockets.png',
      description: 'High-flying rockets that soar into the sky and burst into brilliant colours. Thrilling for every celebration.'
    },
    {
      title: 'Gift Boxes',
      icon: '🎁',
      image: 'assets/products/fireworks/gift-boxes.png',
      description: 'Curated assorted gift boxes containing a variety of Golden Horse fire crackers. The perfect festival gift.'
    },
    {
      title: 'Aerial Shots',
      icon: '🎇',
      image: 'assets/products/fireworks/aerial-shots.png',
      description: 'Multi-shot aerial fireworks that deliver spectacular overhead bursts. Ideal for grand celebrations and events.'
    },
    {
      title: 'String Crackers',
      icon: '🎊',
      image: 'assets/products/fireworks/string-crackers.png',
      description: 'Traditional string crackers that deliver rapid succession pops and sparkling lights. Classic and festive.'
    }
  ];

  closeAllMenus() {
    this.showProductsMenu = false;
    this.showMobileMenu   = false;
    this.showLangMenu     = false;
    this.showThemeMenu    = false;
  }

  prevProduct(type: 'wax' | 'fire') {
    if (type === 'wax')
      this.waxCarouselIndex = this.waxCarouselIndex === 0 ? this.waxCarouselItems.length - 1 : this.waxCarouselIndex - 1;
    else
      this.fireCrackerCarouselIndex = this.fireCrackerCarouselIndex === 0 ? this.fireCrackerItems.length - 1 : this.fireCrackerCarouselIndex - 1;
  }

  nextProduct(type: 'wax' | 'fire') {
    if (type === 'wax')
      this.waxCarouselIndex = (this.waxCarouselIndex + 1) % this.waxCarouselItems.length;
    else
      this.fireCrackerCarouselIndex = (this.fireCrackerCarouselIndex + 1) % this.fireCrackerItems.length;
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  onTouchEnd(e: TouchEvent, type: 'wax' | 'fire') {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = e.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50)
      dx < 0 ? this.nextProduct(type) : this.prevProduct(type);
  }

  setView(view: string) {
    this.currentView = view;
    this.closeAllMenus();
    this.waxCarouselIndex = 0;
    this.fireCrackerCarouselIndex = 0;
    const el = document.getElementById('content-area');
    if (el) el.scrollTop = 0;
  }

  addToCart(title: string, category: string, image: string) {
    const existing = this.cartItems.find(i => i.title === title);
    if (existing) {
      existing.qty++;
    } else {
      this.cartItems.push({ title, category, image, qty: 1 });
    }
  }

  updateQty(title: string, delta: number) {
    const item = this.cartItems.find(i => i.title === title);
    if (!item) return;
    const next = item.qty + delta;
    if (next <= 0) this.removeFromCart(title);
    else item.qty = next;
  }

  removeFromCart(title: string) {
    this.cartItems = this.cartItems.filter(i => i.title !== title);
  }

  isInCart(title: string) {
    return this.cartItems.some(i => i.title === title);
  }

  cartQty(title: string) {
    return this.cartItems.find(i => i.title === title)?.qty ?? 0;
  }

  clearCart() {
    this.cartItems = [];
    this.showCartEmail = false;
  }

  buildCartEmailText() {
    const col = (s: string, w: number, right = false) => right ? s.padStart(w) : s.substring(0, w).padEnd(w);
    const sep  = '+----+--------------------------------+----------------------+-----+--------------+--------------+';
    const head = '| #  | Product                        | Category             | Qty | Unit Price   | Total        |';
    const rows = this.cartItems.map((item, idx) =>
      `| ${col(String(idx+1),2)} | ${col(item.title,30)} | ${col(item.category,20)} | ${col(String(item.qty),3,true)} | ${'TBD'.padStart(12)} | ${'TBD'.padStart(12)} |`
    );
    const foot = `|    |                                |                      |     | Grand Total  | ${'TBD'.padStart(12)} |`;
    const table = [sep, head, sep, ...rows, sep, foot, sep].join('\n');
    return [
      `Dear Crescent Commercials,`,
      ``,
      `I am interested in purchasing the following products.`,
      `Please share pricing and availability.`,
      ``,
      table,
      ``,
      `Name:  ${this.cartEmailName  || '—'}`,
      `Email: ${this.cartEmailFrom  || '—'}`,
      ``,
      `Thank you.`,
    ].join('\n');
  }

  cartWhatsappUrl() {
    if (!this.cartItems.length) return '#';
    const list = this.cartItems.map((item, idx) => `${idx + 1}. ${item.title} (${item.category}) × ${item.qty}`).join('\n');
    const msg = `Hello Crescent Commercials,\n\nI am interested in the following products:\n\n${list}\n\nPlease share pricing and availability.\n\nThank you.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }

  cartEmailUrl() {
    const subject = encodeURIComponent('Product Enquiry — Crescent Commercials');
    const body = encodeURIComponent(this.buildCartEmailText());
    return `mailto:cccproducts2017@gmail.com?subject=${subject}&body=${body}`;
  }

  contactWhatsappUrl() {
    const msg = `Hello Crescent Commercials,\n\nEnquiry from website:\n\nName: ${this.contactName}\nEmail: ${this.contactEmail}\n\nMessage:\n${this.contactMessage}\n\nThank you.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }

  contactEmailUrl() {
    const subject = encodeURIComponent('Enquiry — Crescent Commercials');
    const body = encodeURIComponent(`Name: ${this.contactName}\nEmail: ${this.contactEmail}\n\nMessage:\n${this.contactMessage}`);
    return `mailto:cccproducts2017@gmail.com?subject=${subject}&body=${body}`;
  }

  whatsappProductUrl(productTitle: string) {
    const msg = encodeURIComponent(`Hello Crescent Commercials, I am interested in "${productTitle}". Please share more details and pricing.`);
    return `https://wa.me/${this.whatsappNumber}?text=${msg}`;
  }

  whatsappUrl() {
    const msg = encodeURIComponent('Hello Crescent Commercials, I would like to know more about your products and dealership.');
    return `https://wa.me/${this.whatsappNumber}?text=${msg}`;
  }
}
