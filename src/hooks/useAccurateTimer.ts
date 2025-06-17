import { useRef, useCallback, useEffect } from 'react';
import { setTimeout, clearTimeout, setInterval, clearInterval } from 'worker-timers';

interface AccurateTimerOptions {
  interval?: number; // Update frequency in ms (default: 50)
  onTick: (elapsed: number, drift: number) => void;
  onComplete?: () => void;
}

interface AccurateTimerControls {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isRunning: boolean;
  isPaused: boolean;
  elapsed: number;
  drift: number;
}

export function useAccurateTimer(options: AccurateTimerOptions): AccurateTimerControls {
  const { interval = 50, onTick, onComplete } = options;
  
  const stateRef = useRef({
    isRunning: false,
    isPaused: false,
    startTime: 0,
    pausedTime: 0,
    totalPausedTime: 0,
    rafId: null as number | null,
    timeoutId: null as number | null,
    lastTickTime: 0,
    expectedTime: 0,
    drift: 0
  });

  const tickRef = useRef<() => void>();

  // High precision tick function
  const tick = useCallback(() => {
    const state = stateRef.current;
    if (!state.isRunning || state.isPaused) return;

    const now = performance.now();
    const elapsed = now - state.startTime - state.totalPausedTime;
    
    // Check if it's time for the next tick
    if (elapsed >= state.expectedTime) {
      // Calculate drift (how far off we are from expected timing)
      const drift = elapsed - state.expectedTime;
      state.drift = drift;
      
      // Call the callback with accurate elapsed time and drift info
      onTick(elapsed, drift);
      
      // Schedule next expected tick, accounting for drift
      state.expectedTime += interval;
      state.lastTickTime = elapsed;
    }

    // Use requestAnimationFrame for smooth updates
    state.rafId = requestAnimationFrame(tick);
  }, [interval, onTick]);

  // Store tick function in ref to avoid stale closures
  tickRef.current = tick;

  // Fallback timeout for background tabs (when RAF throttles)
  const scheduleTimeoutFallback = useCallback(() => {
    const state = stateRef.current;
    if (!state.isRunning || state.isPaused) return;

    state.timeoutId = setTimeout(() => {
      if (state.isRunning && !state.isPaused) {
        tickRef.current?.();
        scheduleTimeoutFallback();
      }
    }, interval);
  }, [interval]);

  const start = useCallback(() => {
    const state = stateRef.current;
    if (state.isRunning) return;

    state.isRunning = true;
    state.isPaused = false;
    state.startTime = performance.now();
    state.totalPausedTime = 0;
    state.expectedTime = 0;
    state.lastTickTime = 0;
    state.drift = 0;

    // Start both RAF and timeout fallback
    tick();
    scheduleTimeoutFallback();
  }, [tick, scheduleTimeoutFallback]);

  const pause = useCallback(() => {
    const state = stateRef.current;
    if (!state.isRunning || state.isPaused) return;

    state.isPaused = true;
    state.pausedTime = performance.now();

    // Clear both timers
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
  }, []);

  const resume = useCallback(() => {
    const state = stateRef.current;
    if (!state.isRunning || !state.isPaused) return;

    // Add the pause duration to total paused time
    const pauseDuration = performance.now() - state.pausedTime;
    state.totalPausedTime += pauseDuration;
    state.isPaused = false;

    // Restart both timers
    tick();
    scheduleTimeoutFallback();
  }, [tick, scheduleTimeoutFallback]);

  const stop = useCallback(() => {
    const state = stateRef.current;
    
    state.isRunning = false;
    state.isPaused = false;

    // Clear all timers
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }

    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const state = stateRef.current;
      if (state.rafId) cancelAnimationFrame(state.rafId);
      if (state.timeoutId) clearTimeout(state.timeoutId);
    };
  }, []);

  // Get current values
  const getCurrentElapsed = () => {
    const state = stateRef.current;
    if (!state.isRunning) return 0;
    if (state.isPaused) return state.pausedTime - state.startTime - state.totalPausedTime;
    return performance.now() - state.startTime - state.totalPausedTime;
  };

  return {
    start,
    pause,
    resume,
    stop,
    isRunning: stateRef.current.isRunning,
    isPaused: stateRef.current.isPaused,
    elapsed: getCurrentElapsed(),
    drift: stateRef.current.drift
  };
}

// Alternative: Web Worker based timer for maximum accuracy
export function useWorkerTimer(options: AccurateTimerOptions): AccurateTimerControls {
  const workerRef = useRef<Worker | null>(null);
  const stateRef = useRef({
    isRunning: false,
    isPaused: false,
    startTime: 0,
    elapsed: 0
  });

  const { interval = 50, onTick, onComplete } = options;

  useEffect(() => {
    // Create worker with inline code to avoid external file dependency
    const workerCode = `
      let timerId = null;
      let startTime = 0;
      let interval = 50;
      
      self.onmessage = function(e) {
        const { type, data } = e.data;
        
        switch(type) {
          case 'start':
            interval = data.interval;
            startTime = Date.now();
            timerId = setInterval(() => {
              const elapsed = Date.now() - startTime;
              self.postMessage({ type: 'tick', elapsed });
            }, interval);
            break;
            
          case 'stop':
            if (timerId) {
              clearInterval(timerId);
              timerId = null;
            }
            break;
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    workerRef.current.onmessage = (e) => {
      const { type, elapsed } = e.data;
      if (type === 'tick') {
        stateRef.current.elapsed = elapsed;
        onTick(elapsed, 0); // Web workers don't have drift issues
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [interval, onTick]);

  const start = useCallback(() => {
    if (workerRef.current && !stateRef.current.isRunning) {
      stateRef.current.isRunning = true;
      stateRef.current.isPaused = false;
      workerRef.current.postMessage({ type: 'start', data: { interval } });
    }
  }, [interval]);

  const stop = useCallback(() => {
    if (workerRef.current && stateRef.current.isRunning) {
      stateRef.current.isRunning = false;
      workerRef.current.postMessage({ type: 'stop' });
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  const pause = useCallback(() => {
    if (stateRef.current.isRunning && !stateRef.current.isPaused) {
      stateRef.current.isPaused = true;
      workerRef.current?.postMessage({ type: 'stop' });
    }
  }, []);

  const resume = useCallback(() => {
    if (stateRef.current.isRunning && stateRef.current.isPaused) {
      stateRef.current.isPaused = false;
      workerRef.current?.postMessage({ type: 'start', data: { interval } });
    }
  }, [interval]);

  return {
    start,
    pause,
    resume,
    stop,
    isRunning: stateRef.current.isRunning,
    isPaused: stateRef.current.isPaused,
    elapsed: stateRef.current.elapsed,
    drift: 0
  };
} 