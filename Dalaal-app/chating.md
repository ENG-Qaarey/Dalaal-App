# Chat System

## Overview
Custom-built chat system (no third-party SDK). Uses **Socket.IO** for real-time, **REST API** for persistence, **WebRTC** for audio/video calls, **Zustand** for state management.

---

## Architecture

```
Socket.IO (real-time)  ←→  Node.js Backend (:3002)
REST API (CRUD)        ←→  Express Backend
WebRTC (calls)         ←→  Google STUN server

State: Zustand store  →  AsyncStorage persistence
Navigation: Expo Router (file-based routing)
```

---

## File Structure

```
src/
├── app/
│   ├── (tabs)/chat.tsx              # Chat List screen
│   ├── chat/[id]/index.tsx          # Conversation screen
│   ├── chat/user-content.tsx        # User profile from chat
│   └── chat/new-chat.tsx            # Placeholder
├── components/chat/
│   ├── ChatList.tsx                  # Conversation preview list
│   ├── ChatWindow.tsx                # Message feed / bubble list
│   ├── ChatComposer.tsx              # Input bar
│   ├── ConversationHeader.tsx        # Header (avatar, name, call)
│   ├── ChatCameraModal.tsx           # Full-screen camera
│   ├── ChatMediaPreviewModal.tsx     # Preview images before sending
│   └── CallSessionModal.tsx          # Call overlay
│   ├── ChatComponents/
│   │   ├── MessageText.tsx           # Text bubble + time + status
│   │   ├── MessageMedia.tsx          # Image/video thumbnail
│   │   ├── MessageAudio.tsx          # Voice message play/pause
│   │   ├── MessageFile.tsx           # File attachment chip
│   │   ├── MessageSystem.tsx         # Date separators + call logs
│   │   ├── MessageMenu.tsx           # Long-press context menu
│   │   └── MediaViewer.tsx           # Full-screen media gallery
│   └── CallComponents/
│       ├── CallVideoView.tsx         # WebRTC video streams
│       ├── CallIncomingActions.tsx   # Accept/Decline buttons
│       ├── CallHeader.tsx            # Caller name + status
│       ├── CallControls.tsx          # Control bar
│       └── CallAvatar.tsx            # Large avatar + timer
├── services/
│   ├── chat.ts                       # REST API calls
│   ├── socket.ts                     # Socket.IO singleton
│   └── webrtc.ts                     # WebRTC management
├── store/
│   └── chatStore.ts                  # Zustand store
└── constants/theme.ts                # Colors
```

---

## Screen Flow

```
Tab Bar → Chat Tab (chat.tsx)
            ├── Chat List (FlatList)
            │     ├── Search bar + filter chips (All/Unread/Active)
            │     └── Tap → /chat/[id]
            │
            ├── Conversation (chat/[id]/index.tsx)
            │     ├── ConversationHeader
            │     ├── ChatWindow (message bubbles)
            │     ├── ChatComposer (text, mic, attach, camera)
            │     ├── ChatCameraModal
            │     ├── ChatMediaPreviewModal
            │     └── CallSessionModal
            │
            ├── User Profile (chat/user-content.tsx)
            └── New Chat (placeholder)
```

---

## State Management (Zustand)

### Store Shape
- `chats: ChatListItem[]` — all conversations with preview info
- `messages: Record<conversationId, StoredMessage[]>` — messages per conversation
- `isLoading` — loading flag
- `activeConversationId` — currently open conversation

### Key Actions
- `fetchConversations()` — GET from REST API
- `applyIncomingMessage()` — central handler: updates preview, unread, reorders list
- `startChatWithUser()` — checks existing or creates new via REST
- `markConversationRead()` — reset unread to 0
- `updatePresence()` — set online/offline + lastSeen
- `incrementUnread()` — for incoming when not active

### Persistence
- Chats + messages persisted to AsyncStorage key `dalaal-chat-storage`
- On logout: cleared + `reset()`

---

## Real-Time (Socket.IO)

### Connection
- Singleton `SocketService` in `socket.ts`
- Connect with JWT from SecureStore
- Transport: WebSocket only, reconnection up to 5 attempts
- On connect: emits `join { userId }`

### Global Listeners (_layout.tsx)
| Event | Action |
|-------|--------|
| `newMessage` | `applyIncomingMessage()` + Alert notification |
| `messageDeleted` | Refresh preview |
| `presence:update` | `updatePresence()` |
| `session:revoked` | Force logout |
| AppState change | Connect/disconnect |

### Per-Conversation Listeners (chat/[id]/index.tsx)
| Event | Action |
|-------|--------|
| `newMessage` | Dedup, replace temp, append |
| `messageDelivered` | Status → 'delivered' |
| `messageRead` | Status → 'read' |
| `messageDeleted` | Remove from list |
| `userTyping` | Show/hide typing indicator |
| `call:*` | Manage call state |

### Client Events
- `join`, `sendMessage`, `markRead`, `typing`
- `call:start`, `call:accept`, `call:decline`, `call:end`
- `webrtc:offer`, `webrtc:answer`, `webrtc:ice-candidate`

---

## Data Flow

### Sending
```
Type + send (or attach image/file)
  → ChatComposer.onSend()
    → 1. tempId = `temp_${Date.now()}`
    → 2. Local message status: 'sending' (optimistic)
    → 3. Add to messages list
    → 4. Stop typing
    → 5. applyIncomingMessage() → store preview
    → 6. Socket.sendMessage() (or REST fallback)
      → Server saves, broadcasts
        → Socket 'newMessage' back:
          → Global: applyIncomingMessage()
          → Per-conversation: replace temp, status → 'sent'
```

### Message Status Flow
```
sending → sent → delivered → read
```

### Receiving
```
Server broadcasts 'newMessage'
  → Global: applyIncomingMessage(), Alert
  → Per-conversation: dedup → build → sort → append → markRead
```

### Voice Recording
```
Hold mic (PanResponder)
  → Hold ≥ 180ms → startVoiceRecording()
    → Request mic permission
    → Audio.Recording.createAsync()
    → Timer + visual indicators
  → Slide up > 38px → lock
  → Slide left < -55px → cancel
  → Release → audioUri + duration → add message
```

---

## Calls (WebRTC)

### Outgoing
```
Tap Audio/Video in header
  → Request permissions
  → RTCPeerConnection + get local stream
  → socket.call:start
  → 45s timeout → end if not accepted
  → On accepted: offer/answer/ICE → ongoing
```

### Incoming
```
Socket 'call:incoming'
  → Check not already in call
  → Show CallSessionModal (ringing)
  → Play ringtone + vibration
  → Accept: WebRTC + socket.acceptCall()
  → Decline: socket.declineCall()
  → Hangup: socket 'call:ended'
```

---

## Supported Message Types
| Type | Component | Content |
|------|-----------|---------|
| Text | `MessageText` | String + timestamp + status icons |
| Image | `MessageMedia` | Thumbnail 180×180, tap for full-screen |
| Video | `MessageMedia` | Video chip, tap for player |
| File | `MessageFile` | Document icon + filename |
| Voice | `MessageAudio` | Play/pause with duration |
| System | `MessageSystem` | Date separators, call logs |

---

## Styling

### Chat List Screen (`(tabs)/chat.tsx`)

```
┌──────────────────────────────────────────┐
│  Messages                                │
│  Stay connected with your listings       │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ 🔍 Search chats, names, or topics│    │
│  └──────────────────────────────────┘    │
│                                          │
│  [All]  [Unread]  [Active]              │
│                                          │
│  Recent chats                    3 conv  │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ [A]  Alice Johnson         now   │    │
│  │      Hey! Are you still...       │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ [B]  Bob Smith     Online        │    │
│  │      Agent • Online               │    │
│  │      See you tomorrow             │  2 │
│  └──────────────────────────────────┘    │
│                                          │
│  ...                                     │
└──────────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Screen | `SafeAreaView`, `edges={['left','right']}`, bg `C.surface` |
| Header | `paddingHorizontal: 14`, `paddingBottom: 10`, `flexDirection: 'row'`, `justifyContent: 'space-between'` |
| Title | `fontSize: 18`, `fontWeight: '900'`, color `C.textMain` |
| Subtitle | `fontSize: 10`, color `C.textMuted` |
| Header icons | `32×32`, `borderRadius: 10`, `borderWidth: 1`, bg `C.tableRow` |
| Search bar | `height: 42`, `borderRadius: 12`, `borderWidth: 1`, `paddingHorizontal: 10`, bg `C.tableRow` |
| Search input | `fontSize: 12`, `flex: 1` |
| Clear btn | `22×22`, `borderRadius: 7` |
| Filter chips | `paddingHorizontal: 12`, `paddingVertical: 6`, `borderRadius: 999`, `borderWidth: 1`, `gap: 8` |
| Active filter | bg `C.brandBlue`, border `C.brandBlueDark`, text `C.surface` |
| Inactive filter | bg `C.tableRow`, border `C.brandBorder`, text `C.textMain` |
| Filter text | `fontSize: 10`, `fontWeight: '800'` |
| Section title | `fontSize: 13`, `fontWeight: '900'` |
| Section hint | `fontSize: 10` |
| Notification card | `borderWidth: 1`, `borderRadius: 16`, `paddingHorizontal: 10`, `paddingVertical: 8`, `flexDirection: 'row'` |
| Notif avatar | `46×46`, `borderRadius: 16` |
| Notif name | `fontSize: 20`, `fontWeight: '900'`, `maxWidth: '80%'` |
| Notif time | `fontSize: 12`, `fontWeight: '700'` |
| Notif message | `fontSize: 14`, `fontWeight: '600'` |
| Content padding bottom | `110 + insets.bottom` |

---

### Chat List Items (`ChatList.tsx`)

```
┌─────────────────────────────────────┐
│ ┌──────┐                            │
│ │ [AV] │  Alice Johnson    12:30   │
│ │  ●   │  Agent • Online           │
│ └──────┘  Hey! Are you still...  2 │
└─────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Card | `flexDirection: 'row'`, `borderWidth: 1`, `borderRadius: 14`, `padding: 10`, `shadowOpacity: 0.06`, `elevation: 2`, bg `C.surface` |
| Avatar | `50×50`, `borderRadius: 16`, bg `C.tableRow` |
| Initials | `fontSize: 14`, `fontWeight: '900'` |
| Online dot | `8×8`, `borderRadius: 999`, `position: 'absolute'`, `right: 6`, `top: 6`, bg `C.brandOrange` |
| Name | `fontSize: 12`, `fontWeight: '900'` |
| Star (pinned) | `fontSize: 12`, color `C.brandOrange`, `marginLeft: 6` |
| Time | `fontSize: 9` |
| Role/status | `fontSize: 9`, `marginTop: 2` |
| Message preview | `fontSize: 10`, `fontWeight: '700'`, `marginTop: 4` |
| Unread badge | `minWidth: 20`, `height: 20`, `borderRadius: 10`, `paddingHorizontal: 6`, bg `C.brandBlue` |
| Unread text | `fontSize: 10`, `fontWeight: '900'`, color `C.surface` |
| Read checkmark | `checkmark-done` icon, `14`, color `C.textMuted` |
| Gap between cards | `gap: 10` |

---

### Conversation Screen (`chat/[id]/index.tsx`)

```
┌──────────────────────────────────────────┐
│  ← [A] Alice Johnson     [Call ▾]       │
│     Online • Agent                       │
├──────────────────────────────────────────┤
│                                          │
│              ┌──────────┐                │
│              │  Today    │                │
│              └──────────┘                │
│                                          │
│             ┌──────────────────────┐     │
│             │ Hey, are you free?   │     │
│             │            12:30  ✓  │     │
│             └──────────────────────┘     │
│                                          │
│  ┌──────────────────────┐                │
│  │ Yes, I am!      ✓✓   │                │
│  │             12:31     │                │
│  └──────────────────────┘                │
│                                          │
│                              ┌──┐        │
│                              │⬇│        │
│                              └──┘        │
├──────────────────────────────────────────┤
│  [📎] [┌─ Type a message ─┬ 📷┐] [🎤]  │
└──────────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Screen | `SafeAreaView`, `flex: 1`, bg `C.surface` |
| Body | `flex: 1` (fills between header and composer) |
| Keyboard | `KeyboardAvoidingView`, `behavior: 'padding'` (iOS) / `'height'` (Android) |

---

### ConversationHeader (`ConversationHeader.tsx`)

```
┌──────────────────────────────────────┐
│  ←  [A] Alice Johnson   [Call ▾]   │
│      Online • Agent                 │
│      ┌────────────────┐              │
│      │ 📞 Audio Call  │              │
│      │ 📹 Video Call  │   (dropdown) │
│      └────────────────┘              │
└──────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Container | `height: 68`, `borderBottomWidth: 1`, `flexDirection: 'row'`, `alignItems: 'center'`, `paddingHorizontal: 10`, `gap: 8` |
| Back btn | `32×32`, `borderRadius: 999`, bg `C.tableRow` |
| Avatar wrap | `38×38`, `borderRadius: 13`, `overflow: 'hidden'`, `marginRight: 9` |
| Avatar fallback | `fontSize: 14`, `fontWeight: '900'` |
| Online dot | `8×8`, `borderRadius: 999`, `borderWidth: 1.5`, `borderColor: '#fff'`, absolute `right: 2`, `bottom: 2`, bg `#1cc96c` (online) / `C.textMuted` (offline) |
| User name | `fontSize: 13`, `fontWeight: '900'` |
| User meta | `fontSize: 10`, `marginTop: 1` |
| Call btn | `minWidth: 84`, `height: 34`, `borderRadius: 10`, `borderWidth: 1`, `paddingHorizontal: 10`, bg `C.tableRow` |
| Call btn text | `fontSize: 12`, `fontWeight: '800'`, `marginHorizontal: 6` |
| Dropdown | `position: 'absolute'`, `top: 38`, `right: 0`, `width: 144`, `borderWidth: 1`, `borderRadius: 10`, `paddingVertical: 6`, `zIndex: 10`, `shadowOpacity: 0.12`, `elevation: 3` |
| Dropdown row | `height: 36`, `paddingHorizontal: 10`, `flexDirection: 'row'`, `alignItems: 'center'` |
| Dropdown text | `fontSize: 12`, `fontWeight: '700'`, `marginLeft: 8` |

---

### ChatWindow (`ChatWindow.tsx`)

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │  Today   │              │
│            └─────────┘              │
│                                     │
│  ┌─────────────────────────┐        │
│  │ Hey, are you free?      │        │
│  │         12:30  ✓✓  ★   │        │
│  └─────────────────────────┘        │
│                                     │
│        ┌──────────────────────┐     │
│        │ Yes, I am!           │     │
│        │          12:31  ✓    │     │
│        └──────────────────────┘     │
│                          ★ (reaction)│
│                                     │
│                                     │
│                         ┌──┐        │
│                         │⬇│        │
│                         └──┘        │
└─────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Container | `padding: 12`, `paddingBottom: 8`, `minWidth: '100%'` |
| Row | `marginBottom: 8`, `flexDirection: 'row'`, `width: '100%'` |
| Own msg | `justifyContent: 'flex-end'` |
| Other msg | `justifyContent: 'flex-start'` |
| Column | `maxWidth: '80%'`, `position: 'relative'`, `paddingTop: 10` |
| Own column | `alignItems: 'flex-end'` |
| Other column | `alignItems: 'flex-start'` |
| Bubble | `borderWidth: 1`, `borderRadius: 14`, `paddingHorizontal: 10`, `paddingVertical: 8`, `flexShrink: 1`, `flexWrap: 'wrap'`, `overflow: 'hidden'` |
| Own bubble | bg `#60A5FA`, border `#3B82F6` |
| Other bubble | bg `C.tableRow`, border `C.brandBorder` |
| Meta row | `marginTop: 5`, `flexDirection: 'row'`, `alignItems: 'center'`, `justifyContent: 'flex-end'`, `alignSelf: 'flex-end'`, `minHeight: 16` |
| Time text | `fontSize: 10`, `marginRight: 3`, `lineHeight: 12` |
| Reaction bubble | `position: 'absolute'`, `minWidth: 28`, `height: 24`, `borderRadius: 12`, `borderWidth: 1.5`, `paddingHorizontal: 4`, `right: 4`, `bottom: -8`, bg `#111827`, border `#374151`, `zIndex: 10`, `elevation: 4` |
| Scroll-to-bottom | `position: 'absolute'`, `right: 8`, `bottom: 8` |
| Scroll btn | `36×36`, `borderRadius: 18`, bg `C.brandBlue`, shadow |
| Loading more | `padding: 10`, `alignItems: 'center'`, `fontSize: 12`, color `#888` |

---

### Message Text (`MessageText.tsx`)

```
┌─────────────────────┐
│ Hey, are you free?  │
│          12:30  ✓✓  │
└─────────────────────┘
```

| Element | Style |
|---------|-------|
| Text | `fontSize: 13`, `fontWeight: '700'`, `flexWrap: 'wrap'`, `includeFontPadding: false` |
| Own text color | `C.surface` |
| Other text color | `C.textMain` |
| Row | `marginTop: 2`, `flexDirection: 'row'`, `alignItems: 'flex-end'`, `justifyContent: 'flex-end'`, `gap: 6` |
| Meta | `flexDirection: 'row'`, `alignItems: 'center'`, `gap: 3`, `paddingBottom: 1` |
| Time | `fontSize: 10`, `lineHeight: 12` |
| Own time color | `C.surface + 'CC'` |
| Other time color | `C.textMuted` |
| Status icon | `fontSize: 13` |
| Sent/delivered | `checkmark`, color `C.surface + 'CC'` |
| Read | `checkmark-done`, color `#7DD3FC` |
| Link (markdown) | `textDecorationLine: 'underline'`, `fontWeight: '900'` |
| Link own | color `#fff` |
| Link other | color `C.brandBlue` |

---

### Message Media (`MessageMedia.tsx`)

```
┌──────────────┐
│  (image)     │
│   180×180    │
└──────────────┘

┌──────────────────┐
│ ▶ Video          │
└──────────────────┘
```

| Element | Style |
|---------|-------|
| Image thumbnail | `width: 180`, `height: 180`, `borderRadius: 10`, `marginBottom: 6` |
| Video chip | `borderWidth: 1`, `borderRadius: 10`, `paddingHorizontal: 10`, `paddingVertical: 8`, `flexDirection: 'row'`, `gap: 8`, `marginTop: 4` |
| Own video border | `C.surface + '55'` |
| Other video border | `C.brandBorder` |
| Video text | `fontSize: 12`, `fontWeight: '700'` |

---

### Message Audio (`MessageAudio.tsx`)

```
┌──────────────────────────────────┐
│ ▶ Voice message         00:42   │
└──────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Container | `marginTop: 2`, `paddingHorizontal: 10`, `paddingVertical: 8`, `borderRadius: 10`, `borderWidth: 1`, `flexDirection: 'row'`, `gap: 8` |
| Own bg | `C.brandBlueDark` |
| Other bg | `C.surface` |
| Own border | `C.surface + '55'` |
| Other border | `C.brandBorder` |
| Text | `fontSize: 12`, `fontWeight: '700'` |

---

### Message File (`MessageFile.tsx`)

```
┌──────────────────────────┐
│ 📄 document.pdf          │
└──────────────────────────┘
```

| Element | Style |
|---------|-------|
| Container | `marginTop: 4`, `paddingHorizontal: 10`, `paddingVertical: 8`, `borderRadius: 10`, `borderWidth: 1`, `flexDirection: 'row'`, `gap: 8` |
| Own bg | `C.brandBlueDark` |
| Other bg | `C.surface` |
| Text | `fontSize: 12`, `fontWeight: '700'`, `flex: 1` |

---

### Message System (`MessageSystem.tsx`)

```
          ┌──────────┐
          │  Today    │  (date separator)
          └──────────┘

         📞 Call ended  (call log)
          12:30
```

| Element | Style |
|---------|-------|
| Date row | `alignItems: 'center'`, `marginVertical: 6` |
| Date badge | `borderWidth: 1`, `borderRadius: 999`, `paddingHorizontal: 10`, `paddingVertical: 4`, bg `C.tableRow` |
| Date text | `fontSize: 10`, `fontWeight: '700'` |
| Call log row | `alignItems: 'center'`, `marginVertical: 6` |
| Call log | `flexDirection: 'row'`, `gap: 6`, `paddingHorizontal: 12`, `paddingVertical: 6`, `borderRadius: 999`, `borderWidth: 1`, bg `C.tableRow` |
| Call log text | `fontSize: 12`, `fontWeight: '700'` |
| Call log time | `marginTop: 4`, `fontSize: 10`, `fontWeight: '600'` |

---

### Message Menu (`MessageMenu.tsx`)

```
┌──────────────────────────────────────┐
│  👍  ❤️  😂  😮  😢  🙏  +        │
├──────────────────────────────────────┤
│  Reply                        ↩     │
│  Copy                         📋     │
│  Info                         ℹ️     │
│  Star                         ☆     │
│  Delete for me               🗑     │
│  Delete for everyone         🗑     │  (only own msgs)
└──────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Overlay | `flex: 1`, bg `#00000045`, `justifyContent: 'flex-end'`, `paddingHorizontal: 14`, `paddingBottom: 22` |
| Menu wrap | `gap: 8` |
| Reaction bar | `borderWidth: 1`, `borderRadius: 24`, `paddingHorizontal: 8`, `paddingVertical: 6`, `flexDirection: 'row'`, `justifyContent: 'space-around'`, bg `C.surface` |
| Reaction emoji | `fontSize: 22` |
| Action menu | `borderWidth: 1`, `borderRadius: 18`, `overflow: 'hidden'`, bg `C.surface` |
| Action row | `minHeight: 42`, `paddingHorizontal: 14`, `flexDirection: 'row'`, `justifyContent: 'space-between'`, bottom border `hairlineWidth` color `#9CA3AF55` |
| Action text | `fontSize: 16`, `fontWeight: '600'` |
| Delete colors | `#E11D48` (for me), `#DC2626` (for everyone) |

---

### Chat Composer (`ChatComposer.tsx`)

```
┌─────────────────────────────────────────┐
│ ┌ 2 images attached ── 📝 ✖️ ─┐        │  (pending bar)
└─────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ [📎] [┌─ Type a message ─┬ 📷┐] [🎤]  │
└──────────────────────────────────────────┘

During recording:
┌──────────────────────────────────────────┐
│    🔒                                   │  (lock rail)
│    ↑                                    │
│    🎤                                   │
│                                         │
│ [🗑] [┌ 🎤 00:42 slide to cancel ┐]    │
└──────────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Container | `borderTopWidth: 1`, `paddingHorizontal: 10`, `paddingTop: 6`, `paddingBottom: 4`, `gap: 8`, bg `C.surface` |
| Pending bar | `borderWidth: 1`, `borderRadius: 12`, `paddingHorizontal: 10`, `paddingVertical: 8`, `flexDirection: 'row'`, `gap: 8`, bg `C.tableRow` |
| Pending image | `34×34`, `borderRadius: 7` |
| Pending text | `fontSize: 12`, `fontWeight: '700'`, `flex: 1` |
| Side btn | `38×38`, `borderRadius: 11`, `borderWidth: 1`, bg `C.tableRow` |
| Lock rail | `position: 'absolute'`, `right: 8`, `bottom: 44`, `width: 44`, `height: 128`, `borderRadius: 22`, `borderWidth: 1`, `alignItems: 'center'`, `justifyContent: 'space-between'`, `paddingVertical: 10`, bg `C.tableRow` |
| Input wrap | `flex: 1`, `minHeight: 40`, `maxHeight: 110`, `borderWidth: 1`, `borderRadius: 14`, `paddingHorizontal: 10`, `paddingVertical: 6`, `flexDirection: 'row'`, `alignItems: 'center'`, `gap: 8`, bg `C.tableRow` |
| Input | `fontSize: 13`, `maxHeight: 92`, `paddingVertical: 0`, `textAlignVertical: 'center'`, `flex: 1` |
| Recording row | `flex: 1`, `flexDirection: 'row'`, `alignItems: 'center'`, `gap: 8` |
| Recording time | `fontSize: 15`, `fontWeight: '700'`, `minWidth: 50` |
| Recording hint | `fontSize: 12`, `fontWeight: '700'` |
| Recording hint cancel | color `#EF476F` |
| Send btn | `38×38`, `borderRadius: 11`, bg `C.brandBlue` |

---

### Call Session Modal (`CallSessionModal.tsx`)

```
┌──────────────────────────────────────────┐
│  Ringing...                              │
│                                          │
│          ┌──────────────┐                │
│          │              │                │
│          │   (avatar)   │                │
│          │   214×214    │                │
│          │    00:42     │                │
│          └──────────────┘                │
│                                          │
│       [Decline]    [Accept]              │  (incoming)
│       🔄 📹 🔇 🎤 📞                   │  (ongoing controls)
└──────────────────────────────────────────┘
```

---

## Dependencies
- `socket.io-client` v4.4.1 — real-time
- `react-native-webrtc` v124 — calls
- `zustand` v5 — state management
- `expo-av` — voice recording + ringtone
- `expo-camera` — in-app photo capture
- `expo-image-picker` — photo library
- `expo-document-picker` — file picker
- `react-native-safe-area-context` — safe area
- `expo-router` — navigation
- `expo-crypto` — Gravatar hash

---

## Constants

### Bubble Colors
| Token | Value |
|-------|-------|
| `SENT_BUBBLE_COLOR` | `#60A5FA` |
| `SENT_BUBBLE_BORDER_COLOR` | `#3B82F6` |
| Own text | `C.surface` |
| Other bg | `C.tableRow` |
| Other border | `C.brandBorder` |
| Other text | `C.textMain` |

### Recording Gesture Thresholds
| Gesture | Threshold |
|---------|-----------|
| Hold to start | 180ms |
| Slide up to lock | 38px |
| Slide left to cancel | -55px |
| Cancel reset | -30px |
