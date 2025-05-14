import json
from eth_account import Account
from pathlib import Path
from encryption import encrypt_private_key, decrypt_private_key

WALLET_FILE = "wallet.json"

def generate_wallet(password: str) -> dict:
    """Generate a new Ethereum wallet and encrypt the private key."""
    account = Account.create()
    encrypted_private_key = encrypt_private_key(account.key.hex(), password)

    wallet = {
        "address": account.address,
        "publicKey": account._key_obj.public_key.to_hex(),
        "encryptedPrivateKey": encrypted_private_key,
        "balance": "0 W4T",
        "tokens": []
    }
    return wallet

def save_wallet(wallet: dict):
    """Save the wallet to wallet.json."""
    wallet_data = load_wallets()
    wallet_data["wallets"].append(wallet)

    with open(WALLET_FILE, "w") as f:
        json.dump(wallet_data, f, indent=4)

def load_wallets() -> dict:
    """Load wallet data from wallet.json."""
    if not Path(WALLET_FILE).exists():
        return {"wallets": []}

    with open(WALLET_FILE, "r") as f:
        return json.load(f)

def get_wallet(address: str) -> dict:
    """Retrieve a wallet by address."""
    wallets = load_wallets()["wallets"]
    for wallet in wallets:
        if wallet["address"] == address:
            return wallet
    raise Exception("Wallet not found.")

def decrypt_wallet(address: str, password: str) -> str:
    """Decrypt the private key of a wallet using the password."""
    wallet = get_wallet(address)
    encrypted_key = wallet["encryptedPrivateKey"]
    return decrypt_private_key(encrypted_key, password)

def display_wallet_info(address: str):
    """Display wallet information without revealing the private key."""
    wallet = get_wallet(address)
    print(f"Address: {wallet['address']}")
    print(f"Balance: {wallet['balance']}")
    print(f"Tokens: {wallet['tokens']}")

def create_new_wallet():
    """Interactive wallet creation."""
    password = input("Enter a strong password: ")
    wallet = generate_wallet(password)
    save_wallet(wallet)
    print(f"New wallet created. Address: {wallet['address']}")

def unlock_wallet():
    """Interactive wallet decryption."""
    address = input("Enter wallet address: ")
    password = input("Enter your password: ")
    try:
        private_key = decrypt_wallet(address, password)
        print(f"Private Key: {private_key}")
    except Exception as e:
        print(f"Error: {e}")
