type Base = {
  id: string | number;
  title: string;
  position: number;
};

export type Board = Base & {
  description?: string;
  columns?: Column[];
};

export type Column = Base & {
  tasks?: Task[];
};

export type Task = Base & {
  status?: string;
  description?: string;
  subTasks?: Subtask[];
};

export type Subtask = Base & {
  done: boolean;
};

export enum BoardActionType {
  CREATE_BOARD = "CREATE_BOARD",
  UPDATE_BOARD = "UPDATE_BOARD",
  DELETE_BOARD = "DELETE_BOARD",
}

export interface CreateBoard {
  type: BoardActionType.CREATE_BOARD;
  payload: Board;
}

export interface DeleteBoard {
  type: BoardActionType.DELETE_BOARD;
  payload: string | number;
}

export type BoardActions = CreateBoard | DeleteBoard;
