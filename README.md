# HTP : Administrator

# Live 
https://main.d2u95r6ohmyw9p.amplifyapp.com/


# Folder Structure

- `public`: Contains the public assets and the HTML file where the app is rendered.
- `src`: Contains the source code of the React app.
  - `Components`: Reusable UI components.
  - `Constants`: Constant functions.
  - `Assets`: Static assets such as Images, Fonts, etc.
  - `Routes`: Handling Routing.
  - `utils`: Utility/helper functions.
 
    - `lazyLoading`: Loader.
    - `apiEndpoints`: API endpoint configurations.
    - `mediaEndpoint`: All Static Images & Color code.

  - `.envmode`: BaseUrl & other secret keys.
  - `ErrorBoundary`: Handling Errors.
  - `app.js`: Global Logic Point.
  - `index.js`: Entry Point.
  - `index.css`: Global CSS.
  - `i18n.js`: Localization
  - `eslint`: Contains information about creating custom rules, configurations, plugins, and formatters.
  - `jsonconfig`: shortning path
  - `tailwind.config`: for tailwind css

  # Features

1. **Ant Design UI Library**

   - Integrates Ant Design, a comprehensive UI library with a wide range of pre-designed components for building modern and responsive user interfaces.

2. **Responsive Design**

   - Implements responsive design principles using Tailwind css, ensuring the application looks great and functions well across various devices and screen sizes.

3. **SEO Optimization**

   - Implements React Helmet for managing document head metadata, improving search engine optimization (SEO) and ensuring better visibility and ranking in search results.   

4. **Debounce Input**

   - Utilizes React Debounce Input for handling input debouncing, reducing unnecessary API calls or state updates during rapid user input.   

5. **Toast Notifications**

   - Utilizes React Toastify for displaying toast notifications, providing feedback to users for various actions or events within the application.   

6. **Localization**

    - Provides localization strategies and tools for supporting English and hindi languages and adapting content based on user preferences or geographic regions, enhancing the accessibility and usability of the application for a diverse user base.

7. **Theme Mode**

    - Implementing Theme Switching in a HMJ

## Dependencies

- `antd`: Ant Design UI library.
- `tailwind`: CSS and responsiveness.
- `env-cmd`: Environment variable loader.
- `react`: React library.
- `react-debounce-input`: Debounce input library for React.
- `react-i18next`: React Localization library.
- `react-dom`: React DOM library.
- `react-helmet`: SEO library for React.
- `react-icons`: Icon library for React.
- `react-loader-spinner`: Loader spinner component for React.
- `react-otp-input`: OTP input component for React.
- `react-router-dom`: React router library for navigation.
- `react-scripts`: Scripts and tools for React projects.
- `react-toastify`: Toast notification library for React.

## Scripts

- `start`: Start the development server.
- `start:stag`: Start the staging server.
- `start:prod`: Start the production server.
- `start:dev`: Start the development server with specific environment variables.
- `build:dev`: Build the project for development.
- `build:prod`: Build the project for production.
- `build:stag`: Build the project for staging.

### Prerequisites

- Node.js and npm installed on your machine

### Installing

1. Clone the repository:
git clone git clone https://TanyaKashayp89@bitbucket.org/sachtechprojectmanagers/HMJ.git

2. Branch
git checkout main

3. Install dependencies:

```

npm install
```

### Running the App

Start the development server:

```

npm start
```

The app should now be running at [http://localhost:3000](http://localhost:3000).
