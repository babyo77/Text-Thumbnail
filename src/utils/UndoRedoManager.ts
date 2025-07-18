interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  opacity: number;
  font: string;
  color: string;
}

interface HistoryState {
  textElements: TextElement[];
  selectedTextId: string;
}

class UndoRedoManager {
  private undoStack: HistoryState[] = [];
  private redoStack: HistoryState[] = [];
  private currentState: HistoryState;
  private isSliding: boolean = false;

  constructor(initialState: HistoryState) {
    this.currentState = initialState;
  }

  // Push a new state onto the undo stack
  pushState(state: HistoryState): void {
    if (this.isSliding) return;
    this.undoStack.push({ ...this.currentState });
    this.redoStack = []; // Clear redo stack on new action
    this.currentState = { ...state };
  }

  // Get the current state
  getCurrentState(): HistoryState {
    return { ...this.currentState };
  }

  // Undo the last action
  undo(): HistoryState | null {
    if (this.undoStack.length === 0) return null;

    // Push current state to redo stack
    this.redoStack.push({ ...this.currentState });

    // Pop the last state from undo stack
    const previousState = this.undoStack.pop()!;
    this.currentState = { ...previousState };

    return { ...previousState };
  }

  // Redo the last undone action
  redo(): HistoryState | null {
    if (this.redoStack.length === 0) return null;

    // Push current state to undo stack
    this.undoStack.push({ ...this.currentState });

    // Pop the last state from redo stack
    const nextState = this.redoStack.pop()!;
    this.currentState = { ...nextState };

    return { ...nextState };
  }

  // Check if undo is available
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  // Check if redo is available
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // Start sliding operation (prevents history from being saved during continuous updates)
  startSliding(): void {
    this.isSliding = true;
  }

  // End sliding operation and save final state
  endSliding(state: HistoryState): void {
    this.isSliding = false;
    this.pushState(state);
  }

  // Update current state without affecting history
  updateCurrentState(state: HistoryState): void {
    this.currentState = { ...state };
  }

  // Clear all history
  clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  // Get the entire history state (useful for debugging)
  getHistoryState() {
    return {
      undoStack: [...this.undoStack],
      redoStack: [...this.redoStack],
      currentState: { ...this.currentState },
      isSliding: this.isSliding
    };
  }
}

export default UndoRedoManager;
export type { TextElement, HistoryState };
