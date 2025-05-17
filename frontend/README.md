# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Deployment to Render

### Prerequisites
1. A Render account (https://render.com)
2. Git repository with your code pushed to it

### Steps to Deploy

1. Log in to your Render account
2. Click on "New" and select "Static Site"
3. Connect your Git repository and select it
4. Configure your static site:
   - Name: logistika-frontend (or your preferred name)
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `build`
   
5. Environment Variables:
   - Add `REACT_APP_API_URL` with your backend API URL (e.g., https://your-backend-api.onrender.com/api)
   - Add `REACT_APP_TELEGRAM_BOT_TOKEN` with your Telegram bot token for authentication

6. Click "Create Static Site"

Render will automatically build and deploy your site whenever you push changes to your repository.

## Connecting to Backend

Remember to update the backend CORS settings to allow requests from your new frontend URL.

Your backend CORS configuration should include:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-url.onrender.com",
    # Other allowed origins
]
```

## Telegram Bot Integration

This application uses Telegram Login for authentication. To configure it:

1. Create a bot via [@BotFather](https://t.me/BotFather) on Telegram
2. Set the bot domain to match your Render domain in the BotFather settings
3. Store your Telegram Bot Token securely in the Render environment variables as `REACT_APP_TELEGRAM_BOT_TOKEN`
4. Never commit the Telegram Bot Token to your code repository

## Local Development
