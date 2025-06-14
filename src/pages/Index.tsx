
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, MapPin, ShoppingCart } from 'lucide-react';
import PharmacyDashboard from '@/components/PharmacyDashboard';
import ClientInterface from '@/components/ClientInterface';

export default function Index() {
  const [activeView, setActiveView] = useState<'home' | 'pharmacy' | 'client'>('home');

  if (activeView === 'pharmacy') {
    return <PharmacyDashboard onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'client') {
    return <ClientInterface onBack={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PharmaCare Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Solution complète de gestion de pharmacies et de recherche de médicaments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('pharmacy')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Espace Pharmacie</CardTitle>
              <CardDescription>
                Gérez votre inventaire, suivez vos stocks et recevez des alertes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gestion des médicaments</li>
                <li>• Suivi des niveaux de stock</li>
                <li>• Alertes automatiques</li>
                <li>• Historique des ventes</li>
              </ul>
              <Button className="w-full mt-6" onClick={() => setActiveView('pharmacy')}>
                Accéder à l'espace pharmacie
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('client')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Espace Client</CardTitle>
              <CardDescription>
                Trouvez vos médicaments, comparez les prix et localisez les pharmacies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Recherche de médicaments</li>
                <li>• Comparaison des prix</li>
                <li>• Géolocalisation</li>
                <li>• Commandes en ligne</li>
              </ul>
              <Button className="w-full mt-6" variant="outline" onClick={() => setActiveView('client')}>
                Rechercher des médicaments
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Géolocalisation</h3>
              <p className="text-gray-600 text-sm">Trouvez les pharmacies les plus proches de vous</p>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingCart className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Commandes en ligne</h3>
              <p className="text-gray-600 text-sm">Commandez et payez vos médicaments en ligne</p>
            </div>
            <div className="flex flex-col items-center">
              <Building2 className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Gestion simplifiée</h3>
              <p className="text-gray-600 text-sm">Outils intuitifs pour les pharmacies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
