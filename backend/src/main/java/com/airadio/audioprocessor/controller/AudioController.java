package com.airadio.audioprocessor.controller;

import com.airadio.audioprocessor.service.AudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/audio")
@CrossOrigin(origins = "http://localhost:3000")
public class AudioController {
    
    @Autowired
    private AudioService audioService;

    @PostMapping("/play/{audioId}")
    public ResponseEntity<?> playAudio(@PathVariable String audioId, @RequestParam("file") MultipartFile file) {
        try {
            audioService.playAudio(audioId, file.getInputStream());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/stop/{audioId}")
    public ResponseEntity<?> stopAudio(@PathVariable String audioId) {
        audioService.stopAudio(audioId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/volume/{audioId}")
    public ResponseEntity<?> setVolume(@PathVariable String audioId, @RequestParam float volume) {
        audioService.setVolume(audioId, volume);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/loop/{audioId}")
    public ResponseEntity<?> setLoop(@PathVariable String audioId, @RequestParam boolean loop) {
        audioService.setLoop(audioId, loop);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/waveform")
    public ResponseEntity<?> getWaveformData(@RequestParam("file") MultipartFile file) {
        try {
            float[] waveform = audioService.getWaveformData(file.getInputStream());
            return ResponseEntity.ok(waveform);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
