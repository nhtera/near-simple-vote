/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{serde::{Serialize, Deserialize}, AccountId};
use near_sdk::{env, near_bindgen, setup_alloc};
use near_sdk::collections::{LookupMap, UnorderedMap};
use std::collections::HashSet;

setup_alloc!();


// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Welcome {
    records: LookupMap<String, String>,
    posts: UnorderedMap<usize, Post>,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Post {
    post_id: usize,
    title: String,
    body: String,
    author: AccountId,
    create_at: u64,
    up_votes: HashSet<AccountId>,
    down_votes: HashSet<AccountId>,
}

impl Post {
    pub fn new(post_id: usize, title: String, body: String, author: AccountId, create_at: u64) -> Self {
        Self {
            post_id,
            title,
            body,
            author,
            create_at,
            up_votes: HashSet::new(),
            down_votes: HashSet::new(),
        }
    }

    pub fn add_upvote(&mut self, account_id: AccountId) -> bool {
        if self.down_votes.contains(&account_id) {
            self.down_votes.retain(|x| *x!= account_id);
        }

        self.up_votes.insert(account_id)
    }

    pub fn remove_upvote(&mut self, account_id: AccountId) -> bool {
        self.up_votes.remove(&account_id)
    }

    pub fn add_downvote(&mut self, account_id: AccountId) -> bool {
        if self.up_votes.contains(&account_id) {
            self.up_votes.retain(|x| *x != account_id);
        }

        self.down_votes.insert(account_id)
    }

    pub fn remove_downvote(&mut self, account_id: AccountId) -> bool {
        self.down_votes.remove(&account_id)
    }

}

impl Default for Welcome {
  fn default() -> Self {
    Self {
      records: LookupMap::new(b"a".to_vec()),
      posts: UnorderedMap::new(b"posts".to_vec()),
    }
  }
}

#[near_bindgen]
impl Welcome {

    pub fn create_post(&mut self, title: String, body: String) -> usize {
        let post_id = (self.posts.len() + 1) as usize;
        let author = env::predecessor_account_id();
        let create_at = env::block_timestamp();
        let new_post = Post::new(post_id, title.clone(), body, author.clone(), create_at);

        self.posts.insert(&post_id, &new_post);

        env::log(format!("Post: {} was created by {}", title, author).as_bytes());

        post_id
    }

    pub fn get_post(&self, post_id: usize) -> Option<Post> {
        self.posts.get(&post_id)
    }

    pub fn get_posts(&self) -> Vec<Post> {
        let mut posts = Vec::new();
        for post_id in self.posts.keys() {
            posts.push(self.posts.get(&post_id).unwrap());
        }

        posts
    }


    pub fn set_greeting(&mut self, message: String) {
        let account_id = env::signer_account_id();

        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("Saving greeting '{}' for account '{}'", message, account_id,).as_bytes());

        self.records.insert(&account_id, &message);
    }

    // `match` is similar to `switch` in other languages; here we use it to default to "Hello" if
    // self.records.get(&account_id) is not yet defined.
    // Learn more: https://doc.rust-lang.org/book/ch06-02-match.html#matching-with-optiont
    pub fn get_greeting(&self, account_id: String) -> String {
        match self.records.get(&account_id) {
            Some(greeting) => greeting,
            None => "Hello".to_string(),
        }
    }


}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn set_then_get_greeting() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Welcome::default();
        contract.set_greeting("howdy".to_string());
        assert_eq!(
            "howdy".to_string(),
            contract.get_greeting("bob_near".to_string())
        );
    }

    #[test]
    fn get_default_greeting() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let contract = Welcome::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(
            "Hello".to_string(),
            contract.get_greeting("francis.near".to_string())
        );
    }
}
