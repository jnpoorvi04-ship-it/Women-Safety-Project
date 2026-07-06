import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";

const Verify = () =>{
    const navigate = useNavigate();

    const [aadhaarCard, setAadhaarCard] = useState("");
    const [emergencyContacts, setEmergencyContacts] = useState([
        {name: "",
         email: "",
         phone: ""
        },
    ]);
    const [phone,setPhone] = useState("");

    const handleContactChange = (index,field,value) =>{
        const updatedContacts = [...emergencyContacts];
        updatedContacts[index][field] = value;
        setEmergencyContacts(updatedContacts);
    };

    const addContact = ()=> {
        setEmergencyContacts([
            ...emergencyContacts,
            {name: "",
             email: "",
             phone: ""
        },
        ]);
    };

    const removeContact = (index) => {
        if(emergencyContacts.length === 1){
            alert("At least one emergency contact is required");
            return;
        }

        setEmergencyContacts(
            emergencyContacts.filter((_,i) => i !== index)
        );
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!aadhaarCard){
            alert("Aadhaar number is required");
            return;
        }

        if(!phone){
          alert("Please fill phone number");
          return;
        }

        for(const contact of emergencyContacts){
            if(!contact.name || !contact.email || !contact.phone){
                alert("Please fill all emergency contact details");
                return;
            }
        }

        try{
            const token = localStorage.getItem("token");
            await axios.post(
            `${process.env.BACKEND_URL}/api/users/onboard`,
            {
            aadhaarCard,
            phone,
            emergencyContacts,
            },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        alert("Verification completed successfully");
        navigate("/home");
        } catch(error){
            alert(error.response?.data?.message || "Verification failed");
        }
    };


    return (
    <Modal title="Complete Verification">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={aadhaarCard}
          onChange={(e) => setAadhaarCard(e.target.value)}
          placeholder="Enter Aadhaar number"
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {emergencyContacts.map((contact, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <p className="font-semibold">Emergency Contact {index + 1}</p>

            <input
              type="text"
              value={contact.name}
              onChange={(e) =>
                handleContactChange(index, "name", e.target.value)
              }
              placeholder="Name"
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              value={contact.phone}
              onChange={(e) =>
                handleContactChange(index, "phone", e.target.value)
              }
              placeholder="Phone"
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              type="email"
              value={contact.email}
              onChange={(e) =>
                handleContactChange(index, "email", e.target.value)
              }
              placeholder="Email"
              className="w-full border rounded-lg px-3 py-2"
            />

            <button
              type="button"
              onClick={() => removeContact(index)}
              className="text-red-600 text-sm"
            >
              Remove Contact
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addContact}
          className="w-full border border-purple-600 text-purple-600 py-2 rounded-lg"
        >
          + Add Another Contact
        </button>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg"
        >
          Submit Verification
        </button>
      </form>
    </Modal>
  );
};

export default Verify;