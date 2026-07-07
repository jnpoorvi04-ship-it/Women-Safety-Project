import Alert from "../../models/Alert.js";
import User from "../../models/User.js";
import EmergencyContact from "../../models/EmergencyContact.js";
import { getUserSocket } from "../onlineUsers.js";

export const registerAlertHandlers = (io, socket) => {
    // CREATE ALERT
    socket.on("create-alert", async ({ latitude, longitude }) => {

        try {
            // Check if an active alert already exists
            const existingAlert = await Alert.findOne({
                createdBy: socket.user._id,
                status: "ACTIVE",
            });

            if (existingAlert) {
                return socket.emit("alert-error", {
                    message: "An active alert already exists.",
                });
            }

            // Create new alert
            const alert = await Alert.create({
                createdBy: socket.user._id,

                location: {
                    latitude,
                    longitude,
                },

                status: "ACTIVE",
            });

            // Notify online emergency contacts
            for (const contact of socket.user.emergencyContacts) {
                const contactSocketId = getUserSocket(contact.user._id);

                if (contactSocketId) {

                    io.to(contactSocketId).emit("incoming-alert", {
                        alertId: alert._id,
                        senderName: socket.user.name,
                        latitude,
                        longitude,
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


    // RESOLVE ALERT

    socket.on("resolve-alert", async () => {

        try {

            const alert = await Alert.findOne({
                createdBy: socket.user._id,
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

                const contactSocketId = getUserSocket(contact.userId);

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

};