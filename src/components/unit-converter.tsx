"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UNITS, UnitCategory, convert } from "@/lib/units";
import type { Favorite } from "@/app/page";
import { ArrowRightLeft, Eraser, Delete, Star } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface UnitConverterProps {
  currentCategory: UnitCategory;
  setCurrentCategory: (category: UnitCategory) => void;
  fromUnit: string;
  setFromUnit: (unit: string) => void;
  toUnit: string;
  setToUnit: (unit: string) => void;
  onConvert: (record: Omit<Favorite, 'id' | 'timestamp'> & { from: { value: string }, to: { value: string } }) => void;
  favorites: Favorite[];
  onToggleFavorite: (fav: Favorite) => void;
}

export default function UnitConverter({
  currentCategory, setCurrentCategory, fromUnit, setFromUnit,
  toUnit, setToUnit, onConvert, favorites, onToggleFavorite
}: UnitConverterProps) {
  const [inputValue, setInputValue] = useState("1");
  const [outputValue, setOutputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);

  const currentUnits = UNITS[currentCategory].units;

  useEffect(() => {
    const numValue = parseFloat(debouncedInputValue);
    if (!isNaN(numValue)) {
      const result = convert(numValue, fromUnit, toUnit, currentCategory);
      let formattedResult;
      if (Math.abs(result) > 1e9 || (Math.abs(result) < 1e-4 && result !== 0)) {
        formattedResult = result.toExponential(4);
      } else {
        const decimalPlaces = Math.max(0, 4 - Math.floor(Math.log10(Math.abs(result) || 1)));
        formattedResult = result.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: decimalPlaces,
        });
      }
      setOutputValue(formattedResult);
      onConvert({
        from: { value: debouncedInputValue, unit: fromUnit },
        to: { value: formattedResult, unit: toUnit },
        category: currentCategory,
      });
    } else {
      setOutputValue("");
    }
  }, [debouncedInputValue, fromUnit, toUnit, currentCategory, onConvert]);

  useEffect(() => {
    const units = UNITS[currentCategory].units.map(u => u.name);
    if (!units.includes(fromUnit)) setFromUnit(units[0]);
    if (!units.includes(toUnit)) setToUnit(units[1] || units[0]);
  }, [currentCategory, fromUnit, toUnit, setFromUnit, setToUnit]);

  const handleCategoryChange = (category: UnitCategory) => {
    setCurrentCategory(category);
    setInputValue("1");
  };
  
  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(outputValue.replace(/,/g, ''));
  };

  const handleKeypadPress = (key: string) => {
    if (key === 'C') {
      setInputValue("0");
    } else if (key === '⌫') {
      setInputValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === '.') {
      if (!inputValue.includes('.')) setInputValue(prev => prev + '.');
    } else {
      setInputValue(prev => (prev === '0' && key !== '.') ? key : prev + key);
    }
  };
  
  const isCurrentFavorite = useMemo(() => {
    return favorites.some(f => f.from === fromUnit && f.to === toUnit && f.category === currentCategory);
  }, [favorites, fromUnit, toUnit, currentCategory]);

  const keypadLayout = [
    ['7', '8', '9', 'C'],
    ['4', '5', '6', '⌫'],
    ['1', '2', '3', ''],
    ['0', '.', '', '']
  ];

  const getUnitAbbr = (unitName: string) => UNITS[currentCategory]?.units.find(u => u.name === unitName)?.abbreviation || '';

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Unit Converter</CardTitle>
          <div className="flex space-x-1">
            {Object.keys(UNITS).map(key => {
              const category = key as UnitCategory;
              const { name, icon: Icon } = UNITS[category];
              return (
                <Button key={category} variant={currentCategory === category ? 'default' : 'ghost'} size="sm" onClick={() => handleCategoryChange(category)}>
                  <Icon className="h-4 w-4 mr-2" /> {name}
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg space-y-2 text-right transition-all duration-300">
          <div className="flex items-baseline justify-end gap-2 text-muted-foreground text-3xl">
            <span className="truncate max-w-[70%]">{inputValue}</span>
            <span>{getUnitAbbr(fromUnit)}</span>
          </div>
          <div className="flex items-baseline justify-end gap-2 text-foreground font-bold text-5xl">
            <span className="truncate max-w-[70%] transition-opacity duration-300">{outputValue || "..."}</span>
            <span>{getUnitAbbr(toUnit)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{currentUnits.map(u => <SelectItem key={u.name} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={handleSwapUnits}><ArrowRightLeft className="h-5 w-5" /></Button>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{currentUnits.map(u => <SelectItem key={u.name} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => onToggleFavorite({ from: fromUnit, to: toUnit, category: currentCategory })}>
            <Star className={`h-5 w-5 ${isCurrentFavorite ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {keypadLayout.flat().map((key, i) => (
            key === '' ? <div key={i}></div> :
            <Button
              key={key}
              variant={key === 'C' || key === '⌫' ? 'secondary' : 'outline'}
              className="h-16 text-2xl font-bold"
              onClick={() => handleKeypadPress(key)}
            >
              {key === 'C' ? <Eraser /> : key === '⌫' ? <Delete /> : key}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
