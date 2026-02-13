import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('returns initial state when state is undefined', () => {
    const action = { type: 'DO_NOTHING' }

    const newState = counterReducer(undefined, action)

    expect(newState).toEqual(initialState)
  })

  test('GOOD increments good by one', () => {
    const action = { type: 'GOOD' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)

    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('OK increments ok by one', () => {
    const action = { type: 'OK' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)

    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('BAD increments bad by one', () => {
    const action = { type: 'BAD' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)

    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('RESET returns initial state', () => {
    const action = { type: 'RESET' }
    const state = {
      good: 5,
      ok: 3,
      bad: 2
    }

    deepFreeze(state)
    const newState = counterReducer(state, action)

    expect(newState).toEqual(initialState)
  })
})
