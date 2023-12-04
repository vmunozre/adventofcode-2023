// https://adventofcode.com/2023/day/4 - part 1
import fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/04/input.txt'
const OUTPUT_FILE_PATH = 'src/04/output.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  let total = 0
  for await (const line of file.readLines()) {
      const game = getLinePoints(line)
      console.log(`Game: ${game.alias} - points: ${game.points} - matchs: ${game.matchs}`)
      console.log(`cardMatchs: ${game.cardMatchs}`)
      total += game.points
  }

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

interface Game {
  alias: string
  ownCards: number[]
  winningCards: number[]
  cardMatchs: number[]
  matchs: number
  points: number
}

// input: Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// output: 8
function getLinePoints (line: string): Game {
  const game: Game = {
    alias: 'Card 0',
    ownCards: [],
    winningCards: [],
    cardMatchs: [],
    matchs: 0,
    points: 0
  }
  const parts = line.split(':')
  game.alias = parts.shift() ?? ''

  const cards = parts.shift()?.split('|') ?? []
  const ownCards = cards.shift()?.trim().split(' ') ?? []
  const winningCards = cards.shift()?.trim().split(' ') ?? []
  game.ownCards = ownCards.map((card) => Number(card.trim())).filter(Boolean)
  game.winningCards = winningCards.map((card) => Number(card.trim())).filter(Boolean)

  game.ownCards.forEach((card) => {
    if (game.winningCards.includes(card)) {
      game.cardMatchs.push(card)
      game.matchs++
      if (game.matchs === 1) {
        game.points = 1
      } else {
        game.points = game.points * 2
      }
    }
  })
  return game
}


main()