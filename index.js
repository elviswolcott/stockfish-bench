const Stockfish = require("stockfish-native").default;
const matches = require("./matches.json");
const { Chess } = require("chess.js");
const { performance } = require("perf_hooks");
const fs = require("fs");

// for determining move count
const game = new Chess();

const sum = (a, b) => a + b;

const playGame = async (engine, moves, valid, useMultiPV) => {
  const played = [];
  for (const index in moves) {
    const move = moves[index];
    played.push(move);
    const options = valid[index];
    await engine.position({ moves: played });
    // intentionally skips the opening position
    if (useMultiPV) {
      await engine.setoptions({ MultiPV: options.count });
      await engine.search({ depth: 18 });
    } else {
      // use searchmoves to explore different lines
      for (const option of options.moves) {
        await engine.search({ depth: 18, searchmoves: [option] });
      }
    }
  }

  // rest of moves
}

const bench = async (useMultiPV) => {
  let scores = [];
  const engine = new Stockfish(process.argv[2], {
    UCI_AnalyseMode: true
  });
  for (const moves of matches) {
    // reset the engine
    await engine.newgame();
    game.reset();
    // calculate number of moves available
    const valid = moves.map(move => {
      const moves = game.moves();
      game.move(move, { sloppy: true });
      return {
        count: moves.length,
        moves: moves,
      };
    });
    const total = valid.map(a => a.count).reduce(sum);
    // run 3 tests
    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      await playGame(engine, moves, valid, useMultiPV);
      const end = performance.now();
      scores.push((end - start) / total);
    }
  }
  engine.kill();
  return scores;
}

bench();

const run = async () => {
  const multiPV = await bench(true);
  const single = await bench(false);
  fs.writeFileSync("./results.json", JSON.stringify({
    details: {
      multiPV,
      single,
    },
    average: {
      multiPV: multiPV.reduce(sum) / multiPV.length,
      single: single.reduce(sum) / single.length,
    }
  }))
}

run();


