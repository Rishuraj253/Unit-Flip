'use client';

import { useState, useEffect, useCallback } from 'react';
import UnitConverter from '@/components/unit-converter';
import ConversionHistory from '@/components/conversion-history';
import FavoriteConversions from '@/components/favorite-conversions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnitCategory } from '@/lib/units';
import { Replace, History, Star } from 'lucide-react';

export type ConversionRecord = {
  id: string;
  from: { value: string; unit: string };
  to: { value: string; unit: string };
  category: UnitCategory;
  timestamp: number;
};

export type Favorite = {
  from: string;
  to: string;
  category: UnitCategory;
};

const HISTORY_STORAGE_KEY = 'unitflip-history';
const FAVORITES_STORAGE_KEY = 'unitflip-favorites';

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('Meters');
  const [toUnit, setToUnit] = useState<string>('Feet');
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
    }
  }, [history, isMounted]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
      }
    }
  }, [favorites, isMounted]);
  
  const handleAddConversion = useCallback((record: Omit<ConversionRecord, 'id' | 'timestamp'>) => {
    setHistory(prev => [{ ...record, id: crypto.randomUUID(), timestamp: Date.now() }, ...prev.slice(0, 49)]);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleToggleFavorite = useCallback((fav: Favorite) => {
    setFavorites(prev => {
      const isFavorited = prev.some(f => f.from === fav.from && f.to === fav.to && f.category === fav.category);
      if (isFavorited) {
        return prev.filter(f => !(f.from === fav.from && f.to === fav.to && f.category === fav.category));
      } else {
        return [fav, ...prev];
      }
    });
  }, []);

  const handleSelectFavorite = useCallback((fav: Favorite) => {
    setCurrentCategory(fav.category);
    setFromUnit(fav.from);
    setToUnit(fav.to);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Replace className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold font-headline text-primary">UnitFlip</h1>
          </div>
          <p className="text-muted-foreground text-lg">Instant Conversions for Length, Weight, and Temperature</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <UnitConverter
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
              fromUnit={fromUnit}
              setFromUnit={setFromUnit}
              toUnit={toUnit}
              setToUnit={setToUnit}
              onConvert={handleAddConversion}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">
                  <History className="mr-2 h-4 w-4" /> History
                </TabsTrigger>
                <TabsTrigger value="favorites">
                  <Star className="mr-2 h-4 w-4" /> Favorites
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history">
                <ConversionHistory
                  history={history}
                  onClear={handleClearHistory}
                  onAddFavorite={handleToggleFavorite}
                />
              </TabsContent>
              <TabsContent value="favorites">
                <FavoriteConversions
                  favorites={favorites}
                  onRemove={handleToggleFavorite}
                  onSelect={handleSelectFavorite}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
