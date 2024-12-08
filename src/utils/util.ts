/*
 * @Author: pangwei pw374644043@gmail.com
 * @Date: 2023-02-08 15:43:48
 * @LastEditors: pangwei pw374644043@gmail.com
 * @LastEditTime: 2023-02-10 09:49:40
 */
import dayjs from 'dayjs'

export const createRandomId = (randomLength = 5) => Number(Math.random().toString().substring(3, 3 + randomLength) + Date.now()).toString(36)

export const getDateFormat = (date: string | Date, pattern = 'YYYY-MM-DD HH:mm:ss') => dayjs(date).format(pattern)