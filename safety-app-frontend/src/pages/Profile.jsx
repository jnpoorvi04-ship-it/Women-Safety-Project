
import axios from "axios";

const Profile = ({
    showProfile,
    setShowProfile,
    profileData,
    setProfileData,
    setUser,
}) => {
    if(!showProfile) return null;

    const handleProfileUpdate = async() => {
        try{
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `${process.env.BACKEND_URL}/api/users/profile`,
                {
                phone: profileData.phone,
                emergencyContacts: profileData.emergencyContacts,
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );

            setUser(res.data.user);
            setProfileData({
                name: res.data.user.name || "",
                email: res.data.user.email || "",
                aadhaarCard: res.data.user.verificationDocument?.aadhaarCard || "",
                phone: res.data.user.phone || "",
                emergencyContacts: res.data.user.emergencyContacts?.length
                    ? res.data.user.emergencyContacts
                    : [{ name: "", phone: "", email: "" }],
                });
                
            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("Profile updated successfully");
            setShowProfile(false);
        } catch(error){
            console.log(error);
            alert(error.response?.data?.message || "Failed to update profile");
        }
    };

    return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-[400px] bg-white h-full p-6 overflow-y-auto">
        <button
          onClick={() => setShowProfile(false)}
          className="text-red-500 mb-4"
        >
          Close
        </button>

        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        <label>Name</label>
        <input value={profileData.name} disabled className="w-full border p-2 rounded mb-3 bg-gray-100" />

        <label>Email</label>
        <input value={profileData.email} disabled className="w-full border p-2 rounded mb-3 bg-gray-100" />

        <label>Aadhaar Card</label>
        <input value={profileData.aadhaarCard} disabled className="w-full border p-2 rounded mb-3 bg-gray-100" />

        <label>Phone</label>
        <input
          value={profileData.phone}
          onChange={(e) =>
            setProfileData({ ...profileData, phone: e.target.value })
          }
          className="w-full border p-2 rounded mb-4"
        />

        <h3 className="font-semibold mb-2">Emergency Contacts</h3>

        {profileData.emergencyContacts.map((contact, index) => (
          <div key={index} className="border p-3 rounded mb-3">
            <input
              placeholder="Contact Name"
              value={contact.name}
              onChange={(e) => {
                const updated = [...profileData.emergencyContacts];
                updated[index].name = e.target.value;
                setProfileData({ ...profileData, emergencyContacts: updated });
              }}
              className="w-full border p-2 rounded mb-2"
            />

            <input
              placeholder="Phone"
              value={contact.phone}
              onChange={(e) => {
                const updated = [...profileData.emergencyContacts];
                updated[index].phone = e.target.value;
                setProfileData({ ...profileData, emergencyContacts: updated });
              }}
              className="w-full border p-2 rounded mb-2"
            />

            <input
              placeholder="Email"
              value={contact.email}
              onChange={(e) => {
                const updated = [...profileData.emergencyContacts];
                updated[index].email = e.target.value;
                setProfileData({ ...profileData, emergencyContacts: updated });
              }}
              className="w-full border p-2 rounded"
            />

            <button
            type="button"
            onClick={() => {
                if (profileData.emergencyContacts.length === 1) {
                alert("At least one emergency contact is required");
                return;
                }

                const updated = profileData.emergencyContacts.filter(
                (_, i) => i !== index
                );

                setProfileData({
                ...profileData,
                emergencyContacts: updated,
                });
            }}
            className="w-full bg-red-500 text-white py-2 rounded mt-2"
            >
            Remove Contact
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setProfileData({
              ...profileData,
              emergencyContacts: [
                ...profileData.emergencyContacts,
                { name: "", phone: "", email: "" },
              ],
            })
          }
          className="w-full bg-gray-700 text-white py-2 rounded mb-3"
        >
          Add Contact
        </button>

        <button
          onClick={handleProfileUpdate}
          className="w-full bg-pink-600 text-white py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;