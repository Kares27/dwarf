Hooks.once("init", () => {

  game.wfrp4e.utility.mergeCareerReplacements({
    "dwarf": {
      "Boatman": ["Officer"],
      "Coachman": ["Trailblazer"],
      "Lawyer": ["Interpreter"],
      "Noble": ["Thane"],
      "Pedlar": ["Survivalist"],
      "Riverwoman": ["Sailor"],
      "Scholar": ["Runescribe"],
      "Seaman": ["Sailor"],
      "Smuggler": ["Ship's Gunner"],
      "Stevedore": ["Ship's Gunner"]
    },
  })

  const config = {
    armorTypes: {},
    subspecies: {
      dwarf: {}
    }
  };

  config.armorTypes = {
    "gromril": "WFRP4E.ArmourType.Gromril"
  };


  config.subspecies.dwarf['karaz-a-karak'] = {
    name: "Karaz-a-Karak",
    careerTable: "dwarf-karazakarak",
    skills: [
      "Consume Alcohol",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Language (Khazalid)",
      "Leadership",
      "Lore (Dwarfs)",
      "Lore (Geology)",
      "Lore (Metallurgy)",
      "Melee (Basic)",
      "Trade (Any One)"
    ],
    talents: [
      "Ancestral Grudge, Resolute",
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Relentless",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['barak-varr'] = {
    name: "Barak Varr",
    careerTable: "dwarf-barakvarr",
    skills: [
      "Consume Alcohol",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Haggle",
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Melee (Basic)",
      "Navigation",
      "Sail",
      "Trade (Any One)"
    ],
    talents: [
      "Dealmaker, Strong-minded",
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Resolute",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['karak-azul'] = {
    name: "Karak Azul",
    careerTable: "dwarf-karakazul",
    skills: [
      "Climb",
      "Consume Alcohol",
      "Cool",
      "Endurance",
      "Evaluate",
      "Haggle",
      "Intimidate",
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Lore (Metallurgy)",
      "Melee (Basic)",
      "Trade (Any One)"
    ],
    talents: [
      "Hatred (Orcs and Goblins), Resolute",
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Relentless",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['karak-eight-peaks'] = {
    name: "Karak Eight Peaks",
    careerTable: "dwarf-karakeightpeaks",
    skills: [
      "Consume Alcohol",
      "Cool",
      "Endurance",
      "Evaluate",
      "Intuition", ,
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Lore (Geology)",
      "Lore (Warfare)",
      "Melee (Basic)",
      "Set Trap",
      "Trade (Any One)"
    ],
    talents: [
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Resolute",
      "Strong-minded, Tenacious",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['karak-kadrin'] = {
    name: "Karak Kadrin",
    careerTable: "dwarf-karakkadrin",
    skills: [
      "Consume Alcohol",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Gamble",
      "Intimidate",
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Lore (Metallurgy)",
      "Melee (Basic)",
      "Trade (Any One)"
    ],
    talents: [
      "Iron Jaw, Read/Write",
      "Magic Resistance",
      "Night Vision",
      "Resolute, Strong-minded",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['zhufbar'] = {
    name: "Zhufbar",
    careerTable: "dwarf-zhufbar",
    skills: [
      "Consume Alcohol",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Lore (Engineering)",
      "Lore (Geology)",
      "Lore (Metallurgy)",
      "Melee (Basic)",
      "Trade (Any One)"
    ],
    talents: [
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Relentless",
      "Strong-minded, Tinker",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['karak-hirn'] = {
    name: "Karak Hirn / Black Mountains",
    careerTable: "dwarf-karakhirn",
    skills: [
      "Consume Alcohol",
      "Climb",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Haggle",
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Melee (Basic)",
      "Play (Horn)",
      "Trade (Any One)"
    ],
    talents: [
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Relentless",
      "Scale Sheer Surface, Strong-minded",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['karak-izor'] = {
    name: "Karak Izor / The Vaults",
    careerTable: "dwarf-karakizor",
    skills: [
      "Consume Alcohol",
      "Climb",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Lore (Geology)",
      "Melee (Basic)",
      "Outdoor Survival",
      "Trade (Any One)"
    ],
    talents: [
      "Enclosed Fighter, Resolute",
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Relentless",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['karak-norn'] = {
    name: "Karak Norn / Grey Mountains",
    careerTable: "dwarf-karaknorn",
    skills: [
      "Consume Alcohol",
      "Climb",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Melee (Basic)",
      "Perception",
      "Ranged (Crossbow)",
      "Trade (Any One)"
    ],
    talents: [
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Relentless",
      "Resolute, Stone Soup",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['norse'] = {
    name: "Norse",
    careerTable: "dwarf-norse",
    skills: [
      "Climb",
      "Consume Alcohol",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Language (Khazalid)",
      "Language (Norse)",
      "Lore (Dwarfs)",
      "Melee (Basic)",
      "Sail",
      "Trade (Any)"
    ],
    talents: [
      "Carouser, Strong-minded",
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Relentless",
      "Sturdy"
    ]
  }

  config.subspecies.dwarf['imperial'] = {
    name: "Imperial",
    careerTable: "dwarf-imperial",
    skills: [
      "Consume Alcohol",
      "Cool",
      "Endurance",
      "Entertain (Storytelling)",
      "Evaluate",
      "Intimidate",
      "Language (Khazalid)",
      "Lore (Dwarfs)",
      "Lore (Geology)",
      "Lore (Metallurgy)",
      "Melee (Basic)",
      "Trade (Any)"
    ],
    talents: [
      "Magic Resistance",
      "Night Vision",
      "Read/Write, Relentless",
      "Resolute, Strong-minded",
      "Sturdy"
    ]
  }

  game.wfrp4e.config = foundry.utils.mergeObject(game.wfrp4e.config, config);

});