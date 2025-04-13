/**
 * Widget Code Generator
 * Generates the code snippet for users to embed in their websites
 */
(function() {
  'use strict';

  var WidgetCodeGenerator = {
    /**
     * Generate widget code
     * @param {Object} widget - Widget configuration
     * @returns {string} - HTML code to embed
     */
    generateCode: function(widget) {
      if (!widget || !widget._id || !widget.whatsapp) {
        throw new Error('Invalid widget configuration');
      }

      var widgetId = widget._id;
      
      var code = [
        '<!-- WhatsApp Widget Button -->',
        '<script type="text/javascript">',
        '    (function () {',
        '        var options = {',
        '            widgetId: "' + widgetId + '",',
        '            whatsapp: "' + widget.whatsapp + '", // WhatsApp number',
        '            call_to_action: "' + widget.call_to_action + '", // Call to action',
        '            button_color: "' + widget.button_color + '", // Color of button',
        '            position: "' + widget.position + '", // Position may be \'right\' or \'left\'',
        '            pre_filled_message: "' + widget.pre_filled_message + '", // WhatsApp pre-filled message',
        '        };',
        '        var proto = document.location.protocol, host = "wabutton.nexodigital.ai", url = proto + "//" + host;',
        '        var s = document.createElement(\'script\'); s.type = \'text/javascript\'; s.async = true; s.src = url + \'/widget.js\';',
        '        s.onload = function () { WhWidgetSendButton.init(options.widgetId, options); };',
        '        var x = document.getElementsByTagName(\'script\')[0]; x.parentNode.insertBefore(s, x);',
        '    })();',
        '</script>',
        '<!-- /WhatsApp Widget Button -->'
      ].join('\n');
      
      return code;
    },
    
    /**
     * Generate data attribute code
     * @param {Object} widget - Widget configuration
     * @returns {string} - HTML code to embed with data attributes
     */
    generateDataAttributeCode: function(widget) {
      if (!widget || !widget._id || !widget.whatsapp) {
        throw new Error('Invalid widget configuration');
      }

      var serverUrl = window.location.origin;
      var widgetId = widget._id;
      
      var code = [
        '<!-- WhatsApp Widget Button -->',
        '<div data-whatsapp-widget',
        '     data-widget-id="' + widgetId + '"',
        '     data-whatsapp="' + widget.whatsapp + '"',
        '     data-call-to-action="' + widget.call_to_action + '"',
        '     data-button-color="' + widget.button_color + '"',
        '     data-position="' + widget.position + '"',
        '     data-pre-filled-message="' + widget.pre_filled_message + '">',
        '</div>',
        '<script type="text/javascript" src="' + serverUrl + '/widget.js"></script>',
        '<!-- /WhatsApp Widget Button -->'
      ].join('\n');
      
      return code;
    }
  };
  
  // Expose to window
  window.WidgetCodeGenerator = WidgetCodeGenerator;
})();
