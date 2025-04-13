
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Users, Menu } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <div className="grid grid-cols-4 mx-auto max-w-md">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `nav-item ${isActive ? 'text-primary' : 'text-gray-600'}`
          }
        >
          <Home className="nav-icon" />
          <span>Home</span>
        </NavLink>
        
        <NavLink 
          to="/buy" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'text-primary' : 'text-gray-600'}`
          }
        >
          <ShoppingCart className="nav-icon" />
          <span>Buy</span>
        </NavLink>
        
        <NavLink 
          to="/team" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'text-primary' : 'text-gray-600'}`
          }
        >
          <Users className="nav-icon" />
          <span>Team</span>
        </NavLink>
        
        <NavLink 
          to="/menu" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'text-primary' : 'text-gray-600'}`
          }
        >
          <Menu className="nav-icon" />
          <span>Menu</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
