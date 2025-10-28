'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Hospital {
  id: string;
  name: string;
  address: string;
}

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchHospitals = async () => {
      const querySnapshot = await getDocs(collection(db, 'hospitals'));
      const hospitalsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Hospital[];
      setHospitals(hospitalsData);
    };

    fetchHospitals();
  }, []);

  const handleAddHospital = async () => {
    if (!hospitalName || !hospitalAddress) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter hospital name and address.',
      });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'hospitals'), {
        name: hospitalName,
        address: hospitalAddress,
      });
      setHospitals([...hospitals, { id: docRef.id, name: hospitalName, address: hospitalAddress }]);
      setHospitalName('');
      setHospitalAddress('');
      toast({ title: 'Hospital Added', description: 'The new hospital has been added.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error Adding Hospital', description: error.message });
    }
  };

  const handleDeleteHospital = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'hospitals', id));
      setHospitals(hospitals.filter(hospital => hospital.id !== id));
      toast({ title: 'Hospital Deleted', description: 'The hospital has been deleted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error Deleting Hospital', description: error.message });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Hospitals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
            <Input
              placeholder="Hospital Address"
              value={hospitalAddress}
              onChange={(e) => setHospitalAddress(e.target.value)}
            />
            <Button onClick={handleAddHospital}>Add Hospital</Button>
          </div>
          <div className="space-y-2">
            {hospitals.map(hospital => (
              <div key={hospital.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div>
                  <p className="font-semibold">{hospital.name}</p>
                  <p className="text-sm text-gray-500">{hospital.address}</p>
                </div>
                <Button variant="destructive" onClick={() => handleDeleteHospital(hospital.id)}>Delete</Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
