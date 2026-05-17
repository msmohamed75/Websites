import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Lang = 'en' | 'ta' | 'hi';
type Theme = 'luxury-dark' | 'modern-corporate' | 'premium-minimal' | 'black-grey' | 'corporate-sky' | 'corporate-mint' | 'corporate-slate';
type View = string;

type BreadcrumbItem = {
  label: string;
  view: View;
};

type LegalDocument = 'privacy' | 'terms';

type HomeContent = {
  eyebrow: string;
  title: string;
  intro: string;
  missionTitle: string;
  mission: string;
  topics: string[];
  image: string;
};

type MasterData = {
  bases: string[];
  baseTypes: string[];
  packs: string[];
  packSizes: string[];
};

type ProductCategory = {
  id: string;
  dbId?: number;
  title: string;
  subtitle: string;
  image: string;
  images?: string[];
  image360?: string;
  icon: string;
  color: string;
  soon?: boolean;
  features: string[];
  supportedBases?: string[];
  supportedTypes?: string[];
  supportedPacks?: string[];
};

type ProductPackage = {
  packageSize: string;
  price: string;
  images?: string[];
};

type CartItem = { title: string; category: string; image: string; qty: number; packageSize?: string; price?: string };

type CartBusinessGroup = {
  unit: ProductCategory | undefined;
  title: string;
  items: CartItem[];
  qty: number;
  total: number;
};

type WaxProduct = {
  id: string;
  title: string;
  businessUnitId?: string;
  category: string;
  subCategory?: string;
  price: string;
  offers?: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  base?: string;
  baseType?: string;
  pack?: string;
  features: string[];
  packageSizes?: string[];
  packagePrices?: ProductPackage[];
  description: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly apiBaseUrl = 'http://localhost:3021/api/content';
  readonly adminPath = '/admin';
  readonly storageKey = 'crescent-admin-content';
  private readonly maxImageDimension = 900;
  private readonly imageQuality = 0.76;
  private saveTimer?: ReturnType<typeof setTimeout>;
  waxSwipeStartX = 0;
  isAdminPage = false;
  adminTab: 'home' | 'business' | 'bases' | 'baseTypes' | 'packs' | 'packSizes' = 'business';
  adminSelection: 'business' | 'product' = 'business';
  businessTreeExpanded = true;
  productsTreeExpanded = true;
  adminSaveStatus = '';
  adminSaving = false;
  adminDirty = false;
  showUnsavedPrompt = false;
  adminStatusFading = false;
  private adminEditSnapshot = '';
  private adminEditSnapshotType: 'business' | 'product' | '' = '';
  private pendingAdminNavigation: (() => void) | null = null;
  private adminStatusTimer?: ReturnType<typeof setTimeout>;
  selectedBusinessUnitIndex = 0;
  selectedProductIndex = 0;
  lang: Lang = 'en';
  theme: Theme = 'black-grey';
  currentView: View = 'home';
  showMobileMenu = false;
  showThemeMenu = false;
  showLangMenu = false;
  showProductsMenu = false;
  productSlide = 0;
  selectedWaxCategory = 'All Products';
  selectedSort = 'Featured';
  productPage = 1;
  readonly productPageSize = 8;
  flippedProductById: Record<string, boolean> = {};
  packageQtyByKey: Record<string, number> = {};
  productDetailProduct?: WaxProduct;
  legalModalTitle = '';
  legalModalContent = '';
  previousViews: View[] = [];
  contactFontSize = '16px';
  contactTextColor = '#f8fff9';
  contactBold = false;
  contactItalic = false;
  previewImageUrl = '';
  supportPopupKey: 'supportedBases' | 'supportedTypes' | 'supportedPacks' | null = null;
  supportSearch: Record<'supportedBases' | 'supportedTypes' | 'supportedPacks', string> = {
    supportedBases: '',
    supportedTypes: '',
    supportedPacks: ''
  };

  contactName: string = '';
  contactEmail: string = '';
  contactMobile: string = '';
  contactMessage: string = '';

  homeContent: HomeContent = {
    eyebrow: 'Premium Quality Products',
    title: 'Who We Are',
    intro: 'Crescent Commercials is a diversified business delivering premium-quality consumer and commercial products across multiple categories including Wax Polish, Fireworks, Spices & Masala Products, and Clothing. We focus on quality, customer satisfaction, customization, and long-lasting relationships with retailers, wholesalers, and end customers.',
    missionTitle: 'Our Mission',
    mission: 'Our mission is to provide reliable, high-quality products that enhance everyday living while maintaining exceptional standards in manufacturing, packaging, and customer service.',
    topics: [
      'Quality That Shines Across Every Product',
      'Trusted Products for Homes & Businesses',
      'Premium Products, Crafted for Everyday Excellence',
      'From Floors to Flavors - Quality You Can Trust'
    ],
    image: 'assets/products/MasterImage.png'
  };

  masterData: MasterData = {
    bases: ['N/A', 'Wax', 'Acrylic', 'Polyurethane'],
    baseTypes: ['N/A', 'Solid', 'Liquid', 'Semi Solid'],
    packs: ['Direct', 'Small Bag', 'Medium Bag', 'Carton', 'Container'],
    packSizes: ['10', '50', '100', '1000', '10K']
  };

  cartItems: CartItem[] = [];
  get cartCount() { return this.cartItems.reduce((s, i) => s + i.qty, 0); }
  get cartTotal() { return this.cartItems.reduce((s, i) => s + (this.toPrice(i.price) * i.qty), 0); }
  selectedPackageByProduct: Record<string, string> = {};

  themes: { label: string; value: Theme; accent: string; sub: string }[] = [
    { label: 'Luxury Dark', value: 'luxury-dark', accent: '#f5a623', sub: 'Black, gold and premium glass' },
    { label: 'Modern Corporate', value: 'modern-corporate', accent: '#2f80ed', sub: 'Clean blue enterprise theme' },
    { label: 'Corporate Sky', value: 'corporate-sky', accent: '#0284c7', sub: 'Bright blue boardroom theme' },
    { label: 'Corporate Mint', value: 'corporate-mint', accent: '#059669', sub: 'Fresh green operations theme' },
    { label: 'Corporate Slate', value: 'corporate-slate', accent: '#475569', sub: 'Neutral executive light theme' },
    { label: 'Premium Minimal', value: 'premium-minimal', accent: '#b68d40', sub: 'Elegant ivory and gold theme' },
    { label: 'Black / Grey', value: 'black-grey', accent: '#9ca3af', sub: 'Graphite black and grey premium theme' }
  ];

  languages: { label: string; value: Lang; flag: string; short: string }[] = [
    { label: 'English', value: 'en', flag: '', short: 'EN' },
    { label: 'Tamil', value: 'ta', flag: '', short: 'TA' },
    { label: 'Hindi', value: 'hi', flag: '', short: 'HI' }
  ];

  get currentTheme() { return this.themes.find(t => t.value === this.theme) ?? this.themes[0]; }
  get currentLang() { return this.languages.find(l => l.value === this.lang) ?? this.languages[0]; }

  productCategories: ProductCategory[] = [
    {
      id: 'wax-polish',
      title: 'Wax Polish',
      subtitle: 'Premium quality wax polish for all surfaces. Extra shine, long lasting protection.',
      image: 'assets/products/MasterImage.png',
      icon: '[]',
      color: '#f5a623',
      features: ['Long Lasting Shine', 'Water Resistant', 'Premium Quality'],
      supportedBases: ['Wax', 'Acrylic', 'Polyurethane'],
      supportedTypes: ['Solid', 'Liquid', 'Semi Solid'],
      supportedPacks: ['Direct', 'Small Bag', 'Medium Bag', 'Carton', 'Container']
    },
    {
      id: 'fire-crackers',
      title: 'Fire Crackers',
      subtitle: 'Safe and high quality fireworks for all celebrations. Bright, safe, spectacular.',
      image: 'assets/products/fireworks/fireworks_product.png',
      icon: '*',
      color: '#ff375f',
      soon: true,
      features: ['Vibrant Colors', 'Safe & Certified', 'Eco Friendly']
    },
    {
      id: 'spices',
      title: 'Spices & Masala',
      subtitle: 'Pure and aromatic spices blended to perfection. Authentic taste, rich aroma.',
      image: 'assets/products/SpicesMasla/spices_product.png',
      icon: '*',
      color: '#22c55e',
      soon: true,
      features: ['100% Natural', 'Rich Aroma', 'No Preservatives']
    },
    {
      id: 'clothing',
      title: 'Clothing',
      subtitle: 'Comfortable and stylish clothing for all ages. Quality you can trust.',
      image: 'assets/products/clothing/Clothing_Product.png',
      icon: '*',
      color: '#2f80ed',
      soon: true,
      features: ['Premium Fabric', 'Comfort Fit', 'Trendy Designs']
    },
    {
      id: 'candles',
      title: 'Fragrance  Candles',
      subtitle: 'Perfect Candles, Fragrance Candles',
      image: 'assets/products/candles/Candles_Product.png',
      icon: 'o',
      color: '#a855f7',
      soon: true,
      features: ['Perfect Gifting', 'Premium Packaging', 'Custom Options']
    }
  ];

  waxCategories = [
    { name: 'All Products', count: 8, icon: '[]' },
    { name: 'Wax Polish', count: 2, icon: 'o' },
    { name: 'Floor Polish', count: 2, icon: '[]' },
    { name: 'Leather Cream', count: 2, icon: 'o' },
    { name: 'Leather Polish', count: 2, icon: 'o' }
  ];

  waxProducts: WaxProduct[] = [
    {
      id: 'golden-horse-wax-polish',
      title: 'Golden Horse Wax Polish',
      businessUnitId: 'wax-polish',
      category: 'Wax Polish',
      base: 'Wax',
      baseType: 'Solid',
      pack: 'Direct',
      price: 'Rs.120.00',
      image: 'assets/products/WaxPolish.png',
      description: 'Premium wax polish for marble, granite, red oxide, cement floors, wood furniture and artificial leather.',
      features: ['Superior Shine', 'Long-Lasting Protection', 'Easy Application']
      ,
      packageSizes: ['100g', '500g', '1000g', '100ml', '1000ml', '1L', '2L', '4L', '5L'],
      packagePrices: [
        { packageSize: '100g', price: 'Rs.120.00' },
        { packageSize: '500g', price: 'Rs.0.00' },
        { packageSize: '1000g', price: 'Rs.0.00' }
      ],
      images: ['assets/products/WaxPolish.png']
    },
    {
      id: 'golden-horse-wax-polish-2',
      title: 'Golden Horse Premium Wax Polish',
      businessUnitId: 'wax-polish',
      category: 'Wax Polish',
      price: 'Rs.130.00',
      image: 'assets/products/golden-horse-wax-polish.png',
      description: 'High gloss polish for everyday home and commercial use with a rich premium finish.',
      features: ['High Gloss', 'Surface Protection', 'Easy Buffing'],
      packageSizes: ['100g', '500g', '1000g']
    },
    {
      id: 'liquid-floor-polish',
      title: 'Liquid Floor Polish',
      businessUnitId: 'wax-polish',
      category: 'Floor Polish',
      price: 'Rs.180.00',
      image: 'assets/products/Cera%20Fluida.png',
      description: 'Ready-to-use liquid floor polish for marble, granite, red oxide, cement and mosaic surfaces.',
      features: ['Quick-Drying', 'Wear Protection', 'Easy Maintenance'],
      packageSizes: ['1L', '2L', '4L', '5L']
    },
    {
      id: 'wood-floor-polish',
      title: 'Wood Floor Polish',
      businessUnitId: 'wax-polish',
      category: 'Floor Polish',
      price: 'Rs.160.00',
      image: 'assets/products/Wood_FloorPolish.png',
      description: 'Special polish for wooden floors and furniture to restore rich shine and protection.',
      features: ['Wood Safe', 'Natural Shine', 'Protective Layer'],
      packageSizes: ['1L', '2L']
    },
    {
      id: 'leather-cream-p1',
      title: 'Creamora Leather Cream P1',
      businessUnitId: 'wax-polish',
      category: 'Leather Cream',
      price: 'Rs.220.00',
      image: 'assets/products/Creamora_PremiumLeatherCream_1L%20P1_S.png',
      description: 'Rich non-greasy leather cream that conditions leather and prevents drying, cracking and stiffening.',
      features: ['Deep Conditioning', 'Non-Greasy', 'Softens Leather'],
      packageSizes: ['4L', '6L']
    },
    {
      id: 'leather-cream-p1s',
      title: 'Creamora Leather Cream P1/S',
      businessUnitId: 'wax-polish',
      category: 'Leather Cream',
      price: 'Rs.260.00',
      image: 'assets/products/Creamora_PremiumLeatherCream_4L%20P1_S.png',
      description: 'Premium leather care cream for shoes, hand bags, wallets, sofas, interiors and accessories.',
      features: ['Colour Refresh', 'Smooth Finish', 'Premium Care'],
      packageSizes: ['4L', '6L']
    },
    {
      id: 'leather-polish-solvent',
      title: 'Leather Polish Solvent Based',
      businessUnitId: 'wax-polish',
      category: 'Leather Polish',
      price: 'Rs.240.00',
      image: 'assets/products/Creamora_LeatherPolish_SolvenBased_1kg_Front.png',
      description: 'Natural wax and solvent blend that restores colour and creates a high-gloss protective finish.',
      features: ['Deep Gloss', 'Strong Protection', 'Colour Restore'],
      packageSizes: ['1kg']
    },
    {
      id: 'leather-polish-water',
      title: 'Leather Polish Water Based',
      businessUnitId: 'wax-polish',
      category: 'Leather Polish',
      price: 'Rs.210.00',
      image: 'assets/products/Creamora_PremiumLeatherCream_4L_P1.png',
      description: 'Water-based emulsion designed to restore, protect and maintain the natural beauty of leather.',
      features: ['Eco Friendly', 'Quick Drying', 'Gentle Care'],
      packageSizes: ['4L']
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isAdminPage = window.location.pathname.replace(/\/$/, '') === this.adminPath;
    const savedTheme = localStorage.getItem('crescent-theme') as Theme | null;
    if (savedTheme && this.themes.some(t => t.value === savedTheme)) this.theme = savedTheme;
    this.loadAdminContent();
    this.captureAdminSnapshot();
    this.loadContentFromApi();
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('crescent-theme', theme);
    this.applyThemeClass();
    this.closeAllMenus();
  }

  setLang(lang: Lang) {
    this.lang = lang;
    this.closeAllMenus();
  }

  setView(view: View, trackHistory = true) {
    if (trackHistory && view !== this.currentView) {
      this.previousViews.push(this.currentView);
      if (this.previousViews.length > 12) this.previousViews.shift();
    }
    this.currentView = view;
    if (this.productCategories.some(p => p.id === view)) {
      this.selectedWaxCategory = 'All Products';
      this.productPage = 1;
    }
    this.closeAllMenus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    const previous = this.previousViews.pop() ?? 'home';
    this.setView(previous, false);
  }

  setAdminTab(tab: 'home' | 'business' | 'bases' | 'baseTypes' | 'packs' | 'packSizes'): void {
    if (this.adminTab === tab) return;
    this.runOrPromptAdminNavigation(() => {
      this.adminTab = tab;
      this.captureAdminSnapshot();
    });
  }

  private normalizeLegacyText(value: string): string {
    const replacements: [string, string][] = [
      ['\u00e2\u20ac\u00a2', ' - '],
      ['\u00e2\u2020\u2019', '->'],
      ['\u00e2\u20ac\u00b9', '<'],
      ['\u00e2\u20ac\u00ba', '>'],
      ['\u00e2\u2013\u00a3', '[]'],
      ['\u00e2\u2013\u00a6', '[]'],
      ['\u00e2\u2013\u00a4', '[]'],
      ['\u00e2\u2014\u2030', 'o'],
      ['\u00e2\u2014\u2018', 'o'],
      ['\u00e2\u2014\u2019', 'o'],
      ['\u00e2\u2014\u02c6', 'o'],
      ['\u00e2\u02dc\u02dc', '*'],
      ['\u00e2\u0153\u00a6', '*'],
      ['\u00e2\u0153\u201c', 'check'],
      ['\u00e2\u02dc\u00b0', 'Menu'],
      ['\u00e2\u2122\u00a1', 'heart'],
      ['\u00ef\u00bc\u2039', '+'],
      ['\u00e2\u201a\u00b9', 'Rs.'],
      ['\u00e2\u017e\u00a4', '->'],
      ['\u00e2\u02dc\u008f', 'Phone'],
      ['\u00e2\u0153\u2030', 'Email'],
      ['\u00e2\u0152\u02dc', '*'],
      ['\u00f0\u0178\u203a\u2019', 'Cart']
    ];
    return replacements.reduce((text, [from, to]) => text.split(from).join(to), value);
  }

  private normalizeLegacyContent<T>(value: T): T {
    if (typeof value === 'string') return this.normalizeLegacyText(value) as T;
    if (Array.isArray(value)) return value.map(item => this.normalizeLegacyContent(item)) as T;
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value as Record<string, unknown>)) {
        (value as Record<string, unknown>)[key] = this.normalizeLegacyContent((value as Record<string, unknown>)[key]);
      }
    }
    return value;
  }

  closeAllMenus() {
    this.showMobileMenu = false;
    this.showThemeMenu = false;
    this.showLangMenu = false;
    this.showProductsMenu = false;
  }

  nextProducts() {
    this.productSlide = Math.min(this.productSlide + 1, Math.max(0, this.productCategories.length - 4));
  }

  prevProducts() {
    this.productSlide = Math.max(this.productSlide - 1, 0);
  }

  get visibleProductCategories() {
    return this.productCategories.slice(this.productSlide, this.productSlide + 5);
  }

  get selectedBusinessUnit() {
    return this.productCategories[this.selectedBusinessUnitIndex] ?? this.productCategories[0];
  }

  get selectedProduct() {
    return this.waxProducts[this.selectedProductIndex] ?? this.waxProducts[0];
  }

  get selectedBusinessUnitProducts() {
    const unit = this.selectedBusinessUnit;
    return this.waxProducts.filter(p => p.businessUnitId === unit?.id || p.category === unit?.title);
  }

  private resolveBusinessUnitSlug(product: any): string | undefined {
    if (product.businessUnitSlug) return product.businessUnitSlug;
    const numericId = Number(product.businessUnitId);
    if (!Number.isFinite(numericId)) return undefined;
    return this.productCategories.find(unit => unit.dbId === numericId)?.id
      ?? this.productCategories[numericId - 1]?.id;
  }

  businessUnitForProduct(product: WaxProduct): ProductCategory | undefined {
    return this.productCategories.find(unit => unit.id === product.businessUnitId || unit.title === product.category);
  }

  supportedBasesForProduct(product: WaxProduct): string[] {
    const unit = this.businessUnitForProduct(product);
    return unit?.supportedBases?.length ? unit.supportedBases : this.masterData.bases;
  }

  supportedTypesForProduct(product: WaxProduct): string[] {
    const unit = this.businessUnitForProduct(product);
    return unit?.supportedTypes?.length ? unit.supportedTypes : this.masterData.baseTypes;
  }

  supportedPacksForProduct(product: WaxProduct): string[] {
    const unit = this.businessUnitForProduct(product);
    return unit?.supportedPacks?.length ? unit.supportedPacks : this.masterData.packs;
  }

  businessUnitProductCount(unit: ProductCategory): number {
    return this.waxProducts.filter(p => p.businessUnitId === unit.id || p.category === unit.title).length;
  }

  selectBusinessUnit(index: number): void {
    const wasSelectedBusinessUnit = this.selectedBusinessUnitIndex === index && this.adminSelection === 'business';
    const select = () => {
      this.selectedBusinessUnitIndex = index;
      this.adminSelection = 'business';
      this.productsTreeExpanded = wasSelectedBusinessUnit ? !this.productsTreeExpanded : true;
      this.captureAdminSnapshot();
    };
    if (wasSelectedBusinessUnit) select();
    else this.runOrPromptAdminNavigation(select);
  }

  toggleBusinessTree(): void {
    this.runOrPromptAdminNavigation(() => {
      this.adminTab = 'business';
      this.businessTreeExpanded = !this.businessTreeExpanded;
    });
  }

  toggleProductsTree(event: Event): void {
    event.stopPropagation();
    this.productsTreeExpanded = !this.productsTreeExpanded;
  }

  get currentMasterList(): string[] {
    if (this.adminTab === 'bases') return this.masterData.bases;
    if (this.adminTab === 'baseTypes') return this.masterData.baseTypes;
    if (this.adminTab === 'packs') return this.masterData.packs;
    if (this.adminTab === 'packSizes') return this.masterData.packSizes;
    return [];
  }

  get currentMasterTitle(): string {
    if (this.adminTab === 'bases') return 'Bases';
    if (this.adminTab === 'baseTypes') return 'Base Types';
    if (this.adminTab === 'packs') return 'Pack';
    if (this.adminTab === 'packSizes') return 'Pack Size';
    return '';
  }

  get currentBusinessUnit(): ProductCategory | undefined {
    return this.productCategories.find(p => p.id === this.currentView);
  }

  get businessUnitProducts(): WaxProduct[] {
    const unit = this.currentBusinessUnit;
    if (!unit) return [];
    return this.waxProducts.filter(p => p.businessUnitId === unit.id || p.category === unit.title);
  }

  get productCategoryFilters() {
    const counts = this.businessUnitProducts.reduce((map, product) => {
      const category = product.category || 'General';
      map.set(category, (map.get(category) ?? 0) + 1);
      return map;
    }, new Map<string, number>());
    return [
      { name: 'All Products', count: this.businessUnitProducts.length },
      ...Array.from(counts, ([name, count]) => ({ name, count }))
    ];
  }

  get productBusinessUnits() {
    return this.productCategories
      .map(unit => ({ ...unit, count: this.waxProducts.filter(p => p.businessUnitId === unit.id || p.category === unit.title).length }))
      .filter(unit => unit.count > 0);
  }

  get filteredWaxProducts() {
    const source = this.currentBusinessUnit ? this.businessUnitProducts : this.waxProducts;
    let list = this.selectedWaxCategory === 'All Products'
      ? source
      : source.filter(p => p.category === this.selectedWaxCategory);
    if (this.selectedSort === 'Name') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (this.selectedSort === 'Price Low') list = [...list].sort((a, b) => this.toPrice(a.price) - this.toPrice(b.price));
    return list;
  }

  get pagedWaxProducts(): WaxProduct[] {
    const start = (this.productPage - 1) * this.productPageSize;
    return this.filteredWaxProducts.slice(start, start + this.productPageSize);
  }

  get totalProductPages(): number {
    return Math.max(1, Math.ceil(this.filteredWaxProducts.length / this.productPageSize));
  }

  get productPages(): number[] {
    return Array.from({ length: this.totalProductPages }, (_, index) => index + 1);
  }

  setProductCategory(category: string): void {
    this.selectedWaxCategory = category;
    this.productPage = 1;
  }

  setProductBusinessUnit(unitId: string): void {
    this.setView(unitId);
  }

  setProductPage(page: number): void {
    this.productPage = Math.min(this.totalProductPages, Math.max(1, page));
  }

  get breadcrumbs(): BreadcrumbItem[] {
    if (this.currentView === 'home') return [];
    const items: BreadcrumbItem[] = [{ label: 'Home', view: 'home' }];
    if (this.currentView === 'products') return [...items, { label: 'Business Unit', view: 'products' }];
    if (this.currentView === 'contact') return [...items, { label: 'Contact Us', view: 'contact' }];
    if (this.currentView === 'cart') return [...items, { label: 'Cart', view: 'cart' }];
    const unit = this.productCategories.find(p => p.id === this.currentView);
    if (unit) return [...items, { label: 'Business Unit', view: 'products' }, { label: unit.title, view: unit.id }];
    return items;
  }

  get showProductListing(): boolean {
    return !!this.currentBusinessUnit && this.businessUnitProducts.length > 0;
  }

  toPrice(price?: string | null) { return Number((price ?? '').replace(/[^0-9.]/g, '')) || 0; }

  formatInr(price?: string | null): string {
    if (!price || !/[0-9]/.test(price)) return '';
    const amount = this.toPrice(price);
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 })}`;
  }

  formatPriceInr(price?: string | null): string {
    if (!price || !/[0-9]/.test(price)) return '';
    return this.formatInrAmount(this.toPrice(price));
  }

  formatInrAmount(amount: number): string {
    return `\u20b9${amount.toLocaleString('en-IN', { maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 })}`;
  }

  selectedPackage(product: WaxProduct): ProductPackage | undefined {
    const packages = product.packagePrices ?? [];
    if (!packages.length) return undefined;
    const selectedSize = this.selectedPackageByProduct[product.id] ?? packages[0].packageSize;
    return packages.find(item => item.packageSize === selectedSize) ?? packages[0];
  }

  productDisplayPrice(product: WaxProduct): string {
    return this.formatPriceInr(this.selectedPackage(product)?.price || product.price);
  }

  productDisplayImage(product: WaxProduct): string {
    return this.selectedPackage(product)?.images?.[0] || product.image;
  }

  toggleProductFlip(product: WaxProduct): void {
    this.flippedProductById[product.id] = !this.flippedProductById[product.id];
  }

  openProductDetails(product: WaxProduct): void {
    this.productDetailProduct = product;
  }

  closeProductDetails(): void {
    this.productDetailProduct = undefined;
  }

  setSelectedPackage(product: WaxProduct, packageInfo: ProductPackage): void {
    this.selectedPackageByProduct[product.id] = packageInfo.packageSize;
  }

  scrollPackageList(element: HTMLElement, direction: number): void {
    element.scrollBy({ top: direction * 54, behavior: 'smooth' });
  }

  packageQtyKey(product: WaxProduct, packageInfo?: ProductPackage): string {
    return `${product.id}::${packageInfo?.packageSize ?? 'default'}`;
  }

  packageQty(product: WaxProduct, packageInfo?: ProductPackage): number {
    return this.packageQtyByKey[this.packageQtyKey(product, packageInfo)] ?? 0;
  }

  changePackageQty(product: WaxProduct, packageInfo: ProductPackage | undefined, change: number): void {
    const key = this.packageQtyKey(product, packageInfo);
    if (packageInfo) this.setSelectedPackage(product, packageInfo);
    const nextQty = Math.max(0, this.packageQty(product, packageInfo) + change);
    this.packageQtyByKey[key] = nextQty;
    this.setCartPackageQty(product, packageInfo, nextQty);
  }

  addSelectedQtyToCart(product: WaxProduct): void {
    this.changePackageQty(product, this.selectedPackage(product), 1);
  }

  productCartQty(product: WaxProduct): number {
    return (product.packagePrices?.length ? product.packagePrices : [undefined])
      .reduce((sum, item) => sum + this.packageQty(product, item), 0);
  }

  productCartTotal(product: WaxProduct): number {
    return (product.packagePrices?.length ? product.packagePrices : [undefined])
      .reduce((sum, item) => sum + (this.packageQty(product, item) * this.toPrice(item?.price ?? product.price)), 0);
  }

  private cartTitle(product: WaxProduct, packageInfo?: ProductPackage): string {
    return packageInfo?.packageSize ? `${product.title} - ${packageInfo.packageSize}` : product.title;
  }

  setCartPackageQty(product: WaxProduct, packageInfo: ProductPackage | undefined, qty: number): void {
    const itemTitle = this.cartTitle(product, packageInfo);
    this.cartItems = this.cartItems.filter(i => i.title !== itemTitle);
    if (qty <= 0) return;
    this.cartItems.push({
      title: itemTitle,
      category: product.category,
      image: this.productDisplayImage(product),
      qty,
      packageSize: packageInfo?.packageSize,
      price: packageInfo?.price ?? product.price
    });
  }

  addToCart(product: WaxProduct | ProductCategory, qty = 1) {
    const packageInfo = 'category' in product ? this.selectedPackage(product) : undefined;
    const packageSize = packageInfo?.packageSize;
    const itemTitle = packageSize ? `${product.title} - ${packageSize}` : product.title;
    const existing = this.cartItems.find(i => i.title === itemTitle);
    if (existing) existing.qty += qty;
    else this.cartItems.push({
      title: itemTitle,
      category: 'category' in product ? product.category : product.title,
      image: 'category' in product ? this.productDisplayImage(product) : product.image,
      qty,
      packageSize,
      price: packageInfo?.price
    });
  }

  removeFromCart(title: string) {
    const item = this.cartItems.find(i => i.title === title);
    this.cartItems = this.cartItems.filter(i => i.title !== title);
    if (!item) return;
    const product = this.waxProducts.find(p => p.title === item.title || (item.packageSize && item.title === `${p.title} - ${item.packageSize}`));
    if (!product) return;
    const packageInfo = product.packagePrices?.find(p => p.packageSize === item.packageSize);
    this.packageQtyByKey[this.packageQtyKey(product, packageInfo)] = 0;
  }

  changeCartItemQty(item: CartItem, change: number): void {
    const nextQty = Math.max(0, item.qty + change);
    const product = this.findProductForCartItem(item);
    const packageInfo = product?.packagePrices?.find(p => p.packageSize === item.packageSize);
    if (nextQty <= 0) {
      this.removeFromCart(item.title);
      return;
    }
    item.qty = nextQty;
    if (product) this.packageQtyByKey[this.packageQtyKey(product, packageInfo)] = nextQty;
  }

  clearCart(): void {
    this.cartItems = [];
    this.packageQtyByKey = {};
  }

  private findProductForCartItem(item: CartItem): WaxProduct | undefined {
    return this.waxProducts.find(product =>
      product.title === item.title ||
      (item.packageSize && item.title === `${product.title} - ${item.packageSize}`)
    );
  }

  cartBusinessUnit(item: CartItem): ProductCategory | undefined {
    const product = this.findProductForCartItem(item);
    return product ? this.businessUnitForProduct(product) : this.productCategories.find(unit => unit.title === item.category);
  }

  get cartBusinessGroups(): CartBusinessGroup[] {
    const groups = new Map<string, CartBusinessGroup>();
    for (const item of this.cartItems) {
      const unit = this.cartBusinessUnit(item);
      const key = unit?.id ?? item.category ?? 'general';
      if (!groups.has(key)) groups.set(key, { unit, title: unit?.title ?? item.category ?? 'General', items: [], qty: 0, total: 0 });
      const group = groups.get(key)!;
      group.items.push(item);
      group.qty += item.qty;
      group.total += this.toPrice(item.price) * item.qty;
    }
    return Array.from(groups.values());
  }

  cartOrderText(): string {
    const lines = ['Crescent Commercials Cart Order', ''];
    for (const group of this.cartBusinessGroups) {
      lines.push(`${group.title} - ${group.qty} item(s) - ${this.formatInrAmount(group.total)}`);
      for (const item of group.items) {
        lines.push(`- ${item.title}: Qty ${item.qty}, ${this.formatInrAmount(this.toPrice(item.price) * item.qty)}`);
      }
      lines.push('');
    }
    lines.push(`Overall Total: ${this.formatInrAmount(this.cartTotal)}`);
    return lines.join('\n');
  }

  cartWhatsAppUrl(): string {
    return `https://wa.me/919092154605?text=${encodeURIComponent(this.cartOrderText())}`;
  }

  cartEmailUrl(): string {
    return `mailto:cccproducts2017@gmail.com?subject=${encodeURIComponent('Cart Order - Crescent Commercials')}&body=${encodeURIComponent(this.cartOrderText())}`;
  }

  openWhatsApp(product?: string) {
    const msg = encodeURIComponent(product ? `Hi, I need details for ${product}` : 'Hi, I need product details from Crescent Commercials.');
    return `https://wa.me/919092154605?text=${msg}`;
  }
  get currentProductCategory() {
    return this.productCategories.find(p => p.id === this.currentView);
  }

  get currentProductCategoryTitle(): string {
    return this.currentProductCategory?.title ?? '';
  }

  get currentProductCategorySubtitle(): string {
    return this.currentProductCategory?.subtitle ?? '';
  }


  contactMailUrl(): string {
    const subject = encodeURIComponent('Product Enquiry - Crescent Commercials');
    const body = encodeURIComponent(`Full Name: ${this.contactName || ''}\nEmail: ${this.contactEmail || ''}\nMobile: +91 ${this.contactMobile || ''}\n\nMessage:\n${this.contactMessage || ''}`);
    return `mailto:cccproducts2017@gmail.com?subject=${subject}&body=${body}`;
  }

  contactWhatsAppUrl(): string {
    const message = encodeURIComponent(`Hello Crescent Commercials,\n\nFull Name: ${this.contactName || ''}\nEmail: ${this.contactEmail || ''}\nMobile: +91 ${this.contactMobile || ''}\n\nMessage:\n${this.contactMessage || ''}`);
    return `https://wa.me/919092154605?text=${message}`;
  }

  openLegalModal(type: LegalDocument): void {
    this.legalModalTitle = type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions';
    const path = type === 'privacy' ? 'assets/legal/privacy-policy.html' : 'assets/legal/terms-conditions.html';
    this.http.get(path, { responseType: 'text' }).subscribe({
      next: content => this.legalModalContent = content,
      error: () => this.legalModalContent = '<p>Content will be updated soon.</p>'
    });
  }

  closeLegalModal(): void {
    this.legalModalTitle = '';
    this.legalModalContent = '';
  }

  addHomeTopic(): void {
    this.homeContent.topics.push('New topic');
    this.saveAdminContent();
  }

  removeHomeTopic(index: number): void {
    this.homeContent.topics.splice(index, 1);
    this.saveAdminContent();
  }

  addBusinessUnit(): void {
    this.runOrPromptAdminNavigation(() => {
      const id = `business-unit-${Date.now()}`;
      this.productCategories.push({
        id,
        title: 'New Business Unit',
        subtitle: 'Business unit description',
        image: 'assets/products/MasterImage.png',
        images: [],
        icon: '[]',
        color: '#d4af37',
        features: ['Feature one']
      });
      this.selectedBusinessUnitIndex = this.productCategories.length - 1;
      this.adminTab = 'business';
      this.adminSelection = 'business';
      this.captureAdminSnapshot();
      this.saveAdminContent();
    });
  }

  deleteBusinessUnit(index: number): void {
    if (this.productCategories.length <= 1) return;
    this.productCategories.splice(index, 1);
    this.selectedBusinessUnitIndex = Math.max(0, index - 1);
    this.saveAdminContent();
  }

  addBusinessFeature(unit: ProductCategory): void {
    unit.features.push('New feature');
    this.saveAdminContent();
  }

  toggleUnitMasterValue(unit: ProductCategory, key: 'supportedBases' | 'supportedTypes' | 'supportedPacks', value: string): void {
    unit[key] = unit[key] ?? [];
    const list = unit[key]!;
    const index = list.indexOf(value);
    if (index >= 0) list.splice(index, 1);
    else list.push(value);
    this.saveAdminContent();
  }

  openSupportPopup(key: 'supportedBases' | 'supportedTypes' | 'supportedPacks'): void {
    this.supportPopupKey = key;
  }

  closeSupportPopup(): void {
    this.supportPopupKey = null;
  }

  supportPopupTitle(): string {
    if (this.supportPopupKey === 'supportedBases') return 'Supported Base';
    if (this.supportPopupKey === 'supportedTypes') return 'Supported Types';
    if (this.supportPopupKey === 'supportedPacks') return 'Supported Pack';
    return '';
  }

  supportMasterList(key: 'supportedBases' | 'supportedTypes' | 'supportedPacks'): string[] {
    if (key === 'supportedBases') return this.masterData.bases;
    if (key === 'supportedTypes') return this.masterData.baseTypes;
    return this.masterData.packs;
  }

  filteredSupportValues(key: 'supportedBases' | 'supportedTypes' | 'supportedPacks'): string[] {
    const term = this.supportSearch[key].trim().toLowerCase();
    const selected = this.selectedBusinessUnit?.[key] ?? [];
    const values = selected.length ? selected : [];
    return term ? values.filter(item => item.toLowerCase().includes(term)) : values;
  }

  filteredSupportPopupValues(): string[] {
    if (!this.supportPopupKey) return [];
    const term = this.supportSearch[this.supportPopupKey].trim().toLowerCase();
    const values = this.supportMasterList(this.supportPopupKey);
    return term ? values.filter(item => item.toLowerCase().includes(term)) : values;
  }

  clearSupportSearch(key: 'supportedBases' | 'supportedTypes' | 'supportedPacks'): void {
    this.supportSearch[key] = '';
  }

  removeUnitMasterValue(unit: ProductCategory, key: 'supportedBases' | 'supportedTypes' | 'supportedPacks', value: string): void {
    unit[key] = unit[key] ?? [];
    unit[key] = unit[key]!.filter(item => item !== value);
    this.saveAdminContent();
  }

  removeBusinessFeature(unit: ProductCategory, index: number): void {
    unit.features.splice(index, 1);
    this.saveAdminContent();
  }

  addBusinessImage(unit: ProductCategory): void {
    unit.images = unit.images ?? [];
    unit.images.push(unit.image);
    this.saveAdminContent();
  }

  removeBusinessImage(unit: ProductCategory, index: number): void {
    unit.images?.splice(index, 1);
    this.saveAdminContent();
  }

  addProduct(): void {
    this.runOrPromptAdminNavigation(() => {
      this.waxProducts.push({
        id: `product-${Date.now()}`,
        title: 'New Product',
        businessUnitId: this.selectedBusinessUnit?.id,
        category: this.selectedBusinessUnit?.title ?? 'General',
        base: this.masterData.bases[0],
        baseType: this.masterData.baseTypes[0],
        pack: this.masterData.packs[0],
        subCategory: '',
        shortDescription: 'Short product description',
        description: 'Product description',
        features: ['Feature one'],
        price: 'Rs.0.00',
        offers: '',
        packageSizes: [],
        packagePrices: [],
        images: [],
        image: 'assets/products/WaxPolish.png'
      });
      this.selectedProductIndex = this.waxProducts.length - 1;
      this.adminSelection = 'product';
      this.captureAdminSnapshot();
      this.saveAdminContent();
    });
  }

  selectProduct(product: WaxProduct): void {
    const index = this.waxProducts.indexOf(product);
    if (index >= 0) {
      const select = () => {
        this.selectedProductIndex = index;
        this.adminSelection = 'product';
        this.captureAdminSnapshot();
      };
      if (this.selectedProductIndex === index) select();
      else this.runOrPromptAdminNavigation(select);
    }
  }

  deleteProduct(index: number): void {
    if (!this.waxProducts.length) return;
    this.waxProducts.splice(index, 1);
    this.selectedProductIndex = Math.max(0, index - 1);
    this.saveAdminContent();
  }

  addProductFeature(product: WaxProduct): void {
    product.features.push('New feature');
    this.saveAdminContent();
  }

  addPackageSize(product: WaxProduct): void {
    product.packageSizes = product.packageSizes ?? [];
    product.packageSizes.push('New size');
    product.packagePrices = product.packagePrices ?? [];
    product.packagePrices.push({ packageSize: 'New size', price: product.price || 'Rs.0.00', images: [] });
    this.saveAdminContent();
  }

  removePackageSize(product: WaxProduct, index: number): void {
    product.packageSizes?.splice(index, 1);
    product.packagePrices?.splice(index, 1);
    this.saveAdminContent();
  }

  setPackageSize(product: WaxProduct, index: number, value: string): void {
    product.packageSizes = product.packageSizes ?? [];
    product.packageSizes[index] = value;
    product.pack = value;
    this.saveAdminContent();
  }

  selectProductPackage(product: WaxProduct, price: ProductPackage): void {
    this.selectedPackageByProduct[product.id] = price.packageSize;
  }

  addPackageImage(price: ProductPackage, product: WaxProduct): void {
    price.images = price.images ?? [];
    price.images.push(product.image);
    this.saveAdminContent();
  }

  removePackageImage(price: ProductPackage, index: number): void {
    price.images?.splice(index, 1);
    this.saveAdminContent();
  }

  handlePackageImageUpload(event: Event, price: ProductPackage): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.readCompressedImage(file).then(image => {
      price.images = price.images ?? [];
      price.images.push(image);
      this.saveAdminContent();
    });
  }

  packagePreviewImage(price: ProductPackage): string {
    return price.images?.[0] || '';
  }

  openImagePreview(image?: string): void {
    if (!image) return;
    this.previewImageUrl = image;
  }

  closeImagePreview(): void {
    this.previewImageUrl = '';
  }

  addProductImage(product: WaxProduct): void {
    product.images = product.images ?? [];
    product.images.push(product.image);
    this.saveAdminContent();
  }

  removeProductImage(product: WaxProduct, index: number): void {
    product.images?.splice(index, 1);
    this.saveAdminContent();
  }

  addMasterValue(): void {
    this.currentMasterList.push('New value');
    this.saveAdminContent();
  }

  removeMasterValue(index: number): void {
    const list = this.currentMasterList;
    const value = list[index];
    if (this.isMasterValueReferenced(value)) return;
    list.splice(index, 1);
    this.saveAdminContent();
  }

  isMasterValueReferenced(value: string): boolean {
    if (!value) return false;
    return this.productCategories.some(unit =>
      unit.supportedBases?.includes(value) ||
      unit.supportedTypes?.includes(value) ||
      unit.supportedPacks?.includes(value)
    ) || this.waxProducts.some(product =>
      product.base === value ||
      product.baseType === value ||
      product.pack === value ||
      product.packageSizes?.includes(value) ||
      product.packagePrices?.some(price => price.packageSize === value)
    );
  }

  removeProductFeature(product: WaxProduct, index: number): void {
    product.features.splice(index, 1);
    this.saveAdminContent();
  }

  handleImageUpload(event: Event, target: { image?: string; image360?: string }, key: 'image' | 'image360' = 'image'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.readCompressedImage(file).then(image => {
      target[key] = image;
      this.saveAdminContent();
    });
  }

  private readCompressedImage(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => this.compressImageSource(String(reader.result)).then(resolve);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  private compressImageSource(source?: string): Promise<string> {
    if (!source || !source.startsWith('data:image/')) return Promise.resolve(source ?? '');
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, this.maxImageDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
          resolve(source);
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', this.imageQuality));
      };
      image.onerror = () => resolve(source);
      image.src = source;
    });
  }

  private async compactProductImages(product: WaxProduct): Promise<WaxProduct> {
    const copy: WaxProduct = {
      ...product,
      image: await this.compressImageSource(product.image),
      images: await Promise.all((product.images ?? []).map(image => this.compressImageSource(image))),
      packagePrices: await Promise.all((product.packagePrices ?? []).map(async price => ({
        ...price,
        images: await Promise.all((price.images ?? []).map(image => this.compressImageSource(image)))
      })))
    };
    return copy;
  }

  private currentAdminEditObject(): ProductCategory | WaxProduct | null {
    if (this.adminSelection === 'business') return this.selectedBusinessUnit;
    if (this.adminSelection === 'product') return this.selectedProduct;
    return null;
  }

  private captureAdminSnapshot(): void {
    const current = this.currentAdminEditObject();
    this.adminEditSnapshot = current ? JSON.stringify(current) : '';
    this.adminEditSnapshotType = this.adminSelection;
    this.adminDirty = false;
  }

  private restoreAdminSnapshot(): void {
    if (!this.adminEditSnapshot || !this.adminEditSnapshotType) return;
    const restored = JSON.parse(this.adminEditSnapshot);
    if (this.adminEditSnapshotType === 'business') this.productCategories[this.selectedBusinessUnitIndex] = restored;
    if (this.adminEditSnapshotType === 'product') this.waxProducts[this.selectedProductIndex] = restored;
  }

  private runOrPromptAdminNavigation(action: () => void): void {
    if (!this.adminDirty) {
      action();
      return;
    }
    this.pendingAdminNavigation = action;
    this.showUnsavedPrompt = true;
  }

  stayOnCurrentAdminEdit(): void {
    this.showUnsavedPrompt = false;
    this.pendingAdminNavigation = null;
  }

  discardAdminChangesAndContinue(): void {
    const action = this.pendingAdminNavigation;
    this.restoreAdminSnapshot();
    this.persistAdminContent();
    this.captureAdminSnapshot();
    this.showUnsavedPrompt = false;
    this.pendingAdminNavigation = null;
    action?.();
  }

  saveAdminContent(): void {
    const current = this.currentAdminEditObject();
    if (this.isAdminPage && current && this.adminEditSnapshot) {
      this.adminDirty = JSON.stringify(current) !== this.adminEditSnapshot;
    }
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.persistAdminContent(), 350);
  }

  saveHomeContent(): void {
    this.adminSaving = true;
    this.adminSaveStatus = 'Saving home content...';
    this.persistAdminContent();
    window.setTimeout(() => {
      this.adminSaving = false;
      this.adminSaveStatus = 'Home content saved locally.';
    }, 250);
  }

  private persistAdminContent(): void {
    const cachePayload = this.stripLargeInlineImages({
      homeContent: this.homeContent,
      productCategories: this.productCategories,
      waxProducts: this.waxProducts,
      masterData: this.masterData
    });

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cachePayload));
    } catch {
      localStorage.removeItem(this.storageKey);
      this.adminSaveStatus = 'Local browser cache is full. Data remains on screen; use Save to DB.';
    }
  }

  private stripLargeInlineImages<T>(value: T): T {
    if (typeof value === 'string') {
      return (value.startsWith('data:image/') || value.length > 12000 ? '' : value) as T;
    }
    if (Array.isArray(value)) {
      return value.map(item => this.stripLargeInlineImages(item)).filter(item => item !== '') as T;
    }
    if (value && typeof value === 'object') {
      const copy: Record<string, unknown> = {};
      for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
        copy[key] = this.stripLargeInlineImages(item);
      }
      return copy as T;
    }
    return value;
  }

  saveBusinessUnitToDb(): void {
    this.saveBusinessUnitsToDb();
  }

  saveProductToDb(): void {
    this.saveSelectedProductToDb();
  }

  private showAdminStatus(message: string, autoClose = true): void {
    if (this.adminStatusTimer) clearTimeout(this.adminStatusTimer);
    this.adminStatusFading = false;
    this.adminSaveStatus = message;
    if (!autoClose) return;
    this.adminStatusTimer = setTimeout(() => {
      this.adminStatusFading = true;
      this.adminStatusTimer = setTimeout(() => {
        this.adminSaveStatus = '';
        this.adminStatusFading = false;
      }, 360);
    }, 2600);
  }

  closeAdminStatus(): void {
    if (this.adminStatusTimer) clearTimeout(this.adminStatusTimer);
    this.adminSaveStatus = '';
    this.adminStatusFading = false;
  }

  private productToApiPayload(product: WaxProduct, index: number) {
    const numericId = Number(product.id);
    return {
      id: Number.isFinite(numericId) ? numericId : 0,
      businessUnitId: null,
      businessUnitSlug: product.businessUnitId ?? null,
      productName: product.title,
      category: product.category,
      subCategory: product.subCategory ?? product.baseType ?? null,
      shortDescription: product.shortDescription ?? product.offers ?? null,
      description: product.description,
      price: this.toPrice(product.price) || null,
      priceDisplay: product.price,
      offers: product.shortDescription ?? product.offers ?? null,
      imageUrl: product.image,
      sortOrder: index,
      features: product.features,
      packageSizes: (product.packagePrices?.length ? product.packagePrices.map(p => p.packageSize) : product.packageSizes) ?? [],
      packagePrices: (product.packagePrices ?? []).map(item => ({
        packageSize: item.packageSize,
        price: item.price,
        images: item.images ?? []
      }))
    };
  }

  saveBusinessUnitsToDb(): void {
    this.adminSaving = true;
    this.adminSaveStatus = 'Saving business units...';
    const payload = this.productCategories.map((unit, index) => ({
      id: 0,
      slug: unit.id,
      name: unit.title,
      icon: unit.icon,
      imageUrl: unit.image,
      image360Url: unit.image360 ?? null,
      description: unit.subtitle,
      accentColor: unit.color,
      isComingSoon: !!unit.soon,
      sortOrder: index,
      features: unit.features,
      supportedBases: unit.supportedBases ?? [],
      supportedTypes: unit.supportedTypes ?? [],
      supportedPacks: unit.supportedPacks ?? [],
      images: (unit.images ?? []).map((image, imageIndex) => ({
        id: 0,
        imageUrl: image,
        altText: unit.title,
        isPrimary: imageIndex === 0,
        is360: false,
        sortOrder: imageIndex
      }))
    }));
    this.http.put(`${this.apiBaseUrl}/business-units`, payload).subscribe({
      next: () => {
        this.adminSaving = false;
        this.adminSaveStatus = 'Business unit saved to DB.';
        this.captureAdminSnapshot();
        this.persistAdminContent();
      },
      error: () => {
        this.adminSaving = false;
        this.adminSaveStatus = 'Unable to save business unit to DB.';
      }
    });
  }

  async saveProductsToDb(): Promise<void> {
    this.adminSaving = true;
    this.adminSaveStatus = 'Saving products...';
    const compactProducts = await Promise.all(this.waxProducts.map(product => this.compactProductImages(product)));
    const payload = compactProducts.map((product, index) => this.productToApiPayload(product, index));
    this.http.put(`${this.apiBaseUrl}/products`, payload).subscribe({
      next: () => {
        this.adminSaving = false;
        this.adminSaveStatus = 'Products saved to DB.';
        this.captureAdminSnapshot();
        this.persistAdminContent();
      },
      error: () => {
        this.adminSaving = false;
        this.adminSaveStatus = 'Unable to save products to DB.';
      }
    });
  }

  async saveSelectedProductToDb(): Promise<void> {
    const product = this.selectedProduct;
    if (!product) return;
    this.adminSaving = true;
    this.adminSaveStatus = 'Saving product...';
    const compactProduct = await this.compactProductImages(product);
    const payload = [this.productToApiPayload(compactProduct, this.selectedProductIndex)];
    this.http.put(`${this.apiBaseUrl}/products`, payload).subscribe({
      next: () => {
        this.adminSaving = false;
        this.showAdminStatus('Product Changes Saved');
        this.captureAdminSnapshot();
        this.persistAdminContent();
      },
      error: () => {
        this.adminSaving = false;
        this.adminSaveStatus = 'Unable to save product to DB.';
      }
    });
  }

  private loadContentFromApi(): void {
    this.http.get<any[]>(`${this.apiBaseUrl}/business-units`).subscribe({
      next: units => {
        if (!units?.length) return;
        this.productCategories = units.map(unit => ({
          id: unit.slug,
          dbId: Number(unit.id) || undefined,
          title: unit.name,
          subtitle: unit.description ?? '',
          image: unit.imageUrl ?? 'assets/products/MasterImage.png',
          images: (unit.images ?? []).map((image: any) => image.imageUrl),
          image360: unit.image360Url ?? undefined,
          icon: unit.icon ?? '[]',
          color: unit.accentColor ?? '#d4af37',
          soon: !!unit.isComingSoon,
          features: unit.features ?? [],
          supportedBases: unit.supportedBases ?? [],
          supportedTypes: unit.supportedTypes ?? [],
          supportedPacks: unit.supportedPacks ?? []
        }));
        this.normalizeLegacyContent(this.productCategories);
        this.captureAdminSnapshot();
        this.persistAdminContent();
      },
      error: () => this.adminSaveStatus = this.isAdminPage ? 'Unable to load business units from API. Using local content.' : ''
    });

    this.http.get<any[]>(`${this.apiBaseUrl}/products`).subscribe({
      next: products => {
        if (!products?.length) return;
        if (!this.isAdminPage && products.length < 2) return;
        this.waxProducts = products.map(product => ({
          id: String(product.id || product.productName),
          title: product.productName,
          businessUnitId: this.resolveBusinessUnitSlug(product),
          category: product.category ?? '',
          subCategory: product.subCategory ?? undefined,
          price: product.priceDisplay ?? '',
          offers: product.offers ?? undefined,
          shortDescription: product.shortDescription ?? product.offers ?? product.description ?? '',
          image: product.imageUrl ?? 'assets/products/WaxPolish.png',
          images: product.imageUrl ? [product.imageUrl] : [],
          base: undefined,
          baseType: product.subCategory ?? undefined,
          pack: undefined,
          features: product.features ?? [],
          packageSizes: product.packageSizes ?? [],
          packagePrices: (product.packagePrices?.length
            ? product.packagePrices.map((item: any) => ({
              packageSize: item.packageSize,
              price: item.price,
              images: item.images ?? []
            }))
            : (product.packageSizes ?? []).map((size: string) => ({ packageSize: size, price: product.priceDisplay ?? '', images: [] }))),
          description: product.description ?? ''
        }));
        this.normalizeLegacyContent(this.waxProducts);
        this.captureAdminSnapshot();
        this.persistAdminContent();
      },
      error: () => this.adminSaveStatus = this.isAdminPage ? 'Unable to load products from API. Using local content.' : ''
    });
  }

  private loadAdminContent(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as Partial<{
        homeContent: HomeContent;
        productCategories: ProductCategory[];
        waxProducts: WaxProduct[];
        masterData: MasterData;
      }>;
      if (data.homeContent) this.homeContent = data.homeContent;
      if (data.productCategories?.length) this.productCategories = data.productCategories;
      if (data.waxProducts?.length) this.waxProducts = data.waxProducts;
      if (data.masterData) this.masterData = data.masterData;
      this.normalizeLegacyContent(this.homeContent);
      this.normalizeLegacyContent(this.productCategories);
      this.normalizeLegacyContent(this.waxProducts);
      this.normalizeLegacyContent(this.masterData);
      this.persistAdminContent();
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  onWaxSwipeStart(event: TouchEvent): void {
    this.waxSwipeStartX = event.touches[0].clientX;
  }

  onWaxSwipeEnd(event: TouchEvent): void {
    const diff = event.changedTouches[0].clientX - this.waxSwipeStartX;
    if (Math.abs(diff) < 45) return;
    const categories = this.waxCategories.map((c: any) => c.name);
    const currentIndex = Math.max(0, categories.indexOf(this.selectedWaxCategory));
    this.selectedWaxCategory = diff < 0
      ? categories[Math.min(categories.length - 1, currentIndex + 1)]
      : categories[Math.max(0, currentIndex - 1)];
  }

private applyThemeClass(): void {
  const classes = this.themes.map(t => 'theme-' + t.value);

  document.documentElement.classList.remove(...classes);
  document.body.classList.remove(...classes);

  document.documentElement.classList.add('theme-' + this.theme);
  document.body.classList.add('theme-' + this.theme);
}

}
