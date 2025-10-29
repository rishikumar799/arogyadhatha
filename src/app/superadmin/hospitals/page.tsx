'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreVertical, Hospital } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function HospitalsPage() {
  const [search, setSearch] = useState('');

  // Dummy hospital data
  const hospitals = [
    {
      id: 1,
      name: 'City Hospital',
      location: 'New York, USA',
      doctors: 45,
      patients: 120,
      subAdmin: 'Dr. Alice Smith',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sunrise Medical Center',
      location: 'Los Angeles, USA',
      doctors: 30,
      patients: 80,
      subAdmin: 'Dr. John Doe',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Green Valley Hospital',
      location: 'Chicago, USA',
      doctors: 25,
      patients: 65,
      subAdmin: 'Dr. Sarah Lee',
      status: 'Inactive',
    },
  ];

  const filtered = hospitals.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospitals (Sub Admins)</h1>
          <p className="text-muted-foreground mt-1">
            Manage hospitals, sub-admins, and their staff
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Hospital
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search hospitals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table View */}
      <Card className="border border-border bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Registered Hospitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40 dark:bg-neutral-800/50 text-muted-foreground">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Sub Admin</th>
                  <th className="text-center p-3">Doctors</th>
                  <th className="text-center p-3">Patients</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h, i) => (
                  <tr
                    key={h.id}
                    className={`${
                      i % 2 === 0 ? 'bg-muted/20 dark:bg-neutral-800/30' : ''
                    } border-b border-border hover:bg-muted/30 dark:hover:bg-neutral-800/50 transition-colors`}
                  >
                    <td className="p-3 font-medium flex items-center gap-2 text-foreground">
                      <Hospital className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      {h.name}
                    </td>
                    <td className="p-3 text-foreground">{h.location}</td>
                    <td className="p-3 text-foreground">{h.subAdmin}</td>
                    <td className="p-3 text-center text-foreground">{h.doctors}</td>
                    <td className="p-3 text-center text-foreground">{h.patients}</td>
                    <td className="p-3 text-center">
                      <Badge
                        className="px-2 py-1"
                        variant={h.status === 'Active' ? 'default' : 'destructive'}
                      >
                        {h.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
