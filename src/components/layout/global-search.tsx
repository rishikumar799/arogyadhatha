
'use client';

import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import keywords from '@/lib/keywords.json';
import { useIsMobile } from '@/hooks/use-mobile';
import { allMenuItems } from '@/lib/nav-config';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  const handleSelect = (path: string) => {
      setOpen(false);
      router.push(path);
  }

  return (
    <>
      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full text-primary-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="relative h-10 w-full max-w-xl justify-start rounded-full bg-background/80 border-primary-foreground/30 text-sm text-muted-foreground hover:bg-background/90 hover:text-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="h-5 w-5 mr-2" />
          Search for doctors, medicines, reports...
           <kbd className="pointer-events-none absolute right-4 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-sm font-medium opacity-100 sm:flex">
            <span className="text-lg">⌘</span>K
          </kbd>
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {allMenuItems.slice(0, 5).map(item => (
                 <CommandItem key={item.href} onSelect={() => handleSelect(item.href)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{language === 'en' ? item.label : item.telugu}</span>
                </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Keywords">
            {keywords.slice(0, 100).map((keyword) => (
              <CommandItem key={keyword} onSelect={() => handleSelect('/health-knowledge')}>
                <span>{keyword}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
