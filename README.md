# Field Service Telegram

This is an open-source project that combines a Vite-powered React frontend with an Odoo backend to create a modern and efficient field service management application with Telegram integration.

## Tech Stack

- **Frontend:**
  - [Vite](https://vitejs.dev/)
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
- **Backend:**
  - [Odoo](https://www.odoo.com/)
  - [Python](https://www.python.org/)

## Features

- Real-time task updates
- Telegram bot integration for notifications and commands
- User-friendly interface for managing field service tasks
- Extensible and customizable Odoo backend

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Bun](https://bun.sh/)
- [Python](https://www.python.org/) (v3.10 or higher)
- [Odoo](https://www.odoo.com/documentation/17.0/administration/install.html) (v17.0 or higher)

### Frontend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/FieldService-Telegram.git
   cd FieldService-Telegram
   ```
2. **Install dependencies:**
   ```bash
   bun install
   ```
3. **Run the development server:**
   ```bash
   bun dev
   ```
   The frontend will be available at `http://localhost:5173`.

### Backend Setup

1. **Navigate to the Odoo backend directory:**
   ```bash
   cd odoo-backend
   ```
2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Odoo:**
   - Create an Odoo database.
   - Add the `connector` module to your Odoo addons path.
   - Install the `connector` module in your Odoo database.
4. **Run the Odoo server:**
   ```bash
   odoo-bin -c /path/to/your/odoo.conf
   ```

## Contributing

We welcome contributions from the community! To contribute, please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit them:**
   ```bash
   git commit -m "feat: add your feature"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a pull request.**

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or suggestions, please open an issue or contact us at [your-email@example.com](mailto:your-email@example.com).
