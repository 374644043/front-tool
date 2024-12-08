/*
 * @Author: pangwei pw374644043@gmail.com
 * @Date: 2023-02-01 13:31:32
 * @LastEditors: pangwei pw374644043@gmail.com
 * @LastEditTime: 2023-03-08 10:35:05
 */
export interface Character {
  avatar: string
  name: string
  code: string
  position: number
  star: number
  maxStar: number
  type: string
}

export interface BattleLog {
  id?: string
  attack: Character[]
  defence: Character[]
  createTime?: string
  commit?: string
}

export interface CharacterSaved {
  id: string
  code: string
  star: number
  logId: string
  type: 0 | 1
}

export interface BattleLogSaved {
  id: string
  team: string
  createTime: string
  commit?: string
}

export interface CharacterStatic {
  avatar: string
  name: string
  code: string
  position: number
  maxStar: number
  type: string
}
