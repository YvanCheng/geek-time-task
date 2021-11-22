export interface SidebarItemModel {
  icon: string;
  name: string;
  route: string;
  children?: SidebarItemModel[];
}
