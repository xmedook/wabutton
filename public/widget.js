/**
 * WhatsApp Widget Button
 * A customizable WhatsApp chat button for websites
 */
(function(window) {
  'use strict';

  // Widget constructor
  window.WhWidgetSendButton = {
    // Initialize the widget
    init: function(widgetId, options) {
      this.widgetId = widgetId;
      this.options = options || {};
      
      // Set default options
      this.options.whatsapp = this.options.whatsapp || '';
      this.options.call_to_action = this.options.call_to_action || 'Chat with us';
      this.options.button_color = this.options.button_color || '#25D366';
      this.options.position = this.options.position || 'right';
      this.options.pre_filled_message = this.options.pre_filled_message || '';

      this.render();
      this.trackView();
    },

    // Create and render the widget button
    render: function() {
      var container = document.createElement('div');
      container.className = 'wa-widget-send-button';
      container.style.cssText = 'position: fixed; bottom: 20px; ' + this.options.position + ': 20px; z-index: 999;';

      // Create tooltip
      var tooltip = document.createElement('div');
      tooltip.className = 'wa-widget-tooltip';
      tooltip.textContent = this.options.call_to_action;
      tooltip.style.cssText = 'position: absolute; background: rgba(0, 0, 0, 0.8); color: white; padding: 8px 16px; ' +
                             'border-radius: 4px; font-size: 13px; font-family: Arial, sans-serif; ' +
                             'white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; ' +
                             'bottom: 100%; margin-bottom: 10px; ' + this.options.position + ': 0;';

      // Add tooltip arrow
      var arrow = document.createElement('div');
      arrow.style.cssText = 'position: absolute; bottom: -5px; ' + this.options.position + ': 10px; ' +
                           'border-left: 5px solid transparent; border-right: 5px solid transparent; ' +
                           'border-top: 5px solid rgba(0, 0, 0, 0.8);';
      tooltip.appendChild(arrow);

      var button = document.createElement('a');
      button.className = 'wa-widget-button';
      button.href = this.getWhatsAppLink();
      button.target = '_blank';
      button.onclick = this.trackClick.bind(this);
      button.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; ' +
                            'background-color: ' + this.options.button_color + '; border-radius: 50%; text-decoration: none; ' +
                            'box-shadow: 2px 2px 6px rgba(0,0,0,0.2); transition: box-shadow 0.2s; position: relative;';

      // Create an icon wrapper for better positioning
      var iconWrapper = document.createElement('div');
      iconWrapper.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; ' +
                                 'position: relative;';

      var icon = document.createElement('img');
      icon.src = 'data:image/svg+xml,' + encodeURIComponent('<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill:white;stroke:none"><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z" fill-rule="evenodd"></path></svg>');
      icon.style.cssText = 'width: 40px; height: 40px; transition: transform 0.2s ease-in-out;';

      iconWrapper.appendChild(icon);
      button.appendChild(iconWrapper);
      container.appendChild(tooltip);
      container.appendChild(button);
      document.body.appendChild(container);

      // Add hover effects
      button.onmouseover = function() {
        this.style.boxShadow = '2px 2px 11px rgba(0,0,0,0.3)';
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        icon.style.transform = 'scale(1.1)';
      };
      button.onmouseout = function() {
        this.style.boxShadow = '2px 2px 6px rgba(0,0,0,0.2)';
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        icon.style.transform = 'scale(1)';
      };

      // Show tooltip after 3 seconds
      setTimeout(function() {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        
        // Hide tooltip after 3 more seconds
        setTimeout(function() {
          tooltip.style.opacity = '0';
          tooltip.style.visibility = 'hidden';
        }, 3000);
      }, 3000);
    },

    // Generate WhatsApp API link
    getWhatsAppLink: function() {
      var message = encodeURIComponent(this.options.pre_filled_message);
      return 'https://api.whatsapp.com/send?phone=' + this.options.whatsapp + '&text=' + message;
    },

    // Track widget view
    trackView: function() {
      fetch('/api/widgets/' + this.widgetId + '/view')
        .then(function(response) {
          if (!response.ok) {
            console.warn('Failed to track widget view');
          }
        })
        .catch(function(error) {
          console.warn('Error tracking widget view:', error);
        });
    },

    // Track button click
    trackClick: function() {
      fetch('/api/widgets/' + this.widgetId + '/click')
        .then(function(response) {
          if (!response.ok) {
            console.warn('Failed to track widget click');
          }
        })
        .catch(function(error) {
          console.warn('Error tracking widget click:', error);
        });
    }
  };
})(window);
