# WhatsApp Widget Backend

A backend service for creating and managing WhatsApp chat widgets that can be embedded in websites. This project provides a complete solution for businesses to add WhatsApp chat functionality to their websites.

## Features

- User authentication and authorization
- Create, read, update, and delete WhatsApp widgets
- Customizable widget appearance (color, position, text)
- Track widget views and clicks
- Domain restrictions for widgets
- Admin dashboard for widget management
- Embeddable widget code generator

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: HTML, CSS, JavaScript (for admin dashboard and widget)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wabutton.git
   cd wabutton
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wabutton
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Widgets

- `GET /api/widgets` - Get all widgets for the authenticated user
- `POST /api/widgets` - Create a new widget
- `GET /api/widgets/:id` - Get a specific widget
- `PUT /api/widgets/:id` - Update a widget
- `DELETE /api/widgets/:id` - Delete a widget
- `GET /api/widgets/:id/view` - Track widget view
- `GET /api/widgets/:id/click` - Track widget click
- `GET /api/widgets/domain/:domain` - Get widget by domain (for public access)

## Widget Configuration Options

The WhatsApp widget can be customized with the following options:

- `whatsapp` - WhatsApp number to connect to (with country code, no spaces or symbols)
- `call_to_action` - Text to display when hovering over the button
- `button_color` - Color of the button (hex code)
- `position` - Position of the button on the page ('left' or 'right')
- `pre_filled_message` - Message to pre-fill in WhatsApp when clicked

## Usage

### Admin Dashboard

Access the admin dashboard at `http://localhost:5000/dashboard.html` to:

1. Register/login to your account
2. Create and manage your WhatsApp widgets
3. View widget analytics (views and clicks)
4. Get the embed code for your widgets

### Widget Integration

After creating a widget in the dashboard, you'll get a code snippet to add to your website:

```html
<!-- WhatsApp Widget Button -->
<script type="text/javascript">
    (function () {
        var options = {
            widgetId: "your_widget_id",
            whatsapp: "15551234567", // WhatsApp number
            call_to_action: "Connect", // Call to action
            button_color: "#FF6550", // Color of button
            position: "right", // Position may be 'right' or 'left'
            pre_filled_message: "Hello, I have a question", // WhatsApp pre-filled message
        };
        var proto = document.location.protocol, host = "your-domain.com", url = proto + "//" + host;
        var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = url + '/widget.js';
        s.onload = function () { WhWidgetSendButton.init(options.widgetId, options); };
        var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
    })();
</script>
<!-- /WhatsApp Widget Button -->
```

### Testing

You can test the widget functionality at `http://localhost:5000/test.html`.

## Development

- Run in development mode: `npm run dev`
- Run in production mode: `npm start`

## License

MIT
