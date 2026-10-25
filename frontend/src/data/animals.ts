export interface CuteCreature {
  id: string;
  name: string;
  title: string;
  avatar: string;
  soundType: 'purr' | 'bloom' | 'sparkle' | 'pluck' | 'celebration';
  frames: {
    idle: string[];
    happy: string[];
  };
  dialogues: string[];
}

export const CUTE_CREATURES: CuteCreature[] = [
  {
    id: 'kitty',
    name: 'Mimi the Botanical Kitten',
    title: 'Purrs whenever you bring her fresh daisies',
    avatar: '🐱',
    soundType: 'purr',
    frames: {
      idle: [
        '<kittyFur>      |\\---/|   </kittyFur><daisyPetal>  _ _  </daisyPetal>',
        '<kittyFur>      | </kittyFur><blush>o_o</blush><kittyFur> |   </kittyFur><daisyCenter>(*)</daisyCenter><white>❀</white>',
        '<kittyFur>       \\_^_/   </kittyFur><stem>   |</stem>',
        '<kittyFur>      /|   |\\ </kittyFur>',
        '<kittyFur>     (_|_|_|_)~ </kittyFur>',
      ],
      happy: [
        '<kittyFur>      |\\---/|   </kittyFur><daisyPetal>  _ _  </daisyPetal>',
        '<kittyFur>      | </kittyFur><heart>^‿^</heart><kittyFur> |   </kittyFur><daisyCenter>(*)</daisyCenter><white>❀</white><sparkle> *</sparkle>',
        '<kittyFur>      =< </kittyFur><heart>♥</heart><kittyFur> >=  </kittyFur><stem>  |</stem>',
        '<kittyFur>     /|  </kittyFur><heart>♥</heart><kittyFur> |\\ </kittyFur>',
        '<kittyFur>    (_|_|_|_)~~<sparkle>♪</sparkle></kittyFur>',
      ],
    },
    dialogues: [
      'Purrrr! Sreeparna is the sweet human who loves flowers! (=^･ω･^=)♥',
      '*nuzzles your hand gently* Meow! You deserve all the sunflowers today!',
      'I found this daisy especially for you, pretty girl! 🌼',
      '*purrrrrrrrrr* Ishan asked me to give you a secret forehead kiss! 🌸',
    ],
  },
  {
    id: 'bunny',
    name: 'Bunbun the Meadow Hopper',
    title: 'Holds a golden sunflower for Sreeparna',
    avatar: '🐰',
    soundType: 'bloom',
    frames: {
      idle: [
        '<bunnyFur>     (\\_/)     </bunnyFur><sunflower>  .-~~-.  </sunflower>',
        '<bunnyFur>    ( •.• )    </bunnyFur><sunflower> / <sunseed>(##)</sunseed> \\ </sunflower>',
        '<bunnyFur>   c(")(")     </bunnyFur><sunflower> \\ <sunseed>(##)</sunseed> / </sunflower>',
        '<bunnyFur>               </bunnyFur><stem>   ||     </stem>',
      ],
      happy: [
        '<bunnyFur>     (\\(\\      </bunnyFur><sunflower>  .-~~-.  </sunflower><sparkle>✨</sparkle>',
        '<bunnyFur>    ( >.< )っ  </bunnyFur><sunflower> / <sunseed>(##)</sunseed> \\ </sunflower>',
        '<bunnyFur>   o(")(")     </bunnyFur><stem>   ||     </stem>',
        '<heart>     *♥*       </heart><leaf>  ~//\\\\~  </leaf>',
      ],
    },
    dialogues: [
      '*hop hop* I grew this sunflower in the sunshine just for Sreeparna! 🌻',
      '*wiggles nose* You smell like fresh lilacs and happy moments!',
      'If cuteness was a flower, you would be the biggest bloom in the universe! 🐰',
    ],
  },
  {
    id: 'bear',
    name: 'Barnaby the Hug Bear',
    title: 'Warm giant fuzzy hugs on cloudy days',
    avatar: '🧸',
    soundType: 'celebration',
    frames: {
      idle: [
        '<amber>    ʕ •ᴥ•ʔ     </amber><lilyPetal>  /\\  </lilyPetal>',
        '<amber>   (っ </amber><heart>♥</heart><amber> っ)    </amber><lilyPetal>.-./\\.-.</lilyPetal>',
        '<amber>    (     )    </amber><stem>  ||  </stem>',
        '<amber>    (o___o)    </amber>',
      ],
      happy: [
        '<amber>    ʕ ᵔᴥᵔ ʔっ  </amber><lilyPetal>  /\\  </lilyPetal><sparkle>✦</sparkle>',
        '<amber>   (っ </amber><heart>♥ S ♥</heart><amber> っ) </amber><lilyPetal>.-./\\.-.</lilyPetal>',
        '<amber>    (     )    </amber><stem>  ||  </stem>',
        '<sparkle>    * ｡ ✧ ｡ *   </sparkle>',
      ],
    },
    dialogues: [
      'Sending a 100% genuine fuzzy warm bear hug straight to Sreeparna! 🧸',
      'Whenever you feel tired or need a smile, I will always be here hugging this flower!',
      'You are so deeply loved and treasured every single day, Sreeparna!',
    ],
  },
  {
    id: 'duck',
    name: 'Ducky & the Water Lily',
    title: 'Drifting serenely on crystal lily pond',
    avatar: '🦆',
    soundType: 'pluck',
    frames: {
      idle: [
        '<duckBody>      >(•ө•)      </duckBody><lilyPetal>   _(_)_   </lilyPetal>',
        '<duckBody>     __( )_>     </duckBody><lilyPetal>  (_)@(_)  </lilyPetal>',
        '<pondWater>   ~~~~~~~~~~~~~ </pondWater><leaf>   (_/ \\_)  </leaf>',
        '<pondWater>    ~  .  °  ~   </pondWater><leaf>  ~~~~~~~~~ </leaf>',
      ],
      happy: [
        '<duckBody>     \\(>‿<)/     </duckBody><lilyPetal>   _(_)_   </lilyPetal><sparkle>°</sparkle>',
        '<duckBody>     __( <heart>♥</heart> )_>    </duckBody><lilyPetal>  (_)@(_)  </lilyPetal>',
        '<pondWater>   ~~~ quack! ~~~</pondWater><leaf>   (_/ \\_)  </leaf>',
        '<pondWater>    °  ~  .  ~   </pondWater><leaf>  ~~~~~~~~~ </leaf>',
      ],
    },
    dialogues: [
      'Quack! Floating along peacefully thinking how lucky Ishan is to have you! 🌊',
      'Splish splash! The water lilies are blushing because you are so pretty!',
      'Quack quack! Stay hydrated and have the loveliest day today!',
    ],
  },
  {
    id: 'butterfly',
    name: 'Luna & Nova (Twin Butterflies)',
    title: 'Dancing around blooming petals',
    avatar: '🦋',
    soundType: 'sparkle',
    frames: {
      idle: [
        '<blush>    ƸӜƷ </blush><sparkle> ·   °  </sparkle><forgetmenot> }i{ </forgetmenot>',
        '<sparkle>     °   *  ·   .   </sparkle>',
        '<lavender>    *:.｡.::*:.｡.::* </lavender>',
      ],
      happy: [
        '<heart>   * ƸӜƷ * </heart><sparkle> ✧ </sparkle><forgetmenot> * }i{ * </forgetmenot>',
        '<sparkle>    · ｡ ✦ ° · ｡ ✦   </sparkle>',
        '<lavender>    *:.｡.::*:.｡.::* </lavender>',
      ],
    },
    dialogues: [
      'Flutter flutter! We flew over 100 meadows, and you are the rarest blossom of all! ✨',
      'We bring fairy dust and sweet wishes to Sreeparna! 🧚‍♀️',
    ],
  },
];
