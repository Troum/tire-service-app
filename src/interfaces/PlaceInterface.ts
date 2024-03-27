export interface PlaceInterface {
  id?: number;
  name?: number;
  address?: string;
  seasons?:{
    winter?: number,
    summer?: number,
    all?: number,
  }
}
