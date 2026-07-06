import Alert from "../models/Alert.js";

export const createAlert = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const alert = await Alert.create({
      userId: req.user.id,
      location: { lat, lng },
    });

    res.status(201).json(alert);

  } catch (error) {
    res.status(500).json({ message: "Error creating alert" });
  }
};