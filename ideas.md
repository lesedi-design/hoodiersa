# HoodieRSA Website Design Directions

## Three possible directions

### 1. Haunted Editorial
**Very Brief Intro:** An editorial fashion campaign translated into a shop, pairing theatrical oversized type with photographed garments and loose, poster-like composition. It should feel like a limited-run Halloween lookbook rather than a conventional store.

**Probability:** 0.04

### 2. Basement Print Shop
**Very Brief Intro:** A gritty, handmade merch-table aesthetic combining ink-black paper, imperfect screen-print marks, and stamped labels. The personality is intimate and analogue, built around the craft of embroidery.

**Probability:** 0.08

### 3. Sunday Spook Club
**Very Brief Intro:** A cheerfully eerie youth-club world with soft pastel panels, playful shapes, and clean catalog photography. It would use a bright, collectible mood rather than fashion-editorial drama.

**Probability:** 0.06

---

## Chosen direction: Haunted Editorial

### Design Movement
**Haunted Editorial** is a contemporary fashion-editorial interpretation of horror-poster design: high-impact headline typography, deliberate cropping, pop-pastel flashes, and a photography-first hierarchy. The layout treats every collection as a campaign spread.

### Core Principles
1. **Product as protagonist:** Large cutout apparel imagery should overlap typography and occupy the visual center of important sections.
2. **Poster-scale hierarchy:** Display type, slim information strips, index numbers, and near-oversized whitespace create a recognisable editorial cadence.
3. **Tactile imperfection:** Fine grain, dashed stitch lines, roughened rules, and selective halftone dots imply human-made embroidery without obscuring clarity.
4. **Controlled contrast:** Deep ink-black surfaces heighten restrained flashes of blood red, powder pink, stone grey, and ghost white.

### Color Philosophy
Black acts as the photographic studio and makes the embroidery colors feel collected, not cluttered. Bone white carries type and information at high contrast; **Ritual Red** supplies the most urgent call-to-action and the first collection's theatrical energy. Pastel rose and cold grey stay localized to the carousel/product-line backgrounds, evoking faded Halloween candy and cemetery stone rather than a generic seasonal palette.

### Layout Paradigm
The experience follows a **campaign-wall sequence** rather than a centered commerce grid: a full-bleed carousel opens the story, a narrow rolling manifesto interrupts the scroll, and a staggered product gallery leans imagery alternately left and right. Product facts sit in small, label-like panels anchored to the work, while the ordering route remains consistently available.

### Signature Elements
1. A gigantic, nearly full-bleed ghost headline behind the featured garment.
2. A red stitched-line motif that winds through dividers, price labels, and active carousel controls.
3. Offset collection-number blocks (01–04) that feel like magazine folios and give the line a serial nature.

### Interaction Philosophy
Interactions should feel like handling a printed campaign book. Carousel navigation slides with a purposeful 650 ms transition; hover states reveal inventory and colorway notes through quick, restrained shifts. Ordering actions are unequivocal, leading directly to WhatsApp or Instagram with context in the pre-filled message.

### Animation
Use a single soft editorial easing curve (`cubic-bezier(0.4, 0, 0.2, 1)`) for the hero's 650 ms carousel movement, background changes, image position, and blur. Everything else should be quieter: 150–220 ms button feedback, subtle translateY reveals for product details, and a low-speed marquee. Support `prefers-reduced-motion` by removing transforms and looping motion while preserving state changes.

### Typography System
**Anton** provides the all-caps campaign headlines, giant ghost words, collection digits, and key order CTA. **DM Sans** carries navigation, product information, and longer craft copy; its round clarity stops the site from becoming costume-like. Headline tracking is tight, information labels are tracked out, and body paragraphs stay comfortably loose at 1.55–1.7 line-height.

### Brand Essence
**HoodieRSA turns hand-embroidered spooky icons into limited-run pieces for people who dress Halloween year-round.**

**Personality:** theatrical, handmade, unapologetic.

### Brand Voice
Headlines are concise, cinematic, and a little mischievous. CTAs sound like a direct invitation to claim a drop; microcopy is practical and friendly rather than salesy.

> “Wear the weird stuff.”
>
> “Claim yours before the thread runs out.”

### Wordmark & Logo
The mark should be a simple **stitching loop that becomes a crescent-shaped ghost tail**, ending in a sharpened needle point. It has no type within it and is usable as a red embroidered badge, favicon, or social avatar. The wordmark pairs it with a compact, tight-tracked Anton treatment of “HOODIE / RSA”.

### Signature Brand Color
**Ritual Red — #B5342E.** A warm red resembling a vintage slasher-poster ink, used for stitches, order prompts, focus states, and the most important product moments.

## Style Decisions

- The primary identity pairs the red stitching-loop/ghost-tail emblem with a tight Anton **HOODIE / RSA** wordmark; it is never presented as plain navigation text.
- Pastel rose is a faded-candy campaign panel, always held inside ink-black framing with Ritual Red stitch details or poster-scale type.
- Tactile imperfection is present in every major section through a controlled mix of grain, thread rules, halftone, rough labels, or dashed stitching while preserving legibility.
