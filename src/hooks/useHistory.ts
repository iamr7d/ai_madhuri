import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
}

interface HistoryState {
  past: GraphState[];
  present: GraphState;
  future: GraphState[];
}

const MAX_HISTORY_LENGTH = 50;

export const useHistory = (initialState: GraphState) => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const setState = useCallback((newPresent: GraphState, actionType?: string) => {
    setHistory(prev => {
      // Don't record if the state hasn't actually changed
      if (
        JSON.stringify(prev.present.nodes) === JSON.stringify(newPresent.nodes) &&
        JSON.stringify(prev.present.edges) === JSON.stringify(newPresent.edges)
      ) {
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
  }, []);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const reset = useCallback((newPresent: GraphState) => {
    setHistory({
      past: [],
      present: newPresent,
      future: []
    });
  }, []);

  const clear = useCallback(() => {
    setHistory({
      past: [],
      present: initialState,
      future: []
    });
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
