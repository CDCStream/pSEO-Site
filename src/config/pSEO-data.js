// Complete pSEO Configuration for All Dynamic Pages

export const siteConfig = {
  name: 'MakerSilo',
  tagline: 'Free Online Tools for Creators',
  description: 'Transform your text, create memes, find symbols, and generate beautiful wallpapers - all in one place.',
  url: 'https://makersilo.com',
};

// Unicode mappings for text generators
export const unicodeMaps = {
  smallCaps: {
    'a': '\u1D00', 'b': '\u0299', 'c': '\u1D04', 'd': '\u1D05', 'e': '\u1D07', 'f': '\uA730', 'g': '\u0262', 'h': '\u029C',
    'i': '\u026A', 'j': '\u1D0A', 'k': '\u1D0B', 'l': '\u029F', 'm': '\u1D0D', 'n': '\u0274', 'o': '\u1D0F', 'p': '\u1D18',
    'q': '\u01EB', 'r': '\u0280', 's': '\u0073', 't': '\u1D1B', 'u': '\u1D1C', 'v': '\u1D20', 'w': '\u1D21', 'x': '\u0078',
    'y': '\u028F', 'z': '\u1D22',
  },
  superscript: {
    'a': '\u1D43', 'b': '\u1D47', 'c': '\u1D9C', 'd': '\u1D48', 'e': '\u1D49', 'f': '\u1DA0', 'g': '\u1D4D', 'h': '\u02B0',
    'i': '\u2071', 'j': '\u02B2', 'k': '\u1D4F', 'l': '\u02E1', 'm': '\u1D50', 'n': '\u207F', 'o': '\u1D52', 'p': '\u1D56',
    'q': '\u146B', 'r': '\u02B3', 's': '\u02E2', 't': '\u1D57', 'u': '\u1D58', 'v': '\u1D5B', 'w': '\u02B7', 'x': '\u02E3',
    'y': '\u02B8', 'z': '\u1DBB', '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074', '5': '\u2075',
    '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
  },
  subscript: {
    // Standard subscript Unicode characters
    'a': '\u2090', 'e': '\u2091', 'h': '\u2095', 'i': '\u1D62', 'j': '\u2C7C', 'k': '\u2096', 'l': '\u2097', 'm': '\u2098',
    'n': '\u2099', 'o': '\u2092', 'p': '\u209A', 'r': '\u1D63', 's': '\u209B', 't': '\u209C', 'u': '\u1D64', 'v': '\u1D65',
    'x': '\u2093',
    // Greek subscript approximations for missing letters
    'b': '\u1D66', 'g': '\u1D67', 'y': '\u1D67', 'q': '\u1D69', 'z': '\u1D66',
    // Fallback to small characters for others
    'c': 'c', 'd': 'd', 'f': 'f', 'w': 'w',
    // Numbers
    '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084', '5': '\u2085',
    '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089',
  },
  bubble: {
    'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
    'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ',
    'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ',
    'y': 'ⓨ', 'z': 'ⓩ', 'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ',
    'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ',
    'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ',
    'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ', '0': '⓪', '1': '①', '2': '②', '3': '③',
    '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
  },
  gothic: {
    'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥',
    'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭',
    'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵',
    'y': '𝔶', 'z': '𝔷', 'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉',
    'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑',
    'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙',
    'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ',
  },
  minecraft: {
    'a': 'ᔑ', 'b': 'ʖ', 'c': 'ᓵ', 'd': '↸', 'e': 'ᒷ', 'f': '⎓', 'g': '⊣', 'h': '⍑',
    'i': '╎', 'j': '⋮', 'k': 'ꖌ', 'l': 'ꖎ', 'm': 'ᒲ', 'n': 'リ', 'o': '𝙹', 'p': '!¡',
    'q': 'ᑑ', 'r': '∷', 's': 'ᓭ', 't': 'ℸ', 'u': '⚍', 'v': '⍊', 'w': '∴', 'x': '̇/',
    'y': '||', 'z': '⨅',
  },
  morse: {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
    'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
    'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/',
  },
};

// Glitch text zalgo characters
export const glitchChars = {
  above: ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'],
  below: ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣'],
  middle: ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡'],
};

// Symbol collections
export const symbolCollections = {
  music: {
    name: 'Music Symbols',
    symbols: ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '𝄞', '𝄢', '𝄪', '𝄫', '🎵', '🎶', '🎼', '🎹', '🎸', '🎺', '🎻', '🎷', '🥁', '🎤', '🎧', '🎚', '🎛', '🎙', '📻', '🔊', '🔉', '🔈', '🔇'],
  },
  religious: {
    name: 'Religious Symbols',
    symbols: ['✝', '☦', '✞', '✟', '✠', '☥', '✡', '✿', '☪', '☯', '☸', '✴', '☽', '☾', '🕉', '☬', '🕎', '⚛', '🔯', '☮', '♱', '♰', '⛪', '🕌', '🕍', '⛩', '🛕', '📿'],
  },
  inequality: {
    name: 'Inequality & Math Symbols',
    symbols: ['≠', '≈', '≡', '≢', '≤', '≥', '≦', '≧', '≨', '≩', '≪', '≫', '≮', '≯', '≰', '≱', '⊂', '⊃', '⊄', '⊅', '⊆', '⊇', '∈', '∉', '∋', '∌', '∅', '∞', '∝', '∑', '∏', '√', '∛', '∜', '∫', '∬', '∭', '∮'],
  },
  japanese: {
    name: 'Japanese Symbols',
    symbols: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', '㊀', '㊁', '㊂', '㊃', '㊄', '㊅', '㊆', '㊇', '㊈', '㊉', '々', '〆', '〒', '〓', '〠', '〶', '〷'],
  },
  hearts: {
    name: 'Heart Symbols',
    symbols: ['❤', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '♡', '♥', '❥', '❦', '❧', '💟', '☙', '❢', '❤️‍🔥', '❤️‍🩹', '💑', '💏'],
  },
  kaomoji: {
    name: 'Kaomoji List',
    symbols: ['(◕‿◕)', '(｡◕‿◕｡)', '(◠‿◠)', '(◕ᴗ◕✿)', '(≧◡≦)', '(◔◡◔)', '(✿◠‿◠)', '( ´ ▽ ` )', '(＾▽＾)', '(*^▽^*)', '(◉‿◉)', 'ʕ•ᴥ•ʔ', '(ᵔᴥᵔ)', '(•ᴗ•)', '(◕‿-)✧', '(✧ω✧)', '(≧ω≦)', '(⁀ᗢ⁀)', 'ಠ_ಠ', '(ಠ‿ಠ)', '(⌐■_■)', '(•_•)', '(눈_눈)', '(¬‿¬)', '(◣_◢)', '(╯°□°）╯︵ ┻━┻', '┬─┬ノ( º _ ºノ)', '(ノಠ益ಠ)ノ彡┻━┻', '(╮°-°)╮┳━━┳', '(;一_一)', '(ー_ー)', '(-_-)', '(＃`Д´)', '(｀ε´)', '( ≧Д≦)', '(TдT)', '(ಥ_ಥ)', '(╥﹏╥)', '(T_T)', '(;_;)', '(ノД`)・゜・。', '・゚・(ノД`)・゚・', '(´;ω;`)', '(´༎ຶ ͜ʖ ༎ຶ`)'],
  },
};

// Tools configuration
export const toolsConfig = {
  'small-text-generator': {
    category: 'tools',
    name: 'Small Text Generator',
    keyword: 'Small Text Generator',
    title: 'Best Small Text Generator - Free Online Tool',
    description: 'Use our free Small Text Generator to create unique ᵗⁱⁿʸ text instantly. Perfect for social media, usernames, and creative projects.',
    h1: 'Small Text Generator',
    subtitle: 'Transform your regular text into tiny superscript, subscript, and small caps characters.',
    icon: 'type',
    transformType: 'smallText',
    faq: [
      { q: 'Is Small Text Generator compatible with Instagram?', a: 'Yes! The small text generated works perfectly on Instagram bios, captions, and comments. Simply copy and paste the converted text.' },
      { q: 'Can I use small text on Discord?', a: 'Absolutely! Discord fully supports Unicode characters, so small text works in usernames, messages, and server names.' },
      { q: 'Why do some letters look different?', a: 'Small text uses special Unicode characters. Some letters may appear slightly different as they map to available Unicode symbols.' },
      { q: 'Is small text the same as superscript?', a: 'Small text includes multiple styles: superscript (ᵗⁱⁿʸ), subscript (ₜᵢₙᵧ), and small caps (ᴛɪɴʏ). Each serves different purposes.' },
      { q: 'Does small text work on Twitter/X?', a: 'Yes! Twitter/X supports Unicode characters, making small text perfect for unique tweets and bios.' },
    ],
    longContent: `The Small Text Generator is a powerful online tool that transforms ordinary text into eye-catching miniature characters. Whether you're looking to create unique social media bios, distinctive usernames, or add creative flair to your messages, this tool makes it effortless. Our implementation is inspired by [smalltext.io](https://smalltext.io/), one of the pioneering small text generators on the web.

Our generator offers three distinct small text styles: superscript characters (ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ) that appear slightly above the baseline, subscript characters (ₐᵦ𝒸𝒹ₑ𝒻𝓰ₕᵢⱼₖₗₘₙₒₚᵩᵣₛₜᵤᵥ𝓌ₓᵧ𝓏) that sit below, and small caps (ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ) that maintain the structure of capital letters but in a compact form. Each style uses Unicode characters that are universally supported across modern platforms.

What makes our Small Text Generator stand out is its instant conversion technology. As you type, the text transforms in real-time, allowing you to see exactly how your message will appear. The one-click copy feature ensures you can quickly grab your converted text and paste it anywhere – from Instagram captions to Discord servers, from Twitter bios to text messages.

Small text has become increasingly popular for creating aesthetic usernames that stand out from the crowd. Gamers, content creators, and social media enthusiasts use tiny text to add a unique touch to their online presence. The subtle yet distinctive appearance catches the eye without being overwhelming. As noted on [smalltext.io](https://smalltext.io/), these aren't actually fonts but rather special Unicode characters that can be copied and pasted anywhere.

Beyond social media, small text serves practical purposes in mathematical notation, footnotes, and scientific writing. Superscript and subscript characters are essential for chemical formulas, mathematical expressions, and academic citations. Unicode originally introduced only ¹²³ for superscripts, but now includes most of the alphabet except "q" which we substitute with ᵠ. Our generator makes accessing these special characters simple and fast.`,
  },
  'glitch-text-generator': {
    category: 'tools',
    name: 'Glitch Text Generator',
    keyword: 'Glitch Text Generator',
    title: 'Best Glitch Text Generator - Free Online Tool',
    description: 'Use our free Glitch Text Generator to create creepy zalgo text instantly. Perfect for horror themes, memes, and unique social media posts.',
    h1: 'Glitch Text Generator',
    subtitle: 'Create creepy, corrupted zalgo text with adjustable intensity levels.',
    icon: 'zap',
    transformType: 'glitch',
    faq: [
      { q: 'Is Glitch Text Generator compatible with Instagram?', a: 'Yes! Glitch text works on Instagram, though extremely long zalgo effects may be truncated. Moderate intensity works best.' },
      { q: 'What is zalgo text?', a: 'Zalgo text is created by stacking Unicode diacritical marks above and below regular characters, creating a "glitched" or corrupted appearance.' },
      { q: 'Will glitch text break my messages?', a: 'While glitch text is safe to use, very high intensity settings may cause display issues on some platforms. Start with low intensity.' },
      { q: 'Can I adjust how crazy the glitch looks?', a: 'Yes! Our generator offers intensity controls from subtle to extreme, letting you create the perfect glitch effect.' },
      { q: 'Does glitch text work on Discord?', a: 'Discord fully supports zalgo text, making it perfect for spooky server themes and horror-themed messages.' },
    ],
    longContent: `The Glitch Text Generator, also known as a Zalgo text creator, produces eerily distorted text that appears corrupted or haunted. This effect is achieved by stacking multiple Unicode combining characters called [diacritics](https://en.wikipedia.org/wiki/Diacritic) above and below standard letters, creating a chaotic visual that has become iconic in internet culture.

Our Glitch Text Generator offers unprecedented control over the chaos intensity. Whether you want subtle corruption for an artistic touch or extreme zalgo for maximum impact, the adjustable sliders let you fine-tune the effect. You can control the density of marks above, below, and through the text independently.

Zalgo text originated from internet horror fiction and has since become a staple of creepypasta, memes, and alternative aesthetics. The name comes from Zalgo, a fictional entity representing chaos and horror. Using this style of text immediately evokes feelings of unease and otherworldliness.

Content creators use glitch text for horror game streams, creepy social media posts, and Halloween-themed content. The visual corruption catches attention in crowded feeds and communicates an edgy, alternative vibe. Music artists and bands frequently incorporate zalgo text into promotional materials.

Our generator ensures the glitch text remains copyable and pasteable across platforms. The output maintains proper Unicode encoding, so your corrupted text will display correctly wherever you share it. From Twitter to TikTok, Discord to Instagram, your glitchy messages will make an impact.`,
  },
  'tiny-text-generator': {
    category: 'tools',
    name: 'Tiny Text Generator',
    keyword: 'Tiny Text Generator',
    title: 'Best Tiny Text Generator - Free Online Tool',
    description: 'Use our free Tiny Text Generator to create ultra-small superscript text instantly. Perfect for aesthetic bios and creative content.',
    h1: 'Tiny Text Generator',
    subtitle: 'Generate ultra-small superscript text that works everywhere.',
    icon: 'minimize-2',
    transformType: 'tiny',
    faq: [
      { q: 'Is Tiny Text Generator compatible with Instagram?', a: 'Yes! Tiny text works perfectly on Instagram bios, stories, and posts. Copy and paste for instant aesthetic vibes.' },
      { q: 'What\'s the difference between tiny and small text?', a: 'Tiny text specifically uses superscript characters, while small text may include various styles like small caps.' },
      { q: 'Can I use tiny text for usernames?', a: 'Most platforms accept tiny text in usernames. It\'s a popular way to create unique, eye-catching handles.' },
      { q: 'Why can\'t some letters be converted?', a: 'Unicode superscript is limited. Some letters default to regular size when no superscript version exists.' },
      { q: 'Does tiny text affect SEO?', a: 'Tiny text on websites may not be indexed the same as regular text. Use it for decorative purposes rather than key content.' },
    ],
    longContent: `The Tiny Text Generator specializes in creating miniature superscript characters that appear to float above the text baseline. This distinctive style has become essential for creating aesthetic social media profiles, unique usernames, and creative digital content.

Our Tiny Text Generator leverages Unicode superscript characters to transform regular text into a miniaturized version. The result is text that appears dramatically smaller while remaining fully readable and copyable. This effect is achieved without any images or special formatting – just pure Unicode magic.

Tiny text has exploded in popularity across social media platforms. Instagram users especially love incorporating tiny text into their bios to create a clean, minimalist aesthetic. The smaller characters allow more content to fit in limited bio spaces while maintaining visual appeal.

Gaming communities have embraced tiny text for creating unique clan tags and player names. The miniature characters help usernames stand out in crowded lobbies and leaderboards. Streamers use tiny text in their channel descriptions and stream titles for added personality.

The technical implementation of our generator ensures maximum compatibility. We use the most widely-supported Unicode superscript characters, meaning your tiny text will display correctly on virtually any modern device or platform. No special fonts or apps required – just copy, paste, and enjoy your miniature masterpiece.`,
  },
  'strikethrough-text': {
    category: 'tools',
    name: 'Strikethrough Text',
    keyword: 'Strikethrough Text',
    title: 'Best Strikethrough Text Generator - Free Online Tool',
    description: 'Use our free Strikethrough Text Generator to create c̶r̶o̶s̶s̶e̶d̶ ̶o̶u̶t̶ text instantly. Perfect for corrections, jokes, and sarcastic comments.',
    h1: 'Strikethrough Text Generator',
    subtitle: 'Create crossed-out text that works on any platform.',
    icon: 'strikethrough',
    transformType: 'strikethrough',
    faq: [
      { q: 'Is Strikethrough Text compatible with Instagram?', a: 'Yes! Strikethrough text using Unicode works perfectly on Instagram where native markdown isn\'t supported.' },
      { q: 'How is this different from Discord strikethrough?', a: 'Discord uses ~~text~~ markdown. Our generator creates Unicode strikethrough that works everywhere, even without markdown.' },
      { q: 'Can I use strikethrough in emails?', a: 'Unicode strikethrough works in most email clients, though some may display it differently.' },
      { q: 'What\'s the strikethrough character called?', a: 'The Unicode combining character we use is U+0336 (Combining Long Stroke Overlay), applied to each character.' },
      { q: 'Will strikethrough work on WhatsApp?', a: 'Yes! While WhatsApp has native strikethrough with ~text~, our Unicode version provides an alternative style.' },
    ],
    longContent: `The Strikethrough Text Generator creates text with a horizontal line running through each character, producing the classic "crossed out" effect. This versatile formatting style is perfect for indicating corrections, deleted content, or adding sarcastic humor to your messages.

Unlike platform-specific markdown formatting that only works in certain apps, our strikethrough uses Unicode combining characters. This means your crossed-out text will display correctly whether you paste it on Twitter, Instagram, Facebook, or any other platform that supports Unicode.

Strikethrough text has become a beloved tool for internet humor. Crossing out what you "really meant to say" before stating something more diplomatic has become a comedic staple. Users love the ability to show their thought process while maintaining plausible deniability.

The editing and content creation community uses strikethrough to show revisions and corrections. Writers demonstrate their editing process, teachers mark incorrect answers, and programmers cross out deprecated code – all using this simple yet effective formatting.

Our generator applies the Unicode combining long stroke overlay to each character individually. This character-by-character approach ensures the strikethrough appears continuous regardless of the text length. The result is clean, consistent formatting that maintains readability while clearly indicating the text is meant to be "crossed out."`,
  },
  'morse-code-generator': {
    category: 'tools',
    name: 'Morse Code Generator',
    keyword: 'Morse Code Generator',
    title: 'Best Morse Code Generator - Free Online Tool',
    description: 'Use our free Morse Code Generator to convert text to dots and dashes instantly. Perfect for learning, puzzles, and encrypted messages.',
    h1: 'Morse Code Generator',
    subtitle: 'Translate text to Morse code and decode messages.',
    icon: 'radio',
    transformType: 'morse',
    faq: [
      { q: 'Is Morse Code Generator accurate?', a: 'Yes! Our generator uses the International Morse Code standard for accurate translations of letters, numbers, and common punctuation.' },
      { q: 'Can I decode Morse code too?', a: 'Absolutely! Our tool works both ways – encode regular text to Morse or decode Morse back to readable text.' },
      { q: 'What do the dots and dashes mean?', a: 'In Morse code, dots (.) represent short signals and dashes (-) represent long signals. Each letter has a unique pattern.' },
      { q: 'Is Morse code still used today?', a: 'Yes! Morse code remains relevant in amateur radio, aviation, and as an accessibility tool for people with certain disabilities.' },
      { q: 'How are words separated in Morse?', a: 'Spaces between letters use three units of time, while spaces between words use seven units (shown as / in text).' },
    ],
    longContent: `The Morse Code Generator provides instant translation between regular text and the timeless dot-and-dash language that revolutionized global communication. Whether you're learning Morse code, creating puzzles, or sending encoded messages, our tool makes the conversion seamless.

Morse code was developed in the 1830s by Samuel Morse and Alfred Vail, becoming the foundation of telegraph communication. Each letter of the alphabet is represented by a unique combination of short signals (dots) and long signals (dashes). Despite being nearly two centuries old, Morse code remains relevant today.

Our generator follows the International Morse Code standard, ensuring accuracy for all 26 letters, numbers 0-9, and common punctuation marks. The bidirectional translation capability allows you to encode messages into Morse or decode received signals back into readable text.

Ham radio operators worldwide still use Morse code for reliable long-distance communication. The simplicity of the signal makes it effective even in challenging conditions where voice communication would fail. Many amateur radio licenses still require Morse code proficiency.

Beyond practical applications, Morse code has found new life in education and entertainment. Teachers use it to engage students in history lessons, escape rooms feature Morse puzzles, and the distinctive patterns appear in music, art, and design. The rhythmic dots and dashes have become culturally iconic, representing communication itself.`,
  },
  'text-to-binary': {
    category: 'tools',
    name: 'Text to Binary',
    keyword: 'Text to Binary Converter',
    title: 'Best Text to Binary Converter - Free Online Tool',
    description: 'Use our free Text to Binary Converter to transform text into 1s and 0s instantly. Perfect for coding education, tech aesthetics, and digital art.',
    h1: 'Text to Binary Converter',
    subtitle: 'Convert any text into binary code (1s and 0s).',
    icon: 'binary',
    transformType: 'binary',
    faq: [
      { q: 'Is Text to Binary Converter accurate?', a: 'Yes! We convert each character to its ASCII binary representation using standard 8-bit encoding.' },
      { q: 'Can I convert binary back to text?', a: 'Absolutely! Our tool supports bidirectional conversion between text and binary.' },
      { q: 'What encoding is used?', a: 'We use ASCII/UTF-8 encoding, converting each character to its 8-bit binary representation.' },
      { q: 'Why is binary important in computing?', a: 'Binary is the fundamental language of computers. All data – text, images, videos – is ultimately stored as 1s and 0s.' },
      { q: 'Can I use binary in social media?', a: 'Yes! Binary text can be copied and used anywhere, though it will appear as long strings of numbers.' },
    ],
    longContent: `The Text to Binary Converter translates human-readable text into the fundamental language of computers: binary code. Each character becomes an 8-bit string of 1s and 0s, revealing the digital representation that underlies all computing.

Binary is the foundation of digital technology. Computers process information using electrical signals that are either on (1) or off (0). Every piece of data – from this text you're reading to streaming videos – ultimately exists as patterns of these two states.

Our converter uses ASCII (American Standard Code for Information Interchange) encoding, where each character is represented by a unique 8-bit binary number. The letter 'A', for example, becomes 01000001. This standard encoding ensures your converted binary can be accurately decoded back to text.

Educational applications of binary conversion are extensive. Computer science students learn the fundamentals of data representation, programmers debug encoding issues, and curious minds explore how computers think. Seeing text transformed into binary makes abstract computing concepts tangible.

Beyond education, binary aesthetics have become popular in design and culture. The Matrix-style cascading digits, binary-themed artwork, and "computer code" visual effects all draw from this digital alphabet. Content creators use binary text for tech-themed content, cyberpunk aesthetics, and geeky humor.`,
  },
  'gothic-font': {
    category: 'tools',
    name: 'Gothic Font',
    keyword: 'Gothic Font Generator',
    title: 'Best Gothic Font Generator - Free Online Tool',
    description: 'Use our free Gothic Font Generator to create 𝔟𝔩𝔞𝔠𝔨𝔩𝔢𝔱𝔱𝔢𝔯 text instantly. Perfect for medieval themes, metal bands, and dramatic aesthetics.',
    h1: 'Gothic Font Generator',
    subtitle: 'Transform text into elegant blackletter/Fraktur style.',
    icon: 'crown',
    transformType: 'gothic',
    faq: [
      { q: 'Is Gothic Font Generator compatible with Instagram?', a: 'Yes! Gothic/Fraktur Unicode text works perfectly on Instagram bios, posts, and stories.' },
      { q: 'What\'s the difference between Gothic and Old English fonts?', a: 'These terms are often used interchangeably. Our generator creates Fraktur-style characters that evoke medieval manuscripts.' },
      { q: 'Why do some letters look different?', a: 'Gothic Unicode uses the mathematical Fraktur character set. Some letters may have slight variations from traditional calligraphy.' },
      { q: 'Can I use Gothic text for band logos?', a: 'Many metal and rock bands use Gothic text. While our generator creates text (not images), it\'s perfect for inspiration and social media.' },
      { q: 'Does Gothic text work on Discord?', a: 'Yes! Discord fully supports Unicode Gothic/Fraktur characters for usernames, messages, and server names.' },
    ],
    longContent: `The Gothic Font Generator transforms ordinary text into elegant blackletter script, evoking the dramatic aesthetics of medieval manuscripts, heavy metal iconography, and dark romantic themes. Each letter becomes a work of art with the distinctive angular strokes of Fraktur typography.

Blackletter, also known as Gothic script, developed in Western Europe during the 12th century. The angular, compact forms allowed scribes to write more efficiently while creating visually striking documents. This style dominated European printing for centuries and remains iconic today.

Our generator uses Unicode Mathematical Fraktur characters to recreate this historic style. Unlike image-based fonts, these Unicode characters can be copied and pasted anywhere – from social media bios to messaging apps. The text remains selectable and searchable while maintaining its dramatic appearance.

The Gothic aesthetic has experienced a significant revival across multiple subcultures. Metal bands, gothic fashion, dark academia, and medieval enthusiasts all embrace blackletter typography. Instagram bios, band names, and gaming handles featuring Gothic text immediately communicate a bold, alternative identity.

Beyond aesthetics, Gothic fonts carry historical significance. Many formal documents, beer labels, newspaper mastheads, and certificates still use blackletter styling to convey tradition and authority. Our generator makes this historic typography accessible for modern digital use.`,
  },
  'bubble-font': {
    category: 'tools',
    name: 'Bubble Font',
    keyword: 'Bubble Font Generator',
    title: 'Best Bubble Font Generator - Free Online Tool',
    description: 'Use our free Bubble Font Generator to create ⓒⓘⓡⓒⓛⓔⓓ text instantly. Perfect for cute bios, playful messages, and creative content.',
    h1: 'Bubble Font Generator',
    subtitle: 'Create playful circled letters and numbers.',
    icon: 'circle',
    transformType: 'bubble',
    faq: [
      { q: 'Is Bubble Font Generator compatible with Instagram?', a: 'Yes! Bubble letters work perfectly on Instagram and add a cute, playful touch to your content.' },
      { q: 'Why do some characters not have bubbles?', a: 'Unicode only includes circled versions of letters A-Z and numbers 0-9. Punctuation and special characters remain unchanged.' },
      { q: 'Can I use bubble text for YouTube?', a: 'Yes! Bubble text works in YouTube titles, descriptions, and comments for a unique look.' },
      { q: 'Are there filled and empty bubble options?', a: 'Our generator uses the standard circled character set. Both filled (●) and empty (○) styles exist in Unicode.' },
      { q: 'Does bubble font work on TikTok?', a: 'Yes! TikTok supports Unicode characters, making bubble text perfect for bios and captions.' },
    ],
    longContent: `The Bubble Font Generator wraps your text in playful circular outlines, creating an adorable aesthetic perfect for lighthearted content. Each letter and number becomes encased in a bubble, transforming ordinary text into something eye-catching and fun.

Bubble letters tap into a playful, youthful aesthetic that resonates across platforms. The rounded shapes feel friendly and approachable, making them ideal for social media bios, creative usernames, and casual messaging. The style evokes doodles, childhood writing, and artistic expression.

Our generator uses Unicode Enclosed Alphanumerics, a character set that includes circled versions of all 26 letters and numbers 0-9. These characters are universally supported, meaning your bubble text will display correctly on smartphones, computers, and tablets without any special fonts.

Content creators leverage bubble font for varied purposes. Beauty and lifestyle influencers use it for cute Instagram bios, gamers create unique player names, and artists add personality to their profiles. The versatility of bubble text makes it suitable for anyone wanting to stand out.

The technical simplicity of our generator ensures instant results. Type your text, see it transform in real-time, and copy with a single click. No downloads, no installations, no sign-ups – just pure bubbly text generation at your fingertips.`,
  },
  'minecraft-font': {
    category: 'tools',
    name: 'Minecraft Text Generator',
    keyword: 'Minecraft Text Generator',
    title: 'Best Minecraft Text Generator - Free 3D Block Font Maker',
    description: 'Create stunning 3D Minecraft-style block text with our free generator. Choose block colors, backgrounds, and download as PNG. Perfect for thumbnails, banners, and gaming content.',
    h1: 'Minecraft Text Generator',
    subtitle: 'Create 3D block-style text like the Minecraft title screen.',
    icon: 'gamepad-2',
    transformType: 'minecraft',
    faq: [
      { q: 'How do I create Minecraft-style text?', a: 'Simply type your text, choose a block color (stone, diamond, gold, etc.), select a background theme, and adjust the 3D depth. Then download your creation as PNG!' },
      { q: 'Can I use the generated images commercially?', a: 'Yes! The images you create are yours to use for YouTube thumbnails, Twitch banners, social media posts, and more.' },
      { q: 'What backgrounds are available?', a: 'We offer Grass & Dirt, Night Sky, Nether, The End, Ocean, and Desert themes - all inspired by Minecraft biomes.' },
      { q: 'Can I adjust the 3D effect?', a: 'Absolutely! Use the depth slider to control how pronounced the 3D block effect appears, from flat to deep perspective.' },
      { q: 'What file format is the download?', a: 'All downloads are high-quality PNG files with transparency support where applicable.' },
    ],
    longContent: `The Minecraft Text Generator creates stunning 3D block-style text that captures the iconic look of Minecraft's title screen. Whether you're making YouTube thumbnails, Twitch stream overlays, or social media graphics, this tool delivers professional-quality Minecraft typography in seconds.

Our generator renders text using a pixel-perfect block font reminiscent of the classic Minecraft aesthetic. Each letter is constructed from individual blocks with realistic 3D depth, complete with highlights and shadows that give the text a genuine blocky appearance.

Choose from multiple block materials to match your content's theme. Stone blocks provide a classic, neutral look. Diamond and emerald add vibrant color for eye-catching titles. Gold and iron bring metallic elegance. Redstone and lapis offer bold, distinctive options. Obsidian creates a dark, mysterious atmosphere.

The background themes transport your text into authentic Minecraft environments. The iconic Grass & Dirt combination evokes the overworld. Night Sky is perfect for survival content. Nether and End themes set the stage for adventure and boss fights. Ocean and Desert backgrounds add variety for biome-specific content.

Customization options let you fine-tune every aspect. Adjust zoom for the perfect text size. Modify character spacing for readability. Control the 3D depth for dramatic or subtle effects. Once you're satisfied, download your creation as a high-quality PNG ready for immediate use in your projects.`,
  },
};

// Symbols configuration
export const symbolsConfig = {
  'music-symbols': {
    category: 'symbols',
    name: 'Music Symbols',
    keyword: 'Music Symbols',
    title: 'Best Music Symbols Copy and Paste - Free Collection',
    description: 'Copy and paste music symbols like ♪ ♫ ♬ 🎵 instantly. Free collection of musical notes, instruments, and audio symbols.',
    h1: 'Music Symbols Copy and Paste',
    subtitle: 'Click to copy musical notes, instruments, and audio symbols.',
    icon: 'music',
    symbolKey: 'music',
    faq: [
      { q: 'Are music symbols compatible with Instagram?', a: 'Yes! All music symbols in our collection work perfectly on Instagram bios, captions, and comments.' },
      { q: 'Can I use music notes in song titles?', a: 'Absolutely! Music symbols add visual flair to playlists, song titles, and music-related posts.' },
      { q: 'Why do some music symbols look different on my device?', a: 'Emoji and symbols may render differently across operating systems and devices, but remain functional.' },
      { q: 'Do music symbols work on Spotify?', a: 'Spotify supports most Unicode music symbols in playlist names and descriptions.' },
      { q: 'Can I use multiple music symbols together?', a: 'Yes! Combine symbols to create unique patterns like ♪♫♬ or 🎵🎶🎤 for maximum impact.' },
    ],
    longContent: `Our Music Symbols collection provides instant access to every musical symbol, note, and instrument emoji you could need. From classic notation symbols to modern emoji, each character is just one click away from your clipboard.

Musical symbols have been used for centuries to transcribe melodies and compositions. Today, these symbols serve both functional and decorative purposes. Whether you're sharing a song recommendation, creating music-themed content, or adding flair to your profile, music symbols communicate universal themes of rhythm and harmony.

Our collection includes traditional notation symbols like treble clefs, notes, and accidentals alongside modern emoji representations of instruments. The quarter note (♩), eighth notes (♪), beamed notes (♫), and sixteenth notes (♬) bring classic sheet music aesthetics to digital text.

Social media has embraced music symbols for expressing love of songs, artists, and genres. Caption your concert photos with 🎤🎸, announce new playlists with 🎧🎵, or add musical personality to your bio. The visual language of music translates seamlessly to digital platforms.

DJs, producers, and musicians use these symbols to brand their content and create recognizable visual identities. Music educators incorporate them into teaching materials. Fans use them to show appreciation and excitement. Whatever your musical purpose, our collection has the perfect symbol.`,
  },
  'religious-symbols': {
    category: 'symbols',
    name: 'Religious Symbols',
    keyword: 'Religious Symbols',
    title: 'Best Religious Symbols Copy and Paste - Free Collection',
    description: 'Copy and paste religious symbols like ✝ ☪ ☯ 🕉 instantly. Free collection of cross, crescent, om, and spiritual symbols.',
    h1: 'Religious Symbols Copy and Paste',
    subtitle: 'Click to copy crosses, crescents, and spiritual symbols.',
    icon: 'star',
    symbolKey: 'religious',
    faq: [
      { q: 'Are religious symbols compatible with social media?', a: 'Yes! All religious symbols work on major platforms including Instagram, Facebook, and Twitter.' },
      { q: 'Can I use these symbols respectfully?', a: 'Please use religious symbols thoughtfully and respectfully, honoring their sacred significance to believers.' },
      { q: 'Why are some symbols from different faiths included?', a: 'Our collection represents major world religions to provide inclusive access to meaningful symbols.' },
      { q: 'Do these symbols work in text messages?', a: 'Yes! Religious symbols can be copied and pasted into SMS, WhatsApp, and other messaging apps.' },
      { q: 'Can I use religious symbols in usernames?', a: 'Most platforms allow religious symbols in usernames, though some may have specific guidelines.' },
    ],
    longContent: `Our Religious Symbols collection offers respectful access to sacred icons from major world religions and spiritual traditions. Each symbol carries deep meaning and history, now available for digital expression with a simple click.

Religious symbols have served as powerful visual representations of faith throughout human history. The cross represents Christianity's central message of redemption, the crescent moon symbolizes Islam, the Star of David connects to Jewish identity, and Om embodies Hindu spiritual concepts. These icons transcend language barriers.

We've curated this collection with respect for the traditions represented. While these symbols serve various purposes in digital communication, we encourage users to employ them thoughtfully. For believers, these icons express identity and devotion. For all users, understanding their significance enriches their use.

Beyond personal expression, religious symbols appear in educational content, interfaith dialogue, and cultural discussions. Journalists, educators, and researchers require access to accurate religious iconography. Our collection provides convenient access without compromising on authenticity or respect.

Whether you're adding a cross to honor your faith, including a peace symbol in your bio, or researching religious iconography, our collection serves your needs. Each symbol copies cleanly and displays consistently across platforms and devices.`,
  },
  'inequality-symbols': {
    category: 'symbols',
    name: 'Inequality Symbols',
    keyword: 'Inequality Symbols',
    title: 'Best Inequality Symbols Copy and Paste - Free Collection',
    description: 'Copy and paste math inequality symbols like ≠ ≤ ≥ ≈ instantly. Free collection of mathematical comparison and set theory symbols.',
    h1: 'Inequality & Math Symbols Copy and Paste',
    subtitle: 'Click to copy mathematical comparison and set symbols.',
    icon: 'calculator',
    symbolKey: 'inequality',
    faq: [
      { q: 'Are inequality symbols compatible with Google Docs?', a: 'Yes! Mathematical symbols can be pasted directly into Google Docs, Word, and other document editors.' },
      { q: 'Can I use these in programming?', a: 'While Unicode math symbols display in code comments and documentation, programming uses ASCII equivalents (<=, >=, !=) for actual code.' },
      { q: 'Why can\'t I find the divided by symbol?', a: 'Check our full math collection! Common symbols like ÷, ×, and ± are included alongside inequalities.' },
      { q: 'Do these work in Excel formulas?', a: 'Excel uses ASCII characters (<, >, =) in formulas. These Unicode symbols are for display purposes.' },
      { q: 'Can students use these for homework?', a: 'Absolutely! These symbols are perfect for typing mathematical homework and assignments.' },
    ],
    longContent: `Our Inequality Symbols collection provides mathematicians, students, and professionals with instant access to essential mathematical comparison and set theory notation. From basic inequalities to advanced logical operators, every symbol is one click away.

Mathematical notation has evolved over centuries to express complex relationships concisely. Inequality symbols like less than (<), greater than (>), and their variations (≤, ≥) form the foundation of mathematical comparison. Our collection extends beyond basics to include approximation (≈), not equal (≠), and set membership (∈) symbols.

Students benefit tremendously from easy symbol access. Typing mathematical homework no longer requires hunting through character maps or memorizing alt codes. Teachers can create professional-looking worksheets and tests. Tutors can communicate clearly in digital spaces.

STEM professionals use these symbols in documentation, presentations, and academic papers. Engineers express tolerances, scientists denote relationships, and statisticians define parameters. Clean, accurate mathematical notation enhances clarity and professionalism.

Beyond formal mathematics, inequality symbols appear in casual digital communication. Express that something is "≥ awesome" or "≠ boring" to add mathematical flair to messages. The versatility of these symbols makes them valuable for both serious work and playful expression.`,
  },
  'japanese-symbols': {
    category: 'symbols',
    name: 'Japanese Symbols',
    keyword: 'Japanese Symbols',
    title: 'Best Japanese Symbols Copy and Paste - Free Collection',
    description: 'Copy and paste Japanese symbols like あ ア 漢 々 instantly. Free collection of hiragana, katakana, and Japanese aesthetic symbols.',
    h1: 'Japanese Symbols Copy and Paste',
    subtitle: 'Click to copy hiragana, katakana, and decorative Japanese characters.',
    icon: 'languages',
    symbolKey: 'japanese',
    faq: [
      { q: 'Are Japanese symbols compatible with Instagram?', a: 'Yes! Japanese characters display beautifully on Instagram and add an aesthetic touch to profiles.' },
      { q: 'What\'s the difference between hiragana and katakana?', a: 'Hiragana is used for native Japanese words, while katakana represents foreign words and emphasis. Both are phonetic.' },
      { q: 'Can I use these to learn Japanese?', a: 'Our collection helps you access characters, but learning Japanese requires understanding grammar, pronunciation, and context.' },
      { q: 'Why are some Japanese aesthetic symbols popular?', a: 'Japanese text aesthetics (like vaporwave and Japanese city pop) have influenced global design trends.' },
      { q: 'Do Japanese symbols work on Western keyboards?', a: 'While typing requires Japanese input methods, our copy-paste symbols work with any keyboard.' },
    ],
    longContent: `Our Japanese Symbols collection brings the elegant characters of Japanese writing to your fingertips. From flowing hiragana to angular katakana and beyond, access the beauty of Japanese typography with simple one-click copying.

Japanese uses three writing systems: hiragana for native words, katakana for foreign words and emphasis, and kanji for meaning-based Chinese characters. Our collection provides samples of each, along with special symbols used in Japanese typography.

Japanese aesthetics have profoundly influenced global design and internet culture. From vaporwave graphics to anime-inspired usernames, Japanese characters add an immediately recognizable style. The symbols evoke themes of technology, tradition, and artistic refinement.

Social media users incorporate Japanese symbols for aesthetic bios, artistic usernames, and cultural appreciation. Gamers create unique handles using Japanese characters. Artists and designers use them in projects spanning fashion, music, and digital media.

While our collection doesn't replace proper Japanese study, it provides convenient access to characters for decorative and creative purposes. Whether you're creating aesthetic content, learning character recognition, or adding international flair to your profiles, these symbols serve your needs.`,
  },
  'heart-symbol-copy-paste': {
    category: 'symbols',
    name: 'Heart Symbols',
    keyword: 'Heart Symbols',
    title: 'Best Heart Symbols Copy and Paste - Free Collection',
    description: 'Copy and paste heart symbols like ❤ 💕 💖 💗 instantly. Free collection of heart emojis and love symbols for social media.',
    h1: 'Heart Symbols Copy and Paste',
    subtitle: 'Click to copy hearts, love symbols, and romantic emojis.',
    icon: 'heart',
    symbolKey: 'hearts',
    faq: [
      { q: 'Are heart symbols compatible with Instagram?', a: 'Yes! Heart symbols and emojis work perfectly on Instagram captions, comments, and bios.' },
      { q: 'What\'s the most popular heart symbol?', a: 'The classic red heart ❤ remains most popular, followed by the two hearts 💕 and sparkling heart 💖.' },
      { q: 'Can I use colored hearts on all platforms?', a: 'Heart emojis display on all modern platforms, though colors may vary slightly between devices.' },
      { q: 'What do different heart colors mean?', a: 'Red = love, orange = care, yellow = friendship, green = health, blue = trust, purple = compassion, black = grief, white = purity.' },
      { q: 'How do I make a heart with keyboard?', a: 'While Alt+3 creates ♥ on Windows, our copy-paste collection is faster and includes more options.' },
    ],
    longContent: `Our Heart Symbols collection offers the complete range of heart expressions for digital communication. From the classic red heart to elaborate decorative variants, find the perfect symbol to express love, care, and affection.

Hearts are the universal symbol of love and emotion. In digital communication, heart symbols and emojis convey feelings that words sometimes cannot. Whether expressing romantic love, friendly affection, or appreciation for content, hearts speak a universal language.

Our collection includes both Unicode heart symbols and modern emoji hearts. Classic symbols like ♡ and ♥ bring timeless elegance, while emoji variants like 💖, 💕, and 💗 add colorful expression. Each heart serves different emotional nuances.

Social media thrives on heart expression. Instagram captions sparkle with heart emojis, Twitter replies overflow with love, and text messages become more meaningful with carefully chosen hearts. The versatility of heart symbols makes them essential for digital connection.

Beyond romance, hearts appear in wellness content, friendship appreciation, and self-care messaging. Fitness influencers use 💪❤️, mental health advocates use 💜, and friendship posts feature 💛. The rainbow of heart colors allows precise emotional expression for any context.`,
  },
  'kaomoji-list': {
    category: 'symbols',
    name: 'Kaomoji List',
    keyword: 'Kaomoji',
    title: 'Best Kaomoji List - Free Copy and Paste Collection',
    description: 'Copy and paste kaomoji like (◕‿◕) ʕ•ᴥ•ʔ (╯°□°）╯ instantly. Free collection of Japanese emoticons for every emotion.',
    h1: 'Kaomoji Copy and Paste',
    subtitle: 'Click to copy Japanese emoticons for every mood and occasion.',
    icon: 'smile',
    symbolKey: 'kaomoji',
    faq: [
      { q: 'Are kaomoji compatible with all platforms?', a: 'Yes! Kaomoji use standard Unicode characters and work on virtually every platform and device.' },
      { q: 'What\'s the difference between kaomoji and emoji?', a: 'Kaomoji are text-based Japanese emoticons using symbols, while emoji are small images. Kaomoji are read right-side-up.' },
      { q: 'Why are kaomoji horizontal unlike :) emoticons?', a: 'Japanese kaomoji are designed to be read without tilting your head, reflecting cultural differences in emotional expression.' },
      { q: 'Can I use kaomoji professionally?', a: 'While kaomoji are generally casual, they\'re increasingly accepted in informal professional communication, especially in creative fields.' },
      { q: 'Why do some kaomoji use special characters?', a: 'Kaomoji artists use characters from various scripts (Cyrillic, Greek, Japanese) to create expressive faces.' },
    ],
    longContent: `Our Kaomoji collection presents the charming world of Japanese text emoticons. These expressive character combinations convey emotions, reactions, and personalities using nothing but keyboard symbols – no images required.

Kaomoji (顔文字, meaning "face characters") originated in Japan and differ fundamentally from Western emoticons. While Western smiley faces like :) are read sideways, kaomoji like (◕‿◕) are viewed straight-on. This orientation allows for more elaborate and expressive designs.

The artistry of kaomoji lies in creative character selection. Artists combine Latin letters, mathematical symbols, Cyrillic characters, and special punctuation to craft faces with remarkable personality. From the cheerful (◕‿◕) to the distressed (╯°□°）╯︵ ┻━┻, each kaomoji tells a story.

Internet culture has embraced kaomoji across languages and platforms. They add personality to messages without requiring emoji support, work in plain text environments, and offer an aesthetic alternative to standard emoji. Many users prefer kaomoji for their artistic, handcrafted feel.

Our collection organizes kaomoji by emotion and occasion. Find happy faces for celebrations, sad faces for sympathy, angry faces for frustration, and cute animal faces for whimsy. Each kaomoji copies cleanly and pastes perfectly, ready to enhance your digital expression.`,
  },
};

// Meme Maker configuration
export const memeMakerConfig = {
  'drake-meme': {
    category: 'meme-maker',
    name: 'Drake Meme',
    keyword: 'Drake Meme Generator',
    title: 'Best Drake Meme Generator - Free Online Tool',
    description: 'Create your own Drake meme instantly with our free generator. Add custom text to the iconic "Drake Approves" meme template.',
    h1: 'Drake Meme Generator',
    subtitle: 'Create the iconic Drake approval/disapproval meme.',
    icon: 'image',
    templateType: 'drake',
    faq: [
      { q: 'Is the Drake Meme Generator free to use?', a: 'Yes! Our generator is 100% free with no watermarks or sign-up required.' },
      { q: 'Can I download my Drake meme?', a: 'Absolutely! Download your creation as a PNG file with one click.' },
      { q: 'What text works best for Drake memes?', a: 'The format is: top = something you reject, bottom = something you prefer. Keep text short and punchy.' },
      { q: 'Can I share Drake memes on social media?', a: 'Yes! Downloaded memes are optimized for sharing on Twitter, Instagram, Facebook, and more.' },
      { q: 'Who is in the Drake meme?', a: 'The meme features rapper Drake from his "Hotline Bling" music video (2015), showing contrasting reactions.' },
    ],
    longContent: `The Drake Meme Generator lets you create the internet's most popular reaction meme in seconds. The iconic two-panel format featuring Drake has become the go-to template for expressing preferences, making comparisons, and delivering relatable humor.

The Drake meme originated from his 2015 "Hotline Bling" music video. Screenshots of Drake looking disapproving (top panel) and approving (bottom panel) perfectly captured the universal experience of rejecting one thing in favor of another. The meme format exploded across social media.

Our generator provides a clean, easy-to-use interface for creating your Drake memes. Simply type your text for each panel, see the preview update in real-time, and download your finished meme. No design skills required – just bring your ideas.

The brilliance of the Drake format lies in its versatility. Express preferences in any domain: technology vs. outdated methods, favorite foods vs. disliked options, good habits vs. bad habits. The format works for everything from workplace humor to relationship jokes to gaming debates.

Created memes download as high-quality PNG files optimized for social media sharing. Post to Twitter, share on Instagram Stories, or send directly to group chats. Our watermark-free output ensures your meme looks professional and shareable.`,
  },
  'speech-bubble-meme': {
    category: 'meme-maker',
    name: 'Speech Bubble Meme',
    keyword: 'Speech Bubble Meme Generator',
    title: 'Best Speech Bubble Meme Generator - Free Online Tool',
    description: 'Add speech bubbles to any image with our free generator. Create memes with customizable text bubbles and thought clouds.',
    h1: 'Speech Bubble Meme Generator',
    subtitle: 'Add customizable speech and thought bubbles to images.',
    icon: 'message-circle',
    templateType: 'speechBubble',
    faq: [
      { q: 'Is the Speech Bubble Generator free?', a: 'Yes! Create unlimited speech bubble memes completely free with no watermarks.' },
      { q: 'Can I upload my own images?', a: 'Our generator works with preset templates. For custom images, the bubble overlay tool is coming soon!' },
      { q: 'What\'s the difference between speech and thought bubbles?', a: 'Speech bubbles (pointed tail) show dialogue; thought bubbles (cloud shape) show inner thoughts.' },
      { q: 'Can I add multiple bubbles?', a: 'Yes! Add as many speech or thought bubbles as needed for your meme.' },
      { q: 'What font is used in speech bubbles?', a: 'We use a classic comic-style font that\'s easily readable and universally recognized.' },
    ],
    longContent: `The Speech Bubble Meme Generator puts the power of comic-style dialogue in your hands. Add speech bubbles, thought clouds, and text overlays to create memes that put words in anyone's mouth – or thoughts in their head.

Speech bubbles are fundamental to visual storytelling, originating in comic strips over a century ago. The convention translates perfectly to internet humor, where adding dialogue to images creates endless comedic possibilities. Our generator makes this process simple and intuitive.

Our tool offers multiple bubble styles to match your creative vision. Classic speech bubbles with pointed tails indicate spoken words. Fluffy thought clouds reveal inner monologues. Shouting bubbles with jagged edges express strong emotions. Each style serves different comedic purposes.

The drag-and-drop interface lets you position bubbles precisely where you want them. Resize bubbles to fit your text, adjust tail directions to point at speakers, and layer multiple bubbles for complex scenes. The real-time preview shows exactly how your meme will look.

Speech bubble memes work brilliantly for reaction images, pet memes, and screenshot commentary. Make your cat "say" something hilarious, add inner thoughts to celebrity photos, or create dialogue between characters. The format's versatility ensures endless creative opportunities.`,
  },
  'bernie-sanders-meme': {
    category: 'meme-maker',
    name: 'Bernie Sanders Meme',
    keyword: 'Bernie Sanders Mittens Meme Generator',
    title: 'Best Bernie Sanders Meme Generator - Free Online Tool',
    description: 'Create your own Bernie Sanders mittens meme instantly. Place Bernie in any scene with our free generator.',
    h1: 'Bernie Sanders Meme Generator',
    subtitle: 'Create the iconic Bernie mittens meme with custom backgrounds.',
    icon: 'armchair',
    templateType: 'bernie',
    faq: [
      { q: 'Is the Bernie Sanders Meme Generator free?', a: 'Yes! Create unlimited Bernie memes for free with no watermarks or sign-ups.' },
      { q: 'What is the Bernie Sanders meme about?', a: 'The meme features Bernie Sanders sitting with mittens at the 2021 Presidential Inauguration, looking cold and unbothered.' },
      { q: 'Can I add Bernie to my own photos?', a: 'Our generator includes popular backgrounds. Custom photo uploads are a planned feature!' },
      { q: 'Why did the Bernie meme become so popular?', a: 'Bernie\'s relatable, no-nonsense appearance at a formal event resonated universally, spawning countless edits.' },
      { q: 'Can I share Bernie memes commercially?', a: 'While the meme is widely shared, commercial use may have different considerations. Personal sharing is generally accepted.' },
    ],
    longContent: `The Bernie Sanders Meme Generator lets you recreate the viral sensation that took over the internet in January 2021. Place Bernie – bundled up in his now-famous mittens and jacket – into any scene for instant comedic impact.

The Bernie meme originated from a photograph taken at President Biden's inauguration. Senator Bernie Sanders, dressed practically in a warm jacket and hand-knit mittens, sat cross-legged among formally dressed attendees. The contrast was immediately meme-worthy.

What made the Bernie meme exceptional was its universal relatability. Bernie's posture – arms crossed, sitting apart from the crowd, seemingly waiting for something to end – captured a feeling everyone has experienced. His practical attire amid formal dress added to the humor.

Our generator captures the essence of the Bernie meme format. Select from popular background scenes – beaches, movie scenes, famous artworks, outer space – and Bernie appears right there, bundled up and unbothered. The absurdity of his presence in any context never fails to amuse.

The meme transcended political boundaries, bringing joy across the spectrum. Bernie himself embraced the phenomenon, selling merchandise with the image for charity. Our generator lets you continue the tradition of placing Bernie wherever imagination takes you.`,
  },
  'change-my-mind-meme': {
    category: 'meme-maker',
    name: 'Change My Mind Meme',
    keyword: 'Change My Mind Meme Generator',
    title: 'Best Change My Mind Meme Generator - Free Online Tool',
    description: 'Create your own "Change My Mind" meme with custom opinions. Free generator for the Steven Crowder debate table meme.',
    h1: 'Change My Mind Meme Generator',
    subtitle: 'Express hot takes with the iconic debate table format.',
    icon: 'coffee',
    templateType: 'changeMyMind',
    faq: [
      { q: 'Is the Change My Mind Generator free?', a: 'Yes! Create unlimited memes for free with no watermarks.' },
      { q: 'What is the Change My Mind meme format?', a: 'The format features someone sitting at a table with a sign stating an opinion, inviting debate.' },
      { q: 'What makes a good Change My Mind meme?', a: 'Bold, confident statements that invite reaction work best. Controversial opinions or absurd claims get the most engagement.' },
      { q: 'Can I edit the sign text?', a: 'Yes! Type your custom opinion and it appears on the sign automatically.' },
      { q: 'Who started the Change My Mind meme?', a: 'The format originated from political commentator Steven Crowder\'s "Change My Mind" campus series.' },
    ],
    longContent: `The Change My Mind Meme Generator lets you stake your claim on any debate with the internet's favorite opinion format. Express hot takes, unpopular opinions, and bold statements using the iconic table-and-sign setup.

The "Change My Mind" format originates from political commentator Steven Crowder's public debate segments where he sets up a table with a sign displaying controversial opinions, inviting passersby to discuss. The internet adapted the format for every topic imaginable.

The meme works because it perfectly captures confident opinion-sharing. The subject sits casually with coffee, sign displayed prominently, essentially saying "this is my stance – challenge me if you dare." The format invites engagement and debate.

Our generator makes creating these memes effortless. Type your opinion, see it rendered on the sign, and download your finished image. Whether you're sharing genuinely held beliefs or posting ironic absurdities, the format amplifies your message.

Best practices for Change My Mind memes include keeping text concise (it needs to fit the sign legibly), choosing genuinely debatable topics, and considering your audience. The most shared versions balance confidence with just enough controversy to spark discussion.`,
  },
};

// Wallpapers configuration
export const wallpapersConfig = {
  'preppy-wallpaper': {
    category: 'wallpapers',
    name: 'Preppy Wallpaper',
    keyword: 'Preppy Wallpaper Generator',
    title: 'Best Preppy Wallpaper Generator - Free Online Tool',
    description: 'Generate preppy aesthetic wallpapers instantly. Create backgrounds with bows, smiley faces, and trendy preppy patterns.',
    h1: 'Preppy Wallpaper Generator',
    subtitle: 'Create trendy preppy aesthetic backgrounds with cute patterns.',
    icon: 'bow-tie',
    generatorType: 'preppy',
    faq: [
      { q: 'Is the Preppy Wallpaper Generator free?', a: 'Yes! Generate unlimited preppy wallpapers at no cost.' },
      { q: 'What is preppy aesthetic?', a: 'Preppy aesthetic features bright colors, bows, smiley faces, and patterns inspired by classic collegiate style with a modern twist.' },
      { q: 'Can I choose my colors?', a: 'Absolutely! Pick from preset color palettes or create custom combinations.' },
      { q: 'What patterns are available?', a: 'Our generator includes argyle, stripes, gingham, bows, smiley faces, and more preppy patterns.' },
      { q: 'What sizes can I download?', a: 'Choose from phone, tablet, desktop, and social media dimensions.' },
    ],
    longContent: `The Preppy Wallpaper Generator creates adorable, trendy backgrounds perfect for the preppy aesthetic that's taken over social media. Generate cute patterns, bright colors, and signature preppy elements like bows, smiley faces, and classic patterns.

Preppy aesthetic blends classic collegiate style with modern colorful expression. Think varsity vibes meets Pinterest boards – argyle patterns, ribbon bows, happy smileys, and a palette of pinks, greens, and blues. Our generator captures this trending look perfectly.

Customization options let you craft the exact preppy vibe you're seeking. Select base patterns, layer decorative elements, choose from curated color palettes or create your own combinations. The result is always Instagram-worthy.

The preppy trend appeals to those seeking positive, polished, and playful device aesthetics. Whether you're a student embracing the academic year with style or anyone attracted to cheerful, put-together visuals, preppy wallpapers deliver the vibe.

Generate matching wallpapers for all your devices – coordinate your phone, tablet, and laptop for the complete preppy experience. New pattern combinations and seasonal elements keep your aesthetic fresh throughout the year.`,
  },
  'aesthetic-wallpaper': {
    category: 'wallpapers',
    name: 'Aesthetic Wallpaper',
    keyword: 'Aesthetic Wallpaper Generator',
    title: 'Best Aesthetic Wallpaper Generator - Free Online Tool',
    description: 'Generate aesthetic wallpapers instantly. Create beautiful backgrounds with vintage vibes, dreamy colors, and trending aesthetics.',
    h1: 'Aesthetic Wallpaper Generator',
    subtitle: 'Create dreamy, visually pleasing backgrounds in trending aesthetics.',
    icon: 'palette',
    generatorType: 'aesthetic',
    faq: [
      { q: 'Is the Aesthetic Wallpaper Generator free?', a: 'Yes! Generate unlimited aesthetic wallpapers at no cost.' },
      { q: 'What aesthetic styles are available?', a: 'We offer dark academia, cottagecore, vaporwave, minimalist, vintage, and more trending aesthetics.' },
      { q: 'Can I create custom color palettes?', a: 'Yes! Use our color picker to create personalized aesthetic combinations.' },
      { q: 'What image sizes are supported?', a: 'Download in phone (1080x1920), desktop (1920x1080), and various social media sizes.' },
      { q: 'Can I use these wallpapers commercially?', a: 'Generated wallpapers are free for personal use. Commercial use is permitted with attribution.' },
    ],
    longContent: `The Aesthetic Wallpaper Generator produces beautiful, atmospheric backgrounds that capture trending visual styles. From dark academia to cottagecore, vaporwave to minimalism, create wallpapers that express your personal aesthetic identity.

"Aesthetic" has evolved beyond its dictionary definition to describe curated visual styles that communicate identity and mood. Each aesthetic – whether cozy cottagecore, mysterious dark academia, or nostalgic vaporwave – carries distinct color palettes, textures, and emotional tones.

Our generator offers multiple aesthetic presets refined from trending online visuals. Select your style, customize colors and elements, and generate backgrounds that feel authentically aesthetic. Each creation is unique, matching algorithms to artistic sensibility.

The power of aesthetic wallpapers lies in personal expression. Your device backgrounds are seen dozens of times daily – they shape your digital environment's mood. Choose wallpapers that inspire, calm, energize, or simply please your eyes.

Experiment with different aesthetics to discover what resonates. Generate dark, moody backgrounds one day and bright, minimal designs the next. Our unlimited generation means you can explore every aesthetic trend without constraints.`,
  },
  'solid-color-backgrounds': {
    category: 'wallpapers',
    name: 'Solid Color Backgrounds',
    keyword: 'Solid Color Background Generator',
    title: 'Best Solid Color Background Generator - Free Online Tool',
    description: 'Generate perfect solid color backgrounds instantly. Create wallpapers in any color with custom hex codes and precise color matching.',
    h1: 'Solid Color Background Generator',
    subtitle: 'Create perfect single-color backgrounds in any shade.',
    icon: 'square',
    generatorType: 'solidColor',
    faq: [
      { q: 'Is the Solid Color Background Generator free?', a: 'Yes! Generate unlimited solid color backgrounds completely free.' },
      { q: 'Can I enter specific hex codes?', a: 'Absolutely! Enter any hex color code for precise color matching to your needs.' },
      { q: 'What sizes are available?', a: 'Download in standard phone, tablet, desktop sizes, or enter custom dimensions.' },
      { q: 'Why would I need a solid color wallpaper?', a: 'Solid colors offer clean minimalism, reduced battery use on OLED screens, and perfect color matching for projects.' },
      { q: 'Can I use these for video backgrounds?', a: 'Yes! Solid color images work perfectly for video backgrounds, green screens, and production use.' },
    ],
    longContent: `The Solid Color Background Generator creates perfect single-color images in any shade imaginable. Whether you need minimalist wallpapers, production backgrounds, or precise color samples, our tool delivers exact results instantly.

Sometimes simplicity is the ultimate sophistication. Solid color backgrounds offer clean visual clarity, eliminating distraction and letting your content or icons take center stage. The minimalist approach appeals to those seeking digital calm.

Our generator supports multiple color input methods. Use the visual color picker for intuitive selection, enter precise hex codes for exact matching, or input RGB values for technical accuracy. Whatever your workflow, we support it.

Practical applications for solid backgrounds are extensive. Product photographers use them for clean backdrops. Video producers create green screens and background plates. Designers generate color samples for client presentations. Users enjoy minimalist wallpapers that extend battery life on OLED screens.

Custom size options mean your solid background fits exactly where you need it. Generate phone wallpapers, desktop backgrounds, social media images, or enter custom dimensions for specific projects. Every download is a perfect, artifact-free solid color.`,
  },
  'gradient-wallpaper-generator': {
    category: 'wallpapers',
    name: 'Gradient Wallpaper Generator',
    keyword: 'Gradient Wallpaper Generator',
    title: 'Best Gradient Wallpaper Generator - Free Online Tool',
    description: 'Generate beautiful gradient wallpapers instantly. Create stunning color transitions with custom colors and gradient styles.',
    h1: 'Gradient Wallpaper Generator',
    subtitle: 'Create smooth, beautiful color gradients for any device.',
    icon: 'blend',
    generatorType: 'gradient',
    faq: [
      { q: 'Is the Gradient Wallpaper Generator free?', a: 'Yes! Generate unlimited gradient wallpapers at no cost.' },
      { q: 'What gradient types are available?', a: 'We offer linear, radial, conic, and multi-stop gradients with full customization.' },
      { q: 'Can I use more than two colors?', a: 'Absolutely! Add as many color stops as you like for complex, beautiful transitions.' },
      { q: 'Can I adjust the gradient angle?', a: 'Yes! Control the angle and direction of linear gradients with precision.' },
      { q: 'What sizes can I download?', a: 'Choose from phone, tablet, desktop sizes, or set custom dimensions.' },
    ],
    longContent: `The Gradient Wallpaper Generator creates stunning color transitions that elevate any device's appearance. Design smooth gradients from subtle to vibrant, with full control over colors, angles, and blend types.

Gradients represent one of design's most versatile tools. The smooth transition between colors creates depth, movement, and visual interest impossible with flat colors. Our generator puts professional gradient creation in your hands with intuitive controls.

Multiple gradient types offer different effects. Linear gradients flow in straight lines at any angle. Radial gradients emanate from a center point. Conic gradients sweep around like a color wheel. Each type creates distinct moods and visual effects.

Color customization is unlimited. Start with two-color gradients or add multiple color stops for complex transitions. Use our curated color combinations or pick your own colors for perfect personalization. Preview changes in real-time before downloading.

Gradient wallpapers work beautifully across contexts. They're sophisticated enough for professional devices, expressive enough for personal style, and subtle enough to not distract from icons and content. Create the perfect backdrop for your digital life.`,
  },
};

// Get all pages for sitemap generation
export function getAllPages() {
  const pages = [];

  Object.keys(toolsConfig).forEach(slug => {
    pages.push({ category: 'tools', slug, ...toolsConfig[slug] });
  });

  Object.keys(symbolsConfig).forEach(slug => {
    pages.push({ category: 'symbols', slug, ...symbolsConfig[slug] });
  });

  Object.keys(memeMakerConfig).forEach(slug => {
    pages.push({ category: 'meme-maker', slug, ...memeMakerConfig[slug] });
  });

  Object.keys(wallpapersConfig).forEach(slug => {
    pages.push({ category: 'wallpapers', slug, ...wallpapersConfig[slug] });
  });

  return pages;
}

// Get page by slug
export function getPageBySlug(category, slug) {
  const configs = {
    tools: toolsConfig,
    symbols: symbolsConfig,
    'meme-maker': memeMakerConfig,
    wallpapers: wallpapersConfig,
  };

  return configs[category]?.[slug] || null;
}

// Get all slugs for a category
export function getSlugsForCategory(category) {
  const configs = {
    tools: toolsConfig,
    symbols: symbolsConfig,
    'meme-maker': memeMakerConfig,
    wallpapers: wallpapersConfig,
  };

  return Object.keys(configs[category] || {});
}


