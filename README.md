# Notebin

Your Centralized Academic Repository

## Description

Notebin is a platform designed to help students find, organize, and share academic notes and materials. It offers a centralized hub for all your study resources, making it easy to access a wide range of study materials and contribute to the community by sharing your own notes.

## Features

- **Find Notes**: Easily search and access a wide range of study materials for all your courses.
- **Centralized Hub**: Manage and organize all your academic resources efficiently in one place.
- **Upload Materials**: Share your notes and study materials with others and contribute to the community.

## Project Structure

This repository contains two main folders:

1. **client**: The frontend of the application built using Next.js.
2. **server**: The backend of the application built using Express.js.

## Setup Instructions

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher) or yarn (v1.x or higher)
- MongoDB (for the backend database)

### Client Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/notebin.git
    cd notebin/client
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The client application should now be running at `http://localhost:3000`.

### Server Setup

1. Navigate to the `server` folder:

    ```bash
    cd ../server
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env` file in the `server` folder and `{for env contact}` add the following environment variables:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:

    ```bash
    npm start
    # or
    yarn start
    ```

    The server should now be running at `http://localhost:5000`.

### Environment Variables

#### Client

- `NEXT_PUBLIC_API_URL`: The base URL for the API. Example: `http://localhost:5000/api`

#### Server

- `PORT`: The port on which the server will run. Default is `5000`.
- `MONGO_URI`: The connection string for your MongoDB instance.
- `JWT_SECRET`: The secret key for signing JWT tokens. Make sure this is a secure and random string.

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Use the search functionality to find notes.
3. Upload your own notes to share with the community.
4. Manage your notes and study materials efficiently through the centralized hub.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features, bug fixes, or enhancements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any questions or feedback, please contact.

---

© 2024 Abhyudaya. All rights reserved.

---
