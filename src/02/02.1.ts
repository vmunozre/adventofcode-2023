// https://adventofcode.com/2023/day/2 - part 1
import * as fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/02/input.txt'
const OUTPUT_FILE_PATH = 'src/02/output.txt'

const MAX_COLORS = {
  red: 12,
  green: 13,
  blue: 14
}

interface Game {
  id: number
  isPossible: boolean
  fullLine: string
}

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  let total: number = 0
  for await (const line of file.readLines()) {
      const game = getGameFromLine(line)
      console.log(`game: ${game.id} is ${game.isPossible ? 'possible' : 'impossible'}, line: ${game.fullLine}`)
      if (game.isPossible) {
        total += game.id
      }
  }

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

// Input: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
// Output: Game
function getGameFromLine (line: string): Game {
  const game: Game = {
    id: 0,
    isPossible: true,
    fullLine: line
  }
  const parts = line.split(":")
  game.id = Number(parts.shift()!.replace("Game ", "").trim())

  const games = parts.join("").split(";")
  for(let i = 0; i < games.length; i++) {
    const element = games[i].trim()
    const colors = element.split(",")
    for(let j = 0; j < colors.length; j++) {
      const color = colors[j].trim()
      const colorParts = color.trim().split(" ")
      const quantity = Number(colorParts.shift())
      
      const colorName = colorParts.join("").trim() as string
      if (
        (colorName === "red" && quantity > MAX_COLORS.red) || 
        (colorName === "green" && quantity > MAX_COLORS.green) || 
        (colorName === "blue" && quantity > MAX_COLORS.blue)
      ) {
        game.isPossible = false
        break
      }
    }
    if (!game.isPossible) break
  }

  return game
}

main()