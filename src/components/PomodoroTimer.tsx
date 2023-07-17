import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import sfx from '../Assets/sound1.mp3'
import '../App.css'

export const PomodoroTimer: React.FC = () => {
  const initialWorkTime = 50;
  const initialBreakTime = 10;
  const initialCycleCount = 5;
  const [workTime, setWorkTime] = useState<number>(initialWorkTime * 60);
  const [breakTime, setBreakTime] = useState<number>(initialBreakTime * 60);
  const [cycleCount, setCycleCount] = useState<number>(initialCycleCount);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [remainingTime, setRemainingTime] = useState<number>(workTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const audio = new Audio(sfx);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setRemainingTime((prevTime): any => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            audio.play();

            if (isWorking) {
                setIsWorking(false);
                setRemainingTime(breakTime);
            } else {
              if (currentCycle < cycleCount) {
                setCurrentCycle((prevCycle) => prevCycle + 1);
              } else {
                setCurrentCycle(1);
              }
              setIsWorking(true);
              setRemainingTime(workTime);
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
      isRunning,
      isWorking,
      currentCycle,
      cycleCount,
      workTime,
      breakTime,
    ]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsWorking(true);
    setRemainingTime(remainingTime);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setWorkTime(workTime);
    setBreakTime(breakTime);
    setRemainingTime(workTime);
    setCurrentCycle(1);
  };

  const padTime = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  const formatTime = (remainingTime: number) => {
    const minutes = padTime(Math.floor(remainingTime / 60));
    const seconds = padTime(remainingTime % 60);

    return `${minutes}:${seconds}`;
  }

  const handleWorkTimeChange = (e: any) => {
    setWorkTime(e.target.value * 60);
  };

  const handleBreakTimeChange = (e: any) => {
    setBreakTime(e.target.value * 60);
  };

  const handleCycleCountChange = (e: any) => {
    setCycleCount(e.target.value);
  };

  return (
    <div className="pomodoro-container">
      <h1>Pomodoro Timer</h1>

      <p>click to START or STOP</p>

      <div>
        <button
          className="timer"
          onClick={isRunning? stopTimer : startTimer}
        >
          <div className="statements">
            <p>Cycle:　{currentCycle}</p>
            <p>　{isWorking ? 'Work Time' : 'Break Time'}</p>
          </div>
          <p>
            {`${formatTime(remainingTime)}`}
          </p>
        </button>
      </div>

      <div className="user-setting-wrapper">
        <div className="setting-container">
          <label htmlFor="work">Work Time</label>
          <input
            id="work"
            className="setting"
            type="number"
            onChange={(e) => (handleWorkTimeChange(e))}
            value={workTime/60}
            disabled={isRunning ? true : false}
          />
        </div>
        <div className="setting-container">
          <label htmlFor="work">Break Time</label>
          <input
            className="setting  break"
            type="number"
            onChange={(e) => (handleBreakTimeChange(e))}
            value={breakTime/60}
            disabled={isRunning ? true : false}
          />
        </div>

        <div className="setting-container">
          <label htmlFor="work">Repeat</label>
          <input
            className="setting repeat"
            type="number"
            onChange={(e) => (handleCycleCountChange(e))}
            value={cycleCount}
            disabled={isRunning ? true : false}
          />
        </div>

        <button
          className="button reset"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

