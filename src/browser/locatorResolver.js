async function findElement(page, description, type = 'any') {
    const name = description.trim();

    if (!name) {
        throw new Error('Element description cannot be empty.');
    }

    // Remove generic words from the user's description.
    const normalizedName = name
        .replace(/\s+(field|textbox|button|link)$/i, '')
        .trim();

    const candidates = [];

    function add(locator) {
        candidates.push(locator);
    }

    // Strategy 1: Accessible label
    add(page.getByLabel(normalizedName, { exact: false }));

    // Strategy 2: Placeholder
    add(page.getByPlaceholder(normalizedName, { exact: false }));

    // Strategy 3: Accessible role
    if (type === 'input' || type === 'any') {
        add(page.getByRole('textbox', {
            name: normalizedName,
            exact: false
        }));
    }

    if (type === 'button' || type === 'any') {
        add(page.getByRole('button', {
            name: normalizedName,
            exact: false
        }));
    }

    if (type === 'link' || type === 'any') {
        add(page.getByRole('link', {
            name: normalizedName,
            exact: false
        }));
    }

    // Strategy 4: Common HTML attributes
    const inputTypes = type === 'input'
        ? 'input, textarea'
        : 'input, textarea, button, a, select';

    const elements = page.locator(inputTypes);
    const count = await elements.count();

    for (let i = 0; i < count; i++) {
        const element = elements.nth(i);

        const attributes = await element.evaluate(el => ({
            name: el.getAttribute('name') || '',
            id: el.id || '',
            placeholder: el.getAttribute('placeholder') || '',
            ariaLabel: el.getAttribute('aria-label') || '',
            type: el.getAttribute('type') || ''
        }));

        const searchableText = [
            attributes.name,
            attributes.id,
            attributes.placeholder,
            attributes.ariaLabel,
            attributes.type
        ].join(' ').toLowerCase();

        if (searchableText.includes(normalizedName.toLowerCase())) {
            add(element);
        }
    }

    // Return the first unique, visible match
    for (const locator of candidates) {
        const matches = await locator.count();

        if (matches === 1 && await locator.isVisible()) {
            return locator;
        }
    }

    throw new Error(
        `Could not find a unique visible element matching: ${name}`
    );
}

module.exports = { findElement };