const baseURl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const FIELD_ENDPOINTS = {
  createField: `${baseURl}/field/create`,
  getOtherField: `${baseURl}/field/other`,
  getUserField: `${baseURl}/field/user`,
  updateField: `${baseURl}/field/update`,
  deleteField: `${baseURl}/field/delete`
};

export const AUTH_ENDPOINTS = {
  LOGIN: `${baseURl}/user/login`,
  REGISTER: `${baseURl}/user/register`,
}

export const AI_ENDPOINTS = {
  ANALYSE:`${baseURl}/analytic/analyze`
}

export const PAYMENT_ENDPOINTS = {
  PAY:`${baseURl}/payment/subscribe`,
  VERIFY:`${baseURl}/payment/verify`
}