# Emoji Support

This blog supports Slack-style emoji syntax using `:emoji_name:` format.

## Usage

Simply wrap emoji names in colons in your markdown files:

```markdown
I'm so excited about this! :smile: :tada:

This is amazing work :thumbsup: :fire:

Thanks for reading :pray: :heart:
```

## Available Emojis

The blog includes a comprehensive set of emojis organized by category:

### Smileys & Emotion

- `:smile:` 😄 `:grinning:` 😀 `:joy:` 😂 `:smiley:` 😃 `:laughing:` 😆
- `:wink:` 😉 `:blush:` 😊 `:yum:` 😋 `:sunglasses:` 😎 `:heart_eyes:` 😍
- `:kissing_heart:` 😘 `:stuck_out_tongue:` 😛 `:stuck_out_tongue_winking_eye:`
  😜
- `:disappointed:` 😞 `:worried:` 😟 `:angry:` 😠 `:rage:` 😡 `:cry:` 😢
- `:thinking:` 🤔 `:facepalm:` 🤦 `:shrug:` 🤷

### People & Body

- `:thumbsup:` 👍 `:thumbsdown:` 👎 `:ok_hand:` 👌 `:punch:` 👊 `:fist:` ✊
- `:v:` ✌️ `:wave:` 👋 `:hand:` ✋ `:raised_hands:` 🙌 `:pray:` 🙏
- `:clap:` 👏 `:muscle:` 💪 `:point_up:` ☝️ `:point_right:` 👉

### Animals & Nature

- `:dog:` 🐶 `:cat:` 🐱 `:mouse:` 🐭 `:rabbit:` 🐰 `:fox:` 🦊
- `:bear:` 🐻 `:panda:` 🐼 `:tiger:` 🐯 `:lion:` 🦁 `:monkey:` 🐵
- `:see_no_evil:` 🙈 `:hear_no_evil:` 🙉 `:speak_no_evil:` 🙊

### Food & Drink

- `:apple:` 🍎 `:banana:` 🍌 `:pizza:` 🍕 `:hamburger:` 🍔 `:fries:` 🍟
- `:coffee:` ☕ `:tea:` 🍵 `:beer:` 🍺 `:wine_glass:` 🍷 `:cake:` 🍰
- `:birthday:` 🎂 `:ice_cream:` 🍨 `:cookie:` 🍪

### Activities & Sports

- `:soccer:` ⚽ `:basketball:` 🏀 `:football:` 🏈 `:baseball:` ⚾ `:tennis:` 🎾
- `:trophy:` 🏆 `:medal:` 🏅 `:video_game:` 🎮 `:dart:` 🎯 `:bowling:` 🎳

### Travel & Places

- `:car:` 🚗 `:bus:` 🚌 `:train:` 🚋 `:airplane:` ✈️ `:rocket:` 🚀
- `:house:` 🏠 `:office:` 🏢 `:hospital:` 🏥 `:school:` 🏫 `:factory:` 🏭

### Objects & Technology

- `:computer:` 💻 `:iphone:` 📱 `:camera:` 📷 `:tv:` 📺 `:radio:` 📻
- `:bulb:` 💡 `:battery:` 🔋 `:gear:` ⚙️ `:wrench:` 🔧 `:hammer:` 🔨
- `:key:` 🔑 `:lock:` 🔒 `:unlock:` 🔓

### Symbols & Reactions

- `:heart:` ❤️ `:yellow_heart:` 💛 `:green_heart:` 💚 `:blue_heart:` 💙
  `:purple_heart:` 💜
- `:fire:` 🔥 `:star:` ⭐ `:sparkles:` ✨ `:boom:` 💥 `:zap:` ⚡
- `:100:` 💯 `:tada:` 🎉 `:confetti_ball:` 🎊 `:balloon:` 🎈

### Weather & Nature

- `:sunny:` ☀️ `:partly_sunny:` ⛅ `:cloudy:` ☁️ `:rain_cloud:` 🌧️
  `:snow_cloud:` 🌨️
- `:rainbow:` 🌈 `:umbrella:` ☔ `:snowflake:` ❄️ `:snowman:` ⛄
- `:seedling:` 🌱 `:evergreen_tree:` 🌲 `:deciduous_tree:` 🌳 `:palm_tree:` 🌴
- `:rose:` 🌹 `:sunflower:` 🌻 `:tulip:` 🌷 `:cherry_blossom:` 🌸

### Numbers & Arrows

- `:zero:` 0️⃣ `:one:` 1️⃣ `:two:` 2️⃣ `:three:` 3️⃣ `:four:` 4️⃣ `:five:` 5️⃣
- `:arrow_right:` ➡️ `:arrow_left:` ⬅️ `:arrow_up:` ⬆️ `:arrow_down:` ⬇️
- `:heavy_check_mark:` ✔️ `:x:` ❌ `:warning:` ⚠️ `:exclamation:` ❗
  `:question:` ❓

### Common Flags

- `:flag-us:` 🇺🇸 `:flag-gb:` 🇬🇧 `:flag-ca:` 🇨🇦 `:flag-au:` 🇦🇺 `:flag-de:` 🇩🇪
- `:flag-fr:` 🇫🇷 `:flag-it:` 🇮🇹 `:flag-es:` 🇪🇸 `:flag-jp:` 🇯🇵 `:flag-kr:` 🇰🇷

## Adding New Emojis

To add new emojis, edit the `lib/emojis.ts` file and add entries to the
`emojiMap` object:

```typescript
export const emojiMap: Record<string, string> = {
  // ... existing emojis
  my_custom_emoji: "🎯",
  another_emoji: "🚀",
};
```

## Examples in Use

Here are some examples of how emojis look in practice:

**Reactions:**

- Great job! :thumbsup: :fire:
- Thanks! :pray: :heart:
- Oops! :facepalm: :sweat_smile:

**Tech Content:**

- Working on code :computer: :coffee:
- Bug fixed! :bug: :hammer: :white_check_mark:
- Deployed! :rocket: :tada:

**Emotions:**

- So excited! :smile: :star_struck:
- Thinking... :thinking: :bulb:
- Frustrated :rage: :face_with_symbols_over_mouth:

The emoji system automatically converts these shortcodes during markdown
processing, so they'll appear as actual Unicode emojis in your rendered blog
posts.
