export interface AnimalType {
  id: string;
  name: string;
  age: string;
  register_date: string;
  adopted: boolean;
  description: string;
  photos?: string[];
  type: string;
  size: string;
}

export type TursoData = Omit<AnimalType, 'id' | 'register_date' | 'adopted'>;
