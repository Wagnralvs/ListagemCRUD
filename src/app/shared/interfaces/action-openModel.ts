import { LabelNameModel } from "./label-name-model";
import { Item } from "./list-items";

export interface ActionModel {
  isOpen: boolean;
  label: LabelNameModel;
  updateLoadingModal?: boolean;
  item?: Item;
}
