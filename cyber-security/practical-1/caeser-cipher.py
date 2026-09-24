def caeser(text, key):
    min = ord('a')
    max = ord('z')
    size = min + max + 1

    result = ''

    for char in text:
        text_char = ord(char)
        cipher = min + ((text_char - min + key) % size)
        result += chr(cipher)

    return result


def decrypt_caeser(text, key):
    min = ord('a')
    max = ord('z')
    size = min + max + 1

    result = ''

    for char in text:
        text_char = ord(char)
        cipher = min + ((text_char - min - key) % size)
        result += chr(cipher)

    return result


plain_text = input("Enter Plain Text : ").lower().strip()
cipher_text = caeser(plain_text, 5)

print("Plain Text : ", plain_text)
print("Cipher Text : ", cipher_text)
print("Decrypt Text : ", decrypt_caeser(cipher_text, 5))

names = ['ashif', 'arshad', 'harsh']
encrypt_names = []

for name in names:
    encrypt_names.append(caeser(name, 3))

for cipher_text in encrypt_names:
    print()
    print(cipher_text, " --> ", decrypt_caeser(cipher_text, 3))
