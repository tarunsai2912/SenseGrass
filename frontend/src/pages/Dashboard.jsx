import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { MdPayments } from "react-icons/md";
import { IoAnalytics } from "react-icons/io5";
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Header from "../components/Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (!token || !user) {
      const sessionExpired = async () => {
        dispatch(logout());
        toast.error('Session Expired');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      };
      sessionExpired();
    }
  }, [token, user, navigate, dispatch]);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      toast.success("User logged out successfully");
      navigate("/login");
    } 
    catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const navLinks = [
    { title: "Field Manager", to: "/", icon: FaHome },
    { title: "Visualization", to: "/visuals", icon: IoAnalytics },
    { title: "Subscribe", to: "/payment", icon: MdPayments }
  ];

  const getActiveIndex = () => {
    const currentPath = location.pathname;
    const activeLink = navLinks.findIndex((link) => link.to === currentPath);
    return activeLink !== -1 ? activeLink : 0;
  };

  const activeIndex = getActiveIndex();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    {token && <div className="flex h-screen overflow-hidden">
      <div 
        className={`fixed inset-y-0 left-0 bg-[#716262] shadow-lg w-64 transform z-10 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:relative md:translate-x-0`}
      >
        <img src='https://res.cloudinary.com/dhhxki61s/image/upload/v1736436173/sidebar_diic5k.jpg' alt="sidebar" className="filter brightness-[50%] h-full object-cover"></img>
        <div className="absolute top-0 flex items-center justify-between md:px-4 px-2 py-1">
          <div className="flex items-center md:gap-4 gap-2">
            <img className="w-20 mt-4 rounded-full" src='https://res.cloudinary.com/dhhxki61s/image/upload/v1736439161/sensegrass_logo_roqfre.png' alt="Logo" />
            <span className="md:text-4xl font-bold text-2xl md:drop-shadow-[5px_5px_2px_black] drop-shadow-[3px_3px_2px_black] text-white italic">Sense Green</span>
            <IoMdClose className="md:hidden text-white" size={40} onClick={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        <nav className="absolute top-[15vh] mt-10 px-5 w-full">
          <ul className="space-y-5">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`italic flex items-center gap-4 px-4 py-3 rounded-lg  font-medium ${activeIndex === index
                  ? "bg-[#343234] text-white"
                  : "text-gray-700 hover:bg-[#343234] bg-white hover:text-white"
                  }`}
                onClick={() => setIsSidebarOpen(false)} 
              >
                <link.icon className="text-lg" />
                {link.title}
              </Link>
            ))}
          </ul>
        </nav>

        <div onClick={() => setIsOpen(true)} className="absolute flex items-center gap-4 px-7 py-3 rounded-lg font-medium text-gray-700 bg-white hover:bg-[#343234] hover:text-white bottom-10 left-5 cursor-pointer">
          <button
            className="flex items-center gap-2 italic"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      <div
        className={`flex-1 bg-gray-100 transition-opacity duration-300 ${isSidebarOpen ? "opacity-50" : "opacity-100"
          } overflow-y-auto hideScroll`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <Outlet />
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center p-6">
            <p className="text-lg font-semibold">Are you sure?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-[50%]"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-[50%]"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>}
    </>
  );
};

export default Dashboard;