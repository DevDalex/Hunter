const portraitMediaByName = new Map([
  ['Kite', 'media:chimera-ant:kite-phase'],
  ['Meruem', 'media:chimera-ant:meruem-phase'],
  ['Komugi', 'media:chimera-ant:komugi-phase'],
  ['Isaac Netero', 'media:chimera-ant:netero-phase'],
  ['Netero', 'media:chimera-ant:netero-phase'],
  ['Gon Freecss', 'media:chimera-ant:gon-phase'],
  ['Gon', 'media:chimera-ant:gon-phase'],
  ['Killua Zoldyck', 'media:chimera-ant:killua'],
  ['Killua', 'media:chimera-ant:killua'],
  ['Neferpitou', 'media:chimera-ant:neferpitou'],
  ['Pitou', 'media:chimera-ant:neferpitou'],
  ['Shaiapouf', 'media:chimera-ant:shaiapouf'],
  ['Pouf', 'media:chimera-ant:shaiapouf'],
  ['Menthuthuyoupi', 'media:chimera-ant:menthuthuyoupi'],
  ['Youpi', 'media:chimera-ant:menthuthuyoupi'],
  ['Morel Mackernasey', 'media:chimera-ant:morel'],
  ['Morel', 'media:chimera-ant:morel'],
  ['Knov', 'media:chimera-ant:knov'],
  ['Knuckle Bine', 'media:chimera-ant:knuckle'],
  ['Knuckle', 'media:chimera-ant:knuckle'],
  ['Shoot McMahon', 'media:chimera-ant:shoot'],
  ['Shoot', 'media:chimera-ant:shoot'],
  ['Zeno Zoldyck', 'media:chimera-ant:zeno'],
  ['Zeno', 'media:chimera-ant:zeno'],
]);

/** @param {string | null | undefined} name */
export const chimeraPortraitMediaId = (name) => (name ? portraitMediaByName.get(name) : undefined);

export const chimeraManagedPortraitNames = Object.freeze([...portraitMediaByName.keys()]);
