#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{dispatch::DispatchResult, pallet_prelude::*};
    use frame_system::pallet_prelude::*;

    #[pallet::pallet]
    #[pallet::generate_store(pub(super) trait Store)]
    pub struct Pallet<T>(_);

    #[pallet::storage]
    #[pallet::getter(fn total_supply)]
    pub type TotalSupply<T> = StorageValue<_, u64, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn balance_of)]
    pub type BalanceOf<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, u64, ValueQuery>;

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        pub fn mint(origin: OriginFor<T>, to: T::AccountId, amount: u64) -> DispatchResult {
            let _sender = ensure_signed(origin)?;
            let new_balance = BalanceOf::<T>::get(&to).saturating_add(amount);
            BalanceOf::<T>::insert(&to, new_balance);

            let new_supply = TotalSupply::<T>::get().saturating_add(amount);
            TotalSupply::<T>::put(new_supply);

            Ok(())
        }
    }
}
