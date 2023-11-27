import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";

const EditUser = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userData = location.state?.userData;
  const navigate = useNavigate();

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstname);
      setLastName(userData.lastname);
      setEmail(userData.email);
      setSelectedRole(userData.role);
    }
  }, [userData]);

  const roles = ["USER", "ADMIN"];

  useEffect(() => {
    // Jeśli rola użytkownika jest w tablicy, ustaw ją jako domyślną
    if (userData && roles.includes(userData.role)) {
      setSelectedRole(userData.role);
    } else if (roles.includes(user.role)) {
      // Jeśli rola użytkownika nie jest dostępna, ustaw rolę zalogowanego użytkownika
      setSelectedRole(user.role);
    }
  }, [user.role, userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8080/users/update/${userData.idUser}`,
        {
          firstname,
          lastname,
          email,
          role: selectedRole,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/adminpanel");
      } else {
        console.error(
          "Błąd podczas aktualizacji użytkownika:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji użytkownika:", error.message);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <h2 className="text-center">Edycja użytkownika</h2>
        <div className="row justify-content-center">
          <div className="col-md-4 border p-3 ">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="inputfirstname" className="form-label">
                  Imię
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="inputlastname" className="form-label">
                  Nazwisko
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="inputemail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="inputrole" className="form-label">
                  Rola
                </label>
                <select
                  className="form-select"
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary mx-auto d-block">
                Zapisz zmiany
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;