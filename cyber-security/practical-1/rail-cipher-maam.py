def encrypt(text):
    even = ""
    odd = ""

    # Read the character
    for i in range(len(text)):
        if i % 2 == 0:
            even += text[i]

        else:
            odd += text[i]
    return even + odd


def decrypt(cipher):
    text = ""

    mid = (len(cipher) + 1) // 2
    even = cipher[:mid]
    odd = cipher[mid:]

    for i in range(len(odd)):
        text += even[i]
        text += odd[i]

    if len(even) > len(odd):
        text += even[-1]

    return text


msg = input("Enter message: ")

enc = encrypt(msg)
print("Encrypted: ", enc)

dec = decrypt(enc)
print("Decrypted: ", dec)
