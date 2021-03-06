import * as action from "./types";
import { fetchTransactions } from "./transactions";

import axios from "axios";

const ROOT_URL = "/api";

/**
 * Добавляет новую карту пользователю
 *
 */
export const addCard = (currency, type, name) => {
  return async dispatch => {
    try {
      dispatch({
        type: action.CARD_ADD_STARTED
      });

      const data = {
        name,
        currency,
        type
      };

      const response = await axios.post(`${ROOT_URL}/cards`, data);

      if (response.status === 201) {
        dispatch({
          type: action.CARD_ADD_SUCCESS
        });
        dispatch(fetchCards());
      } else
        dispatch({
          type: action.CARD_ADD_FAILED,
          payload: "Что то пошло не так..."
        });
    } catch (err) {
      dispatch({
        type: action.CARD_ADD_FAILED,
        payload: err.response.data.message
          ? err.response.data.message
          : err.response.data
      });
      console.log(
        err.response.data.message
          ? err.response.data.message
          : err.response.data
      );
    }
  };
};

/**
 * Вытаскивает данные по картам пользователя
 *
 */
export const fetchCards = () => {
  return async dispatch => {
    try {
      dispatch({
        type: action.CARDS_FETCH_STARTED
      });

      const response = await axios.get(`${ROOT_URL}/cards`);
      dispatch({
        type: action.CARDS_FETCH_SUCCESS,
        payload: response.data
      });

      if (response.data.length > 0)
        if (response.data[0].number)
          dispatch(changeActiveCard(response.data[0].number));
    } catch (err) {
      console.log(err);
      dispatch({
        type: action.CARDS_FETCH_FAILED,
        payload: err.response.data.message
          ? err.response.data.message
          : err.response.data
      });
      console.log(
        err.response.data.message
          ? err.response.data.message
          : err.response.data
      );
    }
  };
};

/**
 * Вытаскивает данные по карте пользователя
 *
 * @param {Number} number
 */
export const fetchCard = number => {
  return async dispatch => {
    try {
      const response = await axios.get(`${ROOT_URL}/cards/${number}`);

      dispatch({
        type: action.CARD_FETCH_SUCCESS,
        payload: response.data
      });
    } catch (err) {
      dispatch({
        type: action.CARD_FETCH_FAILED,
        payload: err.response.data.message
          ? err.response.data.message
          : err.response.data
      });
      console.log(
        err.response.data.message
          ? err.response.data.message
          : err.response.data
      );
    }
  };
};

export const changeActiveCard = number => (dispatch, getState) => {
  const { activeCardNumber } = getState().cards;

  if (activeCardNumber === number) return;

  dispatch({
    type: action.ACTIVE_CARD_CHANGED,
    payload: number
  });
  dispatch(fetchCard(number));
  dispatch(fetchTransactions(number));
};
