p = int(input("Enter Prime Number (p): "))
g = int(input("Enter Primitive Root (g): "))

a = int(input("Enter Alice's Private Key : "))
b = int(input("Enter Bob's Private Key : "))

A = pow(g, a, p)
B = pow(g, b, p)

KA = pow(B, a, p)
KB = pow(A, a, p)

print("\n")
print("Alice's Public Key : ", A)
print("Bob's Public Key : ", B)

print("\n")
print("Alice's Shared Secred : ", KA)
print("Bob's Shared Secred : ", KB)

print("\n")
if KA == KB:
    print("Key Exchange Successful!")
else:
    print("Key Exchange Failed!")
