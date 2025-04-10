const express = require('express');
const router = express.Router();
const {
  createWidget,
  getWidgets,
  getWidget,
  updateWidget,
  deleteWidget,
  trackWidgetView,
  trackWidgetClick,
  getWidgetByDomain
} = require('../controllers/widget.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/domain/:domain', getWidgetByDomain);
router.get('/:id/view', trackWidgetView);
router.get('/:id/click', trackWidgetClick);

// Protected routes
router.route('/')
  .get(protect, getWidgets)
  .post(protect, createWidget);

router.route('/:id')
  .get(protect, getWidget)
  .put(protect, updateWidget)
  .delete(protect, deleteWidget);

module.exports = router;
