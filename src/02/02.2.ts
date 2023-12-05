// https://adventofcode.com/2023/day/2 - part 1
import * as fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/02/input.txt'
const OUTPUT_FILE_PATH = 'src/02/output2.txt'

interface Game {
  id: number
  colors: {
    red: number
    green: number
    blue: number
  }
  fullLine: string
}

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  let total: number = 0
  for await (const line of file.readLines()) {
      const game = getGameFromLine(line)
      console.log(`game: ${game.id} has ${game.colors.red} red, ${game.colors.green} green, ${game.colors.blue} blue, line: ${game.fullLine}`)
      const lineMultiplier = game.colors.red * game.colors.green * game.colors.blue
      total += lineMultiplier
  }

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

// Input: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
// Output: Game
function getGameFromLine (line: string): Game {
  const game: Game = {
    id: 0,
    colors: {
      red: 0,
      green: 0,
      blue: 0
    },
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
      if (colorName === "red" && game.colors.red <= quantity) {
        game.colors.red = quantity
      }
      if (colorName === "green" && game.colors.green <= quantity) {
        game.colors.green = quantity
      }
      if (colorName === "blue" && game.colors.blue <= quantity) {
        game.colors.blue = quantity
      }
    }
  }

  return game
}

main()