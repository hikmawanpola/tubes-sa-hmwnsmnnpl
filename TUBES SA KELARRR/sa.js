function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const merged = [];
    let l = 0;
    let r = 0;

    while (l < left.length && r < right.length) {
        if (left[l] < right[r]) {
            merged.push(left[l]);
            l += 1;
        } else {
            merged.push(right[r]);
            r += 1;
        }
    }

    return merged.concat(left.slice(l)).concat(right.slice(r));
}

function visualizeMergeSort(arr, depth = 0) {
    const indent = '    '.repeat(depth);
    if (arr.length <= 1) {
        console.log(`${indent}${arr}`);
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    console.log(`${indent}Splitting ${JSON.stringify(arr)}`);
    const left = visualizeMergeSort(arr.slice(0, mid), depth + 1);
    const right = visualizeMergeSort(arr.slice(mid), depth + 1);

    const merged = merge(left, right);
    console.log(`${indent}${JSON.stringify(left)} | ${JSON.stringify(right)} -> ${JSON.stringify(merged)}`);
    return merged;
}

// Get user input for the array
const userInput = prompt("Enter the elements of the array, separated by spaces:");
const arr = userInput.split(" ").map(Number);

console.log("Merge Sort Process:");
visualizeMergeSort(arr);
