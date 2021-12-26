import { ListGamedId } from './player';

export const toListGamedId = (response: number[]): ListGamedId => {
    return { listGameId: response };
};
