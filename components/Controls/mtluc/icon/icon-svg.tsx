import { buildClass } from "../base/common";

export type IconKeys =
  | "user"
  | "plus"
  | "setting"
  | "bell"
  | "change-password"
  | "logout"
  | "user-group"
  | "home"
  | "invitation"
  | "guestbook"
  | "bus"
  | "view"
  | "edit"
  | "delete"
  | "reload"
  | "close"
  | "check"
  | "warning"
  | "question"
  | "save"
  | "duplicate"
  | "menu"
  | "search"
  | "filter"
  | "share"
  | "phone"
  | "email";

const IconSvg = ({
  iconKeys,
  className,
}: {
  iconKeys: IconKeys;
  className?: string;
}) => {
  return (
    <svg className={buildClass(["icon-svg", className])}>
      <use xlinkHref={`/images/icon/sprite.svg?v=202401080851#${iconKeys}`} />
    </svg>
  );
};
export default IconSvg;
