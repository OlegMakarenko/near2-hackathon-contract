import { context, logging, ContractPromise, u128, u64 } from "near-sdk-as";


// Model

@nearBindgen
class PriceArg {
	constructor(
		public payload: string, 
	) { }
}

@nearBindgen
class Price {
	constructor(
		public roundID: u128, 
		public price: u64,
		public startedAt: u64,
		public timeStamp: u64,
		public answeredInRound: u128 
	) { }
}

@nearBindgen
class ReverseArgs {
	constructor(
		public arg: PriceArg
	) { }
}



// Smart Contract

export function getPrice(): void {
	const contract = "client.chaimlink.testnet"	// Chainlink contract name
	const method = "get_price"					// Chainlink get price method

	// Base64 request payload
	const NEAR_USD_BASE64 = "eyJnZXQiOiJodHRwczovL21pbi1hcGkuY3J5cHRvY29tcGFyZS5jb20vZGF0YS9wcmljZT9mc3ltPU5FQVImdHN5bXM9VVNEJmFwaV9rZXk9MDI4M2I3NjY0NTdjY2ZjZmE2NDRjNTJkMjJhMWUzOThkYmI2NjQyZGQyYmRmODcwNTVlYzRjZTBlM2I3NzhmMyIsInBhdGgiOiJVU0QiLCJ0aW1lcyI6MTAwfQ==";
	const ETH_USD_BASE64 = "eyJnZXQiOiJodHRwczovL21pbi1hcGkuY3J5cHRvY29tcGFyZS5jb20vZGF0YS9wcmljZT9mc3ltPUVUSCZ0c3ltcz1VU0QmYXBpX2tleT0wMjgzYjc2NjQ1N2NjZmNmYTY0NGM1MmQyMmExZTM5OGRiYjY2NDJkZDJiZGY4NzA1NWVjNGNlMGUzYjc3OGYzIiwicGF0aCI6IlVTRCIsInRpbWVzIjoxMDB9";
	const DAI_USD_BASE64 = "eyJnZXQiOiJodHRwczovL21pbi1hcGkuY3J5cHRvY29tcGFyZS5jb20vZGF0YS9wcmljZT9mc3ltPURBSSZ0c3ltcz1VU0QmYXBpX2tleT0wMjgzYjc2NjQ1N2NjZmNmYTY0NGM1MmQyMmExZTM5OGRiYjY2NDJkZDJiZGY4NzA1NWVjNGNlMGUzYjc3OGYzIiwicGF0aCI6IlVTRCIsInRpbWVzIjoxMDB9"';

	// Base64 payload to arguments
	const nearArgs = new PriceArg(NEAR_USD_BASE64);
	const ethArgs = new PriceArg(ETH_USD_BASE64);
	const daiArgs = new PriceArg(DAI_USD_BASE64);

	// Reverse arguments
	let reverseArgs = new ReverseArgs(nearArgs)

	// Chainlink cross-contract call promise
	let promise = ContractPromise.create(
		contract,                             // contract account name
		method,                               // contract method name
		reverseArgs.encode(),                 // serialized contract method arguments encoded as Uint8Array
		10000000,                             // gas attached to the call
		u128.Zero                             // attached deposit to be sent with the call
	);
	
	// Promise callback
	let callbackPromise = promise.then(
		context.contractName,				// callback contract name
		"setPrice"							// callback method
	);

	callbackPromise.returnAsResult();
}

export function setPrice(price: Price): void {
	logging.log(price.price);
}