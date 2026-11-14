import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Server_URL } from "../../utils/config";
import { utilityFunctions } from "../../utils/module";
const ViewUsers = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState([]);

  async function getUsersData() {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "view-users";
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      console.log(response.data);
      const { error, message } = response.data;
      console.log(error, message);

      if (error && message === "Please SignIn First!!") {
        alert(message);

        navigate("/adminsignin");
      } else if (error) {
        alert(message);
      } else {
        const { result } = response.data;
        setUser(result);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function deleteUser(id) {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "view-users/" + id;
      const res = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      const { error, message } = res.data;
      if (error) {
        // alert(message);
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        // alert(message);
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        getUsersData();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    getUsersData();
  }, []);

  return (
    <>
    <br />
      <div className="container">
      <h3 style={{textAlign:'center'}}>Our Users</h3>
      <table className="table" style={{ backgroundColor: '#F4F1BB' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile number</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{value.fullName}</td>
                  <td>{value.email}</td>
                  <td>{value.mobile}</td>
                  <td>{value.address}</td>
                  <td>
                    {
                      <button
                        type="button"
                        onClick={() => deleteUser(value._id)}
                        className="btn btn-danger btn-sm me-5"
                      >
                        Delete <FaTrashAlt />
                      </button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
    </>
  )
  
};
export default ViewUsers;
