import Stripe from 'stripe';
import * as DOTENV from '../utils/dotEnv.js';

const stripe = new Stripe(DOTENV.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

export default stripe;
