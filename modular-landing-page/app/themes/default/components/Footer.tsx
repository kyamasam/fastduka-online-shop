'use client';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useSocialLinks, useSettings } from '@/store/settings.store';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.81 1.54V6.78a4.85 4.85 0 0 1-1.04-.09z" />
    </svg>
  );
}

export default function Footer() {
  const social = useSocialLinks();
  const settings = useSettings();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        {(social.facebook || social.twitter || social.instagram || social.youtube || social.tiktok) && (
          <div className="flex justify-center gap-4 mb-4">
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            )}
            {social.tiktok && (
              <a href={social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-gray-300 transition-colors">
                <TikTokIcon className="w-6 h-6" />
              </a>
            )}
          </div>
        )}
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} {settings?.title || 'FastDuka'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
