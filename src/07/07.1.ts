// https://adventofcode.com/2023/day/5 - part 1
import * as fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/07/input.txt'
const OUTPUT_FILE_PATH = 'src/07/output.txt'

const CARDS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const RANKS = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIRS: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1
}
const RANKS_TYPES = [
  {
    id: 'FIVE_OF_A_KIND',
    value: RANKS['FIVE_OF_A_KIND']
  },
  {
    id: 'FOUR_OF_A_KIND',
    value: RANKS['FOUR_OF_A_KIND']
  },
  {
    id: 'FULL_HOUSE',
    value: RANKS['FULL_HOUSE']
  },
  {
    id: 'THREE_OF_A_KIND',
    value: RANKS['THREE_OF_A_KIND']
  },
  {
    id: 'TWO_PAIRS',
    value: RANKS['TWO_PAIRS']
  },
  {
    id: 'ONE_PAIR',
    value: RANKS['ONE_PAIR']
  },
  {
    id: 'HIGH_CARD',
    value: RANKS['HIGH_CARD']
  }
]
async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
 
  let games: Game[] = []
  for await (const line of file.readLines()) {
    const game = getBaseGame(line)
    games.push(game)
  }

  games = games.sort((a, b) => {
    return b.rank - a.rank
  })

  games = games.sort((a, b) => {
    const compare = compareCards(a, b)
    if (compare === a.cards) {
      return -1
    }
    return 1
  })
  const minRankType = games[games.length - 1].rankType
  games = recalculateRankByMinRankType(games, minRankType)

  const total = games.reduce((acc, game) => {
    return acc + (game.bet * game.rank)
  }, 0)

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

// Compare cards and get the highest
function compareCards (card1: Game, card2: Game): string {
  if (card1.rank !== card2.rank) {
    return card1.cards
  }
  const charsCard1 = card1.cards.split('')
  const charsCard2 = card2.cards.split('')
  let winner = null
  while (winner === null && charsCard1.length) {
    const char1 = charsCard1.shift()
    const char2 = charsCard2.shift()
    const indexChar1 = CARDS.findIndex(c => c === char1)
    const indexChar2 = CARDS.findIndex(c => c === char2)
    if (indexChar1 > indexChar2) {
      winner = card1.cards
    } else if (indexChar1 < indexChar2) {
      winner = card2.cards
    }
  }
  return winner
}

function recalculateRankByMinRankType (games: Game[], minRankType: string): Game[] {
  return games.map((game, index) => {
    return {
      ...game,
      rank: index + 1
    }
  })
}

function getBaseGame (line: string): Game {
  const [cards, bet] = line.split(' ')
  const { rank, rankType } = calculateRank(cards)
  return {
    cards,
    rank,
    rankType,
    position: 0,
    bet: Number(bet)
  }
}

function calculateRank (card: string): {
  rank: number
  rankType: string
} {
  const chars = card.split('')
  const report = []
  chars.forEach((char) => {
    if (!report.some(m => m.char === char)) {
      report.push({
        char,
        repeats: chars.filter(c => c === char).length
      })
    }
  })

  if (report.some(m => m.repeats === 5)) {
    return {
      rank: RANKS.FIVE_OF_A_KIND,
      rankType: RANKS_TYPES[0].id
    }
  }
  if (report.some(m => m.repeats === 4)) {
    return {
      rank: RANKS.FOUR_OF_A_KIND,
      rankType: RANKS_TYPES[1].id
    }
  }
  if (report.some(m => m.repeats === 3) && report.some(m => m.repeats === 2)) {
    return {
      rank: RANKS.FULL_HOUSE,
      rankType: RANKS_TYPES[2].id
    }
  }
  if (report.some(m => m.repeats === 3)) {
    return {
      rank: RANKS.THREE_OF_A_KIND,
      rankType: RANKS_TYPES[3].id
    }
  }
  if (report.filter(m => m.repeats === 2).length === 2) {
    return {
      rank: RANKS.TWO_PAIRS,
      rankType: RANKS_TYPES[4].id
    }
  }
  if (report.some(m => m.repeats === 2)) {
    return {
      rank: RANKS.ONE_PAIR,
      rankType: RANKS_TYPES[5].id
    }
  }
  return {
    rank: RANKS.HIGH_CARD,
    rankType: RANKS_TYPES[6].id
  }
}

interface Game {
  cards: string
  rank: number
  rankType: string
  position: number
  bet: number
}

main()