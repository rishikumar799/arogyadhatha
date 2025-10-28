'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Request {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, 'requests'));
      const requestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Request[];
      setRequests(requestsData);
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id: string, email: string, role: string) => {
    try {
      const requestDocRef = doc(db, 'requests', id);
      await updateDoc(requestDocRef, { status: 'Approved' });

      const userDocRef = doc(db, 'users', id);
      await updateDoc(userDocRef, { role, email });

      setRequests(requests.map(req => (req.id === id ? { ...req, status: 'Approved' } : req)));
      toast({ title: 'Request Approved', description: `User ${email} has been approved.` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error Approving Request', description: error.message });
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'requests', id));
      setRequests(requests.filter(req => req.id !== id));
      toast({ title: 'Request Declined', description: 'The user request has been declined and removed.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error Declining Request', description: error.message });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">{request.name}</p>
                <p className="text-sm text-gray-500">{request.email}</p>
                <p className="text-sm text-gray-500">Role: {request.role}</p>
              </div>
              <div className="flex gap-2">
                {request.status !== 'Approved' ? (
                  <Button onClick={() => handleApprove(request.id, request.email, request.role)}>Approve</Button>
                ) : (
                  <span className="text-green-500 font-semibold">Approved</span>
                )}
                <Button variant="destructive" onClick={() => handleDecline(request.id)}>Decline</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
