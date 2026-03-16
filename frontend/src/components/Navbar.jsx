import { FaRobot } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <FaRobot />
        <span>AI Product Studio</span>
      </div>
    </nav>
  );
}

export default Navbar;