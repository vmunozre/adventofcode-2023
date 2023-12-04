// https://adventofcode.com/2023/day/4#part2 - part 2
import fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/04/input.txt'
const OUTPUT_FILE_PATH = 'src/04/output2.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  const cards: Card[] = []

  for await (const line of file.readLines()) {
      const card = getCard(line)
      card.matchs = getCardMatchs(card)
      cards.push(card)
  }

  const finalCards: Card[] = [...cards]

  for (let i = 1; i <= cards.length; i++) {
    const card = cards[i-1]
    const cardsToCheck = finalCards.filter((c) => c.index === card.index)
    
    console.log(`card: ${card.index} - matchs: ${card.matchs} - cardsToCheck: ${cardsToCheck.length}`)
    cardsToCheck.forEach((element) => {
      if (element.matchs > 0) {
        const arrayToPush = cards.slice(i, i + element.matchs)
        finalCards.push(...arrayToPush)
      }
    })
  }
  const total = finalCards.length
  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

interface Card {
  index: number
  ownCards: number[]
  winningCards: number[]
  matchs: number
}

function getCard (line: string): Card {
  const card: Card = {
    index: 0,
    ownCards: [],
    winningCards: [],
    matchs: 0
  }
  const parts = line.split(':')
  const indexParts = parts.shift()?.trim().split(' ') ?? []
  card.index = Number(indexParts[indexParts?.length-1])
  const cards = parts.shift()?.split('|') ?? []
  const ownCards = cards.shift()?.trim().split(' ') ?? []
  const winningCards = cards.shift()?.trim().split(' ') ?? []
  card.ownCards = ownCards.map((card) => Number(card.trim())).filter(Boolean)
  card.winningCards = winningCards.map((card) => Number(card.trim())).filter(Boolean)
  return card
}

// input: Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// output: 8
function getCardMatchs (card: Card): number {
  let matchs = 0
  card.ownCards.forEach((element) => {
    if (card.winningCards.includes(element)) {
      matchs++
    }
  })
  return matchs
}


main()