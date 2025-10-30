"use client";

import type { Favorite } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Star as StarIcon, ArrowRight } from "lucide-react";

interface FavoriteConversionsProps {
  favorites: Favorite[];
  onRemove: (fav: Favorite) => void;
  onSelect: (fav: Favorite) => void;
}

export default function FavoriteConversions({ favorites, onRemove, onSelect }: FavoriteConversionsProps) {
  return (
    <Card className="h-[34rem]">
      <CardHeader>
        <CardTitle>Favorite Conversions</CardTitle>
      </CardHeader>
      <CardContent className="h-[28rem] p-0">
        <ScrollArea className="h-full">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <StarIcon className="h-12 w-12 mb-4" />
              <p>You have no favorite conversions.</p>
              <p className="text-sm">Click the star to save a pair.</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {favorites.map((fav, index) => (
                <div key={`${fav.from}-${fav.to}-${fav.category}`} className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <button className="flex-grow text-left" onClick={() => onSelect(fav)}>
                    <div className="text-xs text-muted-foreground">{fav.category}</div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{fav.from}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{fav.to}</span>
                    </div>
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => onRemove(fav)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
