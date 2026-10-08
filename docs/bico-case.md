# Bico — AI tools for small businesses

[← Selected work](./selected-work.md#bico)

Bico helps micro and small business owners connect marketing, social publishing and customer follow-up. I co-founded the product and built the application and AI workflows. The product has three paying customers and was selected for Phase 2 of Centelha SP 3.

## Product scope

- AI assistance for generating and improving social posts around a business goal, such as attracting customers.
- Social publishing and planning across connected networks.
- Customer follow-up and birthday-message automations.
- Four automation cadences supporting marketing, sales and post-sale workflows.

For example, a business owner can select customer acquisition as a goal and ask the AI to improve a post for that objective, then use customer follow-up automations to continue the relationship after the first interaction.

## Implementation and versions

The current application uses Flutter and Supabase. It replaced an earlier Expo/React Native attempt. The three paying customers use the Flutter version.

The [public Flutter repository](https://github.com/tav0dev/bico-flutter) contains customer, service and appointment screens, an inbox, a Google Calendar service and an OpenAI marketing service for post and image generation. Dependencies include Flutter, Provider, Supabase and HTTP; the marketing service supports a backend proxy path.

The repository illustrates the application and marketing implementation. This case also covers the connected publishing and customer automation workflows I delivered.

## Outcome

The product has three paying customers and advanced to Phase 2 of Centelha SP 3. Further reporting can quantify revenue, customer acquisition and the effect of the automation workflows.
