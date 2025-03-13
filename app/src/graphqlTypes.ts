export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    boats: IBoat[];
  }

export interface IBoat {
    id: number;
    name: string;
    type: string;
    owner: number;
    taxes: Tax[];
  }

export interface Tax {
    id: number;
    price: number;
    boatId: number;
    date: string;    
}