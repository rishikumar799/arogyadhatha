'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface UserRequest {
  id: string;
  name: string;
  email: string;
  role: string;
}

const RequestsPage = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users'), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const pendingRequests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<UserRequest, 'id'>),
        }));
        setRequests(pendingRequests);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError('Failed to fetch requests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        status: 'approved',
      });
      setRequests(requests.filter(req => req.id !== id));
    } catch (err) {
      console.error("Error approving request:", err);
      // Optionally show an error message to the user
    }
  };

  const handleReject = async (id: string) => {
    try {
      const userRef = doc(db, 'users', id);
      await deleteDoc(userRef); // Or update status to 'rejected'
      setRequests(requests.filter(req => req.id !== id));
    } catch (err) {
      console.error("Error rejecting request:", err);
      // Optionally show an error message to the user
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Approval Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleApprove(request.id)} className="text-green-500 hover:text-green-700">
                      <CheckCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleReject(request.id)} className="text-red-500 hover:text-red-700">
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestsPage;
