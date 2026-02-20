import NavItem from "./NavItem";

import LogoutButton from "./LogoutButton";
import { useSelector } from "react-redux";
import { off } from "process";

const NavList = ({ items, pathname, collapsed }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <nav className="space-y-2 mt-[4rem] border border-none">
      {items.map((item, idx) => {
        if (user && item.label === "Login") return null;
        return (
          <NavItem
            key={idx}
            icon={item.icon}
            label={item.label}
            route={item.route}
            isActive={pathname === item.route}
            isButton={item.isButton}
            onClick={item.action}
            collapsed={collapsed}
          />
        );
      })}
      {user && <LogoutButton collapsed={collapsed} />}
    </nav>
  );
};

export default NavList;
