graph = {
    'a': ['b', 'c', 'd', 'f'],
    'b': ['c', 'f'],
    'c': ['a', 'b', 'd', 'f'],
    'd': ['a', 'f'],
    'e': ['a', 'b'],
    'f': ['a', 'b', 'd', 'e']
}

def dfs(graph, root, target):
    visited = set()
    stack = [root]

    while stack:
        node = stack.pop()  # Standard LIFO step (last element)

        if node in visited:
            continue

        visited.add(node)
        print(node)         # Print current step

        if node == target:
            print("Target Found")
            return

        # Safely extend using the current node's neighbors
        stack.extend(graph[node])

    print("Target Not Found")

# Test Run
dfs(graph, 'a', 'd')
