
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, MapPin, Star, ShoppingCart } from 'lucide-react';
import MedicineSearch from './MedicineSearch';
import PharmacyMap from './PharmacyMap';
import PriceComparison from './PriceComparison';

interface ClientInterfaceProps {
  onBack: () => void;
}

export default function ClientInterface({ onBack }: ClientInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'map' | 'compare'>('search');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Recherche Médicaments</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un médicament..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'search' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('search')}
            className="flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Recherche</span>
          </Button>
          <Button
            variant={activeTab === 'map' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('map')}
            className="flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Carte</span>
          </Button>
          <Button
            variant={activeTab === 'compare' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('compare')}
            className="flex items-center space-x-2"
          >
            <Star className="w-4 h-4" />
            <span>Comparer</span>
          </Button>
        </div>

        {activeTab === 'search' && <MedicineSearch searchQuery={searchQuery} />}
        {activeTab === 'map' && <PharmacyMap />}
        {activeTab === 'compare' && <PriceComparison />}
      </div>
    </div>
  );
}
