type RatingProps = {
  maxStars: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  isClickable?: boolean;
  iconSize?: string;
};

// tabs props
type CoursesTabsProps = {
  children: ReactNode;
};
// tab props
type CoursesTabProps = {
  label: string;
  subCount?: string;
  children: ReactNode;
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

// course progress card props
type CourseProgressCardProps = {
  title: string;
  event: string | number;
  icon: any;
};

// custom modal prop types
type FollowersModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  data: FollowersUserDataType[];
};
