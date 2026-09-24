from math import gcd


def mod_inverse(e, phi):
    for d in range(1, phi):
        if (d*e) % phi == 1:
            return d
    return None


p = int(input("Enter First Prime Number (p) : "))
q = int(input("Enter Second Prime Number (q) : "))

n = p*q

phi = (p-1)*(q-1)

e = int(input("Enter A Value Of E : "))

while gcd(e, phi) != 1:
    print("E Must Be Co-Prime With : ", phi)
    e = int(input("Enter Another E : "))

d = mod_inverse(e, phi)
print("\nPublic Key : ", (e, n))
print("Private Key : ", (d, n))

message = int(input("Enter Message(number less than n) : "))

cipher = pow(message, e, n)
print("Encrypted Message : ", cipher)

plain = pow(cipher, d, n)
print("Decrypted Message : ", plain)
