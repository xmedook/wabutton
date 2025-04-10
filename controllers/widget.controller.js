const Widget = require('../models/widget.model');

/**
 * @desc    Create a new widget
 * @route   POST /api/widgets
 * @access  Private
 */
exports.createWidget = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;

    // Create widget
    const widget = await Widget.create(req.body);

    res.status(201).json({
      success: true,
      data: widget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all widgets for a user
 * @route   GET /api/widgets
 * @access  Private
 */
exports.getWidgets = async (req, res) => {
  try {
    // Find widgets for the current user
    const widgets = await Widget.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: widgets.length,
      data: widgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get a single widget
 * @route   GET /api/widgets/:id
 * @access  Private
 */
exports.getWidget = async (req, res) => {
  try {
    // Find widget by ID
    const widget = await Widget.findById(req.params.id);

    // Check if widget exists
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found'
      });
    }

    // Check if user owns the widget
    if (widget.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this widget'
      });
    }

    res.status(200).json({
      success: true,
      data: widget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update a widget
 * @route   PUT /api/widgets/:id
 * @access  Private
 */
exports.updateWidget = async (req, res) => {
  try {
    // Find widget by ID
    let widget = await Widget.findById(req.params.id);

    // Check if widget exists
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found'
      });
    }

    // Check if user owns the widget
    if (widget.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this widget'
      });
    }

    // Update widget
    widget = await Widget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: widget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete a widget
 * @route   DELETE /api/widgets/:id
 * @access  Private
 */
exports.deleteWidget = async (req, res) => {
  try {
    // Find widget by ID
    const widget = await Widget.findById(req.params.id);

    // Check if widget exists
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found'
      });
    }

    // Check if user owns the widget
    if (widget.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this widget'
      });
    }

    // Delete widget
    await widget.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Track widget view
 * @route   GET /api/widgets/:id/view
 * @access  Public
 */
exports.trackWidgetView = async (req, res) => {
  try {
    // Find widget by ID
    const widget = await Widget.findById(req.params.id);

    // Check if widget exists
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found'
      });
    }

    // Increment views
    widget.analytics.views += 1;
    await widget.save();

    res.status(200).json({
      success: true,
      data: widget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Track widget click
 * @route   GET /api/widgets/:id/click
 * @access  Public
 */
exports.trackWidgetClick = async (req, res) => {
  try {
    // Find widget by ID
    const widget = await Widget.findById(req.params.id);

    // Check if widget exists
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found'
      });
    }

    // Increment clicks
    widget.analytics.clicks += 1;
    await widget.save();

    res.status(200).json({
      success: true,
      data: widget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get widget by domain (for public access)
 * @route   GET /api/widgets/domain/:domain
 * @access  Public
 */
exports.getWidgetByDomain = async (req, res) => {
  try {
    const domain = req.params.domain;
    
    // Find active widgets that are allowed on this domain
    const widgets = await Widget.find({
      active: true,
      domains: { $in: [domain, '*'] }
    });

    if (widgets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No widgets found for this domain'
      });
    }

    res.status(200).json({
      success: true,
      data: widgets[0] // Return the first widget found
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
