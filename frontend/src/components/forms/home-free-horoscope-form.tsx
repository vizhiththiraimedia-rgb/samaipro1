"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

export function HomeFreeHoroscopeForm() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    time: "",
    place: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (formData.name) query.append("name", formData.name);
    if (formData.gender) query.append("gender", formData.gender);
    if (formData.dob) query.append("dob", formData.dob);
    if (formData.time) query.append("time", formData.time);
    if (formData.place) query.append("place", formData.place);
    
    router.push(`/free-horoscope?${query.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* {language === "si" ? "නම සහ ස්ත්‍රී/පුරුෂ භාවය" : t("form.nameGender")} */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground">{language === "si" ? "නම සහ ස්ත්‍රී/පුරුෂ භාවය" : t("form.nameGender")}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="name" value={formData.name} onChange={handleChange} placeholder={language === "si" ? "ඔබගේ නම මෙතැනට" : t("form.placeholderName")} className="h-11 bg-white border-border text-foreground text-sm min-w-0" />
          <div className="flex bg-muted rounded-md border border-border p-1 h-11 min-w-0">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, gender: 'male'})} 
              className={`flex-1 text-sm font-medium rounded-sm transition-colors ${formData.gender === 'male' ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-foreground hover:bg-white/50'}`}
            >
              {language === "si" ? "පුරුෂ" : t("form.male")}
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, gender: 'female'})} 
              className={`flex-1 text-sm font-medium rounded-sm transition-colors ${formData.gender === 'female' ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-foreground hover:bg-white/50'}`}
            >
              {language === "si" ? "ස්ත්‍රී" : t("form.female")}
            </button>
          </div>
        </div>
      </div>

      {/* {language === "si" ? "උපන් විස්තර" : t("form.birthDetails")} */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground">{language === "si" ? "උපන් විස්තර" : t("form.birthDetails")}</label>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4 flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground mb-1 font-semibold uppercase text-center tracking-wider">{language === "si" ? "දිනය" : t("form.date")}</span>
            <Input name="dob" type="date" value={formData.dob} onChange={handleChange} className="h-11 bg-white border-border text-foreground w-full px-2 text-sm min-w-0" />
          </div>
          <div className="sm:col-span-4 flex flex-col min-w-0">
             <span className="text-[10px] text-muted-foreground mb-1 font-semibold uppercase text-center tracking-wider">{language === "si" ? "වේලාව" : t("form.time")}</span>
             <Input name="time" type="time" value={formData.time} onChange={handleChange} className="h-11 bg-white border-border text-foreground w-full px-1 sm:px-2 text-sm min-w-0" />
          </div>
          <div className="sm:col-span-4 flex flex-col min-w-0">
             <span className="text-[10px] text-muted-foreground mb-1 font-semibold uppercase text-center tracking-wider">{language === "si" ? "ස්ථානය" : t("form.place")}</span>
            <Input name="place" value={formData.place} onChange={handleChange} placeholder={language === "si" ? "ලිවීම අරඹන්න..." : t("form.placeholderPlace")} className="h-11 bg-white border-border text-foreground px-2 text-sm min-w-0" />
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Button type="submit" className="w-full sm:w-auto px-10 bg-[#FF9900] hover:bg-[#E68A00] text-black font-bold rounded-full h-12 text-sm sm:text-base shadow-md border border-[#CC7A00]">
          {language === "si" ? "භාෂාව තෝරා නොමිලේ පලාඵල ලබාගන්න ▶▶" : t("form.submitFree")}
        </Button>
      </div>
    </form>
  );
}
