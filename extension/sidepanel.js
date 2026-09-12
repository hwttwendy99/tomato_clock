// TOMATO CLOCK - Side Panel Logic
// Pomodoro timer with i18n, task management, Chrome extension integration
// All event listeners use addEventListener (no inline onclick for CSP compliance)

class PixelPomodoro {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentMode = 'work';
    this.timeLeft = 25 * 60;
    this.timerId = null;
    this.todayStats = { date: '', count: 0, totalMinutes: 0 };

    this.config = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStart: false,
      sound: true
    };

    this.completedWorkCount = 0;
    this.autoStartTimeout = null;
    this.toastTimeout = null;
    this.tasks = [];
    this.currentTaskId = null;
    this.taskPanelOpen = false;
    this.quickTaskCycle = 0;

    this.setupKeyboardShortcuts();
    this._syncWithBackground();
    this.loadData(() => {
        this.renderTasks();
        this.updateCurrentTaskDisplay();
        this.updateModeLabel();
        this.updateStats();
        this.updateDisplay();
      });
  }

  // ═══ i18n ═══

  // ═══ Task Panel ═══

  toggleTaskPanel() {
    this.taskPanelOpen = !this.taskPanelOpen;
    const panel = document.getElementById('taskPanel');
    const overlay = document.getElementById('taskPanelOverlay');
    if (this.taskPanelOpen) {
      panel.classList.add('open');
      overlay.classList.add('active');
      this.renderTasks();
    } else {
      panel.classList.remove('open');
      overlay.classList.remove('active');
    }
  }

  // ═══ Timer ═══

  _syncWithBackground() {
    if (typeof chrome === 'undefined' || !chrome.runtime) return;
    chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
      if (response && response.timerState && response.timerState.isRunning) {
        this.isRunning = response.timerState.isRunning;
        this.currentMode = response.timerState.currentMode;
        this.timeLeft = response.timerState.timeLeft;
        this.isPaused = false;
        this.updateDisplay();
        this.updateBodyMode();
        this.updateModeLabel();
        this.updatePageTitle();
        this.updateCurrentTaskDisplay();
        this._updateTimerRunningClass(true);
        const btn = document.getElementById('startPauseBtn');
        if (btn) btn.textContent = 'PAUSE';
      }
    });
  }

  _notifyBackground(action) {
    if (typeof chrome === 'undefined' || !chrome.runtime) return;
    chrome.runtime.sendMessage({
      action,
      state: { currentMode: this.currentMode, timeLeft: this.timeLeft }
    });
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
      return;
    }
    // Quick create task if none exists
    if (!this.getCurrentTask()) {
      this.quickCreateTask();
    }
    this.startTimer();
  }

  startTimer() {
    this.isRunning = true;
    this.isPaused = false;
    clearInterval(this.timerId);
    clearTimeout(this.autoStartTimeout);
    this._notifyBackground('startTimer');
    this.updateCurrentTaskDisplay();

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      this.updatePageTitle();
      if (this.timeLeft <= 0) this.completeTimer();
    }, 1000);

    this._updateTimerRunningClass(true);
    const btn = document.getElementById('startPauseBtn');
    if (btn) btn.textContent = 'PAUSE';
    this.updatePageTitle();
  }

  pauseTimer() {
    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.timerId);
    clearTimeout(this.autoStartTimeout);
    this._notifyBackground('pauseTimer');

    this._updateTimerRunningClass(false);
    const btn = document.getElementById('startPauseBtn');
    if (btn) btn.textContent = 'START';
    document.title = '⏸️ PAUSED';
  }

  resetTimer() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.timerId);
    clearTimeout(this.autoStartTimeout);
    this._notifyBackground('resetTimer');

    this.timeLeft = this.getCurrentDuration() * 60;
    this.updateDisplay();
    this.updateModeLabel();
    this._updateTimerRunningClass(false);
    const btn = document.getElementById('startPauseBtn');
    if (btn) btn.textContent = 'START';
    document.title = '🍅 TOMATO CLOCK';
  }

  completeTimer({ skipped = false } = {}) {
    const finishedMode = this.currentMode;
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.timerId);
    clearTimeout(this.autoStartTimeout);
    this._notifyBackground('completeTimer');

    this._updateTimerRunningClass(false);
    this.playAlert();
    this.showNotification();
    this.showVisualFeedback();

    if (finishedMode === 'work' && !skipped) {
      this.completedWorkCount += 1;
      this.todayStats.count += 1;
      this.todayStats.totalMinutes += this.config.workDuration;
      this.completeCurrentTask();
    }

    this.switchMode();

    if (this.config.autoStart) {
      this.autoStartTimeout = setTimeout(() => {
        if (!this.isRunning) this.startTimer();
      }, 3000);
    }

    this.saveData();
  }

  switchMode() {
    if (this.currentMode === 'work') {
      const interval = this.config.longBreakInterval || 4;
      this.currentMode = (this.completedWorkCount > 0 && this.completedWorkCount % interval === 0)
        ? 'longBreak' : 'shortBreak';
    } else {
      this.currentMode = 'work';
    }
    this.timeLeft = this.getCurrentDuration() * 60;
    this.updateDisplay();
    this.updateBodyMode();
    this.updateModeLabel();
    this.updatePageTitle();
    const btn = document.getElementById('startPauseBtn');
    if (btn) btn.textContent = 'START';
    this.updateStats();
  }

  getCurrentDuration() {
    switch (this.currentMode) {
      case 'work': return this.config.workDuration;
      case 'shortBreak': return this.config.shortBreakDuration;
      case 'longBreak': return this.config.longBreakDuration;
      default: return this.config.workDuration;
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const display = document.getElementById('timerDisplay');
    if (display) {
      display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }

  _updateTimerRunningClass(running) {
    const timer = document.getElementById('timerDisplay');
    if (timer) {
      if (running) timer.classList.add('is-running');
      else timer.classList.remove('is-running');
    }
    const quickBtn = document.getElementById('quickTaskBtn');
    if (quickBtn) {
      quickBtn.style.display = running ? 'none' : '';
    }
  }

  updateModeLabel() {
    const modeNames = { work: 'FOCUS', shortBreak: 'SHORT BREAK', longBreak: 'LONG BREAK' };
    const label = modeNames[this.currentMode] || this.currentMode.toUpperCase();
    const el = document.getElementById('modeLabel');
    if (el) el.textContent = label;
  }

  updateBodyMode() {
    document.body.className = 'side-panel ' + this.currentMode + '-mode';
  }

  updatePageTitle() {
    if (!this.isRunning) {
      document.title = '🍅 TOMATO CLOCK';
      return;
    }
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const titles = {
      work: '🍅 FOCUS',
      shortBreak: '☕ BREAK',
      longBreak: '🌴 LONG BREAK'
    };
    document.title = `${titles[this.currentMode] || ''} ${timeString}`;
  }

  updateStats() {
    const el = document.getElementById('todayStats');
    if (!el) return;
    el.textContent = `Today: ${this.todayStats.count} 🍅 · ${this.todayStats.totalMinutes} min`;
  }

  // ═══ Notifications & Audio ═══

  playAlert() {
    if (!this.config.sound) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) { /* audio not available */ }
  }

  showNotification() {
    const messages = {
      work: 'Focus session complete! Take a break!',
      shortBreak: 'Short break over! Back to focus!',
      longBreak: 'Long break over! Start a new session!'
    };
    if (typeof chrome !== 'undefined' && chrome.notifications) {
      chrome.notifications.create('pomodoro', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'TOMATO CLOCK',
        message: messages[this.currentMode],
        priority: 2
      });
    } else if (Notification.permission === 'granted') {
      new Notification('TOMATO CLOCK', {
        body: messages[this.currentMode],
        icon: '🍅',
        tag: 'pomodoro'
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  showVisualFeedback() {
    const timer = document.getElementById('timerDisplay');
    if (timer) {
      timer.classList.add('timer-complete');
      setTimeout(() => timer.classList.remove('timer-complete'), 1500);
    }
  }

  // ═══ Keyboard ═══

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          this.toggleTimer();
          break;
        case 'r':
          if (e.ctrlKey) {
            e.preventDefault();
            this.resetTimer();
          }
          break;
      }
    });
  }

  // ═══ Task Management ═══

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getCurrentTask() {
    return this.tasks.find(t => t.id === this.currentTaskId && !t.completed) || null;
  }

  getNextIncompleteTask() {
    return this.tasks.find(t => !t.completed) || null;
  }

  setActiveTask(id) {
    this.tasks.forEach(t => { t.isCurrent = t.id === id && !t.completed; });
    const active = this.tasks.find(t => t.isCurrent);
    this.currentTaskId = active ? active.id : null;
  }

  isSessionActive() {
    return this.isRunning || this.isPaused;
  }

  quickCreateTask() {
    const cycle = (this.quickTaskCycle % 5) + 1;
    const name = '🍅'.repeat(cycle);
    this.quickTaskCycle++;
    this.saveData();
    this.addTask(name);
  }

  addTask(text) {
    const input = document.getElementById('taskInput');
    const taskText = text || (input ? input.value.trim() : '');
    if (!taskText) return;

    const activate = !this.isSessionActive();
    const task = { id: Date.now(), text: taskText, completed: false, isCurrent: activate };

    if (activate) {
      this.tasks.forEach(t => { t.isCurrent = false; });
      this.currentTaskId = task.id;
    }

    this.tasks.push(task);
    this.saveData();
    this.renderTasks();
    this.updateCurrentTaskDisplay();
    if (input) input.value = '';
  }

  removeTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.currentTaskId === id) {
      const next = this.getNextIncompleteTask();
      this.setActiveTask(next ? next.id : null);
    }
    this.saveData();
    this.renderTasks();
    this.updateCurrentTaskDisplay();
  }

  completeTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task || task.completed) return;
    task.completed = true;
    task.isCurrent = false;
    if (this.currentTaskId === id) {
      const next = this.getNextIncompleteTask();
      this.setActiveTask(next ? next.id : null);
    }
    this.saveData();
    this.renderTasks();
    this.updateCurrentTaskDisplay();
  }

  selectTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task || task.completed || task.id === this.currentTaskId) return;

    if (this.isSessionActive()) {
      this.showToast('A task is in progress.');
      return;
    }

    this.setActiveTask(id);
    this.saveData();
    this.renderTasks();
    this.updateCurrentTaskDisplay();
  }

  completeCurrentTask() {
    const current = this.getCurrentTask();
    if (!current) return;
    current.completed = true;
    current.isCurrent = false;
    const next = this.getNextIncompleteTask();
    this.setActiveTask(next ? next.id : null);
    this.renderTasks();
    this.updateCurrentTaskDisplay();
  }

  editTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task || task.completed) return;
    const newText = prompt('Edit task', task.text);
    if (newText !== null && newText.trim() !== '') {
      task.text = newText.trim();
      this.saveData();
      this.renderTasks();
      this.updateCurrentTaskDisplay();
    }
  }

  clearCompletedTasks() {
    this.tasks = this.tasks.filter(t => !t.completed);
    this.saveData();
    this.renderTasks();
  }

  updateCurrentTaskDisplay() {
    const display = document.getElementById('currentTaskDisplay');
    if (!display) return;
    const current = this.getCurrentTask();
    if (!current) {
      display.textContent = '';
      display.classList.remove('is-visible');
      return;
    }
    display.textContent = current.text;
    display.classList.add('is-visible');
  }

  renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    taskList.innerHTML = '';

    const activeTasks = this.tasks.filter(t => !t.completed);
    const completedTasks = this.tasks.filter(t => t.completed);

    activeTasks.forEach(task => taskList.appendChild(this._createTaskElement(task)));

    if (completedTasks.length > 0) {
      const clearBtn = document.createElement('button');
      clearBtn.className = 'clear-completed-btn';
      clearBtn.textContent = 'Clear completed' + ` (${completedTasks.length})`;
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearCompletedTasks();
      });
      taskList.appendChild(clearBtn);

      completedTasks.forEach(task => taskList.appendChild(this._createTaskElement(task)));
    }
  }

  _createTaskElement(task) {
    const el = document.createElement('div');
    el.className = 'task-item' + (task.completed ? ' completed' : '') + (task.isCurrent ? ' current' : '');

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    if (!task.completed) {
      const doneBtn = document.createElement('button');
      doneBtn.className = 'task-btn task-done-btn';
      doneBtn.title = 'Done';
      doneBtn.textContent = '✓';
      doneBtn.addEventListener('click', (e) => { e.stopPropagation(); this.completeTask(task.id); });
      actions.appendChild(doneBtn);

      const editBtn = document.createElement('button');
      editBtn.className = 'task-btn task-edit-btn';
      editBtn.title = 'Edit task';
      editBtn.textContent = '✎';
      editBtn.addEventListener('click', (e) => { e.stopPropagation(); this.editTask(task.id); });
      actions.appendChild(editBtn);
    }

    const delBtn = document.createElement('button');
    delBtn.className = 'task-btn task-del-btn';
    delBtn.title = 'Delete';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', (e) => { e.stopPropagation(); this.removeTask(task.id); });
    actions.appendChild(delBtn);

    el.appendChild(text);
    el.appendChild(actions);

    if (!task.completed) {
      el.addEventListener('click', () => this.selectTask(task.id));
    }

    return el;
  }

  // ═══ Toast ═══

  showToast(message) {
    const toast = document.getElementById('appToast');
    const text = document.getElementById('appToastText');
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.hideToast(), 3000);
  }

  hideToast() {
    clearTimeout(this.toastTimeout);
    const toast = document.getElementById('appToast');
    if (toast) toast.classList.remove('is-visible');
  }

  // ═══ Settings ═══

  toggleSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
      modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
      if (modal.style.display === 'flex') this.loadSettings();
    }
  }

  loadSettings() {
    Object.keys(this.config).forEach(key => {
      const element = document.getElementById(
        key === 'autoStart' ? 'autoStartCheck' :
        key === 'sound' ? 'soundCheck' : key
      );
      if (element) {
        if (key === 'autoStart' || key === 'sound') {
          element.className = this.config[key] ? 'checkbox-pixel checked' : 'checkbox-pixel';
        } else {
          element.value = this.config[key];
        }
      }
    });
  }

  saveSettings() {
    this.config.workDuration = parseInt(document.getElementById('workDuration').value, 10) || 25;
    this.config.shortBreakDuration = parseInt(document.getElementById('shortBreakDuration').value, 10) || 5;
    this.config.longBreakDuration = parseInt(document.getElementById('longBreakDuration').value, 10) || 15;
    this.config.longBreakInterval = parseInt(document.getElementById('longBreakInterval').value, 10) || 4;
    this.saveData();
    this.resetTimer();
    this.toggleSettings();
  }

  toggleCheckbox(type) {
    const checkbox = document.getElementById(type === 'autoStart' ? 'autoStartCheck' : 'soundCheck');
    if (!checkbox) return;
    const isChecked = checkbox.classList.contains('checked');
    if (isChecked) {
      checkbox.classList.remove('checked');
      this.config[type === 'autoStart' ? 'autoStart' : 'sound'] = false;
    } else {
      checkbox.classList.add('checked');
      this.config[type === 'autoStart' ? 'autoStart' : 'sound'] = true;
    }
    this.saveData();
  }

  // ═══ Persistence ═══

  saveData() {
    const todayStr = new Date().toDateString();
    if (this.todayStats.date !== todayStr) {
      this.todayStats = { date: todayStr, count: this.todayStats.count, totalMinutes: this.todayStats.totalMinutes };
    }

    const data = {
      config: this.config,
      tasks: this.tasks,
      currentTaskId: this.currentTaskId,
      completedWorkCount: this.completedWorkCount,
      todayStats: this.todayStats,
      quickTaskCycle: this.quickTaskCycle
    };

    const json = JSON.stringify(data);
    localStorage.setItem('pixelPomodoro', json);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ pixelPomodoro: data });
    }
  }

  loadData(cb) {
    const applyData = (saved) => {
      if (saved) {
        const data = typeof saved === 'string' ? JSON.parse(saved) : saved;
        this.config = { ...this.config, ...(data.config || {}) };
        this.tasks = data.tasks || [];
        this.currentTaskId = data.currentTaskId;
        this.completedWorkCount = data.completedWorkCount || 0;
        this.quickTaskCycle = data.quickTaskCycle || 0;
        this.setActiveTask(this.currentTaskId);

        if (data.todayStats) {
          const todayStr = new Date().toDateString();
          if (data.todayStats.date === todayStr) {
            this.todayStats = data.todayStats;
          }
        }
      }

      if (!this.getCurrentTask()) {
        const next = this.getNextIncompleteTask();
        this.setActiveTask(next ? next.id : null);
      }

      this.timeLeft = this.getCurrentDuration() * 60;
      this.loadSettings();
      if (cb) cb();
    };

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['pixelPomodoro'], (result) => {
        applyData(result.pixelPomodoro);
      });
    } else {
      applyData(localStorage.getItem('pixelPomodoro'));
    }
  }
}

// ═══ Initialize ═══

document.addEventListener('DOMContentLoaded', () => {
  const pomodoro = new PixelPomodoro();

  // Timer controls
  document.getElementById('startPauseBtn').addEventListener('click', () => pomodoro.toggleTimer());
  document.getElementById('stopBtn').addEventListener('click', () => pomodoro.resetTimer());
  document.getElementById('quickTaskBtn').addEventListener('click', () => pomodoro.toggleTaskPanel());

  // Task panel
  document.getElementById('taskPanelBtn').addEventListener('click', () => pomodoro.toggleTaskPanel());
  document.getElementById('taskPanelBackBtn').addEventListener('click', () => pomodoro.toggleTaskPanel());
  document.getElementById('taskPanelOverlay').addEventListener('click', () => pomodoro.toggleTaskPanel());
  document.getElementById('addTaskBtn').addEventListener('click', () => pomodoro.addTask());
  document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') pomodoro.addTask();
  });

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', () => pomodoro.toggleSettings());
  document.getElementById('settingsSaveBtn').addEventListener('click', () => pomodoro.saveSettings());
  document.getElementById('settingsCancelBtn').addEventListener('click', () => pomodoro.toggleSettings());
  document.getElementById('settingsModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) pomodoro.toggleSettings();
  });

  // Settings checkboxes
  document.getElementById('autoStartCheck').addEventListener('click', () => pomodoro.toggleCheckbox('autoStart'));
  document.getElementById('soundCheck').addEventListener('click', () => pomodoro.toggleCheckbox('sound'));

  // Toast close
  document.getElementById('toastCloseBtn').addEventListener('click', () => pomodoro.hideToast());

  // Visibility change
  document.addEventListener('visibilitychange', () => {
    if (pomodoro.isRunning) pomodoro.updatePageTitle();
  });
});
