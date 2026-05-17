"""Payment utilities for Stripe integration"""
import os
import stripe

stripe.api_key = os.getenv('STRIPE_SECRET_KEY', '')


def create_payment_intent(amount, currency='usd', description='Medical Campaign Donation'):
    """Create a Stripe payment intent"""
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Amount in cents
            currency=currency,
            description=description,
            payment_method_types=['card']
        )
        return intent, None
    except stripe.error.CardError as e:
        return None, f"Card error: {e.user_message}"
    except stripe.error.RateLimitError as e:
        return None, "Too many requests to Stripe API"
    except stripe.error.InvalidRequestError as e:
        return None, f"Invalid request: {e}"
    except stripe.error.AuthenticationError as e:
        return None, "Stripe authentication failed"
    except stripe.error.APIConnectionError as e:
        return None, "Network error connecting to Stripe"
    except Exception as e:
        return None, str(e)


def verify_payment_intent(intent_id):
    """Verify a payment intent status"""
    try:
        intent = stripe.PaymentIntent.retrieve(intent_id)
        return intent, None
    except Exception as e:
        return None, str(e)
