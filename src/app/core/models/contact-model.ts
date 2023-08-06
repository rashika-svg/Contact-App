import { IGroup } from "./group";

export interface IContact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  mobile: string;
  company: string;
  title: string;
  groupId: IGroup;
  recycled: boolean;
}