# AirportRide customer frontend

A focused UK airport-taxi booking experience built with React and Vite.

## Customer flow

1. **Instant quote:** pickup and drop-off only. The visitor can leave after seeing the fare.
2. **Book now:** one form containing route, passengers, luggage, vehicle, journey date/time, and lead-passenger contact details.
3. **Payment:** secure Stripe payment followed by on-screen and email confirmation.

No customer account or login is required.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Required environment variables

- `VITE_API_BASE_URL`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
