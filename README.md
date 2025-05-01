# EIPsInsight.com

A sleek, responsive React frontend for exploring Ethereum proposals, visualizing data, and tracking contributor activity.

## Features

- Dashboard with key metrics and visualizations
- Proposal explorer with filtering and search
- Proposal builder with markdown support
- Analytics page with GitHub data visualization
- Contributor leaderboard
- Dark/light theme support
- Mobile-responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: wouter
- **Charts**: Recharts
- **Backend**: Express, Drizzle ORM
- **Database**: PostgreSQL

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

### Netlify Deployment

This project can be deployed to Netlify using the following steps:

1. Push your code to a GitHub repository
2. Log in to Netlify and create a new site from Git
3. Select your repository
4. Set the build command to `npm run build`
5. Set the publish directory to `client/dist`
6. Deploy!

The Netlify deployment will automatically use the mock API for demonstration purposes.

### Full-stack Deployment

To deploy the full application with a backend:

1. Ensure you have a PostgreSQL database available
2. Set the required environment variables
3. Deploy using your preferred hosting platform

## Environment Variables

```
DATABASE_URL=postgresql://user:password@hostname:port/database
SESSION_SECRET=your-session-secret
```

## License

MIT
