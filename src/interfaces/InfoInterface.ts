import {TypeInterface} from "./TypeInterface";

export interface InfoInterface {
  id?: number;
  type_id?: number;
  name?: string;
  amount?: number;
  price?: number;
  image?: string;
  image_url?: string;
  codes?: string;
  qr_code_images?: {id: string, code: string}[];
  type?: TypeInterface;
}
