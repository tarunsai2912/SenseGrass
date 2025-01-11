import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Logo from '../assets/sensegrass_logo.jpg';
import { AUTH_ENDPOINTS } from '../utility/url';
import { isValidCredentials } from '../utility/isValidCredentials';
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token, error } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [see, setSee] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const { name, email, password, role } = formData;
        setIsDisabled(!name || !email || !password || !role);
    }, [formData]);


    useEffect(() => {
        if (user && token) {
            navigate('/');
        }
    }, [user, token, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, role } = formData;

        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        if (!formData.role) {
            newErrors.role = "Please Select Role";
        }
        else if (!isValidCredentials(formData.password, formData.email)) {
            return;
        }
        const firstError = Object.values(newErrors)[0];
        if (firstError) {
            toast.error(firstError);
        }
        setIsLoading(true);
        try {
            const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();
            toast.success('Registration successful');
            navigate('/login');
        } 
        catch (error) {
            toast.error(error.response.data.message);
        } 
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="md:h-screen h-[100vh] overflow-hidden md:px-0 px-4 min-w-[240px]">
            <div className="absolute top-0 left-2 flex items-center gap-2">
                <img src={Logo} className="md:w-20 w-10 mt-2" alt="Logo" />
            </div>
            <div className="flex gap-4 h-full items-center my-auto">
                <div className="relative flex-1 flex flex-col items-center justify-center lg:bottom-11">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col md:w-[50%] w-full md:mt-28 mt-2"
                        noValidate
                    >
                        <div>
                            <h2 className="md:text-3xl text-2xl leading-[48px] font-semibold mb-4">Get Started Now</h2>
                            <p className="text-lg mb-6">Enter your details to sign up.</p>
                        </div>
                        <div className="flex flex-col items-center w-full gap-4 py-4">
                            <div className="w-full flex flex-col gap-1">
                                <label htmlFor="name" className="text-sm">
                                    Enter Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-[10px] rounded-[10px] border border-gray-300 text-gray-600"
                                    required
                                />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <label htmlFor="email" className="text-sm">
                                    Enter Email Id
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Example@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-[10px] rounded-[10px] border border-gray-300 text-gray-600"
                                    required
                                />
                            </div>
                            <div className="w-full flex flex-col gap-1 relative">
                                <label htmlFor="password" className="text-sm">
                                    Enter Password
                                </label>
                                <input
                                    id="password"
                                    type={see ? "text" : "password"}
                                    name="password"
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-[10px] rounded-[10px] border border-gray-300 text-gray-600"
                                    required
                                />
                                {!see ? <div onClick={() => setSee(true)} className='absolute lg:right-[1vw] lg:top-[5vh] right-3 top-[6vh] cursor-pointer'><IoIosEye /></div> : 
                                <div onClick={() => setSee(false)} className='absolute lg:right-[1vw] lg:top-[5vh] right-3 top-[6vh] cursor-pointer'><IoIosEyeOff /></div>}
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <label htmlFor="role" className="text-sm">
                                    Select Role
                                </label>
                                <select id="role" name="role" value={formData.role} onChange={handleChange} 
                                    className="w-full p-[10px] rounded-[10px] border border-gray-300 text-gray-600 cursor-pointer" required
                                >
                                    <option value=''>Select Role</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:gap-20 gap-4 w-full">
                            <button
                                type="submit"
                                className={`w-full bg-[#3A5B22] text-white font-semibold py-3 mt-8 rounded-[10px] ${isLoading || isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading || isDisabled}
                                aria-live="polite"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <span className="loader w-4 h-4 mr-2"></span> Creating account...
                                    </div>
                                ) : (
                                    'Sign up'
                                )}
                            </button>
                            <p className="md:text-lg text-sm text-center relative lg:bottom-8">
                                Already have an account?
                                <Link to="/login" className="text-[#0F3DDE] ml-1">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="2xl:w-[36%] w-[50%] hidden lg:block">
                    <img src='https://res.cloudinary.com/dhhxki61s/image/upload/v1736482478/pexels-photo-771742_ojjj9q.jpg' alt="Auth" className="w-full h-full" />
                </div>
            </div>
        </div>
    );
}
