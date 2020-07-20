# Some Stockfish Benchmarks

For a project I'm working on I need to evaluate every possible move for each position that occurs during the game.

This can be done my setting the `MultiPV` equal to the number of valid moves, or by evaluating moves individually.

If I were to guess, the most important factor is how much the order impacts cache hits.

Tests were performed on a $5 droplet from DO on Ubuntu 20 (the server the project's going to run on).

All tests use `UCI_AnalyseMode`.

`matches.json` contains 100 matches between 1000 and 1600 Elo in Long Algebraic Notation taken from the Lichess DB using [lichess-db-json](https://github.com/elviswolcott/lichess-db-json).

# Usage

```bash
node index.js ./path/to/engine
```

Run the benchmark and save results to data.json.

# Results

