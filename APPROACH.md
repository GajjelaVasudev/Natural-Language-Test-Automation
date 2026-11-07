# Approach and Limitations

## 1. Approach

The application follows a simple three-part architecture.

### Natural Language Processing

The user enters a browser test case in plain English. Google Gemini interprets the instructions and converts them into structured JSON actions, such as navigation, filling inputs, clicking buttons and verifying visible text.

### Element Resolution

The locator resolver uses multiple strategies to identify webpage elements:

- Accessible labels
- Placeholder attributes
- Accessible roles
- Common HTML attributes such as name, ID and aria-label

This reduces dependence on fixed CSS selectors and XPath expressions.

### Browser Execution

Playwright reads the generated test steps and performs the corresponding browser actions. It then checks the expected conditions and reports whether execution passed or failed.

Sensitive values are stored in environment variables rather than directly in test instructions or source code.

## 2. Design Decisions

- Used Gemini to interpret natural-language instructions instead of writing separate scripts for each test case.
- Used JSON as an intermediate format to separate AI interpretation from browser execution.
- Used Playwright for browser interaction and verification.
- Used reusable locator strategies to improve adaptability to webpage changes.
- Used environment variables to protect API keys and login credentials.

## 3. Limitations

- AI may occasionally misunderstand ambiguous instructions or generate incomplete steps.
- Element resolution depends on the labels and attributes exposed by the webpage.
- Similar-looking elements can still create ambiguity.
- The executor supports only the browser actions currently implemented.
- A visible-text assertion does not always prove that an entire business workflow succeeded.
- CAPTCHA, multi-factor authentication and complex dynamic workflows are not currently handled.

## 4. Conclusion

The project demonstrates how natural-language processing can be combined with browser automation to simplify test creation and execution. Its modular design allows additional browser actions, locator strategies and verification methods to be added in the future.