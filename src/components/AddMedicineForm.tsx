
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddMedicineFormProps {
  onSuccess: () => void;
}

export default function AddMedicineForm({ onSuccess }: AddMedicineFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    minStock: '',
    price: '',
    expiry: '',
    supplier: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour sauvegarder en base de données
    console.log('Nouveau médicament:', formData);
    onSuccess();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouveau médicament</CardTitle>
        <CardDescription>
          Remplissez les informations du médicament à ajouter à votre inventaire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du médicament</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Paracétamol 500mg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="antalgique">Antalgique</SelectItem>
                  <SelectItem value="anti-inflammatoire">Anti-inflammatoire</SelectItem>
                  <SelectItem value="antibiotique">Antibiotique</SelectItem>
                  <SelectItem value="antiagrégant">Antiagrégant</SelectItem>
                  <SelectItem value="cardiovasculaire">Cardiovasculaire</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock initial</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minStock">Stock minimum</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => handleChange('minStock', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry">Date d'expiration</Label>
              <Input
                id="expiry"
                type="date"
                value={formData.expiry}
                onChange={(e) => handleChange('expiry', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier">Fournisseur</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleChange('supplier', e.target.value)}
              placeholder="Nom du fournisseur"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description ou notes supplémentaires"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1">
              Ajouter le médicament
            </Button>
            <Button type="button" variant="outline" onClick={onSuccess}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
