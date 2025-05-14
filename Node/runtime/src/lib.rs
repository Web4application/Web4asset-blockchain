// Import the PoS staking pallet
use pallet_staking::{Staking, Reward, Config};

// Set initial block reward
pub const BLOCK_REWARD: u64 = 10 * 1_000_000_000; // 10 W4T

// Configure staking parameters
impl pallet_staking::Config for Runtime {
    type Reward = BLOCK_REWARD;
    type Currency = Balances;
    type Event = Event;
}
