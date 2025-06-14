
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, AlertCircle } from 'lucide-react';

// Données d'exemple
const medicines = [
  {
    id: 1,
    name: 'Paracétamol 500mg',
    category: 'Antalgique',
    stock: 150,
    minStock: 50,
    price: 3.50,
    expiry: '2025-08-15',
    supplier: 'MediSupply'
  },
  {
    id: 2,
    name: 'Ibuprofène 400mg',
    category: 'Anti-inflammatoire',
    stock: 25,
    minStock: 30,
    price: 5.20,
    expiry: '2025-12-20',
    supplier: 'PharmaCorp'
  },
  {
    id: 3,
    name: 'Amoxicilline 1g',
    category: 'Antibiotique',
    stock: 80,
    minStock: 40,
    price: 12.80,
    expiry: '2024-11-30',
    supplier: 'MediSupply'
  },
  {
    id: 4,
    name: 'Aspirine 100mg',
    category: 'Antiagrégant',
    stock: 5,
    minStock: 20,
    price: 2.90,
    expiry: '2025-06-10',
    supplier: 'Generic Plus'
  }
];

export default function MedicineInventory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Rupture', color: 'destructive' };
    if (stock <= minStock) return { label: 'Faible', color: 'secondary' };
    return { label: 'Normal', color: 'default' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher dans l'inventaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Médicament</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.map((medicine) => {
              const stockStatus = getStockStatus(medicine.stock, medicine.minStock);
              return (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{medicine.stock}</span>
                      {medicine.stock <= medicine.minStock && (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>€{medicine.price.toFixed(2)}</TableCell>
                  <TableCell>{medicine.expiry}</TableCell>
                  <TableCell>
                    <Badge variant={stockStatus.color as any}>{stockStatus.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
