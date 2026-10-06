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


# A* Search
def a_star(graph, h, start, goal):
    pq = [(h[start], 0, start, [start])]

    while pq:
        f, g, node, path = heapq.heappop(pq)

        if node == goal:
            return path, g

        for next_node, cost in graph[node]:
            new_g = g + cost
            new_f = new_g + h[next_node]

            heapq.heappush(
                pq,
                (new_f, new_g, next_node, path + [next_node])
            )

print("A*:", a_star(graph, h, 'A', 'E'))
