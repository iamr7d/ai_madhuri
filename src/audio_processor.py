from py4j.java_gateway import JavaGateway, GatewayParameters
import os

class AudioProcessorWrapper:
    def __init__(self):
        # Start the Java gateway
        self.gateway = JavaGateway(
            gateway_parameters=GatewayParameters(auto_convert=True)
        )
        
        # Get the audio processor instance
        self.processor = self.gateway.entry_point.getAudioProcessor()

    def process_audio(self, input_file, output_file):
        """
        Process audio using the Java AudioProcessor
        """
        try:
            self.processor.processAudio(input_file, output_file)
            return True
        except Exception as e:
            print(f"Error processing audio: {e}")
            return False

    def set_effect_parameters(self, delay_time=0.3, delay_feedback=0.5, 
                            flanger_length=0.003, flanger_frequency=0.002):
        """
        Update audio effect parameters in real-time
        """
        try:
            self.processor.setEffectParameters(
                delay_time, delay_feedback, 
                flanger_length, flanger_frequency
            )
            return True
        except Exception as e:
            print(f"Error setting effect parameters: {e}")
            return False

    def process_audio_with_bgm(self, main_audio, bgm_audio, output_file, fade_in=True, fade_out=True):
        """
        Process audio with background music and fading effects
        """
        try:
            self.processor.processAudioWithBGM(main_audio, bgm_audio, output_file, fade_in, fade_out)
            return True
        except Exception as e:
            print(f"Error processing audio with BGM: {e}")
            return False

    def set_bgm_volume(self, volume):
        """
        Set background music volume (0.0 to 1.0)
        """
        try:
            self.processor.setBGMVolume(float(volume))
            return True
        except Exception as e:
            print(f"Error setting BGM volume: {e}")
            return False

    def set_main_volume(self, volume):
        """
        Set main audio volume (0.0 to 1.0)
        """
        try:
            self.processor.setMainVolume(float(volume))
            return True
        except Exception as e:
            print(f"Error setting main volume: {e}")
            return False

    def stop(self):
        """
        Stop audio processing
        """
        try:
            self.processor.stop()
            return True
        except Exception as e:
            print(f"Error stopping processor: {e}")
            return False

    def __del__(self):
        """
        Clean up resources
        """
        try:
            self.gateway.shutdown()
        except:
            pass
