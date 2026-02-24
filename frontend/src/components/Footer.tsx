"use client";

import React from "react";
import { Link } from "@heroui/react";

export const Footer = () => {
  return (
    <footer className="bg-foreground py-16 px-6 text-center text-secondary-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6 text-secondary-100 text-2xl font-bold opacity-90">
          <span className="material-symbols-outlined">home_work</span>
          GarantEasy
        </div>
        <p className="mb-8">© {new Date().getFullYear()} GarantEasy. Tous droits réservés.</p>
        <div className="flex justify-center flex-wrap gap-6">
          <Link href="/rgpd" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">policy</span>
            Politique de confidentialité
          </Link>
          <Link href="/rgpd" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">gavel</span>
            RGPD
          </Link>
        </div>
      </div>
    </footer>
  );
};
