# Personal Finance Visualizer

A web application for tracking personal finances, visualizing expenses, and managing budgets.

## Features

- **Transaction Tracking**: Record income and expenses with categories
- **Dashboard Visualization**: View your financial data with charts and graphs
- **Budget Management**: Set and track budgets for different categories
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Frontend**: Next.js, React, Chart.js
- **Backend**: Next.js API Routes
- **Database**: MongoDB (optional)
- **Styling**: Custom CSS with utility classes

## Deployment

This project is deployed on Vercel. You can view the live demo at:
[https://personal-finance-visualizer.vercel.app/](https://personal-finance-visualizer.vercel.app/)

## Local Development

1. Clone the repository:
   ```
   git clone https://github.com/varshinidangeti/personal-finance-visualizer.git
   cd personal-finance-visualizer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## MongoDB Setup (Optional)

The application can work with or without MongoDB:

- **Without MongoDB**: Data is stored in localStorage (for demo purposes)
- **With MongoDB**: For persistent data storage

To set up MongoDB:

1. Create a MongoDB Atlas account or use a local MongoDB instance
2. Get your MongoDB connection string
3. Create a `.env.local` file in the project root with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```
4. For Vercel deployment, add the `MONGODB_URI` environment variable in your project settings

## Project Structure

- `/app`: Main application code
  - `/components`: React components
  - `/api`: API routes for data handling
  - `/models`: MongoDB schema models
  - `/lib`: Utility functions and database connection
  - `/styles`: CSS and theme files
- `/public`: Static assets

## License

This project is open source and available under the [MIT License](LICENSE).
