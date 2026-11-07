# Natural Language Test Automation

An AI-powered browser testing tool that converts plain-English test cases into executable browser automation steps using **Google Gemini** and **Playwright**.

## Overview

Writing automated browser tests usually requires knowledge of programming and browser selectors. This project simplifies that process by allowing users to describe test scenarios in natural language.

The application uses Gemini to interpret instructions and convert them into structured JSON steps. Playwright then executes those steps in a real browser and reports whether the test passed or failed.

## Features

- Accepts multiline test cases written in plain English.
- Uses Google Gemini to generate structured test steps.
- Supports browser navigation, text entry, clicking and visibility assertions.
- Uses Playwright to automate browser interactions.
- Uses reusable element-resolution strategies instead of relying only on fixed selectors.
- Supports environment variables for sensitive test credentials.
- Reports test execution results and errors.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| JavaScript | Application development |
| Google Gemini API | Natural-language test interpretation |
| Playwright | Browser automation |
| dotenv | Environment variable management |

## Project Structure

```text
natural-language-test-automation/
├── src/
│   ├── ai/
│   │   └── testCaseParser.js
│   └── browser/
│       ├── testExecutor.js
│       └── locatorResolver.js
├── test_cases/
├── index.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/GajjelaVasudev/Natural-Language-Test-Automation.git
cd Natural-Language-Test-Automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright Chromium

```bash
npx playwright install chromium
```

### 4. Configure the Gemini API

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
PHPTRAVELS_EMAIL=your_email
PHPTRAVELS_PASSWORD=your_password
```

Never commit the `.env` file or expose API keys and passwords.

## Running the Application

Start the application:

```bash
node index.js
```

Enter a test case in plain English. Type `END` on a new line when finished.

### Example

```text
Open https://www.selenium.dev/selenium/web/web-form.html
Enter Vasudev in the Text input field.
Click the Submit button.
Verify that the Received! text is visible.
END
```

The application generates structured test steps, launches a browser, executes the actions and reports the result.

## Architecture

1. **Input:** The user provides a natural-language test case.
2. **AI interpretation:** Gemini converts the instructions into structured JSON actions.
3. **Element resolution:** The locator resolver searches for elements using accessible labels, placeholders, roles and common HTML attributes.
4. **Execution:** Playwright performs the generated browser actions.
5. **Verification:** Assertions check the expected visible text or page state.
6. **Reporting:** The application reports `TEST PASSED` or `TEST FAILED`.

## Testing

The application has been tried with:

- Selenium Web Form demo: filling an input, clicking Submit and verifying the success message.
- PHPTravels login page: entering credentials through environment variables, clicking Sign in and checking the requested dashboard text.

## Approach and Limitations

### Approach

The project uses AI to interpret test instructions rather than writing individual browser scripts for every test case. The generated JSON separates natural-language understanding from browser execution.

Element resolution combines multiple locator strategies to reduce dependence on fixed IDs, classes and CSS selectors.

### Limitations

- AI-generated steps may occasionally be incomplete or incorrect.
- Element matching depends on the accessibility information and HTML attributes exposed by the website.
- Ambiguous element descriptions may result in locator failures.
- The supported browser actions are currently limited to the actions implemented by the executor.
- A successful text-visibility assertion does not necessarily prove that a complete business workflow succeeded.
- Website-specific authentication, CAPTCHA and dynamic workflows may require additional handling.

## Future Improvements

- Support additional browser actions and assertion types.
- Improve handling of ambiguous element descriptions.
- Add screenshots and detailed execution reports.
- Support more complex workflows and additional websites.

## Author

**Gajjela Vasudev**

GitHub: https://github.com/GajjelaVasudev
