import type { Category } from '@/types/models';

export const CATEGORIES: Category[] = [
  {
    id: 'maison',
    name: 'Maison',
    icon: 'home-outline',
    tint: '#A755FF',
    subs: [
      { id: 'menage', name: 'Ménage', icon: 'sparkles-outline' },
      { id: 'nettoyage', name: 'Nettoyage profond', icon: 'water-outline' },
      { id: 'canape', name: 'Canapé & tapis', icon: 'bed-outline' },
      { id: 'plomberie', name: 'Plomberie', icon: 'water-outline' },
      { id: 'electricite', name: 'Électricité', icon: 'flash-outline' },
      { id: 'clim', name: 'Climatisation', icon: 'snow-outline' },
      { id: 'jardinage', name: 'Jardinage', icon: 'leaf-outline' },
      { id: 'peinture', name: 'Peinture', icon: 'color-palette-outline' },
      { id: 'bricolage', name: 'Bricolage', icon: 'hammer-outline' },
      { id: 'demenagement', name: 'Déménagement', icon: 'cube-outline' },
    ],
  },
  {
    id: 'beaute',
    name: 'Beauté',
    icon: 'rose-outline',
    tint: '#D44DFF',
    subs: [
      { id: 'coiffeur', name: 'Coiffeur', icon: 'cut-outline' },
      { id: 'barbier', name: 'Barbier', icon: 'cut-outline' },
      { id: 'massage', name: 'Massage / Spa', icon: 'flower-outline' },
      { id: 'onglerie', name: 'Onglerie', icon: 'hand-left-outline' },
      { id: 'maquillage', name: 'Maquillage', icon: 'brush-outline' },
    ],
  },
  {
    id: 'auto',
    name: 'Automobile',
    icon: 'car-sport-outline',
    tint: '#7C2CFF',
    subs: [
      { id: 'lavage', name: 'Lavage auto', icon: 'water-outline' },
      { id: 'detailing', name: 'Detailing', icon: 'sparkles-outline' },
      { id: 'depannage', name: 'Dépannage', icon: 'battery-charging-outline' },
      { id: 'vidange', name: 'Vidange & pneus', icon: 'disc-outline' },
      { id: 'mecanicien', name: 'Mécanicien', icon: 'construct-outline' },
      { id: 'location', name: 'Location', icon: 'key-outline' },
    ],
  },
  {
    id: 'voyage',
    name: 'Voyage',
    icon: 'airplane-outline',
    tint: '#5D8BFF',
    subs: [
      { id: 'chauffeur', name: 'Chauffeur privé', icon: 'car-outline' },
      { id: 'aeroport', name: 'Transfert aéroport', icon: 'airplane-outline' },
      { id: 'hotel', name: 'Hôtels', icon: 'bed-outline' },
      { id: 'billetterie', name: 'Billetterie', icon: 'ticket-outline' },
    ],
  },
  {
    id: 'food',
    name: 'Food & Chef',
    icon: 'restaurant-outline',
    tint: '#F0C568',
    subs: [
      { id: 'chef', name: 'Chef à domicile', icon: 'restaurant-outline' },
      { id: 'traiteur', name: 'Traiteur', icon: 'pizza-outline' },
      { id: 'restaurants', name: 'Restaurants', icon: 'wine-outline' },
    ],
  },
  {
    id: 'loisirs',
    name: 'Loisirs',
    icon: 'tennisball-outline',
    tint: '#3DDC97',
    subs: [
      { id: 'activites', name: 'Activités', icon: 'compass-outline' },
      { id: 'sport', name: 'Sport & Coach', icon: 'barbell-outline' },
      { id: 'fleurs', name: 'Fleurs & cadeaux', icon: 'rose-outline' },
      { id: 'evenement', name: 'Événements', icon: 'balloon-outline' },
      { id: 'shopper', name: 'Personal shopper', icon: 'bag-handle-outline' },
    ],
  },
  {
    id: 'famille',
    name: 'Famille',
    icon: 'people-outline',
    tint: '#FF8FB1',
    subs: [
      { id: 'babysitting', name: 'Babysitting', icon: 'happy-outline' },
      { id: 'soutien', name: 'Soutien scolaire', icon: 'book-outline' },
    ],
  },
  {
    id: 'livraison',
    name: 'Livraison',
    icon: 'cube-outline',
    tint: '#FFB020',
    subs: [
      { id: 'coursier', name: 'Coursier', icon: 'bicycle-outline' },
      { id: 'courses', name: 'Courses', icon: 'cart-outline' },
      { id: 'admin', name: 'Démarches admin', icon: 'document-text-outline' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'briefcase-outline',
    tint: '#8BA3C7',
    subs: [
      { id: 'bureau', name: 'Nettoyage bureaux', icon: 'business-outline' },
      { id: 'chauffeur-pro', name: 'Chauffeur entreprise', icon: 'car-outline' },
      { id: 'maintenance', name: 'Maintenance', icon: 'build-outline' },
      { id: 'assistance', name: 'Assistance admin', icon: 'documents-outline' },
    ],
  },
];

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
