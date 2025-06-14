
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Package, AlertCircle, BarChart3 } from 'lucide-react';
import MedicineInventory from './MedicineInventory';
import StockAlerts from './StockAlerts';
import AddMedicineForm from './AddMedicineForm';

interface PharmacyDashboardProps {
  onBack: () => void;
}

export default function PharmacyDashboard({ onBack }: PharmacyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'alerts' | 'add'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Pharmacie Centrale</h1>
            </div>
            <Button onClick={() => setActiveTab('add')} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Ajouter médicament</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
          >
            Vue d'ensemble
          </Button>
          <Button
            variant={activeTab === 'inventory' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('inventory')}
          >
            Inventaire
          </Button>
          <Button
            variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('alerts')}
          >
            Alertes
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Médicaments</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertes Stock</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">8</div>
                <p className="text-xs text-muted-foreground">Médicaments en rupture</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes Aujourd'hui</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€1,254</div>
                <p className="text-xs text-muted-foreground">+5% par rapport à hier</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'inventory' && <MedicineInventory />}
        {activeTab === 'alerts' && <StockAlerts />}
        {activeTab === 'add' && <AddMedicineForm onSuccess={() => setActiveTab('inventory')} />}
      </div>
    </div>
  );
}
