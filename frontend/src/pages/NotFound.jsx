import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center font-poppins">
      <h1 className="text-5xl text-teal-500 font-bold">404</h1>
      <p className="text-lg mt-4">Oops! The page you are looking for does not exist.</p>
      <Link 
        to="/" 
        className="mt-6 text-teal-500 text-sm hover:underline"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
