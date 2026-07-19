export const categories = [
  { key: 'houses', label: 'Houses', icon: 'home' },
  { key: 'cars', label: 'Cars', icon: 'car' },
  { key: 'apts', label: 'Apartments', icon: 'business' },
  { key: 'land', label: 'Land', icon: 'planet' },
  { key: 'comm', label: 'Commercial', icon: 'cube' },
  { key: 'vehi', label: 'Vehicles', icon: 'car-sport' },
];

export const featured = [
  { id: '1', price: '$150,000', title: 'Modern Villa', location: 'Hodan', beds: 4, baths: 3, agent: 'Ahmed', posterRole: 'Broker', posterVerified: true, posterRating: '4.9', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  { id: '2', price: '$35,000', title: 'Toyota Land', location: 'Waberi', year: 2020, agent: 'Fatima', posterRole: 'Owner', posterVerified: false, posterRating: '4.7', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b5b3f32?auto=format&fit=crop&w=1200&q=80' },
  { id: '3', price: '$80,000', title: 'Prime Land', location: 'Yaqshid', agent: 'Omar', posterRole: 'Broker', posterVerified: true, posterRating: '4.8', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
];

export const nearby = [
  { id: 'n1', title: '4BR Villa, Secure Compound', location: 'Hodan', price: '$120,000', beds: 4, baths: 3, time: '2 days ago', agent: 'Ahmed', posterRole: 'Broker', posterVerified: true, posterRating: '4.9', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80' },
  { id: 'n2', title: '3BR Apt, New Building', location: 'Waberi', price: '$85,000', beds: 3, baths: 2, time: '5 hours ago', agent: 'Fatima', posterRole: 'Broker', posterVerified: true, posterRating: '4.8', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' },
];

export const vehicles = [
  { id: 'v1', title: 'Hilux', price: '$28K', agent: 'Ali', posterRole: 'Dealer', posterVerified: false, posterRating: '4.6', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80' },
  { id: 'v2', title: 'Patrol', price: '$42K', agent: 'Amina', posterRole: 'Dealer', posterVerified: true, posterRating: '4.8', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
];

export const brokers = [
  { id: 'b1', name: 'Ahmed', role: 'Broker', stat: '4.9', reviews: '47 reviews', listings: '18 listings', avatar: 'https://i.pravatar.cc/160?img=12', accent: '#2F7CF6' },
  { id: 'b2', name: 'Fatima', role: 'Owner', stat: '4.8', reviews: '32 reviews', listings: '11 listings', avatar: 'https://i.pravatar.cc/160?img=32', accent: '#F28C28' },
  { id: 'b3', name: 'Omar', role: 'Dealer', stat: '4.7', reviews: '28 reviews', listings: '9 listings', avatar: 'https://i.pravatar.cc/160?img=56', accent: '#16A34A' },
];

export const clips = [
  {
    id: 'c1',
    price: '$250k',
    title: 'Modern Villa Tour',
    location: 'Hodan, Muqdisho',
    tag: 'Sale',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=70',
  },
  {
    id: 'c2',
    price: '$180k',
    title: 'Bright Interior',
    location: 'Garowe, Puntland',
    tag: 'Sale',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=70',
  },
  {
    id: 'c3',
    price: '$420k',
    title: 'Luxury Night Estate',
    location: 'Hargeisa, SL',
    tag: 'Sale',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=70',
  },
];
