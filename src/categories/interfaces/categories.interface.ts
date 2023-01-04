export interface CategoriesInterface {
  _id: string;
  category: string;
  description: string;
  events: Array<Event>;
}

interface Event {
  name: string;
  operetion: string;
  value: number;
}
