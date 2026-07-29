graph = {
    'a': ['b', 'c', 'd', 'f'],
    'b': ['c', 'f'],
    'c': ['a', 'b', 'd', 'f'],
    'd': ['a', 'f'],
    'e': ['a', 'b'],
    'f': ['a', 'b', 'd', 'e']
}


def bfs(graph, root, target):
    visited = set()
    queue = [root]

    while queue:
        node = queue.pop(0)  # Queue se front element nikalo

        if node in visited:
            continue

        visited.add(node)
        print(node)

        if node == target:
            print("Target Found")
            return

        queue.extend(graph[node])

    print("Target Not Found")


bfs(graph, 'a', 'd')
