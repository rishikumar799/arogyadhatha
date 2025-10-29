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

const dummyLabTechs = [
  { id: 'L001', name: 'Michael Green', department: 'Hematology', hospital: 'City Hospital' },
  { id: 'L002', name: 'Laura White', department: 'Microbiology', hospital: 'Green Valley Clinic' },
];

export default function DiagnosticsPage() {
  const [search, setSearch] = useState('');

  const filtered = dummyLabTechs.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.department.toLowerCase().includes(search.toLowerCase()) ||
      l.hospital.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diagnostics</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all registered diagnostics staff
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Diagnostics Staff
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
          <Input
          placeholder="Search diagnostics staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

  {/* Diagnostics Staff Table */}
      <Card className="rounded-2xl border border-border bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm">
          <CardHeader>
          <CardTitle>All Registered Diagnostics Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Department</th>
                  <th className="text-left p-3">Hospital</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr
                    key={l.id}
                    className={`${
                      i % 2 === 0 ? 'bg-muted/20' : ''
                    } border-b hover:bg-muted/30 transition-colors`}
                  >
                    <td className="p-3 font-medium">{l.id}</td>
                    <td className="p-3 flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-blue-500" />
                      {l.name}
                    </td>
                    <td className="p-3">{l.department}</td>
                    <td className="p-3">{l.hospital}</td>
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
