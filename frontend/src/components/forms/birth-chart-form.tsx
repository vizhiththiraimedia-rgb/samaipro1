"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { useToast } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Clock, User } from "lucide-react";
import { useSearchParams } from "next/navigation";

const birthChartSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(2, "Birth place is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1, "Timezone is required"),
  country: z.string().min(2, "Country is required"),
  ayanamsa: z.enum(["lahiri", "raman", "krishnamurti", "true_chitrapaksha", "western_tropical", "sidereal"]),
  chartSystem: z.enum(["south_indian", "north_indian", "western_circular", "kp"]),
});

type BirthChartFormData = z.infer<typeof birthChartSchema>;

export function BirthChartForm() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [locations, setLocations] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BirthChartFormData>({
    resolver: zodResolver(birthChartSchema),
    defaultValues: {
      fullName: searchParams.get("name") || "",
      gender: (searchParams.get("gender") as any) || "male",
      dateOfBirth: searchParams.get("dob") || "",
      birthTime: searchParams.get("time") || "",
      birthPlace: searchParams.get("place") || "",
      latitude: 6.9271, // default Colombo for demo
      longitude: 79.8612,
      timezone: "Asia/Colombo",
      country: "Sri Lanka",
      ayanamsa: "lahiri",
      chartSystem: "south_indian",
    },
  });

  const birthPlaceValue = watch("birthPlace");


  
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!birthPlaceValue || birthPlaceValue.length < 2) {
        setLocations([]);
        return;
      }
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(birthPlaceValue)}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          setLocations(data.results);
          setShowDropdown(true);
        }
      } catch (e) {
        console.error(e);
      }
    };
    const timer = setTimeout(fetchLocations, 400);
    return () => clearTimeout(timer);
  }, [birthPlaceValue]);

  const handleSelectLocation = (loc: any) => {
    setValue("birthPlace", loc.name + (loc.admin1 ? ", " + loc.admin1 : ""));
    setValue("latitude", parseFloat(loc.latitude.toFixed(4)));
    setValue("longitude", parseFloat(loc.longitude.toFixed(4)));
    if (loc.timezone) setValue("timezone", loc.timezone);
    if (loc.country) setValue("country", loc.country);
    setShowDropdown(false);
  };


  

  const onSubmit = async (data: BirthChartFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/charts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to generate chart");

      const result = await response.json();
      addToast({ title: "Chart Generated", description: "Your birth chart has been created successfully", variant: "success" });
      window.location.href = `/modules/astrology-studio/charts/${result.data.id}`;
    } catch (error) {
      addToast({ title: "Error", description: error instanceof Error ? error.message : "Failed to generate chart", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input label={language === "si" ? "සම්පූර්ණ නම" : "Full Name"} {...register("fullName")} error={errors.fullName?.message} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{language === "si" ? "ස්ත්‍රී / පුරුෂ භාවය" : "Gender"} *</label>
          <select {...register("gender")} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="male">{language === "si" ? "පුරුෂ" : "Male"}</option>
            <option value="female">{language === "si" ? "ස්ත්‍රී" : "Female"}</option>
            <option value="other">{language === "si" ? "වෙනත්" : "Other"}</option>
          </select>
        </div>
        <Input label={language === "si" ? "උපන් දිනය" : "Date of Birth"} type="date" {...register("dateOfBirth")} error={errors.dateOfBirth?.message} required />
        <Input label={language === "si" ? "උපන් වේලාව" : "Birth Time"} type="time" {...register("birthTime")} error={errors.birthTime?.message} required />
        
        <div className="relative" ref={dropdownRef}>
          <Input 
            label={language === "si" ? "උපන් ස්ථානය" : "Birth Place"} 
            {...register("birthPlace")} 
            error={errors.birthPlace?.message} 
            required 
            autoComplete="off"
            onFocus={() => { if(locations.length > 0) setShowDropdown(true); }}
          />
          {showDropdown && locations.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {locations.map((loc, i) => (
                <div 
                  key={i} 
                  className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                  onClick={() => handleSelectLocation(loc)}
                >
                  <div className="font-medium">{loc.name}</div>
                  <div className="text-xs text-muted-foreground">{loc.admin1 ? loc.admin1 + ', ' : ''}{loc.country}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Input label={language === "si" ? "අක්ෂාංශ" : "Latitude"} type="number" step="any" {...register("latitude", { valueAsNumber: true })} error={errors.latitude?.message} required />
        <Input label={language === "si" ? "දේශාංශ" : "Longitude"} type="number" step="any" {...register("longitude", { valueAsNumber: true })} error={errors.longitude?.message} required />
        <Input label={language === "si" ? "වේලා කලාපය" : "Timezone"} {...register("timezone")} error={errors.timezone?.message} required />
        <Input label={language === "si" ? "රට" : "Country"} {...register("country")} error={errors.country?.message} required />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{language === "si" ? "අයනාංශය" : "Ayanamsa"} *</label>
          <select {...register("ayanamsa")} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="lahiri">Lahiri</option>
            <option value="raman">Raman</option>
            <option value="krishnamurti">Krishnamurti (KP)</option>
            <option value="true_chitrapaksha">True Chitrapaksha</option>
            <option value="western_tropical">Western Tropical</option>
            <option value="sidereal">Sidereal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{language === "si" ? "සටහන් පද්ධතිය" : "Chart System"} *</label>
          <select {...register("chartSystem")} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="south_indian">South Indian</option>
            <option value="north_indian">North Indian</option>
            <option value="western_circular">Western Circular</option>
            <option value="kp">KP Chart</option>
          </select>
        </div>
      </div>
      <Button type="submit" variant="cosmic" size="lg" className="w-full" isLoading={isLoading}>
        {language === "si" ? "කේන්ද්‍රය සාදන්න" : "Generate Chart"}
      </Button>
    </form>
  );
}
