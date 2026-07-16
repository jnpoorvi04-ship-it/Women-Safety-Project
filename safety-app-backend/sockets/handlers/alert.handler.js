import Alert from "../../models/Alert.js";
import User from "../../models/User.js";
import EmergencyContact from "../../models/EmergencyContact.js";
import { getUserSocket } from "../onlineUsers.js";

const activeAlerts = new Map();

export const registerAlertHandlers = (io, socket) => {
    // CREATE ALERT
    socket.on("create-alert", async ({ latitude, longitude }) => {
        try {
            // Check if an active alert already exists
            const existingAlert = await Alert.findOne({
                userId: socket.user._id,
                status: "ACTIVE",
            });

            if (existingAlert) {
                return socket.emit("alert-error", {
                    message: "An active alert already exists.",
                });
            }

            // Create new alert
            const alert = await Alert.create({
                userId: socket.user._id,

                location: {
                    lat: latitude,
                    lng: longitude,
                },

                status: "ACTIVE",
            });
            const sender = await User.findById(socket.user._id)
                .populate("emergencyContacts");

            activeAlerts.set(alert._id.toString(), {
                owner: socket.user._id.toString(),
                contacts: sender.emergencyContacts.map(contact => contact._id.toString()),
            });

            // Notify online emergency contacts
            for (const contact of socket.user.emergencyContacts) {
                const registeredUser = await User.findOne({
                    email: contact.email
                });

                if (!registeredUser) continue;
                const contactSocketId = getUserSocket(registeredUser._id);
                console.log(contactSocketId)
                if (contactSocketId) {
                    console.log("Sending incoming-alert");
                    io.to(contactSocketId).emit("incoming-alert", {                 
                        _id: alert._id,
                        senderName: socket.user.name,
                        lat: latitude,
                        lng: longitude,
                        createdAt: alert.createdAt,
                    });

                }
            }

            // Notify sender
            socket.emit("alert-create", {
                alertId: alert._id,
                status: alert.status,
            });

        }
        catch (error) {

            socket.emit("alert-error", {
                message: error.message,
            });

        }

    });

    //Locatio update handler

    socket.on("location-update", async(data) => {
        try{
            const {alertId, latitude, longitude} = data;
            if(!alertId ||latitude == undefined|| longitude == undefined){
                socket.emit("location-error", {
                    message: "Invalid location data",
                });
                return;
            }
            const activeAlert = activeAlerts.get(alertId);

            if (!activeAlert){
                socket.emit("location-error", {
                    message: "Alert is not active",
                });
                return;
            }

            //Ensure only alert owners can send updates
            if(activeAlert.owner !== socket.user._id.toString()){
                socket.emit("location-error",{
                    message: "Unauthorized location update",
                });
                return;
            }

            //Broadcast loc to all online emergency contacts
            for(const contactId of activeAlert.contacts){
                const contactSocketId = getUserSocket(contactId);
                if(!contactSocketId) continue;

                io.to(contactSocketId).emit("location-update", {
                    alertId,
                    latitude,
                    longitude,
                    updatedAt: Date.now(),
                });
            }

        } catch(error){
            console.error("Location update error:", error);
            socket.emit("location-error", {
                message: "Unable to update location",
            });
        }
    });


    // RESOLVE ALERT

    socket.on("resolve-alert", async () => {

        try {

            const alert = await Alert.findOne({
                userId: socket.user._id,
                status: "ACTIVE",
            });

            if (!alert) {
                return socket.emit("alert-error", {
                    message: "No active alert found.",
                });
            }

            alert.status = "RESOLVED";
            alert.resolvedAt = new Date();

            await alert.save();

            // Notify online emergency contacts
            for (const contact of socket.user.emergencyContacts) {
                const registeredUser = await User.findOne({
                    email: contact.email
                });

                if (!registeredUser) continue;
                const contactSocketId = getUserSocket(registeredUser._id);

                if (contactSocketId) {

                    io.to(contactSocketId).emit("alert-resolved", {
                        alertId: alert._id,
                        senderName: socket.user.name,
                    });

                }
            }

            socket.emit("alert-resolved", {
                alertId: alert._id,
            });

        }
        catch (error) {

            socket.emit("alert-error", {
                message: error.message,
            });

        }

    });

    //

};