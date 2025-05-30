# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Node.js and npm
sudo apt install nodejs npm

# Install Substrate CLI
cargo install --force --git https://github.com/paritytech/substrate substrate

# Clone Substrate Node Template
git clone https://github.com/substrate-developer-hub/substrate-node-template.git web4asset-node
cd web4asset-node

# Compile the Node
cargo build --release

mkdir docs
cp -r build/* docs/

truffle compile
truffle migrate --network development
npm install --save-dev webpack-dev-server
