
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShoppingCart, Phone } from 'lucide-react';

interface MedicineSearchProps {
  searchQuery: string;
}

// Données d'exemple des pharmacies et médicaments
const searchResults = [
  {
    id: 1,
    medicine: 'Paracétamol 500mg',
    pharmacies: [
      {
        id: 1,
        name: 'Pharmacie Centrale',
        address: '15 rue de la République, 75001 Paris',
        distance: 0.3,
        price: 3.50,
        stock: 150,
        rating: 4.5,
        phone: '01 42 86 75 30'
      },
      {
        id: 2,
        name: 'Pharmacie du Marché',
        address: '8 place du Marché, 75001 Paris',
        distance: 0.7,
        price: 3.20,
        stock: 80,
        rating: 4.2,
        phone: '01 42 86 75 31'
      }
    ]
  },
  {
    id: 2,
    medicine: 'Ibuprofène 400mg',
    pharmacies: [
      {
        id: 1,
        name: 'Pharmacie Centrale',
        address: '15 rue de la République, 75001 Paris',
        distance: 0.3,
        price: 5.20,
        stock: 25,
        rating: 4.5,
        phone: '01 42 86 75 30'
      }
    ]
  }
];

export default function MedicineSearch({ searchQuery }: MedicineSearchProps) {
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);

  const filteredResults = searchResults.filter(result =>
    !searchQuery || result.medicine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {!searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Recherche de médicaments</CardTitle>
            <CardDescription>
              Utilisez la barre de recherche pour trouver des médicaments près de chez vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">Commencez à taper le nom d'un médicament...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {searchQuery && filteredResults.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun résultat trouvé pour "{searchQuery}"</p>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredResults.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{result.medicine}</span>
              <Badge variant="outline">{result.pharmacies.length} pharmacie(s)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{pharmacy.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{pharmacy.address}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">{pharmacy.distance} km</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{pharmacy.rating}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pharmacy.stock > 50 ? 'bg-green-100 text-green-800' :
                          pharmacy.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pharmacy.stock > 50 ? 'En stock' :
                           pharmacy.stock > 20 ? 'Stock limité' :
                           'Stock faible'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        €{pharmacy.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pharmacy.stock} en stock
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex items-center space-x-1">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Commander</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>Appeler</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Itinéraire</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
