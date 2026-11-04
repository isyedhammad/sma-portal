export interface MiningPhoto {
  id: string;
  title: string;
  mineral: string;
  district: string;
  category: 'Pink Salt' | 'Limestone' | 'Coal' | 'Silica Sand' | 'Quarry Excavation';
  image_url: string;
  fallback_url: string;
  description: string;
  stats: string;
}

export const MINING_GALLERY: MiningPhoto[] = [
  {
    id: 'pink-salt-1',
    title: 'Salt Range Himalayan Pink Salt Mine',
    mineral: 'Rock Salt (Pink Salt)',
    district: 'Jhelum & Khushab',
    category: 'Pink Salt',
    image_url: 'assets/mining/mining_photo_8.jpg',
    fallback_url: 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1200&q=80',
    description: 'Subterranean pink rock salt deposits in the famous Salt Range (Khewra, Warcha & Kalabagh formations), renowned globally for 98% purity mineral sodium chloride.',
    stats: '58 Active SSM Concessions'
  },
  {
    id: 'quarry-limestone-1',
    title: 'Margalla & Salt Range Limestone Quarry Face',
    mineral: 'Limestone',
    district: 'Attock, Rawalpindi & Chakwal',
    category: 'Limestone',
    image_url: 'assets/mining/mining_photo_4.jpg',
    fallback_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    description: 'High-grade calcitic limestone quarrying benches supplying cement plants, national highways, and civil infrastructure projects across Punjab.',
    stats: '480+ Concession Blocks'
  },
  {
    id: 'coal-seam-1',
    title: 'Makerwal & Choa Saidan Shah Coal Mine',
    mineral: 'Coal',
    district: 'Chakwal & Mianwali',
    category: 'Coal',
    image_url: 'assets/mining/mining_photo_1.jpg',
    fallback_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'Underground coal extraction in the Surghar and Salt Range belts, fueling brick kilns and industrial thermal energy across the province.',
    stats: '390+ Colliery Leases'
  },
  {
    id: 'silica-sand-1',
    title: 'Daud Khel High-Grade Silica Sand Formations',
    mineral: 'Silica Sand',
    district: 'Mianwali & Khushab',
    category: 'Silica Sand',
    image_url: 'assets/mining/mining_photo_7.jpg',
    fallback_url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
    description: 'White silica sand deposits used in glass manufacturing, sodium silicate production, foundry molds, and chemical grade raw material.',
    stats: '280+ Mining Leases'
  }
];
