package com.airadio.audio;

import be.tarsos.dsp.AudioDispatcher;
import be.tarsos.dsp.AudioEvent;
import be.tarsos.dsp.AudioProcessor;
import be.tarsos.dsp.io.jvm.JVMAudioInputStream;
import be.tarsos.dsp.io.jvm.AudioDispatcherFactory;
import be.tarsos.dsp.effects.DelayEffect;
import be.tarsos.dsp.effects.FlangerEffect;
import be.tarsos.dsp.filters.LowPassFS;
import be.tarsos.dsp.filters.HighPass;
import be.tarsos.dsp.synthesis.AmplitudeLFO;

import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AudioProcessor {
    private AudioDispatcher mainDispatcher;
    private AudioDispatcher bgmDispatcher;
    private float sampleRate = 44100;
    private int bufferSize = 1024;
    private int overlap = 0;
    private float bgmVolume = 0.2f;
    private float mainVolume = 1.0f;
    private boolean isFading = false;

    public void processAudioWithBGM(String mainAudio, String bgmAudio, String outputFile, boolean fadeIn, boolean fadeOut) 
        throws UnsupportedAudioFileException, IOException {
        
        // Initialize dispatchers
        mainDispatcher = AudioDispatcherFactory.fromFile(new File(mainAudio), bufferSize, overlap);
        bgmDispatcher = AudioDispatcherFactory.fromFile(new File(bgmAudio), bufferSize, overlap);

        // Create mixers and effects
        List<byte[]> mixedOutput = new ArrayList<>();
        AmplitudeLFO fadeEffect = new AmplitudeLFO(0.5f, 1.0f, sampleRate);

        // Add fade effects
        if (fadeIn) {
            addFadeInEffect(mainDispatcher, 3000); // 3 second fade in
        }
        if (fadeOut) {
            addFadeOutEffect(mainDispatcher, 3000); // 3 second fade out
        }

        // Mix audio streams
        AudioProcessor mixingProcessor = new AudioProcessor() {
            @Override
            public boolean process(AudioEvent audioEvent) {
                float[] mainBuffer = audioEvent.getFloatBuffer();
                float[] bgmBuffer = new float[mainBuffer.length];
                
                // Get BGM samples
                bgmDispatcher.processNext(new AudioEvent(audioEvent.getTimeStamp(), bgmBuffer));

                // Mix the streams with volume control
                for (int i = 0; i < mainBuffer.length; i++) {
                    mainBuffer[i] = (mainBuffer[i] * mainVolume) + (bgmBuffer[i] * bgmVolume);
                }

                // Convert to bytes and store
                byte[] byteData = new byte[mainBuffer.length * 2];
                for (int i = 0; i < mainBuffer.length; i++) {
                    short value = (short) (mainBuffer[i] * 32767.0);
                    byteData[i * 2] = (byte) (value & 0xFF);
                    byteData[i * 2 + 1] = (byte) ((value >>> 8) & 0xFF);
                }
                mixedOutput.add(byteData);
                return true;
            }

            @Override
            public void processingFinished() {
                writeMixedOutput(mixedOutput, outputFile);
            }
        };

        mainDispatcher.addAudioProcessor(mixingProcessor);
        mainDispatcher.run();
    }

    private void addFadeInEffect(AudioDispatcher dispatcher, int durationMs) {
        final float samplesForFade = (sampleRate * durationMs) / 1000;
        final float[] fadeInMultiplier = new float[1];
        fadeInMultiplier[0] = 0;

        dispatcher.addAudioProcessor(new AudioProcessor() {
            private int sampleCount = 0;

            @Override
            public boolean process(AudioEvent audioEvent) {
                float[] buffer = audioEvent.getFloatBuffer();
                for (int i = 0; i < buffer.length; i++) {
                    if (sampleCount < samplesForFade) {
                        fadeInMultiplier[0] = sampleCount / samplesForFade;
                        buffer[i] *= fadeInMultiplier[0];
                        sampleCount++;
                    }
                }
                return true;
            }

            @Override
            public void processingFinished() {}
        });
    }

    private void addFadeOutEffect(AudioDispatcher dispatcher, int durationMs) {
        final float samplesForFade = (sampleRate * durationMs) / 1000;
        final float[] fadeOutMultiplier = new float[1];
        fadeOutMultiplier[0] = 1;

        dispatcher.addAudioProcessor(new AudioProcessor() {
            private int sampleCount = 0;
            private boolean startFade = false;

            @Override
            public boolean process(AudioEvent audioEvent) {
                float[] buffer = audioEvent.getFloatBuffer();
                
                if (!startFade && sampleCount >= (dispatcher.getTotalFrames() - samplesForFade)) {
                    startFade = true;
                }

                if (startFade) {
                    for (int i = 0; i < buffer.length; i++) {
                        fadeOutMultiplier[0] = 1 - (sampleCount / samplesForFade);
                        buffer[i] *= Math.max(0, fadeOutMultiplier[0]);
                        sampleCount++;
                    }
                }
                return true;
            }

            @Override
            public void processingFinished() {}
        });
    }

    private void writeMixedOutput(List<byte[]> mixedOutput, String outputFile) {
        try {
            AudioFormat format = new AudioFormat(sampleRate, 16, 1, true, true);
            
            // Calculate total size
            int totalSize = mixedOutput.stream().mapToInt(array -> array.length).sum();
            byte[] completeAudio = new byte[totalSize];
            
            // Combine all chunks
            int offset = 0;
            for (byte[] chunk : mixedOutput) {
                System.arraycopy(chunk, 0, completeAudio, offset, chunk.length);
                offset += chunk.length;
            }

            // Write to file
            AudioInputStream outputStream = new AudioInputStream(
                new java.io.ByteArrayInputStream(completeAudio),
                format,
                completeAudio.length / format.getFrameSize()
            );
            AudioSystem.write(outputStream, AudioFileFormat.Type.WAVE, new File(outputFile));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void setBGMVolume(float volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
    }

    public void setMainVolume(float volume) {
        this.mainVolume = Math.max(0, Math.min(1, volume));
    }

    public void stop() {
        if (mainDispatcher != null) {
            mainDispatcher.stop();
        }
        if (bgmDispatcher != null) {
            bgmDispatcher.stop();
        }
    }
}
