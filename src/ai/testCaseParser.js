
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const testSchema = {
    type: 'object',
    properties: {
        testName: {
            type: 'string'
        },
        steps: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    action: {
                        type: 'string',
                        enum: [
                            'navigate',
                            'fill',
                            'click',
                            'assertVisible',
                            'assertText',
                            'assertPageLoaded'
                        ]
                    },
                    target: {
                        type: 'string'
                    },
                    value: {
                        type: 'string'
                    },
                    expected: {
                        type: 'string'
                    }
                },
                required: [
                    'action',
                    'target',
                    'value',
                    'expected'
                ],
                additionalProperties: false
            }
        }
    },
    required: ['testName', 'steps'],
    additionalProperties: false
};

async function convertTestCase(testCase) {
    const prompt = `
You are a browser test case parser.

Convert the user's test case into structured browser automation steps.

SUPPORTED ACTIONS:

1. navigate
   Open a website.
   Put the URL in value.
   Keep target and expected empty.

2. fill
   Enter text into an input field.
   Put the field description in target.
   Put the text to enter in value.

3. click
   Click a button or link.
   Put its description in target.

4. assertVisible
   Check whether a specific element or text is visible.
   Put its description in target.

5. assertText
   Check whether specific expected text is visible.
   Put the expected text in expected.

6. assertPageLoaded
   Check whether a webpage has loaded.
   Always use this action when the user asks whether a page
   or website is loaded, open, or visible as a whole.
   Keep target, value and expected empty.

IMPORTANT RULES:

- Never use assertVisible for checking an entire webpage.
- Never use phrases like "page body" or "page content"
  as element descriptions for page-load checks.
- Do not invent URLs, credentials or expected results.
- Keep the steps in the same order as the user's instructions.
- Return only valid structured data.
- Never invent, assume, or generate login credentials.
- When the user refers to PHPTravels email, use
  {{PHPTRAVELS_EMAIL}} as the fill value.
- When the user refers to PHPTravels password, use
  {{PHPTRAVELS_PASSWORD}} as the fill value.
- Preserve these placeholders exactly.
- Never output actual secret values.

User test case:
${testCase}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseJsonSchema: testSchema
        }
    });

    if (!response.text) {
        throw new Error('Gemini returned an empty response.');
    }

    const result = JSON.parse(response.text);

    if (!Array.isArray(result.steps) || result.steps.length === 0) {
        throw new Error('Gemini generated an empty test plan.');
    }

    return result;
}

async function main() {
    const testCase = `
        Open https://chatgpt.com
        Check whether the page has loaded.
    `;

    try {
        const result = await convertTestCase(testCase);

        console.log('\nGenerated Test Plan:\n');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Gemini Error:', error.message);
    }
}

module.exports = { convertTestCase };

if (require.main === module) {
    main();
}
