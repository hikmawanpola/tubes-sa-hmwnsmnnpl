def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)


def merge(left, right):
    merged = []
    l = r = 0

    while l < len(left) and r < len(right):
        if left[l] < right[r]:
            merged.append(left[l])
            l += 1
        else:
            merged.append(right[r])
            r += 1

    merged.extend(left[l:])
    merged.extend(right[r:])
    return merged


def visualize_merge_sort(arr, depth=0):
    indent = '    ' * depth
    if len(arr) <= 1:
        print(f"{indent}{arr}")
        return arr

    mid = len(arr) // 2
    print(f"{indent}Splitting {arr}")
    left = visualize_merge_sort(arr[:mid], depth + 1)
    right = visualize_merge_sort(arr[mid:], depth + 1)

    merged = merge(left, right)
    print(f"{indent}{left} | {right} -> {merged}")
    return merged


# Get user input for the array
user_input = input("Enter the elements of the array, separated by spaces: ")
arr = [int(x) for x in user_input.split()]

print("Merge Sort Process:")
visualize_merge_sort(arr)
