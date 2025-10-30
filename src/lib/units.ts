import type { LucideIcon } from "lucide-react";
import { Ruler, Scale, Thermometer } from "lucide-react";

export type UnitCategory = "length" | "weight" | "temperature";

export type Unit = {
  name: string;
  abbreviation: string;
};

export const UNITS: Record<UnitCategory, { name: string; icon: LucideIcon; units: Unit[] }> = {
  length: {
    name: "Length",
    icon: Ruler,
    units: [
      { name: "Meters", abbreviation: "m" },
      { name: "Kilometers", abbreviation: "km" },
      { name: "Centimeters", abbreviation: "cm" },
      { name: "Millimeters", abbreviation: "mm" },
      { name: "Miles", abbreviation: "mi" },
      { name: "Yards", abbreviation: "yd" },
      { name: "Feet", abbreviation: "ft" },
      { name: "Inches", abbreviation: "in" },
    ],
  },
  weight: {
    name: "Weight",
    icon: Scale,
    units: [
      { name: "Kilograms", abbreviation: "kg" },
      { name: "Grams", abbreviation: "g" },
      { name: "Milligrams", abbreviation: "mg" },
      { name: "Pounds", abbreviation: "lb" },
      { name: "Ounces", abbreviation: "oz" },
    ],
  },
  temperature: {
    name: "Temperature",
    icon: Thermometer,
    units: [
      { name: "Celsius", abbreviation: "°C" },
      { name: "Fahrenheit", abbreviation: "°F" },
      { name: "Kelvin", abbreviation: "K" },
    ],
  },
};

const lengthConversionFactors: Record<string, number> = {
  Meters: 1, Kilometers: 1000, Centimeters: 0.01, Millimeters: 0.001,
  Miles: 1609.34, Yards: 0.9144, Feet: 0.3048, Inches: 0.0254,
};

const weightConversionFactors: Record<string, number> = {
  Kilograms: 1, Grams: 0.001, Milligrams: 0.000001,
  Pounds: 0.453592, Ounces: 0.0283495,
};

export function convert(value: number, fromUnit: string, toUnit: string, category: UnitCategory): number {
  if (fromUnit === toUnit) return value;

  if (category === "temperature") {
    let tempInC: number;
    switch (fromUnit) {
      case "Fahrenheit": tempInC = (value - 32) * 5 / 9; break;
      case "Kelvin": tempInC = value - 273.15; break;
      default: tempInC = value; 
    }
    switch (toUnit) {
      case "Fahrenheit": return (tempInC * 9 / 5) + 32;
      case "Kelvin": return tempInC + 273.15;
      default: return tempInC;
    }
  }

  const factors = category === "length" ? lengthConversionFactors : weightConversionFactors;
  const fromFactor = factors[fromUnit];
  const toFactor = factors[toUnit];
  
  if (fromFactor === undefined || toFactor === undefined) return NaN;

  const valueInBaseUnit = value * fromFactor;
  return valueInBaseUnit / toFactor;
}
