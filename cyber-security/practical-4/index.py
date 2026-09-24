from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

public_key = private_key.public_key()

message = b"Sachin D. Jaiswal"

signature = private_key.sign(
    message,
    padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()),
        salt_length=padding.PSS.MAX_LENGTH
    ),
    hashes.SHA256()
)

print("Original Message : ", message.decode())
print("Digital Signature : ")
print(signature.hex())
print("\n")

try:
    public_key.verify(
        signature,
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )

    print("Signature Verification : SUCCESS")
    print("The Message Is Authentic And Has Not Been Modified.")
except Exception as e:
    print("Signature Verification : FAILED")
    print("The Message Is Authentic And Has Been Modified.")

print("\n")
modified_message = b"Bobby D. Jaiswal"
print("Modified Message : ", modified_message.decode())

try:
    public_key.verify(
        signature,
        modified_message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )

    print("Signature Verification : SUCCESS")
    print("The Message Is Authentic And Has Not Been Modified.")
except Exception as e:
    print("Signature Verification : FAILED")
    print("The Message Is Not Authentic And Has Been Modified.")
