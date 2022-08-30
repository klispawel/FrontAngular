import { CashRate } from "./CashRate";
import { Product } from "./product";

export class ProductPage {
  products! : Product[];
  pageIndex! : number;
  totalCount! : number;
  pageCount!: number;
  cashRate!: CashRate;
}
