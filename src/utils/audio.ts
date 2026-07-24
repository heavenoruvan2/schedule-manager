// Web Audio API helper for ambient focus soundscapes and alarm chimes without external audio files
export type SoundscapeType = 
  | 'rain' 
  | 'thunderstorm' 
  | 'lofi' 
  | 'forest' 
  | 'white_noise' 
  | 'waves' 
  | 'cafe' 
  | 'crickets' 
  | 'campfire' 
  | 'binaural';

interface SoundChannel {
  sourceNode: AudioNode;
  gainNode: GainNode;
  filterNode?: AudioNode;
  extraNodes?: AudioNode[];
  intervalId?: any;
  volume: number;
}

class FocusAudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private masterVolume: number = 0.5;
  private activeChannels: Map<SoundscapeType, SoundChannel> = new Map();

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (!this.masterGain && this.audioCtx) {
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
  }

  public setVolume(level: number) {
    this.masterVolume = Math.max(0, Math.min(1, level));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public isSoundActive(type: SoundscapeType): boolean {
    return this.activeChannels.has(type);
  }

  public getActiveSounds(): SoundscapeType[] {
    return Array.from(this.activeChannels.keys());
  }

  public getChannelVolume(type: SoundscapeType): number {
    const channel = this.activeChannels.get(type);
    return channel ? channel.volume : 0.7;
  }

  public setChannelVolume(type: SoundscapeType, volume: number) {
    const channel = this.activeChannels.get(type);
    if (channel && this.audioCtx) {
      channel.volume = Math.max(0, Math.min(1, volume));
      channel.gainNode.gain.setValueAtTime(channel.volume * 0.35, this.audioCtx.currentTime);
    }
  }

  public toggleSound(type: SoundscapeType, volume: number = 0.7) {
    if (this.activeChannels.has(type)) {
      this.stopSound(type);
    } else {
      this.playSound(type, volume);
    }
  }

  public playAmbient(type: SoundscapeType) {
    if (!this.activeChannels.has(type)) {
      this.playSound(type, 0.7);
    }
  }

  public playSound(type: SoundscapeType, volume: number = 0.7) {
    this.initContext();
    if (!this.audioCtx || !this.masterGain) return;

    if (this.activeChannels.has(type)) {
      this.setChannelVolume(type, volume);
      return;
    }

    const channelGain = this.audioCtx.createGain();
    const effectiveVol = Math.max(0, Math.min(1, volume));
    channelGain.gain.setValueAtTime(effectiveVol * 0.35, this.audioCtx.currentTime);
    channelGain.connect(this.masterGain);

    let channel: SoundChannel | null = null;

    if (type === 'thunderstorm') {
      channel = this.createThunderstormChannel(channelGain, effectiveVol);
    } else if (type === 'lofi') {
      channel = this.createLofiChannel(channelGain, effectiveVol);
    } else if (type === 'campfire') {
      channel = this.createCampfireChannel(channelGain, effectiveVol);
    } else if (type === 'binaural') {
      channel = this.createBinauralChannel(channelGain, effectiveVol);
    } else {
      channel = this.createNoiseBasedChannel(type, channelGain, effectiveVol);
    }

    if (channel) {
      this.activeChannels.set(type, channel);
    }
  }

  private createNoiseBasedChannel(type: SoundscapeType, channelGain: GainNode, volume: number): SoundChannel | null {
    if (!this.audioCtx) return null;
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain') {
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.2;
      } else if (type === 'forest') {
        output[i] = (lastOut + 0.035 * white) / 1.035;
        lastOut = output[i];
        output[i] *= 2.5;
      } else if (type === 'waves') {
        output[i] = (lastOut + 0.015 * white) / 1.015;
        lastOut = output[i];
        output[i] *= 4.0;
      } else if (type === 'cafe') {
        output[i] = (lastOut + 0.05 * white) / 1.05;
        lastOut = output[i];
        output[i] *= 2.0;
      } else if (type === 'crickets') {
        output[i] = (lastOut + 0.08 * white) / 1.08;
        lastOut = output[i];
        output[i] *= 1.8;
      } else {
        output[i] = white * 0.15;
      }
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 900;
    } else if (type === 'forest') {
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 0.7;
    } else if (type === 'waves') {
      filter.type = 'lowpass';
      filter.frequency.value = 450;
    } else if (type === 'crickets') {
      filter.type = 'highpass';
      filter.frequency.value = 3200;
    } else if (type === 'cafe') {
      filter.type = 'bandpass';
      filter.frequency.value = 1100;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 3500;
    }

    const extraNodes: AudioNode[] = [];
    if (type === 'waves' || type === 'forest') {
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.value = type === 'waves' ? 0.12 : 0.25;
      lfoGain.gain.value = volume * 0.12;
      lfo.connect(lfoGain);
      lfoGain.connect(channelGain.gain);
      lfo.start();
      extraNodes.push(lfo, lfoGain);
    }

    source.connect(filter);
    filter.connect(channelGain);
    source.start();

    return {
      sourceNode: source,
      gainNode: channelGain,
      filterNode: filter,
      extraNodes,
      volume,
    };
  }

  private createThunderstormChannel(channelGain: GainNode, volume: number): SoundChannel | null {
    if (!this.audioCtx) return null;
    
    // Heavy rain noise base
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const rainBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = rainBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + 0.03 * white) / 1.03;
      last = data[i];
      data[i] *= 3.8;
    }

    const rainSource = this.audioCtx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = this.audioCtx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 750;

    rainSource.connect(rainFilter);
    rainFilter.connect(channelGain);
    rainSource.start();

    // Periodic Thunder Rumble Generator
    const triggerThunder = () => {
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const thunderGain = this.audioCtx.createGain();
      const thunderFilter = this.audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 2.5);

      thunderFilter.type = 'lowpass';
      thunderFilter.frequency.value = 180;

      thunderGain.gain.setValueAtTime(0.001, now);
      thunderGain.gain.linearRampToValueAtTime(0.4, now + 0.3);
      thunderGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

      osc.connect(thunderFilter);
      thunderFilter.connect(thunderGain);
      thunderGain.connect(channelGain);

      osc.start(now);
      osc.stop(now + 3.3);
    };

    triggerThunder();
    const intervalId = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerThunder();
      }
    }, 7000);

    return {
      sourceNode: rainSource,
      gainNode: channelGain,
      filterNode: rainFilter,
      intervalId,
      volume,
    };
  }

  private createLofiChannel(channelGain: GainNode, volume: number): SoundChannel | null {
    if (!this.audioCtx) return null;

    // Vinyl crackle noise
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const vinylBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = vinylBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const isPop = Math.random() < 0.002;
      data[i] = isPop ? (Math.random() * 0.4 - 0.2) : (Math.random() * 0.02 - 0.01);
    }

    const vinylSource = this.audioCtx.createBufferSource();
    vinylSource.buffer = vinylBuffer;
    vinylSource.loop = true;

    const vinylFilter = this.audioCtx.createBiquadFilter();
    vinylFilter.type = 'bandpass';
    vinylFilter.frequency.value = 2200;
    vinylFilter.Q.value = 0.5;

    vinylSource.connect(vinylFilter);
    vinylFilter.connect(channelGain);
    vinylSource.start();

    // Lofi Chords & Beat Synth Loop
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];
    let chordIndex = 0;

    const playLofiChord = () => {
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const currentChord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      currentChord.forEach((freq) => {
        const osc = this.audioCtx!.createOscillator();
        const noteGain = this.audioCtx!.createGain();
        const filter = this.audioCtx!.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.value = 800;

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.06, now + 0.2);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(channelGain);

        osc.start(now);
        osc.stop(now + 2.9);
      });

      // Soft Lofi Kick
      const kickOsc = this.audioCtx.createOscillator();
      const kickGain = this.audioCtx.createGain();
      kickOsc.frequency.setValueAtTime(110, now);
      kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      kickGain.gain.setValueAtTime(0.2, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      kickOsc.connect(kickGain);
      kickGain.connect(channelGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.26);
    };

    playLofiChord();
    const intervalId = setInterval(playLofiChord, 3000);

    return {
      sourceNode: vinylSource,
      gainNode: channelGain,
      filterNode: vinylFilter,
      intervalId,
      volume,
    };
  }

  private createCampfireChannel(channelGain: GainNode, volume: number): SoundChannel | null {
    if (!this.audioCtx) return null;

    const bufferSize = 2 * this.audioCtx.sampleRate;
    const fireBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = fireBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const isSnap = Math.random() < 0.004;
      data[i] = (last + 0.04 * white) / 1.04;
      if (isSnap) {
        data[i] += (Math.random() * 0.8 - 0.4);
      }
      last = data[i];
    }

    const fireSource = this.audioCtx.createBufferSource();
    fireSource.buffer = fireBuffer;
    fireSource.loop = true;

    const fireFilter = this.audioCtx.createBiquadFilter();
    fireFilter.type = 'lowpass';
    fireFilter.frequency.value = 1200;

    fireSource.connect(fireFilter);
    fireFilter.connect(channelGain);
    fireSource.start();

    return {
      sourceNode: fireSource,
      gainNode: channelGain,
      filterNode: fireFilter,
      volume,
    };
  }

  private createBinauralChannel(channelGain: GainNode, volume: number): SoundChannel | null {
    if (!this.audioCtx) return null;

    const now = this.audioCtx.currentTime;

    const oscLeft = this.audioCtx.createOscillator();
    const panLeft = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null;
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(216, now);

    const oscRight = this.audioCtx.createOscillator();
    const panRight = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null;
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(226, now);

    if (panLeft && panRight) {
      panLeft.pan.setValueAtTime(-1, now);
      panRight.pan.setValueAtTime(1, now);

      oscLeft.connect(panLeft);
      panLeft.connect(channelGain);

      oscRight.connect(panRight);
      panRight.connect(channelGain);
    } else {
      oscLeft.connect(channelGain);
      oscRight.connect(channelGain);
    }

    oscLeft.start(now);
    oscRight.start(now);

    return {
      sourceNode: oscLeft,
      gainNode: channelGain,
      extraNodes: panLeft && panRight ? [oscRight, panLeft, panRight] : [oscRight],
      volume,
    };
  }

  public stopSound(type: SoundscapeType) {
    const channel = this.activeChannels.get(type);
    if (channel) {
      if (channel.intervalId) {
        clearInterval(channel.intervalId);
      }
      try {
        (channel.sourceNode as any).stop?.();
        channel.sourceNode.disconnect();
      } catch (e) {
        // ignore
      }
      if (channel.extraNodes) {
        channel.extraNodes.forEach((node) => {
          try {
            (node as any).stop?.();
            node.disconnect();
          } catch (e) {
            // ignore
          }
        });
      }
      this.activeChannels.delete(type);
    }
  }

  public stopAmbient() {
    Array.from(this.activeChannels.keys()).forEach((type) => {
      this.stopSound(type);
    });
  }

  public getCurrentType(): SoundscapeType | 'none' {
    const keys = Array.from(this.activeChannels.keys());
    return keys.length > 0 ? keys[0] : 'none';
  }

  public playAlarmChime() {
    this.initContext();
    if (!this.audioCtx || !this.masterGain) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.45); // C6

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.9);
  }

  public playDistractionAlert() {
    this.initContext();
    if (!this.audioCtx || !this.masterGain) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(349.23, now + 0.12);
    osc.frequency.setValueAtTime(293.66, now + 0.24);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }
}

export const focusAudio = new FocusAudioEngine();
