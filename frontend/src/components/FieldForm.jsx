import React, {useState, useEffect} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { FIELD_ENDPOINTS } from '../utility/url';
import { setUserFields, setOtherFields, addField, updateField, deleteField } from '../store/fieldSlice';
import { SlClose } from "react-icons/sl";
import Modal from './Modal';
import { MdEdit } from "react-icons/md";
import { FaTrash } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { FaRobot } from "react-icons/fa";
import { AI_ENDPOINTS } from '../utility/url';

function FieldForm() {

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModal2Open] = useState(false);
  const [fieldForm, setFieldForm] = useState({
    fieldName: '',
    location: {latitude: '', longitude: ''},
    cropType: '',
    areaSize: '',
  });
  const [analytics, setAnalytics] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const { token, role } = useSelector((state) => state.user);
  const { userFields, otherFields } = useSelector((state) => state.field)
  const [loading, setLoading] = useState(false)

  const fetchUserFields = async () => {
    try{
      setLoading(true)
      const response = await axios.get(FIELD_ENDPOINTS.getUserField, {
        headers: {
          'token': `${token}`
        }
      })
      dispatch(setUserFields(response.data))
      setLoading(false)
    }
    catch(error){
      setLoading(false)
      toast.error(error.response.data.message)
    }
  }

  const fetchOtherFields = async () => {
    try{
      setLoading(true)
      const response = await axios.get(FIELD_ENDPOINTS.getOtherField, {
        headers: {
          'token': `${token}`
        }
      })
      dispatch(setOtherFields(response.data))
      setLoading(false)
    }
    catch(error){
      setLoading(false)
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if(role === 'Farmer'){
      fetchUserFields()
    }
    else{
      fetchOtherFields()
    }
  }, [dispatch, token, role])

  const handleAdd = () => {
    if(role === 'Farmer'){
      setModalOpen(true)
    }
    else{
      toast.error('Only Farmer can add Field')
    }
  }

  const handleEdit = (item) => {
    if(role === 'Farmer'){
      setFieldForm({ ...item });
      setEditingItem(item);
      setModalOpen(true);
    }
    else{
      toast.error('Only Farmer can update Field')
    }
  };

  const handleIsDelete = (id) => {
    if(role === 'Farmer'){
      handleDelete(id)
    }
    else{
      toast.error('Only Farmer can delete Field')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${FIELD_ENDPOINTS.deleteField}/${id}`, {
        headers: { 'token': `${token}` }
      });
      dispatch(deleteField(id));
      toast.success('Field got deleted successfully.');
    } 
    catch (error) {
      toast.error('Failed to delete field. Please try again.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formattedForm = { ...fieldForm };
    try {
      if (editingItem) {
        const updatedItem = { ...formattedForm, _id: editingItem._id };
        const response = await axios.put(`${FIELD_ENDPOINTS.updateField}/${editingItem._id}`, updatedItem, {
          headers: { 'token': `${token}` },
        });
        dispatch(updateField(response.data.updatedField));
        toast.success('Field updated successfully.');
      } else {
        const response = await axios.post(FIELD_ENDPOINTS.createField, formattedForm, {
          headers: { 'token': `${token}` },
        });
        dispatch(addField(response.data.newField));
        toast.success('Field added successfully.');
      }
    } 
    catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setFieldForm({
        fieldName: '',
        location: {latitude: '', longitude: ''},
        cropType: '',
        areaSize: '',
      });
      setEditingItem(null);
      setModalOpen(false);
    }
  };

  const handleAIBot = async (item) => {
    try {
      const { fieldName, cropType, location, areaSize } = item
      const {latitude, longitude} = location
      const response = await axios.post(AI_ENDPOINTS.ANALYSE , { fieldName, cropType, latitude, longitude, areaSize });
      setAnalytics(response.data.insights);
      setModal2Open(true)
    } 
    catch (error) {
      toast.error("Error in generating AI Insights")
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen border">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto relative">
      <div className="w-full h-[13vh] sticky z-[2] md:top-[10vh] top-[10vh] flex justify-between items-center">
        <img src='https://res.cloudinary.com/dhhxki61s/image/upload/v1736524350/Wheat-Field_m7dc5i.jpg' alt='menu' className='object-cover w-full h-full filter brightness-[60%]'></img>
        <h1 className="absolute left-[3vw] text-white md:text-3xl text-xl font-bold italic md:drop-shadow-[5px_5px_2px_black] drop-shadow-[3px_3px_2px_black]">Field Manager</h1>
        <button
          className="absolute right-[3vw] bg-white text-gray-500 flex items-center justify-center rounded-full border border-dashed border-gray-500 md:h-16 h-12 md:w-16 w-12"
          onClick={handleAdd}
        >
          <FiPlus fontSize="2rem" />
        </button>
      </div>

      {role === 'Farmer' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 px-4 py-3">
        {userFields ? (
          userFields.map((item) => (
            <div key={item._id} className="border p-4 rounded-lg bg-white flex items-center gap-4">
              <div className="relative flex-1">
                <div className='flex flex-row justify-between items-center gap-1 w-[80%]'>
                  <h2 className="text-xl font-bold">{item?.fieldName}</h2>
                </div>
                <p className="text-orange-600 text-md">Crop Type: {item.cropType}</p>
                <p className="text-xs">Area Size: {item.areaSize} sq.m.</p>
                <p className="text-xs">Latitude: {item.location.latitude}</p>
                <p className="text-xs">Longitude: {item.location.longitude}</p>
                <button
                  onClick={() => handleEdit(item)}
                  className="active:bg-gray-200 h-6 w-6 flex items-center justify-center bg-blue-200 rounded-full text-sm absolute top-[0rem] lg:right-[2vw] right-[10vw]"
                >
                  <MdEdit />
                </button>
                <button
                  className="h-6 w-6 bg-red-200 active:bg-red-300 text-xs rounded-full flex items-center justify-center text-red-500 absolute top-[0rem] right-0"
                  onClick={() => handleIsDelete(item?._id)}
                >
                  <FaTrash />
                </button>
                <button
                  className="h-6 w-6 bg-violet-500 active:bg-violet-900 text-xs rounded-full flex items-center justify-center text-white absolute top-[2rem] right-0"
                  onClick={() => handleAIBot(item)}
                >
                  <FaRobot />
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="px-3 text-indigo-600">No Fields found</h1>
        )}
      </div>}

      {role === 'Admin' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 px-4 py-3">
        {otherFields ? (
          otherFields.map((item) => (
            <div key={item._id} className="border p-4 rounded-lg bg-white flex items-center gap-4">
              <div className="relative flex-1 ">
                <div className='flex flex-row justify-between items-center gap-1 w-[80%]'>
                  <h2 className="text-xl font-bold">{item?.fieldName}</h2>
                </div>
                <p className="text-orange-600 text-md">Crop Type: {item.cropType}</p>
                <p className="text-xs">Area Size: {item.areaSize} sq.m.</p>
                <p className="text-xs">Latitude: {item.location.latitude}</p>
                <p className="text-xs">Longitude: {item.location.longitude}</p>
                <button
                  onClick={() => handleEdit(item)}
                  className="active:bg-gray-200 h-6 w-6 flex items-center justify-center bg-blue-200 rounded-full text-sm absolute top-[0rem] lg:right-[2vw] right-[10vw]"
                >
                  <MdEdit />
                </button>
                <button
                  className="h-6 w-6 bg-red-200 active:bg-red-300 text-xs rounded-full flex items-center justify-center text-red-500 absolute top-[0rem] right-0"
                  onClick={() => handleIsDelete(item?._id)}
                >
                  <FaTrash />
                </button>
                <button
                  className="h-6 w-6 bg-violet-500 active:bg-violet-900 text-xs rounded-full flex items-center justify-center text-white absolute top-[2rem] right-0"
                  onClick={() => handleAIBot(item)}
                >
                  <FaRobot />
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="px-3 text-indigo-600">No Fields found</h1>
        )}
      </div>}

      <Modal isOpen={modalOpen2}>
        {analytics && <div className="mt-6 bg-gray-100 p-4 rounded-md relative">
          <SlClose fontSize='2rem' style={{cursor: 'pointer', position: 'absolute', top: '0', right: '0'}} onClick={() => {setModal2Open(false)}} />
          <h2 className="text-2xl font-bold mb-2">AI Insights Results</h2>
          <p><strong>Field Name:</strong> {analytics.fieldName}</p>
          <p><strong>Crop Type:</strong> {analytics.cropType}</p>
          <p><strong>Latitude:</strong> {analytics.latitude}</p>
          <p><strong>Longitude:</strong> {analytics.longitude}</p>
          <p><strong>Area Size:</strong> {analytics.areaSize} sq.m.</p>
          <p><strong>Soil Health:</strong> {analytics.soilHealth}</p>
          <p><strong>Crop Health:</strong> {analytics.cropHealth}</p>
          <p><strong>Recommendations:</strong> {analytics.recommendations}</p>
        </div>}
      </Modal>

      <Modal isOpen={modalOpen}>
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <SlClose fontSize='2rem' style={{cursor: 'pointer'}} onClick={() => {
            setFieldForm({
              fieldName: '',
              location: {latitude: '', longitude: ''},
              cropType: '',
              areaSize: '',
            })
            setEditingItem(null)
            setModalOpen(false)}} />
        </div>
        <form onSubmit={handleFormSubmit}>
          <input
          type="text"
          placeholder="Field Name"
          value={fieldForm.fieldName}
          onChange={(e) => setFieldForm({ ...fieldForm, fieldName: e.target.value })}
          className="w-full p-2 border mb-4"
          required
          />
          <input 
          type="number" 
          placeholder="Latitude" 
          value={fieldForm.location.latitude} 
          className="w-full p-2 border mb-4"
          onChange={(e) => setFieldForm({ ...fieldForm, location: { ...fieldForm.location, latitude: e.target.value }, })}
          required 
          /> 
          <input 
          type="number" 
          placeholder="Longitude" 
          className="w-full p-2 border mb-4"
          value={fieldForm.location.longitude}
          onChange={(e) => setFieldForm({ ...fieldForm, location: { ...fieldForm.location, longitude: e.target.value }, })} 
          required 
          />
          <input
          type="text"
          className="w-full p-2 border mb-4"
          placeholder="Crop Type"
          value={fieldForm.cropType}
          onChange={(e) => setFieldForm({ ...fieldForm, cropType: e.target.value })}
          required
          />
          <input
          type="number"
          placeholder="Area Size (in sq.m.)"
          className="w-full p-2 border mb-4"
          value={fieldForm.areaSize}
          onChange={(e) => setFieldForm({ ...fieldForm, areaSize: e.target.value })}
          required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingItem ? 'Update' : 'Add'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default FieldForm
