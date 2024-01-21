import { IGroup } from "./group";

export interface IContact {
  id: string;
  name: string;
  email: string;
  mobile: string;
  nickName: string;
  dob: Date,
  avatar: string;
  company: ICompany;
  title: string;
  groupId: IGroup;
  recycled: boolean;
  age: number;
  address: IAddress
  customLinks: []
  height: string;
  language: string[];
  specialDatesGroup: ISpecialDatesGroup
}

export interface IAddress {
  line1: string;
  line2: string;
  pinCode: number,
  state: string;
  city: string;
}

export interface ICompany {
  company: string;
  department: string;
  title: string;
}
export interface ISpecialDatesGroup {
  label: string;
  specialDates: Date;
}