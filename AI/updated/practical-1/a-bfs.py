from collections import deque

graph = {
    'a': ['b', 'c', 'd', 'f'],
    'b': ['c', 'f'],
    'c': ['a', 'b', 'd', 'f'],
    'd': ['a', 'f'],
    'e': ['a', 'b'],
    'f': ['a', 'b', 'd', 'e']
}

def bfs(graph, root, target):
    visited = {root}
    queue = deque([root])

    while queue:
        node = queue.popleft()  # Standard FIFO step
        print(node)             # Print current step

        if node == target:
            print("Target Found")
            return

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    print("Target Not Found")

# Test Run
bfs(graph, 'a', 'd')
