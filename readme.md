GeckoChecker is a command-line interface (CLI) application developed in JavaScript, designed to run on Linux environments. It allows querying cryptocurrency prices using CoinGecko’s public API. You can configure different cryptocurrency IDs, fiat currencies, and various output formats, making it useful for both casual users and scripting automation.

# Requirements:

* Node.js must be installed.
* Access to the terminal in a Linux-based system.

## Installation:

To install GeckoChecker locally and use it as a global command, clone the repository and run the following commands from the project root:

```bash
npm install
npm link
```

This will enable the geckochecker command globally on your system.

### Default configuration:

GeckoChecker uses a file named default-values.txt, which contains a JSON object with default values that are used if no options are passed via the command line.

Example content of the file:
```json
{ 
    "currencies": [
        "usd"
    ], 
     "ids": [ 
        "bitcoin",
        "ethereum" 
    ], 
    "output": "list"
}
```
You can edit this file to customize the default settings. If you don't know the id of a cryptocurrency, you can find it on Coingecko.

## Usage:

The main command is:
```bash
geckochecker [options]
```

Available options:

* -i: List of cryptocurrency IDs to query (e.g., bitcoin, ethereum, solana).
* -c: List of fiat currencies to get the prices in (e.g., usd, eur, ars).
* -o: Output format. The available formats are:
	* json: Returns data in JSON format.
	* csv: Returns data as comma-separated values (CSV).
	* list: Displays results in a readable table format for the terminal.
	* plain: Displays results in plain text, one line per value.

If no options are specified, Geckochecker will use the values defined in the default-values.txt file.

Examples:

* Run using default values:
```bash
geckochecker
```

* Query the price of bitcoin and solana in EUR and USD, with output as a table:
```bash
geckochecker -i bitcoin solana -c eur usd -o table
```

* Get ethereum’s price in euros in CSV format:
```bash
geckochecker -i ethereum -c eur -o csv
```

* Get polkadot's price in euros in JSON format:
```bash
geckochecker -i polkadot -c eur -o json
```


#### Credits:
This tool uses the CoinGecko public API: https://www.coingecko.com


License: MIT
