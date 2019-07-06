import stripeSdk from 'stripe';
import { ExternalError } from '@server/modules/errors';

const stripe = stripeSdk(process.env.STRIPE);

/**
 * Create a new payment charge
 *
 * @param parent - The parent resolver
 * @param args - User input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
const createCharge = async (parent, args, context, info): Promise<any> => {
  // TODO: based on UI, fill in the inputs
  try {
    await stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      source: 'tok_visa', // does this source get set for the customer?
      description: 'Test Charge 1', // shows in email, product description
      statement_descriptor: '',
      customer: '',
      metadata: {},
    });
  } catch (error) {
    throw new ExternalError(error, { source: 'Stripe' });
  }
};

export default {
  Mutation: {
    createCharge,
  },
};
