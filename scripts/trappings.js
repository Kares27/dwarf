Hooks.on("wfrp4e:chargen", chargen => {
  chargen.replaceStage("trappings", DwarfTrappingStage);
})

class DwarfTrappingStage extends TrappingStage {

  static replacements = [
    {
      check : function(item, index) {
        return item.uuid == "Compendium.wfrp4e-core.items.Item.1zaqojk0Oq1m8vYv";
      },
      choices : [
        {
          label : "Dwarf Axe",
          items : ["Compendium.wfrp4e-dwarfs.items.Item.dxn0JtxbWLAMcV99"]
        },
        {
          label : "Dwarf Warhammer",
          items : ["Compendium.wfrp4e-dwarfs.items.Item.f7AI29ksD87aFXfh"]
        }
      ]
    },
    {
      check : function(item, index) {
        return ["cavalry", "fencing", "parry"].includes(item.system?.weaponGroup?.value);
      },
      choices : [
        {
          label : "Shield",
          items : ["Compendium.wfrp4e-core.items.Item.8nJ9R8tbhW42VGhr"]
        },
        {
          label : "Pistol with ammunition",
          items : ["Compendium.wfrp4e-dwarfs.items.Item.5RS4dmtb4SYoKZ0E", "Compendium.wfrp4e-dwarfs.items.Item.bvJL31FelbHIkEkp"],
          replaceSkill : "Ranged (Blackpowder)"
        }
      ]
    },
    {
      check : function(item, index) {
        return ["bow"].includes(item.system?.weaponGroup?.value);
      },
      choices : [
        {
          label : "Dwarf Crossbow with ammunition",
          items : ["Compendium.wfrp4e-dwarfs.items.Item.8wCg3QQHrJIIl6tV", "Compendium.wfrp4e-dwarfs.items.Item.15PJyMHFR97mlQlm"],
          replaceSkill : "Ranged (Crossbow)"

        },
        {
          label : "Dwarf Handgun with Ammunition",
          items : ["Compendium.wfrp4e-dwarfs.items.Item.8US82tSA79TeANeN", "Compendium.wfrp4e-dwarfs.items.Item.bvJL31FelbHIkEkp"],
          replaceSkill : "Ranged (Blackpowder)"
        }
      ]
    },
    {
      check : function(item, index) {
        return item.name.toLowerCase().includes("riding horse") || item.name.toLowerCase().includes("warhorse")
      },
      choices : [
        {
          label : "Full Plate Armour and Helm",
          items : ["Compendium.wfrp4e-core.items.Item.oW7wSkl4JMb5sBH8", "Compendium.wfrp4e-core.items.Item.oBNXxRFPh1sOT4K2", "Compendium.wfrp4e-core.items.Item.bY6M9XxbqmFmqpA8", "Compendium.wfrp4e-core.items.Item.TvUKzvXjc2VChuTT"]
        }
      ]
    }
  ]

  toRemove = [];
  toAdd = [];
  skillsToReplace = {}

  async getItems()
  {
    let items = await super.getItems();

    if (this.data.species != "dwarf")
    {
      return items;
    }

    try 
    {
      for(let [index, item] of items.entries())
      {
        for(let replace of this.constructor.replacements)
        {
          if (this.data.items.career.system.trappings.includes(item.name) && replace.check(item, index))
          {
            await this.promptChoice(replace.choices, item, index);
          }
        }
      }

      return items.filter((_, index) => !this.toRemove.includes(index)).concat(this.toAdd);
    }
    catch(e)
    {
      ui.notifications.error("Error replacing Dwarf trappings, see console");
      console.error(e);
      return items;
    }

  }

  async promptChoice(choices, item, index)
  {
    let choiceNum = await foundry.applications.api.Dialog.wait({
      window: {title : "Dwarf Trapping Replacements"},
      content: `
      <p>Replace ${item.name}?</p>
      ${choices.map((choice, index) => `<label><input type="radio" name="choice" value="${index+1}">${choice.label}</label>`).join("")}
      `,
     buttons: [
      {
        action: "choice",
        label: "Replace",
        callback: (event, button, dialog) => button.form.elements.choice.value
      }, 
      {
        action: "cancel",
        label: "Cancel"
      }],
    })

    let choice = choices[choiceNum - 1];

    if (choice)
    {
      let career = this.data.items.career;

      let newItems = await Promise.all(choice.items.map(fromUuid));

      this.updateMessage("ReplacedTrappings", { item: item.name, replacement : choice.label })
      this.toRemove.push(index);
      this.toAdd = this.toAdd.concat(newItems);

      // Replace the career's trappings as well

      let replacedItemIndex = career.system.trappings.findIndex(i => i == item.name);

      // If replaced a required trapping, insert the new items into the previously required trapping index, otherwise, add to the end of the career's trapping list
      if (replacedItemIndex >= 0)
      {
        let requiredIndex = career.system.requiredTrappings.findIndex(i => i == replacedItemIndex) 
        if (requiredIndex >= 0)
        {
          // Manually mark required trapping as owned if choice label doesn't match  item name
          if (newItems.length > 1 || choice.label != newItems[0].name)
          {
            career.system.trappingsOwned.push(requiredIndex);
          }
        }
        career.system.trappings[replacedItemIndex] = choice.label
      }
      else 
      {
        career.system.trappings.push(choice.label);
      }

      let replaceSkill = choice.replaceSkill;
      if (replaceSkill && item.type == "weapon" && item.system.weaponGroup.value != "basic")
      {
        let itemSkill = (item.system.isMelee ? "Melee" : "Ranged") + ` (${game.wfrp4e.config.weaponGroups[item.system.weaponGroup.value]})`
        if (this.data.skillAdvances[itemSkill])
        {
          ui.notifications.notify(`Replacing ${itemSkill} with ${replaceSkill}`)
          // Replace advances to old skill onto new
          this.data.skillAdvances[replaceSkill] = this.data.skillAdvances[itemSkill];
          delete this.data.skillAdvances[itemSkill];

          // Replace the skill in the chosen career
          career.system.skills = career.system.skills.filter(i => i != itemSkill).concat(replaceSkill);
        }
      }
    }
  }
}
