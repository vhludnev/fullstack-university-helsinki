import axios from 'axios'
import { DiaryEntry, NewDiaryEntry } from './types'

interface ValidationError {
  message: string
  errors: Record<string, string[]>
}

const baseUrl = 'http://localhost:3001/api/diaries'

export const getAllEntries = () => {
  return axios.get<DiaryEntry[]>(baseUrl).then(response => response.data)
}

export const createEntry = async (object: NewDiaryEntry) => {
  try {
    const { data } = await axios.post<DiaryEntry>(baseUrl, object)
    return data
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error) && error.response) {
      return error.response.data
    } else {
      return String(error)
    }
  }
}
