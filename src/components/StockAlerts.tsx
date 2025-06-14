
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, Package } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'stock_low',
    medicine: 'Ibuprofène 400mg',
    message: 'Stock faible: 25 unités restantes (minimum: 30)',
    severity: 'warning',
    timestamp: '2024-01-15 09:30'
  },
  {
    id: 2,
    type: 'stock_out',
    medicine: 'Aspirine 100mg',
    message: 'Rupture de stock: 5 unités restantes (minimum: 20)',
    severity: 'critical',
    timestamp: '2024-01-15 08:15'
  },
  {
    id: 3,
    type: 'expiry_soon',
    medicine: 'Amoxicilline 1g',
    message: 'Expiration proche: expire le 30/11/2024',
    severity: 'warning',
    timestamp: '2024-01-14 16:45'
  },
  {
    id: 4,
    type: 'reorder',
    medicine: 'Paracétamol 500mg',
    message: 'Recommandation de réapprovisionnement',
    severity: 'info',
    timestamp: '2024-01-14 14:20'
  }
];

export default function StockAlerts() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'stock_out':
      case 'stock_low':
        return <Package className="w-4 h-4" />;
      case 'expiry_soon':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Alertes Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Avertissements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">4</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-orange-100">
                    {getSeverityIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{alert.medicine}</h3>
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-400">{alert.timestamp}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Résoudre
                  </Button>
                  <Button variant="ghost" size="sm">
                    Ignorer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
