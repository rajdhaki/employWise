import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUsers, deleteUser } from "../../services/api.js";
import { removeAuthToken } from "../../utils/auth.js";
import { UserContext } from "../App";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { updatedUsers } = useContext(UserContext);

  // Get page number from URL, default to 1
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers(page);
        
        // Apply any user updates from our context
        const updatedUsersList = data.data.map(user => {
          if (updatedUsers[user.id]) {
            return {
              ...user,
              ...updatedUsers[user.id]
            };
          }
          return user;
        });
        
        setUsers(updatedUsersList);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, updatedUsers]);

  const handleEdit = (id) => navigate(`/edit/${id}`);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate("/");
  };

  // Change page and update URL
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 animate-slideDown">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button 
            onClick={handleLogout} 
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden animate-slideUp">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avatar</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors duration-150 animate-fadeIn`} style={{ animationDelay: `${index * 100}ms` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 transition-transform duration-300 transform hover:scale-110 hover:border-indigo-300" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(user.id)} 
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md mr-2 transition-all duration-200 hover:shadow-md transform hover:translate-y-[-2px]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-200 hover:shadow-md transform hover:translate-y-[-2px]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between animate-fadeIn animation-delay-300">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => changePage(page - 1)} 
                  disabled={page === 1} 
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    page === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-sm transform hover:translate-y-[-1px]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button 
                  onClick={() => changePage(page + 1)} 
                  disabled={page >= totalPages} 
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    page >= totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-sm transform hover:translate-y-[-1px]'
                  }`}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
