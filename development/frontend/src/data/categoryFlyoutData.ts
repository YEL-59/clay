export interface FlyoutChildItem {
  id: string;
  name: string;
  slug: string;
  iconName: string;
}

export interface FlyoutBanner {
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  linkCategory: string;
}

export interface CategoryFlyoutData {
  categoryId: string;
  categoryName: string;
  title: string;
  children: FlyoutChildItem[];
  banner: FlyoutBanner;
}

export const CATEGORY_FLYOUTS: Record<string, CategoryFlyoutData> = {
  Electronics: {
    categoryId: 'cat-electronics',
    categoryName: 'Electronics',
    title: 'Electronics',
    children: [
      { id: 'el-audio', name: 'Audio', slug: 'audio', iconName: 'Headphones' },
      { id: 'el-drones', name: 'Drones', slug: 'drones', iconName: 'Radio' },
      { id: 'el-gaming', name: 'Gaming', slug: 'gaming', iconName: 'Gamepad2' },
      { id: 'el-laptops', name: 'Laptops', slug: 'laptops', iconName: 'Laptop' },
      { id: 'el-monitors', name: 'Monitors', slug: 'monitors', iconName: 'Monitor' },
      { id: 'el-smartphones', name: 'Smartphones', slug: 'smartphones', iconName: 'Smartphone' },
      { id: 'el-tablets', name: 'Tablets', slug: 'tablets', iconName: 'Tablet' },
      { id: 'el-wearables', name: 'Wearables', slug: 'wearables', iconName: 'Watch' },
    ],
    banner: {
      tag: 'NEW COLLECTION',
      title: 'Summer Vibes',
      subtitle: 'Fresh styles for the season',
      ctaText: 'Explore Now',
      imageUrl: '/assets/images/summer_vibes_model.jpg',
      linkCategory: 'Electronics',
    },
  },
  Fashion: {
    categoryId: 'cat-fashion',
    categoryName: 'Fashion',
    title: 'Fashion & Apparel',
    children: [
      { id: 'fa-linen', name: 'French Linen Shirts', slug: 'linen-shirts', iconName: 'Shirt' },
      { id: 'fa-mens', name: "Men's Casual Wear", slug: 'mens-wear', iconName: 'Shirt' },
      { id: 'fa-camp', name: 'Camp Collar Drops', slug: 'camp-collars', iconName: 'Scissors' },
      { id: 'fa-womens', name: 'Atelier Kaftans', slug: 'womens-dresses', iconName: 'Sparkles' },
      { id: 'fa-shoes', name: 'Loafers & Espadrilles', slug: 'shoes', iconName: 'Footprints' },
      { id: 'fa-bags', name: 'Woven Clutches & Bags', slug: 'bags', iconName: 'Briefcase' },
      { id: 'fa-acc', name: 'Sunglasses & Belts', slug: 'accessories', iconName: 'Glasses' },
      { id: 'fa-jewelry', name: 'Timepieces & Rings', slug: 'jewelry', iconName: 'Gem' },
    ],
    banner: {
      tag: 'HAUTE COUTURE',
      title: 'Normandy Flax',
      subtitle: 'Hand-tailored camp-collar collection',
      ctaText: 'Shop Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800',
      linkCategory: 'Fashion',
    },
  },
  'Room Decor': {
    categoryId: 'cat-room-decor',
    categoryName: 'Room Decor',
    title: 'Room Decor & Studio',
    children: [
      { id: 'rd-lighting', name: 'Ambient Desk Halos', slug: 'lighting', iconName: 'Lamp' },
      { id: 'rd-art', name: 'Minimalist Wall Art', slug: 'wall-art', iconName: 'Image' },
      { id: 'rd-clocks', name: 'Desk Clocks & Accents', slug: 'clocks', iconName: 'Clock' },
      { id: 'rd-ceramics', name: 'Nordic Ceramic Vases', slug: 'ceramics', iconName: 'Coffee' },
      { id: 'rd-throws', name: 'Linen Throws & Cushions', slug: 'throws', iconName: 'Armchair' },
      { id: 'rd-planters', name: 'Sculpted Planters', slug: 'planters', iconName: 'Leaf' },
      { id: 'rd-candles', name: 'Diffusers & Candles', slug: 'candles', iconName: 'Flame' },
      { id: 'rd-organizers', name: 'Solid Oak Organizers', slug: 'organizers', iconName: 'Box' },
    ],
    banner: {
      tag: 'NORDIC LIVING',
      title: 'Sanctuary Spaces',
      subtitle: 'Warm ambient lighting & organic ceramics',
      ctaText: 'Discover Decor',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
      linkCategory: 'Room Decor',
    },
  },
  Gadget: {
    categoryId: 'cat-gadget',
    categoryName: 'Gadget',
    title: 'Gadgets & Tech Life',
    children: [
      { id: 'gd-smart', name: 'Smart Home Hubs', slug: 'smart-home', iconName: 'Home' },
      { id: 'gd-chargers', name: 'Wireless MagSafe Docks', slug: 'chargers', iconName: 'Zap' },
      { id: 'gd-keyboards', name: 'Mechanical Keyboards', slug: 'keyboards', iconName: 'Keyboard' },
      { id: 'gd-audio', name: 'ANC Wireless Earbuds', slug: 'wireless-audio', iconName: 'Speaker' },
      { id: 'gd-power', name: 'High-Density Powerbanks', slug: 'power-banks', iconName: 'BatteryCharging' },
      { id: 'gd-cams', name: 'Action & Vlog Cams', slug: 'action-cams', iconName: 'Camera' },
      { id: 'gd-stands', name: 'Aluminum Laptop Stands', slug: 'stands', iconName: 'Monitor' },
      { id: 'gd-cables', name: 'Braided Fast Cables', slug: 'cables', iconName: 'Cpu' },
    ],
    banner: {
      tag: 'PRO CREATOR',
      title: 'Workspace Desk',
      subtitle: 'Engineered for seamless productivity',
      ctaText: 'Explore Tech',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800',
      linkCategory: 'Gadgets',
    },
  },
  Toys: {
    categoryId: 'cat-toys',
    categoryName: 'Toys',
    title: 'Toys & Creative Play',
    children: [
      { id: 'ty-lego', name: 'Building Bricks & Sets', slug: 'lego', iconName: 'Blocks' },
      { id: 'ty-figures', name: 'Hero Action Figures', slug: 'figures', iconName: 'Shield' },
      { id: 'ty-games', name: 'Strategy Board Games', slug: 'board-games', iconName: 'Dices' },
      { id: 'ty-edu', name: 'STEM Educational Kits', slug: 'educational', iconName: 'GraduationCap' },
      { id: 'ty-rc', name: 'High-Speed RC Vehicles', slug: 'rc-cars', iconName: 'Car' },
      { id: 'ty-plush', name: 'Organic Plush Characters', slug: 'plush', iconName: 'Heart' },
      { id: 'ty-puzzles', name: 'Wooden Mind Puzzles', slug: 'puzzles', iconName: 'Puzzle' },
      { id: 'ty-collect', name: 'Limited Edition Collectibles', slug: 'collectibles', iconName: 'Trophy' },
    ],
    banner: {
      tag: 'KIDS WONDER',
      title: 'Creative Minds',
      subtitle: 'Inspiring imagination & joyful play',
      ctaText: 'Shop Toys',
      imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=800',
      linkCategory: 'Toys',
    },
  },
};
