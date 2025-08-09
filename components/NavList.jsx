import NavItem from "./NavItem";

const NavList = ({ items, pathname, collapsed }) => {
  return (
    <nav className="space-y-2">
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
    </nav>
  );
};

export default NavList;
