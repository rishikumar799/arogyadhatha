'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const dummyReceptionists = [
  { id: 'R001', name: 'Emily Stone', hospital: 'City Hospital' },
  { id: 'R002', name: 'David Black', hospital: 'Green Valley Clinic' },
];

export default function ReceptionistsPage() {
  const [search, setSearch] = useState('');

  const filtered = dummyReceptionists.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.hospital.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receptionists</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all registered receptionists
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Receptionist
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search receptionists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Receptionists Table */}
      <Card className="rounded-2xl border border-border bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle>All Registered Receptionists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Hospital</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`${
                      i % 2 === 0 ? 'bg-muted/20' : ''
                    } border-b hover:bg-muted/30 transition-colors`}
                  >
                    <td className="p-3 font-medium">{r.id}</td>
                    <td className="p-3 flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-blue-500" />
                      {r.name}
                    </td>
                    <td className="p-3">{r.hospital}</td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
