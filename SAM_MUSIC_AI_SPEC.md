# 🎵 SAM MUSIC AI — MASTER FULL-STACK DEVELOPMENT PROMPT

## ROLE

Act as a world-class:
* Senior Full-Stack Engineer
* AI/ML Engineer
* Music Technology Engineer
* Audio DSP Engineer
* UI/UX Designer
* SaaS Architect
* DevOps Engineer
* Security Engineer
* Product Designer

Build a production-ready AI music creation platform called:

# SAM MUSIC AI

The platform should allow users to create complete original music using text prompts, lyrics, vocals, uploaded audio, instruments, stems and an advanced browser-based music studio.

Do NOT copy Suno's UI, branding, proprietary models, source code or copyrighted assets.

Build an ORIGINAL product with its own visual identity and architecture.

---

# 1. PRODUCT VISION
SAM Music AI is an AI-powered music creation studio.
Users should be able to:
1. Enter a music description.
2. Generate lyrics.
3. Generate instrumental music.
4. Generate complete songs.
5. Generate vocals.
6. Use an authorized voice profile.
7. Upload audio.
8. Extend songs.
9. Remix songs.
10. Replace sections.
11. Separate stems.
12. Edit audio on a timeline.
13. Edit MIDI.
14. Add virtual instruments.
15. Apply effects.
16. Mix tracks.
17. Master songs.
18. Export WAV/MP3/stems/MIDI.
19. Save projects.
20. Share projects.
21. Manage credits and subscriptions.

The experience should feel like:
AI MUSIC GENERATOR + ONLINE DAW + AI VOCAL STUDIO

---

# 2. BRAND
Product name:
SAM Music AI

Brand personality:
* Premium
* Creative
* Futuristic
* Professional
* Music-industry focused
* Minimal
* Powerful

Create an original design system.
Suggested visual direction:
* Dark professional studio interface
* Black / charcoal foundation
* Subtle gradients
* Glass panels
* High-quality waveform visualization
* Smooth animations
* Large typography
* Minimal navigation
* Professional DAW-like workspace

---

# 3. MAIN APPLICATION STRUCTURE
Create these main routes:
/
/discover
/create
/studio
/projects
/library
/voices
/sounds
/templates
/community
/pricing
/settings
/account
/admin
/admin/users
/admin/songs
/admin/projects
/admin/models
/admin/credits
/admin/payments
/admin/reports

---

# 4. LANDING PAGE
Create a premium SaaS landing page.
Hero:
"Create Music With AI."
Subtitle:
"Turn ideas, lyrics and sounds into original music."
Buttons:
"Create Music"
"Explore"
Hero animation:
Show an abstract audio waveform / music studio visualization.
Sections:
* AI Song Generator
* AI Vocals
* Music Studio
* Stem Separation
* AI Remix
* Voice Studio
* MIDI Tools
* Sound Library
* Professional Export
Pricing section.
FAQ.
Footer.

---

# 5. AUTHENTICATION
Implement:
* Email/password
* Google OAuth
* Optional Apple OAuth
* Email verification
* Password reset
* Session management
* Secure JWT/session architecture

User roles:
USER
CREATOR
PRO
ADMIN
SUPER_ADMIN

Protect admin routes.
Never expose secret API keys to frontend.

---

# 6. USER DASHBOARD
Dashboard should show:
Welcome message.
Recent projects.
Recent generations.
Favorite songs.
Credit balance.
Quick actions:
* Create Song
* Create Instrumental
* Generate Lyrics
* Open Studio
* Upload Audio
* Separate Stems

Show generation history.

---

# 7. AI SONG GENERATOR
Create page:
/create

UI:
Music prompt textarea.
Example:
"Emotional Tamil cinematic love song with acoustic guitar, flute, soft male vocals and powerful chorus."

Controls:
Language
Genre
Mood
Tempo
Key
Vocal type
Song duration
Structure
Creativity
Energy
Instrumentation

Lyrics mode:
* Generate lyrics
* Use my lyrics
* Instrumental

Advanced options.
Button:
GENERATE SONG

When clicked:
1. Validate credits.
2. Create generation job.
3. Send request to backend.
4. Queue AI task.
5. Show progress.
6. Poll/WebSocket job status.
7. Display generated tracks.
8. Allow preview.
9. Save generation metadata.

Never block the UI during generation.

---

# 8. MUSIC PROMPT ENGINE
Create an internal prompt parser.
Input:
"Sad Tamil cinematic song about separation, male vocal, flute intro, emotional chorus."

Convert into structured metadata:
language: Tamil
genre: cinematic
mood: sad
theme: separation
vocal: male
tempo: slow
instrumentation:
* flute
* strings
* acoustic guitar
structure:
intro
verse
pre-chorus
chorus
verse
chorus
bridge
outro

The parser should be model-independent.

---

# 9. LYRIC GENERATOR
Create AI lyric generation.
Inputs:
Language
Theme
Genre
Mood
Song structure
Rhyme style
Explicit content filter
User instructions

Allow custom lyrics.
Example structure:
[Intro]
[Verse 1]
[Pre-Chorus]
[Chorus]
[Verse 2]
[Bridge]
[Final Chorus]
[Outro]

Allow users to edit lyrics before music generation.
Important:
Do not intentionally reproduce copyrighted lyrics.
Implement copyright-safe generation policies.

---

# 10. MUSIC GENERATION ENGINE
Build an abstraction layer:
MusicEngine

The application must NOT hard-code itself to one AI provider.
Create provider interface:
generateMusic()
continueMusic()
extendMusic()
generateInstrumental()
generateVariation()
generateSection()
Each provider must implement this interface.

Example architecture:
AI_PROVIDER=provider_name
Supported provider types:
* Self-hosted open-source model
* External music generation API
* Future custom SAM model

The backend should allow switching models without changing frontend code.

---

# 11. MODEL ROUTER
Create:
ModelRouter
Responsibilities:
* Select model
* Check availability
* Check GPU capacity
* Check user plan
* Estimate generation cost
* Queue task
* Retry failed jobs
* Route to fallback provider

Example:
FREE → lower-cost model
PRO → high-quality model
PREMIER → highest-quality model

Admin should be able to configure model routing.

---

# 12. GPU JOB SYSTEM
Music generation is asynchronous.
Architecture:
Frontend
↓
API
↓
Redis Queue
↓
Worker
↓
GPU Model Server
↓
Object Storage
↓
Database
↓
WebSocket
↓
Frontend

Implement job states:
QUEUED
PROCESSING
GENERATING
POST_PROCESSING
UPLOADING
COMPLETED
FAILED
CANCELLED
Allow retry.

---

# 13. AUDIO STORAGE
Do not store large audio files directly inside PostgreSQL.
Use object storage.
Compatible with:
* S3
* Cloudflare R2
* Backblaze B2
* MinIO

Store:
audio URL
duration
format
sample rate
channels
file size
waveform metadata
BPM
key
stems

---

# 14. AUDIO PLAYER
Create a professional audio player.
Features:
Play
Pause
Seek
Volume
Mute
Loop
Waveform
Current time
Duration
Playback speed
Keyboard shortcuts
A/B section playback
Waveform zoom

---

# 15. BROWSER MUSIC STUDIO
Create:
/studio/:projectId

Layout:
TOP:
Project name
Save
Undo
Redo
Export
Share
CENTER:
Timeline
Waveforms
MIDI regions
Automation
Markers
BOTTOM:
Mixer
Track controls
Effects
Master channel
LEFT:
Track list
RIGHT:
Inspector

---

# 16. MULTI-TRACK TIMELINE
Tracks:
Vocals
Drums
Bass
Guitar
Piano
Strings
Synth
FX
Custom

Each track supports:
Mute
Solo
Volume
Pan
Arm
Lock
Color
Rename
Delete
Duplicate
Freeze

---

# 17. WAVEFORM EDITOR
Implement:
* Cut
* Split
* Trim
* Move
* Duplicate
* Fade in
* Fade out
* Crossfade
* Time stretch
* Pitch shift
* Reverse
* Normalize
* Gain
* Silence
* Region selection

Use Web Audio API where appropriate.
Heavy processing should happen server-side.

---

# 18. STEM SEPARATION
Create:
/stems
Upload audio.
Generate:
* Vocals
* Drums
* Bass
* Guitar
* Piano
* Other
Model must be configurable.
Show individual stem tracks.
Allow:
Mute
Solo
Download
Edit
Replace
Recombine
Export.

---

# 19. AI VOCAL SYSTEM
Create:
/voices
Users can create authorized voice profiles.
Flow:
Record/upload voice
↓
Consent confirmation
↓
Voice preprocessing
↓
Voice embedding/profile
↓
Secure storage
↓
Voice generation
Only allow voices the user owns or has explicit permission to use.
Do not provide celebrity impersonation or unauthorized voice cloning.

Voice profile controls:
Name
Language
Tone
Range
Style
Default voice

---

# 20. VOCAL GENERATION
Inputs:
Lyrics
Voice profile
Emotion
Style
Pitch
Energy
Timing

Output:
Dry vocal
Processed vocal
Vocal stems
Allow regeneration of selected sections.

---

# 21. AI VOICE SAFETY
Implement:
* Voice ownership confirmation
* Consent checkbox
* Abuse reporting
* Voice deletion
* Account ownership
* Generation logs
* Watermark/metadata option
* Rate limits
* Suspicious usage monitoring

Never allow users to upload a voice and falsely claim it belongs to someone else.

---

# 22. AI REMIX
Allow:
Upload song
Select section
Describe transformation.
Examples:
"Make the chorus more energetic."
"Turn this into an acoustic version."
"Add cinematic strings."
"Convert the instrumental into a lo-fi arrangement."
Generate a new version.
Always preserve original project.

---

# 23. SONG EXTENSION
Allow user to select the ending of an existing song.
Button:
EXTEND
Options:
15 sec
30 sec
60 sec
Custom
AI should continue:
tempo
key
instrumentation
arrangement
vocal style

---

# 24. SECTION REPLACEMENT
User selects a region.
Button:
REGENERATE SECTION
Prompt:
"Replace this chorus with a more powerful emotional chorus."
Generate replacement.
Keep original region.
Allow A/B comparison.

---

# 25. VARIATIONS
For every generated song:
Generate Variation
Options:
* Same melody
* Different arrangement
* Different instrumentation
* More energetic
* More emotional
* Acoustic
* Cinematic
* Electronic

---

# 26. MIDI SYSTEM
Implement MIDI import/export.
MIDI editor:
* Piano roll
* Notes
* Velocity
* Quantization
* Tempo
* Key
* Transpose
* Copy/paste
* Snap
* Note length
Support MIDI export.

---

# 27. VIRTUAL INSTRUMENTS
Create plugin-style architecture.
Instrument categories:
Piano
Synth
Bass
Drums
Strings
Pads
Guitar
Percussion

Each instrument should expose:
Preset
Volume
Pan
Attack
Decay
Sustain
Release
Filter
Resonance

---

# 28. AUDIO EFFECTS
Create effect chain:
EQ
Compressor
Limiter
Reverb
Delay
Chorus
Distortion
Saturation
Noise Gate
De-esser
Pitch
Stereo Width

Each effect:
Enable/disable
Parameters
Presets
Automation

---

# 29. MIXER
Mixer channels should include:
Volume
Pan
Mute
Solo
Meter
EQ
Effects
Sends
Automation
Master channel.

Master:
EQ
Compression
Limiter
Loudness meter
Export master.

---

# 30. AI MIXING
Button:
AI MIX
AI analyzes:
* Frequency balance
* Loudness
* Stereo image
* Dynamics
* Clipping
* Noise

Then recommends or applies:
EQ
Compression
Volume balancing
Stereo correction
Master limiting
Show before/after.
Never overwrite original mix automatically.

---

# 31. AI MASTERING
Input:
Stereo mix
Options:
Streaming
YouTube
Film
Podcast
CD
Custom LUFS target
Generate master.
Export:
WAV
MP3
FLAC

---

# 32. SOUND LIBRARY
Create:
/sounds
Categories:
Drums
Bass
Loops
Percussion
FX
Ambience
Synth
Guitar
Piano
Vocals
Allow:
Search
Filter
Preview
Favorite
Add to project
Download where license permits.
Include licensing metadata for every sound.

---

# 33. PROJECT MANAGEMENT
Project fields:
id
user_id
title
description
genre
language
tempo
key
duration
cover_image
status
created_at
updated_at
deleted_at

Projects support:
Duplicate
Rename
Delete
Restore
Archive
Share
Export

---

# 34. VERSION CONTROL
Every major edit should create project versions.
Example:
Version 1
Version 2
Version 3
Allow:
Restore
Compare
Duplicate
Never destroy the original generated asset unless explicitly requested.

---

# 35. COMMUNITY
Create optional community section.
Users can publish:
Songs
Instrumentals
Projects
Playlists
Profiles
Features:
Like
Comment
Follow
Share
Remix with permission
Report
Privacy:
Public
Unlisted
Private

---

# 36. DISCOVER
Discover page:
Trending
New
Popular
Recommended
Genres
Mood
Language
Creators
Use audio previews.
Infinite scroll.
Search.

---

# 37. PLAYLISTS
Users can create playlists.
Features:
Create
Rename
Delete
Add song
Remove song
Reorder
Public/private

---

# 38. CREDIT SYSTEM
Every AI operation consumes credits.
Database:
credits
credit_transactions
generation_costs
subscriptions
payments
Example:
Music generation → X credits
Stem separation → X credits
Voice generation → X credits
Mastering → X credits
Admin can change costs.
Never hard-code pricing into frontend.
Backend must validate credit balance.
Use database transactions to prevent double spending.

---

# 39. SUBSCRIPTIONS
Plans:
FREE
PRO
PREMIER
Create configurable limits:
Monthly credits
Max generation length
Concurrent generations
Stem downloads
Voice profiles
Storage
Export quality
Commercial rights metadata
Admin can change plan limits.

---

# 40. PAYMENT SYSTEM
Create payment abstraction:
PaymentProvider
Methods:
createCheckout()
verifyPayment()
handleWebhook()
refund()
subscriptionStatus()
Do not hard-code one payment provider.
Support future providers.
For Sri Lankan deployment, keep architecture compatible with local payment gateways.

---

# 41. ADMIN PANEL
Create professional admin dashboard.
Metrics:
Users
Active users
Songs generated
GPU usage
Credits consumed
Revenue
Failed jobs
Storage
Bandwidth
Model performance
Top genres
Top users

---

# 42. ADMIN MODEL MANAGEMENT
Admin can:
Add model
Disable model
Set priority
Set provider
Set credit cost
Set max duration
Set user-plan access
View health
View latency

---

# 43. ADMIN GENERATION MONITOR
Show:
Job ID
User
Model
Duration
Status
GPU
Started
Completed
Error
Retry
Admin can cancel/retry failed jobs.

---

# 44. DATABASE
Use PostgreSQL.
Core tables:
users
profiles
subscriptions
plans
credits
credit_transactions
projects
project_versions
tracks
audio_assets
generations
generation_jobs
generation_outputs
stems
voices
voice_generations
lyrics
songs
playlists
playlist_items
likes
comments
follows
sounds
sound_license
payments
payment_events
notifications
reports
admin_logs
model_providers
models
system_settings

---

# 45. API DESIGN
Use REST API initially.
Structure:
/api/v1/auth
/api/v1/users
/api/v1/projects
/api/v1/generations
/api/v1/music
/api/v1/lyrics
/api/v1/voices
/api/v1/stems
/api/v1/studio
/api/v1/midi
/api/v1/sounds
/api/v1/playlists
/api/v1/community
/api/v1/subscriptions
/api/v1/payments
/api/v1/admin

---

# 46. REAL-TIME SYSTEM
Use WebSocket or Server-Sent Events.
Events:
generation.started
generation.progress
generation.completed
generation.failed
export.started
export.completed
notification.created
Use real-time UI updates.

---

# 47. NOTIFICATION SYSTEM
Notifications:
Generation complete
Generation failed
Credits low
Subscription renewed
Payment successful
Project shared
Comment
Like
Follow

---

# 48. SEARCH
Implement global search.
Search:
Songs
Projects
Users
Sounds
Voices
Genres
Tags
Use PostgreSQL full-text search initially.
Architecture should allow future Elasticsearch/OpenSearch.

---

# 49. SECURITY
Implement:
Rate limiting
CSRF protection where applicable
CORS
Input validation
SQL injection prevention
XSS protection
Secure cookies
Encryption
Password hashing
RBAC
Audit logs
Signed download URLs
Private storage
Webhook signature verification
API key encryption
Never expose:
Database credentials
AI provider keys
Storage secret keys
Payment secret keys

---

# 50. COPYRIGHT / CONTENT SAFETY
Implement safeguards.
Do not intentionally generate copyrighted songs by asking for exact imitation.
Do not provide:
"Make this exactly like [living artist]."
Instead transform into generic musical characteristics.
Example:
BAD:
"Make this exactly like Artist X."
GOOD:
"Create an energetic modern Tamil pop track with bright synths, punchy drums and emotional male vocals."
Also prevent unauthorized voice cloning.

---

# 51. FILE UPLOAD SECURITY
Allowed formats:
WAV
MP3
FLAC
M4A
OGG
MIDI
Validate:
MIME type
File extension
File size
Duration
Audio codec
Scan uploads.
Generate safe filenames.
Never trust user-provided filenames.

---

# 52. STORAGE ARCHITECTURE
Separate:
original/
generated/
stems/
masters/
projects/
avatars/
covers/
voices/
Use signed URLs.
CDN for audio delivery.
Generate waveform previews.

---

# 53. AUDIO PROCESSING WORKERS
Create dedicated workers:
MusicWorker
StemWorker
VocalWorker
MixWorker
MasterWorker
ExportWorker
Use queue-based architecture.
Workers should be independently scalable.

---

# 54. OBSERVABILITY
Implement:
Structured logging
Error tracking
Metrics
Job latency
GPU utilization
Queue depth
API latency
Storage usage
Generation success rate
Create admin health dashboard.

---

# 55. PERFORMANCE
Frontend:
Lazy loading
Code splitting
Audio streaming
Virtualized timeline
Optimized waveform rendering
Caching
CDN
Backend:
Connection pooling
Redis caching
Async workers
Database indexes
Object storage
Do not load entire audio files unnecessarily.

---

# 56. MOBILE RESPONSIVENESS
The web application must work on:
Desktop
Tablet
Mobile
Desktop Studio is the primary experience.
Mobile should provide:
Create
Preview
Library
Projects
Basic editing
Sharing

---

# 57. PWA
Implement PWA.
Features:
Installable
Offline shell
Push notifications
Responsive UI
App icon
Splash screen

---

# 58. ACCESSIBILITY
Support:
Keyboard navigation
ARIA
Focus states
Screen readers
Readable contrast
Reduced motion
Accessible controls

---

# 59. INTERNATIONALIZATION
Prepare i18n.
Languages:
English
Tamil
Sinhala
Hindi
Language selector.
Do not hard-code UI strings.

---

# 60. AI PROVIDER ABSTRACTION
Create:
/ai
/providers
/music
/vocal
/stem
/lyrics
/mastering
Each AI provider must be replaceable.
Example interface:
MusicProvider
LyricsProvider
VocalProvider
StemProvider
MasteringProvider
Never couple UI directly to an AI provider.

---

# 61. SELF-HOSTED AI SUPPORT
Design the system so future GPU servers can host models.
Example:
Frontend
↓
API Gateway
↓
AI Router
↓
GPU Worker
↓
Model Server

Potential infrastructure:
Docker
NVIDIA CUDA
GPU workers
Redis
PostgreSQL
S3-compatible storage
Nginx
Prometheus
Grafana

---

# 62. MODEL CONFIGURATION
Create admin-configurable model registry.
Fields:
name
provider
endpoint
model_type
version
enabled
priority
max_duration
cost_per_generation
supported_languages
supported_features
health_status

---

# 63. EXPORT SYSTEM
Export:
MP3
WAV
FLAC
Stems ZIP
MIDI
Lyrics TXT
Project JSON
Project ZIP
Export settings:
Sample rate
Bit depth
Bitrate
Normalization
Loudness

---

# 64. SHARE SYSTEM
Generate share URLs:
/s/:songId
Privacy:
Public
Unlisted
Private
Open Graph metadata.
Social preview image.
Embedded player.

---

# 65. ANALYTICS
Track:
Generation started
Generation completed
Generation failed
Play
Pause
Download
Share
Remix
Favorite
Export
Subscription conversion
Do not collect unnecessary personal data.

---

# 66. ERROR HANDLING
Never show technical stack traces to users.
Use friendly messages.
Example:
"Music generation is temporarily busy. Your request is still in the queue."
Provide:
Retry
Cancel
Contact support

---

# 67. EMPTY STATES
Every page needs professional empty states.
Example:
"No projects yet."
Button:
"Create your first song"

---

# 68. LOADING STATES
Use skeletons and progress indicators.
Music generation should show meaningful stages:
Analyzing prompt
Creating arrangement
Generating audio
Generating vocals
Mixing
Mastering
Preparing preview

---

# 69. FRONTEND TECH STACK
Preferred:
Next.js
TypeScript
Tailwind CSS
shadcn/ui
React
Web Audio API
Waveform library
State management using Zustand or equivalent.
Use strong TypeScript typing.
No unnecessary dependencies.

---

# 70. BACKEND TECH STACK
Preferred:
Python
FastAPI
PostgreSQL
Redis
Celery/RQ or equivalent queue
Object storage
WebSocket
Docker

---

# 71. AI SERVICE
Keep AI inference separate from main API.
Example:
api-server
ai-router
music-worker
vocal-worker
stem-worker
audio-worker
notification-worker
This allows independent scaling.

---

# 72. DOCKER
Create Dockerfiles for:
frontend
backend
worker
AI service
Create:
docker-compose.yml
for local development.

---

# 73. ENVIRONMENT VARIABLES
Create:
DATABASE_URL
REDIS_URL
STORAGE_ENDPOINT
STORAGE_BUCKET
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
JWT_SECRET
AI_PROVIDER_KEY
PAYMENT_SECRET
PAYMENT_WEBHOOK_SECRET
NEXT_PUBLIC_API_URL
Never commit .env.
Create:
.env.example

---

# 74. API DOCUMENTATION
Generate OpenAPI documentation.
Every endpoint must include:
Request
Response
Errors
Authentication
Example

---

# 75. TESTING
Create:
Unit tests
Integration tests
API tests
Authentication tests
Credit tests
Payment tests
Generation queue tests
File upload tests
Permission tests
E2E tests

Critical flows:
Signup
Login
Create project
Generate music
Credit deduction
Generation completion
Export
Payment
Subscription
Admin controls

---

# 76. SEED DATA
Create development seed data:
Demo users
Demo songs
Demo projects
Demo sounds
Demo genres
Demo plans
Demo models
Do not use copyrighted commercial songs as seed assets.

---

# 77. DEVELOPMENT PHASES
Do NOT attempt to build everything in one step.
Build sequentially.

PHASE 1:
Authentication
Database
Dashboard
Projects
Basic UI

PHASE 2:
Prompt-based music generation
Job queue
Audio storage
Audio player

PHASE 3:
Lyrics
Generation history
Credits
Plans

PHASE 4:
Audio upload
Stem separation
Basic editor

PHASE 5:
Studio timeline
Mixer
Effects

PHASE 6:
Voice profiles
Vocal generation

PHASE 7:
MIDI
Virtual instruments

PHASE 8:
AI mixing
AI mastering

PHASE 9:
Community
Discover
Playlists

PHASE 10:
Admin
Analytics
Billing
Production hardening

---

# 78. IMPORTANT IMPLEMENTATION RULE
If an AI music model is not available in the current environment:
DO NOT fake music generation.
Instead:
1. Build the complete provider interface.
2. Build mock provider for development.
3. Clearly mark mock output.
4. Make real provider integration configurable.
5. Document exactly where the real model/API should be connected.
Never pretend a fake audio file is AI-generated.

---

# 79. UI QUALITY REQUIREMENT
The UI must look like a real premium music-production SaaS.
Avoid:
* Generic template appearance
* Excessive cards
* Amateur gradients
* Huge unnecessary text
* Broken spacing
* Fake buttons
* Placeholder lorem ipsum

Use:
* Consistent spacing
* Professional typography
* Smooth transitions
* Proper hover states
* Context menus
* Keyboard shortcuts
* Responsive layouts
* Real loading states
* Real error states

---

# 80. FINAL ACCEPTANCE CRITERIA
The application is complete only when:
✓ User can register
✓ User can login
✓ User can create project
✓ User can enter music prompt
✓ User can generate lyrics
✓ User can submit music generation
✓ Generation runs asynchronously
✓ User sees progress
✓ Generated audio can be played
✓ Audio is saved
✓ Credits are deducted safely
✓ User can rename/delete projects
✓ User can upload audio
✓ User can separate stems
✓ User can edit tracks
✓ User can export audio
✓ User can create voice profiles with consent
✓ User can generate vocals
✓ User can use studio timeline
✓ Admin can manage users
✓ Admin can manage models
✓ Admin can manage credits
✓ Admin can view generation jobs
✓ Payment architecture exists
✓ Security checks exist
✓ Tests exist
✓ Docker setup works
✓ Production environment variables are documented
✓ No secret keys are exposed
✓ No copyrighted assets are bundled
✓ No proprietary Suno code/UI/assets are copied

---

# 81. MOST IMPORTANT PRODUCT PRINCIPLE
SAM Music AI should not simply be:
"Type prompt → download song."
It should become:
# "YOUR AI MUSIC STUDIO"

The user should be able to start with:
IDEA
and finish with:
PROFESSIONAL SONG
inside one platform.

Build the architecture so the AI model can be upgraded later without rewriting the application.
Start with a working MVP, then progressively implement advanced DAW and AI capabilities.
Before writing large amounts of code, create the project architecture, database schema, API contracts and implementation plan.
Then implement Phase 1 completely.
After Phase 1 passes tests, proceed to Phase 2.
Do not leave broken placeholder functionality.
Every implemented button must either work or clearly indicate that the feature is coming soon.
