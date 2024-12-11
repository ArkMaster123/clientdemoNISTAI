# NISTAI - AI-Powered NIST Compliance Engine

NISTAI is a Next.js application that leverages AI to help organizations achieve and maintain NIST compliance. It provides a user-friendly interface for uploading compliance documentation, analyzing NIST alignment, and generating detailed compliance assessments.

## Features

- **Document Upload**: Users can easily upload their compliance documentation in PDF format.
- **AI Analysis**: NISTAI utilizes advanced AI algorithms to analyze the uploaded documents and assess NIST compliance.
- **Compliance Assessment**: The application generates a comprehensive compliance assessment report, highlighting security risks, gaps, and recommendations.
- **NIST Framework Scores**: NISTAI provides scores for various NIST framework categories, giving users a clear understanding of their compliance posture.
- **Recommendations**: The application offers prioritized recommendations to help organizations improve their compliance and security measures.

## Getting Started

To get started with NISTAI, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/nistai.git
   ```

2. Install the dependencies:
   ```
   cd nistai
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the necessary environment variables (e.g., API keys, database connection strings).

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the NISTAI application.

## Project Structure

The project follows the Next.js directory structure:

- `app/`: Contains the main application pages and components.
  - `dashboard/`: Dashboard page components and logic.
  - `nistai/`: NISTAI frontend components and logic.
  - `api/`: API routes for handling backend requests.
- `components/`: Reusable components used throughout the application.
  - `ui/`: UI components such as buttons, cards, inputs, etc.
- `hooks/`: Custom React hooks.
- `lib/`: Utility functions and helper modules.
- `public/`: Static assets such as images and fonts.
- `styles/`: Global CSS styles and Tailwind CSS configuration.

## Contributing

Contributions to NISTAI are welcome! If you find any bugs, have feature requests, or want to contribute improvements, please open an issue or submit a pull request. Make sure to follow the project's coding conventions and guidelines.

## License

NISTAI is open-source software licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or inquiries about NISTAI, please contact us at info@nistai.com.

---

Feel free to customize and expand upon this README file based on your specific project requirements and additional details you want to provide to new contributors or users of your application.
