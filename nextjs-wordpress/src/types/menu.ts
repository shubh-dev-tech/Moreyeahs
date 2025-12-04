export interface MenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
  parent: number;
  order: number;
  classes: string;
  children: MenuItem[];
}

export interface Menu {
  id: number;
  name: string;
  slug: string;
  location?: string;
  items: MenuItem[];
}
