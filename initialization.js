Hooks.on("init", () => {
  game.wfrp4e.config.runeCategories = {
    weapon: "WFRP4E.RuneCategory.Weapon",
    armour: "WFRP4E.RuneCategory.Armour",
    talisman: "WFRP4E.RuneCategory.Talisman",
    protection: "WFRP4E.RuneCategory.Protection",
    engineering: "WFRP4E.RuneCategory.Engineering"
  }

  const config = {

    weaponQualities: {
      salvo: game.i18n.localize("PROPERTY.Salvo"),
      spread: game.i18n.localize("PROPERTY.Spread")
    },

    weaponFlaws: {
      crewed: game.i18n.localize("PROPERTY.Crewed")
    },


    qualityDescriptions: {
      spread: game.i18n.localize("WFRP4E.Properties.Spread"),
      salvo: game.i18n.localize("WFRP4E.Properties.Salvo")
    },

    flawDescriptions: {
      crewed: game.i18n.localize("WFRP4E.Properties.Crewed")
    },


    propertyHasValue: {
      salvo: true,
      spread: true,
      crewed: true
    }
  }

  mergeObject(game.wfrp4e.config, config)

})
