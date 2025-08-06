import { useState, useEffect } from 'react';

export interface ContactSettings {
  contact_phone?: string;
  contact_phone_display?: string;
  contact_whatsapp?: string;
  contact_facebook?: string;
  contact_zalo?: string;
  contact_email?: string;
  contact_address?: string;
  contact_map_url?: string;
}

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      } else {
        setError('Failed to fetch settings');
      }
    } catch (err) {
      setError('Error fetching settings');
      console.error('Error fetching contact settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, refetch: fetchSettings };
}

// Helper functions for common contact actions
export const contactHelpers = {
  getPhoneNumber: (settings: ContactSettings) => 
    settings.contact_phone_display || settings.contact_phone || '',
  
  getPhoneLink: (settings: ContactSettings) => 
    settings.contact_phone ? `tel:${settings.contact_phone}` : '',
  
  getWhatsAppLink: (settings: ContactSettings) => 
    settings.contact_whatsapp || '',
  
  getFacebookLink: (settings: ContactSettings) => 
    settings.contact_facebook || '',
  
  getZaloLink: (settings: ContactSettings) => 
    settings.contact_zalo || '',
  
  getEmailLink: (settings: ContactSettings) => 
    settings.contact_email ? `mailto:${settings.contact_email}` : '',
  
  getMapLink: (settings: ContactSettings) => 
    settings.contact_map_url || '',
  
  getAddress: (settings: ContactSettings) => 
    settings.contact_address || ''
}; 