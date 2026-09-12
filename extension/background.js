// TOMATO CLOCK - Background Service Worker
// Manages timer persistence, notifications, and badge updates

// Open side panel when toolbar icon is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

let timerState = {
  isRunning: false,
  currentMode: 'work',
  timeLeft: 25 * 60,
  endTime: null
};

// Load saved state on startup
chrome.storage.local.get(['timerState'], (result) => {
  if (result.timerState) {
    timerState = result.timerState;
    if (timerState.isRunning && timerState.endTime) {
      const remaining = Math.max(0, Math.ceil((timerState.endTime - Date.now()) / 1000));
      if (remaining > 0) {
        timerState.timeLeft = remaining;
        startAlarm(remaining);
      } else {
        handleTimerComplete();
      }
    }
  }
  updateBadge();
});

function saveState() {
  chrome.storage.local.set({ timerState });
}

function updateBadge() {
  if (!timerState.isRunning) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }
  const minutes = Math.ceil(timerState.timeLeft / 60);
  chrome.action.setBadgeText({ text: String(minutes) });
  chrome.action.setBadgeBackgroundColor({
    color: timerState.currentMode === 'work' ? '#FF2D2D' : '#FFD700'
  });
}

function startAlarm(seconds) {
  chrome.alarms.clear('pomodoroTick', () => {
    chrome.alarms.create('pomodoroTick', { delayInMinutes: seconds / 60 });
  });
}

function handleTimerComplete() {
  timerState.isRunning = false;
  timerState.endTime = null;
  saveState();
  updateBadge();

  const messages = {
    work: 'Focus session complete! Take a break!',
    shortBreak: 'Short break over! Back to focus!',
    longBreak: 'Long break over! Start a new session!'
  };

  chrome.notifications.create('pomodoro', {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'TOMATO CLOCK',
    message: messages[timerState.currentMode] || 'Timer finished',
    priority: 2
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTick') {
    handleTimerComplete();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getState':
      sendResponse({ timerState });
      break;

    case 'startTimer':
      timerState = {
        ...timerState,
        ...message.state,
        isRunning: true,
        endTime: Date.now() + message.state.timeLeft * 1000
      };
      saveState();
      updateBadge();
      startAlarm(message.state.timeLeft);
      sendResponse({ success: true });
      break;

    case 'pauseTimer':
      timerState = {
        ...timerState,
        ...message.state,
        isRunning: false,
        endTime: null
      };
      saveState();
      updateBadge();
      chrome.alarms.clear('pomodoroTick');
      sendResponse({ success: true });
      break;

    case 'resetTimer':
      timerState = {
        ...timerState,
        ...message.state,
        isRunning: false,
        endTime: null
      };
      saveState();
      updateBadge();
      chrome.alarms.clear('pomodoroTick');
      sendResponse({ success: true });
      break;

    case 'completeTimer':
      timerState = {
        ...timerState,
        ...message.state,
        isRunning: false,
        endTime: null
      };
      saveState();
      updateBadge();
      chrome.alarms.clear('pomodoroTick');
      handleTimerComplete();
      sendResponse({ success: true });
      break;
  }
  return true;
});
