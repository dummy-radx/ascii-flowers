import type { FlowerData, BouquetWrapper } from '../types';

export const FLOWERS: FlowerData[] = [
  {
    id: 'sunflower',
    name: 'Radiant Sunflower',
    type: 'sunflower',
    symbol: '🌻',
    meaning: 'Adoration, warmth, loyalty & bright joy',
    description: 'Always turns to face your light, just like how I look at you Sreeparna!',
    primaryColor: '#fbbf24',
    secondaryColor: '#78350f',
    asciiArt: [
      '<sunflower>      .-~~-.      </sunflower>',
      '<sunflower>    /   /\\   \\    </sunflower>',
      '<sunflower>   |  / <sunseed>(#)</sunseed> \\  |   </sunflower>',
      '<sunflower>  /  <sunseed>(#######)</sunseed>  \\  </sunflower>',
      '<sunflower>  | <sunseed>(#########)</sunseed> |  </sunflower>',
      '<sunflower>  \\  <sunseed>(#######)</sunseed>  /  </sunflower>',
      '<sunflower>   |  \\ <sunseed>(#)</sunseed> /  |   </sunflower>',
      '<sunflower>    \\   \\/   /    </sunflower>',
      '<sunflower>      `-..-\'      </sunflower>',
      '<stem>        ||        </stem>',
      '<leaf>   ~-(_ || _)~-   </leaf>',
      '<stem>        ||        </stem>',
      '<leaf>     __// \\\\__    </leaf>',
      '<stem>        ||        </stem>',
    ],
    plainAscii: `      .-~~-.
    /   /\\   \\
   |  / (#) \\  |
  /  (#######)  \\
  | (#########) |
  \\  (#######)  /
   |  \\ (#) /  |
    \\   \\/   /
      \`-..-'
        ||
   ~-(_ || _)-~
        ||
     __// \\\\__
        ||`,
  },
  {
    id: 'daisy',
    name: 'Gentle Daisy',
    type: 'daisy',
    symbol: '🌼',
    meaning: 'Innocence, pure love & cheerful thoughts',
    description: 'Dainty white petals around a sunlit gold heart, soft and pure like your laughter.',
    primaryColor: '#f8fafc',
    secondaryColor: '#facc15',
    asciiArt: [
      '<white>       _ _       </white>',
      '<white>     /  _  \\     </white>',
      '<white>   _ \\ ( ) / _   </white>',
      '<white>  ( \\ \\<daisyCenter>(*)</daisyCenter>/ / )  </white>',
      '<white> ( <daisyCenter>-(*)</daisyCenter><daisyCenter><sunflower>(*)</sunflower></daisyCenter><daisyCenter>(*)-</daisyCenter> ) </white>',
      '<white>  ( / /<daisyCenter>(*)</daisyCenter>\\ \\ )  </white>',
      '<white>   ~ / ( ) \\ ~   </white>',
      '<white>     \\ _ _ /     </white>',
      '<stem>        |        </stem>',
      '<leaf>     .--|--.     </leaf>',
      '<leaf>    (  /|\\  )    </leaf>',
      '<stem>        |        </stem>',
      '<leaf>      \\_|_/      </leaf>',
      '<stem>        |        </stem>',
    ],
    plainAscii: `       _ _
     /  _  \\
   _ \\ ( ) / _
  ( \\ \\(*)/ / )
 ( -(*)(*)(*)- )
  ( / /(*)\\ \\ )
   ~ / ( ) \\ ~
     \\ _ _ /
        |
     .--|--.
    (  /|\\  )
        |
      \\_|_/
        |`,
  },
  {
    id: 'lily',
    name: 'Stargazer Lily',
    type: 'lily',
    symbol: '🌸',
    meaning: 'Magnificence, devotion & grace',
    description: 'Exquisite flared petals with delicate stamens, graceful and deeply cherished.',
    primaryColor: '#f472b6',
    secondaryColor: '#db2777',
    asciiArt: [
      '<lilyPetal>        /\\        </lilyPetal>',
      '<lilyPetal>       /  \\       </lilyPetal>',
      '<lilyPetal>   .-./ /\\ \\.-.   </lilyPetal>',
      '<lilyPetal>  (  / <lilyDeep>\\  /</lilyDeep> \\  )  </lilyPetal>',
      '<lilyPetal>   \\/ <lilyDeep>/`\\/`\\</lilyDeep> \\/   </lilyPetal>',
      '<lilyDeep>   / ( <lilyPollen>i  i</lilyPollen> ) \\   </lilyDeep>',
      '<lilyPetal>  (   \\<lilyPollen>_\\/_</lilyPollen>/   )  </lilyPetal>',
      '<lilyPetal>   `-./ || \\.-`   </lilyPetal>',
      '<lilyPetal>      \\_||_/      </lilyPetal>',
      '<stem>        ||        </stem>',
      '<leaf>    .---||---.    </leaf>',
      '<leaf>   (   _||_   )   </leaf>',
      '<stem>        ||        </stem>',
      '<leaf>     \\__||__/     </leaf>',
      '<stem>        ||        </stem>',
    ],
    plainAscii: `        /\\
       /  \\
   .-./ /\\ \\.-.
  (  / \\  / \\  )
   \\/ /\`\\/\`\\ \\/
   / ( i  i ) \\
  (   \\_\\/_/   )
   \`-./ || \\.-\`
      \\_||_/
        ||
    .---||---.
   (   _||_   )
        ||
     \\__||__/
        ||`,
  },
  {
    id: 'tulip',
    name: 'Pastel Tulip',
    type: 'tulip',
    symbol: '🌷',
    meaning: 'Deep affection & blossoming hope',
    description: 'A cozy cup full of sweet moments and secret smiles.',
    primaryColor: '#fb923c',
    secondaryColor: '#f43f5e',
    asciiArt: [
      '<tulipPeach>      .-~~-.      </tulipPeach>',
      '<tulipPink>    /  /\\  \\     </tulipPink>',
      '<tulipPeach>   |  |  |  |    </tulipPeach>',
      '<tulipPink>   |  |  |  |    </tulipPink>',
      '<tulipPeach>   \\  \\  /  /    </tulipPeach>',
      '<tulipPink>    \\  `\'  /     </tulipPink>',
      '<tulipPeach>     `----\'      </tulipPeach>',
      '<stem>        |        </stem>',
      '<leaf>     /\\ | /\\     </leaf>',
      '<leaf>    (  \\|/  )    </leaf>',
      '<leaf>     \\  |  /     </leaf>',
      '<stem>        |        </stem>',
      '<stem>        |        </stem>',
    ],
    plainAscii: `      .-~~-.
    /  /\\  \\
   |  |  |  |
   |  |  |  |
   \\  \\  /  /
    \\  \`'  /
     \`----'
        |
     /\\ | /\\
    (  \\|/  )
     \\  |  /
        |
        |`,
  },
  {
    id: 'lavender',
    name: 'Fragrant Lavender',
    type: 'lavender',
    symbol: '🪻',
    meaning: 'Serenity, soothing dreams & calm comfort',
    description: 'Slender aromatic purple florets that whisper sweet dreams into the evening air.',
    primaryColor: '#c084fc',
    secondaryColor: '#9333ea',
    asciiArt: [
      '<lavender>        ()        </lavender>',
      '<lavenderDeep>       ((()))     </lavenderDeep>',
      '<lavender>      (((())))    </lavender>',
      '<lavenderDeep>       ((()))     </lavenderDeep>',
      '<lavender>      (((())))    </lavender>',
      '<lavenderDeep>       ((()))     </lavenderDeep>',
      '<lavender>        (())      </lavender>',
      '<stem>         ||       </stem>',
      '<leaf>     |/  ||  \\|   </leaf>',
      '<leaf>     \\\\  ||  //   </leaf>',
      '<stem>         ||       </stem>',
      '<leaf>      \\__||__/    </leaf>',
      '<stem>         ||       </stem>',
    ],
    plainAscii: `        ()
       ((()))
      (((())))
       ((()))
      (((())))
       ((()))
        (())
         ||
     |/  ||  \\|
     \\\\  ||  //
         ||
      \\__||__/
         ||`,
  },
  {
    id: 'forgetmenot',
    name: 'Sky Forget-Me-Not',
    type: 'forgetmenot',
    symbol: '🫐',
    meaning: 'Enduring love, fond memories & fidelity',
    description: 'Tiny star flowers as blue as twilight, promising you are never forgotten.',
    primaryColor: '#38bdf8',
    secondaryColor: '#facc15',
    asciiArt: [
      '<forgetmenot>       .-.       </forgetmenot>',
      '<forgetmenot>    .-/   \\-.    </forgetmenot>',
      '<forgetmenot>   ( ( <daisyCenter>(*)</daisyCenter> ) )   </forgetmenot>',
      '<forgetmenot>    `-\\   /-`    </forgetmenot>',
      '<forgetmenot>       `-`       </forgetmenot>',
      '<stem>        |        </stem>',
      '<forgetmenot>    *   |   *    </forgetmenot>',
      '<leaf>     \\.-|-./     </leaf>',
      '<stem>        |        </stem>',
      '<leaf>     .-/ \\-.     </leaf>',
      '<stem>        |        </stem>',
    ],
    plainAscii: `       .-.
    .-/   \\-.
   ( ( (*) ) )
    \`-\\   /-\`
       \`-\`
        |
    *   |   *
     \\.-|-./
        |
     .-/ \\-.
        |`,
  },
  {
    id: 'orchid',
    name: 'Fairy Orchid',
    type: 'orchid',
    symbol: '✨',
    meaning: 'Uncommon beauty, refinement & charm',
    description: 'Whimsical butterfly-shaped blooms painted with soft lavender and magenta.',
    primaryColor: '#e879f9',
    secondaryColor: '#c084fc',
    asciiArt: [
      '<orchid>       _.._       </orchid>',
      '<orchid>    .-\'  / \\`-.    </orchid>',
      '<orchid>   (  <blush>(*)</blush> <daisyCenter>(o)</daisyCenter> <blush>(*)</blush> )   </orchid>',
      '<orchid>    `-.  \\ / .-\'   </orchid>',
      '<orchid>       `~\"~`       </orchid>',
      '<stem>         |        </stem>',
      '<leaf>     ~-._|_.-~    </leaf>',
      '<stem>         |        </stem>',
      '<leaf>       /\\|/\\      </leaf>',
      '<stem>         |        </stem>',
    ],
    plainAscii: `       _.._
    .-'  / \\\`-.
   (  (*) (o) (*) )
    \`-.  \\ / .-'
       \`~"~\`
         |
     ~-._|_.-~
         |
       /\\|/\\
         |`,
  },
];

export const WRAPPERS: BouquetWrapper[] = [
  {
    id: 'ribbon',
    name: 'Satin Bow & Silk Ribbon',
    icon: '🎀',
    description: 'A luxurious soft pink silk ribbon tied in a double bow around the stems.',
    color: '#ec4899',
    asciiWrapTop: [
      '<leaf>       \\ \\ \\ | / / /       </leaf>',
      '<stem>        \\ \\ \\|/ / /        </stem>',
      '<ribbon>      .---====---.       </ribbon>',
      '<ribbon>     (   <white>>---🎀---<</white>   )      </ribbon>',
      '<ribbon>      `---====---\'       </ribbon>',
    ],
    asciiWrapBottom: [
      '<ribbon>          /|  |\\         </ribbon>',
      '<ribbon>         / |  | \\        </ribbon>',
      '<ribbon>        /_/    \\_\\       </ribbon>',
      '<stem>          | | |          </stem>',
      '<stem>          |/ \\|          </stem>',
      '<sparkle>           * . °         </sparkle>',
    ],
  },
  {
    id: 'kraft',
    name: 'Florist Kraft Wrap with Wax Seal',
    icon: '📜',
    description: 'Warm rustic butcher paper folded with twine and a sweet wax stamp for Sreeparna.',
    color: '#d97706',
    asciiWrapTop: [
      '<kraft>     /\\              /\\    </kraft>',
      '<kraft>    /  \\____________/  \\   </kraft>',
      '<kraft>   /    \\          /    \\  </kraft>',
      '<kraft>  /______\\________/______\\ </kraft>',
    ],
    asciiWrapBottom: [
      '<kraft>   \\                    /  </kraft>',
      '<kraft>    \\   <heart> [ ♥ S+I ] </heart>   /   </kraft>',
      '<kraft>     \\                /    </kraft>',
      '<kraft>      \\              /     </kraft>',
      '<kraft>       \\____________/      </kraft>',
      '<kraftLight>          \\  ||  /         </kraftLight>',
      '<kraftLight>           \\_||_/          </kraftLight>',
    ],
  },
  {
    id: 'glass',
    name: 'Crystal Water Vase',
    icon: '🏺',
    description: 'Clear crystal flute reflecting dancing lights with fresh pure water.',
    color: '#38bdf8',
    asciiWrapTop: [
      '<glass>       .-~~~~~~~~-.        </glass>',
      '<glass>      (  __    __  )       </glass>',
      '<glass>       \\ `~----~` /        </glass>',
    ],
    asciiWrapBottom: [
      '<glass>       |  <pondWater>~ .  ° ~</pondWater>  |        </glass>',
      '<glass>       | <pondWater>~  .  ~ °</pondWater> |        </glass>',
      '<glass>       |  <pondWater>° .  ~ .</pondWater>  |        </glass>',
      '<glass>       | <pondWater>~  °  ~ .</pondWater> |        </glass>',
      '<glass>      (____________)       </glass>',
      '<glass>      /============\\       </glass>',
    ],
  },
  {
    id: 'basket',
    name: 'Woven Garden Basket',
    icon: '🧺',
    description: 'Rustic picnic basket filled with meadow blooms picked specially for her.',
    color: '#92400e',
    asciiWrapTop: [
      '<basket>       .----------.        </basket>',
      '<basket>      /  (  ||  )  \\       </basket>',
      '<basket>     /____\\_||_/____\\      </basket>',
    ],
    asciiWrapBottom: [
      '<basket>    /================\\     </basket>',
      '<basket>   | # # # # # # # # |     </basket>',
      '<basket>   | # # # # # # # # |     </basket>',
      '<basket>   | # # # # # # # # |     </basket>',
      '<basket>    \\================/     </basket>',
      '<dim>      `------------`       </dim>',
    ],
  },
  {
    id: 'newspaper',
    name: 'The Sreeparna Times Newsprint',
    icon: '📰',
    description: 'Vintage printed newspaper with cute romantic headlines.',
    color: '#e2e8f0',
    asciiWrapTop: [
      '<paper>   .------------------------.  </paper>',
      '<paper>   |  THE SREEPARNA TIMES  |  </paper>',
      '<paper>   |-- 100% PRETTIEST GIRL -|  </paper>',
    ],
    asciiWrapBottom: [
      '<paper>   \\  "Locals confirmed:  /   </paper>',
      '<paper>    \\ She is the cutest!"/    </paper>',
      '<paper>     \\  [ 25-OCT ]      /     </paper>',
      '<paper>      \\                /      </paper>',
      '<paper>       \\______________//       </paper>',
      '<stem>             ||||              </stem>',
    ],
  },
];
