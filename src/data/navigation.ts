export interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
}

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Boccia", href: "/boccia" },
  { label: "Rides & Events", href: "/rides-events" },
  { label: "Membership", href: "/membership" },
  { label: "Contact", href: "/contact" },
  { label: "Sportive", href: "/sportive", highlight: true },
];

export const socialLinks = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/titanicquartercc/",
    icon: "instagram",
  },
  {
    platform: "Strava",
    url: "https://www.strava.com/clubs/110633",
    icon: "strava",
  },
  {
    platform: "GitHub",
    url: "https://github.com/neil-armstrong-fig/TQCC",
    icon: "github",
  },
];
