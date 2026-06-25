# Speech Provider Research

**Date:** 2026-06-25
**Goal:** Find cheap or free speech options for FluentLab's speaking and listening features.

## Decision

Use a local-first speech strategy.

1. MVP speaking UX starts with browser audio recording and optional manual transcript input.
2. MVP listening playback starts with stored audio links or browser text-to-speech for generated practice text.
3. The first real speech-to-text integration should be local Whisper, preferably `whisper.cpp` on Apple Silicon.
4. Cloud speech-to-text remains an optional fallback, not the default path.

This matches the product constraints:

- Single-user first.
- Local-only first.
- Used by the owner and one friend.
- Strong preference for free or cheap services.
- Speaking practice does not need large-scale production infrastructure at the start.

## Options Reviewed

### Browser Web Speech API

Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

Pros:

- Free from the app's point of view.
- Supports speech synthesis through `SpeechSynthesis`.
- Provides a browser speech recognition interface where supported.
- Useful for simple text-to-speech playback and quick prototypes.

Cons:

- Speech recognition support and behavior vary by browser and platform.
- Recognition may use platform or browser services, so privacy and offline behavior are not fully controlled.
- Not reliable enough as the only transcription path.

Use in FluentLab:

- Use `SpeechSynthesis` for free text-to-speech in early listening exercises.
- Treat browser `SpeechRecognition` as an optional convenience, not a required dependency.

### whisper.cpp

Source: https://github.com/ggml-org/whisper.cpp

Pros:

- Free and open source.
- Runs locally.
- Designed for high-performance Whisper inference.
- Apple Silicon is a first-class target, with optimizations through ARM NEON, Accelerate, Metal, and Core ML.
- Good fit for a MacBook-based local app.

Cons:

- Requires model download and local setup.
- Transcription speed depends on chosen model size.
- Pronunciation scoring still needs separate logic; transcript feedback alone is not full pronunciation assessment.

Use in FluentLab:

- Recommended default speech-to-text path after the first UI milestone.
- Start with a small or base English model for speed, then test larger models if accuracy is not enough.

### faster-whisper

Source: https://github.com/SYSTRAN/faster-whisper

Pros:

- Free and open source.
- Python-friendly.
- CTranslate2-based implementation of Whisper.
- Useful if the backend is already Python/FastAPI.

Cons:

- GPU speedups are most attractive on NVIDIA/CUDA systems, while the target development machine is Apple Silicon.
- Local dependency setup may be heavier than `whisper.cpp` for a simple Mac-local app.

Use in FluentLab:

- Good backup if the FastAPI backend benefits from a Python-native transcription library.
- Keep as alternative to `whisper.cpp`, not the first choice.

### Azure AI Speech

Source: https://azure.microsoft.com/en-us/pricing/details/speech/

Pros:

- Official free tier includes 5 audio hours per month for real-time speech-to-text.
- Free tier also includes neural text-to-speech characters.
- Mature service.

Cons:

- Requires Azure account, billing setup, keys, and network calls.
- Free tier has quotas and cloud dependency.
- More infrastructure than needed for local-only first.

Use in FluentLab:

- Best free cloud fallback if local transcription is not good enough.

### Google Cloud Speech-to-Text

Source: https://cloud.google.com/speech-to-text/pricing

Pros:

- V1 pricing page lists 60 free minutes per month.
- Mature service and broad language support.

Cons:

- Smaller free allowance than Azure's published free tier.
- Requires Google Cloud setup and billing.
- V2 standard recognition is paid from the first minute.

Use in FluentLab:

- Secondary cloud fallback.

### Deepgram

Source: https://deepgram.com/pricing

Pros:

- Pricing page lists free credit for developers.
- Pay-as-you-go speech-to-text prices are relatively low.
- Strong developer experience for speech APIs.

Cons:

- Free usage appears credit-based rather than a permanent local/free path.
- Cloud dependency.

Use in FluentLab:

- Good paid fallback if cloud transcription becomes useful later.

### OpenAI Speech APIs

Source: https://openai.com/api/pricing/

Pros:

- Easy if the product already uses OpenAI-compatible client patterns.
- Streaming transcription options are available.

Cons:

- Not free.
- The current product LLM provider is Kimi, not OpenAI.
- Adds another provider key and cost path.

Use in FluentLab:

- Do not use by default.

## Recommended Implementation Order

1. Build speaking tasks with record, replay, and manual transcript input.
2. Build listening tasks with static audio links and browser text-to-speech.
3. Add local `whisper.cpp` transcription as an optional local service.
4. Feed transcripts to Kimi for learning feedback, mistake extraction, and better expressions.
5. Add Azure Speech as the first cloud fallback only if local transcription is not enough.
