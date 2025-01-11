import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, setError } from '../store/authSlice';
import toast from 'react-hot-toast';
import Logo from '../assets/sensegrass_logo.jpg';
import { isValidCredentials } from '../utility/isValidCredentials';
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token, isLoading, error } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [see, setSee] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const { email, password } = formData;
        setIsDisabled(!email || !password || isLoading);
    }, [formData, isLoading]);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        else if (!isValidCredentials(formData.password, formData.email)) {
            return;
        }

        const firstError = Object.values(newErrors)[0];
        if (firstError) {
            toast.error(firstError);
        }
        if (error) {
            dispatch(setError(null));
        }
        dispatch(login(formData));
    };

    return (
        <div className="md:h-screen h-[95vh] overflow-hidden md:px-0 px-4 min-w-[250px]">
            <div className="absolute top-0 left-2 flex items-center gap-2">
                <img src={Logo} className="md:w-20 w-10 mt-2" alt="Logo" />
            </div>
            <div className="flex gap-4 h-full items-center my-auto">
                <div className="relative flex-1 flex flex-col items-center justify-center lg:bottom-14">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col md:w-[50%] md:mt-28 mt-10"
                        noValidate
                    >
                        <div>
                            <h2 className="md:text-3xl text-2xl font-semibold mb-4">Welcome Back!</h2>
                            <p className="text-lg mb-6">Enter your credentials to access your account.</p>
                        </div>
                        <div className="flex flex-col items-center w-full gap-4 py-4">
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
                        </div>
                        <div className="flex flex-col items-center md:gap-20 gap-10 w-full">
                            <button
                                type="submit"
                                className={`w-full bg-[#3A5B22] text-white font-semibold py-3 mt-8 rounded-[10px] ${isLoading || isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading || isDisabled}
                                aria-live="polite"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <span className="loader w-4 h-4 mr-2"></span> Signing in...
                                    </div>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                            <p className="md:text-lg text-sm text-center">
                                {`Don't have an account?`}
                                <Link to="/register" className="text-[#0F3DDE] ml-1">
                                    Sign up
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
