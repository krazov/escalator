const namesReducer =
    ({ answer = true, names = [] }, { name }) =>
        ({
            answer: answer && name && !names.includes(name),
            names: [...names, name],
        });

export const checkNames =
    (sections) =>
        sections.reduce(namesReducer, {}).answer;

// TODO: create variant that takes array of [name, value, range]
export const spawn =
    ({
         name = '',
         value = 0,
         range = 10,
     } = {}) => ({ name, value, range });

export const separate = (index, separator) => index > 0 ? separator : '';

export const printReducer =
    (separator) => (finalResponse, { value, range }, index) =>
        finalResponse + separate(index, separator) + (index ? pad(value, range) : value);

export const printFullReducer =
    (finalResponse, { name, value, range }, index) =>
        `${finalResponse}${index ? ', ' : ''}{ name: ${name}, value: ${value}, range: ${range} }`;

export const isMultiple10 = (number) => {
    const [first, ...rest] = String(number);

    return first == '1' && rest.every((digit) => digit == '0');
};

export const pad =
    (value, range = value) =>
        String(value).padStart(isMultiple10(range) ? String(range).length - 1 : String(range).length, '0');
