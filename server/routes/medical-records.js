const express = require('express');
const router = express.Router();

// Placeholder for medical records routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Medical Records API endpoint',
    data: []
  });
});

module.exports = router;
