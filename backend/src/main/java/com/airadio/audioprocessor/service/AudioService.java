package com.airadio.audioprocessor.service;

import org.springframework.stereotype.Service;
import javax.sound.sampled.*;
import java.io.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AudioService {
    private final ConcurrentHashMap<String, Clip> activeClips = new ConcurrentHashMap<>();

    public void playAudio(String audioId, InputStream audioStream) throws Exception {
        try {
            // Get audio input stream
            AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(
                new BufferedInputStream(audioStream)
            );

            // Get clip
            Clip clip = AudioSystem.getClip();
            
            // Open and start clip
            clip.open(audioInputStream);
            
            // Store the clip
            activeClips.put(audioId, clip);
            
            // Add line listener to remove clip when done
            clip.addLineListener(event -> {
                if (event.getType() == LineEvent.Type.STOP) {
                    clip.close();
                    activeClips.remove(audioId);
                }
            });
            
            clip.start();
        } catch (Exception e) {
            throw new Exception("Error playing audio: " + e.getMessage());
        }
    }

    public void stopAudio(String audioId) {
        Clip clip = activeClips.get(audioId);
        if (clip != null && clip.isRunning()) {
            clip.stop();
            clip.close();
            activeClips.remove(audioId);
        }
    }

    public void setVolume(String audioId, float volume) {
        Clip clip = activeClips.get(audioId);
        if (clip != null) {
            FloatControl gainControl = (FloatControl) clip.getControl(FloatControl.Type.MASTER_GAIN);
            float dB = (float) (Math.log(volume) / Math.log(10.0) * 20.0);
            gainControl.setValue(dB);
        }
    }

    public void setLoop(String audioId, boolean loop) {
        Clip clip = activeClips.get(audioId);
        if (clip != null) {
            if (loop) {
                clip.loop(Clip.LOOP_CONTINUOUSLY);
            } else {
                clip.loop(0);
            }
        }
    }

    public float[] getWaveformData(InputStream audioStream) throws Exception {
        try {
            AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(
                new BufferedInputStream(audioStream)
            );
            
            AudioFormat format = audioInputStream.getFormat();
            byte[] audioData = audioInputStream.readAllBytes();
            
            // Convert byte array to float array
            float[] waveform = new float[audioData.length / 2];
            for (int i = 0; i < waveform.length; i++) {
                // Combine two bytes to form a sample
                int sample = (audioData[2*i+1] << 8) | (audioData[2*i] & 0xff);
                // Normalize to [-1.0, 1.0]
                waveform[i] = sample / 32768f;
            }
            
            return waveform;
        } catch (Exception e) {
            throw new Exception("Error getting waveform data: " + e.getMessage());
        }
    }
}
