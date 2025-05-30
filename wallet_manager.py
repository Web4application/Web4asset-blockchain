import json
from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import scrypt
from Crypto.Util.Padding import unpad
from web3 import Web3
from web3.exceptions import ContractLogicError

# --- Config ---
RPC_URL = "https://web4asset.io/rpc"
CHAIN_ID = 1337
GAS_PRICE_GWEI = 10

# --- ERC-20 ABI ---
ERC20_ABI = [
    {
        "constant": True,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    }
]

# --- Functions ---
def decrypt_private_key(encrypted_b64, password):
    encrypted = b64decode(encrypted_b64)
    if encrypted[:8] != b"Salted__":
        raise ValueError("Invalid encryption format.")
    salt = encrypted[8:16]
    key, iv = scrypt(password.encode(), salt, 32, 16, N=16384, r=8, p=1)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = unpad(cipher.decrypt(encrypted[16:]), AES.block_size)
    return decrypted.hex()

def get_eth_balance(web3, address):
    wei = web3.eth.get_balance(address)
    return web3.fromWei(wei, 'ether')

def get_token_balance(web3, token_contract_address, wallet_address):
    contract = web3.eth.contract(address=token_contract_address, abi=ERC20_ABI)
    symbol = contract.functions.symbol().call()
    raw_balance = contract.functions.balanceOf(wallet_address).call()
    decimals = 18  # adjust if needed
    return symbol, raw_balance / (10 ** decimals), contract

def send_erc20(web3, contract, from_address, private_key, to_address, amount, gas_limit=60000):
    decimals = 18
    value = int(amount * (10 ** decimals))
    txn = contract.functions.transfer(to_address, value).build_transaction({
        'chainId': CHAIN_ID,
        'gas': gas_limit,
        'gasPrice': web3.toWei(GAS_PRICE_GWEI, 'gwei'),
        'nonce': web3.eth.get_transaction_count(from_address),
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    return tx_hash.hex()

# --- Main ---
def main():
    with open('wallets.json', 'r') as f:
        data = json.load(f)

    web3 = Web3(Web3.HTTPProvider(RPC_URL))
    assert web3.isConnected(), "❌ Cannot connect to Web4Asset RPC."

    for wallet in data['wallets']:
        print("\n--------------------------")
        print(f"🔐 Wallet: {wallet['address']}")
        password = input("Enter decryption password: ")

        try:
            private_key = decrypt_private_key(wallet["encryptedPrivateKey"], password)
        except Exception as e:
            print(f"❌ Failed to decrypt private key: {e}")
            continue

        address = Web3.toChecksumAddress(wallet["address"])
        try:
            eth_balance = get_eth_balance(web3, address)
            print(f"💰 W4T (native): {eth_balance:.4f}")
        except Exception as e:
            print(f"⚠️ ETH balance error: {e}")

        for token in wallet.get("tokens", []):
            try:
                contract_addr = Web3.toChecksumAddress(token["contractAddress"])
                symbol, balance, contract = get_token_balance(web3, contract_addr, address)
                print(f"📦 {symbol}: {balance:.4f}")

                # Ask if user wants to send
                send = input(f"Do you want to send {symbol}? (y/n): ").strip().lower()
                if send == 'y':
                    to_addr = input("To address: ").strip()
                    amount = float(input(f"Amount of {symbol} to send: "))
                    tx_hash = send_erc20(web3, contract, address, private_key, Web3.toChecksumAddress(to_addr), amount)
                    print(f"🚀 Sent! TX Hash: {tx_hash}")
            except ContractLogicError as cle:
                print(f"⚠️ Contract error for {token['symbol']}: {cle}")
            except Exception as e:
                print(f"⚠️ Error with token {token['symbol']}: {e}")

# --- Run ---
if __name__ == "__main__":
    main()
