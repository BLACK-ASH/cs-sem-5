import heapq

# Graph
edges = [
    ('A', 'B', 2),
    ('A', 'C', 4),
    ('B', 'D', 3),
    ('C', 'D', 1),
    ('D', 'E', 2)
]

graph = {}

for a, b, cost in edges:
    graph.setdefault(a, []).append((b, cost))
    graph.setdefault(b, []).append((a, cost))

# Heuristic
h = {
    'A': 7,
    'B': 5,
    'C': 4,
    'D': 2,
    'E': 0
}

# Best First Search
def best_first(graph, h, start, goal):
    pq = [(h[start], start, [start])]

    while pq:
        _, node, path = heapq.heappop(pq)

        if node == goal:
            return path

        for next_node, cost in graph[node]:
            heapq.heappush(
                pq,
                (h[next_node], next_node, path + [next_node])
            )

print("Best First:", best_first(graph, h, 'A', 'E'))
