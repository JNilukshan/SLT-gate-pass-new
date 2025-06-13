import Request from '../models/requestModel.js';

export const getRequestsForReceiver = async (req, res) => {
  try {
    const userServiceNo = req.user.service_no;

    const requests = await Request.find({
      receiverServiceNumber: userServiceNo,
      dispatchStatusIn: 'Approved'
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching receiver requests:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const saveReturnedItems = async (req, res) => {
    const { id } = req.params;
    const { items } = req.body;

    try {
        const request = await Request.findById(id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.returnedItems = items;
        await request.save();

        res.json({ message: "Return items saved successfully." });
    } catch (error) {
        console.error("Error saving return items:", error);
        res.status(500).json({ message: "Server error" });
    }
};