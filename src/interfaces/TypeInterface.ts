import {SizeInterface} from "./SizeInterface";

export interface TypeInterface {
  id?: number;
  size_id?: number;
  type?: string;
  season?: string;
  size?: SizeInterface
}
