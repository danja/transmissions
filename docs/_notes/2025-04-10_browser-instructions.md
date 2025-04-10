To run the application in the browser, use the webpack development server:
bashnpm run start
This will:

Build the application
Start a development server on http://localhost:9000
Open your default browser automatically to this URL
Provide hot module replacement for development

If you want to manually serve the built files instead:
bash# Build first
npm run build:dev

# Then serve the dist directory with any static file server

npx http-server ./dist -o
You can also modify the port in webpack.config.js if 9000 is already in use:
javascriptdevServer: {
port: 8080, // Change to any available port
}
The editor interface should display with the toolbar buttons for loading, saving, and creating new transmissions.
