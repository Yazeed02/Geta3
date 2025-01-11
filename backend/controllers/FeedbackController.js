const Feedback = require('../models/Feedback');

const FeedbackController = {
  createFeedback: async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('User from request:', req.user);

      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
      }

      const user = req.user;
      if (!user || !user._id) {
        return res.status(401).json({ error: 'Unauthorized. User not found.' });
      }

      const newFeedback = new Feedback({
        user: user._id,
        message: message,
      });

      const savedFeedback = await newFeedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully.', feedback: savedFeedback });
    } catch (error) {
      console.error('Error during feedback submission:', error);
      res.status(500).json({ error: 'Failed to submit feedback.' });
    }
  },

  getAllFeedbacks: async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      const feedbacks = await Feedback.find()
        .populate('user', 'FirstName LastName Email') // Ensure `user` field is populated correctly
        .sort({ created_at: -1 });

      if (!feedbacks) {
        return res.status(404).json({ error: 'No feedback found.' });
      }

      res.status(200).json(feedbacks);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Failed to fetch feedback.' });
    }
  },
};

module.exports = FeedbackController;