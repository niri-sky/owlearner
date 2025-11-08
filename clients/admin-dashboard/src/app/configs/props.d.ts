type ReactAction = React.Dispatch<React.SetStateAction<any>>;

// admin sidebar elements
type AdminLayoutProps = {
  children: React.ReactNode;
};
// admin sidebar item types
type AdminSidebarItemProps = {
  title: string;
  to?: string;
  icon: JSX.Element;
  selected: boolean | string;
  setSelected: any;
};
// admin sidebar top props
type AdminSidebarTopProps = {
  isCollapsed: boolean;
  setIsCollapsed: ReactAction;
};

// admin sidebar menu props
type AdminSidebarMenuProps = {
  isCollapsed: boolean;
  selected: boolean | string;
  setSelected: ReactAction;
  logoutHandler: () => void;
};
