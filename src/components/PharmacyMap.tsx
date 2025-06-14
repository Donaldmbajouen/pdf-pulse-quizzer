
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Star, Phone } from 'lucide-react';

// Données d'exemple des pharmacies
const pharmacies = [
  {
    id: 1,
    name: 'Pharmacie Centrale',
    address: '15 rue de la République, 75001 Paris',
    distance: 0.3,
    rating: 4.5,
    phone: '01 42 86 75 30',
    hours: 'Ouvert jusqu\'à 19h',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 2,
    name: 'Pharmacie du Marché',
    address: '8 place du Marché, 75001 Paris',
    distance: 0.7,
    rating: 4.2,
    phone: '01 42 86 75 31',
    hours: 'Ouvert jusqu\'à 20h',
    coordinates: { lat: 48.8606, lng: 2.3376 }
  },
  {
    id: 3,
    name: 'Pharmacie de l\'Opéra',
    address: '23 avenue de l\'Opéra, 75001 Paris',
    distance: 1.2,
    rating: 4.7,
    phone: '01 42 86 75 32',
    hours: '24h/24',
    coordinates: { lat: 48.8706, lng: 2.3322 }
  }
];

export default function PharmacyMap() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Liste des pharmacies */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pharmacies proches</CardTitle>
            <CardDescription>
              Pharmacies dans un rayon de 5 km de votre position
            </CardDescription>
          </CardHeader>
        </Card>

        {pharmacies.map((pharmacy) => (
          <Card key={pharmacy.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{pharmacy.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm mb-3">
                    <span className="text-gray-600">{pharmacy.distance} km</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{pharmacy.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {pharmacy.hours}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" className="flex items-center space-x-1">
                  <Navigation className="w-4 h-4" />
                  <span>Itinéraire</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </Button>
                <Button variant="ghost" size="sm">
                  Voir détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Carte */}
      <div className="lg:sticky lg:top-6">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle>Carte des pharmacies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Carte interactive</p>
                <p className="text-sm text-gray-400">
                  Intégration avec Google Maps ou Mapbox
                </p>
                <Button variant="outline" className="mt-4">
                  Activer la géolocalisation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
