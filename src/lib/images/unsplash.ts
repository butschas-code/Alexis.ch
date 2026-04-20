/**
 * Kuratierte Unsplash-Bilder (editorial, ruhig, ohne Startup-Kitsch).
 * IDs stabil über unsplash.com; Parameter für konsistente Cropping.
 */
const q = "w=2000&q=80&auto=format&fit=crop";

export const editorialImages = {
  hero: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?${q}`,
  services: `https://images.unsplash.com/photo-1497366216548-37526070297c?${q}`,
  process: `https://images.unsplash.com/photo-1503387762-592deb58ef4e?${q}`,
  insights: `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?${q}`,
  about: `https://images.unsplash.com/photo-1522071820081-009f0129c71c?${q}`,
} as const;
