const express = require('express');
const router = express.Router();

// Placeholder for patients routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Patients API endpoint',
    data: []
  });
});

module.exports = router;
