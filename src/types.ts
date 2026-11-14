export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  tool: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  paymentMethod: 'D17' | 'Flouci' | 'Virement';
}

export interface RegionData {
  id: string;
  name: string;
  activeUsers: number;
  popularTool: string;
  avgActivationMinutes: number;
  postalOfficesCount: number;
  highlight: string;
  coords: { x: number; y: number }; // SVG percentage positioning
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  selectedTool?: string;
}

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  tool: string;
  planDuration: '1 mois' | '6 mois' | '12 mois';
  paymentMethod: 'D17' | 'Flouci' | 'Virement';
  notes?: string;
}
