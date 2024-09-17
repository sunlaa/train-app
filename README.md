# Train App 🚞

This project is a web-based platform designed to manage train trips. It includes role-based access for anonymous users, authorized users, and resource managers, each with unique responsibilities. The platform enables streamlined scheduling, booking, and trip management. The project is designed as a final part of the Angular course from [RS School](https://rs.school/).

## Team members 🤝

Mentors: [Dzmitry Tsiareshchanka](https://github.com/dmitrytereshchenko) and [Sergey Fedorov](https://github.com/Dazmond-ru)

Developers:

- [Lada Santalava](https://github.com/sunlaa)
- [Danila Markelov](https://github.com/hny-badger)
- [Teymur Farhadov](https://github.com/teymurdev)

## Technical Details 🛠

### Deployment

[Deploy](https://train-app.netlify.app/)

### The technology stack

- [Angular](https://angular.dev/):
  - Standalone components
  - [RxJS](https://rxjs.dev/)
  - [Signals](https://angular.dev/guide/signals)
  - [NgRx](https://ngrx.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)
- [PrimeNG](https://primeng.org)

### Scripts 

| Script              | Description                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| **`start`**         | Runs the Angular development server for local development with live reloading |
| **`build`**         | Compiles the Angular project into production bundle                           |
| **`watch`**         | Continuously builds the project in development mode, detecting changes        |
| **`lint`**          | Lints the project files according to coding standards and configuration       |
| **`prettier`**      | Formats the code files using Prettier to ensure a consistent style            |
| **`prepare`**       | Initializes Husky to manage Git hooks                                         |
| **`test`**          | Runs the test suite using Jest to verify the correctness of the application   |
| **`test:watch`**    | Runs Jest in watch mode, rerunning tests when files change                    |
| **`test:coverage`** | Generates a code coverage report to show how much of the code is tested       |

### Getting started

#### **Prerequisites**

Before you begin, ensure you have the following installed:
- **Node.js and npm**<br>
  You can download it from [Node.js official site](https://nodejs.org)
- **Angular CLI**<br>
  Install globally with the following command:
  ```
  npm install -g @angular/cli
  ```

#### **Project Setup**
1. **Clone the Repository**<br>
    Start by cloning the project to your local machine:
    ```
    git clone https://github.com/sunlaa/train-app.git
    ```
2. **Install Dependencies**<br>
    Install the required dependencies by running:
    ```
    npm install
    ```
3. **Run the Application**<br>
    Start the development server to view the application locally:
    ```
    npm start
    ```
    The app will be accessible at `http://localhost:4200/`.
4. **Running Tests**<br>
    To run the test suite with Jest:
    ```
    npm test
    ```
5. **Build for Production**<br>
    To create a production build:
    ```
    npm run build
    ```
**Additional Commands**<br>
Refer to the **Scripts** section above for more commands you can run.



