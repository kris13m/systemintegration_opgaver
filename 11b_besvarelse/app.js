import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use(express.json());
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, // $5
      currency: 'usd',
    });
     console.log(paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(4242, () => console.log('Server running on http://localhost:4242'));