import {ActionsState} from './game/actions';

export enum MessageType {
  CONNECT = 'connect',
  INIT = 'init',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  MOVE = 'move',
  STATE_UPDATE = 'state_update',
  PLAYER_ACTION = 'player_action',
}

export interface ChatMessage {
  message: string;
}

export interface MoveMessage {
  x: number;
  y: number;
}

export interface PlayerActionMessage extends ActionsState {}

export interface InitGameMessage {
  currentFrame: number;
  initialState: EntityUpdate[];
  playerId: number;
  entityId: number;
}

export interface StateUpdateMessage {
  frame: number;
  updates: EntityUpdate[];
}

export interface EntityUpdate {
  id: number;
  x: number;
  y: number;
  v: {
    x: number;
    y: number;
  };
  a: {
    x: number;
    y: number;
  };
}
