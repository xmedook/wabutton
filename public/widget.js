/**
 * WhatsApp Widget Button
 * A customizable WhatsApp chat button for websites
 */
(function() {
  'use strict';

  // Widget constructor
  var WhWidgetSendButton = {
    // Initialize the widget
    init: function(widgetId, options) {
      this.widgetId = widgetId;
      this.options = options || {};
      
      // Set default options
      this.options.whatsapp = this.options.whatsapp || '';
      this.options.call_to_action = this.options.call_to_action || 'Connect';
      this.options.button_color = this.options.button_color || '#25D366'; // Official WhatsApp green color
      this.options.position = this.options.position || 'right';
      this.options.pre_filled_message = this.options.pre_filled_message || '';
      
      // Create the widget
      this.createWidget();
      
      // Track widget view
      this.trackView();
    },
    
    // Create the widget HTML
    createWidget: function() {
      // Create container
      var container = document.createElement('div');
      container.className = 'wa-widget-send-button';
      container.setAttribute('data-widget-id', this.widgetId);
      
      // Set position
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style[this.options.position] = '20px';
      container.style.zIndex = '999999999';
      
      // Create button
      var button = document.createElement('div');
      button.className = 'wa-widget-button';
      button.style.width = '60px';
      button.style.height = '60px';
      button.style.borderRadius = '50%';
      button.style.backgroundColor = this.options.button_color;
      button.style.cursor = 'pointer';
      button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      
      // Create WhatsApp icon
      var icon = document.createElement('div');
      icon.className = 'wa-widget-icon';
      icon.style.width = '40px';
      icon.style.height = '40px';
      icon.innerHTML = '<svg width="40px" height="40px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill: rgb(255, 255, 255); stroke: none;"><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"></path></svg>';
      
      // Create call to action
      var callToAction = document.createElement('div');
      callToAction.className = 'wa-widget-call-to-action';
      callToAction.textContent = this.options.call_to_action;
      callToAction.style.position = 'absolute';
      callToAction.style.width = 'auto';
      callToAction.style.background = '#FFFFFF';
      callToAction.style.color = '#333333';
      callToAction.style.fontSize = '14px';
      callToAction.style.padding = '5px 10px';
      callToAction.style.borderRadius = '4px';
      callToAction.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)';
      callToAction.style.whiteSpace = 'nowrap';
      callToAction.style.bottom = '70px';
      callToAction.style[this.options.position] = '0';
      callToAction.style.transition = 'opacity 0.3s ease';
      callToAction.style.opacity = '0';
      
      // Add event listeners
      button.addEventListener('mouseenter', function() {
        callToAction.style.opacity = '1';
      });
      
      button.addEventListener('mouseleave', function() {
        callToAction.style.opacity = '0';
      });
      
      button.addEventListener('click', function() {
        this.openWhatsApp();
      }.bind(this));
      
      // Assemble widget
      button.appendChild(icon);
      container.appendChild(button);
      container.appendChild(callToAction);
      
      // Add to document
      document.body.appendChild(container);
    },
    
    // Open WhatsApp with pre-filled message
    openWhatsApp: function() {
      var url = 'https://wa.me/' + this.options.whatsapp;
      
      if (this.options.pre_filled_message) {
        url += '?text=' + encodeURIComponent(this.options.pre_filled_message);
      }
      
      // Track click
      this.trackClick();
      
      // Open WhatsApp
      window.open(url, '_blank');
    },
    
    // Track widget view
    trackView: function() {
      if (!this.widgetId) return;
      
      fetch('/api/widgets/' + this.widgetId + '/view')
        .catch(function(error) {
          console.error('Error tracking widget view:', error);
        });
    },
    
    // Track widget click
    trackClick: function() {
      if (!this.widgetId) return;
      
      fetch('/api/widgets/' + this.widgetId + '/click')
        .catch(function(error) {
          console.error('Error tracking widget click:', error);
        });
    }
  };
  
  // Expose to window
  window.WhWidgetSendButton = WhWidgetSendButton;
  
  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    var widgetElements = document.querySelectorAll('[data-whatsapp-widget]');
    
    widgetElements.forEach(function(element) {
      var widgetId = element.getAttribute('data-widget-id');
      var whatsapp = element.getAttribute('data-whatsapp');
      var callToAction = element.getAttribute('data-call-to-action');
      var buttonColor = element.getAttribute('data-button-color');
      var position = element.getAttribute('data-position');
      var preFilledMessage = element.getAttribute('data-pre-filled-message');
      
      WhWidgetSendButton.init(widgetId, {
        whatsapp: whatsapp,
        call_to_action: callToAction,
        button_color: buttonColor,
        position: position,
        pre_filled_message: preFilledMessage
      });
    });
  });
})();
