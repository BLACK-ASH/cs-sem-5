graph = {
    'a': ['b', 'c', 'd', 'f'],
    'b': ['c', 'f'],
    'c': ['a', 'b', 'd', 'f'],
    'd': ['a', 'f'],
    'e': ['a', 'b'],
    'f': ['a', 'b', 'd', 'e']
}

def dfs(graph,root,target):
    visited = set()
    queue = [root]

    while queue:
        node = queue.pop(len(queue)-1)
        if target == node:
            print("Target Found")
            return
        else:
            if node not in visited:
                queue.extend(graph[root])
                visited.add(node)
                print(node)
    return

dfs(graph,'a','d')

