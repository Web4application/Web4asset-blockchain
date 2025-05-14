# src/utils/helper.py

import json
import os
import re
import logging
from datetime import datetime
from pathlib import Path
from decimal import Decimal

# Logging Configuration
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)
logging.basicConfig(
    filename=LOG_DIR / "web4asset.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

def log_info(message: str):
    """Log informational messages."""
    logging.info(message)

def log_error(message: str):
    """Log error messages."""
    logging.error(message)

def to_wei(amount: Decimal) -> int:
    """Convert W4T to Wei (18 decimal places)."""
    return int(amount * Decimal(10**18))

def from_wei(amount: int) -> Decimal:
    """Convert Wei to W4T."""
    return Decimal(amount) / Decimal(10**18)

def is_valid_address(address: str) -> bool:
    """Check if a given address is a valid Ethereum-like address."""
    pattern = r"^0x[a-fA-F0-9]{40}$"
    return bool(re.match(pattern, address))

def read_json(file_path: str) -> dict:
    """Read a JSON file and return its contents."""
    if not os.path.exists(file_path):
        log_error(f"File not found: {file_path}")
        return {}
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception as e:
        log_error(f"Error reading {file_path}: {e}")
        return {}

def write_json(file_path: str, data: dict):
    """Write data to a JSON file."""
    try:
        with open(file_path, "w") as f:
            json.dump(data, f, indent=4)
        log_info(f"Data written to {file_path}")
    except Exception as e:
        log_error(f"Error writing to {file_path}: {e}")

def timestamp() -> str:
    """Generate a formatted timestamp."""
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

def pretty_print(data: dict):
    """Pretty print a JSON object."""
    print(json.dumps(data, indent=4))

def safe_get(data: dict, keys: list, default=None):
    """Safely access nested dictionary keys."""
    try:
        for key in keys:
            data = data[key]
        return data
    except (KeyError, TypeError):
        return default
