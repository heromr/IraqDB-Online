# Running IraqDB Locally with VS Code

This documentation provides a comprehensive guide to set up and run the IraqDB application locally using Visual Studio Code (VS Code). IraqDB is a full-stack web application for searching and displaying data from multiple SQLite databases with optimized performance.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or later): [Download Node.js](https://nodejs.org/)
- **npm** (v9.x or later): *Included with Node.js installation*
- **Visual Studio Code**: [Download VS Code](https://code.visualstudio.com/)
- **SQLite3**: [Download SQLite](https://www.sqlite.org/download.html)
- **Git**: [Download Git](https://git-scm.com/downloads)

## Required VS Code Extensions

The following VS Code extensions will enhance your development experience:

- **ESLint**: For JavaScript/TypeScript linting
- **Prettier**: For code formatting
- **SQLite Viewer**: For viewing SQLite database files

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/iraqdb.git
cd iraqdb
```

### 2. Install Dependencies

Install all required dependencies for the project:

```bash
npm install
```

### 3. Database Setup

#### SQLite Database Files

1. Create a `databases` directory in the project root:

```bash
mkdir -p databases
```

2. Place your SQLite database files in this directory. The application expects database files to be named after Iraqi provinces, for example:
   - `baghdad.db`
   - `basra.db`
   - `erbil.db`
   - etc.

3. Ensure your database files follow this schema structure:
   - Each database should contain a `records` table with the following fields:
     - `family_id` (text)
     - `first_name` (text)
     - `father_name` (text)
     - `grandfather_name` (text)
     - `birth_date` (text)
     - `mother_name` (text)
     - `maternal_grandfather` (text)

## Running the Application

### 1. Open the Project in VS Code

```bash
code .
```

### 2. Start the Development Server

The project uses a combined dev server setup that runs both the frontend and backend:

```bash
npm run dev
```

This will:
- Start the Express backend server
- Launch the Vite frontend development server
- Set up proxying between the two

### 3. Access the Application

Open your browser and navigate to:

```
http://localhost:5000
```

The application should now be running locally with full functionality.

## Application Features

- **Multi-language Support**: Toggle between English, Arabic, and Kurdish
- **Database Selection**: Search across all databases or select specific ones
- **Advanced Search**: Filter by various fields with exact or partial matching
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

If you see an error like "Port 5000 is already in use":

```bash
# Find the process using the port
lsof -i :5000  # On macOS/Linux
netstat -ano | findstr :5000  # On Windows

# Kill the process
kill -9 <PID>  # On macOS/Linux
taskkill /F /PID <PID>  # On Windows
```

#### 2. Database Connection Issues

If the application can't connect to the databases:

1. Verify that the database files exist in the `databases` directory
2. Check if the database files have the correct permissions
3. Ensure the database schema matches the expected format

```bash
# Check database schema
sqlite3 databases/example.db ".schema records"
```

#### 3. Node.js Version Mismatch

If you encounter errors related to JavaScript syntax:

```bash
# Check your Node.js version
node --version

# If it's below v18, update Node.js or use nvm to switch versions:
nvm use 18
```

## Development Tips

- **Hot Module Replacement**: The development server supports HMR, so changes to your code will automatically update in the browser
- **Debugging**: Use VS Code's built-in debugger with the JavaScript Debug Terminal
- **Language Testing**: Test Arabic and Kurdish input validation by switching languages with the globe icon in the header

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Vite Documentation](https://vitejs.dev/guide/)

## Support

If you encounter any issues not covered in this documentation, please open an issue in the project repository or contact the development team.