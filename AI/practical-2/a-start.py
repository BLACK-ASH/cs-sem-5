import heapq

graph = {
    "bandra-plot": {
        "market": 5,
        "highway": 10,
        "majas": 15,
        "megwadi": 10,
        "station": 10,
    },

    "market": {
        "bandra-plot": 5,
        "station": 8,
    },

    "highway": {
        "bandra-plot": 10,
        "station": 7,
        "trauma": 5,
        "megwadi": 20,
    },

    "majas": {
        "bandra-plot": 15,
        "ramwadi": 5,
        "pratap-nagar": 10,
        "trauma": 15,
        "station": 20,
    },

    "megwadi": {
        "bandra-plot": 10,
        "highway": 20,
        "station": 14,
    },

    "station": {
        "bandra-plot": 10,
        "market": 8,
        "highway": 7,
        "majas": 20,
        "iy-college": 10,
    },

    "trauma": {
        "highway": 5,
        "majas": 15,
        "iy-college": 8,
    },

    "ramwadi": {
        "majas": 5,
        "pratap-nagar": 4,
    },

    "pratap-nagar": {
        "majas": 10,
        "ramwadi": 4,
        "iy-college": 6,
    },

    "iy-college": {
        "station": 10,
        "trauma": 8,
        "pratap-nagar": 6,
        "megwadi": 12,
    },
}


# for key in graph:
#     print(key)
#
# for value in graph.values():
#     print(value)

def bfs(graph, root, target):
    visited = set()
    queue = [root]
    parent = {}

    while queue:
        node = queue.pop(0)

        if node in visited:
            continue

        visited.add(node)

        if node == target:
            path = []
            current = target

            while current != root:
                path.append(current)
                current = parent[current]

            path.append(root)
            path.reverse()

            print("Path:", path)
            return

        for neighbor in graph[node]:
            if neighbor not in visited:
                if neighbor not in parent:
                    parent[neighbor] = node

                queue.append(neighbor)


bfs(graph, 'bandra-plot', 'iy-college')

heuristic = {
    "bandra-plot": 20,
    "market": 18,
    "highway": 12,
    "majas": 10,
    "megwadi": 8,
    "station": 9,
    "trauma": 6,
    "ramwadi": 7,
    "pratap-nagar": 4,
    "iy-college": 0,
}


def a_star(graph, heuristic, start, goal):
    open_list = [(heuristic[start], 0, start)]

    g_cost = {
        start: 0
    }

    parent = {
        start: None
    }

    visited = set()

    while open_list:
        f_cost, current_g, node = heapq.heappop(open_list)

        if node in visited:
            continue

        visited.add(node)

        if node == goal:
            path = []

            while node is not None:
                path.append(node)
                node = parent[node]

            path.reverse()

            return {
                "path": path,
                "cost": current_g
            }

        for neighbor, edge_cost in graph[node].items():
            new_g = current_g + edge_cost

            if neighbor not in g_cost or new_g < g_cost[neighbor]:
                g_cost[neighbor] = new_g
                parent[neighbor] = node

                new_f = new_g + heuristic[neighbor]

                heapq.heappush(
                    open_list,
                    (new_f, new_g, neighbor)
                )

    return None


result = a_star(
    graph,
    heuristic,
    "bandra-plot",
    "pratap-nagar"
)

print(result)
