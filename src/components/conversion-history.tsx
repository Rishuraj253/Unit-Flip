"use client";

import type { ConversionRecord, Favorite } from "@/app/page";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Star, History as HistoryIcon, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ConversionHistoryProps {
  history: ConversionRecord[];
  onClear: () => void;
  onAddFavorite: (fav: Favorite) => void;
}

export default function ConversionHistory({ history, onClear, onAddFavorite }: ConversionHistoryProps) {
  return (
    <Card className="h-[34rem]">
      <CardHeader>
        <CardTitle>Conversion History</CardTitle>
      </CardHeader>
      <CardContent className="h-[24rem] p-0">
        <ScrollArea className="h-full">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <HistoryIcon className="h-12 w-12 mb-4" />
              <p>Your conversion history is empty.</p>
              <p className="text-sm">Perform a conversion to see it here.</p>
            </div>
          ) : (
            <div className="p-6 pt-0">
              {history.map((record, index) => (
                <div key={record.id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{record.from.value} {record.from.unit}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{record.to.value} {record.to.unit}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onAddFavorite({ from: record.from.unit, to: record.to.unit, category: record.category })}>
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  {index < history.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onClear} disabled={history.length === 0}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear History
        </Button>
      </CardFooter>
    </Card>
  );
}
