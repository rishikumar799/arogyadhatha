'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Request {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Doctor' | 'Receptionist' | 'Diagnostics';
  hospital: string;
  bloodGroup?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  approvedBy?: string;
  rejectedBy?: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up real-time listener for requests
    const q = query(
      collection(db, 'requests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        approvedAt: doc.data().approvedAt?.toDate(),
        rejectedAt: doc.data().rejectedAt?.toDate(),
      })) as Request[];
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching requests:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch requests. Please try again."
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleApprove = async (req: Request) => {
    try {
      // Create user document
      await setDoc(doc(db, 'users', req.uid), {
        uid: req.uid,
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        role: req.role,
        hospital: req.hospital,
        bloodGroup: req.bloodGroup || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Update request status
      await updateDoc(doc(db, 'requests', req.uid), {
        status: 'Approved',
        approvedAt: new Date(),
        approvedBy: 'superadmin', // You could get this from auth context
        updatedAt: new Date(),
      });

      toast({
        title: "Request Approved",
        description: `${req.firstName} ${req.lastName} has been approved as ${req.role}`,
      });
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: "Failed to approve request. Please try again."
      });
    }
  };

  const handleReject = async (req: Request) => {
    try {
      await updateDoc(doc(db, 'requests', req.uid), {
        status: 'Rejected',
        rejectedAt: new Date(),
        rejectedBy: 'superadmin', // You could get this from auth context
        updatedAt: new Date(),
      });

      toast({
        title: "Request Rejected",
        description: `Request from ${req.firstName} ${req.lastName} has been rejected`,
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        variant: "destructive",
        title: "Rejection Failed",
        description: "Failed to reject request. Please try again."
      });
    }
  };

  const getStatusBadge = (status: Request['status']) => {
    const variants = {
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <div className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[status])}>
        {status}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Requests Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage registration requests from healthcare professionals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            Review and manage registration requests from doctors, receptionists, and diagnostics staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No pending requests at the moment
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Hospital</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req: Request) => (
                    <tr key={req.uid} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">
                        {req.firstName} {req.lastName}
                      </td>
                      <td className="p-3">{req.email}</td>
                      <td className="p-3">{req.role}</td>
                      <td className="p-3">{req.hospital}</td>
                      <td className="p-3">{getStatusBadge(req.status)}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {req.createdAt.toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {req.status === 'Pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleApprove(req)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleReject(req)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
