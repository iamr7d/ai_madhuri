import { useState, useCallback, useMemo } from 'react';
import { Node, Edge } from 'reactflow';

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
}

interface HistoryState {
  readonly past: readonly GraphState[];
  readonly present: GraphState;
  readonly future: readonly GraphState[];
}

interface HistoryActions {
  state: GraphState;
  setState: (newPresent: GraphState, actionType?: string) => void;
  undo: () => void;
  redo: () => void;
  reset: (newPresent: GraphState) => void;
  clear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: HistoryState;
}

const MAX_HISTORY_LENGTH = 50;

const areStatesEqual = (state1: GraphState, state2: GraphState): boolean => {
  return (
    JSON.stringify(state1.nodes) === JSON.stringify(state2.nodes) &&
    JSON.stringify(state1.edges) === JSON.stringify(state2.edges)
  );
};

export const useHistory = (initialState: GraphState): HistoryActions => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: []
  });

  const { canUndo, canRedo } = useMemo(() => ({
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0
  }), [history.past.length, history.future.length]);

  const setState = useCallback((newPresent: GraphState, actionType?: string) => {
    try {
      setHistory(prev => {
        // Don't record if the state hasn't actually changed
        if (areStatesEqual(prev.present, newPresent)) {
          return prev;
        }

        // Keep only the last MAX_HISTORY_LENGTH states
        const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_LENGTH);

        return {
          past: newPast,
          present: newPresent,
          future: []
        };
      });
    } catch (error) {
      console.error('Error setting state:', error);
      throw new Error('Failed to update state');
    }
  }, []);

  const undo = useCallback(() => {
    try {
      setHistory(prev => {
        if (!canUndo) return prev;

        const previous = prev.past[prev.past.length - 1];
        const newPast = prev.past.slice(0, prev.past.length - 1);

        return {
          past: newPast,
          present: previous,
          future: [prev.present, ...prev.future]
        };
      });
    } catch (error) {
      console.error('Error during undo:', error);
      throw new Error('Failed to undo');
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    try {
      setHistory(prev => {
        if (!canRedo) return prev;

        const next = prev.future[0];
        const newFuture = prev.future.slice(1);

        return {
          past: [...prev.past, prev.present],
          present: next,
          future: newFuture
        };
      });
    } catch (error) {
      console.error('Error during redo:', error);
      throw new Error('Failed to redo');
    }
  }, [canRedo]);

  const reset = useCallback((newPresent: GraphState) => {
    try {
      setHistory({
        past: [],
        present: newPresent,
        future: []
      });
    } catch (error) {
      console.error('Error during reset:', error);
      throw new Error('Failed to reset');
    }
  }, []);

  const clear = useCallback(() => {
    try {
      setHistory({
        past: [],
        present: initialState,
        future: []
      });
    } catch (error) {
      console.error('Error during clear:', error);
      throw new Error('Failed to clear');
    }
  }, [initialState]);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    reset,
    clear,
    canUndo,
    canRedo,
    history
  };
};

export default useHistory;
