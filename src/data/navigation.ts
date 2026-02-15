export interface NavItem {
  label: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Boccia", href: "/boccia" },
  { label: "Rides & Events", href: "/rides-events" },
  { label: "News", href: "/blog" },
  { label: "Membership", href: "/membership" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
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
];
