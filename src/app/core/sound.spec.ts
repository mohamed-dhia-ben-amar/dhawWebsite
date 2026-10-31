import { TestBed } from '@angular/core/testing';
import { SOUND_STORAGE_KEY, Sound } from './sound';

/** Minimal Web Audio stand-in that counts the sounds started. */
class FakeAudioContext {
  static instances = 0;
  static started = 0;
  state = 'running';
  currentTime = 0;
  sampleRate = 8000;
  destination = {};
  constructor() {
    FakeAudioContext.instances++;
  }
  private node() {
    const param = {
      value: 0,
      setValueAtTime: () => undefined,
      exponentialRampToValueAtTime: () => undefined,
    };
    const node = {
      frequency: param,
      gain: param,
      Q: param,
      type: '',
      buffer: null,
      connect: () => node,
      start: () => FakeAudioContext.started++,
      stop: () => undefined,
    };
    return node;
  }
  createOscillator = () => this.node();
  createGain = () => this.node();
  createBiquadFilter = () => this.node();
  createBufferSource = () => this.node();
  createBuffer = (_: number, length: number) => ({
    getChannelData: () => new Float32Array(length),
  });
  resume = () => Promise.resolve();
}

describe('Sound', () => {
  let host: HTMLElement;

  beforeEach(() => {
    FakeAudioContext.instances = 0;
    FakeAudioContext.started = 0;
    localStorage.clear();
    vi.stubGlobal('AudioContext', FakeAudioContext);
    host = document.createElement('div');
    host.innerHTML = `
      <a id="link" href="#x">Link</a>
      <button id="wave" data-sound="wave">Theme</button>
      <button id="quiet" data-sound="off">Quiet</button>
      <button id="busy" aria-disabled="true">Busy</button>
      <p id="text">Text</p>`;
    document.body.append(host);
  });

  afterEach(() => {
    host.remove();
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  const click = (id: string) => document.getElementById(id)!.click();

  function start() {
    const sound = TestBed.inject(Sound);
    sound.init();
    return sound;
  }

  it('is off by default and makes no audio context until it plays', () => {
    const sound = start();
    expect(sound.enabled()).toBe(false);
    click('link');
    expect(FakeAudioContext.instances).toBe(0);
  });

  it('restores and stores the visitor choice', () => {
    localStorage.setItem(SOUND_STORAGE_KEY, 'on');
    const sound = start();
    expect(sound.enabled()).toBe(true);
    sound.setEnabled(false);
    expect(localStorage.getItem(SOUND_STORAGE_KEY)).toBe('off');
  });

  it('when on, links and buttons tick; data-sound picks or silences the sound', () => {
    const sound = start();
    sound.setEnabled(true);

    click('link');
    expect(FakeAudioContext.started).toBe(1);

    click('wave'); // filtered noise + a tone
    expect(FakeAudioContext.started).toBe(3);

    click('quiet');
    click('busy');
    click('text');
    expect(FakeAudioContext.started).toBe(3);
    expect(FakeAudioContext.instances).toBe(1);
  });

  it('play() does nothing while sound is off', () => {
    const sound = start();
    sound.play('success');
    expect(FakeAudioContext.started).toBe(0);
    sound.setEnabled(true);
    sound.play('success');
    expect(FakeAudioContext.started).toBe(2);
  });
});
