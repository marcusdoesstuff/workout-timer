import { WorkoutBlock, SavedWorkoutBlock, FullWorkout, AppStorage } from '../types/workout';

const STORAGE_KEY = 'workout-timer-data';
const STORAGE_VERSION = '1.0.0';

// Default storage structure
const defaultStorage: AppStorage = {
  savedBlocks: [],
  savedWorkouts: [],
  version: STORAGE_VERSION
};

// Safe JSON parsing with fallback
function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    // Convert date strings back to Date objects
    if (parsed.savedBlocks) {
      parsed.savedBlocks = parsed.savedBlocks.map((block: any) => {
        const migratedBlock = {
          ...block,
          createdAt: new Date(block.createdAt),
          lastModified: new Date(block.lastModified)
        };
        
        // Migration: Add blockType for existing blocks
        if (!migratedBlock.blockType) {
          migratedBlock.blockType = 'tempo';
        }
        
        // Migration: Add tempoFlipped for existing tempo blocks
        if (migratedBlock.blockType === 'tempo' && migratedBlock.tempoFlipped === undefined) {
          migratedBlock.tempoFlipped = false;
        }
        
        return migratedBlock;
      });
    }
    if (parsed.savedWorkouts) {
      parsed.savedWorkouts = parsed.savedWorkouts.map((workout: any) => ({
        ...workout,
        createdAt: new Date(workout.createdAt),
        lastModified: new Date(workout.lastModified),
        workoutBlocks: workout.workoutBlocks?.map((block: any) => {
          // Migration: Add blockType for existing blocks in workouts
          if (!block.blockType) {
            block = { ...block, blockType: 'tempo' };
          }
          // Migration: Add tempoFlipped for existing tempo blocks in workouts
          if (block.blockType === 'tempo' && block.tempoFlipped === undefined) {
            block = { ...block, tempoFlipped: false };
          }
          return block;
        }) || []
      }));
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to parse stored data, using fallback:', error);
    return fallback;
  }
}

// Load data from localStorage
export function loadAppData(): AppStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultStorage;
    }
    
    const data = safeJsonParse(stored, defaultStorage);
    
    // Handle version migrations if needed
    if (data.version !== STORAGE_VERSION) {
      console.log(`Migrating storage from ${data.version} to ${STORAGE_VERSION}`);
      // Add migration logic here if needed in the future
      data.version = STORAGE_VERSION;
      saveAppData(data);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load app data:', error);
    return defaultStorage;
  }
}

// Save data to localStorage
export function saveAppData(data: AppStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save app data:', error);
    // Could implement fallback strategies here (e.g., IndexedDB for large data)
  }
}

// Saved Blocks operations
export function getSavedBlocks(): SavedWorkoutBlock[] {
  return loadAppData().savedBlocks;
}

export function saveWorkoutBlock(block: WorkoutBlock): SavedWorkoutBlock {
  const data = loadAppData();
  const now = new Date();
  
  // Check if block already exists (by id)
  const existingIndex = data.savedBlocks.findIndex(b => b.id === block.id);
  
  const savedBlock: SavedWorkoutBlock = {
    ...block,
    createdAt: existingIndex >= 0 ? data.savedBlocks[existingIndex].createdAt : now,
    lastModified: now
  };
  
  if (existingIndex >= 0) {
    // Update existing block
    data.savedBlocks[existingIndex] = savedBlock;
  } else {
    // Add new block
    data.savedBlocks.push(savedBlock);
  }
  
  saveAppData(data);
  return savedBlock;
}

export function deleteWorkoutBlock(blockId: string): void {
  const data = loadAppData();
  data.savedBlocks = data.savedBlocks.filter(block => block.id !== blockId);
  saveAppData(data);
}

// Full Workouts operations
export function getSavedWorkouts(): FullWorkout[] {
  return loadAppData().savedWorkouts;
}

export function saveFullWorkout(workout: FullWorkout): FullWorkout {
  const data = loadAppData();
  const now = new Date();
  
  // Check if workout already exists (by id)
  const existingIndex = data.savedWorkouts.findIndex(w => w.id === workout.id);
  
  const savedWorkout: FullWorkout = {
    ...workout,
    createdAt: existingIndex >= 0 ? data.savedWorkouts[existingIndex].createdAt : now,
    lastModified: now
  };
  
  if (existingIndex >= 0) {
    // Update existing workout
    data.savedWorkouts[existingIndex] = savedWorkout;
  } else {
    // Add new workout
    data.savedWorkouts.push(savedWorkout);
  }
  
  saveAppData(data);
  return savedWorkout;
}

export function deleteFullWorkout(workoutId: string): void {
  const data = loadAppData();
  data.savedWorkouts = data.savedWorkouts.filter(workout => workout.id !== workoutId);
  saveAppData(data);
}

// Auto-save functionality
let autoSaveTimeout: number | null = null;

export function scheduleAutoSave(callback: () => void, delay: number = 1000): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  autoSaveTimeout = setTimeout(() => {
    callback();
    autoSaveTimeout = null;
  }, delay);
}

// Clear all data (useful for testing/reset)
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Export storage stats for debugging
export function getStorageStats(): { blocks: number; workouts: number; sizeKB: number } {
  const data = loadAppData();
  const stored = localStorage.getItem(STORAGE_KEY);
  const sizeBytes = stored ? new Blob([stored]).size : 0;
  
  return {
    blocks: data.savedBlocks.length,
    workouts: data.savedWorkouts.length,
    sizeKB: Math.round(sizeBytes / 1024 * 100) / 100
  };
} 