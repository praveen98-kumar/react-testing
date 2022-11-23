import {
  createContext,
  ReactNode,
  Dispatch,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { Board, BoardActions, BoardActionType } from "../types";

const initialBoardState: Board[] = [];

const boardReducer = (state: Board[], action: BoardActions) => {
  switch (action.type) {
    case BoardActionType.CREATE_BOARD:
      return [...state, action.payload];
    case BoardActionType.DELETE_BOARD:
      return [...state].filter(({ id }) => id !== action.payload);
    default:
      return state;
  }
};

const BoardContext = createContext<{
  boards: Board[];
  dispatch: Dispatch<BoardActions>;
}>({
  boards: initialBoardState,
  dispatch: () => null,
});

const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [boards, dispatch] = useReducer(
    boardReducer,
    [] as Board[],
    (initials) =>
      JSON.parse(localStorage.getItem("boards") as string) || initials
  );
  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);
  return (
    <BoardContext.Provider value={{ boards, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);

export default BoardProvider;
