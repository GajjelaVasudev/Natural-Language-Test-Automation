
const readline = require('readline');

const { convertTestCase } = require('./src/ai/testCaseParser');
const { executeTest } = require('./src/browser/testExecutor');

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('====================================');
    console.log(' Natural Language Test Automation');
    console.log('====================================');

    console.log('\nEnter your complete test case.');
    console.log('Type END on a new line when finished.\n');

    const lines = [];

    rl.on('line', (line) => {
        if (line.trim().toUpperCase() === 'END') {
            rl.close();
            return;
        }

        lines.push(line);
    });

    rl.on('close', async () => {
        const testCase = lines.join('\n').trim();

        if (!testCase) {
            console.log('No test case provided.');
            return;
        }

        try {
            console.log('\nComplete test case received:');
            console.log(testCase);

            console.log('\nConverting test case using Gemini...\n');

            const testPlan = await convertTestCase(testCase);

            console.log('Generated Test Plan:');
            console.log(JSON.stringify(testPlan, null, 2));

            console.log('\nStarting browser automation...\n');

            await executeTest(testPlan);

        } catch (error) {
            console.error('\nApplication Error:', error.message);
        }
    });
}

main();
