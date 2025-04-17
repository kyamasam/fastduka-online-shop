import { type IMenuItem, type IMobileType } from "@/types/menu-d-type";

export const menu_data: IMenuItem[] = [
  {
    id: 1,
    link: "/",
    title: "Home",
  },
  {
    id: 2,
    link: "/shop",
    title: "Shop",
  },
  {
    id: 3,
    link: "/shop-liquor",
    title: "Liquor Shop",
  },
  {
    id: 5,
    link: "/cart",
    title: "Cart",
  },
  {
    id: 6,
    link: "/orders",
    title: "Orders",
  },
  // {
  //   id: 6,
  //   link: "/contact",
  //   title: "Contact",
  // },
];

// mobile menu data
export const mobile_menu: IMobileType[] = [
  {
    id: 1,
    link: "/",
    title: "Home",
  },
  {
    id: 2,
    link: "/shop",
    title: "Shop",
  },
  {
    id: 2,
    link: "/shop-liquor",
    title: "Liquor Shop",
  },
  {
    id: 5,
    link: "/cart",
    title: "Cart",
  },
];
