const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gtrishanu@gmail.com',
        pass: 'yaay eiec fujt cbkh' // Use an app-specific password
    }
});

// Helper function to calculate price for a single item
const calculatePrice = (foodItem, flavor) => {
    let price = 0;
    switch (foodItem) {
        case 'Popcorn':
            if (flavor === 'Cheese') price = 50;
            else if (flavor === 'Butter') price = 30;
            else if (flavor === 'Salted') price = 20;
            else if (flavor === 'Peri Peri') price = 50;
            break;
        case 'Cold Coffee':
            price = 40;
            break;
        case 'Soft Drinks':
            if (flavor === 'Coke') price = 30;
            else if (flavor === 'Sprite') price = 30;
            break;
        case 'Doritos & Dips':
            price = 100;
            break;
        case 'Lays':
            price = 20;
            break;
        default:
            price = 0; // Default price if food item not found
    }
    return price;
};

// Endpoint to handle order submission
app.post('/submit-order', (req, res) => {
    const { teamName, roomName, items } = req.body;

    let totalPrice = 0;
    let orderDetails = '';

    // Calculate total price and build order details string
    items.forEach(item => {
        const { foodItem, flavor, quantity } = item;
        const itemPrice = calculatePrice(foodItem, flavor) * quantity;
        totalPrice += itemPrice;
        orderDetails += `Food Item: ${foodItem}${flavor ? ' (Flavor: ' + flavor + ')' : ''}, Quantity: ${quantity}, Price: ₹${itemPrice}\n`;
    });

    const mailOptions = {
        from: 'gtrishanu@gmail.com',
        to: 'recipient@example.com', // Change this to the email address you want to send to
        subject: 'Food Order from ' + teamName,
        text: `Team Name: ${teamName}\nRoom Name: ${roomName}\n\nOrder Details:\n${orderDetails}\nTotal Price: ₹${totalPrice}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.send('Order placed successfully');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
