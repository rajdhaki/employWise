import { useState, useEffect, useContext } from "react";
import { getUser, updateUser } from "../../services/api.js";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../App";

const EditUser = () => {
  const { id } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const { updateUserData } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUser(id);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setAvatar(response.data.avatar);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    
    try {
      // Log what we're sending to the API for debugging
      console.log("Updating user with data:", { first_name: firstName, last_name: lastName });
      
      await updateUser(id, { 
        first_name: firstName, 
        last_name: lastName 
      });
      
      // Update our client-side state
      updateUserData(id, { first_name: firstName, last_name: lastName });
      
      // Navigate back to the users list
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 animate-slideDown">
          <h2 className="text-3xl font-extrabold text-gray-900">Edit User</h2>
          <p className="mt-2 text-sm text-gray-600">Update user information</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-scaleUp animation-delay-150">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg border border-red-200 animate-shake">
                {error}
              </div>
            )}
            
            <div className="flex justify-center mb-6">
              {avatar && (
                <img 
                  src={avatar} 
                  alt="User avatar" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 animate-pulse-gentle hover:border-indigo-300 transition-all duration-300 transform hover:scale-110 shadow-md"
                />
              )}
            </div>
            
            <form onSubmit={handleUpdate}>
              <div className="mb-4 animate-slideRight animation-delay-300">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300"
                  placeholder="First Name"
                  required
                />
              </div>
              
              <div className="mb-6 animate-slideRight animation-delay-450">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300"
                  placeholder="Last Name"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between mt-8 animate-fadeIn animation-delay-600">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md transform hover:translate-y-[-1px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all duration-200 hover:shadow-md transform hover:translate-y-[-1px]"
                >
                  {updating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
