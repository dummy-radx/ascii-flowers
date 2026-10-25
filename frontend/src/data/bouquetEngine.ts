import { FlowerData, BouquetWrapper } from '../types';
import { FLOWERS, WRAPPERS } from './flowers';

export interface BouquetConfig {
  sunflower: number;
  daisy: number;
  lily: number;
  tulip: number;
  lavender: number;
  forgetmenot: number;
  orchid: number;
  wrapperId: string;
  recipientName: string;
  senderName: string;
  customMessage: string;
}

export const DEFAULT_BOUQUET_CONFIG: BouquetConfig = {
  sunflower: 2,
  daisy: 3,
  lily: 2,
  tulip: 1,
  lavender: 3,
  forgetmenot: 2,
  orchid: 1,
  wrapperId: 'ribbon',
  recipientName: 'Sreeparna',
  senderName: 'Ishan',
  customMessage: 'You make every day blossom with warmth & happiness!',
};

// Generates an ASCII bouquet based on flower counts and wrapper
export function generateMixedBouquet(config: BouquetConfig): {
  lines: string[];
  plainText: string;
  totalFlowers: number;
  flowerListText: string;
} {
  const activeFlowers: { flower: FlowerData; count: number }[] = [];
  let totalFlowers = 0;

  for (const f of FLOWERS) {
    const count = (config as unknown as Record<string, number>)[f.id] || 0;
    if (count > 0) {
      activeFlowers.push({ flower: f, count });
      totalFlowers += count;
    }
  }

  // If no flowers selected, give at least 1 sunflower and 2 daisies
  if (totalFlowers === 0) {
    activeFlowers.push(
      { flower: FLOWERS[0], count: 1 },
      { flower: FLOWERS[1], count: 2 }
    );
    totalFlowers = 3;
  }

  const wrapper = WRAPPERS.find((w) => w.id === config.wrapperId) || WRAPPERS[0];

  const hasSunflower = (config.sunflower || 0) > 0;
  const hasDaisy = (config.daisy || 0) > 0;
  const hasLily = (config.lily || 0) > 0;
  const hasTulip = (config.tulip || 0) > 0;
  const hasLavender = (config.lavender || 0) > 0;
  const hasForgetmenot = (config.forgetmenot || 0) > 0;
  const hasOrchid = (config.orchid || 0) > 0;

  const lines: string[] = [];

  // 1. Sky & Fluttering accents
  lines.push('<sparkle>         *          ✧         °          *          ✧        </sparkle>');
  lines.push('<heart>      }i{    <sparkle>·</sparkle>       <blush>ƸӜƷ</blush>       <sparkle>°</sparkle>       <heart>♥</heart>       <sparkle>·</sparkle>    }i{    </heart>');

  // 2. High crown layer (Lavender, Lilies & Tulips reaching up)
  const crownLine1 =
    (hasLavender ? '<lavender>      ()      </lavender>' : '              ') +
    (hasLily ? '<lilyPetal>     /\\     </lilyPetal>' : '            ') +
    (hasLavender ? '<lavender>      ()      </lavender>' : '              ');
  lines.push(crownLine1);

  const crownLine2 =
    (hasLavender ? '<lavenderDeep>     ((()))   </lavenderDeep>' : '              ') +
    (hasLily ? '<lilyPetal>   .-./ /\\ \\.-.</lilyPetal>' : '            ') +
    (hasLavender ? '<lavenderDeep>   ((()))     </lavenderDeep>' : '              ');
  lines.push(crownLine2);

  // 3. Main Bloom canopy
  // Left: Daisy or Tulip | Center: Radiant Sunflower | Right: Lily or Orchid
  if (hasSunflower) {
    lines.push(
      (hasDaisy ? '<white>   _ \\ ( ) / _  </white>' : '                ') +
      '<sunflower>   .-~~-.   </sunflower>' +
      (hasLily ? '<lilyPetal>  (  / \\  / \\  )</lilyPetal>' : hasTulip ? '<tulipPeach>   .-~~-.       </tulipPeach>' : '                ')
    );
    lines.push(
      (hasDaisy ? '<white>  ( \\ \\<daisyCenter>(*)</daisyCenter>/ / ) </white>' : '                ') +
      '<sunflower> / <sunseed>(####)</sunseed> \\ </sunflower>' +
      (hasLily ? '<lilyPetal>   \\/ <lilyDeep>/`\\/`\\</lilyDeep> \\/  </lilyPetal>' : hasTulip ? '<tulipPink>  /  /\\  \\      </tulipPink>' : '                ')
    );
    lines.push(
      (hasDaisy ? '<white> ( <daisyCenter>-(*)</daisyCenter><daisyCenter><sunflower>(*)</sunflower></daisyCenter><daisyCenter>(*)-</daisyCenter> )</white>' : (hasForgetmenot ? '<forgetmenot>   ( ( <daisyCenter>(*)</daisyCenter> ) )   </forgetmenot>' : '                ')) +
      '<sunflower> | <sunseed>(######)</sunseed>| </sunflower>' +
      (hasLily ? '<lilyDeep>   / ( <lilyPollen>i  i</lilyPollen> ) \\  </lilyDeep>' : hasTulip ? '<tulipPeach>  |  |  |  |    </tulipPeach>' : '                ')
    );
    lines.push(
      (hasDaisy ? '<white>  ( / /<daisyCenter>(*)</daisyCenter>\\ \\ ) </white>' : '                ') +
      '<sunflower> \\ <sunseed>(####)</sunseed> / </sunflower>' +
      (hasLily ? '<lilyPetal>  (   \\_\\/_/   ) </lilyPetal>' : hasTulip ? '<tulipPink>  \\  \\  /  /    </tulipPink>' : '                ')
    );
    lines.push(
      (hasDaisy ? '<white>   ~ / ( ) \\ ~  </white>' : '                ') +
      '<sunflower>   `-..-\'   </sunflower>' +
      (hasLily ? '<lilyPetal>   `-./ || \\.-`  </lilyPetal>' : hasTulip ? '<tulipPeach>    `----\'      </tulipPeach>' : '                ')
    );
  } else {
    // Bouquet without sunflower (Lilies, Daisies, Tulips)
    lines.push(
      (hasDaisy ? '<white>    _ \\ ( ) / _    </white>' : '                   ') +
      (hasLily ? '<lilyPetal>    /\\    </lilyPetal>' : '          ') +
      (hasTulip ? '<tulipPeach>     .-~~-.     </tulipPeach>' : '                ')
    );
    lines.push(
      (hasDaisy ? '<white>   ( \\ \\<daisyCenter>(*)</daisyCenter>/ / )   </white>' : '                   ') +
      (hasLily ? '<lilyPetal>  .-./ /\\ \\.-.</lilyPetal>' : '          ') +
      (hasTulip ? '<tulipPink>   /  /\\  \\    </tulipPink>' : '                ')
    );
    lines.push(
      (hasDaisy ? '<white>  ( <daisyCenter>-(*)</daisyCenter><daisyCenter><sunflower>(*)</sunflower></daisyCenter><daisyCenter>(*)-</daisyCenter> )  </white>' : '                   ') +
      (hasLily ? '<lilyPetal> (  / <lilyDeep>\\  /</lilyDeep> \\  )</lilyPetal>' : '          ') +
      (hasTulip ? '<tulipPeach>  |  |  |  |   </tulipPeach>' : '                ')
    );
    lines.push(
      (hasDaisy ? '<white>   ( / /<daisyCenter>(*)</daisyCenter>\\ \\ )   </white>' : '                   ') +
      (hasLily ? '<lilyPetal>  (   \\_\\/_/   )</lilyPetal>' : '          ') +
      (hasTulip ? '<tulipPink>   \\  \\  /  /   </tulipPink>' : '                ')
    );
    lines.push(
      (hasDaisy ? '<white>    ~ / ( ) \\ ~    </white>' : '                   ') +
      (hasLily ? '<lilyPetal>   `-./ || \\.-` </lilyPetal>' : '          ') +
      (hasTulip ? '<tulipPeach>    `----\'     </tulipPeach>' : '                ')
    );
  }

  // 4. Accent & Baby's Breath fillers
  lines.push(
    '<forgetmenot>   * . </forgetmenot><leaf>\\~--._</leaf><stem>||</stem><leaf>_.--~/</leaf><orchid> ° ｡ </orchid><leaf>\\~--._</leaf><stem>||</stem><leaf>_.--~/</leaf><forgetmenot> . *   </forgetmenot>'
  );
  lines.push(
    '<leaf>    \\__  \\\\//  __//     \\\\__  \\\\//  __//     </leaf>'
  );

  // 5. Gathered Stems heading into Wrapper
  lines.push(
    '<stem>       \\  \\\\ || //  /       \\  \\\\ || //  /        </stem>'
  );
  lines.push(
    '<stem>         \\  \\\\||//  /         \\  \\\\||//  /         </stem>'
  );
  lines.push(
    '<stem>           \\ \\||/ /             \\ \\||/ /           </stem>'
  );
  lines.push(
    '<stem>             \\||/                 \\||/             </stem>'
  );
  lines.push(
    '<stem>              ||                   ||              </stem>'
  );

  // 6. Bouquet Wrapper (Top & Bottom)
  for (const wLine of wrapper.asciiWrapTop) {
    // Center it cleanly
    lines.push('          ' + wLine);
  }
  for (const wLine of wrapper.asciiWrapBottom) {
    lines.push('          ' + wLine);
  }

  // 7. Base ground / dropped petals
  lines.push(
    '<sparkle>    .  *  ｡  </sparkle><heart>♥</heart><sparkle>  °  *  ｡  °  *  ｡  °  *  ｡  °  *  ｡  </sparkle><heart>♥</heart><sparkle>  *  .  </sparkle>'
  );
  lines.push(
    '<dim>   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   </dim>'
  );

  // 8. Dedication Plaque
  const nameLine = `       🌸 For the most beautiful: ${config.recipientName.toUpperCase()} 🌸       `;
  const messageLine = `  "${config.customMessage}"  `;
  const loveLine = `       ✨ With all my love, ${config.senderName} (2026) ✨       `;

  const borderLen = Math.max(nameLine.length, messageLine.length, loveLine.length, 48);
  const border = '═'.repeat(borderLen);

  lines.push(`<ribbon>   ╔${border}╗   </ribbon>`);
  lines.push(`<ribbon>   ║${nameLine.padStart((borderLen + nameLine.length) / 2).padEnd(borderLen)}║   </ribbon>`);
  lines.push(`<ribbon>   ║${messageLine.padStart((borderLen + messageLine.length) / 2).padEnd(borderLen)}║   </ribbon>`);
  lines.push(`<ribbon>   ║${loveLine.padStart((borderLen + loveLine.length) / 2).padEnd(borderLen)}║   </ribbon>`);
  lines.push(`<ribbon>   ╚${border}╝   </ribbon>`);

  const plainText = lines
    .map((l) => l.replace(/<\/?[#a-zA-Z0-9_-]+>/g, ''))
    .join('\n');

  const flowerListText = activeFlowers
    .map((item) => `${item.count}x ${item.flower.name}`)
    .join(', ');

  return {
    lines,
    plainText,
    totalFlowers,
    flowerListText,
  };
}
