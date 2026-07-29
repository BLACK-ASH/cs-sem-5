def rail_fence_encrypt(text, key):
    if key <= 1:
        return text

    rails = [''] * key

    rail = 0
    direction = 1  # 1 = down, -1 = up

    for char in text:
        rails[rail] += char

        if rail == 0:
            direction = 1
        elif rail == key - 1:
            direction = -1
        rail += direction

    return ''.join(rails)


def rail_fence_decrypt(cipher, key):
    if key <= 1:
        return cipher

    # Mark zigzag positions
    pattern = [['' for _ in cipher] for _ in range(key)]

    rail = 0
    direction = 1

    for col in range(len(cipher)):
        pattern[rail][col] = '*'

        if rail == 0:
            direction = 1
        elif rail == key - 1:
            direction = -1

        rail += direction

    # Fill marked positions
    index = 0
    for r in range(key):
        for c in range(len(cipher)):
            if pattern[r][c] == '*':
                pattern[r][c] = cipher[index]
                index += 1

    # Read zigzag
    result = []

    rail = 0
    direction = 1

    for col in range(len(cipher)):
        result.append(pattern[rail][col])

        if rail == 0:
            direction = 1
        elif rail == key - 1:
            direction = -1

        rail += direction

    return ''.join(result)


plain_text = input("Enter Plain Text : ")
key = int(input("Enter Key : "))
cipher_text = rail_fence_encrypt(plain_text, key)


print("Plain Text : ", plain_text)
print("Cipher Text : ", cipher_text)
print("Decrypt Text : ", rail_fence_decrypt(cipher_text, 5))
