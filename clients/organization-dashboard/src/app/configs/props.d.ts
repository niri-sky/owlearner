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

// tabs props
type ProfileTabsProps = {
  children: ReactNode;
};

// tab props
type ProfileTabProps = {
  label: string;
  subCount?: string;
  children: ReactNode;
};

// admin sidebar menu props
type AdminSidebarMenuProps = {
  isCollapsed: boolean;
  selected: boolean | string;
  setSelected: ReactAction;
  logoutHandler: () => void;
};
// custom modal prop types
type FollowersModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  data: FollowersUserDataType[];
};
