import NavItem from "./NavItem";

import LogoutButton from "./LogoutButton";

const NavList = ({ items, pathname, collapsed }) => {
  return (
    <nav className="space-y-2 mt-[4rem]">
      {items.map((item, idx) => (
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
      ))}
      <LogoutButton collapsed={collapsed} />
    </nav>
  );
};

export default NavList;
