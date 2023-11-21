export const sumArrays = (arrays) => {
    if (!arrays || arrays.length === 0) {
        return [];
    }

    const inputArray = arrays[0];

    if (!inputArray || inputArray.length === 0) {
        return [];
    }

    const result = inputArray.slice();

    for (let i = 1; i < arrays.length; i++) {
        const currentArray = arrays[i];
        if (currentArray.length !== result.length) {
            // Arrays must be of equal length
            return [];
        }

        for (let j = 0; j < result.length; j++) {
            result[j] += currentArray[j];
        }
    }

    return result;
}