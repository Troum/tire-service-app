import {TypeInterface} from "./TypeInterface";

export interface InfoInterface {
  id?: number;
  type_id?: number;
  name?: string;
  amount?: number;
  price?: number;
  image?: string;
  image_url?: string;
  type?: TypeInterface;
}
