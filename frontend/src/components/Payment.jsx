import React, { useState } from 'react';
import axios from 'axios';
import { PAYMENT_ENDPOINTS } from '../utility/url';
import toast from "react-hot-toast";
import { addPro } from '../store/authSlice';
import { useSelector, useDispatch } from 'react-redux';

const Payment = () => {

  const dispatch = useDispatch()
  const { pro } = useSelector((state) => state.user)
  const token = localStorage.getItem('token')

  const verifyPayment = (data) => {
		const options = {
			key: "rzp_test_e1X0p6CCPMH3MF",
			amount: data.amount,
			currency: data.currency,
			description: "Pro Subscribe Transaction",
			order_id: data.id,
			handler: async (response) => {
				try {
					const res = await axios.post(PAYMENT_ENDPOINTS.VERIFY, response, {
            headers: {
              'token': `${token}`
            }
          });
          toast.success("Payment completed successfully!");
          dispatch(addPro(true))
				} 
        catch (error) {
          toast.error("Failed to complete payment!");
				}
			},
			theme: {
				color: "#3399cc",
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};

	const handlePayment = async (amount) => {
		try {
			const response = await axios.post(PAYMENT_ENDPOINTS.PAY, { amount: amount }, {
        headers: {
          'token': `${token}`
        }
      });
      toast.success("Payment initiated successfully!");
			verifyPayment(response.data);
		} 
    catch (error) {
      toast.error("Failed to initiate payment!");
		}
	};

  return (
    <div className="container mx-auto relative">
      <div className="w-full h-[13vh] sticky z-[2] md:top-[10vh] top-[10vh] flex justify-between items-center">
        <img src='https://res.cloudinary.com/dhhxki61s/image/upload/v1736521860/4597144_pictam.jpg' alt='menu' className='object-cover w-full h-full filter brightness-[60%]'></img>
        <h1 className="absolute left-[3vw] text-white md:text-3xl text-xl font-bold italic md:drop-shadow-[5px_5px_2px_black] drop-shadow-[3px_3px_2px_black]">Payment Gateway</h1>
      </div>
      {!pro && <div className='flex flex-col justify-center items-center gap-4 mt-[20vh]'>
        <h3 className='text-gray-700 text-3xl font-bold italic md:drop-shadow-[5px_5px_2px_white] drop-shadow-[3px_3px_2px_white]'>Pro Plan</h3>
        <p className='text-gray-700 text-xl'>Enjoy more features with Pro Plan</p>
        <button onClick={() => handlePayment(25)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Get for ₹25</button>
      </div>}
      {pro && <div className='flex flex-col justify-center items-center gap-4 mt-[15vh]'>
        <h3 className='text-center text-gray-700 text-3xl font-bold italic md:drop-shadow-[5px_5px_2px_white] drop-shadow-[3px_3px_2px_white]'>Now You are added to Pro Plan</h3>
        <img className='rounded' src='https://res.cloudinary.com/dhhxki61s/image/upload/v1736524688/th_tm3vkt.jpg' alt='thanks'></img>
      </div>}
    </div>
  );
};

export default Payment;
