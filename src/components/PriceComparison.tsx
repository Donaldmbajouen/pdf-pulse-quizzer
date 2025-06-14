
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, TrendingDown, TrendingUp, Equal, ShoppingCart } from 'lucide-react';

// Données d'exemple pour la comparaison de prix
const medicineComparisons = [
  {
    id: 1,
    name: 'Paracétamol 500mg',
    averagePrice: 3.35,
    pharmacies: [
      {
        name: 'Pharmacie du Marché',
        price: 3.20,
        savings: 0.15,
        distance: 0.7,
        stock: 80
      },
      {
        name: 'Pharmacie Centrale',
        price: 3.50,
        savings: -0.15,
        distance: 0.3,
        stock: 150
      },
      {
        name: 'Pharmacie de l\'Opéra',
        price: 3.35,
        savings: 0,
        distance: 1.2,
        stock: 200
      }
    ]
  },
  {
    id: 2,
    name: 'Ibuprofène 400mg',
    averagePrice: 5.40,
    pharmacies: [
      {
        name: 'Pharmacie Centrale',
        price: 5.20,
        savings: 0.20,
        distance: 0.3,
        stock: 25
      },
      {
        name: 'Pharmacie de l\'Opéra',
        price: 5.60,
        savings: -0.20,
        distance: 1.2,
        stock: 45
      }
    ]
  }
];

export default function PriceComparison() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComparisons = medicineComparisons.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceIcon = (savings: number) => {
    if (savings > 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    if (savings < 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <Equal className="w-4 h-4 text-gray-500" />;
  };

  const getPriceBadge = (savings: number) => {
    if (savings > 0) return { label: 'Meilleur prix', variant: 'default' };
    if (savings < 0) return { label: 'Plus cher', variant: 'secondary' };
    return { label: 'Prix moyen', variant: 'outline' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparaison des prix</CardTitle>
          <CardDescription>
            Comparez les prix des médicaments dans différentes pharmacies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un médicament à comparer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {filteredComparisons.map((medicine) => (
        <Card key={medicine.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{medicine.name}</CardTitle>
                <CardDescription>
                  Prix moyen: €{medicine.averagePrice.toFixed(2)}
                </CardDescription>
              </div>
              <Badge variant="outline">
                {medicine.pharmacies.length} pharmacie(s)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medicine.pharmacies
                .sort((a, b) => a.price - b.price)
                .map((pharmacy, index) => {
                  const badge = getPriceBadge(pharmacy.savings);
                  return (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{pharmacy.name}</h3>
                            {index === 0 && (
                              <Badge className="bg-green-100 text-green-800">
                                Meilleur prix
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{pharmacy.distance} km</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              pharmacy.stock > 50 ? 'bg-green-100 text-green-800' :
                              pharmacy.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {pharmacy.stock} en stock
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-2xl font-bold">
                              €{pharmacy.price.toFixed(2)}
                            </span>
                            {getPriceIcon(pharmacy.savings)}
                          </div>
                          {pharmacy.savings !== 0 && (
                            <div className="text-sm">
                              {pharmacy.savings > 0 ? (
                                <span className="text-green-600">
                                  -€{pharmacy.savings.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  +€{Math.abs(pharmacy.savings).toFixed(2)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="flex items-center space-x-1">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Commander</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ))}

      {searchTerm && filteredComparisons.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun médicament trouvé pour "{searchTerm}"</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
