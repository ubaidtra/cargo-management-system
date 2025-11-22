This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Database Setup

This project uses **MongoDB** as the database. 

### Quick Setup

1. **Get MongoDB Connection String:**
   - Sign up for free MongoDB Atlas: https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string
   - See `MONGODB_SETUP.md` for detailed instructions

2. **Configure Database:**
   ```bash
   npm run setup-mongodb "YOUR_MONGODB_CONNECTION_STRING"
   ```

3. **Initialize Database:**
   ```bash
   npm run db:generate    # Generate Prisma Client
   npm run db:push        # Push schema to MongoDB
   npm run seed           # Seed initial data (optional)
   ```

4. **Test Connection:**
   ```bash
   npm run test-db
   ```

### Environment Variables

Required:
- `DATABASE_URL`: MongoDB connection string (e.g., `mongodb+srv://...`)
- `NODE_ENV`: Set to `development` or `production`

## Deployment

See `DEPLOYMENT.md` for complete deployment guide.

**Recommended:** Deploy to [Vercel](https://vercel.com) (easiest for Next.js)

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Before deploying:**
1. Migrate to PostgreSQL (see `DEPLOYMENT.md`)
2. Push your code to GitHub
3. Import project to Vercel
4. Set environment variables in Vercel dashboard
5. Deploy!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
