import { FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Header({ toggleSidebar }) {
    const { email } = useSelector((state) => state.user);
    const role = localStorage.getItem('role')
    return (
        <div className="sticky bg-[#D9D9D9] top-0 z-[3] flex items-center justify-between [box-shadow:0px_4px_4px_0px_#00000040_inset] w-full shadow-md">
            <img src='https://res.cloudinary.com/dhhxki61s/image/upload/v1736436140/header_ezvaag.jpg' alt='header' className='filter brightness-[50%] h-[10vh] w-full object-cover'></img>
            <div className="absolute left-[2vw] flex items-center gap-2 text-2xl font-semibold text-[#282828] w-[80%] uppercase">
                <div className="lg:hidden rounded flex items-center justify-center text-white">
                    <FaBars className="text-xl" onClick={toggleSidebar} />
                </div>
                <h3 className='w-full text-white italic font-bold text-2xl md:drop-shadow-[5px_5px_2px_black] drop-shadow-[3px_3px_2px_black]'>WELCOME {role}!</h3>
            </div>
            <img
                className='absolute right-[2vw] md:w-12 w-8 md:h-12 h-8 rounded-full md:ml-0 ml-auto [box-shadow:rgba(0,_0,_0,_0.35)_0px_5px_15px]'
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${email[0] + email[1]}`}
                alt="Profile Picture"
            />
        </div>
    )
}